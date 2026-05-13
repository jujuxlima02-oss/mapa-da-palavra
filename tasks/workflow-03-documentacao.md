# Workflow 03 — Módulo PIX - Pagamento e Entrega

ID: `ebbDSb9Z955Udl49`

## Visão geral

Este workflow é o processador de pagamentos PIX do Mapa da Palavra. Ele é chamado pelo Workflow 01, o agente Nath no Chatwoot, por meio de uma Execute Workflow Tool. Quando recebe dados suficientes do cliente, cria uma transação PIX na GestãoPay, devolve o copia-e-cola ao Workflow 01 e atualiza atributos do contato/conversa no Chatwoot. Ele também possui dois caminhos assíncronos para confirmação: um webhook de postback da GestãoPay e um caminho de timeout que consulta a GestãoPay depois de alguns minutos.

O Workflow 01 é responsável por falar com o cliente e enviar o código PIX. O Workflow 03 não deve enviar a mensagem de PIX inicial diretamente para o WhatsApp, para evitar duplicidade.

## Fluxo completo (diagrama em texto)

```text
Linha 1 — Criação do PIX via Tool

Execute Workflow Trigger — Criar PIX
  -> Set — Normalizar entrada
    -> If — Dados mínimos para PIX?
      TRUE:
        -> HTTP — Criar PIX GestãoPay
          -> Set — Extrair dados PIX
            -> HTTP — Atualizar custom attributes Chatwoot
              -> Set — Retornar dados para Tool
              -> Wait — Timeout sem pagamento
                -> Set — Repassar dados PIX pós-timeout
                  -> HTTP — Consultar PIX após timeout
                    -> If — PIX pago após timeout?
                      TRUE:
                        -> Code — Preservar dados pagamento aprovado
                          -> HTTP — Atualizar pagamento aprovado no Chatwoot
                            -> Chatwoot — Enviar acesso
                              -> Respond — OK PIX
                      FALSE:
                        -> Chatwoot — Follow-up PIX pendente
                          -> Respond — OK

      FALSE:
        -> Chatwoot — Solicitar dados para PIX
          -> Set — Retornar aguardando dados

Linha 2 — Postback GestãoPay

Webhook — Postback GestãoPay
  -> Code — Normalizar postback
    -> HTTP — Double-check GestãoPay
      -> If — Pagamento confirmado?
        TRUE:
          -> Code — Preservar dados pagamento aprovado
            -> HTTP — Atualizar pagamento aprovado no Chatwoot
              -> Chatwoot — Enviar acesso
                -> Respond — OK PIX
        FALSE:
          -> Respond — OK PIX

Nó órfão atual:

Ignorar
```

## Detalhamento de cada nó

### Execute Workflow Trigger — Criar PIX

- Tipo: Execute Workflow Trigger
- Função: ponto de entrada usado pela Tool `processar_pagamento_pix` no Workflow 01.
- Entrada esperada: `conversation_id`, `account_id`, `contact_id`, `inbox_id`, `customer_email`, `customer_document`, `customer_name`, `customer_phone`, `valor`, `produto`.
- Saída produzida: repassa os campos recebidos para normalização.
- Observações técnicas: este é o primeiro nó da linha de criação de PIX. Não trocar por Webhook Trigger nessa linha.

### Set — Normalizar entrada

- Tipo: Set
- Função: padroniza os campos recebidos da Tool antes das validações e da chamada à GestãoPay.
- Entrada esperada: dados enviados pelo Workflow 01.
- Saída produzida: `conversation_id`, `contact_id`, `account_id`, `inbox_id`, `customer_email`, `customer_document`, `customer_name`, `customer_phone`, `valor`, `produto`.
- Observações técnicas: `valor` usa fallback `49.90`; `produto` usa fallback `Mapa da Palavra`. O campo `conversation_id` deve vir de `={{ $input.item.json.conversation_id }}`.

### If — Dados mínimos para PIX?

