# ADR-001: Adoção de SDD + Harness Engineering no Projeto mpalavra

**Status:** Aceito
**Data:** 2026-05-07
**Decisores:** arquiteto-senior, kaligos

## Contexto

O projeto mpalavra combina landing page, WhatsApp, Chatwoot, n8n, Baileys, Planka,
GestãoPay, GTM e Meta Ads em um funil de vendas sensível a estados, labels e
webhooks. Em um fluxo assim, vibe coding aumenta risco: prompt genérico faz o
agente assumir stack, arquitetura, UX, regras de negócio e integrações críticas.

Em tarefas maiores, o fluxo improvisado tende a degradar contexto. O agente gera
código, o humano testa, pede ajustes, o histórico cresce, o custo de tokens sobe
e decisões importantes ficam implícitas. Isso funciona para scripts simples, mas
colapsa em automações multi-serviço, onde um webhook, label ou postback_url errado
pode quebrar atendimento e conversão.

SDD resolve o feedforward: transforma intenção em requirements, design e tasks
verificáveis antes da execução. Harness Engineering completa com feedback e
controle: ferramentas, sandbox, memória durável, linters, build, QA, reviewer e
orquestração multi-agente. Juntos, eles dão direção e sensores para impedir
execução sem prova.

## Decisão

Adotar SDD como fundação (feedforward) e Harness Engineering como exoesqueleto
(feedback + execução controlada) para todas as fases a partir da Fase 3.2.

## Componentes do Harness adotados no mpalavra

### Guides (feedforward)

- AGENTS.md: índice do projeto, fases, convenções, subagentes
- .codex/skills/: skills por domínio (SDD, Codex, Prompt, Pastor IA)
- docs/specs/: requirements.md + design.md + tasks.md por feature
- .codex/agents/*.toml: personas, sandbox, modelo por agente

### Sensors (feedback)

- qa-agent: checklist pós-implementação (8 itens)
- reviewer: critérios de PR (6 itens)
- npm run lint + npm run build: validação obrigatória após cada task
- Validação de sandbox_mode por agente (Select-String nos TOMLs)

### Memória e Estado Durável

- AGENTS.md atualizado ao concluir cada fase
- docs/tasks/: artefatos de spec e relatórios de QA versionados
- Commits frequentes com mensagens descritivas após cada task
- Progress implícito via status das fases no AGENTS.md

### Orquestração Multi-Agente

- Kaligos: Planner (gpt-5.5, read-only)
- arquiteto-senior: Arquiteto/SDD (gpt-5.4, workspace-write)
- explorer: Research (gpt-5.4-mini, read-only)
- workers: Implementers (gpt-5.4, workspace-write)
- qa-agent + reviewer: Evaluators (gpt-5.4-mini, read-only)

## Ciclo RPI Operacional

1. Research: explorer atua em read-only, mapeia codebase, configurações e
   workflows n8n via GET. Entrega um resumo compacto com caminhos, pontos de
   entrada, fluxos de dados e riscos encontrados.

2. Plan: arquiteto-senior converte research e objetivo do usuário em spec SDD.
   O plano deve listar arquivos, agentes, dependências, critérios de conclusão e
   estratégia de teste. O usuário aprova antes de qualquer implementação.

3. Implement: n8n-worker ou frontend-worker executa uma task por vez. Cada task
   deve manter escopo pequeno, respeitar sandbox, rodar validações e deixar
   evidência objetiva de conclusão.

4. Evaluate: qa-agent aplica checklist de segurança, lint, webhooks, env vars,
   labels e escopo. reviewer valida diff, regressões, alinhamento com AGENTS.md
   e aprova ou bloqueia merge.

## Riscos e Mitigações

| Risco | Mitigação |
|-------|-----------|
| SDD sem harness: spec perfeita, execução falha sem testes | qa-agent obrigatório após cada worker |
| Harness sem SDD: ambiente rico, direção de vibe coding | Fase de Descoberta inegociável no sdd-metodologia.md |
| Token burn: todos os agentes em gpt-5.5 | Tabela de modelos por agente definida nos TOMLs |
| Context rot: AGENTS.md desatualizado | Task de atualização do AGENTS.md ao fim de cada fase |
| Vitória prematura: worker marca task como concluída sem teste | critério_de_conclusão obrigatório em cada task do tasks.md |

## Consequências

A partir desta ADR, toda nova fase começa com Fase de Descoberta, segue para
spec, vira plano aprovado pelo usuário, passa por implementação task a task,
depois QA, review e atualização do AGENTS.md. O projeto deixa de depender de
memória conversacional e passa a registrar decisões em arquivos versionados.

O trabalho fica mais lento no primeiro passo e mais rápido no ciclo completo:
menos retrabalho, menos ambiguidade entre agentes e melhor rastreabilidade.
Workers deixam de receber pedidos amplos e passam a receber tasks pequenas com
critério de conclusão e validação esperada.
