# Design — Diário Bíblico (MVP)

> **Versão**: 1.0  
> **Data**: 2026-04-13  
> **Referência**: `docs/requirements.md` + `docs/gestaopay-normalizado.md`

---

## 1. Stack tecnológica

| Tecnologia | Uso | Justificativa |
|------------|-----|---------------|
| **Next.js 14+ (App Router)** | Framework full-stack | SSR/SSG para landing pages, API Routes para backend, deploy nativo na Vercel |
| **TypeScript** | Linguagem | Type safety em toda a stack, melhor DX e menos bugs |
| **Tailwind CSS** | Estilização | Prototipagem rápida, responsividade, consistência visual |
| **Prisma** | ORM | Type-safe, migrations, integração nativa com Neon |
| **Neon** | Banco de dados PostgreSQL | Serverless, gratuito no free tier, compatível com Prisma |
| **Vercel** | Deploy/Hosting | Deploy automático, edge functions, domínio HTTPS nativo |
| **GestãoPay** | Gateway PIX | Gateway definido pelo cliente, API REST |
| **Google Analytics 4** | Tracking/Analytics | Tracking de conversão obrigatório |

---

## 2. Arquitetura da aplicação

```
┌──────────────────────────────────────────────────────┐
│                    VERCEL (Deploy)                     │
├──────────────────────────────────────────────────────┤
│                                                       │
│  ┌─────────────────────────────────────────────────┐  │
│  │            Next.js App Router                    │  │
│  │                                                  │  │
│  │  ┌──────────────┐  ┌──────────────────────────┐ │  │
│  │  │  Pages (SSG)  │  │    API Routes             │ │  │
│  │  │               │  │                           │ │  │
│  │  │  /            │  │  POST /api/checkout       │ │  │
│  │  │  /dia-das-maes│  │  GET  /api/order/[id]     │ │  │
│  │  │  /checkout    │  │  POST /api/webhooks/      │ │  │
│  │  │  /checkout/   │  │       gestaopay           │ │  │
│  │  │    pix/[id]   │  │                           │ │  │
│  │  │  /checkout/   │  └───────────┬───────────────┘ │  │
│  │  │  confirmacao  │              │                  │  │
│  │  │    /[id]      │              │                  │  │
│  │  └──────────────┘              │                  │  │
│  │                                 │                  │  │
│  └─────────────────────────────────┼──────────────────┘  │
│                                    │                     │
├────────────────────────────────────┼─────────────────────┤
│                                    ▼                     │
│  ┌─────────────┐          ┌──────────────┐              │
│  │   Prisma    │◀────────▶│    Neon DB    │              │
│  │   (ORM)     │          │  (PostgreSQL) │              │
│  └─────────────┘          └──────────────┘              │
│                                                          │
└──────────────────────────────────────────────────────────┘
              │                           ▲
              ▼                           │ (webhook)
     ┌──────────────┐           ┌──────────────┐
     │  GestãoPay   │──────────▶│  GestãoPay   │
     │  API (POST)  │           │  Webhook     │
     └──────────────┘           └──────────────┘
```

---

## 3. Modelagem do banco de dados

### Tabela: `Order`

```prisma
model Order {
  id              String   @id @default(cuid())
  
  // Dados do comprador
  customerName    String
  customerEmail   String
  customerPhone   String
  customerCpf     String
  
  // Dados do pedido
  productName     String
  amountCents     Int       // Valor em centavos (ex: 3990)
  offerSource     String    // "evergreen" | "dia-das-maes"
  
  // Status
  status          String    @default("PENDING") // PENDING, PAID, EXPIRED, ERROR
  
  // GestãoPay
  gatewayId       String?   // ID da transação na GestãoPay
  pixCopyPaste    String?   // Código copia-e-cola do PIX
  pixQrCode       String?   // URL ou base64 do QR Code
  pixExpiresAt    DateTime? // Data/hora de expiração do PIX
  
  // Tracking
  paidAt          DateTime?
  
  // Timestamps
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt

  @@index([gatewayId])
  @@index([status])
}
```

