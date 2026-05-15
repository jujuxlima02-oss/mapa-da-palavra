import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getTransaction, normalizeWebhookPayload } from "@/lib/gestaopay";
import type { GestaoPayWebhookPayload } from "@/types/gestaopay";

export async function POST(request: Request) {
  try {
    const rawBody = await request.text();
    
    let payload: GestaoPayWebhookPayload;
    try {
      payload = JSON.parse(rawBody) as GestaoPayWebhookPayload;
    } catch {
      console.warn("[Webhook GestãoPay] JSON inválido recebido. Corpo omitido para proteger dados pessoais.");
      return NextResponse.json({ message: "OK" }, { status: 200 }); // Sempre retornar 200
    }

    console.log("[Webhook GestãoPay] Evento recebido.", {
      gatewayId: payload.Id,
      status: payload.Status,
    });

    if (!payload.Id) {
      console.warn("[Webhook GestãoPay] Payload sem campo Id detectado. Parando processamento.");
      return NextResponse.json({ message: "OK" }, { status: 200 });
    }

    const webhookData = normalizeWebhookPayload(payload);

    // 3. Buscar Order no Prisma
    const order = await prisma.order.findFirst({
      where: { gatewayId: webhookData.gatewayId }
    });

    if (!order) {
      console.warn(`[Webhook GestãoPay] Pedido com gatewayId ${webhookData.gatewayId} não encontrado no banco.`);
      return NextResponse.json({ message: "OK" }, { status: 200 });
    }

    // 5. Idempotência
    if (
      order.status === "PAID" ||
      order.status === "EXPIRED" ||
      order.status === "ERROR"
    ) {
      console.log(`[Webhook GestãoPay] Pedido ${order.id} já possui status conclusivo (${order.status}). Ignorando.`);
      return NextResponse.json({ ok: true }, { status: 200 });
    }

    // 6. Double-check na API oficial
    try {
      const remoteTx = await getTransaction(webhookData.gatewayId);
      const remoteStatus = remoteTx.data.status;
      
      // 7. Efetivar estado
      if (remoteStatus === "PAID") {
        await prisma.order.update({
          where: { id: order.id },
          data: {
            status: "PAID",
            paidAt: new Date()
          }
        });
        console.log(`[Webhook GestãoPay] Pedido ${order.id} validado e marcado como PAID com sucesso.`);
      } else if (remoteStatus === "REFUSED") {
        await prisma.order.update({
          where: { id: order.id },
          data: {
            status: "ERROR",
          }
        });
        console.log(`[Webhook GestãoPay] Pedido ${order.id} encerrado como ERROR após status REFUSED.`);
      } else if (remoteStatus === "EXPIRED") {
        await prisma.order.update({
          where: { id: order.id },
          data: {
            status: "EXPIRED",
          }
        });
        console.log(`[Webhook GestãoPay] Pedido ${order.id} encerrado como EXPIRED.`);
      } else {
        console.log(`[Webhook GestãoPay] Status remoto ${remoteStatus} não altera o pedido ${order.id}.`);
      }

    } catch (checkErr) {
      const message = checkErr instanceof Error ? checkErr.message : "Erro desconhecido";
      console.error("[Webhook GestãoPay] Erro crítico ao fazer double-check.", {
        gatewayId: webhookData.gatewayId,
        message,
      });
      // Evitar crash da ponta e retentativas exaustivas no gateway se ele estiver intermitente
    }

    // 8. Resposta estanque HTTP 200 (se cair 5xx eles re-enviam ad eternum)
    return NextResponse.json({ message: "OK" }, { status: 200 });

  } catch (err) {
    const message = err instanceof Error ? err.message : "Erro desconhecido";
    console.error("[Webhook GestãoPay] Falha irrecuperável na rota do Webhook.", { message });
    return NextResponse.json({ message: "OK" }, { status: 200 });
  }
}
