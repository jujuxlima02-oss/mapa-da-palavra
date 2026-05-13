# Tasks — Fase 3 Workflow 2: Escalar Humano

## TASK-W2-01 | SEQUENCIAL | SMALL

Agente: n8n-worker  
Arquivo alvo: n8n API `/api/v1/workflows`  
Instrução: Criar Workflow 2 vazio via POST com nome `mpalavra | Escalar Humano`.  
Depende de: NENHUMA  
Critério de conclusão: workflow criado, ID retornado e registrado em relatório.  
Sandbox: workspace-write

## TASK-W2-02 | SEQUENCIAL | SMALL

Agente: n8n-worker  
Arquivo alvo: Workflow 2 no n8n  
Instrução: Configurar Webhook Trigger para eventos Chatwoot com path `mpalavra/chatwoot/escalar-humano`.  
Depende de: TASK-W2-01  
Critério de conclusão: webhook existe e workflow aceita teste POST.  
Sandbox: workspace-write

## TASK-W2-03 | SEQUENCIAL | SMALL

Agente: n8n-worker  
Arquivo alvo: Workflow 2 no n8n  
Instrução: Adicionar filtro: labels contém `humano-necessario` e `assignee_id` vazio.  
Depende de: TASK-W2-02  
Critério de conclusão: filtro rejeita conversas já atribuídas ou sem label.  
Sandbox: workspace-write

## TASK-W2-04 | SEQUENCIAL | MEDIUM

Agente: n8n-worker  
Arquivo alvo: Workflow 2 no n8n  
Instrução: Referenciar system prompt em `.codex/agents/personas/atendente-diario-biblico.md` nas notas/config do agente; manter modelo `gpt-4o-mini` se nó Agente for usado.  
Depende de: TASK-W2-03  
Critério de conclusão: prompt completo está documentado para o nó Agente sem hardcode de credenciais.  
Sandbox: workspace-write

## TASK-W2-05 | SEQUENCIAL | SMALL

Agente: n8n-worker  
Arquivo alvo: Workflow 2 no n8n  
Instrução: Assign Human Agent via Chatwoot API interna usando `api_access_token` e agente humano confirmado ID `1`.  
Depende de: TASK-W2-03  
Critério de conclusão: conversa de teste pode ser atribuída ao agente humano correto.  
Sandbox: workspace-write

## TASK-W2-06 | SEQUENCIAL | SMALL

Agente: n8n-worker  
Arquivo alvo: Workflow 2 no n8n  
Instrução: Enviar notificação privada no Chatwoot após atribuição.  
Depende de: TASK-W2-05  
Critério de conclusão: mensagem privada/notificação é criada em menos de 30 segundos.  
Sandbox: workspace-write

## TASK-W2-07 | SEQUENCIAL | SMALL

Agente: n8n-worker  
Arquivo alvo: Workflow 2 + AGENTS.md  
Instrução: Ativar Workflow 2 e registrar ID/status após validação.  
Depende de: TASK-W2-06  
Critério de conclusão: workflow ativo, ID registrado, AGENTS.md atualizado.  
Sandbox: workspace-write
