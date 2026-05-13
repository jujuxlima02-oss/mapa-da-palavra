# Workflows Originais — Corretora

## 08. Follow-ups (ID: tgCgMzuoNOxWUVad)
Status: inativo | Nós: 21

### Nós
| Nome | Tipo | Função inferida |
|------|------|-----------------|
| Tarefa vencida | @fazer-ai/n8n-nodes-chatwoot.chatwootTrigger | Função não inferida pelo tipo/nome |
| Ignorar | n8n-nodes-base.noOp | Função não inferida pelo tipo/nome |
| Note principal | n8n-nodes-base.stickyNote | Função não inferida pelo tipo/nome |
| Sticky Note12 | n8n-nodes-base.stickyNote | Função não inferida pelo tipo/nome |
| Sticky Note13 | n8n-nodes-base.stickyNote | Função não inferida pelo tipo/nome |
| Sticky Note36 | n8n-nodes-base.stickyNote | Função não inferida pelo tipo/nome |
| Carregar tarefa | @fazer-ai/n8n-nodes-chatwoot.chatwoot | Função não inferida pelo tipo/nome |
| Classificar follow-up | n8n-nodes-base.code | Processa dados com código |
| Tipo de follow-up | n8n-nodes-base.switch | Função não inferida pelo tipo/nome |
| Agente pré-venda | @n8n/n8n-nodes-langchain.agent | Gera ou processa resposta com IA |
| Enviar pré-venda | @fazer-ai/n8n-nodes-chatwoot.chatwoot | Função não inferida pelo tipo/nome |
| Agente pagamento | @n8n/n8n-nodes-langchain.agent | Gera ou processa resposta com IA |
| Enviar pagamento | @fazer-ai/n8n-nodes-chatwoot.chatwoot | Função não inferida pelo tipo/nome |
| Agente renovação | @n8n/n8n-nodes-langchain.agent | Gera ou processa resposta com IA |
| Enviar renovação | @fazer-ai/n8n-nodes-chatwoot.chatwoot | Função não inferida pelo tipo/nome |
| Agente sinistro | @n8n/n8n-nodes-langchain.agent | Gera ou processa resposta com IA |
| Enviar sinistro | @fazer-ai/n8n-nodes-chatwoot.chatwoot | Função não inferida pelo tipo/nome |
| Atualizar due_date sinistro | @fazer-ai/n8n-nodes-chatwoot.chatwoot | Função não inferida pelo tipo/nome |
| OpenAI | @n8n/n8n-nodes-langchain.lmChatOpenAi | Gera ou processa resposta com IA |
| Memória | @n8n/n8n-nodes-langchain.memoryPostgresChat | Gera ou processa resposta com IA |
| Atualizar_tarefa | @fazer-ai/n8n-nodes-chatwoot.chatwootTool | Função não inferida pelo tipo/nome |

## 06. Cancelar Apólice (ID: naZDSFrra03RzVCK)
Status: inativo | Nós: 11

### Nós
| Nome | Tipo | Função inferida |
|------|------|-----------------|
| Gatilho | n8n-nodes-base.executeWorkflowTrigger | Função não inferida pelo tipo/nome |
| Buscar tarefa | @fazer-ai/n8n-nodes-chatwoot.chatwoot | Função não inferida pelo tipo/nome |
| Preparar atualização | n8n-nodes-base.code | Processa dados com código |
| Atualizar tarefa | @fazer-ai/n8n-nodes-chatwoot.chatwoot | Função não inferida pelo tipo/nome |
| Escalar para humano | n8n-nodes-base.executeWorkflow | Função não inferida pelo tipo/nome |
| Resposta ao agente | n8n-nodes-base.set | Prepara dados para próximos nós |
| Note principal | n8n-nodes-base.stickyNote | Função não inferida pelo tipo/nome |
| Note escopo | n8n-nodes-base.stickyNote | Função não inferida pelo tipo/nome |
| Sticky Note12 | n8n-nodes-base.stickyNote | Função não inferida pelo tipo/nome |
| Sticky Note13 | n8n-nodes-base.stickyNote | Função não inferida pelo tipo/nome |
| Sticky Note36 | n8n-nodes-base.stickyNote | Função não inferida pelo tipo/nome |

## 10. Abrir Sinistro (ID: zHlL4Iz8i87wux1n)
Status: inativo | Nós: 14

