import React from "react";
import type { Metadata } from "next";
import Image from "next/image";
import { UrgencyBar } from "@/components/landing/UrgencyBar";
import { Hero } from "@/components/landing/Hero";
import { SocialProof } from "@/components/landing/SocialProof";
import { Problem } from "@/components/landing/Problem";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { Pricing } from "@/components/landing/Pricing";
import { Guarantee } from "@/components/landing/Guarantee";
import { FAQ } from "@/components/landing/FAQ";
import { StickyCTA } from "@/components/landing/StickyCTA";
import { Footer } from "@/components/landing/Footer";
import { BuyNotification } from "@/components/landing/BuyNotification";
import { CampaignCheckoutLink } from "@/components/landing/CampaignCheckoutLink";
import { featureFlags } from "@/lib/featureFlags";

export const metadata: Metadata = {
  title: "Mapa da Palavra | Dia das Mães",
  description: "Mapa da Palavra é um presente cristão para sua mãe viver um encontro diário com a Palavra.",
  openGraph: {
    title: "Mapa da Palavra | Dia das Mães",
    description: "Neste Dia das Mães, dê mais do que um presente.",
    url: "https://mapadapalavra.online/dia-das-maes",
    siteName: "Mapa da Palavra",
    locale: "pt_BR",
    type: "website",
  },
};

