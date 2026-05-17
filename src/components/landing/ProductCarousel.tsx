"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

const productImages = [
  {
    src: "/assets/imagem_mapa_palavra1.webp",
    alt: "Imagem real do produto Mapa da Palavra com materiais de apoio para leitura bíblica",
  },
  {
    src: "/assets/imagem_mapa_palavra2.webp",
    alt: "Imagem real do produto Mapa da Palavra com páginas internas do guia devocional",
  },
  {
    src: "/assets/imagem_mapa_palavra3.jpeg",
    alt: "Imagem real do produto Mapa da Palavra mostrando detalhes do material impresso",
  },
  {
    src: "/assets/imagem_mapa_palavra5.webp",
    alt: "Imagem real do produto Mapa da Palavra com guia de estudo e materiais inclusos",
  },
];

export function ProductCarousel() {
  const carouselRef = useRef<HTMLDivElement | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const scrollToSlide = useCallback((index: number) => {
    const el = carouselRef.current;
    if (!el) return;

    const nextIndex = (index + productImages.length) % productImages.length;
    el.scrollTo({ left: el.clientWidth * nextIndex, behavior: "smooth" });
    setActiveIndex(nextIndex);
  }, []);

  const updateActiveIndex = useCallback(() => {
    const el = carouselRef.current;
    if (!el) return;

    const nextIndex = Math.min(
      productImages.length - 1,
      Math.max(0, Math.round(el.scrollLeft / el.clientWidth)),
    );
    setActiveIndex(nextIndex);
  }, []);

  useEffect(() => {
    const el = carouselRef.current;
    if (!el) return;

    el.addEventListener("scroll", updateActiveIndex, { passive: true });
    return () => el.removeEventListener("scroll", updateActiveIndex);
  }, [updateActiveIndex]);

  useEffect(() => {
    if (isPaused) return;

    const interval = window.setInterval(() => {
      setActiveIndex((currentIndex) => {
        const nextIndex = (currentIndex + 1) % productImages.length;
        const el = carouselRef.current;
        el?.scrollTo({ left: el.clientWidth * nextIndex, behavior: "smooth" });
        return nextIndex;
      });
    }, 3000);

    return () => window.clearInterval(interval);
  }, [isPaused]);

  return (
    <section
      aria-label="Imagens reais do produto"
      className="mx-auto mt-14 w-full max-w-5xl"
      onBlur={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onPointerEnter={() => setIsPaused(true)}
      onPointerLeave={() => setIsPaused(false)}
    >
      <div className="relative">
        <div
          ref={carouselRef}
          className="flex snap-x snap-mandatory overflow-x-auto scroll-smooth rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-2)] shadow-sm [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        >
          {productImages.map((image, index) => (
            <div
              key={image.src}
              className="flex w-full flex-none snap-center justify-center p-3 sm:p-5"
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg bg-[var(--color-surface)]">
                <Image
                  src={image.src}
                  alt={image.alt}
                  width={900}
                  height={675}
                  sizes="(max-width: 640px) 100vw, (max-width: 1280px) 80vw, 960px"
                  className="h-full w-full object-contain"
                  quality={75}
                  preload={index === 0}
                />
              </div>
            </div>
          ))}
        </div>

        <button
          type="button"
          aria-label="Imagem anterior do produto"
          onClick={() => scrollToSlide(activeIndex - 1)}
          className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-[var(--color-border)] bg-[var(--color-surface)]/95 text-[var(--color-text)] shadow-sm transition hover:bg-[var(--color-surface-2)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
        >
          <ChevronLeft aria-hidden="true" className="h-5 w-5" />
        </button>
        <button
          type="button"
          aria-label="Próxima imagem do produto"
          onClick={() => scrollToSlide(activeIndex + 1)}
          className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-[var(--color-border)] bg-[var(--color-surface)]/95 text-[var(--color-text)] shadow-sm transition hover:bg-[var(--color-surface-2)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
        >
          <ChevronRight aria-hidden="true" className="h-5 w-5" />
        </button>
      </div>

      <div className="mt-6 flex items-center justify-center gap-2">
        {productImages.map((image, index) => (
          <button
            key={image.src}
            type="button"
            aria-label={`Ir para imagem ${index + 1} do produto`}
            onClick={() => scrollToSlide(index)}
            className={`h-2.5 rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] ${
              index === activeIndex
                ? "w-7 bg-[var(--color-primary)]"
                : "w-2.5 bg-[var(--color-border)]"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