- Tipo: If
- Função: impede criação de PIX sem e-mail e CPF.
- Entrada esperada: saída de `Set — Normalizar entrada`.
- Saída produzida: ramo TRUE quando `customer_email` e `customer_document` não estão vazios; ramo FALSE quando faltar algum dado.
- Observações técnicas: usa combinador AND, com `customer_email notEmpty` e `customer_document notEmpty`.

### HTTP — Criar PIX GestãoPay

- Tipo: HTTP Request
- Função: cria a transação PIX na GestãoPay.
- Entrada esperada: dados normalizados do cliente e da conversa.
- Saída produzida: resposta da GestãoPay com dados da transação, QR Code/copia-e-cola e status.
- Observações técnicas: usa `POST https://api.gestaopayments.com/v1/payment-transaction/create` com credencial `GestaoPay Basic Auth`. O body envia `amount: 4990`, `payment_method: "pix"`, produto `Mapa da Palavra`, `customer.email`, `customer.document.number`, `customer.document.type: "cpf"` e metadata com `account_id`, `conversation_id`, `contact_id`, `inbox_id`, `produto` e `valor`.

### Set — Extrair dados PIX

- Tipo: Set
- Função: transforma a resposta da GestãoPay no formato interno usado pelo restante do workflow.
- Entrada esperada: resposta do HTTP de criação de PIX.
- Saída produzida: `pix_qr_code`, `pix_key`, `pix_status`, `transaction_id`, `gateway_id`, `status`, `status_pagamento`, `valor`, `produto`, `conversation_id`, `contact_id`, `account_id`, `inbox_id`.
- Observações técnicas: `transaction_id` e `gateway_id` vêm de `={{ $json.dados?.eu_ia ?? $json.data?.id }}`. Os dados de Chatwoot são recuperados do nó `If — Dados mínimos para PIX?`, porque o HTTP da GestãoPay substitui o item inteiro pela resposta da API.

### HTTP — Atualizar custom attributes Chatwoot

- Tipo: HTTP Request
- Função: registra no Chatwoot os atributos do PIX recém-gerado.
- Entrada esperada: saída de `Set — Extrair dados PIX`.
- Saída produzida: resposta da API do Chatwoot.
- Observações técnicas: usa `PUT` em `http://chatwoot_rails:3000/api/v1/accounts/{{ $json.account_id }}/contacts/{{ $json.contact_id }}` com credencial `Chatwoot API Access Token`. Atualiza `status_pagamento`, `pix_key`, `pix_qr_code`, `pix_status`, `transaction_id`, `gateway_id` e `produto_comprado`.

### Set — Retornar dados para Tool

- Tipo: Set
- Função: devolve ao Workflow 01 os dados que a Nath deve usar para responder ao cliente.
- Entrada esperada: caminho TRUE depois da criação do PIX.
- Saída produzida: `pix_key`, `pix_qr_code`, `valor`, `status`.
- Observações técnicas: `status` deve ser `pending`. Este nó deve continuar existindo; ele substitui o envio direto do PIX pelo Workflow 03.

### Wait — Timeout sem pagamento

- Tipo: Wait
- Função: aguarda 15 minutos antes de consultar se o PIX foi pago.
- Entrada esperada: saída após atualização de atributos no Chatwoot.
- Saída produzida: item retomado após o período de espera.
- Observações técnicas: o Wait pode não preservar todos os campos conforme esperado, por isso existe o nó seguinte para repassar explicitamente os dados críticos.

### Set — Repassar dados PIX pós-timeout

- Tipo: Set
- Função: restaura os dados do PIX antes da consulta de timeout.
- Entrada esperada: execução retomada pelo Wait.
- Saída produzida: `transaction_id`, `gateway_id`, `conversation_id`, `contact_id`, `account_id`, `inbox_id`, `pix_qr_code`, `pix_status`, `valor`, `status`.
- Observações técnicas: usa expressões no formato `={{ $("Set — Extrair dados PIX").first().json.<campo> }}`. Manter esse formato; `={ ... }` é inválido para esse caso.

### HTTP — Consultar PIX após timeout

