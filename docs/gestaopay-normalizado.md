# GestãoPay — Documentação Normalizada para Integração PIX

> **Versão**: 1.0  
> **Data**: 2026-04-13  
> **Fonte primária**: Documentação local do projeto + API Reference GestãoPay (gestaopay.readme.io)  
> **Escopo**: Somente integração PIX (cartão de crédito e boleto fora de escopo)

---

## Legenda de classificação

| Tag | Significado |
|-----|-------------|
| 📄 **Fato documentado** | Informação extraída diretamente da documentação oficial |
| 🔍 **Inferência operacional** | Dedução baseada em padrões de API e contexto, não confirmada na doc |
| ❓ **Decisão pendente** | Lacuna que precisa ser validada antes da implementação |

---

## 1. Visão geral da integração

📄 **Fato documentado**

- API REST com respostas em formato JSON
- Base URL: `https://api.gestaopayments.com`
- Suporta 3 métodos de pagamento: `pix`, `credit_card`, `boleto`
- Atualizações de status são enviadas via webhook (postback URL)

**Escopo deste projeto**: Apenas `pix`.

---

## 2. Autenticação

📄 **Fato documentado**

- Método: **Basic Auth**
- Formato do header: `Authorization: Basic Base64(PUBLIC_KEY:SECRET_KEY)`
- Credenciais disponíveis no painel GestãoPay, página "Credenciais API"

**Exemplo em Node.js:**

```javascript
const credentials = Buffer.from(`${PUBLIC_KEY}:${SECRET_KEY}`).toString("base64");

const options = {
  method: "POST",
  url: "https://api.gestaopayments.com/v1/payment-transaction/create",
  headers: {
    "Authorization": `Basic ${credentials}`,
    "Content-Type": "application/json",
    "Accept": "application/json"
  }
};
```

---

## 3. Endpoints utilizados

### 3.1 Criar transação PIX

📄 **Fato documentado**

| Campo | Valor |
|-------|-------|
| **Método** | `POST` |
| **URL** | `https://api.gestaopayments.com/v1/payment-transaction/create` |
| **Content-Type** | `application/json` |
| **Autenticação** | Basic Auth |

### 3.2 Buscar transação

📄 **Fato documentado**

| Campo | Valor |
|-------|-------|
| **Método** | `GET` |
| **URL** | `https://api.gestaopayments.com/v1/payment-transaction/info/{id}` |
| **Autenticação** | Basic Auth |

---

## 4. Payload de criação de cobrança PIX

📄 **Fato documentado** (campos e tipos extraídos da documentação oficial)

```json
{
  "amount": 3990,
  "payment_method": "pix",
  "postback_url": "https://meusite.com/api/webhooks/gestaopay",
  "customer": {
    "name": "Maria Silva",
    "email": "maria@email.com",
    "phone": "11999998888",
    "document": {
      "number": "12345678901",
      "type": "cpf"
    }
  },
  "items": [
    {
      "title": "Diário Bíblico - Mapa da Palavra",
      "unit_price": 3990,
      "quantity": 1,
      "tangible": true,
      "external_ref": "diario-biblico-001"
    }
  ],
  "shipping": {
    "fee": 0,
    "address": {
      "street": "Rua Exemplo",
      "street_number": "123",
      "complement": "Apto 1",
      "zip_code": "01001000",
      "neighborhood": "Centro",
      "city": "São Paulo",
      "state": "SP"
    }
  },
  "pix": {
    "expires_in_days": 1
  },
  "metadata": {
    "provider_name": "Saints Label",
    "offer_source": "evergreen",
    "order_id": "internal-uuid"
  }
}
```

### Campos obrigatórios

| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| `amount` | integer | ✅ | Valor total em **centavos** (ex: 3990 = R$ 39,90) |
| `payment_method` | string | ✅ | `"pix"` |
| `postback_url` | string | ✅ | URL para receber atualizações de status via webhook |
| `customer.name` | string | ✅ | Nome completo do comprador |
| `customer.email` | string | ✅ | E-mail do comprador |
| `customer.phone` | string | ✅ | Telefone do comprador |
| `customer.document.number` | string | ✅ | CPF ou CNPJ |
| `customer.document.type` | string | ✅ | `"cpf"` ou `"cnpj"` |
| `items[].title` | string | ✅ | Nome do produto |
| `items[].unit_price` | integer | ✅ | Preço unitário em centavos |
| `items[].quantity` | integer | ✅ | Quantidade |
| `items[].tangible` | boolean | ✅ | `true` para produto físico |
| `metadata` | object | ✅ | Metadados livres (mínimo: `provider_name`) |