### Decisões de modelagem

1. **Tabela única `Order`**: Para MVP de produto único, sem necessidade de tabelas separadas para itens, pagamentos ou clientes.
2. **`amountCents`**: Valor sempre armazenado em centavos para evitar problemas de ponto flutuante.
3. **`gatewayId`**: Indexado para busca rápida no processamento de webhook.
4. **`offerSource`**: Persiste a origem da venda para análise de conversão.
5. **Sem tabela de Customer**: Sem autenticação, o comprador é registrado direto no pedido.

---

## 4. Rotas e páginas

| Rota | Tipo | Descrição | Rendering |
|------|------|-----------|-----------|
| `/` | Page | Landing page evergreen | SSG |
| `/dia-das-maes` | Page | Landing page Dia das Mães | SSG com middleware de redirect |
| `/checkout` | Page | Formulário de checkout | CSR |
| `/checkout/pix/[orderId]` | Page | QR Code + timer + polling | CSR |
| `/checkout/confirmacao/[orderId]` | Page | Confirmação do pagamento | SSR |
| `/api/checkout` | API Route | Criar pedido + gerar PIX | POST |
| `/api/order/[orderId]` | API Route | Consultar status do pedido | GET |
| `/api/webhooks/gestaopay` | API Route | Receber webhook da GestãoPay | POST |

---

## 5. Estratégia de checkout

### Fluxo do usuário

```
Landing Page → [CTA] → Checkout → [Gerar PIX] → Tela PIX → [Pagar] → Confirmação
     │                    │              │                │              │
     │                    │              │                │              │
  page_view          begin_checkout  pix_generated   pix_code_copied  purchase
  cta_click                                                            
```

### Formulário do checkout

| Campo | Tipo | Validação | Obrigatório |
|-------|------|-----------|-------------|
| Nome completo | text | Mínimo 3 caracteres | ✅ |
| E-mail | email | Formato de e-mail válido | ✅ |
| Telefone | tel | Formato brasileiro (11 dígitos) | ✅ |
| CPF | text | 11 dígitos, validação de formato | ✅ |

### Design do checkout

- Layout de coluna única (mobile-first)
- Resumo do pedido fixo na lateral (desktop) ou no topo (mobile)
- Indicadores de segurança (cadeado, "Pagamento seguro")
- Sem distrações (sem header de navegação, sem footer completo)
- Design inspirado na Kiwify: fundo claro, tipografia limpa, foco no formulário

---

## 6. Estratégia de integração GestãoPay

### Criação de cobrança PIX (`POST /api/checkout`)

```typescript
// 1. Validar dados do formulário (server-side)
// 2. Criar registro Order no Prisma (status: PENDING)
// 3. Chamar GestãoPay POST /v1/payment-transaction/create
// 4. Salvar gatewayId, pixCopyPaste, pixQrCode, pixExpiresAt no Order
// 5. Retornar orderId para o frontend
// 6. Frontend redireciona para /checkout/pix/{orderId}
```

### Mapeamento de campos para GestãoPay

```typescript
const payload = {
  amount: order.amountCents,           // 3990
  payment_method: "pix",
  postback_url: `${BASE_URL}/api/webhooks/gestaopay`,
  customer: {
    name: order.customerName,
    email: order.customerEmail,
    phone: order.customerPhone,
    document: {
      number: order.customerCpf.replace(/\D/g, ""),
      type: "cpf"
    }
  },
  items: [{
    title: order.productName,
    unit_price: order.amountCents,
    quantity: 1,
    tangible: true,
    external_ref: order.id
  }],
  pix: {
    expires_in_days: 1
  },
  metadata: {
    provider_name: "Saints Label",
    offer_source: order.offerSource,
    order_id: order.id
  }
};
```

---