### Nós
| Nome | Tipo | Função inferida |
|------|------|-----------------|
| Gatilho | n8n-nodes-base.executeWorkflowTrigger | Função não inferida pelo tipo/nome |
| Classificar sinistro | n8n-nodes-base.code | Processa dados com código |
| Listar funis | @fazer-ai/n8n-nodes-chatwoot.chatwoot | Função não inferida pelo tipo/nome |
| Localizar board Sinistros | n8n-nodes-base.code | Processa dados com código |
| Resolver conversation_id interno | n8n-nodes-base.httpRequest | Integra API externa ou serviço interno |
| Mesclar id interno | n8n-nodes-base.set | Prepara dados para próximos nós |
| Criar tarefa Sinistro | @fazer-ai/n8n-nodes-chatwoot.chatwoot | Função não inferida pelo tipo/nome |
| Escalar para humano | n8n-nodes-base.executeWorkflow | Função não inferida pelo tipo/nome |
| Resposta ao agente | n8n-nodes-base.set | Prepara dados para próximos nós |
| Note principal | n8n-nodes-base.stickyNote | Função não inferida pelo tipo/nome |
| Note funil paralelo | n8n-nodes-base.stickyNote | Função não inferida pelo tipo/nome |
| Sticky Note12 | n8n-nodes-base.stickyNote | Função não inferida pelo tipo/nome |
| Sticky Note13 | n8n-nodes-base.stickyNote | Função não inferida pelo tipo/nome |
| Sticky Note36 | n8n-nodes-base.stickyNote | Função não inferida pelo tipo/nome |

## 07. Escalar Humano (ID: h7DMGGJeiLwbSRUn)
Status: inativo | Nós: 8

### Nós
| Nome | Tipo | Função inferida |
|------|------|-----------------|
| Gatilho | n8n-nodes-base.executeWorkflowTrigger | Função não inferida pelo tipo/nome |
| Adicionar etiqueta agente-off | @fazer-ai/n8n-nodes-chatwoot.chatwoot | Função não inferida pelo tipo/nome |
| Notificar corretor humano | @fazer-ai/n8n-nodes-chatwoot.chatwoot | Função não inferida pelo tipo/nome |
| Note principal | n8n-nodes-base.stickyNote | Função não inferida pelo tipo/nome |
| Resposta ao agente | n8n-nodes-base.set | Prepara dados para próximos nós |
| Sticky Note12 | n8n-nodes-base.stickyNote | Função não inferida pelo tipo/nome |
| Sticky Note13 | n8n-nodes-base.stickyNote | Função não inferida pelo tipo/nome |
| Sticky Note36 | n8n-nodes-base.stickyNote | Função não inferida pelo tipo/nome |

## 03. Enviar Proposta (ID: 9dYRRXONhT3GSp2v)
Status: inativo | Nós: 13

### Nós
| Nome | Tipo | Função inferida |
|------|------|-----------------|
| Gatilho | n8n-nodes-base.executeWorkflowTrigger | Função não inferida pelo tipo/nome |
| Carregar tarefa | @fazer-ai/n8n-nodes-chatwoot.chatwoot | Função não inferida pelo tipo/nome |
| Montar HTML | n8n-nodes-base.code | Processa dados com código |
| Gerar PDF (PDFShift) | n8n-nodes-base.httpRequest | Integra API externa ou serviço interno |
| Renomear binary + mensagem | n8n-nodes-base.code | Processa dados com código |
| Enviar PDF | @fazer-ai/n8n-nodes-chatwoot.chatwoot | Função não inferida pelo tipo/nome |
| Mover para Proposta Enviada | @fazer-ai/n8n-nodes-chatwoot.chatwoot | Função não inferida pelo tipo/nome |
| Note principal | n8n-nodes-base.stickyNote | Função não inferida pelo tipo/nome |
| Note PDFShift | n8n-nodes-base.stickyNote | Função não inferida pelo tipo/nome |
| Sticky Note12 | n8n-nodes-base.stickyNote | Função não inferida pelo tipo/nome |
| Sticky Note13 | n8n-nodes-base.stickyNote | Função não inferida pelo tipo/nome |
| Sticky Note36 | n8n-nodes-base.stickyNote | Função não inferida pelo tipo/nome |
| Resposta ao agente | n8n-nodes-base.set | Prepara dados para próximos nós |

## mpalavra | Follow-up Automático (ID: mVo6oZMEERqNmhwI)
Status: ativo | Nós: 15

### Nós
| Nome | Tipo | Função inferida |
|------|------|-----------------|
| Webhook Follow-up Automático | n8n-nodes-base.webhook | Entrada por webhook |
| IF - Label aquecendo ou interessado e sem assignee | n8n-nodes-base.if | Decide rota conforme condição |
| Set Window | n8n-nodes-base.set | Prepara dados para próximos nós |
| Wait Node | n8n-nodes-base.wait | Controla espera/timer |
| Check Silence | n8n-nodes-base.httpRequest | Integra API externa ou serviço interno |
| IF - Lead em silencio? | n8n-nodes-base.if | Decide rota conforme condição |
| Get History | n8n-nodes-base.httpRequest | Integra API externa ou serviço interno |
| Agente OpenAI - Follow-up | @n8n/n8n-nodes-langchain.agent | Gera ou processa resposta com IA |
| OpenAI gpt-4o-mini follow-up | @n8n/n8n-nodes-langchain.lmChatOpenAi | Gera ou processa resposta com IA |
| Check Horário | n8n-nodes-base.if | Decide rota conforme condição |
| Send Message | n8n-nodes-base.httpRequest | Integra API externa ou serviço interno |
| Increment Counter | n8n-nodes-base.httpRequest | Integra API externa ou serviço interno |
| IF - Limite de follow-ups | n8n-nodes-base.if | Decide rota conforme condição |
| Apply Label Frio | n8n-nodes-base.httpRequest | Integra API externa ou serviço interno |
| Responder 200 | n8n-nodes-base.respondToWebhook | Responde requisição do webhook |

