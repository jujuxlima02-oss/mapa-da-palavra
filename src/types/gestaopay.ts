/**
 * Tipos da API GestãoPay — baseados em chamada de teste real (2026-04-14)
 * 
 * Referência: docs/gestaopay-normalizado.md
 */

// ─── Payload de criação ───────────────────────────────────────

export interface GestaoPayCustomerDocument {
  number: string; // CPF ou CNPJ (somente dígitos)
  type: "cpf" | "cnpj";
}

export interface GestaoPayCustomer {
  name: string;
  email: string;
  phone: string;
  document: GestaoPayCustomerDocument;
}

export interface GestaoPayItem {
  title: string;
  unit_price: number; // Em centavos
  quantity: number;
  tangible: boolean;
  external_ref?: string;
}

export interface GestaoPayPixConfig {
  expires_in_days: number;
}

export interface GestaoPayMetadata {
  provider_name: string;
  offer_source?: string;
  order_id?: string;
  [key: string]: unknown;
}

export interface GestaoPayCreatePayload {
  amount: number; // Em centavos
  payment_method: "pix";
  postback_url: string;
  customer: GestaoPayCustomer;
  items: GestaoPayItem[];
  pix?: GestaoPayPixConfig;
  metadata: GestaoPayMetadata;
  shipping?: {
    fee: number;
    address: {
      street: string;
      number: string;
      complement?: string;
      zip_code: string;
      neighborhood?: string;
      city: string;
      state: string;
    }
  }
}

// ─── Resposta de criação (POST) ───────────────────────────────

export interface GestaoPayPixData {
  qr_code: string;          // Código copia-e-cola EMV/BRCode (NÃO é imagem)
  url: string | null;       // URL da imagem QR Code (retorna null)
  expiration_date: string;  // Data de expiração (retorna "0001-01-01T00:00:00" = zero date)
  e2_e: string | null;      // Identificador E2E do Banco Central
}

export interface GestaoPayTransactionData {
  id: string;
  amount: number;           // Na criação: centavos | No GET: reais
  installments: number;
  payment_method: string;
  status: string;
  postback_url: string;
  card: null;
  boleto: null;
  pix: GestaoPayPixData;
}

export interface GestaoPayCreateResponse {
  data: GestaoPayTransactionData;
  success: boolean;
  return_message_type: number;
  error_messages: string[];
  inner_exception: string | null;
}

// ─── Resposta de busca (GET) ──────────────────────────────────

export interface GestaoPayGetTransactionData extends GestaoPayTransactionData {
  created_at: string;          // Formato: "dd/MM/yyyy HH:mm:ss" (brasileiro!)
  updated_at: string;          // Formato: ISO 8601
  company_id: string;
  acquirer_id: string;
  external_id: string;
  paid_at: string;             // "0001-01-01T00:00:00" quando não pago
  refunded_amount: number | null;
  anticipation_status: string | null;
  metadata: Record<string, unknown>;
  traceable: boolean;
  secure_id: string | null;
  secure_url: string | null;
  ip: string | null;
  customer: {
    id: string;
    name: string;
    email: string;
    document: GestaoPayCustomerDocument;
    phone: string;
  };
  shipping: null;
  refund: null;
  refused_reason: string | null;
  items: Array<{
    title: string;
    unit_price: number;       // Em REAIS no GET (não centavos!)
    quantity: number;
    tangible: boolean;
    external_ref: string | null;
  }>;
  fee_details: {
    id: string;
    amount: number;
    splits: null;
    total_fee: number;
    total_amount: number;
  };
  delivery: null;
}

export interface GestaoPayGetResponse {
  data: GestaoPayGetTransactionData;
  success: boolean;
  return_message_type: number;
  error_messages: string[];
  inner_exception: string | null;
}

// ─── Webhook (Postback) ──────────────────────────────────────

/** 
 * ⚠️ Campos em PascalCase! (diferente do resto da API que é snake_case) 
 * ⚠️ Amount em REAIS (não centavos!)
 */
export interface GestaoPayWebhookPayload {
  Id: string;
  CreatedAt: string;           // Formato: "dd/MM/yyyy HH:mm:ss"
  UpdatedAt: string;           // Formato: ISO 8601
  ExternalId: string;
  PaidAt: string;              // "0001-01-01T00:00:00" quando não pago
  Amount: number;              // Em REAIS (não centavos!)
  Installments: number;
  PaymentMethod: string;
  Status: string;              // PENDING | PAID | EXPIRED | REFUNDED | REFUSED | ERROR
  PostbackUrl: string;
}

/** Webhook normalizado para uso interno */
export interface NormalizedWebhookData {
  gatewayId: string;
  status: string;
  amountReais: number;
  paidAt: Date | null;
}
