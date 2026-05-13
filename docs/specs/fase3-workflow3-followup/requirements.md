# Requirements - Fase 3 Workflow 3: Follow-up Automático

## Contexto

Lead interagiu com o Atendente Elias, recebeu label `aquecendo` ou `interessado`, mas ficou em silêncio. Workflow 3 reaquece esse lead com mensagens de follow-up humanizadas antes que ele esfrie.

## MVP

1. Lead `aquecendo` sem resposta em 24h -> follow-up 1.
2. Lead `interessado` sem resposta em 12h -> follow-up 1.
3. Sem resposta após follow-up 1 em mais 24h -> follow-up 2.
4. Sem resposta após follow-up 2 -> label volta para `frio`.
5. Se lead responder em qualquer momento -> cancelar ciclo de follow-up.

## Fora de Escopo

- Não inclui follow-up pós-compra.
- Não inclui follow-up após atendimento humano.
- Não envia mais de 2 follow-ups por ciclo.
- Não reativa leads que pediram para não ser contactados.

## Regras de Negócio

- Janela `aquecendo`: 24h sem resposta do lead.
- Janela `interessado`: 12h sem resposta do lead.
- Máximo 2 follow-ups por ciclo.
- Após 2 follow-ups sem resposta: label -> `frio`, flag follow-up esgotado.
- Se lead responder: evento `message_created` no Chatwoot cancela o timer.
- Mensagens de follow-up: geradas pelo Atendente Elias.
- Horário de envio: apenas entre 08h-21h, horário de Brasília.

## Requisitos Não Funcionais

- Timer deve sobreviver a reinicializações do n8n.
- Sem mensagens duplicadas se o workflow for executado mais de uma vez.
- Variáveis: `FOLLOWUP_WINDOW_AQUECENDO=24`, `FOLLOWUP_WINDOW_INTERESSADO=12`.