## 02.1 Cotar Vida (ID: pJ7fQGl9gUyS67go)
Status: inativo | Nós: 13

### Nós
| Nome | Tipo | Função inferida |
|------|------|-----------------|
| Gatilho | n8n-nodes-base.executeWorkflowTrigger | Função não inferida pelo tipo/nome |
| Carregar tarefa | @fazer-ai/n8n-nodes-chatwoot.chatwoot | Função não inferida pelo tipo/nome |
| Montar payload | n8n-nodes-base.code | Processa dados com código |
| Chamar seguradora (mock) | n8n-nodes-base.httpRequest | Integra API externa ou serviço interno |
| Processar resposta | n8n-nodes-base.code | Processa dados com código |
| Salvar cotação na tarefa | @fazer-ai/n8n-nodes-chatwoot.chatwoot | Função não inferida pelo tipo/nome |
| Resposta ao agente | n8n-nodes-base.set | Prepara dados para próximos nós |
| Note mock | n8n-nodes-base.stickyNote | Função não inferida pelo tipo/nome |
| Note persistencia | n8n-nodes-base.stickyNote | Função não inferida pelo tipo/nome |
| Sticky Note13 | n8n-nodes-base.stickyNote | Função não inferida pelo tipo/nome |
| Sticky Note36 | n8n-nodes-base.stickyNote | Função não inferida pelo tipo/nome |
| Sticky Note12 | n8n-nodes-base.stickyNote | Função não inferida pelo tipo/nome |
| Note principal | n8n-nodes-base.stickyNote | Função não inferida pelo tipo/nome |

## 04. Buscar Apólices (ID: fvKzC3qD2xvpmtOL)
Status: inativo | Nós: 7

### Nós
| Nome | Tipo | Função inferida |
|------|------|-----------------|
| Gatilho | n8n-nodes-base.executeWorkflowTrigger | Função não inferida pelo tipo/nome |
| Buscar tarefa | @fazer-ai/n8n-nodes-chatwoot.chatwoot | Função não inferida pelo tipo/nome |
| Formatar apólice | n8n-nodes-base.code | Processa dados com código |
| Note principal | n8n-nodes-base.stickyNote | Função não inferida pelo tipo/nome |
| Sticky Note12 | n8n-nodes-base.stickyNote | Função não inferida pelo tipo/nome |
| Sticky Note13 | n8n-nodes-base.stickyNote | Função não inferida pelo tipo/nome |
| Sticky Note36 | n8n-nodes-base.stickyNote | Função não inferida pelo tipo/nome |

## 99. Mock Seguradora (ID: V0CWuRBEg2TRc6Sl)
Status: inativo | Nós: 31

### Nós
| Nome | Tipo | Função inferida |
|------|------|-----------------|
| Sobre este workflow | n8n-nodes-base.stickyNote | Função não inferida pelo tipo/nome |
| Sticky Cotação | n8n-nodes-base.stickyNote | Função não inferida pelo tipo/nome |
| POST /quote-life/request | n8n-nodes-base.webhook | Recebe eventos HTTP/webhook |
| Normalizar e Hash (Cotar) | n8n-nodes-base.code | Processa dados com código |
| Gerar Cotação | n8n-nodes-base.code | Processa dados com código |
| Responder Cotação (201) | n8n-nodes-base.respondToWebhook | Responde requisição do webhook |
| Sticky Emissão | n8n-nodes-base.stickyNote | Função não inferida pelo tipo/nome |
| PATCH /quote-life/accept | n8n-nodes-base.webhook | Recebe eventos HTTP/webhook |
| Validar consentId e Hash | n8n-nodes-base.code | Processa dados com código |
| Validação passou? | n8n-nodes-base.if | Decide rota conforme condição |
| Emitir Apólice | n8n-nodes-base.code | Processa dados com código |
| Responder Emissão (201) | n8n-nodes-base.respondToWebhook | Responde requisição do webhook |
| Montar ResponseError | n8n-nodes-base.code | Processa dados com código |
| Responder Erro (4xx) | n8n-nodes-base.respondToWebhook | Responde requisição do webhook |
| Sticky Exemplos | n8n-nodes-base.stickyNote | Função não inferida pelo tipo/nome |
| Sticky Note12 | n8n-nodes-base.stickyNote | Função não inferida pelo tipo/nome |
| Sticky Note13 | n8n-nodes-base.stickyNote | Função não inferida pelo tipo/nome |
| Sticky Note36 | n8n-nodes-base.stickyNote | Função não inferida pelo tipo/nome |
| Sticky Cotação (Auto) | n8n-nodes-base.stickyNote | Função não inferida pelo tipo/nome |
| Sticky Emissão (Auto) | n8n-nodes-base.stickyNote | Função não inferida pelo tipo/nome |
| POST /quote-auto/request | n8n-nodes-base.webhook | Recebe eventos HTTP/webhook |
| Normalizar e Hash (Cotar Auto) | n8n-nodes-base.code | Processa dados com código |
| Gerar Cotação (Auto) | n8n-nodes-base.code | Processa dados com código |
| Responder Cotação 201 (Auto) | n8n-nodes-base.respondToWebhook | Responde requisição do webhook |
| PATCH /quote-auto/accept | n8n-nodes-base.webhook | Recebe eventos HTTP/webhook |
| Validar consentId e Hash (Auto) | n8n-nodes-base.code | Processa dados com código |
| Validação passou? (Auto) | n8n-nodes-base.if | Decide rota conforme condição |
| Emitir Apólice (Auto) | n8n-nodes-base.code | Processa dados com código |
| Responder Emissão 201 (Auto) | n8n-nodes-base.respondToWebhook | Responde requisição do webhook |
| Montar ResponseError (Auto) | n8n-nodes-base.code | Processa dados com código |
| Responder Erro 4xx (Auto) | n8n-nodes-base.respondToWebhook | Responde requisição do webhook |

