import React from "react";
import Image from "next/image";
import { Star } from "lucide-react";
import socialProofImage from "../../../imagens_produto/1_855c9725-f9fa-4044-8cce-51333aba3f9a.png";

interface SocialProofProps {
  label: string;
  template: string;
  ratingLabel?: string;
  ctaText?: string;
}

export function SocialProof({ label, template, ratingLabel, ctaText }: SocialProofProps) {
  // O template pode conter [Nº DE CLIENTES]. Como a copy é fixa, podemos renderizar diretamente.
  return (
    <section className="bg-[var(--color-surface)] py-12 border-y border-[var(--color-border)]">
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
        <div className="mb-6 flex items-center gap-4 w-full max-w-3xl">
          <div className="relative h-16 w-16 flex-none overflow-hidden rounded-full border border-[var(--color-border)] bg-[var(--color-accent-highlight)]">
            {/* TODO: substituir por asset final do Nanobanana — Briefing 4: Social proof evergreen // PLACEHOLDER */}
            <Image
              src={socialProofImage}
              alt="Mulher brasileira segurando o guia visual da Bíblia em um ambiente real de uso"
              width={64}
              height={64}
              sizes="64px"
              style={{ aspectRatio: "1 / 1" }}
              className="object-cover"
            />
          </div>
          <div className="pt-1 text-left">
            <p className="text-[var(--color-text-muted)] text-sm leading-6 max-w-2xl">
              Foto real de cliente usando o guia em casa.
            </p>
          </div>
        </div>
        <div className="flex gap-1 mb-4 text-[var(--color-accent)]">
           {[...Array(5)].map((_, i) => (
             <Star key={i} className="h-5 w-5 fill-current" />
           ))}
        </div>
        <p className="text-lg sm:text-xl font-medium text-[var(--color-text)] max-w-3xl leading-relaxed mb-4">
          &quot;{template}&quot;
        </p>
        <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-sm font-medium text-[var(--color-text-muted)]">
           <span className="uppercase tracking-wider text-xs border border-[var(--color-border)] rounded-full px-3 py-1">
              {label}
           </span>
           {ratingLabel && (
              <span>— {ratingLabel}</span>
           )}
           {ctaText && (
              <button className="text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] ml-2 underline underline-offset-4">
                 {ctaText}
              </button>
           )}
        </div>
      </div>
    </section>
  );
}
