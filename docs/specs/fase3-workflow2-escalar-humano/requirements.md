# Requirements — Fase 3 Workflow 2: Escalar Humano

## Contexto

O Workflow 1 (`XeA5zPHk9Shc8oLg`) está ativo em produção como `mpalavra | Agente WhatsApp Principal`, com 15 nós, recebendo o webhook `/webhook/mpalavra/whatsapp/mensagem-recebida`.

O projeto já possui o label `humano-necessario` como critério operacional de escalonamento, mas não há workflow ativo dedicado a atribuir a conversa para humano e notificar o operador. O Workflow 2 fecha esse gap.

## MVP

1. Lead com label `humano-necessario` é atribuído ao agente humano no Chatwoot.
2. Agente humano recebe notificação imediata.
3. Bot para de responder enquanto humano está ativo na conversa.

## Funcionalidades

### Escalonamento por label

Jornada:
1. Chatwoot envia evento `message_created` ou `conversation_updated`.
2. Workflow 2 verifica presença do label `humano-necessario`.
3. Workflow 2 ignora conversas que já têm `assignee_id`.
4. Workflow 2 atribui a conversa ao agente humano ID `1`.

Comportamento esperado:
- Somente conversas com `humano-necessario` seguem para atribuição.
- Conversas já atribuídas não são reatribuídas.

### Notificação humana

Jornada:
1. Após atribuir conversa, Workflow 2 cria uma mensagem privada/notificação operacional.
2. Humano recebe contexto mínimo: conversa, contato e motivo do escalonamento.

Comportamento esperado:
- Notificação chega em menos de 30 segundos.
- Dados sensíveis do lead não são enviados para canais externos sem necessidade.

### Pausa do bot

Jornada:
1. Workflow 2 mantém label `humano-necessario` e assignee humano.
2. Workflow 1 deve usar esse estado para não responder enquanto houver humano ativo.

Comportamento esperado:
- Se `assignee_id` estiver preenchido ou label `humano-necessario` presente, bot não responde.

## Fora de Escopo

- Não inclui follow-up após atendimento humano; isso é Workflow 3.
- Não inclui transferência entre agentes humanos.
- Não cria novo canal público de atendimento.
- Não altera o Workflow 1 nesta etapa, salvo se houver task futura aprovada para pausa explícita.

## Regras de Negócio

- Trigger: webhook Chatwoot com evento `message_created` ou `conversation_updated`.
- Condição de passagem: labels contém `humano-necessario` e `assignee_id` está vazio.
- Agente humano inicial: buscar via Chatwoot interno; estado real confirmou único agente ID `1`.
- Todas as chamadas Chatwoot usam `CHATWOOT_INTERNAL_URL=http://chatwoot_rails:3000`.
- Header Chatwoot: `api_access_token`, lido de variável de ambiente do container n8n.
- Se humano resolver: label volta para estágio anterior ou recebe `aguardando-follow-up` em fluxo futuro.

## Requisitos Não Funcionais

- Latência: atribuição/notificação em menos de 30 segundos.
- Segurança: nenhuma credencial hardcoded no workflow.
- Privacidade: notificação externa não deve expor dados completos do lead.
- Observabilidade: cada execução deve deixar evidência clara em logs do n8n.
- Compatibilidade: manter Workflow 1 intacto durante criação inicial do Workflow 2.
