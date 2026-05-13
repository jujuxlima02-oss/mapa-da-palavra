# Backlog

## 🔴 CRÍTICO

- [ ] **[WF03-001]** Aplicar RPI PIX — Separar Tool síncrona do Wait bloqueante
- Workflow: `ebbDSb9Z955Udl49`
- O que fazer: GET estado atual → PATCH nós → validar com GET após PATCH
- Motivo da pendência: Codex simulou sucesso sem executar PATCH real
- Próxima sessão: Forçar verificação GET/PATCH com confirmação nó a nó

## 🟡 IMPORTANTE

- [ ] **[WF03-002]** Executar Testes de Aceitação do RPI
- pix_followup_count inexistente → deve virar 1
- pix_followup_count = 1 → deve virar 2, voltar ao Wait
- pix_followup_count = 2 → deve cancelar, marcar EXPIRED, resolver conversa
- pix_status = PAID → não deve enviar follow-up

- [ ] **[WF03-003]** Confirmar webhook assíncrono ativo
- Path: `mpalavra/pix/followup-assincrono`
- Verificar se está respondendo e acionando o ciclo de follow-up

- [ ] **[WF03-004]** Validar `Set — Retornar dados para Tool`
- Workflow: `ebbDSb9Z955Udl49`
- Confirmar que não há `Include Other Input Fields`.
- Confirmar retorno plano com somente `status`, `pix_qr_code`, `pix_copia_e_cola`, `valor`.

- [ ] **[WF03-005]** Confirmar persistência em `custom_attributes` da conversa
- Campos: `pix_status`, `status_pagamento`, `pix_followup_count`, `pix_followup_last_action`, `transaction_id`, `gateway_id`, `pix_qr_code`, `pix_copia_e_cola`.
- Motivo: evitar vazamento de estado entre compras diferentes do mesmo contato.

- [ ] **[WF03-006]** Validar entrega de acesso somente após `PAID`
- Workflow: `ebbDSb9Z955Udl49`
- Fazer double-check GestãoPay antes de enviar acesso.
- Não aceitar mensagem do lead como prova de pagamento.

- [ ] **[WF03-007]** Resolver divergência documental sobre RPI
- `progress.md` registra RPI aplicado em 2026-05-11.
- A instrução operacional atual declara que o PATCH real não foi aplicado.
- Próxima sessão deve produzir evidência GET antes/depois e atualizar esta pasta.

- [ ] **[WF04-001]** Corrigir contador persistente do follow-up de silêncio
- Workflow: `mVo6oZMEERqNmhwI`
- Origem: QA reprovou contador baseado em nota privada sem leitura robusta.
- Fazer contador durável antes de considerar o ciclo aprovado.

- [ ] **[WF04-002]** Garantir fechamento após 2 follow-ups de silêncio
- Workflow: `mVo6oZMEERqNmhwI`
- Após 2 follow-ups sem resposta, aplicar `frio` e encerrar ciclo com estado persistido.

- [ ] **[WF01-001]** Revalidar webhook Chatwoot autenticado
- Workflow: agente principal.
- QA de 2026-05-09 reprovou evidência de token/secret específico no trigger Chatwoot.

- [ ] **[WF01-002]** Revalidar labels esperadas no agente principal
- Labels obrigatórias: `frio`, `aquecendo`, `interessado`, `comprou`, `humano-necessario`.
- QA de 2026-05-09 não encontrou todas no GET auditado.

- [ ] **[OPS-001]** Confirmar fonte real de entrega do acesso
- Variável/spec: `MPALAVRA_ACCESS_URL` ou fonte segura equivalente.
- Necessário antes de validar entrega automática de acesso.

- [ ] **[OPS-002]** Confirmar se CPF/e-mail serão coletados antes do PIX
- Spec PIX exige dados mínimos antes de chamar GestãoPay.
- Fluxo do agente deve evitar criar cobrança sem dados mínimos.

## 🟢 BAIXA PRIORIDADE

- [ ] **[DOC-001]** Atualizar specs antigas após a correção real do RPI
- Arquivos de origem: `docs/specs/workflow-modulo-pix.md`, `docs/tasks/pix-module.md`.

- [ ] **[DOC-002]** Decidir nomenclatura final dos workflows
- Há coexistência de IDs/nome antigos (`XeA5zPHk9Shc8oLg`) e novos (`bkVfT1QcpWGokG69`).
