import { redirect } from "next/navigation";
import Image from "next/image";
import type { Metadata } from "next";
import { PRODUCT, VALID_OFFER_SOURCES } from "@/lib/constants";
import { CheckoutClient } from "@/components/checkout/CheckoutClient";
import { CheckoutCountdownBar } from "@/components/checkout/CheckoutCountdownBar";

import { Lock } from "lucide-react";

export const metadata: Metadata = {
  title: "Finalizar pedido — Mapa da Palavra",
  description: "Complete seu pedido e garanta sua jornada diária com a Palavra de Deus.",
};

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
          <a
            href="#checkout-form"
            className="mb-4 inline-flex min-h-11 w-full items-center justify-center rounded-lg bg-[#16a34a] px-5 py-3 text-sm font-bold uppercase tracking-wide text-white transition-colors hover:bg-green-700 sm:hidden"
          >
            Ir para pagamento
          </a>
          <div className="mb-5 w-full overflow-hidden rounded-xl border border-[var(--color-border)] shadow-sm">
            <Image
              src="/assets/banner-checkout.webp"
              alt={`Banner ${PRODUCT.name}`}
              width={2752}
              height={1536}
              sizes="(max-width: 768px) 100vw, 680px"
              className="w-full h-auto object-contain"
              quality={75}
              priority
            />
          </div>
          <h1 className="text-2xl font-black tracking-tighter text-[var(--color-text)]">
            Você está a um passo de começar sua jornada com a Palavra.
          </h1>
          <div className="flex items-center gap-1.5 mt-2 justify-center text-[var(--color-success)] bg-[var(--color-primary-highlight)] px-3 py-1 rounded-full text-xs font-semibold border border-[var(--color-border)]">
            <Lock className="w-3.5 h-3.5" />
            <span>Pagamento seguro</span>
          </div>
        </div>
        
        {/* Central Card */}
        <div id="checkout-form" className="scroll-mt-16 bg-[var(--color-surface-2)] rounded-lg border border-[var(--color-border)] overflow-hidden">
          <CheckoutClient offerSource={offer} />
        </div>

      </div>
      </div>
    </div>
  );
}