### Campos opcionais relevantes

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `items[].external_ref` | string | Referência externa do item |
| `shipping.fee` | number | Valor do frete |
| `shipping.address.*` | strings | Endereço de entrega completo |
| `pix.expires_in_days` | integer | Dias para expiração do PIX |
| `ip` | string | IP do comprador |
| `installments` | integer | Parcelas (N/A para PIX) |
| `split` | array | Divisão de pagamento entre contas |

---

## 5. Resposta real — Criação de transação PIX

📄 **Fato confirmado** (chamada de teste real em 2026-04-14)

> **HTTP Status**: `201` (não 200 como na documentação oficial)

### Estrutura completa da resposta

```json
{
  "data": {
    "id": "3e425882a9da4c51917a521f47d77708",
    "amount": 100,
    "installments": 0,
    "payment_method": "pix",
    "status": "PENDING",
    "postback_url": "https://webhook.site/test-diario-biblico",
    "card": null,
    "boleto": null,
    "pix": {
      "qr_code": "00020101021226800014br.gov.bcb.pix2558qrcode.mkip.com.br/v1/747287ac-cec8-4049-b008-7c61b9453c745204000053039865802BR5916VOXPAGPAGAMENTOS6008SAOPAULO62070503***630417E8",
      "url": null,
      "expiration_date": "0001-01-01T00:00:00",
      "e2_e": null
    }
  },
  "success": true,
  "return_message_type": 201,
  "error_messages": [],
  "inner_exception": null
}
```

### ✅ Campos PIX confirmados (DP-1 RESOLVIDO)

| Campo | Caminho | Tipo | Valor | Descrição |
|-------|---------|------|-------|-----------|
| `qr_code` | `data.pix.qr_code` | string | Código EMV/BRCode | **É o código copia-e-cola (não uma imagem!)**. String no padrão EMV que pode ser colada em apps bancários ou convertida em QR Code no frontend |
| `url` | `data.pix.url` | string \| null | `null` | URL do QR Code como imagem — **retorna null**, não disponível |
| `expiration_date` | `data.pix.expiration_date` | string (datetime) | `"0001-01-01T00:00:00"` | Data de expiração — **retorna valor sentinela** (zero date), indica que a API não calcula expiração |
| `e2_e` | `data.pix.e2_e` | string \| null | `null` | Identificador E2E (End-to-End) do Banco Central — não disponível na criação |

### ⚠️ Descobertas críticas para a implementação

1. **`data` é um objeto**, não um array — a doc sugeria `data: [...]`, mas é `data: {...}`
2. **`pix.qr_code` é o código copia-e-cola** (string EMV/BRCode), **NÃO é uma imagem** — o frontend precisa gerar o QR Code a partir dessa string usando uma biblioteca como `qrcode.react`
3. **`pix.url` retorna `null`** — não há URL de imagem de QR Code fornecida pela API
4. **`pix.expiration_date` retorna zero date** — a API não informa a expiração; calcular no backend como `createdAt + expires_in_days`
5. **HTTP status é `201`**, não `200` — tratar ambos como sucesso
6. **Envelope de resposta** inclui `success`, `return_message_type`, `error_messages`, `inner_exception`
7. **`amount` na criação retorna o valor enviado (em centavos)** — consistente com o payload

---

## 6. Resposta real — Buscar transação

📄 **Fato confirmado** (chamada de teste real em 2026-04-14)

### Estrutura completa da resposta GET

