# Progress

## 2026-05-09T18:52:05Z — Chatwoot custom attributes PIX

- Criado atributo `status_pagamento` — ID `5`
- Criado atributo `pix_key` — ID `6`
- Criado atributo `pix_qr_code` — ID `7`
- Criado atributo `produto_comprado` — ID `8`
- Verificação pós-criação: nenhum `attribute_key` duplicado

## 2026-05-09 16:05:02 -03:00 — Workflow Módulo PIX

- Workflow ID `ebbDSb9Z955Udl49`
- Webhook intenção: `/webhook/mpalavra/pix/intencao-compra-m1`
- Webhook postback GestãoPay: `/webhook/mpalavra/pix/gestaopay/pagamento-aprovado-m1`
- Status final: `active=true`

## 2026-05-11 16:29:28 -03:00 — Correções PIX via API n8n

- Workflow 03 `ebbDSb9Z955Udl49`: `pix-if-confirmado` ficou com condição única `={{ $json.data.status }} == PAID`
- Workflow 03 `ebbDSb9Z955Udl49`: `pix-if-timeout-paid` confirmado com condição `={{ $json.data.status }} == PAID`
- Workflow 01 `bkVfT1QcpWGokG69`: prompt atualizado com regra de `status=pending` e envio imediato de `pix_qr_code`
- GET final: `workflow03_active=true`, `workflow01_active=true`, `if_pagamento_confirmado_refs_code=false`, `if_timeout_vazio=false`, `prompt_pending_imediato=true`

## 2026-05-11 19:19:33 -03:00 — RPI Follow-up PIX definitivo

- Workflow PIX `ebbDSb9Z955Udl49`: caminho síncrono da Tool alterado para `Criar PIX -> Extrair dados PIX -> Atualizar custom_attributes -> Disparar follow-up assíncrono -> Retornar dados para Tool`
- Workflow PIX `ebbDSb9Z955Udl49`: removida a dependência de `Wait` no caminho bloqueante da Tool; GET final confirmou `pix_wait_in_sync_sources=[]`
- Workflow PIX `ebbDSb9Z955Udl49`: retorno terminal da Tool confirmado com somente `status`, `pix_qr_code`, `pix_copia_e_cola`, `valor`
- Workflow 03 `mVo6oZMEERqNmhwI`: criado gatilho assíncrono `mpalavra/pix/followup-assincrono` com `Wait`, leitura fresca do Chatwoot, decisão por `pix_followup_count`, persistência em `custom_attributes`, envio de follow-up/cancelamento e resolução da conversa
- Workflows reativados via API n8n: `pix_active=true`, `followup_active=true`; validação confirmou ausência de `$getGlobalStaticData()` no decisor PIX
