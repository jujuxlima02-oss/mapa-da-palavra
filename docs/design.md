# Arquitetura Técnica — Mapa da Palavra

> **Versão**: 2.0  
> **Data**: 2026-04-23  
> **Objetivo**: Registrar a arquitetura realmente implementada no projeto.

## 1. Visão geral

O projeto é uma aplicação Next.js `16.2.3` com App Router. O funil combina páginas públicas de venda, checkout com formulário, geração de PIX na GestãoPay, persistência do pedido em PostgreSQL e tracking em GA4.

## 2. Decisões centrais

- Framework: Next.js `16.2.3`
- Roteamento: App Router
- Backend HTTP: Route Handlers
- Proxy de campanha: `src/proxy.ts` no padrão do Next 16
- ORM: Prisma `7.7.0`
- Driver: `pg` com `@prisma/adapter-pg`
- Estilo: Tailwind CSS `4`
- Gateway: GestãoPay
- CEP: ViaCEP

## 3. Fluxo do usuário

```text
Landing -> Checkout -> API de checkout -> GestãoPay -> Tela PIX
       -> webhook/polling -> confirmação
```

## 4. Rotas implementadas

| Rota | Tipo | Observação |
| --- | --- | --- |
| `/` | `page.tsx` | Landing evergreen |
| `/dia-das-maes` | `page.tsx` | Landing sazonal |
| `/checkout` | `page.tsx` | Página server-side com formulário client-side |
| `/checkout/pix/[orderId]` | `page.tsx` | Tela de pagamento |
| `/checkout/confirmacao/[orderId]` | `page.tsx` | Pós-pagamento |
| `POST /api/checkout` | `route.ts` | Cria pedido e PIX |
| `GET /api/order/[orderId]` | `route.ts` | Polling |
| `POST /api/webhooks/gestaopay` | `route.ts` | Webhook do gateway |

## 5. Modelo de dados atual

Tabela principal: `Order`

Campos relevantes:

- Comprador: nome, e-mail, telefone e CPF
- Endereço: CEP, rua, número, complemento, cidade e estado
- Pedido: nome do produto, preço em centavos e origem da oferta
- Pagamento: status, `gatewayId`, `pixCopyPaste`, `pixExpiresAt`, `paidAt`
- Auditoria: `createdAt` e `updatedAt`

## 6. Integrações externas

### GestãoPay

- Cria cobrança PIX
- Consulta transação para double-check
- Envia webhook de atualização
- Retorna QR Code como string EMV, não como imagem pronta

### ViaCEP

- Usado apenas para preenchimento de endereço
- Não existe cálculo de frete implementado

### GA4

- Script carregado no layout raiz
- Eventos principais de funil já estão disparados do frontend

## 7. Estrutura de código relevante

```text
src/
  app/
    layout.tsx
    page.tsx
    dia-das-maes/page.tsx
    checkout/page.tsx
    checkout/pix/[orderId]/page.tsx
    checkout/confirmacao/[orderId]/page.tsx
    api/
      checkout/route.ts
      order/[orderId]/route.ts
      webhooks/gestaopay/route.ts
  components/
    landing/
    checkout/
    ui/
  lib/
    analytics.ts
    constants.ts
    featureFlags.ts
    gestaopay.ts
    prisma.ts
    validations.ts
  types/
    gestaopay.ts
    order.ts
  proxy.ts
```

## 8. Observações de implementação

- O projeto usa `proxy.ts`, não `middleware.ts`, conforme a convenção do Next 16
- O build não executa lint automaticamente no Next 16; o lint depende de `npm run lint`
- O layout ainda usa fontes Geist, mas o CSS global mantém fallback com `Arial, Helvetica, sans-serif`
- As landing pages ainda usam placeholders visuais para o produto

## 9. Gaps técnicos atuais

1. Naming público ainda inconsistente em metadata e copy
2. Links institucionais da interface apontam para páginas que ainda não existem
3. A copy sazonal promete Colar Coração de Jesus sem suporte transacional correspondente
4. O prazo de entrega continua sem integração operacional real
