# Decisões arquiteturais

## ADR-001 — Estado do follow-up em custom_attributes da conversa (não do contato)

**Data:** 2026-05-11, derivada do RPI de correção definitiva do Follow-up PIX.

**Decisão:** Persistir `pix_followup_count` e `pix_status` em `custom_attributes` da conversa.

**Motivo:** Evitar vazamento de estado entre compras diferentes do mesmo cliente. O contato pode fazer mais de uma compra; o estado do PIX pertence à conversa/tentativa de pagamento.

**Campos:**

- `pix_status`
- `status_pagamento`
- `pix_followup_count`
- `pix_followup_last_action`
- `transaction_id`
- `gateway_id`
- `pix_qr_code`
- `pix_copia_e_cola`

## ADR-002 — Tool síncrona com follow-up assíncrono separado

**Decisão:** O `Wait` não pode bloquear o retorno da Tool para o Workflow 01.

**Motivo:** `Wait` pausa a execução, serializa estado e pode perder referências após retomada. Em fluxos longos, paralelos ou reativados, variáveis locais e referências a itens anteriores deixam de ser confiáveis.

**Solução:** Disparo assíncrono via webhook interno/subworkflow dedicado. A Tool retorna imediatamente um JSON plano com `status`, `pix_qr_code`, `pix_copia_e_cola` e `valor`.

## ADR-003 — Sem $getGlobalStaticData()

**Decisão:** Nenhum nó usa `$getGlobalStaticData()`.

**Motivo:** Instável em execuções paralelas e após `Wait`.

**Solução:** Estado durável no Chatwoot, lido novamente antes de qualquer decisão pós-`Wait`.

## ADR-004 — GET antes e depois de qualquer PUT em workflow n8n

**Decisão:** Toda mutação real de workflow n8n deve seguir o ciclo `GET -> PUT sanitizado -> GET -> activate/validar`.

**Motivo:** O n8n desta VPS rejeita campos read-only e `PUT 200` não garante que o grafo final está correto. Também há histórico de divergência entre sucesso reportado e estado real.

**Solução:** Validar node count, nomes, conexões e parâmetros críticos após o PUT.

## ADR-005 — Não modificar arquivos de workflow diretamente

**Decisão:** Workflows n8n devem ser modificados pela API REST.

**Motivo:** Convenção operacional do projeto e necessidade de refletir o estado vivo da instância.

**Solução:** Scripts podem preparar payloads, mas a fonte de verdade é o GET da API n8n.

## ADR-006 — Double-check GestãoPay antes de liberar acesso

**Decisão:** Postback ou mensagem do lead não libera acesso. Acesso só após `GET /v1/payment-transaction/info/{id}` retornar `PAID`.

**Motivo:** Evitar entrega indevida por evento incompleto, falso positivo ou mensagem manual.

**Solução:** Postback dispara verificação; entrega depende do status confirmado.