- Tipo: HTTP Request
- Função: consulta a GestãoPay para verificar o status do PIX após o tempo de espera.
- Entrada esperada: `transaction_id` ou `gateway_id`.
- Saída produzida: resposta da GestãoPay, com status esperado em `data.status`.
- Observações técnicas: usa credencial `GestaoPay Basic Auth` e URL `={{ "https://api.gestaopayments.com/v1/payment-transaction/info/" + ($json.transaction_id || $json.gateway_id) }}`.

### If — PIX pago após timeout?

- Tipo: If
- Função: decide o que fazer após a consulta de timeout.
- Entrada esperada: resposta da GestãoPay no formato `data.status`.
- Saída produzida: TRUE quando `data.status == "PAID"`; FALSE quando não estiver pago.
- Observações técnicas: condição atual: `={{ $json.data.status }}` equals `PAID`, com `typeValidation: loose`.

### Chatwoot — Follow-up PIX pendente

- Tipo: Chatwoot
- Função: avisa o cliente que o PIX ainda consta como pendente.
- Entrada esperada: resposta da consulta de timeout com `data.metadata.account_id`, `data.metadata.inbox_id` e `data.metadata.conversation_id`.
- Saída produzida: mensagem enviada no Chatwoot.
- Observações técnicas: mensagem atual informa que o pagamento ainda está pendente e que o acesso será liberado automaticamente quando confirmar.

### Respond — OK

- Tipo: Respond to Webhook
- Função: encerra o ramo de follow-up pendente com resposta JSON simples.
- Entrada esperada: saída do node Chatwoot de follow-up.
- Saída produzida: `{ ok: true }`.
- Observações técnicas: usado no ramo FALSE do timeout.

### Webhook — Postback GestãoPay

- Tipo: Webhook
- Função: recebe postbacks da GestãoPay.
- Entrada esperada: HTTP POST em `mpalavra/pix/gestaopay/pagamento-aprovado-m1`.
- Saída produzida: payload recebido do gateway para normalização.
- Observações técnicas: usa `responseMode: responseNode`; por isso a linha precisa terminar em Respond.

### Code — Normalizar postback

- Tipo: Code
- Função: padroniza diferentes formatos possíveis do postback da GestãoPay.
- Entrada esperada: body do webhook ou JSON direto.
- Saída produzida: `gateway_id`, `transaction_id`, `status_gateway`, `amount_reais`, `paid_at`.
- Observações técnicas: `transaction_id` e `gateway_id` são definidos com o mesmo identificador encontrado em `Id`, `id`, `eu_ia`, `transaction_id`, `transactionId`, `gateway_id`, `data.id` ou `dados.eu_ia`.

### HTTP — Double-check GestãoPay

- Tipo: HTTP Request
- Função: faz uma consulta de confirmação na GestãoPay antes de liberar acesso.
- Entrada esperada: `transaction_id` ou `gateway_id`.
- Saída produzida: resposta oficial da GestãoPay com status da transação.
- Observações técnicas: usa credencial `GestaoPay Basic Auth` e URL `={{ "https://api.gestaopayments.com/v1/payment-transaction/info/" + ($json.transaction_id || $json.gateway_id) }}`.

### If — Pagamento confirmado?

- Tipo: If
- Função: libera o caminho de entrega apenas quando a GestãoPay confirma pagamento.
- Entrada esperada: resposta do Double-check.
- Saída produzida: TRUE quando `data.status == "PAID"`; FALSE quando não confirmado.
- Observações técnicas: condição atual: `={{ $json.data.status }}` equals `PAID`, com `typeValidation: loose`. Não deve referenciar `Code — Normalizar postback`, porque esse nó não existe no caminho de timeout e pode causar erro de `rightType`.

### Code — Preservar dados pagamento aprovado

- Tipo: Code
- Função: repassa intacto o item de pagamento aprovado para os próximos nós.
- Entrada esperada: resposta da GestãoPay após confirmação.
- Saída produzida: o mesmo item recebido.
- Observações técnicas: código atual é `return items;`. Ele unifica os caminhos de pagamento aprovado por postback e por timeout.

### HTTP — Atualizar pagamento aprovado no Chatwoot

