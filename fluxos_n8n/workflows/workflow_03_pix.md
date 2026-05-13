# Workflow 03 — Módulo PIX

## Identificação

- **ID:** `ebbDSb9Z955Udl49`
- **Nome:** `03. Módulo PIX — Pagamento e Entrega`
- **Status atual:** Tool síncrona NÃO aplicada — `Wait` ainda no caminho bloqueante
- **Classificação:** crítico

## Propósito

Gerar cobrança PIX via GestãoPay a partir da intenção de compra do agente WhatsApp, registrar o estado do pagamento no Chatwoot, confirmar pagamento real por double-check e entregar acesso somente após confirmação.

## Problema identificado

O Codex reportou sucesso, mas a instrução operacional atual informa que os PATCHes reais não foram executados/confirmados na API do n8n. Portanto, o estado confiável para retomada deve ser:

- `Wait` ainda bloqueia o caminho da Tool.
- A Tool não deve ser considerada síncrona.
- A correção RPI precisa ser reaplicada via API REST com GET antes e depois.

Observação de auditoria: `progress.md` contém entrada de 2026-05-11 dizendo que o RPI foi aplicado. Esta consolidação preserva essa evidência no diário, mas segue a regra atual do operador: tratar o RPI como pendente até nova verificação real.

## Arquitetura desejada conforme RPI

```text
Criar PIX GestãoPay
  -> Set — Extrair dados PIX
    -> HTTP — Atualizar custom_attributes Chatwoot
      -> HTTP — Disparar follow-up assíncrono
        -> Set — Retornar dados para Tool
```

## Regra central

Nenhum `Wait` pode ficar no mesmo caminho bloqueante do retorno da `Execute Workflow Tool`.

A Tool deve retornar imediatamente um item JSON plano, terminal e sem campos extras.

## Campos de retorno da Tool

- `status`
- `pix_qr_code`
- `pix_copia_e_cola`
- `valor`

## Estado persistido esperado no Chatwoot

Persistir em `custom_attributes` da conversa, não do contato:

- `pix_status`: `PENDING | PAID | EXPIRED | CANCELLED`
- `status_pagamento`: `pix_enviado | pix_pendente | pago | expirado | cancelado`
- `pix_followup_count`
- `pix_followup_last_action`
- `transaction_id`
- `gateway_id`
- `pix_qr_code`
- `pix_copia_e_cola`

## Estado atual real para próxima sessão

- `Wait` ainda bloqueante no caminho da Tool.
- RPI deve ser tratado como não aplicado.
- Scripts `rpi_*` existem como artefatos, mas não substituem verificação real.

## Próximo passo obrigatório

Executar PATCH real via API n8n com verificação:

1. `GET /api/v1/workflows/ebbDSb9Z955Udl49`
2. Confirmar nós e conexões atuais.
3. Aplicar PUT completo sanitizado.
4. `GET /api/v1/workflows/ebbDSb9Z955Udl49`
5. Confirmar cadeia síncrona nó a nó.
6. Ativar workflow se necessário.
7. Executar testes de aceitação.

## Critérios de aceite

- Tool retorna imediatamente `status`, `pix_qr_code`, `pix_copia_e_cola`, `valor`.
- Nenhum caminho entre criação do PIX e retorno da Tool passa por `Wait`.
- O webhook assíncrono do follow-up PIX responde e dispara o ciclo separado.
- Decisão do follow-up sempre lê Chatwoot após o `Wait`.
- Nenhum nó usa `$getGlobalStaticData()`.
