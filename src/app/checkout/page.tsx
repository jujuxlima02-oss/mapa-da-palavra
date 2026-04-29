import { redirect } from "next/navigation";
import Image from "next/image";
import { VALID_OFFER_SOURCES } from "@/lib/constants";
import { CheckoutClient } from "@/components/checkout/CheckoutClient";
import { CheckoutCountdownBar } from "@/components/checkout/CheckoutCountdownBar";

import { Lock } from "lucide-react";

export default async function CheckoutPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const params = await searchParams;
  const offer = typeof params.offer === "string" ? params.offer : "";

  // Se a offer estiver ausente ou inválida, redireciona para a home
  if (!VALID_OFFER_SOURCES.includes(offer)) {
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      <CheckoutCountdownBar useDynamicDate={offer === "evergreen"} />
      <div className="px-4 py-8 flex justify-center">
      <div className="w-full max-w-[600px] lg:max-w-[680px]">
        
        {/* Header Compacto */}
        <div className="flex flex-col items-center justify-center mb-6">
          <div className="mb-5 w-full overflow-hidden rounded-xl border border-[var(--color-border)] shadow-sm">
            <Image
              src="/assets/banner-checkout.jpeg"
              alt="Banner Mapa da Palavra"
              width={2752}
              height={1536}
              sizes="(max-width: 768px) 100vw, 680px"
              className="w-full h-auto object-contain"
              priority
            />
          </div>
          <h1 className="text-2xl font-black tracking-tighter text-[var(--color-text)]">
            {offer === "dia-das-maes" ? "Um presente que ela vai usar todo dia." : "Seu diário de fé está esperando por você"}
          </h1>
          <div className="flex items-center gap-1.5 mt-2 justify-center text-[var(--color-success)] bg-[var(--color-primary-highlight)] px-3 py-1 rounded-full text-xs font-semibold border border-[var(--color-border)]">
            <Lock className="w-3.5 h-3.5" />
            <span>Pagamento seguro</span>
          </div>
        </div>
        
        {/* Central Card */}
        <div className="bg-[var(--color-surface-2)] rounded-lg border border-[var(--color-border)] overflow-hidden">
          <CheckoutClient offerSource={offer} />
        </div>

      </div>
      </div>
    </div>
  );
}