```json
{
  "data": {
    "id": "3e425882a9da4c51917a521f47d77708",
    "created_at": "14/04/2026 05:58:34",
    "updated_at": "2026-04-14T05:58:34.9201893",
    "company_id": "02790bf8dbe7402ba17f668daa76c0ff",
    "acquirer_id": "5",
    "external_id": "6692036",
    "paid_at": "0001-01-01T00:00:00",
    "amount": 1.00,
    "refunded_amount": null,
    "installments": 0,
    "payment_method": "pix",
    "status": "PENDING",
    "anticipation_status": null,
    "postback_url": "https://webhook.site/test-diario-biblico",
    "metadata": {
      "provider_name": "Saints Label",
      "test": true,
      "purpose": "API field discovery"
    },
    "traceable": true,
    "secure_id": null,
    "secure_url": null,
    "ip": null,
    "customer": {
      "id": "78d5460876764e61a8a6a4b23bff1e00",
      "name": "Teste API Diario Biblico",
      "email": "teste@teste.com",
      "document": {
        "number": "12345678909",
        "type": "cpf"
      },
      "phone": "11999999999"
    },
    "card": null,
    "boleto": null,
    "pix": {
      "qr_code": "00020101021226800014br.gov.bcb.pix...",
      "url": null,
      "expiration_date": "0001-01-01T00:00:00",
      "e2_e": null
    },
    "shipping": null,
    "refund": null,
    "refused_reason": null,
    "items": [
      {
        "title": "Teste - Diário Bíblico",
        "unit_price": 1,
        "quantity": 1,
        "tangible": true,
        "external_ref": null
      }
    ],
    "fee_details": {
      "id": "5be5c606c2b7479c863be0f4a8c19d06",
      "amount": 1.00,
      "splits": null,
      "total_fee": 2.09,
      "total_amount": -1.09
    },
    "delivery": null
  },
  "success": true,
  "return_message_type": 200,
  "error_messages": [],
  "inner_exception": null
}
```

### ⚠️ Descobertas importantes no GET

1. **`amount` no GET está em REAIS** (`1.00`), enquanto no POST de criação está em **centavos** (`100`) — confirma inconsistência documentada
2. **`created_at` usa formato brasileiro** `dd/MM/yyyy HH:mm:ss`, enquanto `updated_at` usa ISO 8601 — inconsistência confirmada
3. **`unit_price` nos items do GET está em REAIS** (`1`), no POST de criação está em centavos (`100`)
4. **`fee_details`** mostra taxas da GestãoPay (R$ 2,09 de taxa sobre R$ 1,00)
5. **O envelope é o mesmo**: `{ data, success, return_message_type, error_messages, inner_exception }`
6. **O objeto `pix` persiste** no GET com os mesmos campos da criação

📄 **Fato confirmado**: O endpoint de busca pode ser usado como fallback de polling/double-check do webhook.

---

## 7. Status possíveis da transação

📄 **Fato documentado**

| Status | Evento | Relevância para PIX |
|--------|--------|---------------------|
| `PENDING` | Aguardando pagamento | ✅ Estado inicial após criação |
| `PAID` | Pagamento realizado | ✅ Confirmação do pagamento |
| `EXPIRED` | Expirado | ✅ PIX não pago no prazo |
| `REFUNDED` | Transação estornada | ⚠️ Pós-venda (fora do MVP) |
| `REFUSED` | Transação recusada | ⚠️ Raro para PIX |
| `CHARGEBACK` | Chargeback | ❌ N/A para PIX |
| `PRECHARGEBACK` | Pré-chargeback | ❌ N/A para PIX |
| `ERROR` | Erro na transação | ✅ Tratamento de erro |

**Status relevantes para o MVP**: `PENDING`, `PAID`, `EXPIRED`, `ERROR`

---

## 8. Webhook (Postback)

📄 **Fato documentado**

### Formato do payload recebido

```json
{
  "Id": "a24207e615224923bf4a68265d519fc6",
  "CreatedAt": "05/11/2025 21:19:42",
  "UpdatedAt": "2025-11-05T21:19:42.3648396",
  "ExternalId": "27615041",
  "PaidAt": "0001-01-01T00:00:00",
  "Amount": 100,
  "Installments": 0,
  "PaymentMethod": "pix",
  "Status": "PENDING",
  "PostbackUrl": "https://webhook.site/..."
}
```

> ⚠️ **Atenção — Inconsistências documentadas**:
> 1. Os campos do webhook usam **PascalCase** (ex: `Id`, `Status`, `PaidAt`), enquanto os payloads de requisição usam **snake_case** (ex: `payment_method`)
> 2. `Amount` no webhook está em **reais** (ex: 100 = R$ 100,00), na criação `amount` está em **centavos** (ex: 10000 = R$ 100,00)
> 3. `CreatedAt` usa formato `dd/MM/yyyy HH:mm:ss`, enquanto `UpdatedAt` usa ISO 8601

