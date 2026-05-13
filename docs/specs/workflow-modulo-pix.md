# Spec SDD — Workflow n8n: Módulo PIX - Pagamento e Entrega

**Status:** Aguardando validação do usuário  
**Agente responsável pela spec:** arquiteto-senior  
**Implementador futuro:** n8n-worker  
**Fontes:** `AGENTS.md`, `docs/tasks/pix-module.md`, `docs/gestaopay-normalizado.md`, ADR-001  

## 1. Nome do workflow e descrição

**Nome:** `Módulo PIX - Pagamento e Entrega`

**Descrição:** workflow n8n responsável por receber intenção de compra do fluxo WhatsApp/Chatwoot, gerar cobrança PIX na GestãoPay, enviar os dados de pagamento ao lead via Chatwoot, receber o postback da GestãoPay, confirmar o pagamento por double-check na API do gateway e entregar automaticamente o acesso somente após confirmação real.

O workflow tem duas entradas independentes:

1. `POST /webhook/mpalavra/pix/intencao-compra` — entrada operacional para intenção de compra.
2. `POST ${GESTAOPAY_POSTBACK_URL}` — listener separado para postback da GestãoPay.

## 2. Requisitos funcionais

- Detectar intenção de compra quando a mensagem contiver `quero comprar`, `quanto custa` ou `fazer pedido`.
- Criar transação PIX na GestãoPay usando `POST /v1/payment-transaction/create`.
- Enviar ao lead, via Chatwoot API, uma única mensagem com valor, produto, prazo e PIX copia-e-cola.
- Registrar no Chatwoot os dados do PIX em custom attributes.
- Receber postback da GestãoPay por webhook separado.
- Fazer double-check obrigatório na GestãoPay via `GET /v1/payment-transaction/info/{id}` antes de liberar acesso.
- Entregar acesso somente quando o status confirmado for `PAID`.
- Em timeout sem pagamento, enviar no máximo um follow-up e registrar estado.

## 3. Contratos de entrada

### 3.1 Intenção de compra

**Endpoint público n8n:** `POST https://n8n.wvke.site/webhook/mpalavra/pix/intencao-compra`

Payload esperado:

```json
{
  "account_id": "1",
  "conversation_id": "123",
  "contact_id": "456",
  "nome": "Maria Silva",
  "telefone": "5511999999999",
  "email": "maria@email.com",
  "cpf": "12345678901",
  "mensagem": "quero comprar",
  "produto": "Diário Bíblico — Mapa da Palavra",
  "valor_centavos": 4990
}
```

Campos mínimos para criar PIX:

- `conversation_id`
- `nome`
- `telefone`
- `email`
- `cpf`

Se `email` ou `cpf` não estiverem disponíveis, o workflow não deve chamar a GestãoPay. Deve enviar uma mensagem via Chatwoot solicitando os dados faltantes.

### 3.2 Postback GestãoPay

**Endpoint:** definido por `${GESTAOPAY_POSTBACK_URL}`.

Payload observado:

```json
{
  "Id": "gateway-id",
  "Status": "PENDING",
  "Amount": 49.9,
  "PaidAt": "0001-01-01T00:00:00"
}
```

O postback não é fonte suficiente para liberar acesso. Ele apenas dispara o double-check.

## 4. Custom Attributes do Chatwoot

Criar ou confirmar os seguintes custom attributes de conversa:

| Chave | Tipo | Valores esperados | Uso |
| --- | --- | --- | --- |
| `status_pagamento` | text/list | `sem_pix`, `pix_pendente`, `pix_enviado`, `pago`, `expirado`, `erro` | Estado do pagamento na conversa |
| `pix_key` | text | EMV copia-e-cola | Texto PIX enviado ao lead |
| `pix_qr_code` | text | EMV usado para renderizar QR Code | Como a GestãoPay retorna `data.pix.url = null`, guardar o EMV |
| `produto_comprado` | text | `Diário Bíblico — Mapa da Palavra` | Produto comprado/liberado |

