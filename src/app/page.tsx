import Image from "next/image";
import type { Metadata } from "next";
import { UrgencyBar } from "@/components/landing/UrgencyBar";
import { SocialProof } from "@/components/landing/SocialProof";
import { Guarantee } from "@/components/landing/Guarantee";
import { FAQ } from "@/components/landing/FAQ";
import { Footer } from "@/components/landing/Footer";
import { BuyNotification } from "@/components/landing/BuyNotification";
import { CampaignCheckoutLink } from "@/components/landing/CampaignCheckoutLink";
import { ProductCarousel } from "@/components/landing/ProductCarousel";
import { DIGITAL_GIFTS, PRODUCT } from "@/lib/constants";
import { featureFlags } from "@/lib/featureFlags";

const productName = PRODUCT.name;
const productShortName = "Mapa da Palavra";
const giftImages: Record<string, { src: string; alt: string; width: number; height: number }> = {
  "66 Cards Mapa da Palavra": {
    src: "/assets/brinde-66-cards.png",
    alt: "66 Cards Bíblicos - um card por livro da Bíblia",
    width: 1920,
    height: 1080,
  },
  "Diário de Fé Mapa da Palavra": {
    src: "/assets/brinde-diario-de-fe.png",
    alt: "Diário de Fé Mapa da Palavra - folha devocional para registro diário",
    width: 300,
    height: 300,
  },
  "Guia de Estudo em 30 Dias": {
    src: "/assets/brinde-guia-30-dias.png",
    alt: "Guia de Estudo em 30 Dias Mapa da Palavra em dispositivos digitais",
    width: 300,
    height: 300,
  },
};

export const metadata: Metadata = {
  title: `${productName} | Guia físico para sua leitura bíblica`,
  description: `Guie sua leitura bíblica, registre suas reflexões e construa uma rotina devocional com o ${productName}. De ${PRODUCT.originalPriceFormatted} por ${PRODUCT.priceFormatted}.`,
  alternates: {
    canonical: "https://mapadapalavra.online",
  },
  openGraph: {
    title: `${productName} | Guia físico para sua leitura bíblica`,
    description: `Guie sua leitura bíblica, registre suas reflexões e construa uma rotina devocional com o ${productName}. De ${PRODUCT.originalPriceFormatted} por ${PRODUCT.priceFormatted}.`,
    url: "https://mapadapalavra.online",
    siteName: productName,
    images: [
      {
        url: "https://mapadapalavra.online/assets/imagem_mapa_palavra4.webp",
        width: 1200,
        height: 1200,
        alt: productName,
      },
    ],
    locale: "pt_BR",
    type: "website",
  },
};

const offerSource = "evergreen";

function CheckoutLink({
  children,
  variant = "primary",
}: {
  children: React.ReactNode;
  variant?: "primary" | "light";
}) {
  const classes =
    variant === "light"
      ? "inline-flex min-h-12 w-full items-center justify-center rounded-lg bg-[var(--color-surface-2)] px-6 py-3 text-center text-sm font-bold uppercase tracking-wide text-[var(--color-primary)] shadow-sm transition hover:bg-[var(--color-surface)] sm:w-auto"
      : "inline-flex min-h-12 w-full items-center justify-center rounded-lg bg-[var(--color-primary)] px-6 py-3 text-center text-sm font-bold uppercase tracking-wide text-[var(--color-text-inverse)] shadow-lg transition hover:bg-[var(--color-primary-hover)] sm:w-auto";

  return (
    <CampaignCheckoutLink offerSource={offerSource} className={classes}>
      {children}
    </CampaignCheckoutLink>
  );
}

function PriceLine({ inverse = false }: { inverse?: boolean }) {
  return (
    <p className={inverse ? "text-base font-semibold text-[var(--color-dark-text)]/90" : "text-base font-semibold text-[var(--color-text)]"}>
      De <span className="line-through opacity-70">{PRODUCT.originalPriceFormatted}</span>{" "}
      por <span className="text-xl font-black">{PRODUCT.priceFormatted}</span>
    </p>
  );
}

