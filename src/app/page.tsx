import React from "react";
import type { Metadata } from "next";
import { UrgencyBar } from "@/components/landing/UrgencyBar";
import { Hero } from "@/components/landing/Hero";
import { SocialProof } from "@/components/landing/SocialProof";
import { Problem } from "@/components/landing/Problem";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { Benefits } from "@/components/landing/Benefits";
import { Pricing } from "@/components/landing/Pricing";
import { Guarantee } from "@/components/landing/Guarantee";
import { FAQ } from "@/components/landing/FAQ";
import { StickyCTA } from "@/components/landing/StickyCTA";
import { Footer } from "@/components/landing/Footer";
import { BuyNotification } from "@/components/landing/BuyNotification";
import { SHIPPING } from "@/lib/constants";
import { featureFlags } from "@/lib/featureFlags";

export const metadata: Metadata = {
  title: "Mapa da Palavra | Guia Visual dos 66 Livros da Bíblia",
  description: "Mapa da Palavra é um guia visual físico para estudar os 66 livros da Bíblia com clareza, direção e aplicação prática.",
  openGraph: {
    title: "Mapa da Palavra | Guia Visual dos 66 Livros da Bíblia",
    description: "Mapa da Palavra é um guia visual físico para estudar os 66 livros da Bíblia com clareza, direção e aplicação prática.",
    url: "https://seusite.com",
    siteName: "Mapa da Palavra",
    locale: "pt_BR",
    type: "website",
  },
};

export default function EvergreenPage() {
  const offerSource = "evergreen";

  return (
    <main className="flex min-h-screen flex-col bg-[var(--color-bg)]">
      {/* Evento GA4 page_view é registrado globalmente ou via script, as seções disparam views locais */}
      {featureFlags.landingExperiments.buyNotificationTest.enabled &&
        featureFlags.landingExperiments.buyNotificationTest.pages.evergreen && (
          <BuyNotification page="evergreen" />
        )}
      
      <UrgencyBar 
        text="Hoje é dia de separar tempo santo. Mapa da Palavra está disponível por R$ 39,90 para quem quer voltar à Palavra com direção."
        ctaText="Quero firmar meu pacto"
        offerSource={offerSource}
      />

      <Hero 
        headline="Deus está te chamando para parar de ler no improviso e entrar num pacto diário com a Palavra."
        subheadline="Cada página traz autor, contexto histórico, temas centrais, propósito e aplicação prática. Você não caminha mais no escuro. Você começa a enxergar a Bíblia com ordem, profundidade e direção."
        buttonMainText="Quero firmar meu pacto"
        buttonSecondaryText="Ver como funciona"
        supportLine="Produto físico • Envio para seu endereço • Garantia de 30 dias"
        offerSource={offerSource}
      />

      <SocialProof 
        label="Testemunhos"
        template="Mais de 1.240 pessoas já decidiram separar seu tempo com Deus usando o Mapa da Palavra."
        ratingLabel="4,8/5 em 972 avaliações"
      />

      <Problem 
        label="Se isso parece com você"
        texts={[
          "Tem gente amando a Deus de verdade, mas travando na rotina da leitura. Lê, relê, marca versículo, faz devocional, e ainda assim sente o coração disperso. Não é falta de fé. Muitas vezes é falta de direção.",
          "Foi por isso que nasceu o Mapa da Palavra. Um guia físico com 66 páginas, uma para cada livro da Bíblia, para você entender quem escreveu, em que contexto, com qual propósito e como isso fala com a sua vida hoje.",
          "Você não precisa carregar culpa. Você precisa recomeçar com clareza. Quando a leitura ganha estrutura, a fé deixa de ser confusa e volta a ficar firme."
        ]}
        ctaText="Quero sair da confusão"
        offerSource={offerSource}
      />

      <HowItWorks 
        label="Como funciona"
        introText="O que torna o Mapa da Palavra diferente é o Método Página por Livro. Em vez de conteúdo solto ou visão genérica da Bíblia, ele organiza cada livro em uma página visual com cinco camadas de leitura:"
        listItems={[
          "1. Autor",
          "2. Contexto histórico",
          "3. Temas centrais",
          "4. Propósito",
          "5. Aplicação prática"
        ]}
        conclusionText="Isso muda tudo. Você para de depender de memória, anotações soltas ou explicações fragmentadas. Você passa a estudar com um mapa."
        ctaText="Quero ver o método"
        offerSource={offerSource}
      />

      <Benefits 
        label="O que você ganha"
        benefits={[
          "Você vai enxergar a Bíblia como um todo, sem se perder em meio a tantos livros e assuntos.",
          "Você vai entender melhor o contexto de cada livro e parar de ler como se tudo fosse desconectado.",
          "Você vai transformar leitura solta em estudo guiado, com mais segurança e direção.",
          "Você vai aplicar melhor o que lê, porque cada página já puxa o texto para a vida prática.",
          "Você vai ter um material bonito e organizado para usar de verdade, não só para guardar na estante."
        ]}
        ctaText="Quero separar meu tempo com Deus"
        offerSource={offerSource}
      />

      <Pricing 
        label="Preço especial"
        texts={[
          "Hoje, você pode garantir o seu Mapa da Palavra por apenas R$ 39,90.",
          "Você recebe:",
          "• 1 guia físico com 66 páginas",
          "• Conteúdo organizado por livro da Bíblia",
          "• Estrutura visual para estudo bíblico",
          "• Envio para o seu endereço"
        ]}
        buttonText="Quero firmar meu pacto"
        cepPlaceholder="Digite seu CEP para calcular o frete"
        offerSource={offerSource}
      />

      <Guarantee 
        label="Compra segura"
        text="Você conta com garantia de 30 dias para comprar com mais tranquilidade. Se o produto não atender ao que foi prometido, você tem um caminho claro para resolver isso."
        linkText="Ver política de garantia"
      />

      <FAQ 
        label="Perguntas frequentes"
        questions={[
          { question: "Isso é um devocional?", answer: "Não. É um guia de estudo bíblico visual, feito para ajudar você a entender melhor cada livro da Bíblia." },
          { question: "Preciso já conhecer bem a Bíblia?", answer: "Não. O material foi pensado para quem quer ganhar clareza, mesmo sem ser avançado." },
          { question: "O produto é físico?", answer: "Sim. Você recebe um guia físico no endereço informado." },
          { question: "Vale para quem já lê a Bíblia há anos?", answer: "Sim. Muita gente já lê há tempo e ainda assim sente falta de organização e visão geral." },
          { question: "Qual o prazo de entrega?", answer: `Correios: ${SHIPPING.free.days}. Expresso: ${SHIPPING.express.days}. O prazo final aparece no checkout conforme a modalidade escolhida.` },
          { question: "Tem garantia?", answer: "Sim, você conta com garantia de 30 dias." }
        ]}
        supportLinkText="Falar com atendimento"
      />

      <StickyCTA 
        texto="Ler a Bíblia não deveria ser um exercício de sobrevivência espiritual. Deveria ser um encontro claro, firme e transformador com a Palavra de Deus. Se você quer parar de ler no improviso e começar a enxergar com mais direção, esse guia foi feito para você."
        botao="Quero firmar meu pacto"
        linhaAbaixo="R$ 39,90 • Garantia de 30 dias • Envio para seu endereço"
        offerSource={offerSource}
      />

      <Footer />
    </main>
  );
}
