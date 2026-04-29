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
  const testimonials = useMemo(
    () => [
      {
        author: "Bianca G.",
        text: "Encomendei o meu pelo Walmart por US$ 8,00 incluindo o frete.",
        image: "/reviews/depo01.jpg",
      },
      {
        author: "Angélica",
        text: "Quem está vendendo isso aqui precisa reduzir o preço porque é muito mais barato quando você pesquisa de modo geral. Encontrei um na Amazon também por US$ 17, Amazon, de todos os lugares, que na maior parte do tempo eu sei que cobra caro.",
        image: "/reviews/depo02.jpg",
      },
      {
        author: "Simone P.",
        text: "Acho que é um grande recurso para aprender, entender e aplicar a palavra. O que Deus me deu se aplica ao Filho Pródigo, eu não entendia, mas agora entendo. Quando eu estiver financeiramente estável, com certeza vou comprar isso; agora não consigo. Isso é valioso.",
        image: "/reviews/depo03.jpg",
      },
      {
        author: "Juliana H.",
        text: "Posso conseguir um desconto?",
        image: "/reviews/depo04.jpg",
      },
      {
        author: "Karina L.",
        text: "Livro fantástico, mas a fonte precisa ser alterada para facilitar a leitura. Por que motivo fizeram um livro tão importante praticamente ilegível sem uma lupa para ler parte dele? Por favor, corrijam para futuros leitores, porque vocês têm uma joia de livro!",
        image: "/reviews/depo05.jpg",
      },
      {
        author: "Daniela R.",
        text: "Mesmo livro, US$ 13 na Amazon.",
        image: "/reviews/depo06.jpg",
      },
      {
        author: "Tatiane C.",
        text: "Eu",
        image: "/reviews/depo07.jpg",
      },
      {
        author: "Maria B.",
        text: "Disponível na Amazon por US$ 13,99 mais impostos.",
        image: "/reviews/depo08.jpg",
      },
      {
        author: "Sandra",
        text: "Eu adoraria ter este livro, mas por que ele está sendo vendido com 35% de desconto por 40,00 quando acabei de ver outro anúncio no Facebook com 49% de desconto por 19,00? Isso me faz pensar. Acho que vou pesquisar mais.",
        image: "/reviews/depo09.jpg",
      },
      {
        author: "Carla T.",
        text: "Alguém tem uma cópia usada que gostaria de compartilhar?",
        image: "/reviews/depo10.jpg",
      },
      {
        author: "Renata M.",
        text: "Yy",
        image: "/reviews/depo11.jpg",
      },
      {
        author: "Larissa W.",
        text: "Concordo com algumas avaliações, eu também tenho um orçamento, e tudo que deveríamos ter tem um preço. Eu queria poder comprar um. Podemos enviar ordens de pagamento? Qual é o endereço? Precisamos de respostas para conseguir este livro.",
        image: "/reviews/depo12.jpg",
      },
      {
        author: "Yara P.",
        text: "Eu entendo o que Tony T. disse sobre não ter dinheiro para comprar isso. Eu também adoraria poder comprar isso e saber mais sobre o que leio na minha Bíblia, mas eu realmente não tenho dinheiro extra. Estou em uma casa de repouso e isso leva quase toda a minha seguridade social. Mas agora vou pegar as informações dadas e espero conseguir descobrir um pouco do que está no livro.",
        image: "/reviews/depo13.jpg",
      },
      {
        author: "Tânia Torres",
        text: "Eu adoraria ter este livro, mas por que tudo que é bíblico precisa ter um preço? Eu realmente fiquei animada com este livro, mas por favor entendam que meu orçamento está muito apertado neste momento. Espero que todos que comprem isso gostem. Tenho certeza de que eu gostaria.",
        image: "/reviews/depo14.jpg",
      },
      {
        author: "Amanda R.",
        text: "Este Guia de Estudo Bíblico me ajudou a desacelerar e realmente entender as Escrituras. As perguntas são claras e significativas.",
        image: "/reviews/depo01.jpg",
      },
      {
        author: "Gabriela T.",
        text: "Meus pais me deram isso de aniversário, e desde então tenho usado todos os dias. Gosto de poder estudar no meu próprio ritmo, mas também compartilhar percepções com meus irmãos ou amigos. Isso nos aproximou como família, e é maravilhoso ter algo que incentiva reflexão e discussão sobre as Escrituras juntos.",
        image: "/reviews/depo02.jpg",
      },
      {
        author: "Juliana M.",
        text: "Minha irmã comprou este Guia de Estudo Bíblico para mim de presente, e eu não sabia bem o que esperar, mas tem sido incrível. As perguntas me fazem refletir profundamente, e é perfeito para estudar sozinha ou até discutir com a família. Sinto que estamos crescendo juntos espiritualmente, e tem sido um presente muito atencioso e útil.",
        image: "/reviews/depo03.jpg",
      },
      {
        author: "Fernanda E.",
        text: "Estudar dessa forma fez as Escrituras ganharem vida para mim. Eu não apenas leio palavras; eu penso, reflito e vejo como elas impactam minha vida. Tem sido transformador e renovou meu amor pela Bíblia.",
        image: "/reviews/depo04.jpg",
      },
      {
        author: "Beatriz L.",
        text: "Sempre que termino uma sessão, me sinto encorajada e pensativa. As perguntas me guiam para aplicar o que li de uma forma significativa, e notei meu crescimento espiritual nas últimas semanas.",
        image: "/reviews/depo05.jpg",
      },
      {
        author: "Mônica R.",
        text: "Cada pergunta me faz pensar sobre o versículo de uma forma pessoal. Percebo que escrevo mais no diário, oro de forma mais intencional e me sinto mais conectada a Deus do que quando apenas lia.",
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
