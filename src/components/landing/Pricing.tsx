"use client";

import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { useRouter } from "next/navigation";
import { PRODUCT, OfferSource } from "@/lib/constants";
import { analytics } from "@/lib/analytics";
import evergreenPricingImage from "../../../imagens_produto/06_700x.webp";
import mothersPricingImage from "../../../imagens_produto/Untitled_design_700x.webp";

interface PricingProps {
  label: string;
  texts: string[];
  buttonText: string;
  cepPlaceholder: string;
  offerSource: OfferSource;
}

export function Pricing({
  label,
  texts,
  buttonText,
  offerSource,
}: PricingProps) {
  const router = useRouter();
  const pricingImage =
    offerSource === "dia-das-maes" ? mothersPricingImage : evergreenPricingImage;

  const handleCheckout = (e?: React.FormEvent) => {
    e?.preventDefault();
    analytics.ctaClick(offerSource, "pricing_section");
    router.push(`/checkout?offer=${offerSource}`);
  };

  return (
    <section className="py-24 bg-[var(--color-bg)]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl bg-[var(--color-surface-2)] rounded-3xl shadow-xl ring-1 ring-[var(--color-border)] overflow-hidden lg:flex">
          <div className="p-8 sm:p-10 lg:flex-auto">
            <div className="relative mb-6 overflow-hidden rounded-2xl bg-[var(--color-surface)] shadow-sm ring-1 ring-[var(--color-border)] aspect-[16/9]">
              {/* TODO: substituir por asset final do Nanobanana — Briefing 5: Pricing evergreen // PLACEHOLDER */}
              <Image
                src={pricingImage}
                alt="Capa limpa do guia Mapa da Palavra em apresentação de preço e compra"
                width={700}
                height={525}
                sizes="(max-width: 1024px) 100vw, 50vw"
                style={{ aspectRatio: "4 / 3" }}
                className="object-contain p-4"
              />
            </div>
            <h3 className="text-2xl font-bold tracking-tight text-[var(--color-text)]">{label}</h3>
            <div className="mt-6 text-base leading-7 text-[var(--color-text-muted)] space-y-4">
              {texts.map((text, i) => {
                if (text.startsWith("•") || text.startsWith("-")) {
                  return (
                    <div key={i} className="flex gap-3">
                       <span className="text-[var(--color-accent)] font-bold">•</span>
                       <span>{text.substring(1).trim()}</span>
                    </div>
                  )
                }
                return <p key={i}>{text}</p>
              })}
            </div>
            
          </div>
          <div className="-mt-2 p-2 lg:mt-0 lg:w-full lg:max-w-md lg:shrink-0">
            <div className="rounded-2xl bg-[var(--color-surface)] py-10 text-center ring-1 ring-inset ring-[var(--color-border)] lg:flex lg:flex-col lg:justify-center lg:py-16 h-full">
              <div className="mx-auto max-w-xs px-8">
                <p className="text-base font-semibold text-[var(--color-text-muted)]">Separar tempo com Deus</p>
                <p className="mt-6 flex items-baseline justify-center gap-x-2">
                  <span className="text-5xl font-bold tracking-tight text-[var(--color-text)]">{PRODUCT.priceFormatted}</span>
                </p>
                <Button 
                  size="lg"
                  className="mt-10 w-full"
                  onClick={handleCheckout}
                >
                  {buttonText}
                </Button>
                <p className="mt-6 text-xs leading-5 text-[var(--color-text-muted)]">
                  PIX processado com segurança pela GestãoPay.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