Observação técnica: para correlacionar postback com conversa, o workflow deve gravar `conversation_id`, `contact_id` e `account_id` no `metadata` da transação GestãoPay. O double-check `GET /info/{id}` retorna `metadata`, permitindo localizar a conversa sem depender de busca por texto no Chatwoot.

## 5. Nós n8n por etapa

### Etapa 1 — Detecção de intenção de compra

1. **Webhook — Intenção de compra**
   - Tipo: `n8n-nodes-base.webhook`
   - Método: `POST`
   - Path: `mpalavra/pix/intencao-compra`

2. **Set — Normalizar entrada**
   - Normaliza `mensagem`, `conversation_id`, `contact_id`, `nome`, `telefone`, `email`, `cpf`, `valor_centavos`.
   - Define defaults:
     - `produto = "Diário Bíblico — Mapa da Palavra"`
     - `valor_centavos = 4990`

3. **If — Intenção de compra?**
   - Tipo: `n8n-nodes-base.if`
   - Combinator: `OR`
   - Condições:
     - mensagem contém `quero comprar`
     - mensagem contém `quanto custa`
     - mensagem contém `fazer pedido`

4. **If — Dados mínimos para PIX?**
   - Confere `conversation_id`, `nome`, `telefone`, `email`, `cpf`.
   - Se faltar dado, envia mensagem solicitando complemento e encerra.

### Etapa 2 — Geração e envio da mensagem PIX

5. **HTTP Request — Criar PIX GestãoPay**
   - Método: `POST`
   - URL: `={{ $env.GESTAOPAY_API_URL }}/v1/payment-transaction/create`
   - Auth: Basic Auth com `GESTAOPAY_PUBLIC_KEY:GESTAOPAY_SECRET_KEY`
   - Headers:
     - `Content-Type: application/json`
     - `Accept: application/json`
   - Body:
     - `amount: 4990`
     - `payment_method: "pix"`
     - `postback_url: ={{ $env.GESTAOPAY_POSTBACK_URL }}`
     - `customer.name`, `customer.email`, `customer.phone`, `customer.document.number`
     - `items[0].title = "Diário Bíblico — Mapa da Palavra"`
     - `items[0].unit_price = 4990`
     - `items[0].quantity = 1`
     - `pix.expires_in_days = 1`
     - `metadata.account_id`, `metadata.conversation_id`, `metadata.contact_id`, `metadata.produto`

6. **Set — Extrair dados PIX**
   - `gateway_id = data.id`
   - `pix_key = data.pix.qr_code`
   - `pix_qr_code = data.pix.qr_code`
   - `valor_formatado = "R$ 49,90"`
   - `status_pagamento = "pix_enviado"`

7. **HTTP Request — Atualizar custom attributes Chatwoot**
   - Método: `PUT`
   - URL: `={{ $env.CHATWOOT_INTERNAL_URL }}/api/v1/accounts/{{ $json.account_id }}/conversations/{{ $json.conversation_id }}/custom_attributes`
   - Auth: header `api_access_token`
   - Body:
     - `status_pagamento`
     - `pix_key`
     - `pix_qr_code`
     - `produto_comprado`

8. **HTTP Request — Enviar PIX via Chatwoot**
   - Método: `POST`
   - URL: `={{ $env.CHATWOOT_INTERNAL_URL }}/api/v1/accounts/{{ $json.account_id }}/conversations/{{ $json.conversation_id }}/messages`
   - Body:
     - `message_type: "outgoing"`
     - `private: false`
     - `content`: mensagem única com produto, valor, prazo e copia-e-cola.

### Etapa 3 — Confirmação de pagamento

9. **Webhook — Postback GestãoPay**
   - Tipo: `n8n-nodes-base.webhook`
   - Método: `POST`
   - Path: conforme `${GESTAOPAY_POSTBACK_URL}`

10. **Code — Normalizar postback**
    - Converte `Id`, `Status`, `Amount`, `PaidAt` para formato interno.
    - `gateway_id = Id`
    - `status_gateway = Status`

