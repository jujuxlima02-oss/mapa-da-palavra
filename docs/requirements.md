# Requirements — Diário Bíblico (MVP)

> **Versão**: 1.0  
> **Data**: 2026-04-13  
> **Status**: Especificação aprovada para execução

---

## 1. Contexto do produto

**Produto**: Diário Bíblico / Mapa da Palavra — Guia visual físico com 66 páginas (uma por livro da Bíblia) contendo autor, contexto histórico, temas, propósito e aplicação prática.

**Marca**: Saints Label

**Ticket**: Até R$ 39,90

**Mercado**: Brasil (público cristão adulto, 25-55 anos)

**Modelo**: Venda direta via landing page → checkout com pagamento PIX → entrega física

**Problema resolvido**: Cristãos que leem a Bíblia mas sentem dificuldade para compreender e aplicar cada livro de forma prática e organizada.

---

## 2. Visão geral do MVP

O MVP consiste em:
1. **Duas landing pages** com ângulos de venda distintos
2. **Um checkout único reutilizável** para ambas as páginas
3. **Integração PIX** via GestãoPay como único meio de pagamento
4. **Tracking completo** com Google Analytics 4
5. **Persistência de pedidos** em banco de dados

O objetivo é **validar a oferta com velocidade e mensuração**, sem complexidade desnecessária.

---

## 3. Funcionalidades do MVP

### 3.1 Landing Pages

#### Página 1 — Oferta Evergreen
- **Ângulo**: Clareza bíblica e crescimento espiritual
- **Rota**: `/`
- **Sempre ativa**
- **CTA**: Direciona para checkout com `?offer=evergreen`

#### Página 2 — Oferta Dia das Mães
- **Ângulo**: Presente cristão significativo para a mãe
- **Rota**: `/dia-das-maes`
- **Campanha ativa até**: 8 de maio de 2026
- **Após 8 de maio**: Redireciona automaticamente para `/`
- **CTA**: Direciona para checkout com `?offer=dia-das-maes`

**Elementos comuns a ambas as páginas**:
- Hero com headline + imagem do produto + CTA primário
- Seção de benefícios/diferenciais
- Seção de como funciona (mecanismo visual)
- Preço e âncora de desconto
- FAQ (accordion expandível)
- CTA fixo no rodapé (mobile)
- Design mobile-first, responsivo

### 3.2 Checkout

- **Rota**: `/checkout?offer={evergreen|dia-das-maes}`
- **Formulário**: Nome completo, e-mail, telefone, CPF
- **Sem autenticação/login**
- **Sem criação de conta**
- **Validações client-side**: campos obrigatórios, formato de CPF, formato de e-mail, formato de telefone
- **Experiência inspirada na Kiwify**: limpo, direto, sem distrações
- **Resumo do pedido visível**: nome do produto, preço, oferta de origem
- **Botão**: "Gerar PIX" → cria pedido + gera cobrança na GestãoPay

### 3.3 Página de pagamento pendente (PIX)

- **Rota**: `/checkout/pix/{orderId}`
- **QR Code** renderizado a partir dos dados da GestãoPay
- **Código copia-e-cola** com botão de copiar
- **Timer visual** mostrando tempo restante para pagamento (24h)
- **Polling automático** a cada 5 segundos para verificar se o pagamento foi confirmado
- **Ao detectar PAID**: redireciona automaticamente para página de confirmação
- **Ao expirar**: exibe mensagem de expiração com opção de gerar novo PIX

### 3.4 Página de confirmação

- **Rota**: `/checkout/confirmacao/{orderId}`
- **Mensagem de agradecimento**
- **Resumo do pedido** (produto, valor, data)
- **Mensagem sobre próximos passos** (envio, prazo estimado)
- **Sem login** — acesso via URL direta

### 3.5 Integração GestãoPay (PIX)

- Criar transação PIX via `POST /v1/payment-transaction/create`
- Receber webhook em `POST /api/webhooks/gestaopay`
- Atualizar status do pedido no banco ao receber webhook
- Validação do webhook via double-check (GET `/info/{id}`)
- Polling via `GET /v1/payment-transaction/info/{id}` como fallback

### 3.6 Persistência de pedidos

- Criar registro do pedido no banco antes de chamar a GestãoPay
- Campos: dados do comprador, valor, status, oferta de origem, IDs GestãoPay
- Atualizar status via webhook
- Status do pedido: `PENDING` → `PAID` | `EXPIRED` | `ERROR`

### 3.7 Tracking GA4

Eventos obrigatórios:

