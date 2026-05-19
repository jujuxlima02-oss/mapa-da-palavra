# AI Context — Mapa da Palavra

> **Última atualização**: 2026-04-23  
> **Objetivo**: Dar contexto rápido e fiel ao estado atual do projeto para agentes de código e manutenção.

## Visão geral

`Mapa da Palavra` é a oferta principal deste projeto: um guia visual físico com 66 páginas, uma para cada livro da Bíblia, vendido por meio da landing evergreen e checkout com PIX.

## Naming canônico

- Produto/oferta: `Mapa da Palavra`
- Descritor: `Guia Visual dos 66 Livros da Bíblia`
- Marca: `Saints Label`
- Legado encontrado no repositório: `Diário Bíblico`

## Stack real

| Camada | Tecnologia |
| --- | --- |
| Framework | Next.js `16.2.3` com App Router |
| UI | React `19.2.4` |
| Estilo | Tailwind CSS `4` |
| ORM | Prisma `7.7.0` |
| Banco | PostgreSQL via `pg` + `@prisma/adapter-pg` |
| Pagamento | GestãoPay |
| Analytics | Google Analytics 4 |
| CEP | ViaCEP |

## Escopo implementado

- Landing evergreen em `/`
- Rota sazonal `/dia-das-maes` encerrada e redirecionada para `/`
- Checkout com nome, e-mail, telefone, CPF e endereço completo
- Busca de CEP no checkout
- Criação de cobrança PIX
- Tela de QR Code + copia e cola + timer + polling
- Confirmação de pedido pago
- Persistência do pedido em tabela única `Order`
- Tracking do funil principal no GA4
- Prova social dinâmica local via feature flag

## Fora de escopo atual

- Login ou área do cliente
- Múltiplos produtos
- Cartão, boleto ou parcelamento
- Painel administrativo
- Integração real de frete
- Cálculo real de prazo de entrega
- Automação de e-mail pós-compra
- Sistema real de cupons

## Rotas críticas

| Rota | Papel |
| --- | --- |
| `/` | Landing principal |
| `/dia-das-maes` | Sazonal encerrada; redireciona para `/` |
| `/checkout` | Página server-side com formulário client-side |
| `/checkout/pix/[orderId]` | Instruções de pagamento |
| `/checkout/confirmacao/[orderId]` | Pós-pagamento |
| `POST /api/checkout` | Cria pedido e transação PIX |
| `GET /api/order/[orderId]` | Retorna status para polling |
| `POST /api/webhooks/gestaopay` | Normaliza e confirma webhook |

## Integrações externas

### GestãoPay

- Autenticação: Basic Auth
- Criação de transação: `POST /v1/payment-transaction/create`
- Consulta de transação: `GET /v1/payment-transaction/info/{id}`
- Webhook local: `POST /api/webhooks/gestaopay`
- Fonte canônica interna: `docs/gestaopay-normalizado.md`

### ViaCEP

- Usado apenas para preencher rua, cidade e estado a partir do CEP
- Não existe cálculo de frete integrado

### GA4

- Script injetado no layout raiz
- Eventos principais do funil já estão implementados

## Decisões que não devem mudar sem aprovação

1. Manter `GestãoPay` como gateway principal
2. Manter `PIX` como único meio de pagamento implementado
3. Manter `Prisma + PostgreSQL` na persistência
4. Manter `src/proxy.ts` para redirecionar a sazonal encerrada no Next 16
5. Não introduzir autenticação ou múltiplos produtos sem decisão explícita

## Gaps conhecidos

- Prints reais de WhatsApp ainda precisam substituir os placeholders da prova social
- A rota sazonal permanece redirecionada enquanto a campanha estiver encerrada
- Prazo de entrega segue fixo por modalidade, sem cálculo real de frete
