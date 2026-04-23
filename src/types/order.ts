/**
 * Tipos do pedido — derivados do schema Prisma
 */

import type { OfferSource, OrderStatus } from "@/lib/constants";

/** Dados enviados pelo formulário de checkout */
export interface CheckoutFormData {
  name: string;
  email: string;
  phone: string;
  cpf: string;
  offerSource: OfferSource;
}

/** Resposta da API de criação de pedido */
export interface CreateOrderResponse {
  orderId: string;
}

/** Resposta da API de status do pedido */
export interface OrderStatusResponse {
  status: OrderStatus;
  paidAt: string | null;
  offerSource: string;
}

/** Erros de validação retornados pela API */
export interface ValidationErrors {
  [field: string]: string;
}

/** Erro genérico da API */
export interface ApiError {
  message: string;
  errors?: ValidationErrors;
}