11. **HTTP Request — Double-check GestãoPay**
    - Método: `GET`
    - URL: `={{ $env.GESTAOPAY_API_URL }}/v1/payment-transaction/info/{{ $json.gateway_id }}`
    - Auth: Basic Auth com `GESTAOPAY_PUBLIC_KEY:GESTAOPAY_SECRET_KEY`

12. **If — Pagamento confirmado?**
    - Condição verdadeira somente quando `data.status == "PAID"`.
    - Se `PENDING`, responder `200` e aguardar novo postback ou timeout.
    - Se `EXPIRED`, `REFUSED` ou erro equivalente, atualizar `status_pagamento`.

13. **Wait — Timeout sem pagamento**
    - Espera sugerida: 15 minutos após envio do PIX.
    - Após esperar, consulta a GestãoPay pelo `gateway_id`.
    - Se ainda não pago, envia um follow-up único e marca `status_pagamento = "pix_pendente"`.

### Etapa 4 — Entrega do acesso

14. **HTTP Request — Atualizar pagamento aprovado no Chatwoot**
    - Atualiza custom attributes:
      - `status_pagamento = "pago"`
      - `produto_comprado = "Diário Bíblico — Mapa da Palavra"`

15. **HTTP Request — Enviar acesso via Chatwoot**
    - Envia uma única mensagem com confirmação de pagamento e instrução de acesso.
    - O link/credencial final deve vir de variável ou fonte segura definida antes da implementação.

16. **Respond to Webhook — Confirmar recebimento**
    - Retorna `200` para GestãoPay em todos os cenários tratados.

## 6. Estrutura JSON do workflow

JSON estrutural para orientar o n8n-worker. O schema final deve ser ajustado contra a versão real do n8n por GET/PUT completo via API REST.