## mpalavra | GestãoPay | Pagamento Aprovado (ID: 07wwphbyPCtIkUuD)
Status: ativo | Nós: 3

### Nós
| Nome | Tipo | Função inferida |
|------|------|-----------------|
| Webhook mpalavra \| GestãoPay \| Pagamento Aprovado | n8n-nodes-base.webhook | Entrada por webhook |
| Normalizar evento mpalavra | n8n-nodes-base.code | Processa dados com código |
| Responder 200 | n8n-nodes-base.respondToWebhook | Responde requisição do webhook |

## 07. Escalar Humano (ID: Qdhuk2mbP5G0mBFq)
Status: inativo | Nós: 8

### Nós
| Nome | Tipo | Função inferida |
|------|------|-----------------|
| Gatilho | n8n-nodes-base.executeWorkflowTrigger | Função não inferida pelo tipo/nome |
| Adicionar etiqueta agente-off | @fazer-ai/n8n-nodes-chatwoot.chatwoot | Função não inferida pelo tipo/nome |
| Notificar corretor humano | @fazer-ai/n8n-nodes-chatwoot.chatwoot | Função não inferida pelo tipo/nome |
| Note principal | n8n-nodes-base.stickyNote | Função não inferida pelo tipo/nome |
| Resposta ao agente | n8n-nodes-base.set | Prepara dados para próximos nós |
| Sticky Note12 | n8n-nodes-base.stickyNote | Função não inferida pelo tipo/nome |
| Sticky Note13 | n8n-nodes-base.stickyNote | Função não inferida pelo tipo/nome |
| Sticky Note36 | n8n-nodes-base.stickyNote | Função não inferida pelo tipo/nome |

## mpalavra | GestãoPay | Pagamento Recusado (ID: zLylTDH2naG1v1wf)
Status: ativo | Nós: 3

### Nós
| Nome | Tipo | Função inferida |
|------|------|-----------------|
| Webhook mpalavra \| GestãoPay \| Pagamento Recusado | n8n-nodes-base.webhook | Entrada por webhook |
| Normalizar evento mpalavra | n8n-nodes-base.code | Processa dados com código |
| Responder 200 | n8n-nodes-base.respondToWebhook | Responde requisição do webhook |

## 02.2 Cotar Auto (ID: KnMhlJh3t6Tm8DHr)
Status: inativo | Nós: 13

### Nós
| Nome | Tipo | Função inferida |
|------|------|-----------------|
| Gatilho | n8n-nodes-base.executeWorkflowTrigger | Função não inferida pelo tipo/nome |
| Carregar tarefa | @fazer-ai/n8n-nodes-chatwoot.chatwoot | Função não inferida pelo tipo/nome |
| Montar payload | n8n-nodes-base.code | Processa dados com código |
| Chamar seguradora (mock) | n8n-nodes-base.httpRequest | Integra API externa ou serviço interno |
| Processar resposta | n8n-nodes-base.code | Processa dados com código |
| Salvar cotação na tarefa | @fazer-ai/n8n-nodes-chatwoot.chatwoot | Função não inferida pelo tipo/nome |
| Resposta ao agente | n8n-nodes-base.set | Prepara dados para próximos nós |
| Note mock | n8n-nodes-base.stickyNote | Função não inferida pelo tipo/nome |
| Note persistencia | n8n-nodes-base.stickyNote | Função não inferida pelo tipo/nome |
| Sticky Note13 | n8n-nodes-base.stickyNote | Função não inferida pelo tipo/nome |
| Sticky Note36 | n8n-nodes-base.stickyNote | Função não inferida pelo tipo/nome |
| Sticky Note12 | n8n-nodes-base.stickyNote | Função não inferida pelo tipo/nome |
| Note principal | n8n-nodes-base.stickyNote | Função não inferida pelo tipo/nome |

## 05. Emitir Apólice (ID: EHNmSe83nGcsviRt)
Status: inativo | Nós: 13

