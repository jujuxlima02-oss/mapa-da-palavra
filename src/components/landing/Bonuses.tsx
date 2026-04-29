import React from "react";

const bonuses = [
  {
    icon: "🃏",
    badge: "Brinde 1",
    title: "66 Cards de Versículos",
    description:
      "Um card para cada livro da Bíblia com versículo âncora e reflexão devocional. Imprima, recorte e use na sua devoção diária.",
  },
  {
    icon: "📓",
    badge: "Brinde 2",
    title: "Diário de Fé",
    description:
      "Planilha imprimível para devocional diário com espaços para gratidão, leitura, oração, versículo do dia e declaração de fé.",
  },
  {
    icon: "📅",
    badge: "Brinde 3",
    title: "Guia de Estudo em 30 Dias",
    description:
      "Plano completo para percorrer a Bíblia em 30 dias com versículo âncora, pergunta de reflexão e desafio prático por dia.",
  },
];

export default function Bonuses() {
  return (
    <section className="bg-[var(--color-accent-highlight)] py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-[var(--color-text)] sm:text-4xl">
            🎁 Bônus exclusivos para quem comprar hoje
          </h2>
          <p className="mt-4 text-lg leading-8 text-[var(--color-text-muted)]">
            Além do Guia Bíblico, você recebe 3 brindes digitais:
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {bonuses.map((bonus) => (
            <article
              key={bonus.badge}
              className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-2)] p-6 text-center shadow-sm"
            >
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[var(--color-primary-highlight)] text-3xl">
                {bonus.icon}
              </div>
              <p className="mt-5 inline-flex rounded-full bg-[var(--color-accent)] px-3 py-1 text-xs font-bold uppercase tracking-wider text-[var(--color-text-inverse)]">
                {bonus.badge}
              </p>
              <h3 className="mt-4 text-xl font-bold tracking-tight text-[var(--color-text)]">
                {bonus.title}
              </h3>
              <p className="mt-4 text-base leading-7 text-[var(--color-text-muted)]">
                {bonus.description}
              </p>
            </article>
          ))}
        </div>

        <p className="mx-auto mt-10 max-w-2xl rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] px-6 py-4 text-center text-lg font-bold text-[var(--color-text)] shadow-sm">
          Valor total dos brindes: <s>R$ 47,00</s> — seus de graça hoje
        </p>
      </div>
    </section>
  );
}
