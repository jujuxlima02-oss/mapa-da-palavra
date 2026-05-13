<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Arquitetura Operacional

Ultima atualizacao: 2026-05-06

### VPS e Proxy

- Provedor: DigitalOcean
- Sistema operacional: Ubuntu 24.04.4 LTS
- Proxy reverso: Nginx instalado no host
- TLS: Certbot/Let's Encrypt
- Diretorio de deploy: `/opt/diario-atendimento`
- Orquestracao: Docker Compose nativo (`docker compose`)
- Servicos existentes preservados: site principal em `wvke.site` e containers Guacamole

### Atendimento e Automacao

- Chatwoot: fork fazer.ai via imagem `ghcr.io/fazer-ai/chatwoot:latest`
- Chatwoot URL publica: `https://${CHATWOOT_DOMAIN}`
- Chatwoot upstream interno: `127.0.0.1:3002`
- Chatwoot banco interno: PostgreSQL/pgvector 16 em container dedicado
- Chatwoot cache/fila: Redis em container dedicado
- Baileys API: imagem `ghcr.io/fazer-ai/baileys-api:latest`, rede interna Docker, upstream `http://baileys_api:3025`
- Baileys API usa o Redis do Chatwoot para sessoes e chaves de API
- n8n: imagem `n8nio/n8n:latest`
- n8n URL publica: `https://${N8N_DOMAIN}`
- n8n upstream interno: `127.0.0.1:5678`
- n8n banco interno: PostgreSQL 16 em container dedicado
- n8n listeners GestãoPay/mpalavra:
  - `https://${N8N_DOMAIN}/webhook/mpalavra/gestaopay/carrinho-abandonado`
  - `https://${N8N_DOMAIN}/webhook/mpalavra/gestaopay/pagamento-aprovado`
  - `https://${N8N_DOMAIN}/webhook/mpalavra/gestaopay/pagamento-recusado`
- n8n agente conversacional:
  - Workflow `mpalavra | Agente WhatsApp Principal`
  - Webhook `https://${N8N_DOMAIN}/webhook/mpalavra/whatsapp/mensagem-recebida`
  - Modelo OpenAI `gpt-4o-mini` via credencial n8n, usando `${OPENAI_API_KEY}`
- Chatwoot API interna: `${CHATWOOT_INTERNAL_URL}`
- Inbox WhatsApp mpalavra: ID `1`, provider Baileys, telefone via `${WHATSAPP_PHONE_NUMBER}`
- Webhook Chatwoot para n8n: evento `message_created`, inbox ID `1`
- Kanban Pro fazer.ai nao habilitado; substituto operacional: Labels + Custom Views nativas do Chatwoot

### Agente Conversacional mpalavra

- Identidade: assistente virtual da mpalavra
- Personalidade: simpatica, objetiva, consultiva, em portugues brasileiro
- Regras: nao inventa precos ou informacoes sem fonte; se nao souber, informa que vai verificar e transferir para especialista
- Escalonamento planejado: reclamacao, reembolso, cancelar, problema, errado, nao recebi, charge back, furto, urgente
- Estagios aplicados por label: `frio`, `aquecendo`, `interessado`
- Workflow principal n8n: ID `XeA5zPHk9Shc8oLg`, ativo

### Funis Simulados no Chatwoot

- Funil Carrinho: labels `carrinho-abandonado`, `1-contato`, `respondeu`, `convertido`, `ignorado`
- Funil Suporte: labels `suporte-aberto`, `em-andamento`, `aguardando`, `resolvido`
- Funil Vendas: labels `novo-lead`, `qualificando`, `proposta`, `fechado`, `perdido`
- Views nativas: uma Custom View por label, com filtro `labels equal_to <label>`
- Custom Attributes de conversa: `status_do_carrinho`, `valor_acumulado`, `cupom_enviado`, `data_ultimo_contato`

## Variaveis de Ambiente

Sem valores reais no repositorio.

- `VPS_HOST`
- `VPS_SSH_USER`
- `VPS_SSH_PORT`
- `VPS_SSH_KEY_PATH`
- `CHATWOOT_DOMAIN`
- `N8N_DOMAIN`
- `SSL_EMAIL`
- `CHATWOOT_FRONTEND_URL`
- `CHATWOOT_POSTGRES_DB`
- `CHATWOOT_POSTGRES_USER`
- `CHATWOOT_POSTGRES_PASSWORD`
- `CHATWOOT_REDIS_PASSWORD`
- `CHATWOOT_SECRET_KEY_BASE`
- `N8N_EDITOR_BASE_URL`
- `N8N_WEBHOOK_URL`
- `N8N_POSTGRES_DB`
- `N8N_POSTGRES_USER`
- `N8N_POSTGRES_PASSWORD`
- `N8N_ENCRYPTION_KEY`
- `DEFAULT_LOCALE`
- `MAILER_SENDER_EMAIL`
- `CHATWOOT_API_ACCESS_TOKEN`
- `CHATWOOT_ACCOUNT_ID`
- `CHATWOOT_INTERNAL_URL`
- `BAILEYS_PROVIDER_DEFAULT_URL`
- `BAILEYS_PROVIDER_DEFAULT_API_KEY`
- `BAILEYS_PROVIDER_DEFAULT_CLIENT_NAME`
- `BAILEYS_PROVIDER_USE_INTERNAL_HOST_URL`
- `BAILEYS_WHATSAPP_GROUPS_ENABLED`
- `BAILEYS_LOG_LEVEL`
- `WHATSAPP_PHONE_NUMBER`
- `GESTAOPAY_PUBLIC_KEY`
- `GESTAOPAY_SECRET_KEY`
- `GESTAOPAY_API_URL`
- `GESTAOPAY_POSTBACK_URL`
- `N8N_PUBLIC_API_KEY`
- `OPENAI_API_KEY`

