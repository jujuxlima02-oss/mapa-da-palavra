"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";

interface SocialProofProps {
  label: string;
  template: string;
}

const whatsappPrints = [
  { src: "/reviews/depo_whats01_safe.png", alt: "Depoimento de cliente Mapa da Palavra", width: 640, height: 1384 },
  { src: "/reviews/depo_whats02_safe.png", alt: "Depoimento de cliente Mapa da Palavra", width: 640, height: 1384 },
  { src: "/reviews/depo_whats03_safe.png", alt: "Depoimento de cliente Mapa da Palavra", width: 640, height: 1384 },
  { src: "/reviews/depo_whats04_safe.png", alt: "Depoimento de cliente Mapa da Palavra", width: 640, height: 1384 },
  { src: "/reviews/depo_whats05_safe.png", alt: "Depoimento de cliente Mapa da Palavra", width: 640, height: 1384 },
  { src: "/reviews/depo_whats06_safe.png", alt: "Depoimento de cliente Mapa da Palavra", width: 640, height: 1384 },
  { src: "/reviews/depo_whats07_safe.png", alt: "Depoimento de cliente Mapa da Palavra", width: 640, height: 1384 },
  { src: "/reviews/depo_whats08_safe.png", alt: "Depoimento de cliente Mapa da Palavra", width: 640, height: 1053 },
  { src: "/reviews/depo_whats09_safe.png", alt: "Depoimento de cliente Mapa da Palavra", width: 640, height: 1071 },
  { src: "/reviews/depo_whats10_safe.png", alt: "Depoimento de cliente Mapa da Palavra", width: 640, height: 1355 },
  { src: "/reviews/depo_whats11_safe.png", alt: "Depoimento de cliente Mapa da Palavra", width: 640, height: 1137 },
  { src: "/reviews/depo_whats12_safe.png", alt: "Depoimento de cliente Mapa da Palavra", width: 640, height: 1067 },
  { src: "/reviews/depo_whats13_safe.png", alt: "Depoimento de cliente Mapa da Palavra", width: 640, height: 1354 },
  { src: "/reviews/depo_whats14_safe.png", alt: "Depoimento de cliente Mapa da Palavra", width: 640, height: 1106 },
];

export function SocialProof({ label, template }: SocialProofProps) {
  const carouselRef = useRef<HTMLDivElement | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [isReadyToScroll, setIsReadyToScroll] = useState(false);
  const [failedImages, setFailedImages] = useState<Set<string>>(() => new Set());
  const whatsappPrintItems = useMemo(() => whatsappPrints, []);

  useEffect(() => {
    const readyTimer = window.setTimeout(() => setIsReadyToScroll(true), 1200);
    return () => window.clearTimeout(readyTimer);
  }, []);

  useEffect(() => {
    if (isPaused || !isReadyToScroll) return;
    const advanceCarousel = () => {
      const el = carouselRef.current;
      if (!el) return;
      const card = el.querySelector<HTMLElement>("[data-social-proof-item]");
      const cardWidth = card?.getBoundingClientRect().width ?? el.clientWidth;
      const maxScroll = el.scrollWidth - el.clientWidth;
      const nextLeft = el.scrollLeft + cardWidth + 16 >= maxScroll ? 0 : el.scrollLeft + cardWidth + 16;
      el.scrollTo({ left: nextLeft, behavior: "smooth" });
    };

    const initialTimer = window.setTimeout(advanceCarousel, 300);
    const interval = window.setInterval(advanceCarousel, 3500);

    return () => {
      window.clearTimeout(initialTimer);
      window.clearInterval(interval);
    };
  }, [isPaused, isReadyToScroll]);

  return (
    <section className="border-y border-[var(--color-border)] bg-[var(--color-surface)] py-12">
      <div className="mx-auto w-full max-w-7xl px-4 text-center sm:px-6 lg:px-8">
        <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-[var(--color-accent)]">
          {label}
        </p>
        <h2 className="text-2xl font-black tracking-tight text-[var(--color-text)] sm:text-3xl">
          Prints reais de quem viveu essa jornada
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-[var(--color-text-muted)]">
          {template}
        </p>

        <div
          ref={carouselRef}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          className="mt-8 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        >
          {whatsappPrintItems.map((print, index) => {
            const shouldLoadEarly = index < 8;
            const hasFailed = failedImages.has(print.src);

            return (
            <article
              key={print.src}
              data-social-proof-item
              className="snap-center flex w-[86%] max-w-[320px] flex-none justify-center rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-2)] p-2 shadow-sm"
            >
              {hasFailed ? (
                <div
                  role="img"
                  aria-label="Depoimento de cliente Mapa da Palavra indisponível"
                  className="flex w-full items-center justify-center rounded-lg bg-[var(--color-surface)] px-6 text-center text-sm font-medium text-[var(--color-text-muted)]"
                  style={{ aspectRatio: `${print.width} / ${print.height}` }}
                >
                  Depoimento temporariamente indisponível.
                </div>
              ) : (
                <Image
                  src={print.src}
                  alt={print.alt}
                  width={print.width}
                  height={print.height}
                  sizes="(max-width: 640px) 86vw, 320px"
                  className="h-auto w-full rounded-lg bg-[var(--color-surface)]"
                  loading={shouldLoadEarly ? "eager" : "lazy"}
                  fetchPriority={shouldLoadEarly ? "high" : "auto"}
                  unoptimized
                  onError={() =>
                    setFailedImages((current) => {
                      const next = new Set(current);
                      next.add(print.src);
                      return next;
                    })
                  }
                />
              )}
            </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