```json
{
  "name": "Módulo PIX - Pagamento e Entrega",
  "nodes": [
    {
      "name": "Webhook — Intenção de compra",
      "type": "n8n-nodes-base.webhook",
      "typeVersion": 2,
      "parameters": {
        "httpMethod": "POST",
        "path": "mpalavra/pix/intencao-compra",
        "responseMode": "responseNode"
      }
    },
    {
      "name": "Set — Normalizar entrada",
      "type": "n8n-nodes-base.set",
      "typeVersion": 3,
      "parameters": {
        "assignments": {
          "assignments": [
            { "name": "mensagem", "value": "={{ ($json.mensagem || $json.content || '').toLowerCase() }}", "type": "string" },
            { "name": "account_id", "value": "={{ $json.account_id || '1' }}", "type": "string" },
            { "name": "conversation_id", "value": "={{ $json.conversation_id }}", "type": "string" },
            { "name": "contact_id", "value": "={{ $json.contact_id }}", "type": "string" },
            { "name": "nome", "value": "={{ $json.nome || $json.name }}", "type": "string" },
            { "name": "telefone", "value": "={{ $json.telefone || $json.phone }}", "type": "string" },
            { "name": "email", "value": "={{ $json.email }}", "type": "string" },
            { "name": "cpf", "value": "={{ $json.cpf }}", "type": "string" },
            { "name": "produto", "value": "Diário Bíblico — Mapa da Palavra", "type": "string" },
            { "name": "valor_centavos", "value": 4990, "type": "number" }
          ]
        }
      }
    },
    {
      "name": "If — Intenção de compra?",
      "type": "n8n-nodes-base.if",
      "typeVersion": 2,
      "parameters": {
        "conditions": {
          "combinator": "or",
          "conditions": [
            { "leftValue": "={{ $json.mensagem }}", "operation": "contains", "rightValue": "quero comprar" },
            { "leftValue": "={{ $json.mensagem }}", "operation": "contains", "rightValue": "quanto custa" },
            { "leftValue": "={{ $json.mensagem }}", "operation": "contains", "rightValue": "fazer pedido" }
          ]
        }
      }
    },
    {
      "name": "If — Dados mínimos para PIX?",
      "type": "n8n-nodes-base.if",
      "typeVersion": 2,
      "parameters": {
        "conditions": {
          "combinator": "and",
          "conditions": [
            { "leftValue": "={{ $json.conversation_id }}", "operation": "notEmpty" },
            { "leftValue": "={{ $json.nome }}", "operation": "notEmpty" },
            { "leftValue": "={{ $json.telefone }}", "operation": "notEmpty" },
            { "leftValue": "={{ $json.email }}", "operation": "notEmpty" },
            { "leftValue": "={{ $json.cpf }}", "operation": "notEmpty" }
          ]
        }
      }
    },
    {
      "name": "HTTP — Criar PIX GestãoPay",
      "type": "n8n-nodes-base.httpRequest",
      "typeVersion": 4,
      "parameters": {
        "method": "POST",
        "url": "={{ $env.GESTAOPAY_API_URL }}/v1/payment-transaction/create",
        "authentication": "genericCredentialType",
        "genericAuthType": "httpBasicAuth",
        "sendBody": true,
        "contentType": "json",
        "jsonBody": "={{ { amount: $json.valor_centavos, payment_method: 'pix', postback_url: $env.GESTAOPAY_POSTBACK_URL, customer: { name: $json.nome, email: $json.email, phone: $json.telefone, document: { number: $json.cpf, type: 'cpf' } }, items: [{ title: $json.produto, unit_price: $json.valor_centavos, quantity: 1, tangible: true, external_ref: $json.conversation_id }], pix: { expires_in_days: 1 }, metadata: { provider_name: 'mpalavra', account_id: $json.account_id, conversation_id: $json.conversation_id, contact_id: $json.contact_id, produto: $json.produto } } }}"
      }
    },
    {
      "name": "Set — Extrair dados PIX",
      "type": "n8n-nodes-base.set",
      "typeVersion": 3,
      "parameters": {
        "assignments": {
          "assignments": [
            { "name": "gateway_id", "value": "={{ $json.data.id }}", "type": "string" },
            { "name": "pix_key", "value": "={{ $json.data.pix.qr_code }}", "type": "string" },
            { "name": "pix_qr_code", "value": "={{ $json.data.pix.qr_code }}", "type": "string" },
            { "name": "status_pagamento", "value": "pix_enviado", "type": "string" },
            { "name": "valor_formatado", "value": "R$ 49,90", "type": "string" }
          ]
        }
      }
    },
    {
      "name": "HTTP — Atualizar custom attributes Chatwoot",
      "type": "n8n-nodes-base.httpRequest",
      "typeVersion": 4,
      "parameters": {
        "method": "PUT",
        "url": "={{ $env.CHATWOOT_INTERNAL_URL }}/api/v1/accounts/{{ $json.account_id }}/conversations/{{ $json.conversation_id }}/custom_attributes",
        "sendHeaders": true,
        "sendBody": true,
        "contentType": "json",
        "jsonBody": "={{ { custom_attributes: { status_pagamento: $json.status_pagamento, pix_key: $json.pix_key, pix_qr_code: $json.pix_qr_code, produto_comprado: $json.produto } } }}"
      }
    },
    {
      "name": "HTTP — Enviar PIX via Chatwoot",
      "type": "n8n-nodes-base.httpRequest",
      "typeVersion": 4,
      "parameters": {
        "method": "POST",
        "url": "={{ $env.CHATWOOT_INTERNAL_URL }}/api/v1/accounts/{{ $json.account_id }}/conversations/{{ $json.conversation_id }}/messages",
        "sendHeaders": true,
        "sendBody": true,
        "contentType": "json",
        "jsonBody": "={{ { content: 'Seu PIX do Diário Bíblico — Mapa da Palavra ficou em R$ 49,90. Copie e cole este código no app do seu banco:\\n\\n' + $json.pix_key + '\\n\\nPrazo: 15 minutos. Assim que o pagamento for confirmado, eu libero seu acesso por aqui.', message_type: 'outgoing', private: false } }}"
      }
    },
    {
      "name": "HTTP — Solicitar dados faltantes via Chatwoot",
      "type": "n8n-nodes-base.httpRequest",
      "typeVersion": 4,
      "parameters": {
        "method": "POST",
        "url": "={{ $env.CHATWOOT_INTERNAL_URL }}/api/v1/accounts/{{ $json.account_id }}/conversations/{{ $json.conversation_id }}/messages",
        "sendHeaders": true,
        "sendBody": true,
        "contentType": "json",
        "jsonBody": "={{ { content: 'Para eu gerar seu PIX com segurança, me envie nome completo, CPF e email.', message_type: 'outgoing', private: false } }}"
      }
    },
    {
      "name": "Wait — Timeout sem pagamento",
      "type": "n8n-nodes-base.wait",
      "typeVersion": 1,
      "parameters": {
        "amount": 15,
        "unit": "minutes"
      }
    },
    {
      "name": "HTTP — Consultar PIX após timeout",
      "type": "n8n-nodes-base.httpRequest",
      "typeVersion": 4,
      "parameters": {
        "method": "GET",
        "url": "={{ $env.GESTAOPAY_API_URL }}/v1/payment-transaction/info/{{ $json.gateway_id }}",
        "authentication": "genericCredentialType",
        "genericAuthType": "httpBasicAuth"
      }
    },
    {
      "name": "If — PIX pago após timeout?",
      "type": "n8n-nodes-base.if",
      "typeVersion": 2,
      "parameters": {
        "conditions": {
          "conditions": [
            { "leftValue": "={{ $json.data.status }}", "operation": "equals", "rightValue": "PAID" }
          ]
        }
      }
    },
    {
      "name": "HTTP — Follow-up PIX pendente",
      "type": "n8n-nodes-base.httpRequest",
      "typeVersion": 4,
      "parameters": {
        "method": "POST",
        "url": "={{ $env.CHATWOOT_INTERNAL_URL }}/api/v1/accounts/{{ $json.data.metadata.account_id }}/conversations/{{ $json.data.metadata.conversation_id }}/messages",
        "sendHeaders": true,
        "sendBody": true,
        "contentType": "json",
        "jsonBody": "={{ { content: 'Passando só para te avisar: seu PIX ainda consta como pendente por aqui. Quando o pagamento confirmar, eu libero seu acesso automaticamente.', message_type: 'outgoing', private: false } }}"
      }
    },
    {
      "name": "Webhook — Postback GestãoPay",
      "type": "n8n-nodes-base.webhook",
      "typeVersion": 2,
      "parameters": {
        "httpMethod": "POST",
        "path": "mpalavra/gestaopay/pagamento-aprovado",
        "responseMode": "responseNode"
      }
    },
    {
      "name": "Code — Normalizar postback",
      "type": "n8n-nodes-base.code",
      "typeVersion": 2,
      "parameters": {
        "jsCode": "return [{ json: { gateway_id: $json.Id, status_gateway: $json.Status, amount_reais: $json.Amount, paid_at: $json.PaidAt } }];"
      }
    },
    {
      "name": "HTTP — Double-check GestãoPay",
      "type": "n8n-nodes-base.httpRequest",
      "typeVersion": 4,
      "parameters": {
        "method": "GET",
        "url": "={{ $env.GESTAOPAY_API_URL }}/v1/payment-transaction/info/{{ $json.gateway_id }}",
        "authentication": "genericCredentialType",
        "genericAuthType": "httpBasicAuth"
      }
    },
    {
      "name": "If — Pagamento confirmado?",
      "type": "n8n-nodes-base.if",
      "typeVersion": 2,
      "parameters": {
        "conditions": {
          "conditions": [
            { "leftValue": "={{ $json.data.status }}", "operation": "equals", "rightValue": "PAID" }
          ]
        }
      }
    },
    {
      "name": "HTTP — Atualizar pagamento aprovado no Chatwoot",
      "type": "n8n-nodes-base.httpRequest",
      "typeVersion": 4,
      "parameters": {
        "method": "PUT",
        "url": "={{ $env.CHATWOOT_INTERNAL_URL }}/api/v1/accounts/{{ $json.data.metadata.account_id }}/conversations/{{ $json.data.metadata.conversation_id }}/custom_attributes",
        "sendHeaders": true,
        "sendBody": true,
        "contentType": "json",
        "jsonBody": "={{ { custom_attributes: { status_pagamento: 'pago', produto_comprado: $json.data.metadata.produto } } }}"
      }
    },
    {
      "name": "HTTP — Enviar acesso via Chatwoot",
      "type": "n8n-nodes-base.httpRequest",
      "typeVersion": 4,
      "parameters": {
        "method": "POST",
        "url": "={{ $env.CHATWOOT_INTERNAL_URL }}/api/v1/accounts/{{ $json.data.metadata.account_id }}/conversations/{{ $json.data.metadata.conversation_id }}/messages",
        "sendHeaders": true,
        "sendBody": true,
        "contentType": "json",
        "jsonBody": "={{ { content: 'Pagamento confirmado. Seu acesso ao Diário Bíblico — Mapa da Palavra está liberado: ' + $env.MPALAVRA_ACCESS_URL, message_type: 'outgoing', private: false } }}"
      }
    },
    {
      "name": "Respond — OK",
      "type": "n8n-nodes-base.respondToWebhook",
      "typeVersion": 1,
      "parameters": {
        "respondWith": "json",
        "responseBody": "={{ { ok: true } }}"
      }
    }
  ],
  "connections": {
    "Webhook — Intenção de compra": {
      "main": [[{ "node": "Set — Normalizar entrada", "type": "main", "index": 0 }]]
    },
    "Set — Normalizar entrada": {
      "main": [[{ "node": "If — Intenção de compra?", "type": "main", "index": 0 }]]
    },
    "If — Intenção de compra?": {
      "main": [
        [{ "node": "If — Dados mínimos para PIX?", "type": "main", "index": 0 }],
        [{ "node": "Respond — OK", "type": "main", "index": 0 }]
      ]
    },
    "If — Dados mínimos para PIX?": {
      "main": [
        [{ "node": "HTTP — Criar PIX GestãoPay", "type": "main", "index": 0 }],
        [{ "node": "HTTP — Solicitar dados faltantes via Chatwoot", "type": "main", "index": 0 }]
      ]
    },
    "HTTP — Solicitar dados faltantes via Chatwoot": {
      "main": [[{ "node": "Respond — OK", "type": "main", "index": 0 }]]
    },
    "HTTP — Criar PIX GestãoPay": {
      "main": [[{ "node": "Set — Extrair dados PIX", "type": "main", "index": 0 }]]
    },
    "Set — Extrair dados PIX": {
      "main": [[{ "node": "HTTP — Atualizar custom attributes Chatwoot", "type": "main", "index": 0 }]]
    },
    "HTTP — Atualizar custom attributes Chatwoot": {
      "main": [[{ "node": "HTTP — Enviar PIX via Chatwoot", "type": "main", "index": 0 }]]
    },
    "HTTP — Enviar PIX via Chatwoot": {
      "main": [[{ "node": "Wait — Timeout sem pagamento", "type": "main", "index": 0 }]]
    },
    "Wait — Timeout sem pagamento": {
      "main": [[{ "node": "HTTP — Consultar PIX após timeout", "type": "main", "index": 0 }]]
    },
    "HTTP — Consultar PIX após timeout": {
      "main": [[{ "node": "If — PIX pago após timeout?", "type": "main", "index": 0 }]]
    },
    "If — PIX pago após timeout?": {
      "main": [
        [{ "node": "HTTP — Atualizar pagamento aprovado no Chatwoot", "type": "main", "index": 0 }],
        [{ "node": "HTTP — Follow-up PIX pendente", "type": "main", "index": 0 }]
      ]
    },
    "HTTP — Follow-up PIX pendente": {
      "main": [[{ "node": "Respond — OK", "type": "main", "index": 0 }]]
    },
    "Webhook — Postback GestãoPay": {
      "main": [[{ "node": "Code — Normalizar postback", "type": "main", "index": 0 }]]
    },
    "Code — Normalizar postback": {
      "main": [[{ "node": "HTTP — Double-check GestãoPay", "type": "main", "index": 0 }]]
    },
    "HTTP — Double-check GestãoPay": {
      "main": [[{ "node": "If — Pagamento confirmado?", "type": "main", "index": 0 }]]
    },
    "If — Pagamento confirmado?": {
      "main": [
        [{ "node": "HTTP — Atualizar pagamento aprovado no Chatwoot", "type": "main", "index": 0 }],
        [{ "node": "Respond — OK", "type": "main", "index": 0 }]
      ]
    },
    "HTTP — Atualizar pagamento aprovado no Chatwoot": {
      "main": [[{ "node": "HTTP — Enviar acesso via Chatwoot", "type": "main", "index": 0 }]]
    },
    "HTTP — Enviar acesso via Chatwoot": {
      "main": [[{ "node": "Respond — OK", "type": "main", "index": 0 }]]
    }
  }
}
```