## Status das Fases

- Fase 1 - Infraestrutura: ✅ Concluida
- Fase 2 - Kanban: ✅ Concluida
- Fase 3 - Gateway: ✅ Concluida
- Workflow 1 - Agente WhatsApp Principal: ✅ Concluido
- Workflow 2 - Escalar Humano: ✅ Concluído (ID: FCkO2jZNaCLhzRSh)
- Workflow 3 - Follow-up: ⬜ Pendente
- Fase 4 - MCP Server: ⬜ Pendente
- Fase 5 - Automacao: ⬜ Pendente
- ADR-001 SDD + Harness Engineering: ACEITO (docs/specs/adr-001-sdd-harness-engineering.md)

## Pipeline Comercial

Meta Ads -> Landing Page (Next.js) -> WhatsApp (Baileys) ->
Chatwoot -> n8n -> Planka -> GestãoPay (postback) -> GTM -> Meta Ads conversions

## Stack de Serviços

- Chatwoot (fazer.ai) — CRM de conversas WhatsApp
- Baileys API — gateway WhatsApp
- n8n — orquestração de workflows
- Planka — kanban de leads
- GestãoPay — gateway de pagamento
- Google GTM + Meta Ads Pixel — rastreamento e conversões

## Status das Fases

- Fase 1 - Infraestrutura: CONCLUIDA
- Fase 2 - Kanban: CONCLUIDA
- Fase 3 - Gateway: CONCLUIDA
- Workflow 1 - Agente WhatsApp Principal: CONCLUIDO (ID: XeA5zPHk9Shc8oLg)
- Workflow 2 - Escalar Humano: CONCLUÍDO (ID: FCkO2jZNaCLhzRSh)
- Workflow 3 - Follow-up: PENDENTE
- Fase 4 - MCP Server: PENDENTE
- Fase 5 - Automacao: PENDENTE
- ADR-001 SDD + Harness Engineering: ACEITO (docs/specs/adr-001-sdd-harness-engineering.md)

## Convenções Obrigatórias para Todos os Agentes

- Escreva sempre em PT-BR
- Nunca modifique arquivos de workflow do n8n diretamente — use a API REST
- n8n nesta VPS não aceita PATCH em workflows — usar PUT com payload completo sanitizado
- Nunca exponha credenciais em logs ou outputs
- Toda spec nova vai em docs/specs/ antes de qualquer implementação
- Todo artefato de task vai em docs/tasks/
- Labels Chatwoot: frio, aquecendo, interessado, comprou, humano-necessario
- Webhook ativo: https://n8n.wvke.site/webhook/mpalavra/whatsapp/mensagem-recebida

## Agente de Atendimento WhatsApp

Persona: Atendente Elias — Guardião do Mapa da Palavra
System prompt: .codex/agents/personas/atendente-diario-biblico.md
Modelo no n8n: gpt-4o-mini
Labels que aplica: frio | aquecendo | interessado | comprou | humano-necessario
Escala para humano quando:
- Lead pede falar com pessoa
- Raiva ou frustração detectada
- Pergunta técnica nao resolvida em 2 tentativas
- Lead disse que vai comprar mas nao comprou apos 24h

## Workflow: Módulo PIX — Pagamento e Entrega de Acesso

Este módulo implementa o fluxo completo de pagamento via PIX integrado ao workflow principal do agente de atendimento.

### Stack e contexto
- Orquestrador: GPT-5.5 (Kaligos)
- Sub-agents: gpt-5.4-mini com reasoning_effort: low
- NUNCA instanciar sub-agent em gpt-5.5 salvo instrução explícita no TOML do agente
- Idioma de output: PT-BR obrigatório

### Fluxo esperado do módulo PIX
1. Gatilho de intenção de compra detectado pelo orquestrador
2. Geração e envio da mensagem com chave/QR Code PIX
3. Polling ou webhook de confirmação de pagamento
4. Entrega automática do acesso ao comprador

### Regras de negócio
- O acesso SÓ deve ser entregue após confirmação real do pagamento (não simular)
- Em caso de timeout sem pagamento, enviar mensagem de follow-up (1x apenas)
- Logar cada etapa no arquivo de progresso progress.md

## Subagentes Disponíveis

Agentes em .codex/agents/ (projeto) e ~/.codex/agents/ (global).
Consulte os arquivos .toml para comportamento detalhado de cada agente.

| Agente                    | Sandbox         | Função principal                        |
|---------------------------|-----------------|------------------------------------------|
| kaligos (global)          | read-only        | Orquestrador — planeja e delega         |
| arquiteto-senior          | workspace-write  | Projeta TOMLs, configs, specs SDD       |
| n8n-worker                | workspace-write  | Implementa workflows n8n via API REST   |
| frontend-worker           | workspace-write  | Landing page, checkout, GTM, Meta Ads   |
| explorer                  | read-only        | Mapeia codebase, audita estado          |
| pastor-ia-voz-profetica   | workspace-write  | Copy devocional e system prompts WA     |
| qa-agent                  | read-only        | Checklist pós-implementação             |
| reviewer                  | read-only        | Aprovação final antes de merge          |