### Nós
| Nome | Tipo | Função inferida |
|------|------|-----------------|
| Gatilho | n8n-nodes-base.executeWorkflowTrigger | Função não inferida pelo tipo/nome |
| Montar payload | n8n-nodes-base.code | Processa dados com código |
| Emitir na seguradora (mock) | n8n-nodes-base.httpRequest | Integra API externa ou serviço interno |
| Processar emissão | n8n-nodes-base.code | Processa dados com código |
| Salvar apólice na tarefa | @fazer-ai/n8n-nodes-chatwoot.chatwoot | Função não inferida pelo tipo/nome |
| Resposta ao agente | n8n-nodes-base.set | Prepara dados para próximos nós |
| Note principal | n8n-nodes-base.stickyNote | Função não inferida pelo tipo/nome |
| Note mock | n8n-nodes-base.stickyNote | Função não inferida pelo tipo/nome |
| Note persistencia | n8n-nodes-base.stickyNote | Função não inferida pelo tipo/nome |
| Carregar tarefa | @fazer-ai/n8n-nodes-chatwoot.chatwoot | Função não inferida pelo tipo/nome |
| Sticky Note12 | n8n-nodes-base.stickyNote | Função não inferida pelo tipo/nome |
| Sticky Note13 | n8n-nodes-base.stickyNote | Função não inferida pelo tipo/nome |
| Sticky Note36 | n8n-nodes-base.stickyNote | Função não inferida pelo tipo/nome |

## 01. Agente Corretor (ID: ykQ3VaEtn56HUduK)
Status: inativo | Nós: 93

