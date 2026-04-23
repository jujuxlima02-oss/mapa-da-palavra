import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Confirmation } from "@/components/checkout/Confirmation";
import { SHIPPING, type ShippingMode } from "@/lib/constants";

export default async function ConfirmationPage({
  params,
}: {
  params: Promise<{ orderId: string }>
}) {
  const unwrappedParams = await params;
  const orderId = unwrappedParams.orderId;

  if (!orderId) {
    redirect("/");
  }

  // 1. Busca Pedido
  const order = await prisma.order.findUnique({
    where: { id: orderId }
  });

  if (!order) {
    redirect("/");
  }

  // 3. Travar visualização para curiosos que não pagaram a conta ainda
  if (order.status !== "PAID") {
    redirect(`/checkout/pix/${order.id}`); // Manda de volta pra pagar!
  }

  const shippingMode: ShippingMode = order.shippingMode === "express" ? "express" : "free";
  const shippingDeadline = SHIPPING[shippingMode].days;

  return (
    <div className="min-h-screen bg-[var(--color-bg)] py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      {/* 4. Client Component (Maneja Confetes, React e Purchase Analytics GA4) */}
      <Confirmation
        orderId={order.id}
        customerName={order.customerName}
        productName={order.productName}
        amountCents={order.amountCents}
        paidAt={order.paidAt || new Date()} /* Fallback seguro */
        offerSource={order.offerSource || "evergreen"}
        shippingDeadline={shippingDeadline}
      />
    </div>
  );
}
