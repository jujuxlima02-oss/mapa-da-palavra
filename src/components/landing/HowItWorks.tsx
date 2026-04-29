"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { analytics } from "@/lib/analytics";
import type { OfferSource } from "@/lib/constants";

interface HowItWorksProps {
  label: string;
  introText: string;
  listItems?: string[];
  conclusionText?: string;
  ctaText: string;
  offerSource: OfferSource;
}

export function HowItWorks({
  label,
  introText,
  listItems,
  conclusionText,
  ctaText,
  offerSource,
}: HowItWorksProps) {
  const carouselRef = useRef<HTMLDivElement | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const steps = useMemo(() => {
    return (listItems || []).map((item, index) => {
      const parts = item.match(/^(\d+)\.\s+(.+)$/);
      return {
        number: parts ? parts[1] : String(index + 1),
        text: parts ? parts[2] : item,
      };
    });
  }, [listItems]);

  const getCardWidth = useCallback((el: HTMLDivElement) => {
    const cards = Array.from(el.querySelectorAll<HTMLElement>("[data-carousel-item]"));
    if (cards.length > 1) {
      return cards[1].offsetLeft - cards[0].offsetLeft;
    }

    return cards[0]?.offsetWidth ?? 1;
  }, []);

  const updateActiveIndex = useCallback(() => {
    const el = carouselRef.current;
    if (!el || !steps.length) return;

    const cardWidth = getCardWidth(el);
    const maxScrollLeft = el.scrollWidth - el.clientWidth;
    const nextIndex =
      el.scrollLeft >= maxScrollLeft - 1
        ? steps.length - 1
        : Math.min(steps.length - 1, Math.max(0, Math.round(el.scrollLeft / cardWidth)));
    setActiveIndex(nextIndex);
  }, [getCardWidth, steps.length]);

  useEffect(() => {
    const el = carouselRef.current;
    if (!el || !steps.length) return;

    el.addEventListener("scroll", updateActiveIndex, { passive: true });
    return () => el.removeEventListener("scroll", updateActiveIndex);
  }, [steps.length, updateActiveIndex]);

  const scrollToStep = useCallback((index: number) => {
    const el = carouselRef.current;
    if (!el) return;

    const cardWidth = getCardWidth(el);
    el.scrollTo({ left: cardWidth * index, behavior: "smooth" });
    setActiveIndex(index);
  }, [getCardWidth]);

  return (
    <section id="como-funciona" className="py-24 bg-[var(--color-surface)]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-3xl text-center mb-16 px-0">
          <h2 className="text-3xl font-bold tracking-tight text-[var(--color-text)] sm:text-4xl mb-6">
            {label}
          </h2>
          <p className="text-lg text-[var(--color-text-muted)] leading-relaxed max-w-2xl mx-auto">
            {introText}
          </p>
        </div>

        <div className="mx-auto max-w-5xl mb-16 grid gap-6 lg:grid-cols-2">
          <div className="relative h-auto overflow-hidden rounded-2xl bg-transparent shadow-sm ring-1 ring-[var(--color-border)] sm:aspect-[4/3]">
            {/* TODO: substituir por asset final do Nanobanana — Briefing 3: How it works evergreen // PLACEHOLDER */}
            <Image
              src="/assets/imagem_mapa_palavra1.jpeg"
              alt="Guia aberto mostrando a estrutura de estudo visual da Bíblia com marcações e anotações"
              width={700}
              height={525}
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-contain sm:object-cover w-full h-auto sm:h-full"
            />
          </div>
          <div className="relative h-auto overflow-hidden rounded-2xl bg-transparent shadow-sm ring-1 ring-[var(--color-border)] sm:aspect-[4/3]">
            {/* TODO: substituir por asset final do Nanobanana — Briefing 3: How it works evergreen // PLACEHOLDER */}
            <Image
              src="/assets/imagem_mapa_palavra2.jpeg"
              alt="Close de página interna do guia com o livro de Êxodo e seções destacadas"
              width={700}
              height={525}
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-contain sm:object-cover w-full h-auto sm:h-full"
            />
          </div>
        </div>

        {steps.length > 0 && (
          <div className="mx-auto max-w-5xl mb-16">
            <div
              ref={carouselRef}
              className="carousel flex overflow-x-auto scroll-smooth snap-x snap-mandatory gap-4 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
              style={{ scrollSnapType: "x mandatory", WebkitOverflowScrolling: "touch" }}
            >
              {steps.map((step) => (
                <div
                  key={step.number}
                  data-carousel-item
                  className="carousel-item snap-start shrink-0 flex-[0_0_calc(33.333%-1rem)] min-w-[260px] rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-2)] p-6 text-center shadow-sm"
                >
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-primary-highlight)] text-[var(--color-primary)] font-bold text-xl">
                    {step.number}
                  </div>
                  <h3 className="font-semibold text-[var(--color-text)]">{step.text}</h3>
                </div>
              ))}
            </div>

            <div className="mt-6 flex w-full items-center justify-center gap-2">
              {steps.map((step, index) => (
                <button
                  key={step.number}
                  type="button"
                  aria-label={`Ir para o passo ${step.number}`}
                  onClick={() => scrollToStep(index)}
                  className={`h-2.5 w-2.5 rounded-full transition-colors ${
                    index === activeIndex ? "bg-[var(--color-primary)]" : "bg-[var(--color-border)]"
                  }`}
                />
              ))}
            </div>
          </div>
        )}

        {conclusionText && (
          <div className="mx-auto max-w-2xl text-center mb-12">
            <p className="text-lg font-medium text-[var(--color-text)]">
              {conclusionText}
            </p>
          </div>
        )}

        <div className="text-center">
          <Link href={`/checkout?offer=${offerSource}`}>
            <Button 
              size="lg"
              className="w-full px-6 sm:w-auto sm:px-6"
              onClick={() => analytics.ctaClick(offerSource, "how_it_works")}
            >
              {ctaText}
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
