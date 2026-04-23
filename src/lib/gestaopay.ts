/**
 * Client da API GestãoPay — Integração PIX
 * 
 * Referência: docs/gestaopay-normalizado.md (confirmado via teste real em 2026-04-14)
 * 
 * ⚠️ ATENÇÃO — Inconsistências documentadas:
 * - POST amount = centavos | GET amount = reais | Webhook Amount = reais
 * - POST/GET usa snake_case | Webhook usa PascalCase
 * - created_at no GET usa "dd/MM/yyyy HH:mm:ss" | updated_at usa ISO 8601
 * - pix.expiration_date retorna zero date — calcular manualmente
 * - data é objeto (não array) nas respostas
 * - HTTP 201 para criação (não 200)
 */

import type {
  GestaoPayCreatePayload,
  GestaoPayCreateResponse,
  GestaoPayGetResponse,
  GestaoPayWebhookPayload,
  NormalizedWebhookData,
} from "@/types/gestaopay";

const API_URL = process.env.GESTAOPAY_API_URL || "https://api.gestaopayments.com";
const PUBLIC_KEY = process.env.GESTAOPAY_PUBLIC_KEY || "";
const SECRET_KEY = process.env.GESTAOPAY_SECRET_KEY || "";

/**
 * Gera header de autenticação Basic Auth
 */
function getAuthHeader(): string {
  const credentials = Buffer.from(`${PUBLIC_KEY}:${SECRET_KEY}`).toString("base64");
  return `Basic ${credentials}`;
}

/**
 * Cria uma transação PIX na GestãoPay
 * 
 * @param payload - Dados da cobrança (amount em centavos!)
 * @returns Dados da transação criada
 * @throws Error em caso de falha de autenticação, validação ou erro interno
 */
export async function createPixTransaction(
  payload: GestaoPayCreatePayload
): Promise<GestaoPayCreateResponse> {
  const response = await fetch(`${API_URL}/v1/payment-transaction/create`, {
    method: "POST",
    headers: {
      Authorization: getAuthHeader(),
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(payload),
  });

  const json = await response.json();

  // HTTP 201 = sucesso na criação (documentação diz 200, mas realidade é 201)
  if ((response.status === 201 || response.status === 200) && json.success) {
    return json as GestaoPayCreateResponse;
  }

  // Erro de validação (400)
  if (response.status === 400) {
    const errorMsg = json.error_messages?.join(", ") || "Dados inválidos";
    console.error("[GestãoPay] Erro de validação:", json);
    throw new Error(`Erro de validação GestãoPay: ${errorMsg}`);
  }

  // Erro de autenticação (401)
  if (response.status === 401) {
    console.error("[GestãoPay] Falha de autenticação — verificar credenciais");
    throw new Error("Falha de autenticação com o gateway de pagamento");
  }

  // Erro genérico da API ou do servidor
  console.error("[GestãoPay] Erro inesperado:", response.status, json);
  throw new Error(`Erro no gateway de pagamento (${response.status})`);
}

/**
 * Busca uma transação na GestãoPay pelo ID
 * 
 * ⚠️ ATENÇÃO: amount no retorno está em REAIS (não centavos!)
 * 
 * @param transactionId - ID da transação na GestãoPay
 * @returns Dados completos da transação
 * @throws Error em caso de falha
 */
export async function getTransaction(
  transactionId: string
): Promise<GestaoPayGetResponse> {
  const response = await fetch(
    `${API_URL}/v1/payment-transaction/info/${transactionId}`,
    {
      method: "GET",
      headers: {
        Authorization: getAuthHeader(),
        Accept: "application/json",
      },
    }
  );

  const json = await response.json();

  if ((response.status === 200 || response.status === 201) && json.success) {
    return json as GestaoPayGetResponse;
  }

  console.error("[GestãoPay] Erro ao buscar transação:", response.status, json);
  throw new Error(`Erro ao consultar transação (${response.status})`);
}

/**
 * Normaliza payload do webhook (PascalCase → formato interno)
 * 
 * ⚠️ Amount no webhook é em REAIS (não centavos!)
 * ⚠️ PaidAt = "0001-01-01T00:00:00" quando não pago → tratado como null
 */
export function normalizeWebhookPayload(
  payload: GestaoPayWebhookPayload
): NormalizedWebhookData {
  const ZERO_DATE = "0001-01-01T00:00:00";

  return {
    gatewayId: payload.Id,
    status: payload.Status,
    amountReais: payload.Amount,
    paidAt: payload.PaidAt && payload.PaidAt !== ZERO_DATE
      ? parseFlexibleDate(payload.PaidAt)
      : null,
  };
}

/**
 * Parser flexível de datas da GestãoPay
 * 
 * Lida com dois formatos inconsistentes:
 * - "dd/MM/yyyy HH:mm:ss" (formato brasileiro — usado em CreatedAt e PaidAt)
 * - ISO 8601 "yyyy-MM-ddTHH:mm:ss.sssssss" (usado em UpdatedAt)
 */
export function parseFlexibleDate(dateStr: string): Date | null {
  if (!dateStr || dateStr === "0001-01-01T00:00:00") return null;

  // Tenta formato brasileiro: "dd/MM/yyyy HH:mm:ss"
  const brMatch = dateStr.match(
    /^(\d{2})\/(\d{2})\/(\d{4})\s+(\d{2}):(\d{2}):(\d{2})$/
  );
  if (brMatch) {
    const [, day, month, year, hours, minutes, seconds] = brMatch;
    return new Date(`${year}-${month}-${day}T${hours}:${minutes}:${seconds}`);
  }

  // Tenta ISO 8601
  const isoDate = new Date(dateStr);
  if (!isNaN(isoDate.getTime())) return isoDate;

  console.warn("[GestãoPay] Formato de data não reconhecido:", dateStr);
  return null;
}
