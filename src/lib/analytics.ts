/**
 * Camada de abstração do Google Tag Manager — Mapa da Palavra
 * 
 * Centraliza todos os eventos de tracking do projeto.
 * Cada evento inclui `offer_source` quando relevante.
 */

type AnalyticsValue = string | number | boolean | null | undefined;
type AnalyticsParams = Record<string, AnalyticsValue>;
type DataLayerPayload = { event: string } & AnalyticsParams;

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
  }
}

/**
 * Envia um payload seguro para o dataLayer do GTM.
 */
export function pushToDataLayer(payload: DataLayerPayload) {
  if (typeof window === "undefined") return;

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(payload);
}

/**
 * Dispara um evento genérico via GTM
 */
export function trackEvent(
  eventName: string,
  params?: AnalyticsParams
) {
  pushToDataLayer({
    event: eventName,
    ...(params ?? {}),
  });
}

/**
 * Eventos específicos do fluxo de conversão
 */
export const analytics = {
  /** Expor trackEvent genérico */
  trackEvent,

  /** Clique no CTA da landing page */
  ctaClick: (offerSource: string, position: string, ctaText?: string) =>
    trackEvent("cta_click", {
      offer_source: offerSource,
      cta_position: position,
      ...(ctaText !== undefined ? { cta_text: ctaText } : {}),
    }),

  /** Início do checkout (carregamento da página de checkout) */
  beginCheckout: (offerSource: string, value: number) =>
    trackEvent("begin_checkout", {
      offer_source: offerSource,
      value: value / 100, // GA4 espera valor em reais
      currency: "BRL",
    }),

  /** PIX gerado com sucesso */
  pixGenerated: (offerSource: string, orderId: string, value: number) =>
    trackEvent("pix_generated", {
      offer_source: offerSource,
      order_id: orderId,
      value: value / 100,
      currency: "BRL",
    }),

  /** Código PIX copiado para clipboard */
  pixCodeCopied: (orderId: string) =>
    trackEvent("pix_code_copied", { order_id: orderId }),

  /** Compra confirmada (pagamento realizado) */
  purchase: (
    offerSource: string,
    value: number,
    transactionId: string
  ) =>
    trackEvent("purchase", {
      offer_source: offerSource,
      value: value / 100,
      currency: "BRL",
      transaction_id: transactionId,
    }),

  /** Checkout abandonado (saiu do checkout sem finalizar) */
  checkoutAbandoned: (offerSource: string, step: string) =>
    trackEvent("checkout_abandoned", {
      offer_source: offerSource,
      step,
    }),
};
