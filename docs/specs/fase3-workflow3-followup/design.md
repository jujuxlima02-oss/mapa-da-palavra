# Design - Fase 3 Workflow 3: Follow-up Automático

## Serviços

- n8n: hospeda o Workflow 3.
- Chatwoot: emite eventos e recebe mensagens/notas/labels.
- Baileys: transporte WhatsApp indirecto via Chatwoot.

## Estrutura de nós proposta

### Fluxo A - Iniciar timer de follow-up

1. Webhook Trigger: evento `conversation_updated`.
2. IF: label é `aquecendo` ou `interessado` e `assignee_id` é nulo.
3. Set Window: define janela em horas.
4. Wait Node: aguarda N horas.
5. Check Silence: GET conversa no Chatwoot e verifica se o lead respondeu.
6. IF: lead ainda em silêncio?
   - SIM -> Fluxo B
   - NÃO -> encerra.

### Fluxo B - Enviar follow-up

7. Get History: busca histórico da conversa no Chatwoot.
8. Agente OpenAI: gera mensagem de follow-up usando o System Prompt do Atendente Elias.
9. Check Horário: IF entre 08h e 21h BRT.
10. Send Message: envia via Chatwoot/Baileys.
11. Increment Counter: registra follow-up count.
12. IF: contador >= 2?
    - SIM -> aplicar label `frio` e encerrar.
    - NÃO -> Wait 24h e reavaliar.

## Integração com Workflow 1

- Workflow 1 aplica labels.
- Workflow 3 escuta eventos e não deve atuar quando `assignee_id` estiver preenchido.
- Se Workflow 1 já tiver `humano-necessario`, Workflow 3 deve ignorar a conversa.

## Variáveis de ambiente

- `FOLLOWUP_WINDOW_AQUECENDO`
- `FOLLOWUP_WINDOW_INTERESSADO`
- `CHATWOOT_ACCOUNT_ID`
- `CHATWOOT_API_ACCESS_TOKEN`
- `CHATWOOT_INTERNAL_URL`
- `OPENAI_API_KEY`
- `BAILEYS_API_URL` ou webhook equivalente

## Decisões arquiteturais

- Usar workflow separado para não aumentar risco no agente principal.
- Manter o timer durável dentro do n8n, evitando lógica externa frágil.
- Preservar o prompt do Atendente Elias como base de geração de follow-up.
- Registrar contador de follow-up em nota privada ou metadata para evitar duplicação.
