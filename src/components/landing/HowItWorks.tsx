"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { analytics } from "@/lib/analytics";
import type { OfferSource } from "@/lib/constants";
import howItWorksDiagram from "../../../imagens_produto/3.png";
import howItWorksDetail from "../../../imagens_produto/08_700x.jpg";
import { ChevronLeft, ChevronRight } from "lucide-react";

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

  const scrollByCards = (direction: "prev" | "next") => {
    const el = carouselRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("[data-carousel-item]");
    const cardWidth = card?.getBoundingClientRect().width ?? 280;
    const gap = 16;
    el.scrollBy({ left: direction === "next" ? cardWidth + gap : -(cardWidth + gap), behavior: "smooth" });
  };

  useEffect(() => {
    const el = carouselRef.current;
    if (!el || !steps.length) return;

    const cards = Array.from(el.querySelectorAll<HTMLElement>("[data-carousel-item]"));
    const observer = new IntersectionObserver(
      (entries) => {
        const best = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!best) return;
        const index = cards.indexOf(best.target as HTMLElement);
        if (index >= 0) setActiveIndex(index);
      },
      { root: el, threshold: [0.55, 0.75] }
    );

    cards.forEach((card) => observer.observe(card));
    return () => observer.disconnect();
  }, [steps.length]);

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
          <div className="relative overflow-hidden rounded-2xl bg-[var(--color-surface-2)] shadow-sm ring-1 ring-[var(--color-border)] aspect-[4/3]">
            {/* TODO: substituir por asset final do Nanobanana — Briefing 3: How it works evergreen // PLACEHOLDER */}
            <Image
              src={howItWorksDiagram}
              alt="Guia aberto mostrando a estrutura de estudo visual da Bíblia com marcações e anotações"
              width={700}
              height={525}
              sizes="(max-width: 1024px) 100vw, 50vw"
              style={{ aspectRatio: "4 / 3" }}
              className="object-cover"
            />
          </div>
          <div className="relative overflow-hidden rounded-2xl bg-[var(--color-surface-2)] shadow-sm ring-1 ring-[var(--color-border)] aspect-[4/3]">
            {/* TODO: substituir por asset final do Nanobanana — Briefing 3: How it works evergreen // PLACEHOLDER */}
            <Image
              src={howItWorksDetail}
              alt="Close de página interna do guia com o livro de Êxodo e seções destacadas"
              width={700}
              height={525}
              sizes="(max-width: 1024px) 100vw, 50vw"
              style={{ aspectRatio: "4 / 3" }}
              className="object-cover"
            />
          </div>
        </div>

        {steps.length > 0 && (
          <div className="mx-auto max-w-5xl mb-16">
            <div className="flex justify-center items-center gap-3 mb-4">
              <button
                type="button"
                aria-label="Passo anterior"
                onClick={() => scrollByCards("prev")}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--color-border)] bg-[var(--color-accent)] text-[var(--color-text)] hover:bg-[var(--color-accent-hover)]"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                type="button"
                aria-label="Próximo passo"
                onClick={() => scrollByCards("next")}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--color-border)] bg-[var(--color-accent)] text-[var(--color-text)] hover:bg-[var(--color-accent-hover)]"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>

            <div
              ref={carouselRef}
              className="carousel flex overflow-x-auto gap-4 scroll-smooth [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
              style={{ scrollSnapType: "x mandatory", WebkitOverflowScrolling: "touch" }}
            >
              {steps.map((step) => (
                <div
                  key={step.number}
                  data-carousel-item
                  className="carousel-item snap-start flex-[0_0_calc(33.333%-1rem)] min-w-[260px] rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-2)] p-6 text-center shadow-sm"
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
                  onClick={() => {
                    const el = carouselRef.current;
                    const card = el?.querySelectorAll<HTMLElement>("[data-carousel-item]")[index];
                    card?.scrollIntoView({ behavior: "smooth", inline: "start", block: "nearest" });
                  }}
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