### Nós
| Nome | Tipo | Função inferida |
|------|------|-----------------|
| Info | n8n-nodes-base.set | Prepara dados para próximos nós |
| Reset ou teste | n8n-nodes-base.switch | Prepara dados para próximos nós |
| Limpar memória | n8n-nodes-base.postgres | Função não inferida pelo tipo/nome |
| Resetar status atendimento | n8n-nodes-base.postgres | Prepara dados para próximos nós |
| Sticky Note1 | n8n-nodes-base.stickyNote | Função não inferida pelo tipo/nome |
| Sticky Note3 | n8n-nodes-base.stickyNote | Função não inferida pelo tipo/nome |
| Resetar atributos contato | @fazer-ai/n8n-nodes-chatwoot.chatwoot | Prepara dados para próximos nós |
| Resetar atributos conversa | @fazer-ai/n8n-nodes-chatwoot.chatwoot | Prepara dados para próximos nós |
| Resetar etiquetas | @fazer-ai/n8n-nodes-chatwoot.chatwoot | Prepara dados para próximos nós |
| Limpar fila de mensagens | n8n-nodes-base.postgres | Função não inferida pelo tipo/nome |
| Enviar memória resetada | @fazer-ai/n8n-nodes-chatwoot.chatwoot | Prepara dados para próximos nós |
| Colocar etiqueta testando-agente | @fazer-ai/n8n-nodes-chatwoot.chatwoot | Função não inferida pelo tipo/nome |
| Enviar teste habilitado | @fazer-ai/n8n-nodes-chatwoot.chatwoot | Função não inferida pelo tipo/nome |
| Agente ativado? | n8n-nodes-base.filter | Função não inferida pelo tipo/nome |
| Tipo de mensagem | n8n-nodes-base.switch | Função não inferida pelo tipo/nome |
| Sticky Note6 | n8n-nodes-base.stickyNote | Função não inferida pelo tipo/nome |
| Extract from File | n8n-nodes-base.extractFromFile | Função não inferida pelo tipo/nome |
| Convert to File | n8n-nodes-base.convertToFile | Função não inferida pelo tipo/nome |
| Transcrever audio | @n8n/n8n-nodes-langchain.openAi | Gera ou processa resposta com IA |
| Download áudio | @fazer-ai/n8n-nodes-chatwoot.chatwoot | Função não inferida pelo tipo/nome |
| Extrair mensagem | n8n-nodes-base.code | Processa dados com código |
| Salvar id_conversa | n8n-nodes-base.executionData | Função não inferida pelo tipo/nome |
| Áudio ou imagem? | n8n-nodes-base.if | Decide rota conforme condição |
| Salvar transcrição/descrição | @fazer-ai/n8n-nodes-chatwoot.chatwoot | Função não inferida pelo tipo/nome |
| Mensagem encavalada? | n8n-nodes-base.code | Processa dados com código |
| Buscar mensagens | n8n-nodes-base.postgres | Função não inferida pelo tipo/nome |
| Esperar | n8n-nodes-base.wait | Controla espera/timer |
| Enfileirar mensagem. | n8n-nodes-base.postgres | Função não inferida pelo tipo/nome |
| Agente já terminou de responder? | n8n-nodes-base.if | Decide rota conforme condição |
| Verificar status atendimento | n8n-nodes-base.postgres | Função não inferida pelo tipo/nome |
| Bloquear status atendimento | n8n-nodes-base.postgres | Função não inferida pelo tipo/nome |
| Limpar fila de mensagens1 | n8n-nodes-base.postgres | Função não inferida pelo tipo/nome |
| Marcar como lida | @fazer-ai/n8n-nodes-chatwoot.chatwoot | Função não inferida pelo tipo/nome |
| Coletar mensagens | n8n-nodes-base.set | Prepara dados para próximos nós |
| Refletir | @n8n/n8n-nodes-langchain.toolThink | Gera ou processa resposta com IA |
| Agente Corretor | @n8n/n8n-nodes-langchain.agent | Gera ou processa resposta com IA |
| OpenAI | @n8n/n8n-nodes-langchain.lmChatOpenAi | Gera ou processa resposta com IA |
| Memória | @n8n/n8n-nodes-langchain.memoryPostgresChat | Gera ou processa resposta com IA |
| Resposta a outra mensagem? | n8n-nodes-base.if | Decide rota conforme condição |
| Buscar mensagem referenciada | @fazer-ai/n8n-nodes-chatwoot.chatwoot | Função não inferida pelo tipo/nome |
| Salvar tool calls | n8n-nodes-base.postgres | Função não inferida pelo tipo/nome |
| Usou tools? | n8n-nodes-base.if | Decide rota conforme condição |
| Output válido? | n8n-nodes-base.if | Decide rota conforme condição |
| Limpar status atendimento | n8n-nodes-base.postgres | Função não inferida pelo tipo/nome |
| Recebeu mensagem enquanto respondia? | n8n-nodes-base.if | Decide rota conforme condição |
| Buscar novas entradas na fila | n8n-nodes-base.postgres | Função não inferida pelo tipo/nome |
| Usou tools?1 | n8n-nodes-base.if | Decide rota conforme condição |
| Buscar mensagens na memória | n8n-nodes-base.postgres | Função não inferida pelo tipo/nome |
| Deletar última mensagem da memória | n8n-nodes-base.postgres | Função não inferida pelo tipo/nome |
| Salvar tool calls3 | n8n-nodes-base.postgres | Função não inferida pelo tipo/nome |
| Limpar status atendimento3 | n8n-nodes-base.postgres | Função não inferida pelo tipo/nome |
| Output inválido | n8n-nodes-base.stopAndError | Função não inferida pelo tipo/nome |
| Formatar SSML | @n8n/n8n-nodes-langchain.chainLlm | Gera ou processa resposta com IA |
| Formatar texto | @n8n/n8n-nodes-langchain.chainLlm | Gera ou processa resposta com IA |
| OpenAI Chat Model1 | @n8n/n8n-nodes-langchain.lmChatOpenAi | Gera ou processa resposta com IA |
| OpenAI Chat Model2 | @n8n/n8n-nodes-langchain.lmChatOpenAi | Gera ou processa resposta com IA |
| Limpar status atendimento1 | n8n-nodes-base.postgres | Função não inferida pelo tipo/nome |
| Gravando... | @fazer-ai/n8n-nodes-chatwoot.chatwoot | Função não inferida pelo tipo/nome |
| Gerar áudio | @elevenlabs/n8n-nodes-elevenlabs.elevenLabs | Função não inferida pelo tipo/nome |
| Enviar áudio | @fazer-ai/n8n-nodes-chatwoot.chatwoot | Função não inferida pelo tipo/nome |
| Enviar texto | @fazer-ai/n8n-nodes-chatwoot.chatwoot | Função não inferida pelo tipo/nome |
| Áudio? | n8n-nodes-base.if | Decide rota conforme condição |
| Reagir mensagem | @fazer-ai/n8n-nodes-chatwoot.chatwootTool | Função não inferida pelo tipo/nome |
| Atualizar tarefa | @fazer-ai/n8n-nodes-chatwoot.chatwootTool | Função não inferida pelo tipo/nome |
| Gatilho WhatsApp | @fazer-ai/n8n-nodes-chatwoot.chatwootTrigger | Função não inferida pelo tipo/nome |
| Sticky Note13 | n8n-nodes-base.stickyNote | Função não inferida pelo tipo/nome |
| Sticky Note36 | n8n-nodes-base.stickyNote | Função não inferida pelo tipo/nome |
| Sticky Note21 | n8n-nodes-base.stickyNote | Função não inferida pelo tipo/nome |
| Sticky Note29 | n8n-nodes-base.stickyNote | Função não inferida pelo tipo/nome |
| Sticky Note12 | n8n-nodes-base.stickyNote | Função não inferida pelo tipo/nome |
| Sticky Note7 | n8n-nodes-base.stickyNote | Função não inferida pelo tipo/nome |
| Sticky Note8 | n8n-nodes-base.stickyNote | Função não inferida pelo tipo/nome |
| Sticky Note9 | n8n-nodes-base.stickyNote | Função não inferida pelo tipo/nome |
| Sticky Note10 | n8n-nodes-base.stickyNote | Função não inferida pelo tipo/nome |
| Sticky Note | n8n-nodes-base.stickyNote | Função não inferida pelo tipo/nome |
| Sticky Note2 | n8n-nodes-base.stickyNote | Função não inferida pelo tipo/nome |
| Sticky Note4 | n8n-nodes-base.stickyNote | Função não inferida pelo tipo/nome |
| Sticky Note14 | n8n-nodes-base.stickyNote | Função não inferida pelo tipo/nome |
| Sticky Note15 | n8n-nodes-base.stickyNote | Função não inferida pelo tipo/nome |
| Sticky Note28 | n8n-nodes-base.stickyNote | Função não inferida pelo tipo/nome |
| Sticky Note24 | n8n-nodes-base.stickyNote | Função não inferida pelo tipo/nome |
| Preparar reset task | n8n-nodes-base.code | Prepara dados para próximos nós |
| Resetar task | @fazer-ai/n8n-nodes-chatwoot.chatwoot | Prepara dados para próximos nós |
| 09. Gerar pagamento | @n8n/n8n-nodes-langchain.toolWorkflow | Gera ou processa resposta com IA |
| 02. Cotar vida | @n8n/n8n-nodes-langchain.toolWorkflow | Gera ou processa resposta com IA |
| 05. Emitir apolice | @n8n/n8n-nodes-langchain.toolWorkflow | Gera ou processa resposta com IA |
| 03. Enviar proposta | @n8n/n8n-nodes-langchain.toolWorkflow | Gera ou processa resposta com IA |
| 06. Cancelar apolice | @n8n/n8n-nodes-langchain.toolWorkflow | Gera ou processa resposta com IA |
| 10. Abrir sinistro | @n8n/n8n-nodes-langchain.toolWorkflow | Gera ou processa resposta com IA |
| 04. Buscar apolices | @n8n/n8n-nodes-langchain.toolWorkflow | Gera ou processa resposta com IA |
| 07. Escalar humano | @n8n/n8n-nodes-langchain.toolWorkflow | Gera ou processa resposta com IA |
| Sticky Note16 | n8n-nodes-base.stickyNote | Função não inferida pelo tipo/nome |
| 02b. Cotar auto | @n8n/n8n-nodes-langchain.toolWorkflow | Gera ou processa resposta com IA |

