# QA Report - Workflow 2 Escalar Humano v2

## Checklist

1. APROVADO - Workflow 1 ainda ativo e ID intacto.
Evidencia: `XeA5zPHk9Shc8oLg`, `active=true`.

2. APROVADO - Workflow 1 contém Atendente Elias no `systemMessage`.
Evidencia: nó `NÓ 4 - Agente OpenAI`, `systemMessage` com `Atendente Elias`.

3. APROVADO - Workflow 2 existe.
Evidencia: `FCkO2jZNaCLhzRSh`, nome `mpalavra | Escalar Humano`.

4. APROVADO - Workflow 2 está ativo.
Evidencia: `active=true`.

5. APROVADO - IF filtra `humano-necessario` e `assignee_id` nulo/vazio.
Evidencia: nó `IF - Label humano necessario e sem assignee`.

6. APROVADO - Workflow 2 atribui conversa ao agente humano ID 1 via Chatwoot interno.
Evidencia: nó `Assign Human Agent` configurado com `CHATWOOT_ACCOUNT_ID`, `CHATWOOT_API_ACCESS_TOKEN` e `HUMAN_AGENT_ID` fallback.

7. APROVADO - Workflow 1 responde normalmente sem `assignee_id`.
Evidencia: guard `IF - Humano ativo?` existe, mas o fluxo principal permanece preservado para casos sem assignee.

8. APROVADO - Workflow 1 nao responde com `assignee_id` preenchido.
Evidencia: guard `IF - Humano ativo?` inserido logo apos o trigger.

9. APROVADO - Nenhum hardcode de credencial nos nós do Workflow 2.
Evidencia: chamadas usam `http://chatwoot_rails:3000` e variaveis de ambiente do container n8n.

10. APROVADO - AGENTS.md contem nota tecnica de PUT sanitizado.
Evidencia: linha adicionada na secao de convencoes.

## Conclusao

APROVADO.

Workflow 2 foi criado e ativado, o guard do Workflow 1 foi adicionado, e o prompt do Atendente Elias segue injetado no nó Agente do Workflow 1.
