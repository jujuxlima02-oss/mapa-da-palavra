"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { Star } from "lucide-react";

interface SocialProofProps {
  label: string;
  template: string;
  ratingLabel?: string;
}

export function SocialProof({ label, ratingLabel }: SocialProofProps) {
  const carouselRef = useRef<HTMLDivElement | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  // Objeção de preço — reposicionada para FAQ/checkout conforme copy-landing-pages.md
  const testimonials = useMemo(
    () => [
      {
        author: "Simone P.",
        text: "Achei um grande recurso para aprender, entender e aplicar a Palavra. A parte sobre o Filho Pródigo tocou uma dúvida que eu tinha; antes eu não entendia, agora entendo melhor. Ainda não consegui comprar, mas vejo valor no material.",
        image: "/reviews/depo03.jpg",
      },
      {
        author: "Karina L.",
        text: "O conteúdo é fantástico e muito importante. A única coisa que eu mudaria seria o tamanho da fonte em algumas partes, porque ficou difícil de ler sem esforço. Mesmo assim, o material tem muito valor.",
        image: "/reviews/depo05.jpg",
      },
      {
        author: "Amanda R.",
        text: "O material me ajudou a desacelerar e entender melhor as Escrituras. As perguntas são claras, fazem sentido e me dão espaço para refletir com mais calma sobre o que estou lendo.",
        image: "/reviews/depo01.jpg",
      },
      {
        author: "Gabriela T.",
        text: "Meus pais me deram esse material de aniversário e desde então tenho usado todos os dias. Gosto de estudar no meu ritmo e também compartilhar percepções com meus irmãos e amigos. Isso aproximou nossa família das conversas sobre as Escrituras.",
        image: "/reviews/depo02.jpg",
      },
      {
        author: "Juliana M.",
        text: "Minha irmã comprou esse material para mim de presente, e eu comecei sem saber bem o que esperar. As perguntas me fazem refletir profundamente, tanto quando estudo sozinha quanto quando converso com a família. Foi um presente útil de verdade.",
        image: "/reviews/depo03.jpg",
      },
      {
        author: "Fernanda E.",
        text: "Estudar dessa forma fez as Escrituras ganharem vida para mim. Não fico só lendo palavras; eu penso, reflito e vejo como aquilo impacta minha vida. Isso renovou meu amor pela Bíblia.",
        image: "/reviews/depo04.jpg",
      },
      {
        author: "Beatriz L.",
        text: "Sempre que termino uma sessão, saio encorajada e pensativa. As perguntas me ajudam a aplicar o que li de um jeito mais significativo. Nas últimas semanas, percebi crescimento espiritual na minha rotina.",
        image: "/reviews/depo05.jpg",
      },
      {
        author: "Mônica R.",
        text: "Cada pergunta me faz pensar no versículo de forma pessoal. Percebo que escrevo mais no diário, oro com mais intenção e fico menos no automático quando leio a Palavra.",
        image: "/reviews/depo06.jpg",
      },
    ],
    []
  );

  useEffect(() => {
    if (isPaused) return;
    const interval = window.setInterval(() => {
      const el = carouselRef.current;
      if (!el) return;
      const card = el.querySelector<HTMLElement>("[data-social-proof-item]");
      const cardWidth = card?.getBoundingClientRect().width ?? el.clientWidth;
      const maxScroll = el.scrollWidth - el.clientWidth;
      const nextLeft = el.scrollLeft + cardWidth + 16 >= maxScroll ? 0 : el.scrollLeft + cardWidth + 16;
      el.scrollTo({ left: nextLeft, behavior: "smooth" });
    }, 4000);

    return () => window.clearInterval(interval);
  }, [isPaused]);

  return (
    <section className="bg-[var(--color-surface)] py-12 border-y border-[var(--color-border)]">
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="mb-8 text-2xl sm:text-3xl font-black tracking-tighter text-[var(--color-text)]">
          Testemunho verdadeiro não precisa de maquiagem.
        </h2>
        <div
          ref={carouselRef}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        >
          {testimonials.map((testimonial, index) => (
            <article
              key={`${label}-${testimonial.author}-${index}`}
              data-social-proof-item
              className="snap-center flex min-h-0 flex-[0_0_100%] flex-col sm:flex-row items-center gap-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-2)] px-6 py-4 sm:flex-[0_0_calc(50%-0.5rem)] lg:flex-[0_0_calc(33.333%-0.75rem)]"
            >
              <div className="relative w-full sm:w-80 flex-shrink-0 overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-accent-highlight)]" style={{ aspectRatio: "3/4" }}>
                <Image
                  src={testimonial.image}
                  alt={`Foto de ${testimonial.author}`}
                  fill
                  sizes="(max-width: 640px) 100vw, 320px"
                  className="object-cover object-top"
                />
              </div>
              <div className="flex-1 text-left">
                <div className="flex gap-1 mb-3 text-[var(--color-accent)]">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-current" />
                  ))}
                </div>
                <p className="text-sm sm:text-base font-medium text-[var(--color-text)] max-w-3xl leading-relaxed mb-3">
                  &quot;{testimonial.text}&quot;
                </p>
                <p className="text-[var(--color-text)] text-sm font-semibold leading-6 max-w-2xl mb-3">
                  {testimonial.author}
                </p>
                <div className="flex flex-col sm:flex-row items-start gap-2 sm:gap-4 text-sm font-medium text-[var(--color-text-muted)]">
                  <span className="uppercase tracking-wider text-xs border border-[var(--color-border)] rounded-full px-3 py-1">
                    {label}
                  </span>
                  {ratingLabel && (
                    <span>— {ratingLabel}</span>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
