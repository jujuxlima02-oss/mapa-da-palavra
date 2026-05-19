# Requisitos — Mapa da Palavra

> **Versão**: 2.0  
> **Data**: 2026-04-23  
> **Status**: Documento alinhado ao estado atual do projeto

## 1. Contexto do produto

- Produto: `Mapa da Palavra`
- Descritor: `Guia Visual dos 66 Livros da Bíblia`
- Marca: `Saints Label`
- Categoria legada encontrada no repositório: `Diário Bíblico`
- Modelo de venda: landing page -> checkout -> PIX -> confirmação
- Público atual no app: mercado brasileiro, funil em PT-BR

## 2. Objetivo do MVP

Validar a venda direta de um produto físico cristão com a oferta evergreen, medindo conversão do clique até a confirmação de pagamento.

## 3. Escopo funcional atual

### Landing pages

- Rota evergreen em `/`
- Rota sazonal `/dia-das-maes` encerrada e redirecionada para `/`
- CTA para checkout evergreen
- Seções implementadas com hero, prova social, problema, mecanismo, benefícios, preço, garantia, FAQ e CTA final
- Prova social dinâmica local disponível por feature flag

### Checkout

- Rota: `/checkout?offer=evergreen`
- Coleta: nome, e-mail, telefone, CPF, CEP, rua, número, complemento, cidade e estado
- Busca de CEP via ViaCEP
- Sem campo de cupom ativo
- Sem login
- Sem carrinho

### Pagamento PIX

- Rota: `/checkout/pix/[orderId]`
- Exibe QR Code gerado a partir do copia e cola
- Exibe botão de cópia
- Faz polling de status a cada 5 segundos
- Expiração visual controlada localmente

### Confirmação

- Rota: `/checkout/confirmacao/[orderId]`
- Mostra resumo do pedido pago
- Exibe valor, data e brindes digitais

### Backend

- `POST /api/checkout`: cria o pedido e gera a cobrança PIX
- `GET /api/order/[orderId]`: retorna status para polling
- `POST /api/webhooks/gestaopay`: processa webhook com double-check na API do gateway

## 4. Regras de negócio atuais

### Produto e preço

- Produto principal: `Mapa da Palavra`
- Preço atual: de `R$ 89,90` por `R$ 49,90`
- Moeda: `BRL`
- Tipo: produto físico
- Brindes digitais: `66 Cards Mapa da Palavra`, `Diário de Fé Mapa da Palavra` e `Guia de Estudo em 30 Dias`

### Oferta

- `offer_source` aceito: `evergreen`
- A oferta sazonal `/dia-das-maes` está encerrada e não deve ser exposta como oferta ativa

### Pedido

- Um envio do checkout cria um pedido
- Status esperados: `PENDING`, `PAID`, `EXPIRED`, `ERROR`
- Estados finais não devem ser reabertos pelo webhook

### Pagamento

- Meio de pagamento implementado: somente `PIX`
- A transação é criada na GestãoPay
- O webhook faz confirmação adicional via `GET /info/{id}`

## 5. Requisitos não funcionais atuais

- App Router com Next.js `16.2.3`
- Código em TypeScript com `strict: true`
- Persistência em PostgreSQL via Prisma
- Trackings principais enviados para GA4
- Responsividade móvel priorizada
- Projeto preparado para deploy na Vercel

## 6. Fora de escopo atual

- Cartão, boleto e parcelamento
- Painel administrativo
- Área logada
- Múltiplos produtos
- Automação de frete
- Cálculo real de prazo de entrega
- Cupons
- E-mail transacional

## 7. Lacunas conhecidas entre promessa e implementação

1. Prints reais de WhatsApp ainda precisam substituir os placeholders da prova social
2. O campo de CEP no checkout preenche endereço, mas não calcula frete de verdade
3. A rota sazonal permanece redirecionada enquanto a campanha estiver encerrada
4. Links institucionais mencionados na UI precisam permanecer sincronizados com as páginas existentes
