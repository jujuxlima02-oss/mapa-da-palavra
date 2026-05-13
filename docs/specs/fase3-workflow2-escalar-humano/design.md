# Design — Fase 3 Workflow 2: Escalar Humano

## Serviços

- n8n: hospeda o Workflow 2 `mpalavra | Escalar Humano`.
- Chatwoot: envia eventos e recebe atribuição/mensagem privada.
- Baileys: permanece como transporte WhatsApp indireto via Chatwoot/Workflow 1.
- OpenAI: system prompt do atendente fica documentado para nó futuro de agente, mas a atribuição humana não depende de geração textual.

## Estado Real Confirmado

- n8n API key: existente em `user_api_keys`, testada com HTTP 200 em `/api/v1/workflows`.
- Workflow 1: `XeA5zPHk9Shc8oLg`, ativo, 15 nós.
- Workflow 2: não existe ainda.
- Chatwoot interno: `CHATWOOT_INTERNAL_URL` validado por Node dentro do container `n8n`.
- Agente humano: único agente retornado, ID `1`, role `administrator`, status `online`.

## Estrutura de Nós Proposta

1. Webhook Trigger
   - Recebe eventos do Chatwoot.
   - Path proposto: `mpalavra/chatwoot/escalar-humano`.

2. Filter / IF
   - Verifica se labels contêm `humano-necessario`.
   - Verifica se `assignee_id` está vazio.

3. Prepare Assignment
   - Extrai `account_id`, `conversation_id`, `contact`, `labels`.
   - Define `human_agent_id = 1` enquanto só houver um agente.

4. Assign Human Agent
   - HTTP POST para `{{$env.CHATWOOT_INTERNAL_URL}}/api/v1/accounts/{{$env.CHATWOOT_ACCOUNT_ID}}/conversations/{{$json.conversation_id}}/assignments`
   - Header: `api_access_token: {{$env.CHATWOOT_API_ACCESS_TOKEN}}`
   - Body: `{ "assignee_id": 1 }`

5. Private Notification
   - HTTP POST para `/messages`.
   - Cria mensagem privada informando que a conversa foi escalada.

6. Confirm Response
   - Retorna 200 ao Chatwoot.

## Integração com Workflow 1

Workflow 1 deve considerar conversa em modo humano quando:
- `assignee_id` estiver preenchido; ou
- labels contiverem `humano-necessario`.

Nesta etapa, Workflow 1 não será editado. A pausa efetiva fica baseada na atribuição humana e no label existente. Se o Workflow 1 ignorar esse estado, uma task futura deve adicionar o check antes do nó Agente.

## Variáveis de Ambiente

- `CHATWOOT_INTERNAL_URL`
- `CHATWOOT_API_ACCESS_TOKEN`
- `CHATWOOT_ACCOUNT_ID`
- `N8N_PUBLIC_API_KEY` ou key existente obtida de `user_api_keys` na VPS para automação externa.
- `N8N_WEBHOOK_SECRET`
- `HUMAN_AGENT_ID` (opcional; se ausente, usar agente único retornado pela API interna)
- `NOTIFICATION_CHANNEL`

## Decisões Arquiteturais

- Usar URL interna do Chatwoot, pois a URL pública retornou 401 para API token.
- Não hardcodar credenciais; somente o ID humano `1` pode ser registrado como configuração operacional derivada de API.
- Não modificar Workflow 1 até validar se ele já pausa ao ver `assignee_id` ou `humano-necessario`.
- Criar Workflow 2 separado para reduzir risco de regressão no agente principal.
