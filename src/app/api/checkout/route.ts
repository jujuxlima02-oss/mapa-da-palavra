import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { 
  validateCheckoutForm, 
  cleanCPF, 
  cleanPhone,
  cleanCEP,
} from "@/lib/validations";
import { createPixTransaction } from "@/lib/gestaopay";
import { PRODUCT, VALID_OFFER_SOURCES } from "@/lib/constants";
import type { GestaoPayCreatePayload } from "@/types/gestaopay";

export async function POST(request: Request) {
  // Força Content-Type JSON em todas as respostas
  const headers = { "Content-Type": "application/json" };

  try {
    const body = await request.json();
    
    // 2. Validação dos campos server-side
    const errors = validateCheckoutForm({
      name: body.name || "",
      email: body.email || "",
      phone: body.phone || "",
      cpf: body.cpf || "",
      cep: body.cep || "",
      rua: body.rua || "",
      numero: body.numero || "",
      complemento: body.complemento || "",
      cidade: body.cidade || "",
      estado: body.estado || "",
    });

    if (!body.offerSource || !VALID_OFFER_SOURCES.includes(body.offerSource)) {
      errors.offerSource = "Oferta inválida ou ausente";
    }

    // Retorna HTTP 400 se houver erros de validação
    if (Object.keys(errors).length > 0) {
      return NextResponse.json({ errors }, { status: 400, headers });
    }

    const { name, email, phone, cpf, offerSource, cep, rua, numero, complemento, cidade, estado, shippingMode, shippingPrice } = body;
    const documentClean = cleanCPF(cpf);
    const phoneClean = cleanPhone(phone);
    const cepClean = cleanCEP(cep);

    // 3. Criar registro Order no Prisma com status PENDING
    // Isso garante que temos a persistência de qual cliente tentou comprar e sua intenção
    const order = await prisma.order.create({
      data: {
        customerName: name,
        customerEmail: email,
        customerPhone: phoneClean,
        customerCpf: documentClean,
        productName: PRODUCT.name,
        amountCents: PRODUCT.priceCents,
        offerSource: offerSource,
        shippingMode: shippingMode === "express" ? "express" : "free",
        shippingPrice: Number.isFinite(Number(shippingPrice)) ? Number(shippingPrice) : 0,
        status: "PENDING",
        cep: cepClean,
        rua,
        numero,
        complemento: complemento || null,
        cidade,
        estado,
      }
    });

    // 4. Integrar com GestãoPay e Atualizar o Banco
    try {
      const baseUrl = process.env.BASE_URL || "http://localhost:3000";
      const postbackUrl = `${baseUrl}/api/webhooks/gestaopay`;

      const gestaoPayPayload: GestaoPayCreatePayload = {
        amount: PRODUCT.priceCents, // 3990
        payment_method: "pix",
        postback_url: postbackUrl,
        customer: {
          name,
          email,
          phone: phoneClean,
          document: {
            number: documentClean,
            type: "cpf",
          }
        },
        items: [
          {
            title: PRODUCT.name,
            unit_price: PRODUCT.priceCents,
            quantity: 1,
            tangible: true,
            external_ref: order.id,
          }
        ],
        pix: {
          expires_in_days: PRODUCT.pixExpiresInDays,
        },
        metadata: {
          provider_name: "Saints Label",
          offer_source: offerSource,
          order_id: order.id,
        },
        shipping: {
          fee: 0,
          address: {
            street: rua,
            number: numero,
            complement: complemento || "",
            city: cidade,
            state: estado,
            zip_code: cepClean,
          },
        },
      };

      const gestaoPayResponse = await createPixTransaction(gestaoPayPayload);

      // A API retorna a validade como date zero em pix.expiration_date, logo a gente mesmo soma baseado no que foi pedido
      const pixExpiresAt = new Date();
      pixExpiresAt.setDate(pixExpiresAt.getDate() + PRODUCT.pixExpiresInDays);

      // 5. Atualizar Order com dados reais para o PIX
      await prisma.order.update({
        where: { id: order.id },
        data: {
          gatewayId: gestaoPayResponse.data.id,
          pixCopyPaste: gestaoPayResponse.data.pix.qr_code,
          pixQrCode: null, // Como especificado, GestãoPay retorna url: null. Vamos renderizar no Front as string de pixCopyPaste!
          pixExpiresAt,
        }
      });

      // 6. Retorno de SUCESSO!
      return NextResponse.json({ orderId: order.id }, { status: 201, headers });

    } catch (gestaoPayError) {
      console.error("[Checkout API] Falha na GestãoPay:", gestaoPayError);

      // Atualiza o pedido alertando que a tentativa de gateway falou
      await prisma.order.update({
        where: { id: order.id },
        data: {
          status: "ERROR",
        }
      });

      // Erro genérico para o end-user a fim de não desvendar mecanismos secretos da rede HTTP da Vercel
      return NextResponse.json(
        { message: "Serviço de pagamentos indisponível. Tente novamente em instantes." },
        { status: 500, headers }
      );
    }

  } catch (err) {
    console.error("[Checkout API] Falha Global Severa:", err);
    // Dispara 500 caso o request.json() ou falha no try-block geral de erro fatal ocorra!
    return NextResponse.json(
      { message: "Erro interno do servidor." },
      { status: 500, headers }
    );
  }
}
