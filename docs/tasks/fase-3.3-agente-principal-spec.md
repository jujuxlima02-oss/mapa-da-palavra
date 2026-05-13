# Fase 3.3 - Spec Tecnica: Agente Principal mpalavra
Data: 2026-05-07
Status: AGUARDANDO APROVACAO

## Credenciais confirmadas
- Chatwoot fazer.ai account: uyvTqyJscvgHiPVZ (fazerAiChatwootApi) ✅ CREATE 200
- OpenAI mpalavra: 3a5e7dc9-91b6-41ab-917f-fc3093c4d8e4 (openAiApi)

## Referencia: 01. Agente Corretor
ID: ykQ3VaEtn56HUduK | 93 nos

## Spec dos ~40 nos do novo Agente Principal

| # | Nome do no | Tipo n8n | Funcao resumida | Depende de |
|---|---|---|---|---|
| 1 | Gatilho Chatwoot mpalavra | n8n-nodes-base.chatwootTrigger | Receber eventos do inbox mpalavra no Chatwoot | Credencial Chatwoot |
| 2 | Info | n8n-nodes-base.set | Normalizar account_id, inbox_id, conversation_id, contact_id, mensagem e tipo | 1 |
| 3 | IF - Humano ativo? | n8n-nodes-base.if | Bloquear resposta automatica quando conversa estiver com agente-off ou humano-necessario | 2 |
| 4 | Ignorar humano ativo | n8n-nodes-base.noOp | Encerrar caminho quando humano ja assumiu atendimento | 3 |
| 5 | Agente ativado? | n8n-nodes-base.filter | Permitir somente mensagens elegiveis para IA | 3 |
| 6 | Tipo de mensagem | n8n-nodes-base.switch | Roteia texto, audio, imagem e tipos nao suportados | 5 |
| 7 | Download audio | @fazer-ai/n8n-nodes-chatwoot.chatwoot | Baixar midia de audio do Chatwoot | 6, credencial Chatwoot |
| 8 | Converter audio para arquivo | n8n-nodes-base.convertToFile | Preparar binario para transcricao | 7 |
| 9 | Transcrever audio Whisper | n8n-nodes-base.openAi | Transcrever audio com Whisper usando OpenAI mpalavra | 8, credencial OpenAI |
| 10 | Extrair mensagem | n8n-nodes-base.code | Consolidar texto recebido ou transcrito em campo unico | 6, 9 |
| 11 | Salvar id_conversa | n8n-nodes-base.executionData | Registrar conversation_id para rastreabilidade da execucao | 10 |
| 12 | Salvar transcricao/descricao | @fazer-ai/n8n-nodes-chatwoot.chatwoot | Adicionar nota/atributo com transcricao quando houver audio | 9, credencial Chatwoot |
| 13 | Mensagem encavalada? | n8n-nodes-base.code | Calcular chave de fila e janela de concorrencia por conversa | 10 |
| 14 | Buscar mensagens em fila | n8n-nodes-base.postgres | Verificar se ha mensagens pendentes para a mesma conversa | 13 |
| 15 | Enfileirar mensagem | n8n-nodes-base.postgres | Inserir mensagem recebida na fila anti-encavalamento | 14 |
| 16 | Esperar fila | n8n-nodes-base.wait | Aguardar janela curta para agrupar mensagens proximas | 15 |
| 17 | Agente ja terminou de responder? | n8n-nodes-base.if | Verificar se ainda existe execucao bloqueando a conversa | 16 |
| 18 | Verificar status atendimento | n8n-nodes-base.postgres | Consultar lock/status de atendimento da conversa | 17 |
| 19 | Bloquear status atendimento | n8n-nodes-base.postgres | Aplicar lock antes de chamar o agente | 18 |
| 20 | Limpar fila de mensagens | n8n-nodes-base.postgres | Remover mensagens consolidadas da fila | 19 |
| 21 | Marcar como lida | @fazer-ai/n8n-nodes-chatwoot.chatwoot | Marcar conversa/mensagem como lida no Chatwoot | 20, credencial Chatwoot |
| 22 | Coletar mensagens | n8n-nodes-base.set | Montar entrada final com historico recente e mensagem consolidada | 21 |
| 23 | Memoria Postgres | @n8n/n8n-nodes-langchain.memoryPostgresChat | Persistir e recuperar memoria por conversation_id | 22 |
| 24 | OpenAI gpt-4o-mini | @n8n/n8n-nodes-langchain.lmChatOpenAi | Modelo principal do agente mpalavra | 22, credencial OpenAI |
| 25 | Refletir | @n8n/n8n-nodes-langchain.toolThink | Dar ao agente ferramenta de reflexao antes de responder | 24 |
| 26 | Escalar humano | @n8n/n8n-nodes-langchain.toolWorkflow | Chamar workflow FCkO2jZNaCLhzRSh quando necessario | 24 |
| 27 | Agente Principal mpalavra | @n8n/n8n-nodes-langchain.agent | Executar persona Elias e responder como assistente devocional | 23, 24, 25, 26 |
| 28 | Salvar tool calls | n8n-nodes-base.postgres | Registrar uso de ferramentas para auditoria | 27 |
| 29 | Usou tools? | n8n-nodes-base.if | Roteia execucao quando houve chamada de ferramenta | 28 |
| 30 | Output valido? | n8n-nodes-base.if | Validar se a saida do agente contem resposta utilizavel | 27 |
| 31 | Output invalido | n8n-nodes-base.stopAndError | Parar execucao com erro controlado se resposta for invalida | 30 |
| 32 | Resposta a outra mensagem? | n8n-nodes-base.if | Detectar se deve responder citando mensagem especifica | 30 |
| 33 | Buscar mensagem referenciada | @fazer-ai/n8n-nodes-chatwoot.chatwoot | Obter mensagem original quando houver reply_to | 32, credencial Chatwoot |
| 34 | Formatador de texto | @n8n/n8n-nodes-langchain.chainLlm | Ajustar resposta final para PT-BR, tom mpalavra e canal WhatsApp | 30, 33, credencial OpenAI |
| 35 | Enviar digitando | @fazer-ai/n8n-nodes-chatwoot.chatwoot | Emitir indicador operacional de digitacao/atividade, se suportado | 34, credencial Chatwoot |
| 36 | Enviar resposta via Chatwoot | @fazer-ai/n8n-nodes-chatwoot.chatwoot | Enviar mensagem final ao cliente | 34, 35, credencial Chatwoot |
| 37 | Preparar label do estagio | n8n-nodes-base.code | Calcular label frio/aquecendo/interessado/comprou/humano-necessario | 27 |
| 38 | Atualizar label do contato/conversa | @fazer-ai/n8n-nodes-chatwoot.chatwoot | Aplicar labels operacionais no Chatwoot | 37, credencial Chatwoot |
| 39 | Recebeu mensagem enquanto respondia? | n8n-nodes-base.if | Verificar se nova entrada chegou durante resposta | 36, 38 |
| 40 | Buscar novas entradas na fila | n8n-nodes-base.postgres | Recuperar entradas novas para novo ciclo, se existirem | 39 |
| 41 | Limpar status atendimento | n8n-nodes-base.postgres | Remover lock/status ao final da execucao | 39, 40 |
| 42 | Reset ou teste | n8n-nodes-base.switch | Rota administrativa para reset/teste quando acionada por comando autorizado | 2 |
| 43 | Limpar memoria | n8n-nodes-base.postgres | Resetar memoria da conversa quando comando autorizado for usado | 42 |
| 44 | Enviar memoria resetada | @fazer-ai/n8n-nodes-chatwoot.chatwoot | Confirmar reset ao usuario/operador no Chatwoot | 43, credencial Chatwoot |