### Campos do webhook de transação

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `Id` | string | ID da transação |
| `CreatedAt` | string | Data de criação (formato: `dd/MM/yyyy HH:mm:ss`) |
| `UpdatedAt` | string | Data de atualização (formato ISO 8601) |
| `ExternalId` | string | ID externo da transação |
| `PaidAt` | string | Data do pagamento (ISO ou `0001-01-01...` se não pago) |
| `Amount` | number | Valor **em reais** (não centavos!) |
| `Installments` | integer | Parcelas (0 para PIX) |
| `PaymentMethod` | string | `"pix"` |
| `Status` | string | Um dos 8 status documentados |
| `PostbackUrl` | string | URL registrada para o webhook |

---

## 9. Assinatura/validação do webhook

❓ **Decisão pendente — DP-2**

A documentação **não menciona**:
- Assinatura HMAC ou hash de validação
- Header de verificação (ex: `X-Signature`)
- Mecanismo de confirmação de autenticidade do webhook

🔍 **Inferência operacional**: Sem assinatura, a validação mínima deve ser:
1. Verificar se o `Id` recebido corresponde a um pedido existente no banco
2. Consultar via GET `/info/{id}` para confirmar o status recebido (double-check)
3. Retornar 200 rapidamente para evitar retries

**Recomendação**: Implementar validação por double-check (buscar transação via API após receber webhook) até que a GestãoPay confirme se existe mecanismo de assinatura.

---

## 10. Expiração da cobrança PIX

📄 **Fato documentado** (parcial)

- Campo: `pix.expires_in_days` (integer)
- Unidade: **dias** (não minutos/horas)

❓ **Decisão pendente — DP-3**

- Qual o valor mínimo aceito? (1 dia? 0?)
- O que acontece quando expira? (webhook com `EXPIRED` é enviado automaticamente?)
- É possível configurar expiração em horas ou minutos?

🔍 **Inferência operacional**: 
- Usar `expires_in_days: 1` (24 horas) é o padrão mais seguro
- Esperar receber webhook com `Status: "EXPIRED"` quando o PIX expira
- Implementar timer visual no frontend baseado no momento de criação + 24h

---

## 11. Tratamento de erros

📄 **Fato documentado** + **Confirmado via teste**

| HTTP Status | Significado | Confirmado? |
|-------------|-------------|-------------|
| `201` | Transação criada com sucesso | ✅ Confirmado (não 200!) |
| `400` | Erro de validação (campos inválidos/ausentes) | 📄 Doc |
| `401` | Falha na autenticação (credenciais inválidas) | 📄 Doc |
| `500` | Erro interno do servidor | 📄 Doc |

### Formato do envelope de resposta (DP-4 PARCIALMENTE RESOLVIDO)

📄 **Fato confirmado**: Toda resposta segue o envelope:

```json
{
  "data": { ... },
  "success": true,
  "return_message_type": 201,
  "error_messages": [],
  "inner_exception": null
}
```

- Em caso de sucesso: `success: true`, `error_messages: []`
- Em caso de erro: provavelmente `success: false`, `error_messages: [...]` (inferência baseada no envelope)

❓ **Ainda pendente**: formato exato de `error_messages` em caso de 400 (testar com payload inválido)

**Implementação recomendada**:

```typescript
if (response.status === 201 || response.status === 200) {
  const json = await response.json();
  if (json.success) return json.data;
  throw new Error(json.error_messages?.join(', ') || 'Erro desconhecido');
}
if (response.status === 400) {
  const json = await response.json();
  throw new ValidationError(json.error_messages || ['Dados inválidos']);
}
if (response.status === 401) {
  throw new Error('Credenciais GestãoPay inválidas');
}
if (response.status >= 500) {
  throw new Error('Erro interno GestãoPay');
}
```

---

## 12. Fluxo ponta a ponta (PIX)

```
┌─────────────┐    ┌──────────┐    ┌──────────────┐    ┌──────────────┐
│  Frontend   │───▶│  API     │───▶│  GestãoPay   │───▶│  Banco/PIX   │
│  (Checkout) │    │  Route   │    │  API         │    │  Infra       │
└─────────────┘    └──────────┘    └──────────────┘    └──────────────┘

1. Usuário preenche checkout (nome, email, CPF, telefone)
2. Frontend envia POST /api/checkout
3. Backend cria pedido no banco (status: PENDING)
4. Backend envia POST para GestãoPay /v1/payment-transaction/create
5. GestãoPay retorna dados do PIX (QR Code + copia-e-cola + ID)
6. Backend salva transaction_id da GestãoPay no pedido
7. Frontend exibe QR Code + código + timer de expiração
8. Usuário paga o PIX no banco
9. GestãoPay envia webhook para /api/webhooks/gestaopay
10. Backend atualiza status do pedido para PAID
11. Frontend redireciona para página de confirmação
     (via polling ou SSE — decisão de implementação)
```

