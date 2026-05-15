"use client";

import React from "react";
import Image from "next/image";
import { ShieldCheck } from "lucide-react";
import Link from "next/link";

interface GuaranteeProps {
  label: string;
  text: string;
  linkText: string;
  showGiftCarousel?: boolean;
}

const giftSlides = [
  {
    src: "/assets/colar_coracao_jesus2.webp",
    alt: "Colar Coração Jesus na caixa",
  },
];

function GiftCarousel() {
  return (
    <div className="mx-auto w-full max-w-2xl rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 text-center">
      <div className="relative overflow-hidden rounded-xl">
        <div className="flex">
          {giftSlides.map((slide) => (
            <div
              key={slide.src}
              className="w-full shrink-0 snap-start overflow-hidden rounded-xl sm:relative sm:h-80"
            >
              <Image
                src={slide.src}
                alt={slide.alt}
                width={700}
                height={525}
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-contain h-auto w-full sm:h-full sm:object-cover"
              />
            </div>
          ))}
        </div>
      </div>
      <p className="mt-6 text-lg font-bold text-[var(--color-text)]">
        &quot;Colar Coração Jesus — De Presente para Você&quot;
      </p>
      <p className="mt-3 text-base leading-7 text-[var(--color-text-muted)]">
        &quot;Ao garantir seu Mapa da Palavra hoje, você recebe gratuitamente este colar banhado a ouro com o nome de Jesus gravado no coração. Um símbolo lindo da sua fé, para usar ou presentear.&quot;
      </p>
    </div>
  );
}

export function Guarantee({ label, text, linkText, showGiftCarousel = false }: GuaranteeProps) {
  const guaranteeBlock = (
    <div className="mx-auto max-w-2xl text-center bg-[var(--color-surface)] rounded-2xl p-8 sm:p-12 border border-[var(--color-border)]">
      <ShieldCheck className="mx-auto h-12 w-12 text-[var(--color-accent)] mb-4" />
      <h2 className="text-xl font-bold tracking-tight text-[var(--color-text)] mb-4">
        {label}
      </h2>
      <p className="text-base leading-7 text-[var(--color-text-muted)] mb-6">
        {text}
      </p>
      <Link href="/politica-de-garantia" className="inline-flex min-h-11 items-center justify-center text-sm font-semibold text-[var(--color-primary)] hover:text-[var(--color-primary-hover)]">
        {linkText} &rarr;
      </Link>
    </div>
  );

  return (
    <section className="bg-[var(--color-bg)] py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {showGiftCarousel ? (
          <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-2 lg:items-stretch">
            <GiftCarousel />
            {guaranteeBlock}
          </div>
        ) : (
          guaranteeBlock
        )}
      </div>
    </section>
  );
}
