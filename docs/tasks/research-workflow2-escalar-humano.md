## Relatório — TASK 1 RESEARCH Workflow 2 Escalar Humano

### Workflows existentes

A API do n8n foi consultada via GET, mas não foi possível listar os workflows porque não há `N8N_PUBLIC_API_KEY` disponível no ambiente desta sessão.

| ID | nome | status | nós |
|---|---|---|---|
| `XeA5zPHk9Shc8oLg` | `mpalavra | Agente WhatsApp Principal` | Ativo / concluído conforme contexto local | Não confirmado via API, bloqueado por 401 |
| não confirmado | `Workflow 2 - Escalar Humano` | Pendente conforme contexto local | Não criado/confirmado |
| não confirmado | `Workflow 3 - Follow-up` | Pendente conforme contexto local | Não criado/confirmado |

GETs executados:

- `GET https://n8n.wvke.site/api/v1/workflows` -> `401`, mensagem: header `X-N8N-API-KEY` obrigatório.
- `GET https://n8n.wvke.site/api/v1/workflows/XeA5zPHk9Shc8oLg` -> `401`, mesma exigência.

### Estrutura resumida do Workflow 1

Não foi possível ler a estrutura real do Workflow 1 pela API por ausência de token n8n no ambiente.

Pelo contexto local do projeto, o Workflow 1 é:

- Nome: `mpalavra | Agente WhatsApp Principal`
- ID: `XeA5zPHk9Shc8oLg`
- Webhook ativo: `/webhook/mpalavra/whatsapp/mensagem-recebida`
- Função esperada: receber evento `message_created` do Chatwoot, processar mensagem WhatsApp, usar agente conversacional, aplicar labels e responder pelo fluxo Chatwoot/Baileys.
- Modelo configurado no contexto: `gpt-4o-mini` via credencial n8n com `${OPENAI_API_KEY}`.

### Tratamento atual do label `humano-necessario`

Existe como regra e label planejada no contexto local.

Critérios documentados para aplicar `humano-necessario`:

- Lead pede falar com pessoa.
- Raiva, frustração, reclamação, acusação, ameaça.
- Reembolso, cancelamento, chargeback, problema grave, compra errada, não recebimento, furto, urgência.
- Problema técnico de entrega/pagamento não resolvido em 2 tentativas.
- Lead prometeu comprar, mas não comprou após 24h.
- Lead permanece `frio` após 3 trocas sem evolução.

Ação esperada documentada:

- Aplicar label `humano-necessario`.
- Adicionar nota privada no Chatwoot.
- Acionar ferramenta/rotina `chatwoot_assign_human`.

Não foi possível confirmar se isso já está implementado no Workflow 1 real, porque o GET do workflow retornou `401`.

### Agentes humanos disponíveis no Chatwoot

A variável `CHATWOOT_API_ACCESS_TOKEN` não existe no ambiente desta sessão.

GET executado:

- `GET https://fazer.ai/api/v1/profile` -> `404`, retornou página HTML Next.js, não resposta de API Chatwoot.

Limitação: esse endpoint não permitiu listar agentes humanos. Sem token e sem `CHATWOOT_ACCOUNT_ID` disponível no ambiente, não foi possível consultar agentes.

Endpoint alternativo provável no Chatwoot:

- `GET /api/v1/accounts/{account_id}/agents`
- Possível endpoint relacionado a inbox: `GET /api/v1/accounts/{account_id}/inboxes/{inbox_id}/members`

### Conclusão

Precisa ser criado do zero:

- Workflow 2 `Escalar Humano`, salvo se a API autenticada mostrar algo diferente.
- Lógica de detecção/escuta de conversas com label `humano-necessario`.
- Atribuição da conversa a agente humano/equipe.
- Nota privada com motivo de escalonamento.
- Notificação operacional por webhook/email, conforme regra desejada.
- Confirmação dos agentes humanos disponíveis no Chatwoot via endpoint autenticado.

Já existe/documentado:

- Workflow 1 concluído e ativo no contexto local.
- Webhook principal do WhatsApp.
- Label `humano-necessario`.
- Critérios de escalonamento.
- Persona e mensagem padrão para transferência humana.
- Regra de não editar workflows por arquivo; mudanças devem ocorrer via API REST.

EXPLORAÇÃO CONCLUÍDA — nenhum arquivo modificado