---

## 13. Lacunas identificadas (atualizado em 2026-04-14)

| # | Lacuna | Impacto | Status | Ação |
|---|--------|---------|--------|------|
| 1 | ~~Campos PIX na resposta de criação~~ | ~~🔴 Crítico~~ | ✅ **RESOLVIDO** | Campos mapeados: `data.pix.qr_code`, `data.pix.url`, `data.pix.expiration_date`, `data.pix.e2_e` |
| 2 | **Assinatura/validação do webhook** não documentada | 🟡 Médio | ❓ Pendente | Implementar double-check via GET |
| 3 | ~~Formato do corpo de erro (400/500)~~ | ~~🟡 Médio~~ | ⚠️ **PARCIAL** | Envelope confirmado: `{ data, success, error_messages, inner_exception }`. Falta testar erro 400 |
| 4 | **Inconsistência de unidade** — centavos (POST) vs reais (GET/webhook) | 🔴 Crítico | ✅ **CONFIRMADO** | POST `amount` = centavos; GET `amount` = reais. Normalizar na camada de parsing |
| 5 | **Inconsistência de casing** — snake_case (API) vs PascalCase (webhook) | 🟡 Médio | 📄 Doc | Normalizar na camada de parsing |
| 6 | **Formato de data misto** — `created_at` em dd/MM/yyyy vs `updated_at` em ISO | 🟡 Médio | ✅ **CONFIRMADO** | Confirmado no GET. Parser flexível de datas obrigatório |
| 7 | **Expiração do PIX não retornada pela API** | 🟡 Médio | ✅ **NOVO** | `pix.expiration_date` retorna zero date. Calcular como `createdAt + expires_in_days` |
| 8 | **Webhook de expiração automática** não confirmado | 🟡 Médio | ❓ Pendente | Implementar tratamento tanto via webhook quanto polling |
| 9 | **Rate limiting** não documentado | 🟢 Baixo | ❓ Pendente | N/A para volume do MVP |
| 10 | **`pix.url` retorna null** — sem imagem de QR Code | 🟡 Médio | ✅ **NOVO** | Gerar QR Code no frontend a partir de `pix.qr_code` usando `qrcode.react` |
| 11 | **`data` é objeto, não array** na resposta | 🟡 Médio | ✅ **NOVO** | Corrigir parsing: `response.data` (não `response.data[0]`) |
| 12 | **`unit_price` em items no GET está em reais, no POST em centavos** | 🟡 Médio | ✅ **NOVO** | Considerar no parsing se usar dados de items do GET |

---

## 14. Decisões pendentes consolidadas (atualizado em 2026-04-14)

| # | Decisão | Status | Resolução |
|---|---------|--------|-----------|
| DP-1 | Quais são os nomes exatos dos campos PIX na resposta? | ✅ **RESOLVIDO** | Campo `data.pix.qr_code` = código copia-e-cola EMV. Não retorna imagem. Gerar QR Code no frontend. |
| DP-2 | Existe validação de assinatura no webhook? | ❓ Pendente | Implementar double-check via GET |
| DP-3 | O webhook de `EXPIRED` é disparado automaticamente? | ❓ Pendente | Assumir que sim + implementar fallback de polling |
| DP-4 | Qual o exato formato de erro 400? | ⚠️ **PARCIAL** | Envelope confirmado: `{ success, error_messages, inner_exception }`. Testar com payload inválido se necessário |
| DP-5 | Existe ambiente de sandbox/testes? | ✅ **RESOLVIDO** | **Não existe sandbox.** Testes são feitos em produção. Credenciais são `live`. |
| DP-6 | Valor do `Amount` no GET/webhook é em reais? | ✅ **CONFIRMADO** | `amount` em POST = centavos (100 = R$1). `amount` em GET = reais (1.00 = R$1). Webhook = reais (conforme doc). |