- Tipo: HTTP Request
- Função: marca a conversa no Chatwoot como pagamento aprovado.
- Entrada esperada: resposta da GestãoPay com `data.metadata.account_id`, `data.metadata.conversation_id` e `data.id`.
- Saída produzida: resposta da API do Chatwoot.
- Observações técnicas: atualiza `status_pagamento: "pago"`, `gateway_id` e `produto_comprado`.

### Chatwoot — Enviar acesso

- Tipo: Chatwoot
- Função: envia ao cliente o link de acesso após confirmação real de pagamento.
- Entrada esperada: dados preservados pelo nó `Code — Preservar dados pagamento aprovado`.
- Saída produzida: mensagem enviada no Chatwoot.
- Observações técnicas: usa `account_id`, `inbox_id` e `conversation_id` vindos de `data.metadata`.

### Respond — OK PIX

- Tipo: Respond to Webhook
- Função: responde o webhook da GestãoPay com sucesso.
- Entrada esperada: ramo de pagamento confirmado ou não confirmado.
- Saída produzida: `{ ok: true }`.
- Observações técnicas: usado tanto após entrega de acesso quanto no ramo FALSE do IF de postback.

### Chatwoot — Solicitar dados para PIX

- Tipo: Chatwoot
- Função: pede e-mail e CPF quando o cliente tenta comprar sem dados mínimos.
- Entrada esperada: `account_id`, `inbox_id` e `conversation_id`.
- Saída produzida: mensagem enviada ao cliente.
- Observações técnicas: mensagem atual:

```text
Para gerar seu PIX com segurança, preciso de alguns dados bem rápidos 🙏

Por favor, me envie:
1) Seu e-mail
2) Seu CPF (apenas números)

Assim que eu receber essas informações, gero o seu PIX do Mapa da Palavra por R$ 49,90.
```

### Set — Retornar aguardando dados

- Tipo: Set
- Função: retorna à Tool o estado de espera por dados do cliente.
- Entrada esperada: ramo FALSE do IF de dados mínimos.
- Saída produzida: `status: "waiting_customer_data"`, `pix_key: ""`, `pix_qr_code: ""`, `valor`.
- Observações técnicas: o Workflow 01 deve interpretar esse status como instrução para aguardar e-mail e CPF, sem inventar PIX.

### Ignorar

- Tipo: NoOp
- Função: nó sem operação.
- Entrada esperada: nenhuma conexão ativa no GET atual.
- Saída produzida: nenhuma.
- Observações técnicas: está presente no workflow, mas não faz parte do fluxo conectado atual.

## Pontos de falha conhecidos e como evitar

- Duplicidade de mensagem PIX: o nó `Chatwoot — Enviar PIX` foi removido porque o Workflow 01 já envia o copia-e-cola com base em `Set — Retornar dados para Tool`.
- Perda de `conversation_id` e `contact_id` após o HTTP da GestãoPay: o HTTP substitui o item pela resposta da API. O nó `Set — Extrair dados PIX` recupera esses campos via `If — Dados mínimos para PIX?`.
- `transaction_id` perdido após Wait: o nó `Set — Repassar dados PIX pós-timeout` restaura explicitamente os campos antes da consulta.
- Erro de expressão por sintaxe inválida: expressões de Set devem usar `={{ ... }}`, não `={ ... }`.
- Erro `rightType undefined` nos IFs: manter os IFs de confirmação com uma única condição direta em `={{ $json.data.status }}` equals `PAID`; não referenciar nós de outros caminhos de execução.
- Double-check com 401: os nós de consulta da GestãoPay devem usar a mesma credencial `GestaoPay Basic Auth` do nó de criação de PIX.
- Liberação indevida de acesso: o acesso só deve ser enviado após resposta da GestãoPay com `data.status == "PAID"`.
- Inconsistência de status: a GestãoPay usa status como `PENDING`, `PAID`, `EXPIRED` e `CANCELLED`; a regra de liberação deve comparar com `PAID`.

## Status atual

- active: `true`
- nodeCount: `24`
- Última alteração: `2026-05-11 16:28:59 BRT` (`updatedAt: 2026-05-11T19:28:59.232Z`)
