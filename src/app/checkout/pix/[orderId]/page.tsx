import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { PixPayment } from "@/components/checkout/PixPayment";
import { SHIPPING, type ShippingMode } from "@/lib/constants";
import { buildCheckoutHref } from "@/lib/campaignParams";

export default async function PixCheckoutPage({
  params,
  searchParams,
}: {
  params: Promise<{ orderId: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const unwrappedParams = await params;
  const unwrappedSearchParams = await searchParams;
  const orderId = unwrappedParams.orderId;

  if (!orderId) {
    redirect("/");
  }

  // Busca pedido no banco de dados
  const order = await prisma.order.findUnique({
    where: { id: orderId }
  });

  if (!order) {
    redirect("/");
  }

  // Se já foi pago, redirecionar para a confirmação
  if (order.status === "PAID") {
    redirect(`/checkout/confirmacao/${order.id}`);
  }

  const { pixCopyPaste, pixExpiresAt, offerSource, shippingMode } = order;
  const normalizedShippingMode: ShippingMode = shippingMode === "express" ? "express" : "free";
  const shippingDeadline = SHIPPING[normalizedShippingMode].days;
  const initialStatus: "PENDING" | "EXPIRED" | "ERROR" =
    order.status === "EXPIRED" || order.status === "ERROR" ? order.status : "PENDING";
  const retrySearchParams = new URLSearchParams();

  Object.entries(unwrappedSearchParams).forEach(([key, value]) => {
    if (typeof value === "string") {
      retrySearchParams.set(key, value);
    } else if (Array.isArray(value) && value[0]) {
      retrySearchParams.set(key, value[0]);
    }
  });

  const retryHref = buildCheckoutHref(offerSource || "evergreen", retrySearchParams);

  // Em caso de corrupção de sincronia, onde a API não retornou copy-paste 
  if (!pixCopyPaste || !pixExpiresAt) {
    return (
      <div className="min-h-screen bg-[var(--color-bg)] py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="bg-[var(--color-surface)] rounded-xl shadow-sm border border-[var(--color-border)] p-8 text-center max-w-sm w-full mx-auto">
          <div className="w-16 h-16 bg-[var(--color-primary-highlight)] rounded-full flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[var(--color-error)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-[var(--color-text)] mb-2">Não foi possível gerar seu PIX.</h2>
          <p className="text-sm text-[var(--color-text-muted)] mb-6 font-medium">Revise os dados e tente novamente.</p>
          <a href={retryHref} className="block w-full bg-[var(--color-primary)] text-[var(--color-text-inverse)] font-bold py-3 rounded-lg hover:bg-[var(--color-primary-hover)] transition-colors">
            TENTAR NOVAMENTE
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg)] py-12 px-4 sm:px-6 lg:px-8">
      {/* Client Component handle as rendering, analytics, and PIX mechanisms */}
      <PixPayment
        orderId={order.id}
        pixCopyPaste={pixCopyPaste}
        pixExpiresAt={pixExpiresAt}
        amountCents={order.amountCents}
        offerSource={offerSource}
        shippingDeadline={shippingDeadline}
        initialStatus={initialStatus}
        isAlreadyExpired={false}
      />
    </div>
  );
}
