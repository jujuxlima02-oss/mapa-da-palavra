# AI Context — Diário Bíblico (MVP)

> **Última atualização**: 2026-04-13  
> **Objetivo deste documento**: Fornecer contexto persistente para qualquer agente de código que trabalhe neste projeto.

---

## Objetivo do projeto

Validar a oferta de um produto físico cristão (guia bíblico de 66 páginas) via duas landing pages com checkout PIX integrado, com tracking completo de conversão.

---

## Stack definida

| Tecnologia | Versão | Uso |
|------------|--------|-----|
| Next.js | 14+ (App Router) | Framework full-stack |
| TypeScript | 5+ | Linguagem |
| Tailwind CSS | 3+ | Estilização |
| Prisma | 5+ | ORM |
| Neon | — | PostgreSQL serverless |
| Vercel | — | Deploy |
| GestãoPay | v1 | Gateway PIX |
| Google Analytics 4 | — | Tracking |

---

## Escopo do MVP

- ✅ Landing page evergreen (rota `/`)
- ✅ Landing page Dia das Mães (rota `/dia-das-maes`, ativa até 08/05/2026)
- ✅ Checkout único com formulário (nome, email, telefone, CPF)
- ✅ Integração PIX com GestãoPay (criação + webhook + polling)
- ✅ Página de QR Code com timer e copia-e-cola
- ✅ Página de confirmação
- ✅ Persistência de pedidos no Neon (tabela Order)
- ✅ Tracking GA4 de 7 eventos obrigatórios
- ✅ Redirect automático da campanha sazonal após data limite

---

## Fora de escopo

- ❌ Autenticação / Login
- ❌ Painel administrativo
- ❌ Múltiplos produtos
- ❌ Order bump, upsell, downsell
- ❌ Área logada para comprador
- ❌ Pagamento com cartão ou boleto
- ❌ Estorno/reembolso via sistema
- ❌ Notificação por e-mail
- ❌ Carrinho de compras
- ❌ Cupom/desconto
- ❌ Integração com correios

---

## Rotas principais

| Rota | Tipo | Descrição |
|------|------|-----------|
| `/` | Page (SSG) | Landing page evergreen |
| `/dia-das-maes` | Page (SSG) | Landing page Dia das Mães |
| `/checkout` | Page (CSR) | Formulário de checkout |
| `/checkout/pix/[orderId]` | Page (CSR) | QR Code + timer + polling |
| `/checkout/confirmacao/[orderId]` | Page (SSR) | Confirmação do pagamento |
| `POST /api/checkout` | API Route | Criar pedido + PIX |
| `GET /api/order/[orderId]` | API Route | Status do pedido (polling) |
| `POST /api/webhooks/gestaopay` | API Route | Webhook da GestãoPay |

---

## Fluxo principal do usuário

```
Landing Page → CTA → Checkout (form) → Gerar PIX → Tela PIX (QR+timer) → Pagar → Confirmação
```

---

## Integrações externas

### GestãoPay (PIX)
- **Base URL**: `https://api.gestaopayments.com`
- **Auth**: Basic Auth (PUBLIC_KEY:SECRET_KEY em Base64)
- **Criar PIX**: `POST /v1/payment-transaction/create`
- **Buscar transação**: `GET /v1/payment-transaction/info/{id}`
- **Webhook**: `POST /api/webhooks/gestaopay` (PascalCase, Amount em reais)
- **Documentação normalizada**: `docs/gestaopay-normalizado.md`

### Google Analytics 4
- **Script**: gtag.js no layout
- **ID**: variável `NEXT_PUBLIC_GA_MEASUREMENT_ID`

---

## Eventos de tracking obrigatórios

| # | Evento | Contexto |
|---|--------|----------|
| 1 | `page_view` | Carregamento de qualquer página |
| 2 | `cta_click` | Clique em CTA da landing page |
| 3 | `begin_checkout` | Carregamento do checkout |
| 4 | `pix_generated` | PIX criado com sucesso |
| 5 | `pix_code_copied` | Código copiado para clipboard |
| 6 | `purchase` | Pagamento confirmado |
| 7 | `checkout_abandoned` | Saída do checkout sem finalizar |

Todos os eventos relevantes devem incluir `offer_source` (`evergreen` | `dia-das-maes`).

---

## Decisões que NÃO devem ser alteradas sem aprovação explícita

1. **Gateway de pagamento**: GestãoPay — não substituir por outro gateway
2. **Método de pagamento**: Somente PIX — não adicionar cartão ou boleto
3. **Banco de dados**: Neon com Prisma — não trocar por outro DB
4. **Deploy**: Vercel — não trocar por outro provider
5. **Tracking**: GA4 — não substituir por Mixpanel, Amplitude, etc.
6. **Sem autenticação**: Compradores não fazem login
7. **Produto único**: Uma SKU, preço fixo R$ 39,90
8. **Preço em centavos**: Toda referência a `amount` no backend = centavos (3990)
9. **Webhook GestãoPay em PascalCase**: Parser deve normalizar
10. **Double-check no webhook**: Sempre confirmar status via GET antes de atualizar

---

## Armadilhas conhecidas

| # | Armadilha | Cuidado |
|---|-----------|---------|
| 1 | `Amount` no webhook é em **reais**, não centavos | Normalizar antes de comparar com `amountCents` |
| 2 | Webhook usa **PascalCase**, request usa **snake_case** | Criar interface separada para webhook |
| 3 | `CreatedAt` no webhook tem formato brasileiro (`dd/MM/yyyy`), `UpdatedAt` tem ISO | Parser flexível de datas |
| 4 | Campos PIX na resposta (QR Code, copia-e-cola) — nomes dependem da chamada de teste | Ver DP-1 no doc normalizado |
| 5 | `PaidAt = "0001-01-01T00:00:00"` quando não pago | Tratar como null |