| Evento | Quando | Parâmetros |
|--------|--------|------------|
| `page_view` | Ao carregar qualquer página | `page_title`, `page_location` |
| `cta_click` | Clique em CTA da landing page | `offer_source`, `cta_position` |
| `begin_checkout` | Ao carregar a página de checkout | `offer_source`, `value` |
| `pix_generated` | Após geração bem-sucedida do PIX | `offer_source`, `order_id`, `value` |
| `pix_code_copied` | Ao clicar no botão de copiar código PIX | `order_id` |
| `purchase` | Pagamento confirmado (na página de confirmação) | `offer_source`, `order_id`, `value`, `transaction_id` |
| `checkout_abandoned` | Ao sair do checkout sem finalizar (beforeunload) | `offer_source`, `step` |

---

## 4. Fora de escopo (MVP)

| Item | Motivo |
|------|--------|
| Autenticação / Login | Não necessário para compra única |
| Painel administrativo | Gerenciamento via banco direto ou Prisma Studio |
| Múltiplos produtos | MVP é produto único |
| Order bump | Escalonamento futuro |
| Upsell / Downsell | Escalonamento futuro |
| Área logada para comprador | Desnecessário para produto físico único |
| Pagamento com cartão ou boleto | MVP apenas PIX |
| Estorno/reembolso via sistema | Tratado manualmente |
| Notificação por e-mail | Futura implementação |
| Carrinho de compras | Produto único, fluxo direto |
| Sistema de cupom/desconto | MVP sem cupons |
| Integração com correios/frete | Frete incluso no preço ou tratado manualmente |

---

## 5. Regras de negócio

### RN-01: Produto e preço
- Produto único: Diário Bíblico
- Preço fixo: R$ 39,90
- Moeda: BRL
- Produto físico (tangible: true)

### RN-02: Ofertas
- Duas ofertas ativas simultaneamente (evergreen + sazonal)
- Sazonal (Dia das Mães) desativa em 9 de maio de 2026 00:00 BRT
- Ambas direcionam para o mesmo checkout
- O campo `offer_source` é persistido no pedido

### RN-03: Checkout
- Campos obrigatórios: nome, email, telefone, CPF
- CPF deve ser validado (formato, não autenticidade)
- Sem criação de conta
- Um checkout gera um pedido + uma transação PIX

### RN-04: Pagamento PIX
- Expiração: 24 horas (configurável via `pix.expires_in_days: 1`)
- Não permitir gerar segundo PIX para o mesmo pedido enquanto o primeiro não expirar
- Ao expirar, permitir gerar novo PIX (novo pedido)

### RN-05: Status do pedido
- Transições permitidas:
  - `PENDING` → `PAID` (via webhook)
  - `PENDING` → `EXPIRED` (via webhook ou polling)
  - `PENDING` → `ERROR` (via webhook)
- Status final: `PAID`, `EXPIRED`, `ERROR` — não podem mudar

### RN-06: Idempotência
- Webhook pode ser recebido múltiplas vezes para a mesma transação
- A atualização deve ser idempotente: verificar se o status já foi atualizado antes de gravar
- Não processar webhook se o pedido já está em estado final

### RN-07: Campanha sazonal
- `dia-das-maes`: ativa de X até 8 de maio de 2026 23:59 BRT
- Após essa data: qualquer acesso à rota `/dia-das-maes` redireciona 302 para `/`

---

## 6. Requisitos não-funcionais

### RNF-01: Performance
- Tempo de carregamento da landing page: < 3 segundos
- Geração do PIX: < 5 segundos (incluindo chamada à GestãoPay)
- Polling de status: intervalo de 5 segundos

### RNF-02: Disponibilidade
- Deploy na Vercel com uptime padrão da plataforma
- Banco Neon com uptime padrão

### RNF-03: Segurança
- Credenciais GestãoPay em variáveis de ambiente (nunca no código)
- Webhook validado via double-check na API GestãoPay
- HTTPS obrigatório (padrão Vercel)

### RNF-04: SEO
- Meta tags em todas as páginas (title, description, og:image)
- Heading hierarchy correta (h1 único por página)
- HTML semântico

### RNF-05: Responsividade
- Mobile-first
- Breakpoints: 375px, 768px, 1024px, 1440px
- CTA sticky em mobile

### RNF-06: Acessibilidade
- Labels nos inputs do formulário
- Contraste mínimo WCAG AA
- IDs únicos em elementos interativos

### RNF-07: Observabilidade
- Logs de erro na criação de transação (console + Vercel logs)
- GA4 para tracking de conversão
- Log de erros de webhook
