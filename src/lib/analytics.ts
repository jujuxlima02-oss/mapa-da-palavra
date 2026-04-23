/**
 * Camada de abstração do Google Analytics 4 — Mapa da Palavra
 * 
 * Centraliza todos os eventos de tracking do projeto.
 * Cada evento inclui `offer_source` quando relevante.
 */

// Declarar gtag no window para TypeScript
declare global {
  interface Window {
    gtag?: (
      command: "config" | "event" | "js" | "set",
      targetId: string,
      config?: Record<string, string | number | boolean | null | undefined>
    ) => void;
  }
}

/**
 * Dispara um evento GA4 genérico
 */
export function trackEvent(
  eventName: string,
  params?: Record<string, string | number | boolean | null | undefined>
) {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", eventName, params);
  }
}

/**
 * Eventos específicos do fluxo de conversão
 */
export const analytics = {
  /** Expor trackEvent genérico */
  trackEvent,

  /** Clique no CTA da landing page */
  ctaClick: (offerSource: string, position: string) =>
    trackEvent("cta_click", {
      offer_source: offerSource,
      cta_position: position,
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
