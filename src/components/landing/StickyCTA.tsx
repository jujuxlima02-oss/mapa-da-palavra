"use client";

import React from "react";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { OfferSource } from "@/lib/constants";
import { analytics } from "@/lib/analytics";

interface StickyCTAProps {
  texto: string;
  botao: string;
  linhaAbaixo: string;
  offerSource: OfferSource;
}

export function StickyCTA({ texto, botao, linhaAbaixo, offerSource }: StickyCTAProps) {
  return (
    <section className="bg-[var(--color-dark-section)] py-16 text-center px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-bold text-[var(--color-dark-text)] mb-8 leading-snug">
          {texto}
        </h2>
        <Link href={`/checkout?offer=${offerSource}`}>
          <Button 
            size="lg" 
            className="w-full px-6 sm:w-auto sm:px-10 h-16 text-lg shadow-xl shadow-black/20"
            onClick={() => analytics.ctaClick(offerSource, "final_cta")}
          >
            {botao}
          </Button>
        </Link>
        <p className="mt-6 text-[var(--color-accent-highlight)] text-sm sm:text-base font-medium">
          {linhaAbaixo}
        </p>
      </div>
    </section>
  );
}
