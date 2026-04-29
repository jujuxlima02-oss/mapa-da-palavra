"use client";

import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { useRouter } from "next/navigation";
import { PRODUCT, OfferSource } from "@/lib/constants";
import { analytics } from "@/lib/analytics";
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
    offerSource === "dia-das-maes" ? mothersPricingImage : "/assets/imagem_mapa_palavra5.png";

  const handleCheckout = (e?: React.FormEvent) => {
    e?.preventDefault();
    analytics.ctaClick(offerSource, "pricing_section");
    router.push(`/checkout?offer=${offerSource}`);
  };

  return (
    <section className="py-24 bg-[var(--color-bg)]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl bg-[var(--color-surface-2)] rounded-3xl shadow-xl ring-2 ring-[var(--color-accent)] overflow-hidden p-6 sm:p-10 lg:flex">
          <div className="p-8 sm:p-10 lg:flex-auto">
            <div className="relative mb-6 overflow-hidden rounded-2xl bg-[var(--color-surface)] shadow-sm ring-1 ring-[var(--color-border)] sm:aspect-[16/9]">
              {/* TODO: substituir por asset final do Nanobanana — Briefing 5: Pricing evergreen // PLACEHOLDER */}
              <Image
                src={pricingImage}
                alt="Capa limpa do guia Mapa da Palavra em apresentação de preço e compra"
                width={700}
                height={525}
                sizes="(max-width: 1024px) 100vw, 50vw"
                style={offerSource === "dia-das-maes" ? { aspectRatio: "4 / 3" } : undefined}
                className={offerSource === "dia-das-maes" ? "object-contain p-4" : "object-contain sm:object-cover w-full h-auto sm:h-full"}
              />
            </div>
            <p className="text-sm font-bold uppercase tracking-widest text-[var(--color-accent)] text-center mb-2">
              Oferta por tempo limitado
            </p>
            <h3 className="text-2xl font-bold tracking-tight text-[var(--color-text)] text-center">{label}</h3>
            <p className="text-sm text-[var(--color-text-muted)] text-center mb-6">
              Já estão aprofundando a fé com o Mapa da Palavra.
            </p>
            <div className="mt-6 text-base leading-7 text-[var(--color-text-muted)] space-y-4">
              {texts.map((text, i) => {
                if (text.startsWith("•") || text.startsWith("-")) {
                  return (
                    <div key={i} className="flex gap-3">
                       <span className="text-[var(--color-accent)] font-bold">✅</span>
                       <span>{text.substring(1).trim()}</span>
                    </div>
                  )
                }
                return <p key={i}>{text}</p>
              })}
            </div>
            <div className="mt-6 text-sm text-[var(--color-text-muted)] border border-[var(--color-border)] rounded-xl p-4 bg-[var(--color-surface-2)]">
              <p className="font-medium mb-2">🎁 Bônus inclusos:</p>
              <p>• 66 Cards de Versículos</p>
              <p>• Diário de Fé</p>
              <p>• Guia de Estudo em 30 Dias</p>
            </div>
            
          </div>
          <div className="-mt-2 p-2 lg:mt-0 lg:w-full lg:max-w-md lg:shrink-0">
            <div className="rounded-2xl bg-[var(--color-surface)] py-10 text-center ring-1 ring-inset ring-[var(--color-border)] lg:flex lg:flex-col lg:justify-center lg:py-16 h-full">
              <div className="mx-auto max-w-xs px-8">
                <p className="text-base font-semibold text-[var(--color-text-muted)]">Separar tempo com Deus</p>
                <p className="text-center text-sm text-gray-400 line-through mb-1">
                  De {PRODUCT.originalPriceFormatted}
                </p>
                <p className="mt-6 flex flex-col items-center justify-center gap-2 sm:flex-row sm:items-baseline sm:gap-x-2">
                  <span className="text-5xl font-bold tracking-tight text-[var(--color-text)]">{PRODUCT.priceFormatted}</span>
                  <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full sm:ml-2">
                    {Math.round((1 - 4990 / 8999) * 100)}% OFF
                  </span>
                </p>
                <Button 
                  size="lg"
                  className="mt-10 w-full"
                  onClick={handleCheckout}
                >
                  {buttonText}
                </Button>
                <p className="mt-4 text-center text-sm font-bold text-[var(--color-error)]">
                  RISCO DE ESGOTAMENTO:
                  <span className="ml-1">ALTO</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
