# Workflow 04 — Follow-up Automático

## Identificação

- **ID:** `mVo6oZMEERqNmhwI`
- **Nome:** `04. Follow-up Automático`
- **Propósito:** Follow-up de silêncio de leads
- **Observação principal:** este workflow NÃO é o follow-up PIX

## Propósito

Reaquecer leads que receberam label `aquecendo` ou `interessado` e ficaram em silêncio, respeitando janela de tempo, horário comercial e limite de follow-ups.

## Nós principais identificados

Sequência documentada em inventário e QA:

```text
Webhook Follow-up Automático
  -> IF - Label aquecendo ou interessado e sem assignee
    -> Set Window
      -> Wait Node
        -> Check Silence
          -> IF - Lead em silencio?
            -> Get History
              -> Agente OpenAI - Follow-up
                -> Check Horário
                  -> Send Message
                    -> Increment Counter
                      -> IF - Limite de follow-ups
```

## Regras de negócio

- Lead `aquecendo`: follow-up após 24h sem resposta.
- Lead `interessado`: follow-up após 12h sem resposta.
- Máximo de 2 follow-ups por ciclo.
- Se o lead responder, o ciclo deve ser cancelado.
- Se atingir o limite, aplicar/retornar label `frio`.
- Não atuar quando houver `assignee_id` ou atendimento humano ativo.
- Horário de envio: 08h às 21h, timezone `America/Sao_Paulo`.

## Histórico de QA

O relatório `docs/tasks/qa-report-2026-05-07-workflow3-followup.md` aprovou a estrutura geral, mas reprovou a persistência do contador:

- O contador era registrado como nota privada `follow-up-count: N`.
- Não havia leitura robusta de contador persistido antes de incrementar.
- O fechamento após 2 follow-ups dependia desse contador frágil.

## Independência do problema PIX

Este workflow é independente do problema do Workflow 03 PIX. O RPI PIX propõe um follow-up assíncrono de pagamento, mas ele não deve ser confundido com o follow-up comercial de silêncio de lead documentado aqui.
