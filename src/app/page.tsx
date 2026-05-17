import Image from "next/image";
import type { Metadata } from "next";
import { UrgencyBar } from "@/components/landing/UrgencyBar";
import { SocialProof } from "@/components/landing/SocialProof";
import { Guarantee } from "@/components/landing/Guarantee";
import { FAQ } from "@/components/landing/FAQ";
import { Footer } from "@/components/landing/Footer";
import { BuyNotification } from "@/components/landing/BuyNotification";
import { CampaignCheckoutLink } from "@/components/landing/CampaignCheckoutLink";
import { DIGITAL_GIFTS, PRODUCT, SHIPPING } from "@/lib/constants";
import { featureFlags } from "@/lib/featureFlags";

const productName = PRODUCT.name;
const productShortName = "Mapa da Palavra";

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
              Você não está perdido por falta de fé. Você precisa de um mapa para guiar sua leitura bíblica.
            </h1>
            <div className="mt-6 space-y-4 text-lg leading-8 text-[var(--color-dark-text)]/80">
              <p>
                O {productShortName} é um guia físico para organizar sua leitura, orientar sua reflexão e abrir espaço para registrar o que Deus está tratando no seu coração.
              </p>
              <p>
                É uma forma simples de transformar intenção em rotina: Bíblia aberta, mapa nas mãos, caneta, oração e constância.
              </p>
            </div>
            <div className="mt-8 space-y-5">
              <PriceLine inverse />
              <CheckoutLink variant="light">
                Quero meu Mapa da Palavra
              </CheckoutLink>
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
            Chega de aceitar uma vida devocional rasa como se isso fosse normal.
          </h2>
          <div className="mt-8 space-y-6 text-lg leading-8 text-[var(--color-dark-text)]/80">
            <p>
              Você vive cercado de mensagens, cortes de pregação, frases bonitas e versículos soltos. Mas quando chega a hora de sentar sozinho com a Bíblia aberta, o silêncio denuncia uma verdade: falta estrutura.
            </p>
            <p>
              Não aceite a mentira de que essa distância de Deus é definitiva. Também não transforme sua culpa em identidade. Existe uma dispersão diária tentando roubar sua atenção, sua constância e sua profundidade.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-[var(--color-surface)] py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <p className="mb-5 text-sm font-bold uppercase tracking-[0.2em] text-[var(--color-accent)]">
              Habacuque 2:2
            </p>
            <h2 className="text-3xl font-black tracking-tight text-[var(--color-text)] sm:text-4xl">
              Quando a fé ganha página, data e registro, a caminhada deixa de depender da memória.
            </h2>
            <div className="mt-8 space-y-5 text-lg leading-8 text-[var(--color-text-muted)]">
              <p>
                O {productShortName} organiza sua jornada diária pela Bíblia com mapas temáticos, reflexões orientadas e espaço para registro pessoal. Você lê, medita, responde, anota, revisita e acompanha o que Deus está formando em você.
              </p>
              <p>
                Cada página se torna um marco. Cada anotação, um memorial. Cada dia, uma resposta prática ao chamado de Deus.
              </p>
            </div>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {DIGITAL_GIFTS.map((gift) => (
              <article
                key={gift.name}
                className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-2)] p-6 shadow-sm"
              >
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--color-accent)]">
                  Brinde digital
                </p>
                <h3 className="mt-3 text-xl font-black text-[var(--color-text)]">
                  {gift.name}
                </h3>
                <p className="mt-4 text-base leading-7 text-[var(--color-text-muted)]">
                  {gift.description}
                </p>
              </article>
            ))}
          </div>

          <div className="mt-12 text-center">
            <PriceLine />
            <div className="mt-5">
              <CheckoutLink>Quero começar com o Mapa da Palavra</CheckoutLink>
            </div>
          </div>
        </div>
      </section>

      <SocialProof
        label="Testemunhos"
        template={`Pessoas reais avaliando sua jornada com ${productShortName}.`}
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
                {DIGITAL_GIFTS.map((gift) => (
                  <li key={gift.name} className="flex gap-3">
                    <span className="font-black text-[var(--color-success)]">✓</span>
                    <span>
                      <strong className="text-[var(--color-text)]">{gift.name}</strong>: {gift.description}
                    </span>
                  </li>
                ))}
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
            Quantos dias mais você vai chamar de “depois” aquilo que Deus está chamando de hoje?
          </h2>
          <div className="mt-8 space-y-5 text-lg leading-8 text-[var(--color-dark-text)]/80">
            <p>
              Você sabe que precisa voltar. Sabe que a Bíblia fechada pesa. Sabe que sua alma sente falta de direção. Mas a rotina empurra, o celular captura, o cansaço vence, e mais uma semana passa.
            </p>
            <p>
              O {productShortName} é o convite para sair do ciclo de culpa e entrar no caminho da constância. Não pela força do grito. Não por pressão vazia. Mas por uma decisão clara: separar tempo, abrir a Palavra, escrever, orar e continuar.
            </p>
          </div>
          <div className="mt-10 space-y-5">
            <PriceLine inverse />
            <CheckoutLink variant="light">Começar minha jornada com o Mapa da Palavra</CheckoutLink>
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
          { question: "O que é o Mapa da Palavra?", answer: `O ${productShortName} é um guia físico para organizar leitura bíblica, reflexão e registro pessoal.` },
          { question: "Recebo brindes digitais?", answer: "Sim. Os brindes digitais são liberados imediatamente após a confirmação do pagamento." },
          { question: "Preciso já conhecer bem a Bíblia?", answer: "Não. O material foi pensado para quem quer começar com direção e constância." },
          { question: "O produto principal é físico?", answer: "Sim. Você recebe o produto principal no endereço informado no checkout." },
          { question: "Qual o prazo de entrega?", answer: `Correios: ${SHIPPING.free.days}. Expresso: ${SHIPPING.express.days}. O prazo final aparece no checkout conforme a modalidade escolhida.` },
          { question: "Tem garantia?", answer: "Sim, você conta com garantia de 30 dias." },
        ]}
        supportLinkText="Falar com atendimento"
      />

      <Footer />
    </main>
  );
}
