# Concluído

## 2026-05-07 — Workflow 2 Escalar Humano

- Workflow `FCkO2jZNaCLhzRSh` criado/atualizado.
- Nome: `mpalavra | Escalar Humano`.
- Status documentado: ativo.
- Nós finais documentados: `Gatilho`, `Assign Human Agent`, `Adicionar etiqueta agente-off`, `Nota privada Chatwoot`, `Notificar corretor humano`, `Resposta ao agente`.
- QA aprovou Workflow 2 e guard humano no Workflow 1.

## 2026-05-07 — Workflow 3 Follow-up Automático

- Workflow `mVo6oZMEERqNmhwI` criado e ativado.
- Webhook de teste respondeu 200.
- IF de labels `aquecendo`/`interessado` sem `assignee_id` documentado.
- Wait dinâmico documentado.
- Check de horário em `America/Sao_Paulo` documentado.
- Pendência remanescente: contador persistente foi reprovado em QA.

## 2026-05-07 — Agente principal mpalavra

- Workflow `XeA5zPHk9Shc8oLg` documentado como ativo.
- Upgrades registrados: trigger Chatwoot, fila anti-encavalamento, status lock/unlock, memória Postgres, áudio/Whisper, tool de escalonamento humano, reflexão.

## 2026-05-09 — Custom attributes PIX no Chatwoot

- Criado atributo `status_pagamento` — ID `5`.
- Criado atributo `pix_key` — ID `6`.
- Criado atributo `pix_qr_code` — ID `7`.
- Criado atributo `produto_comprado` — ID `8`.
- Verificação pós-criação: nenhum `attribute_key` duplicado.

## 2026-05-09 — Workflow Módulo PIX

- Workflow `ebbDSb9Z955Udl49` criado.
- Nome posterior: `03. Módulo PIX - Pagamento e Entrega`.
- Webhook intenção documentado: `/webhook/mpalavra/pix/intencao-compra-m1`.
- Webhook postback GestãoPay documentado: `/webhook/mpalavra/pix/gestaopay/pagamento-aprovado-m1`.
- Status documentado em `progress.md`: `active=true`.

## 2026-05-09 — RAG e tools do agente principal

- `buscar_referencia_copy` identificado como `@n8n/n8n-nodes-langchain.toolWorkflow`.
- Subworkflow RAG: `8Yz1wHDlbz63U0Gp`.
- `processar_pagamento_pix` e `escalar_para_humano` foram conectados como `ai_tool` em registros anteriores.

## 2026-05-11 — Correções de condição PIX

- `pix-if-confirmado` registrado com condição única `={{ $json.data.status }} == PAID`.
- `pix-if-timeout-paid` registrado com condição `={{ $json.data.status }} == PAID`.
- Prompt do Workflow 01 registrado com regra de `status=pending` e envio imediato de `pix_qr_code`.

## 2026-05-11 — Registro conflitante de RPI PIX

- `progress.md` registra que o RPI Follow-up PIX definitivo foi aplicado.
- Esta consolidação preserva esse registro como histórico, mas não o considera concluído operacionalmente por causa da instrução atual do usuário.