## 7. Estratégia de webhook

### Endpoint: `POST /api/webhooks/gestaopay`

```
Webhook recebido
      │
      ▼
  Parse body (PascalCase → normalizar)
      │
      ▼
  Extrair Id e Status
      │
      ▼
  Buscar Order por gatewayId
      │
      ├─ Não encontrado → Log + return 200
      │
      ▼
  Status já é final? (PAID/EXPIRED/ERROR)
      │
      ├─ Sim → Ignorar (idempotência) → return 200
      │
      ▼
  Double-check: GET /v1/payment-transaction/info/{id}
      │
      ▼
  Status confirmado?
      │
      ├─ Sim → Atualizar Order (status + paidAt se PAID)
      │
      ▼
  Return 200
```

### Regras de idempotência

1. Sempre retornar HTTP 200 (mesmo com erro de processamento interno)
2. Verificar se o Order já está em estado final antes de atualizar
3. Usar double-check via GET para confirmar status
4. Log de todo webhook recebido para debugging

### Normalização do webhook

```typescript
interface WebhookPayload {
  Id: string;           // PascalCase
  Status: string;       // PascalCase
  Amount: number;       // Em REAIS (não centavos!)
  PaymentMethod: string;
  PaidAt: string;
  // ...
}

// Normalizar para uso interno
const normalized = {
  gatewayId: payload.Id,
  status: payload.Status,
  amountReais: payload.Amount, // ATENÇÃO: converter se necessário
  paidAt: parseFlexibleDate(payload.PaidAt),
};
```

---

## 8. Estratégia de tracking GA4

### Implementação

- **Google Tag Manager (gtag.js)**: Inserido via `<Script>` no layout principal
- **Eventos custom**: Disparados via `gtag('event', ...)` em componentes React
- **Identificação de oferta**: `offer_source` enviado como parâmetro em todos os eventos

### Camada de abstração

```typescript
// lib/analytics.ts

export function trackEvent(eventName: string, params?: Record<string, any>) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, params);
  }
}

// Eventos específicos
export const analytics = {
  ctaClick: (offerSource: string, position: string) =>
    trackEvent('cta_click', { offer_source: offerSource, cta_position: position }),
  
  beginCheckout: (offerSource: string, value: number) =>
    trackEvent('begin_checkout', { offer_source: offerSource, value }),
  
  pixGenerated: (offerSource: string, orderId: string, value: number) =>
    trackEvent('pix_generated', { offer_source: offerSource, order_id: orderId, value }),
  
  pixCodeCopied: (orderId: string) =>
    trackEvent('pix_code_copied', { order_id: orderId }),
  
  purchase: (offerSource: string, orderId: string, value: number, transactionId: string) =>
    trackEvent('purchase', { offer_source: offerSource, order_id: orderId, value, transaction_id: transactionId }),
  
  checkoutAbandoned: (offerSource: string, step: string) =>
    trackEvent('checkout_abandoned', { offer_source: offerSource, step }),
};
```

---

## 9. Estrutura de diretórios

