# Fase 3.2 - Escalar Humano

Data: 2026-05-07

## Escopo

Workflow atualizado no n8n:

- Nome: `mpalavra | Escalar Humano`
- ID: `FCkO2jZNaCLhzRSh`
- Trigger: `executeWorkflowTrigger` / When Called by Another Workflow
- Payload remoto salvo em: `/tmp/escalar-humano-v2.json`

## Credenciais consultadas

Lista retornada pela API `/api/v1/credentials?limit=100`:

| ID | Nome | Tipo |
| --- | --- | --- |
| `uyvTqyJscvgHiPVZ` | `Chatwoot fazer.ai account` | `fazerAiChatwootApi` |
| `3a5e7dc9-91b6-41ab-917f-fc3093c4d8e4` | `OpenAI mpalavra` | `openAiApi` |

Credencial Chatwoot fazer.ai identificada:

- ID: `uyvTqyJscvgHiPVZ`
- Nome: `Chatwoot fazer.ai account`
- Tipo: `fazerAiChatwootApi`

Os nos `Adicionar etiqueta agente-off` e `Notificar corretor humano` foram publicados como `@fazer-ai/n8n-nodes-chatwoot.chatwoot`, ambos com bloco `credentials.fazerAiChatwootApi` preenchido. Nenhum valor secreto foi exposto.

## Evidencia do PUT

- HTTP status do PUT: `200`
- Workflow permaneceu ativo apos PUT: `active=true`
- Ativacao via `/activate`: `NAO_NECESSARIO`

## Confirmacao final por GET

```json
{
  "active": true,
  "nodeCount": 6,
  "nodeNames": [
    "Gatilho",
    "Assign Human Agent",
    "Adicionar etiqueta agente-off",
    "Nota privada Chatwoot",
    "Notificar corretor humano",
    "Resposta ao agente"
  ],
  "nodeTypes": [
    "n8n-nodes-base.executeWorkflowTrigger",
    "n8n-nodes-base.httpRequest",
    "@fazer-ai/n8n-nodes-chatwoot.chatwoot",
    "n8n-nodes-base.httpRequest",
    "@fazer-ai/n8n-nodes-chatwoot.chatwoot",
    "n8n-nodes-base.set"
  ],
  "customChatwootNodes": [
    "Adicionar etiqueta agente-off",
    "Notificar corretor humano"
  ],
  "customChatwootCredentialsPresent": {
    "Adicionar etiqueta agente-off": true,
    "Notificar corretor humano": true
  },
  "hasWebhook": false,
  "hasRespondToWebhook": false,
  "hasStickyNote": false,
  "settings": {
    "executionOrder": "v1"
  },
  "workflowId": "FCkO2jZNaCLhzRSh",
  "name": "mpalavra | Escalar Humano"
}
```

## Nos finais

1. `Gatilho`
2. `Assign Human Agent`
3. `Adicionar etiqueta agente-off`
4. `Nota privada Chatwoot`
5. `Notificar corretor humano`
6. `Resposta ao agente`

## Observacoes

- Sem no `Webhook`.
- Sem no `respondToWebhook`.
- Sem no `stickyNote`.
- `settings` final: `{ "executionOrder": "v1" }`.
- Nenhuma API key ou credencial real foi registrada neste relatorio.
