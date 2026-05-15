/**
 * Camada de abstração do Google Tag Manager — Mapa da Palavra
 * 
 * Centraliza todos os eventos de tracking do projeto.
 * Cada evento inclui `offer_source` quando relevante.
 */

type AnalyticsValue = string | number | boolean | null | undefined;
type AnalyticsParams = Record<string, AnalyticsValue>;
type DataLayerPayload = { event: string } & AnalyticsParams;
type MetaEventOptions = {
  eventID?: string;
};
type QueuedMetaEvent = {
  eventName: string;
  params?: AnalyticsParams;
  options?: MetaEventOptions;
};

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
    __metaPixelQueue?: QueuedMetaEvent[];
    fbq?: (
      method: "track" | "trackCustom",
      eventName: string,
      params?: Record<string, AnalyticsValue>,
      options?: MetaEventOptions
    ) => void;
  }
}

export const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;

/**
 * Envia um payload seguro para o dataLayer do GTM.
 */
export function pushToDataLayer(payload: DataLayerPayload) {
  if (typeof window === "undefined") return;

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(payload);
}

function normalizeMetaParams(params?: AnalyticsParams) {
  const normalized = {
    ...(params ?? {}),
    content_name: params?.offer_source ?? params?.content_name,
    order_id: params?.order_id ?? params?.transaction_id,
  };

  return Object.fromEntries(
    Object.entries(normalized).filter(([, value]) => value !== undefined)
  ) as Record<string, AnalyticsValue>;
}

function getMetaEventName(eventName: string) {
  const eventMap: Record<string, string> = {
    begin_checkout: "InitiateCheckout",
    lead: "Lead",
    pix_generated: "AddPaymentInfo",
    purchase: "Purchase",
  };

  return eventMap[eventName];
}

function shouldSkipMetaEvent(eventName: string, eventID?: string) {
  if (typeof window === "undefined" || eventName !== "Purchase" || !eventID) return false;

  const storageKey = `meta-purchase-${eventID}`;

  try {
    if (window.sessionStorage.getItem(storageKey)) return true;
    window.sessionStorage.setItem(storageKey, "1");
  } catch {
    return false;
  }

  return false;
}

export function trackMetaEvent(
  eventName: string,
  params?: AnalyticsParams,
  options?: MetaEventOptions
) {
  if (typeof window === "undefined" || !META_PIXEL_ID) return;
  if (shouldSkipMetaEvent(eventName, options?.eventID)) return;

  if (!window.fbq) {
    window.__metaPixelQueue = window.__metaPixelQueue || [];
    window.__metaPixelQueue.push({ eventName, params, options });
    return;
  }

  window.fbq("track", eventName, normalizeMetaParams(params), options);
}

export function flushMetaPixelQueue() {
  if (typeof window === "undefined" || !window.fbq) return;

  const queuedEvents = window.__metaPixelQueue ?? [];
  window.__metaPixelQueue = [];

  for (const event of queuedEvents) {
    trackMetaEvent(event.eventName, event.params, event.options);
  }
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

  const metaEventName = getMetaEventName(eventName);

  if (metaEventName) {
    trackMetaEvent(metaEventName, params, {
      eventID: metaEventName === "Purchase"
        ? String(params?.order_id ?? params?.transaction_id ?? "")
        : undefined,
    });
  }
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

  /** Formulário validado antes de enviar para a API de checkout */
  lead: (offerSource: string, value: number) =>
    trackEvent("lead", {
      offer_source: offerSource,
      value: value / 100,
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
