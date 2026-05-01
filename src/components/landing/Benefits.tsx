"use client";

import React from "react";
import Image from "next/image";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { analytics } from "@/lib/analytics";
import type { OfferSource } from "@/lib/constants";
import benefitsMockup from "../../../public/assets/imagem_mapa_palavra2.jpeg";

interface BenefitsProps {
  label: string;
  benefits: string[];
  ctaText: string;
  offerSource: OfferSource;
}

export function Benefits({
  label,
  benefits,
  ctaText,
  offerSource,
}: BenefitsProps) {
  return (
    <section className="py-20 bg-[var(--color-bg)]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:max-w-4xl">
          <div className="text-center mb-12 max-w-full">
            <h2 className="text-sm font-semibold text-[var(--color-accent)] tracking-wide uppercase">
              {label}
            </h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-[var(--color-text)] text-pretty sm:text-4xl">
              Descubra por que esse diário sustenta sua caminhada
            </p>
          </div>
          
          <div className="grid gap-8 lg:grid-cols-2 mt-12 bg-[var(--color-surface)] rounded-2xl p-8 sm:p-12 border border-[var(--color-border)]">
            <div className="flex flex-col justify-center">
              <ul className="space-y-6">
                {benefits.map((benefit, index) => (
                  <li key={index} className="flex gap-4">
                    <CheckCircle2 className="h-6 w-6 flex-none text-[var(--color-success)]" />
                    <span className="text-[var(--color-text)] font-medium leading-relaxed">
                      {benefit}
                    </span>
                  </li>
                ))}
              </ul>
              
              <div className="mt-10">
                <Link href={`/checkout?offer=${offerSource}`}>
                  <Button 
                    size="lg" 
                    className="w-full px-6 sm:w-auto sm:px-6"
                    onClick={() => analytics.ctaClick(offerSource, "benefits")}
                  >
                    {ctaText}
                  </Button>
                </Link>
              </div>
            </div>
            <div className="flex items-center justify-center relative">
              <div className="relative w-full h-full rounded-[var(--radius-xl,1rem)] shadow-md ring-1 ring-[var(--color-border)] aspect-[4/5] overflow-hidden bg-[var(--color-surface-2)]">
                {/* TODO: substituir por asset final do Nanobanana — Briefing 2: Benefits evergreen // PLACEHOLDER */}
                <Image
                  src={benefitsMockup}
                  alt="Livro físico aberto mostrando páginas internas organizadas do guia visual da Bíblia"
                  width={700}
                  height={875}
                  sizes="(max-width: 1024px) 100vw, 33vw"
                  style={{ aspectRatio: "4 / 5" }}
                  className="object-cover"
                />
                <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-[var(--color-accent-highlight)] rounded-full opacity-50 blur-xl" />
                <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-[var(--color-primary-highlight)] rounded-full opacity-50 blur-xl" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
