# fluxos_n8n — Consolidação do projeto de workflows n8n

## Objetivo

Centralizar a documentação operacional dos workflows n8n usados no atendimento mpalavra: agente WhatsApp, escalonamento humano, follow-up de leads, eventos GestãoPay e módulo PIX.

Esta pasta consolida specs, tarefas, decisões, artefatos RPI, scripts auxiliares e diário cronológico encontrados no projeto.

## Workflows principais

| ID | Nome | Status atual documentado | Propósito |
| --- | --- | --- | --- |
| `bkVfT1QcpWGokG69` | `01. Agente WhatsApp Principal` | Ativo em logs recentes | Agente principal WhatsApp com tools, RAG, PIX e escalonamento |
| `XeA5zPHk9Shc8oLg` | `mpalavra | Agente WhatsApp Principal` | Ativo em documentação anterior | Versão anterior/legada do agente principal |
| `FCkO2jZNaCLhzRSh` | `mpalavra | Escalar Humano` | Concluído/ativo | Atribuir conversa a humano e registrar nota privada |
| `mVo6oZMEERqNmhwI` | `04. Follow-up Automático` | Ativo, mas independente do PIX | Follow-up de silêncio de leads com labels `aquecendo` e `interessado` |
| `ebbDSb9Z955Udl49` | `03. Módulo PIX — Pagamento e Entrega` | RPI pendente de PATCH real verificado | Criar PIX GestãoPay, persistir dados no Chatwoot, confirmar pagamento e entregar acesso |
| `GYSGKNLROHbi3mfd` | `mpalavra | GestãoPay | Carrinho Abandonado` | Ativo | Listener GestãoPay para carrinho abandonado |
| `07wwphbyPCtIkUuD` | `mpalavra | GestãoPay | Pagamento Aprovado` | Ativo | Listener GestãoPay para pagamento aprovado |
| `zLylTDH2naG1v1wf` | `mpalavra | GestãoPay | Pagamento Recusado` | Ativo | Listener GestãoPay para pagamento recusado |
| `8Yz1wHDlbz63U0Gp` | `RAG — Buscar Copy Pastoral` | Referenciado como tool | Subworkflow de busca RAG usado por `buscar_referencia_copy` |

## Índice

- [Workflow 03 PIX](workflows/workflow_03_pix.md)
- [Workflow 04 Follow-up](workflows/workflow_04_followup.md)
- [Outros workflows](workflows/outros_workflows.md)
- [Backlog](tasks/backlog.md)
- [Em progresso](tasks/em_progresso.md)
- [Concluído](tasks/concluido.md)
- [Decisões arquiteturais](arquitetura/decisoes.md)
- [Diagramas](arquitetura/diagramas.md)
- [Artefatos JSON RPI](artefatos/nodes_json/)
- [Scripts RPI copiados](artefatos/scripts/)
- [Diário cronológico](diario/log.md)

## Status geral

### Funcionando ou registrado como concluído

- Chatwoot, Baileys API e n8n estão definidos como stack operacional.
- Workflow de escalonamento humano `FCkO2jZNaCLhzRSh` foi documentado como ativo e validado.
- Workflow de follow-up de silêncio `mVo6oZMEERqNmhwI` foi criado e validado com ressalvas históricas de contador.
- Custom attributes PIX básicos foram criados no Chatwoot: `status_pagamento`, `pix_key`, `pix_qr_code`, `produto_comprado`.
- Workflow PIX `ebbDSb9Z955Udl49` foi criado e ativado em registros anteriores.
- Condições de pagamento confirmado foram ajustadas para `data.status == PAID` em registros de `progress.md`.

### Pendente ou crítico

- Aplicar RPI PIX definitivo tratando o estado atual real como pendente: Tool síncrona sem `Wait` bloqueante e follow-up assíncrono separado.
- Executar GET antes e depois do PATCH real no n8n, validando nó a nó.
- Executar testes de aceitação do contador `pix_followup_count`.
- Confirmar webhook assíncrono `mpalavra/pix/followup-assincrono`.
- Resolver divergência documental: `progress.md` registra aplicação do RPI, mas a instrução operacional atual declara que o PATCH real não foi aplicado.

## Fontes consolidadas

Foram considerados `progress.md`, `AGENTS.md`, specs em `docs/specs/`, relatórios em `docs/tasks/`, scripts em `scripts/`, artefatos JSON e arquivos operacionais relacionados a GestãoPay, Chatwoot e n8n.