export default function EvergreenPage() {
  return (
    <main className="flex min-h-screen flex-col bg-[var(--color-bg)]">
      {featureFlags.landingExperiments.buyNotificationTest.enabled &&
        featureFlags.landingExperiments.buyNotificationTest.pages.evergreen && (
          <BuyNotification page="evergreen" />
        )}

      <UrgencyBar
        text={`Hoje você pode começar com direção: ${productShortName} de ${PRODUCT.originalPriceFormatted} por ${PRODUCT.priceFormatted}.`}
        ctaText="Quero meu Mapa da Palavra"
        offerSource={offerSource}
      />

      <section className="relative overflow-hidden bg-[var(--color-dark-section)] pt-16 pb-20 lg:pt-24 lg:pb-28">
        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-[var(--color-accent-highlight)]/20" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div className="max-w-2xl text-left">
            <p className="mb-5 text-sm font-bold uppercase tracking-[0.2em] text-[var(--color-accent)]">
              Salmos 119:105
            </p>
            <h1 className="text-4xl font-extrabold tracking-tight text-[var(--color-dark-text)] sm:text-5xl lg:text-6xl">
              Um guia físico para ajudar você a voltar ao seu tempo com Deus com clareza e constância.
            </h1>
            <div className="mt-6 space-y-4 text-lg leading-8 text-[var(--color-dark-text)]/80">
              <p>
                O Mapa da Palavra foi pensado para acompanhar sua leitura bíblica, sua oração e seus registros devocionais de forma simples, prática e possível para a vida real.
              </p>
            </div>
            <div className="mt-8 space-y-5">
              <PriceLine inverse />
              <CheckoutLink variant="light">
                Quero começar meu tempo com Deus
              </CheckoutLink>
              <p className="text-sm font-medium text-[var(--color-dark-text)]/70">
                Separe um tempo. Abra a Palavra. Registre o que Deus ministrar ao seu coração.
              </p>
            </div>
          </div>
          <div className="lg:pl-6">
            <div className="relative mx-auto w-full max-w-4xl overflow-hidden rounded-xl bg-[var(--color-surface)] shadow-2xl">
              <Image
                src="/assets/imagem_mapa_palavra4.webp"
                alt={productShortName}
                width={1024}
                height={576}
                sizes="(max-width: 1024px) 100vw, 1024px"
                className="h-auto w-full object-contain"
                quality={75}
                priority
              />
              <div className="absolute inset-0 rounded-xl ring-1 ring-inset ring-[var(--color-border)]/30" />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[var(--color-dark-section)] py-20 text-[var(--color-dark-text)]">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <p className="mb-5 text-sm font-bold uppercase tracking-[0.2em] text-[var(--color-accent)]">
            Oséias 4:6
          </p>
          <h2 className="text-3xl font-black tracking-tight sm:text-4xl">
            Benefícios para sua vida devocional
          </h2>
          <div className="mt-8 space-y-6 text-lg leading-8 text-[var(--color-dark-text)]/80">
            <p>
              Organiza sua rotina devocional sem deixar tudo pesado ou complicado.
            </p>
            <p>
              Ajuda você a ler a Bíblia com mais direção e menos dispersão.
            </p>
            <p>
              Cria espaço para oração, reflexão e registro do que foi ministrado ao coração.
            </p>
            <p>
              Favorece constância para quem deseja caminhar com mais presença no dia a dia.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-[var(--color-surface)] py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
            <p className="mb-5 text-sm font-bold uppercase tracking-[0.2em] text-[var(--color-accent)]">
              Habacuque 2:2
            </p>
            <h2 className="text-3xl font-black tracking-tight text-[var(--color-text)] sm:text-4xl">
              Como funciona
            </h2>
            <ol className="mx-auto mt-8 flex max-w-2xl flex-col gap-5 text-left text-lg leading-8 text-[var(--color-text-muted)]">
              <li className="grid grid-cols-[2rem_minmax(0,1fr)] items-start gap-x-3">
                <span className="pt-px font-semibold tabular-nums text-[var(--color-text)]">
                  1.
                </span>
                <span className="min-w-0">
                  Abra o guia e siga a proposta do momento devocional.
                </span>
              </li>
              <li className="grid grid-cols-[2rem_minmax(0,1fr)] items-start gap-x-3">
                <span className="pt-px font-semibold tabular-nums text-[var(--color-text)]">
                  2.
                </span>
                <span className="min-w-0">
                  Leia, ore e registre aquilo que mais falou com você.
                </span>
              </li>
              <li className="grid grid-cols-[2rem_minmax(0,1fr)] items-start gap-x-3">
                <span className="pt-px font-semibold tabular-nums text-[var(--color-text)]">
                  3.
                </span>
                <span className="min-w-0">
                  Retorne no dia seguinte e continue sua jornada com mais clareza e direção.
                </span>
              </li>
            </ol>
          </div>

          <ProductCarousel />

          <div className="mx-auto mt-16 max-w-3xl text-center">
            <p className="mb-5 text-sm font-bold uppercase tracking-[0.2em] text-[var(--color-accent)]">
              Conteúdos inclusos
            </p>
            <h2 className="text-3xl font-black tracking-tight text-[var(--color-text)] sm:text-4xl">
              Você também recebe 3 materiais para acompanhar sua rotina
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-[var(--color-text-muted)]">
              Recursos pensados para ajudar você a meditar, registrar e seguir sua leitura com mais clareza e constância.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {DIGITAL_GIFTS.map((gift) => {
              const giftImage = giftImages[gift.name];

              return (
                <article
                  key={gift.name}
                  className="overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-2)] shadow-sm"
                >
                  {giftImage && (
                    <div className="relative aspect-[4/3] w-full overflow-hidden bg-[var(--color-surface)]">
                      <Image
                        src={giftImage.src}
                        alt={giftImage.alt}
                        width={giftImage.width}
                        height={giftImage.height}
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="h-full w-full object-contain p-4"
                        loading="lazy"
                        quality={75}
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <h3 className="text-xl font-black text-[var(--color-text)]">
                      {gift.name}
                    </h3>
                    <p className="mt-4 text-base leading-7 text-[var(--color-text-muted)]">
                      {gift.description}
                    </p>
                  </div>
                </article>
              );
            })}
          </div>

          <div className="mt-12 text-center">
            <PriceLine />
            <div className="mt-5">
              <CheckoutLink>Quero começar meu tempo com Deus</CheckoutLink>
            </div>
          </div>
        </div>
      </section>

      <SocialProof
        label="Histórias reais"
        template="Conversas reais de pessoas que retomaram sua rotina com mais direção, constância e presença na Palavra."
      />

      <section className="bg-[var(--color-bg)] py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-2)] p-6 shadow-xl sm:p-10">
            <p className="mb-5 text-sm font-bold uppercase tracking-[0.2em] text-[var(--color-accent)]">
              Mateus 6:21
            </p>
            <h2 className="text-3xl font-black tracking-tight text-[var(--color-text)] sm:text-4xl">
              O que custa mais: investir em direção agora ou continuar pagando o preço da distância espiritual?
            </h2>
            <div className="mt-8 space-y-5 text-lg leading-8 text-[var(--color-text-muted)]">
              <p>
                O {productShortName} não compra intimidade com Deus. Intimidade não se compra. Mas ele organiza seu encontro diário, dá forma à sua disciplina e coloca diante de você uma estrutura para permanecer.
              </p>
              <p>
                É uma atitude prática. Uma decisão visível. Um passo simples para tratar com seriedade aquilo que você diz que é eterno.
              </p>
            </div>

            <div className="mt-10 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
              <h3 className="text-xl font-black text-[var(--color-text)]">
                O que Deus colocou nas suas mãos
              </h3>
              <ul className="mt-6 space-y-4 text-base leading-7 text-[var(--color-text-muted)]">
                <li className="flex gap-3">
                  <span className="font-black text-[var(--color-success)]">✓</span>
                  <span>
                    <strong className="text-[var(--color-text)]">{productName}</strong>: produto principal para organizar sua jornada diária pela Palavra.
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="font-black text-[var(--color-success)]">✓</span>
                  <span>
                    Seu pedido inclui o Mapa da Palavra e 3 materiais de apoio:{" "}
                    {DIGITAL_GIFTS.map((gift) => gift.name).join(", ")}.
                  </span>
                </li>
              </ul>
            </div>

            <div className="mt-10 text-center">
              <PriceLine />
              <div className="mt-5">
                <CheckoutLink>{`Garantir meu Mapa da Palavra por ${PRODUCT.priceFormatted}`}</CheckoutLink>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[var(--color-dark-section)] py-20 text-center text-[var(--color-dark-text)]">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <p className="mb-5 text-sm font-bold uppercase tracking-[0.2em] text-[var(--color-accent)]">
            Efésios 5:15-16
          </p>
          <h2 className="text-3xl font-black tracking-tight sm:text-4xl">
            Comece sua rotina devocional com mais clareza, presença e constância.
          </h2>
          <div className="mt-8 space-y-5 text-lg leading-8 text-[var(--color-dark-text)]/80">
            <p>
              Separe um tempo possível, abra a Palavra e registre aquilo que Deus ministrar ao seu coração.
            </p>
            <p>
              O Mapa da Palavra acompanha esse momento com uma estrutura simples para você continuar no seu ritmo.
            </p>
          </div>
          <div className="mt-10 space-y-5">
            <PriceLine inverse />
            <CheckoutLink variant="light">Começar minha rotina devocional</CheckoutLink>
          </div>
        </div>
      </section>

      <Guarantee
        label="Compra segura"
        text="Você conta com garantia de 30 dias para comprar com tranquilidade. Se o material não atender ao que foi prometido, você tem um caminho claro para resolver isso."
        linkText="Ver política de garantia"
      />

      <FAQ
        label="Perguntas frequentes"
        questions={[
          { question: "O que é o Mapa da Palavra?", answer: "É um guia físico para apoiar sua leitura bíblica, oração e registros devocionais." },
          { question: "Para quem ele foi pensado?", answer: "Para quem deseja cultivar uma rotina com Deus de forma mais simples, organizada e constante." },
          { question: "Preciso já ter hábito devocional?", answer: "Não. Ele pode ajudar tanto quem está começando quanto quem deseja retomar a constância." },
          { question: "Como ele pode me ajudar na prática?", answer: "Ele oferece uma estrutura simples para você não depender apenas da disposição do dia para buscar a Deus." },
        ]}
        supportLinkText="Falar com atendimento"
      />

      <Footer />
    </main>
  );
}
