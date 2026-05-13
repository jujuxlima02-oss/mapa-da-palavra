# Relatório - TASK 1 RESEARCH Workflow 3 Follow-up Automático

## Workflows existentes

| ID | nome | status | nós |
|---|---|---|---|
| `GYSGKNLROHbi3mfd` | `mpalavra | GestãoPay | Carrinho Abandonado` | ativo | 3 |
| `07wwphbyPCtIkUuD` | `mpalavra | GestãoPay | Pagamento Aprovado` | ativo | 3 |
| `zLylTDH2naG1v1wf` | `mpalavra | GestãoPay | Pagamento Recusado` | ativo | 3 |
| `XeA5zPHk9Shc8oLg` | `mpalavra | Agente WhatsApp Principal` | ativo | 16 |
| `FCkO2jZNaCLhzRSh` | `mpalavra | Escalar Humano` | ativo | 6 |
| `VHF1hUQ127iqaN4J` | `00. Configurações IA Corretora` | inativo | 30 |
| `ykQ3VaEtn56HUduK` | `01. Agente Corretor` | inativo | 93 |

## Labels existentes no Chatwoot

- `1-contato`
- `aguardando`
- `aquecendo`
- `carrinho-abandonado`
- `convertido`
- `em-andamento`
- `enviado-pagamento`
- `fechado`
- `frio`
- `ignorado`
- `interessado`
- `novo-lead`
- `perdido`
- `proposta`
- `qualificando`
- `resolvido`
- `respondeu`
- `suporte-aberto`

Conclusão: `follow-up-pendente` não existe hoje. Precisa ser criado se Workflow 3 depender dele.

## Nós de timer disponíveis no n8n

- Não há nó `wait` no Workflow 1 atual.
- O desenho de Workflow 3 deve usar o nó nativo `n8n-nodes-base.wait` se a versão do n8n disponível aceitar esse tipo.
- Nenhum workflow existente local usa timer/wait hoje; o controle de tempo precisará ser introduzido no Workflow 3.

## Estrutura relevante do Workflow 1

### Aplicação de labels

- `NÓ 7 - Preparar label do estágio`
- `NÓ 7 - Atualizar label do contato conforme estágio`

Lógica atual:

- `produto|como funciona|dúvida|quero saber|explica` -> `aquecendo`
- `preço|valor|link|comprar|checkout|pix|pagamento` -> `interessado`

### Histórico do Chatwoot

- `NÓ 3 - Buscar histórico da conversa no Chatwoot`
- URL interna usada: `http://chatwoot_rails:3000/api/v1/accounts/1/conversations/{{$json.conversation_id}}/messages`
- Header usado: `api_access_token`

### Guard humano

- `IF - Humano ativo?` foi adicionado ao Workflow 1 e bloqueia a continuação quando há `assignee_id`.

## Conclusão

Criar do zero:

- Workflow 3 `mpalavra | Follow-up Automático`
- Timer/Wait controlado para janelas de 12h e 24h
- Lógica de cancelamento ao detectar nova resposta do lead
- Lógica de max 2 follow-ups e retorno ao label `frio`
- Criação/uso eventual de `follow-up-pendente`

Reaproveitar:

- System prompt do Atendente Elias já injetado no Workflow 1
- Guard humano ativo já existente no Workflow 1
- Estrutura de histórico do Chatwoot já usada pelo Workflow 1
- Padrão de update via `PUT` sanitizado e ativação por endpoint dedicado

EXPLORAÇÃO CONCLUÍDA — nenhum arquivo modificado
