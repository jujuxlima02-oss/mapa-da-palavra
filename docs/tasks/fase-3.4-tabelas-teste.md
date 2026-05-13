# Fase 3.4 - Tabelas e Teste
Data: 2026-05-07
Status: AJUSTE APLICADO

## Correcao aplicada
- Workflow: XeA5zPHk9Shc8oLg
- Nó IF: Agente ja terminou de responder?
- TRUE -> Verificar status atendimento
- FALSE -> Esperar fila

## Evidencia GET final
```text
active: True
nodeCount: 44
TRUE  -> [{'node': 'Verificar status atendimento', 'type': 'main', 'index': 0}]
FALSE -> [{'node': 'Esperar fila', 'type': 'main', 'index': 0}]
settings: {'executionOrder': 'v1', 'binaryMode': 'separate'}
```

## Licao arquitetural - fila n8n
Em workflows n8n com fila de mensagens, o padrao de concorrencia e:

```text
Wait -> IF "lock livre?"
         TRUE  -> Lock -> Agente -> Unlock
         FALSE -> Wait <- loop
```

Nos IF que verificam locks/status sempre devem ter a saida FALSE reconectando ao Wait anterior, nunca terminando em ponta solta.

## Licao operacional - PUT n8n
O GET de workflow retorna campos extras que o PUT rejeita. Nunca usar GET bruto como payload de PUT.

Campos proibidos no payload PUT:
- shared
- tags
- active
- id
- versionId
- meta
- updatedAt
- createdAt
- activeVersion

Campos permitidos no topo:
- name
- nodes
- connections
- settings
- staticData
- pinData

Settings permitido no PUT:

```json
{"executionOrder": "v1"}
```

Observacao: apos PUT/activate, o GET pode voltar com `binaryMode` adicionado pelo n8n. Para PUT, sanitizar novamente para manter apenas `executionOrder`.
