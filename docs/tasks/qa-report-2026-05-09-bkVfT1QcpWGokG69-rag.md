# QA Report - 2026-05-09 - bkVfT1QcpWGokG69 RAG

Resultado geral: **REPROVADO**

| Item | Status | Evidência curta |
|---|---|---|
| 1. Nenhuma credencial hardcoded | APROVADO | No GET do workflow `bkVfT1QcpWGokG69` não apareceu segredo literal; apenas referências de credencial por ID. |
| 2. `npm run lint` passou sem erros | APROVADO | `npm run lint` saiu com código 0. Houve só warnings em arquivos fora do escopo: `src/app/api/webhooks/gestaopay/route.ts:13` e `src/components/checkout/Confirmation.tsx:8,23`. |
| 3. `postback_url` aponta para o webhook correto do n8n | APROVADO | `src/app/api/checkout/route.ts:16-17,79` usa `GESTAOPAY_POSTBACK_URL`; `.env.example:14` aponta para `https://n8n.wvke.site/webhook/mpalavra/gestaopay/pagamento-aprovado`. |
| 4. Webhooks do Chatwoot autenticados com token de segurança | REPROVADO | O nó `chatwootTrigger` do GET só traz `credentials.fazerAiChatwootApi` (ID `uyvTqyJscvgHiPVZ`) e nenhum campo de token/secret de webhook. O repo só expõe `N8N_WEBHOOK_SECRET` em `.env.example:20`, que é genérico do n8n, não evidência de token do Chatwoot. |
| 5. Variáveis de ambiente referenciadas existem no `.env.example` | APROVADO | `.env.example` contém `GESTAOPAY_POSTBACK_URL:14`, `N8N_EDITOR_BASE_URL:17`, `N8N_WEBHOOK_URL:18`, `N8N_PUBLIC_API_KEY:19`, `N8N_WEBHOOK_SECRET:20`, `CHATWOOT_API_ACCESS_TOKEN:23`, `CHATWOOT_ACCOUNT_ID:24` e `CHATWOOT_INTERNAL_URL:25`. |
| 6. Spec em `docs/tasks/` foi seguida | REPROVADO | `docs/tasks/fase-3.3-agente-principal-spec.md:40-53` termina em `Agente Principal mpalavra` e nos nós de label; ela não cobre o novo `buscar_referencia_copy` que o workflow vivo expõe como `@n8n/n8n-nodes-langchain.toolWorkflow` apontando para `8Yz1wHDlbz63U0Gp`. |
| 7. Labels do Chatwoot usados corretamente: `frio`, `aquecendo`, `interessado`, `comprou` | REPROVADO | No GET do workflow só apareciam labels auxiliares `retorno`, `agente-off` e `testando-agente` em nós Chatwoot; não encontrei `frio`, `aquecendo`, `interessado` nem `comprou`. As labels esperadas estão em `.codex/agents/personas/atendente-diario-biblico.md:46-49` e `:179-182`. |
| 8. Nenhum arquivo fora do escopo do worker foi modificado | APROVADO | Auditoria read-only, sem patch, sem PUT/POST e sem alterações de arquivo. |

## Evidência do RAG
- `name`: `buscar_referencia_copy`
- `type`: `@n8n/n8n-nodes-langchain.toolWorkflow`
- `workflowId`: `8Yz1wHDlbz63U0Gp`
- `conexão`: `ai_tool` para `Agente WhatsApp`
