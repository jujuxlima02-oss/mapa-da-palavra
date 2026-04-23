/**
 * Constantes do projeto — Mapa da Palavra
 * 
 * Centraliza valores do produto, status e ofertas.
 * Todos os preços são em centavos para evitar problemas de ponto flutuante.
 */

export const PRODUCT = {
  name: process.env.NEXT_PUBLIC_PRODUCT_NAME || "Mapa da Palavra",
  priceCents: Number(process.env.NEXT_PUBLIC_PRODUCT_PRICE_CENTS) || 3990,
  get priceFormatted(): string {
    return formatCentsToBRL(this.priceCents);
  },
  description: "Guia visual físico para estudar os 66 livros da Bíblia",
  pixExpiresInDays: 1,
} as const;

export const BUNDLE_ITEM = {
  name: "Colar Coração de Jesus",
  description: "Brinde físico exclusivo da oferta de Dia das Mães",
  type: "physical",
} as const;

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

export const VALID_OFFER_SOURCES: string[] = Object.values(OFFER_SOURCES);

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
 * Converte centavos para formato BRL (ex: 3990 → "R$ 39,90")
 */
export function formatCentsToBRL(cents: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(cents / 100);
}