## mpalavra | Agente WhatsApp Principal (ID: XeA5zPHk9Shc8oLg)
Status: ativo | Nós: 16

### Nós
| Nome | Tipo | Função inferida |
|------|------|-----------------|
| TRIGGER - Webhook mensagem recebida | n8n-nodes-base.webhook | Entrada por webhook |
| NÓ 1 - Extrair dados da mensagem Chatwoot | n8n-nodes-base.code | Processa dados com código |
| NÓ 2 - Verificar se é mensagem do bot | n8n-nodes-base.if | Decide rota conforme condição |
| Responder 200 - Ignorado | n8n-nodes-base.respondToWebhook | Responde requisição do webhook |
| NÓ 3 - Buscar histórico da conversa no Chatwoot | n8n-nodes-base.httpRequest | Integra API externa ou serviço interno |
| Formatar histórico para agente | n8n-nodes-base.code | Processa dados com código |
| NÓ 4 - Agente OpenAI | @n8n/n8n-nodes-langchain.agent | Gera ou processa resposta com IA |
| OpenAI gpt-4o-mini | @n8n/n8n-nodes-langchain.lmChatOpenAi | Gera ou processa resposta com IA |
| NÓ 5 - Verificar se deve escalar para humano | n8n-nodes-base.code | Processa dados com código |
| Branch - Deve escalar? | n8n-nodes-base.if | Decide rota conforme condição |
| Branch A - Chamar workflow escalonamento | n8n-nodes-base.httpRequest | Integra API externa ou serviço interno |
| NÓ 6 - Enviar resposta via Chatwoot | n8n-nodes-base.httpRequest | Integra API externa ou serviço interno |
| NÓ 7 - Preparar label do estágio | n8n-nodes-base.code | Processa dados com código |
| NÓ 7 - Atualizar label do contato conforme estágio | n8n-nodes-base.httpRequest | Integra API externa ou serviço interno |
| NÓ 8 - Responder 200 ao Chatwoot | n8n-nodes-base.respondToWebhook | Responde requisição do webhook |
| IF - Humano ativo? | n8n-nodes-base.if | Decide rota conforme condição |

## mpalavra | Escalar Humano (ID: FCkO2jZNaCLhzRSh)
Status: ativo | Nós: 6

### Nós
| Nome | Tipo | Função inferida |
|------|------|-----------------|
| Webhook Escalar Humano | n8n-nodes-base.webhook | Entrada por webhook |
| IF - Label humano necessario e sem assignee | n8n-nodes-base.if | Decide rota conforme condição |
| Responder 200 - Ignorado | n8n-nodes-base.respondToWebhook | Responde requisição do webhook |
| Assign Human Agent | n8n-nodes-base.httpRequest | Integra API externa ou serviço interno |
| Nota privada Chatwoot | n8n-nodes-base.httpRequest | Integra API externa ou serviço interno |
| Responder 200 - Escalado | n8n-nodes-base.respondToWebhook | Responde requisição do webhook |

## 00. Configurações IA Corretora (ID: VHF1hUQ127iqaN4J)
Status: inativo | Nós: 30