## 7. Decisões técnicas

1. **Confirmação por webhook com double-check:** o postback da GestãoPay dispara o fluxo, mas a liberação só ocorre após `GET /v1/payment-transaction/info/{id}` retornar `PAID`.
2. **PIX em centavos:** criação usa `amount = 4990`; webhook e consulta podem retornar valor em reais, conforme referência normalizada.
3. **QR Code:** a GestãoPay retorna `data.pix.qr_code` como EMV copia-e-cola e `data.pix.url = null`; portanto `pix_qr_code` guarda o mesmo EMV para renderização futura.
4. **Correlação por metadata:** `account_id`, `conversation_id` e `contact_id` entram no `metadata` da GestãoPay para localizar a conversa no postback.
5. **Sem dados falsos:** se CPF ou email estiverem ausentes, o workflow pede dados ao lead e não cria cobrança.
6. **Entrega protegida:** acesso depende de `status == PAID`; mensagem “Paguei” do lead não libera acesso.
7. **Timeout simples:** primeira versão usa `Wait 15 minutos` + consulta + follow-up único. Se o volume crescer, trocar por workflow dedicado de polling.

## 8. Dependências

- n8n ativo em `https://n8n.wvke.site`.
- Credencial n8n Basic Auth para GestãoPay:
  - `GESTAOPAY_PUBLIC_KEY`
  - `GESTAOPAY_SECRET_KEY`