## Cobertura dos 7 upgrades

- ✅ Trigger: `chatwootTrigger` coberto pelo no 1.
- ✅ Fila: Postgres anti-encavalamento coberto pelos nos 13 a 17 e 20.
- ✅ Status: Postgres lock/unlock coberto pelos nos 18, 19 e 41.
- ✅ Memoria: `memoryPostgresChat` coberto pelo no 23.
- ✅ Audio: Whisper coberto pelos nos 7 a 10, especialmente no 9.
- ✅ Escalar humano: `toolWorkflow` para `FCkO2jZNaCLhzRSh` coberto pelo no 26.
- ✅ Reflexao: `toolThink` coberto pelo no 25.

## Decisoes de adaptacao

- `Gatilho WhatsApp` (`@fazer-ai/n8n-nodes-chatwoot.chatwootTrigger`) → `Gatilho Chatwoot mpalavra` (`n8n-nodes-base.chatwootTrigger`) → alinhar com regra obrigatoria da Fase 3.3.
- `Agente Corretor` → `Agente Principal mpalavra` → trocar dominio de corretora por atendimento biblico/devocional da mpalavra.
- `OpenAI` / modelos auxiliares da corretora → `OpenAI gpt-4o-mini` com credencial `OpenAI mpalavra` → usar modelo e credencial ja confirmados no projeto.
- `Memoria` → `Memoria Postgres` por `conversation_id` → preservar memoria conversacional, mas particionada pelo contexto mpalavra.
- `07. Escalar humano` original → `Escalar humano` apontando para `FCkO2jZNaCLhzRSh` → usar workflow mpalavra concluido na Fase 3.2.
- Tools de corretora (`09. Gerar pagamento`, `02. Cotar vida`, `02b. Cotar auto`, `03. Enviar proposta`, `04. Buscar apolices`, `05. Emitir apolice`, `06. Cancelar apolice`, `10. Abrir sinistro`) → excluidas → pertencem ao dominio de seguros/imoveis e nao ao escopo biblico/devocional.
- `Reagir mensagem` e `Atualizar tarefa` como `chatwootTool` → adiar/excluir da primeira versao mpalavra → nao sao obrigatorios para os 7 upgrades e aumentam superficie de teste.
- `Gerar audio`, `Enviar audio`, `Formatar SSML`, `Gravando...` → excluidos da primeira versao → mpalavra exige transcricao de audio recebido, nao sintese de audio de resposta nesta fase.
- `Resetar atributos contato`, `Resetar atributos conversa`, `Resetar etiquetas`, `Resetar task` → mantidos apenas como rota administrativa reduzida (`Reset ou teste`, `Limpar memoria`, `Enviar memoria resetada`) → evitar carregar automacoes de CRM da corretora.
- `Enviar texto` da corretora → `Enviar resposta via Chatwoot` → envio final pelo node Chatwoot fazer.ai com credencial confirmada.
- `Colocar etiqueta testando-agente` / `Enviar teste habilitado` → excluidos da spec principal → controles de teste nao devem entrar no fluxo operacional sem aprovacao especifica.
- Sticky notes do workflow original → excluidas → a implementacao mpalavra nao deve incluir `stickyNote`.

## Proximo passo
GET /api/v1/workflows para confirmar ID do
`mpalavra | Agente Principal` antes do primeiro PUT.