### Nós
| Nome | Tipo | Função inferida |
|------|------|-----------------|
| Gatilho | n8n-nodes-base.manualTrigger | Função não inferida pelo tipo/nome |
| Selecionar conta | @fazer-ai/n8n-nodes-chatwoot.chatwoot | Função não inferida pelo tipo/nome |
| Configurar tabelas | n8n-nodes-base.postgres | Função não inferida pelo tipo/nome |
| Etiquetas | n8n-nodes-base.set | Prepara dados para próximos nós |
| Split etiquetas | n8n-nodes-base.splitOut | Função não inferida pelo tipo/nome |
| Criar etiqueta | @fazer-ai/n8n-nodes-chatwoot.chatwoot | Função não inferida pelo tipo/nome |
| Atributos customizados | n8n-nodes-base.set | Prepara dados para próximos nós |
| Split atributos | n8n-nodes-base.splitOut | Função não inferida pelo tipo/nome |
| Criar atributo | @fazer-ai/n8n-nodes-chatwoot.chatwoot | Função não inferida pelo tipo/nome |
| Criar funil | @fazer-ai/n8n-nodes-chatwoot.chatwoot | Função não inferida pelo tipo/nome |
| Funil já criado | n8n-nodes-base.noOp | Função não inferida pelo tipo/nome |
| Etapas | n8n-nodes-base.set | Prepara dados para próximos nós |
| Split etapas | n8n-nodes-base.splitOut | Função não inferida pelo tipo/nome |
| Criar etapa | @fazer-ai/n8n-nodes-chatwoot.chatwoot | Função não inferida pelo tipo/nome |
| Perdida? | n8n-nodes-base.if | Decide rota conforme condição |
| Atualizar etapa perdida | @fazer-ai/n8n-nodes-chatwoot.chatwoot | Função não inferida pelo tipo/nome |
| Note Postgres | n8n-nodes-base.stickyNote | Função não inferida pelo tipo/nome |
| Note Etiquetas | n8n-nodes-base.stickyNote | Função não inferida pelo tipo/nome |
| Note Funil | n8n-nodes-base.stickyNote | Função não inferida pelo tipo/nome |
| Note Checklist | n8n-nodes-base.stickyNote | Função não inferida pelo tipo/nome |
| Note PDFShift | n8n-nodes-base.stickyNote | Função não inferida pelo tipo/nome |
| Validar PDFShift | n8n-nodes-base.httpRequest | Integra API externa ou serviço interno |
| Criar funil Sinistros | @fazer-ai/n8n-nodes-chatwoot.chatwoot | Função não inferida pelo tipo/nome |
| Funil Sinistros já criado | n8n-nodes-base.noOp | Função não inferida pelo tipo/nome |
| Etapas Sinistros | n8n-nodes-base.set | Prepara dados para próximos nós |
| Split etapas Sinistros | n8n-nodes-base.splitOut | Função não inferida pelo tipo/nome |
| Criar etapa Sinistros | @fazer-ai/n8n-nodes-chatwoot.chatwoot | Função não inferida pelo tipo/nome |
| Perdida Sinistros? | n8n-nodes-base.if | Decide rota conforme condição |
| Atualizar etapa perdida Sinistros | @fazer-ai/n8n-nodes-chatwoot.chatwoot | Função não inferida pelo tipo/nome |
| Note funil sinistros | n8n-nodes-base.stickyNote | Função não inferida pelo tipo/nome |

## mpalavra | GestãoPay | Carrinho Abandonado (ID: GYSGKNLROHbi3mfd)
Status: ativo | Nós: 3

### Nós
| Nome | Tipo | Função inferida |
|------|------|-----------------|
| Webhook mpalavra \| GestãoPay \| Carrinho Abandonado | n8n-nodes-base.webhook | Entrada por webhook |
| Normalizar evento mpalavra | n8n-nodes-base.code | Processa dados com código |
| Responder 200 | n8n-nodes-base.respondToWebhook | Responde requisição do webhook |

## 09. Pagamento (ID: 6tWkDvxqyUEfqJyG)
Status: inativo | Nós: 9

### Nós
| Nome | Tipo | Função inferida |
|------|------|-----------------|
| Gatilho | n8n-nodes-base.executeWorkflowTrigger | Função não inferida pelo tipo/nome |
| Gerar cobrança (mock) | n8n-nodes-base.code | Processa dados com código |
| Carregar tarefa | @fazer-ai/n8n-nodes-chatwoot.chatwoot | Função não inferida pelo tipo/nome |
| Note principal | n8n-nodes-base.stickyNote | Função não inferida pelo tipo/nome |
| Salvar pagamento na tarefa | @fazer-ai/n8n-nodes-chatwoot.chatwoot | Função não inferida pelo tipo/nome |
| Resposta ao agente | n8n-nodes-base.set | Prepara dados para próximos nós |
| Sticky Note12 | n8n-nodes-base.stickyNote | Função não inferida pelo tipo/nome |
| Sticky Note13 | n8n-nodes-base.stickyNote | Função não inferida pelo tipo/nome |
| Sticky Note36 | n8n-nodes-base.stickyNote | Função não inferida pelo tipo/nome |

EXPLORAÇÃO CONCLUÍDA — nenhum arquivo modificado além do relatório.
