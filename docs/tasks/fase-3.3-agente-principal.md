# Fase 3.3 - Agente Principal mpalavra
Data: 2026-05-07
Status: CONCLUIDO

## Workflow
- ID: XeA5zPHk9Shc8oLg
- Nome: mpalavra | Agente WhatsApp Principal
- active: true
- nodeCount: 44

## Credenciais utilizadas
- Chatwoot fazer.ai account: uyvTqyJscvgHiPVZ OK
- OpenAI mpalavra: 3a5e7dc9-91b6-41ab-917f-fc3093c4d8e4 OK
- Neon Postgres mpalavra: XFcFZfjAkygxUzxc OK

## Parametros Chatwoot
- accountId: 1
- inboxId: 1

## Upgrades implementados
- OK Trigger: @fazer-ai/n8n-nodes-chatwoot.chatwootTrigger
- OK Fila: Postgres anti-encavalamento
- OK Status: Postgres lock/unlock
- OK Memoria: memoryPostgresChat
- OK Audio: Whisper
- OK Escalar humano: toolWorkflow -> FCkO2jZNaCLhzRSh
- OK Reflexao: toolThink

## Evidencia GET final
```text
active: True
nodeCount: 44
triggerType: @fazer-ai/n8n-nodes-chatwoot.chatwootTrigger
hasStickyNote: False
executionOrder: v1
```

## Evidencia operacional
- Payload final salvo na VPS: /tmp/agente-principal-v4.json
- PUT /api/v1/workflows/XeA5zPHk9Shc8oLg: HTTP 200
- POST /api/v1/workflows/XeA5zPHk9Shc8oLg/activate: HTTP 200
- GET final: criterios aprovados
