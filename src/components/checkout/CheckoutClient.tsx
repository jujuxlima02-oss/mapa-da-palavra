"use client";

import { useState } from "react";
import { CheckoutForm } from "@/components/checkout/CheckoutForm";
import { OrderSummary } from "@/components/checkout/OrderSummary";
import { SHIPPING, type ShippingMode } from "@/lib/constants";

interface CheckoutClientProps {
  offerSource: string;
}

export function CheckoutClient({ offerSource }: CheckoutClientProps) {
  const [shippingMode, setShippingMode] = useState<ShippingMode>(SHIPPING.activeOffer);

  return (
    <>
      <div className="bg-[var(--color-surface)] border-b border-[var(--color-divider)] px-8 py-5">
        <OrderSummary shippingMode={shippingMode} />
      </div>
      <div className="px-8 py-6 pb-8">
        <CheckoutForm
          offerSource={offerSource}
          shippingMode={shippingMode}
          onShippingModeChange={setShippingMode}
        />
      </div>
    </>
  );
}
