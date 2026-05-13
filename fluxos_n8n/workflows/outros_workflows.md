# Outros workflows identificados

## Agente principal WhatsApp

### `bkVfT1QcpWGokG69` — `01. Agente WhatsApp Principal`

- Status em memória/progresso recente: ativo.
- Propósito: agente principal com tools conectadas ao nó `Agente WhatsApp`.
- Tools validadas anteriormente: `buscar_referencia_copy`, `processar_pagamento_pix`, `escalar_para_humano`, `salvar_dados_cliente`, além de ferramentas internas.
- RAG: `buscar_referencia_copy` aponta para `8Yz1wHDlbz63U0Gp`.

### `XeA5zPHk9Shc8oLg` — `mpalavra | Agente WhatsApp Principal`

- Status em documentação anterior: ativo.
- Node count documentado em fases anteriores: 16 e depois 44, conforme evolução.
- Usado como referência histórica do Workflow 1.

## Escalonamento humano

### `FCkO2jZNaCLhzRSh` — `mpalavra | Escalar Humano`

- Status: concluído/ativo.
- Propósito: atribuir conversa a humano, adicionar label/nota privada e impedir resposta automática quando houver humano ativo.
- Validado em `docs/tasks/fase-3.2-escalar-humano.md` e `qa-report-2026-05-07-workflow2-v2.md`.

## GestãoPay

### `GYSGKNLROHbi3mfd` — `mpalavra | GestãoPay | Carrinho Abandonado`

- Status: ativo.
- Nós: webhook, normalização do evento e resposta 200.

### `07wwphbyPCtIkUuD` — `mpalavra | GestãoPay | Pagamento Aprovado`

- Status: ativo.
- Nós: webhook, normalização do evento e resposta 200.

### `zLylTDH2naG1v1wf` — `mpalavra | GestãoPay | Pagamento Recusado`

- Status: ativo.
- Nós: webhook, normalização do evento e resposta 200.

## Workflows de referência/legado da corretora

Inventário em `docs/tasks/workflows-originais-corretora.md`:

- `tgCgMzuoNOxWUVad` — `08. Follow-ups`, inativo.
- `naZDSFrra03RzVCK` — `06. Cancelar Apólice`, inativo.
- `zHlL4Iz8i87wux1n` — `10. Abrir Sinistro`, inativo.
- `h7DMGGJeiLwbSRUn` — `07. Escalar Humano`, inativo.
- `9dYRRXONhT3GSp2v` — `03. Enviar Proposta`, inativo.
- `pJ7fQGl9gUyS67go` — `02.1 Cotar Vida`, inativo.
- `fvKzC3qD2xvpmtOL` — `04. Buscar Apólices`, inativo.
- `V0CWuRBEg2TRc6Sl` — `99. Mock Seguradora`, inativo.
- `Qdhuk2mbP5G0mBFq` — `07. Escalar Humano`, inativo.
- `KnMhlJh3t6Tm8DHr` — `02.2 Cotar Auto`, inativo.
- `EHNmSe83nGcsviRt` — `05. Emitir Apólice`, inativo.
- `ykQ3VaEtn56HUduK` — `01. Agente Corretor`, inativo.
- `VHF1hUQ127iqaN4J` — `00. Configurações IA Corretora`, inativo.
- `6tWkDvxqyUEfqJyG` — `09. Pagamento`, inativo.