```
diario_biblico/
├── docs/
│   ├── gestaopay-normalizado.md
│   ├── requirements.md
│   ├── design.md
│   ├── tasks.md
│   └── ai-context.md
├── prisma/
│   └── schema.prisma
├── src/
│   ├── app/
│   │   ├── layout.tsx              # Layout raiz + GA4 script
│   │   ├── page.tsx                # Landing page evergreen
│   │   ├── dia-das-maes/
│   │   │   └── page.tsx            # Landing page Dia das Mães
│   │   ├── checkout/
│   │   │   ├── page.tsx            # Formulário de checkout
│   │   │   ├── pix/
│   │   │   │   └── [orderId]/
│   │   │   │       └── page.tsx    # QR Code + timer + polling
│   │   │   └── confirmacao/
│   │   │       └── [orderId]/
│   │   │           └── page.tsx    # Página de confirmação
│   │   └── api/
│   │       ├── checkout/
│   │       │   └── route.ts        # POST — criar pedido + PIX
│   │       ├── order/
│   │       │   └── [orderId]/
│   │       │       └── route.ts    # GET — consultar status
│   │       └── webhooks/
│   │           └── gestaopay/
│   │               └── route.ts    # POST — webhook GestãoPay
│   ├── components/
│   │   ├── landing/
│   │   │   ├── Hero.tsx
│   │   │   ├── Benefits.tsx
│   │   │   ├── HowItWorks.tsx
│   │   │   ├── Pricing.tsx
│   │   │   ├── FAQ.tsx
│   │   │   ├── StickyCTA.tsx
│   │   │   └── Footer.tsx
│   │   ├── checkout/
│   │   │   ├── CheckoutForm.tsx
│   │   │   ├── OrderSummary.tsx
│   │   │   ├── PixPayment.tsx
│   │   │   └── Confirmation.tsx
│   │   └── ui/
│   │       ├── Button.tsx
│   │       ├── Input.tsx
│   │       └── Timer.tsx
│   ├── lib/
│   │   ├── analytics.ts            # Camada GA4
│   │   ├── gestaopay.ts            # Client da API GestãoPay
│   │   ├── prisma.ts               # Instância singleton do Prisma
│   │   ├── validations.ts          # Validações (CPF, email, etc.)
│   │   └── constants.ts            # Constantes (preço, nome produto, etc.)
│   └── types/
│       ├── order.ts                # Tipos do pedido
│       └── gestaopay.ts            # Tipos da API GestãoPay
├── public/
│   └── images/                     # Imagens do produto
├── .env.local                      # Variáveis de ambiente (local)
├── .env.example                    # Template de variáveis
├── middleware.ts                   # Redirect da campanha sazonal
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## 10. Variáveis de ambiente

```env
# Banco de dados
DATABASE_URL="postgresql://user:pass@host/db?sslmode=require"

# GestãoPay
GESTAOPAY_PUBLIC_KEY="pk_..."
GESTAOPAY_SECRET_KEY="sk_..."
GESTAOPAY_API_URL="https://api.gestaopayments.com"

# App
NEXT_PUBLIC_BASE_URL="https://meusite.com"
NEXT_PUBLIC_GA_MEASUREMENT_ID="G-XXXXXXXXXX"

# Produto
NEXT_PUBLIC_PRODUCT_PRICE_CENTS="3990"
NEXT_PUBLIC_PRODUCT_NAME="Diário Bíblico - Mapa da Palavra"

# Campanha sazonal
SEASONAL_CAMPAIGN_END_DATE="2026-05-08T23:59:59-03:00"
```

---

## 11. Estratégia de deploy na Vercel

1. **Repositório Git**: Conectar repo ao Vercel para deploy automático
2. **Branch principal**: `main` (produção)
3. **Preview deployments**: Branch `dev` para testes
4. **Variáveis de ambiente**: Configurar no dashboard da Vercel (separadas por ambiente)
5. **Domínio**: Configurar domínio personalizado
6. **Build**: `next build` (ISR para landing pages, serverless para API Routes)

### Configuração do Next.js para Vercel

```javascript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  // ISR para landing pages com revalidação
  // API Routes como serverless functions
};

