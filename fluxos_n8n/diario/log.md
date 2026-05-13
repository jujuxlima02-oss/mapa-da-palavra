# Diário cronológico

## 2026-05-07 — Research Workflow 2 Escalar Humano

**O que foi feito:** pesquisa inicial sobre Workflow 2, API n8n, Chatwoot e necessidade de credenciais.

**Resultado:** GETs externos retornaram `401` por falta de `X-N8N-API-KEY`; contexto local indicava Workflow 1 ativo e Workflow 2 ainda a criar.

**Pendências geradas:** validar credenciais n8n/Chatwoot, listar agentes humanos e implementar Workflow 2.

## 2026-05-07 — Credenciais Workflow 2

**O que foi feito:** documentação de variáveis necessárias para n8n e Chatwoot.

**Resultado:** `N8N_PUBLIC_API_KEY` foi encontrado no banco do n8n; Chatwoot interno validou HTTP 200 a partir do container n8n; um agente humano disponível foi identificado.

**Pendências geradas:** prosseguir com spec e implementação sem expor valores reais.

## 2026-05-07 — Workflow 2 Escalar Humano

**O que foi feito:** workflow `FCkO2jZNaCLhzRSh` atualizado/criado via API n8n.

**Resultado:** PUT HTTP 200; workflow ativo; nós Chatwoot com credencial configurada; QA aprovado.

**Pendências geradas:** nenhuma pendência crítica registrada para Workflow 2.

## 2026-05-07 — Workflow 3 Follow-up Automático

**O que foi feito:** pesquisa, design, tasks, implementação e QA do follow-up de silêncio.

**Resultado:** workflow `mVo6oZMEERqNmhwI` ativo com 15 nós; webhook respondeu 200; fluxo geral aprovado.

**Pendências geradas:** contador de follow-ups sem persistência real; encerramento após 2 follow-ups dependia desse contador.

## 2026-05-07 — Agente Principal mpalavra

**O que foi feito:** documentação da fase 3.3 do agente principal.

**Resultado:** workflow `XeA5zPHk9Shc8oLg` registrado como ativo com trigger Chatwoot, fila, lock, memória, áudio, escalonamento humano e reflexão.

**Pendências geradas:** manter validações de labels e credenciais em auditorias futuras.

## 2026-05-09T18:52:05Z — Chatwoot custom attributes PIX

**O que foi feito:** criação dos atributos de conversa para PIX no Chatwoot.

**Resultado:** `status_pagamento`, `pix_key`, `pix_qr_code` e `produto_comprado` criados sem duplicidade.

**Pendências geradas:** expandir atributos para RPI definitivo: `pix_status`, `pix_followup_count`, `pix_followup_last_action`, `transaction_id`, `gateway_id`, `pix_copia_e_cola`.

## 2026-05-09 16:05:02 -03:00 — Workflow Módulo PIX

**O que foi feito:** criação/ativação inicial do workflow PIX `ebbDSb9Z955Udl49`.

**Resultado:** workflow ativo, com webhook de intenção e postback GestãoPay documentados.

**Pendências geradas:** corrigir arquitetura para Tool síncrona e follow-up assíncrono.

## 2026-05-09 — QA RAG e tools no agente principal

**O que foi feito:** auditoria do workflow `bkVfT1QcpWGokG69` com RAG e tools.

**Resultado:** RAG `buscar_referencia_copy` identificado apontando para `8Yz1wHDlbz63U0Gp`; lint aprovado; QA geral reprovou evidência de webhook autenticado e labels esperadas.

**Pendências geradas:** revalidar autenticação do webhook Chatwoot e labels obrigatórias.

## 2026-05-11 16:29:28 -03:00 — Correções PIX via API n8n

**O que foi feito:** registro em `progress.md` de correções de condições PIX e prompt do Workflow 01.

**Resultado:** `pix-if-confirmado` e `pix-if-timeout-paid` registrados com condição `data.status == PAID`; Workflow 01 registrado com prompt atualizado.

**Pendências geradas:** não substitui a correção RPI do `Wait` bloqueante.

## 2026-05-11 19:19:33 -03:00 — Registro RPI Follow-up PIX definitivo

**O que foi feito:** `progress.md` registra que a Tool síncrona e o follow-up assíncrono foram aplicados.

**Resultado:** registro histórico preservado.

**Pendências geradas:** a instrução operacional atual declara que o Codex simulou sucesso sem PATCH real; portanto, o RPI deve ser tratado como pendente até nova verificação GET/PATCH/GET.

## 2026-05-11 — Consolidação `fluxos_n8n`

**O que foi feito:** criação desta pasta consolidada com workflows, tasks, decisões, diagramas, artefatos RPI e diário.

**Resultado:** documentação centralizada.

**Pendências geradas:** atualizar após a próxima verificação real do Workflow 03.