export default function DiaDasMaesPage() {
  const offerSource = "dia-das-maes";

  return (
    <main className="flex min-h-screen flex-col bg-[var(--color-bg)]">
      {featureFlags.landingExperiments.buyNotificationTest.enabled &&
        featureFlags.landingExperiments.buyNotificationTest.pages.diaDasMaes && (
          <BuyNotification page="diaDasMaes" />
        )}
      
      <UrgencyBar 
        text="⚠️ Para receber até o Dia das Mães (10/05), garanta seu pedido até 08/05"
        ctaText="Quero garantir esse presente"
        offerSource={offerSource}
      />

      <Hero 
        headline="Um presente que ela vai usar todo dia."
        subheadline="Neste Dia das Mães, dê o Mapa da Palavra — um convite diário para encontro com Deus."
        buttonMainText="Quero garantir esse presente para minha mãe"
        buttonSecondaryText="Ver o que vem no presente"
        supportLine="Presente físico com Colar Coração de Jesus incluso • Garantia de 30 dias"
        offerSource={offerSource}
      />

      <SocialProof 
        label="Quem presenteou aprovou"
        template="Minha mãe amou. Foi o presente mais significativo que eu dei. Ela usa até hoje."
      />

      <Problem 
        label="Chega de dar mais do mesmo"
        texts={[
          "Todo ano acontece a mesma coisa: você quer acertar no presente, mas percebe que quase tudo cai no lugar de sempre. Caneca, flores, roupa, perfume. Bonito, sim. Memorável, nem sempre.",
          "Se a sua mãe é cristã, faz sentido querer algo que dure além do dia da entrega. Algo que não seja só útil por uma tarde, mas significativo por muito mais tempo.",
          "É exatamente por isso que o Mapa da Palavra entra tão bem aqui: ele acompanha, inspira e ajuda sua mãe a viver a fé com mais clareza."
        ]}
        ctaText="Quero um presente com significado"
        offerSource={offerSource}
        image={{
          src: "/assets/imagem-produto.webp",
          alt: "Diário Bíblico Mapa da Palavra",
          width: 768,
          height: 576,
        }}
      />

      <HowItWorks 
        label="O que torna esse presente especial"
        introText="Esse presente é diferente porque não tenta impressionar só no embrulho. Ele impressiona no significado. Enquanto muitos presentes duram pouco, o Mapa da Palavra entra na rotina espiritual da sua mãe e continua entregando valor depois da data."
        conclusionText="Ele também é diferente porque fala com mulheres que amam a Bíblia. Não é um presente genérico 'cristão' de prateleira. É uma forma concreta de dizer: eu conheço o que é importante para você."
        ctaText="Ver como funciona"
        offerSource={offerSource}
      />

      {/* Ideal para mães como essas */}
      <section className="bg-[var(--color-bg)] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-sm font-semibold tracking-wide uppercase text-[var(--color-accent)] mb-6 font-mono">Ideal para mães como essas</h2>
            <div className="relative mx-auto mb-10 max-w-xl overflow-hidden rounded-2xl shadow-sm ring-1 ring-[var(--color-border)] aspect-[4/3]">
                {/* TODO: substituir por asset final do Nanobanana — Briefing 7: Mãe cristã brasileira // PLACEHOLDER */}
                <Image
                  src="/assets/imagem_mapa_palavra2.webp"
                  alt="Mãe cristã brasileira lendo o guia visual da Bíblia em um ambiente acolhedor"
                  width={672}
                  height={504}
                  sizes="(max-width: 1024px) 100vw, 672px"
                  style={{ aspectRatio: "4 / 3" }}
                  className="object-cover"
                  quality={72}
                />
            </div>
            <div className="max-w-xl mx-auto bg-[var(--color-surface)] p-8 rounded-2xl border border-[var(--color-border)] flex flex-col items-start text-left mb-10">
                <ul className="space-y-4">
                  <li className="flex gap-3 text-[var(--color-text)]">✅ <span>Amam ler a Bíblia</span></li>
                  <li className="flex gap-3 text-[var(--color-text)]">✅ <span>Valorizam coisas com propósito</span></li>
                  <li className="flex gap-3 text-[var(--color-text)]">✅ <span>Gostam de presentes úteis e bonitos</span></li>
                  <li className="flex gap-3 text-[var(--color-text)]">✅ <span>Estão em uma fase de buscar mais profundidade espiritual</span></li>
                  <li className="flex gap-3 text-[var(--color-text)]">✅ <span>Ficam felizes quando percebem cuidado real na escolha</span></li>
                </ul>
            </div>
            <CampaignCheckoutLink offerSource={offerSource}>
              <button className="mx-auto w-full rounded-full bg-[var(--color-accent)] px-8 py-4 font-bold text-[var(--color-text)] transition-colors hover:bg-[var(--color-accent-hover)] sm:w-auto">
                Quero garantir o presente dela agora →
              </button>
            </CampaignCheckoutLink>
            <p className="mt-3 text-sm font-medium text-[var(--color-text-muted)]">R$ 39,90 • Colar Coração de Jesus incluso • Garantia de 30 dias</p>
        </div>
      </section>

      <Pricing 
        label="Preço especial de Dia das Mães"
        texts={[
          "Oferta especial de Dia das Mães disponível até 08/05/2026. Garanta agora o Mapa da Palavra por R$ 39,90 e receba também o Colar Coração de Jesus, um presente que torna a homenagem ainda mais especial.",
          "Correios: entrega em 6 a 12 dias úteis | Expresso: 3 a 6 dias úteis"
        ]}
        buttonText="Garantir meu presente agora"
        cepPlaceholder="Digite seu CEP para ver o prazo"
        offerSource={offerSource}
      />

      {/* Brinde incluso */}
      <section className="bg-[var(--color-primary-highlight)] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="relative mx-auto mb-8 max-w-md overflow-hidden rounded-2xl bg-[var(--color-surface-2)] shadow-sm ring-1 ring-[var(--color-border)] aspect-[4/3]">
                {/* TODO: substituir por asset final do Nanobanana — Briefing 9: Brinde colar Coração de Jesus // PLACEHOLDER */}
                <Image
                  src="/assets/colar_coracao_jesus.png"
                  alt="Colar Coração de Jesus em close delicado sobre fundo claro"
                  width={448}
                  height={336}
                  sizes="(max-width: 1024px) 100vw, 448px"
                  style={{ aspectRatio: "4 / 3" }}
                  className="object-cover"
                />
            </div>
            <h2 className="text-2xl font-bold text-[var(--color-text)] mb-4">Colar Coração de Jesus incluso</h2>
            <p className="text-[var(--color-text-muted)] max-w-2xl mx-auto mb-8">
               Ganhe de presente ao comprar hoje o <strong>Colar Coração de Jesus</strong>, um brinde físico pensado para acompanhar o Mapa da Palavra com ainda mais significado:<br/><br/>
               • Colar em forma de coração com a palavra Jesus<br/>
               • Presente afetivo com valor espiritual percebido<br/>
               • Exclusivo da oferta de Dia das Mães
            </p>
        </div>
      </section>

      <Guarantee 
        label="Compra segura"
        text="Você também conta com garantia de 30 dias, para comprar com mais tranquilidade."
        linkText="Ver garantia"
        showGiftCarousel
      />

      <FAQ 
        label="Dúvidas comuns antes de presentear"
        questions={[
          { question: "Dá tempo de chegar antes do Dia das Mães?", answer: "Faça seu pedido até 08/05/2026. O prazo exato aparece no checkout com base no seu CEP." },
          { question: "O presente vem com embalagem especial?", answer: "O produto vem em apresentação cuidadosa. A compra também inclui o Colar Coração de Jesus, brinde físico exclusivo da oferta de Dia das Mães." },
          { question: "É um bom presente para mãe cristã?", answer: "Sim. O produto foi pensado exatamente para mulheres que valorizam a Palavra e presentes com propósito." },
          { question: "Posso mandar direto para o endereço da minha mãe?", answer: "Sim. No checkout você pode informar o endereço de entrega desejado." },
          { question: "O brinde vem junto?", answer: "Sim. Ao comprar a oferta de Dia das Mães, você recebe o Colar Coração de Jesus como brinde exclusivo." },
          { question: "O produto tem garantia?", answer: "Sim, você conta com garantia de 30 dias." }
        ]}
        supportLinkText="Falar com a equipe"
      />

      <StickyCTA 
        texto="Neste Dia das Mães, dê algo que fale ao coração e fortaleça a fé dela. Um presente com propósito, cuidado e Palavra de Deus para a rotina."
        botao="Quero garantir esse presente para minha mãe"
        linhaAbaixo="R$ 39,90 • Colar Coração de Jesus incluso • Garantia de 30 dias"
        offerSource={offerSource}
      />

      <Footer />
    </main>
  );
}
