# Tasks - Fase 3 Workflow 3: Follow-up Automático

## TASK-W3-01 | SEQUENCIAL | SMALL

Agente: n8n-worker
Arquivo alvo: n8n API `/api/v1/workflows`
Instrução: Criar Workflow 3 vazio via API.
Depende de: NENHUMA
Critério de conclusão: workflow criado com ID retornado.
Sandbox: workspace-write

## TASK-W3-02 | SEQUENCIAL | SMALL

Agente: n8n-worker
Arquivo alvo: Workflow 3 no n8n
Instrução: Adicionar Webhook Trigger para `conversation_updated`.
Depende de: TASK-W3-01
Critério de conclusão: nó ativo e respondendo a teste POST.
Sandbox: workspace-write

## TASK-W3-03 | SEQUENCIAL | SMALL

Agente: n8n-worker
Arquivo alvo: Workflow 3 no n8n
Instrução: Adicionar IF para `aquecendo` ou `interessado` sem `assignee_id`.
Depende de: TASK-W3-02
Critério de conclusão: rejeita conversas com humano ativo.
Sandbox: workspace-write

## TASK-W3-04 | SEQUENCIAL | SMALL

Agente: n8n-worker
Arquivo alvo: Workflow 3 no n8n
Instrução: Adicionar Set Node para janela 12h/24h conforme label.
Depende de: TASK-W3-03
Critério de conclusão: window configurada dinamicamente.
Sandbox: workspace-write

## TASK-W3-05 | SEQUENCIAL | MEDIUM

Agente: n8n-worker
Arquivo alvo: Workflow 3 no n8n
Instrução: Adicionar Wait Node usando `window`.
Depende de: TASK-W3-04
Critério de conclusão: wait dinâmico sem hardcode.
Sandbox: workspace-write

## TASK-W3-06 | SEQUENCIAL | MEDIUM

Agente: n8n-worker
Arquivo alvo: Workflow 3 no n8n
Instrução: Adicionar Check Silence via Chatwoot interno.
Depende de: TASK-W3-05
Critério de conclusão: última mensagem do lead verificada corretamente.
Sandbox: workspace-write

## TASK-W3-07 | SEQUENCIAL | MEDIUM

Agente: n8n-worker
Arquivo alvo: Workflow 3 no n8n
Instrução: Adicionar Agente OpenAI com System Prompt do Atendente Elias.
Depende de: TASK-W3-06
Critério de conclusão: nó usa o prompt completo do Atendente Elias.
Sandbox: workspace-write

## TASK-W3-08 | SEQUENCIAL | SMALL

Agente: n8n-worker
Arquivo alvo: Workflow 3 no n8n
Instrução: Adicionar Check Horário 08h-21h BRT.
Depende de: TASK-W3-07
Critério de conclusão: respeita timezone `America/Sao_Paulo`.
Sandbox: workspace-write

## TASK-W3-09 | SEQUENCIAL | SMALL

Agente: n8n-worker
Arquivo alvo: Workflow 3 no n8n
Instrução: Adicionar Send Message via Chatwoot.
Depende de: TASK-W3-08
Critério de conclusão: mensagem enviada em conversa de teste.
Sandbox: workspace-write

## TASK-W3-10 | SEQUENCIAL | SMALL

Agente: n8n-worker
Arquivo alvo: Workflow 3 no n8n
Instrução: Adicionar contador de follow-ups.
Depende de: TASK-W3-09
Critério de conclusão: follow-up count incrementa corretamente.
Sandbox: workspace-write

## TASK-W3-11 | SEQUENCIAL | SMALL

Agente: n8n-worker
Arquivo alvo: Workflow 3 no n8n
Instrução: Adicionar IF para limite de 2 follow-ups e retorno a `frio`.
Depende de: TASK-W3-10
Critério de conclusão: após 2 follow-ups, label volta para `frio`.
Sandbox: workspace-write

## TASK-W3-12 | SEQUENCIAL | SMALL

Agente: n8n-worker
Arquivo alvo: Workflow 3 no n8n
Instrução: Ativar Workflow 3.
Depende de: TASK-W3-11
Critério de conclusão: GET confirma `active: true`.
Sandbox: workspace-write
