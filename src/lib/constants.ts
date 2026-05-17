/**
 * Constantes do projeto — Mapa da Palavra
 * 
 * Centraliza valores do produto, status e ofertas.
 * Todos os preços são em centavos para evitar problemas de ponto flutuante.
 */

const configuredProductName = process.env.NEXT_PUBLIC_PRODUCT_NAME;
const normalizedProductName =
  configuredProductName === "Diário Bíblico - Mapa da Palavra" ||
  configuredProductName === "Diário Bíblico — Mapa da Palavra"
    ? "Mapa da Palavra"
    : configuredProductName || "Mapa da Palavra";

export const PRODUCT = {
  name: normalizedProductName,
  priceCents: Number(process.env.NEXT_PUBLIC_PRODUCT_PRICE_CENTS) || 4990,
  get priceFormatted(): string {
    return formatCentsToBRL(this.priceCents);
  },
  originalPriceCents: 8990,
  originalPriceFormatted: "R$ 89,90",
  description: "Guia físico para leitura bíblica com mapas temáticos, reflexões orientadas e espaço para registro pessoal",
  pixExpiresInDays: 1,
} as const;

export const DIGITAL_GIFTS = [
  {
    name: "66 Cards Mapa da Palavra",
    description: "Um card para cada livro da Bíblia. Do Gênesis ao Apocalipse, cada card traz o versículo âncora e uma meditação curta para começar o dia.",
    access: "digital-immediate",
  },
  {
    name: "Diário de Fé Mapa da Palavra",
    description: "Devocional diário imprimível com campos para gratidão, leitura, oração e declaração de fé. Uma página por dia, uma vida transformada.",
    access: "digital-immediate",
  },
  {
    name: "Guia de Estudo em 30 Dias",
    description: "Os 66 livros em 30 dias. Cada dia tem livro, versículo, reflexão e desafio prático. O caminho pronto para quem não sabe por onde começar.",
    access: "digital-immediate",
  },
] as const;

export const SHIPPING = {
  free: {
    label: "Frete Grátis",
    price: 0,
    days: "6 a 12 dias úteis",
  },
  express: {
    label: "Frete Expresso",
    price: 1590,
    days: "3 a 6 dias úteis",
  },
  activeOffer: "free" as "free" | "express",
} as const;

export type ShippingMode = keyof Omit<typeof SHIPPING, "activeOffer">;

export const OFFER_SOURCES = {
  EVERGREEN: "evergreen",
  DIA_DAS_MAES: "dia-das-maes",
} as const;

export type OfferSource = (typeof OFFER_SOURCES)[keyof typeof OFFER_SOURCES];

export const VALID_OFFER_SOURCES: string[] = [OFFER_SOURCES.EVERGREEN];

export const ORDER_STATUS = {
  PENDING: "PENDING",
  PAID: "PAID",
  EXPIRED: "EXPIRED",
  ERROR: "ERROR",
} as const;

export type OrderStatus = (typeof ORDER_STATUS)[keyof typeof ORDER_STATUS];

/** Status finais — não podem ser alterados por webhook */
export const FINAL_STATUSES: string[] = [
  ORDER_STATUS.PAID,
  ORDER_STATUS.EXPIRED,
  ORDER_STATUS.ERROR,
];

/**
 * Converte centavos para formato BRL (ex: 4990 → "R$ 49,90")
 */
export function formatCentsToBRL(cents: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(cents / 100);
}