module.exports = nextConfig;
```

---

## 12. Middleware para campanha sazonal

```typescript
// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname === '/dia-das-maes') {
    const endDate = new Date(process.env.SEASONAL_CAMPAIGN_END_DATE!);
    if (new Date() > endDate) {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: '/dia-das-maes',
};
```

---

## 13. Manter session/tracking entre landing e checkout

**Sem autenticação**, a rastreabilidade é mantida via:

1. **Query parameter `offer`**: Landing page passa `?offer=evergreen` ou `?offer=dia-das-maes` no link do CTA para o checkout
2. **Persistência no pedido**: O campo `offerSource` do pedido é preenchido com base no query parameter
3. **GA4 session**: O GA4 mantém session nativa via cookie `_ga`, sem configuração adicional
4. **URL do pedido**: Após criar o pedido, o `orderId` na URL ( `/checkout/pix/{orderId}`) carrega todos os dados do banco

**Não há necessidade de**: localStorage, sessionStorage ou cookies custom para tracking MVP.

---

## 14. Lidar com expiração do PIX

### Frontend (página `/checkout/pix/[orderId]`)

1. **Timer visual**: Calcula tempo restante com base em `pixExpiresAt` do pedido
2. **Exibição**: "Tempo restante: 23:45:12"
3. **Ao zerar**: Exibe mensagem "Seu PIX expirou" + botão "Gerar novo PIX"
4. **Botão "Gerar novo PIX"**: Redireciona para o checkout com o `offerSource` original

### Backend

1. **Webhook `EXPIRED`**: Atualiza status do pedido para `EXPIRED`
2. **Polling fallback**: Se polling detecta `EXPIRED` no endpoint `/api/order/[id]`, frontend exibe expiração
3. **Novo PIX**: Cria um **novo pedido** (não reutiliza o antigo) com os mesmos dados do comprador

---

## 15. Idempotência do webhook

```typescript
// Pseudo-código da API route de webhook
async function handleWebhook(payload: WebhookPayload) {
  
  // 1. Buscar pedido pelo gatewayId
  const order = await prisma.order.findFirst({
    where: { gatewayId: payload.Id }
  });
  
  if (!order) {
    console.warn(`Webhook para transação desconhecida: ${payload.Id}`);
    return; // Retorna 200 mesmo assim
  }
  
  // 2. Verificar se já está em estado final
  const finalStatuses = ['PAID', 'EXPIRED', 'ERROR'];
  if (finalStatuses.includes(order.status)) {
    console.log(`Webhook ignorado: pedido ${order.id} já em estado ${order.status}`);
    return; // Idempotente
  }
  
  // 3. Double-check na GestãoPay
  const confirmed = await gestaopay.getTransaction(payload.Id);
  if (confirmed.status !== payload.Status) {
    console.error(`Status divergente: webhook=${payload.Status}, API=${confirmed.status}`);
    return; // Não atualiza em caso de divergência
  }
  
  // 4. Atualizar pedido
  await prisma.order.update({
    where: { id: order.id },
    data: {
      status: payload.Status,
      paidAt: payload.Status === 'PAID' ? new Date() : undefined,
    }
  });
}
```

---

## 16. Riscos técnicos e mitigação

| # | Risco | Probabilidade | Impacto | Mitigação |
|---|-------|---------------|---------|-----------|
| 1 | **Campos PIX não correspondem ao esperado na resposta da GestãoPay** | Alta | 🔴 Crítico | Fazer chamada de teste antes de implementar; código flexível com fallback |
| 2 | **Webhook não chega (problema de rede/GestãoPay)** | Média | 🟡 Médio | Polling como fallback; botão manual de verificação |
| 3 | **Volume de webhooks duplicados** | Baixa | 🟢 Baixo | Idempotência implementada por design |
| 4 | **Inconsistência centavos/reais entre criação e webhook** | Confirmada | 🔴 Crítico | Normalização na camada de parsing; testes unitários |
| 5 | **Expiração do PIX não dispara webhook** | Média | 🟡 Médio | Timer no frontend + polling + tratamento manual |
| 6 | **Cold start na Vercel para API Route de webhook** | Baixa | 🟢 Baixo | Serverless functions são rápidas o suficiente para webhook |
| 7 | **Neon DB latência em cold start** | Média | 🟡 Médio | Connection pooling via `@neondatabase/serverless` |
| 8 | **CORS/bloqueio do webhook pela Vercel** | Baixa | 🟢 Baixo | API Routes do Next.js aceitam POST por padrão |