- Variáveis no ambiente n8n:
  - `GESTAOPAY_API_URL`
  - `GESTAOPAY_POSTBACK_URL`
  - `CHATWOOT_INTERNAL_URL`
  - `CHATWOOT_ACCOUNT_ID`
  - `MPALAVRA_ACCESS_URL` ou fonte equivalente para entrega do acesso.
- Credencial Chatwoot API com header `api_access_token`.
- Custom attributes Chatwoot criados antes da ativação:
  - `status_pagamento`
  - `pix_key`
  - `pix_qr_code`
  - `produto_comprado`

## 9. Critérios de validação antes da implementação

- Spec aprovada pelo usuário.
- Confirmar se `${GESTAOPAY_POSTBACK_URL}` continuará apontando para `/webhook/mpalavra/gestaopay/pagamento-aprovado` ou se será criada uma URL específica do módulo PIX.
- Confirmar link/fonte real de entrega em `MPALAVRA_ACCESS_URL`.
- Confirmar se o agente principal chamará `POST /webhook/mpalavra/pix/intencao-compra` diretamente ou via toolWorkflow.
- Confirmar se CPF/email serão coletados pelo agente antes do trigger PIX.

## 10. Fora do escopo desta spec

- Implementar o workflow no n8n.
- Alterar o workflow principal do agente.
- Criar credenciais ou custom attributes no Chatwoot.
- Liberar acesso sem confirmação real da GestãoPay.
