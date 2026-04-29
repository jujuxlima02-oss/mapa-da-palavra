"use client";

import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { analytics } from "@/lib/analytics";
import type { OfferSource } from "@/lib/constants";

interface HeroProps {
  headline: string;
  subheadline: string;
  buttonMainText: string;
  buttonSecondaryText?: string;
  supportLine: string;
  offerSource: OfferSource;
}

export function Hero({
  headline,
  subheadline,
  buttonMainText,
  supportLine,
  offerSource,
}: HeroProps) {
  const heroImage =
    offerSource === "dia-das-maes" ? "/assets/imagem_mapa_palavra5.png" : "/assets/imagem_mapa_palavra4.png";
  const headlineClasses =
    offerSource === "dia-das-maes"
      ? "text-2xl font-extrabold tracking-tight sm:text-3xl lg:text-3xl"
      : "text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl";
  const subheadlineClasses =
    offerSource === "dia-das-maes"
      ? "mt-6 text-lg leading-8"
      : "mt-6 text-lg leading-8";

  return (
    <section className="relative overflow-hidden bg-[var(--color-dark-section)] pt-16 pb-20 lg:pt-24 lg:pb-28">
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-[var(--color-accent-highlight)]/20" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div className="max-w-2xl text-left">
            <h1 className={`${headlineClasses} text-[var(--color-dark-text)]`}>
              {headline}
            </h1>
            <p className={`${subheadlineClasses} text-[var(--color-dark-text)]/80`}>
              {subheadline}
            </p>
            <div className="mt-10 flex justify-center sm:justify-start">
            <Link href={`/checkout?offer=${offerSource}`} className="w-full sm:w-auto">
              <Button 
                size="lg" 
                className="w-full sm:w-auto mx-auto px-6 sm:px-6"
                onClick={() => {
                  analytics.ctaClick(offerSource, "hero_main");
                  if (offerSource === "dia-das-maes") {
                    analytics.trackEvent("mother_day_gift_cta_click", { offer_source: offerSource });
                  }
                }}
              >
                {buttonMainText}
              </Button>
            </Link>
          </div>
            <p className="mt-6 text-sm text-[var(--color-dark-text)]/70 font-medium">
            {supportLine}
            </p>
          </div>
          <div className="lg:pl-6">
            <div className="relative mx-auto w-full h-auto max-w-4xl rounded-xl shadow-2xl bg-[var(--color-surface)]">
            {/* TODO: substituir por asset final do Nanobanana — Briefing 1: Hero evergreen // PLACEHOLDER */}
            <Image
              src={heroImage}
              alt="Guia físico Mapa da Palavra em uma mesa com Bíblia, café e luz natural, em composição editorial premium"
              width={1024}
              height={576}
              sizes="(max-width: 1024px) 100vw, 1024px"
              className="object-contain w-full h-auto"
              preload
            />
            {/* Decoração da borda */}
            <div className="absolute inset-0 ring-1 ring-inset ring-[var(--color-border)]/30 rounded-xl" />
          </div>
          </div>
        </div>
      </div>
    </section>
  );
}
