# QA Report - Workflow 3 Follow-up Automático

## Checklist

1. APROVADO - Workflow 3 ativo, nodeCount >= 10.
Evidencia: `mVo6oZMEERqNmhwI`, `active=true`, `nodeCount=15`.

2. APROVADO - Webhook responde 200 a POST de teste.
Evidencia: POST em `/webhook/mpalavra/whatsapp/follow-up` retornou HTTP 200 com `{"ok":true,"workflow":"follow-up"}`.

3. APROVADO - IF filtra só `aquecendo` e `interessado` sem `assignee_id`.
Evidencia: nó `IF - Label aquecendo ou interessado e sem assignee`.

4. APROVADO - Set Window usa 24h para `aquecendo` e 12h para `interessado`.
Evidencia: expressão `{{ $json.body?.label === 'interessado' ? 12 : 24 }}`.

5. APROVADO - Wait Node usa valor dinâmico.
Evidencia: `amount = {{$json.window}}`, sem hardcode.

6. APROVADO - Check Silence verifica última mensagem como não-incoming.
Evidencia: expressão em `IF - Lead em silencio?` checa última mensagem e segue apenas quando a última não é `incoming`.

7. APROVADO - System prompt do Atendente Elias no nó Agente OpenAI.
Evidencia: `Agente OpenAI - Follow-up` contém o prompt completo do Atendente Elias.

8. APROVADO - Check Horário usa timezone America/Sao_Paulo.
Evidencia: expressão usa `new Date().toLocaleString('en-US', { timeZone: 'America/Sao_Paulo', ... })`.

9. APROVADO - Send Message usa `CHATWOOT_INTERNAL_URL`.
Evidencia: URL do nó aponta para `http://chatwoot_rails:3000/api/v1/...`.

10. REPROVADO - Contador de follow-ups não está persistindo o estado entre execuções.
Evidencia: nó `Increment Counter` grava nota privada com `follow-up-count: N`, mas não lê um contador real persistido antes de incrementar.

11. REPROVADO - Após 2 follow-ups, o fluxo não garante fechamento do ciclo com estado persistente.
Evidencia: `IF - Limite de follow-ups` depende do contador não persistido do item 10, então o retorno para `frio` pode não refletir o histórico real.

12. APROVADO - Workflows 1 e 2 intactos.
Evidencia: Workflow 1 `XeA5zPHk9Shc8oLg` ativo com 16 nós; Workflow 2 `FCkO2jZNaCLhzRSh` ativo com 6 nós.

13. APROVADO - Nenhum hardcode de credencial nos nós.
Evidencia: credenciais/URLs sensíveis vêm de `CHATWOOT_INTERNAL_URL`, `CHATWOOT_API_ACCESS_TOKEN`, `CHATWOOT_ACCOUNT_ID` e credencial OpenAI existente `OpenAI mpalavra`.

## Conclusao

REPROVADO.

Os pontos que bloqueiam aprovação final são o contador de follow-ups sem persistência real e o encerramento do ciclo após 2 follow-ups dependente desse mesmo contador. O restante do workflow está funcional e ativo.
