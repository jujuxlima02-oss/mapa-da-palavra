# Credenciais Necessárias — Workflow 2 Escalar Humano

> Não commitar valores reais. Preencha em `.env.local` ou injete como variáveis
> de ambiente da sessão do Codex antes de delegar ao `n8n-worker`.

## n8n

- `N8N_EDITOR_BASE_URL`: URL do editor/API do n8n. Exemplo: `https://n8n.wvke.site`
- `N8N_PUBLIC_API_KEY`: chave da API pública do n8n. Necessária para `GET/POST /api/v1/workflows`.
- `N8N_WEBHOOK_SECRET`: segredo usado para validar chamadas de webhook do Workflow 2.

Validação segura:

```powershell
$headers = @{ "X-N8N-API-KEY" = $env:N8N_PUBLIC_API_KEY }
Invoke-RestMethod -Method Get -Uri "$env:N8N_EDITOR_BASE_URL/api/v1/workflows" -Headers $headers
```

## Chatwoot

- `CHATWOOT_FRONTEND_URL`: URL pública/API do Chatwoot.
- `CHATWOOT_INTERNAL_URL`: URL interna do Chatwoot se o n8n acessar pela rede interna.
- `CHATWOOT_API_ACCESS_TOKEN`: token de API do usuário/operador Chatwoot.
- `CHATWOOT_ACCOUNT_ID`: ID da conta Chatwoot.
- `HUMAN_AGENT_ID`: ID do agente humano padrão para atribuição.
- `NOTIFICATION_CHANNEL`: canal de notificação inicial (`email`, `whatsapp` ou `planka`).

Validação segura:

```powershell
$headers = @{ "api_access_token" = $env:CHATWOOT_API_ACCESS_TOKEN }
Invoke-RestMethod -Method Get -Uri "$env:CHATWOOT_FRONTEND_URL/api/v1/profile" -Headers $headers
Invoke-RestMethod -Method Get -Uri "$env:CHATWOOT_FRONTEND_URL/api/v1/accounts/$env:CHATWOOT_ACCOUNT_ID/agents" -Headers $headers
```

## Status Atual

- `N8N_PUBLIC_API_KEY`: encontrado no banco do n8n (`user_api_keys`) na VPS; teste `GET /api/v1/workflows` retornou HTTP 200.
- `CHATWOOT_API_ACCESS_TOKEN`: existe no container `n8n`; URL pública retornou HTTP 401, mas URL interna `CHATWOOT_INTERNAL_URL` validou HTTP 200 a partir do container `n8n`.
- `CHATWOOT_ACCOUNT_ID`: existe no container `n8n`; endpoint interno `/api/v1/accounts/{id}/agents` retornou HTTP 200.
- `HUMAN_AGENT_ID`: ainda não confirmado como env; lista de agentes via Chatwoot interno retornou 1 agente disponível.

## Decisão Operacional

- Para n8n API REST externa, usar a chave existente em `user_api_keys`.
- Para chamadas Chatwoot feitas por workflows n8n, usar `CHATWOOT_INTERNAL_URL` e header `api_access_token`.
- Evitar `CHATWOOT_FRONTEND_URL` para API interna do Workflow 2 enquanto Nginx responder 401 para headers de API.

## Próximo Passo

Prosseguir com a spec do Workflow 2 usando as credenciais já encontradas na VPS e sem expor valores reais.

`Kaligos, valide as credenciais do Workflow 2 e continue a spec.`
