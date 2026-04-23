# Referência Bruta — GestãoPay

> **Status**: material auxiliar legado  
> **Uso recomendado**: leitura secundária

## Papel deste arquivo

Este arquivo preserva um recorte bruto da documentação/copilação original da GestãoPay que apareceu durante a implementação do projeto. Ele não é a fonte canônica interna.

## Fonte canônica atual

Use estes arquivos como verdade operacional:

- `docs/gestaopay-normalizado.md`
- `scripts/gestaopay-response.json`
- `scripts/gestaopay-get-response.json`
- `scripts/test-gestaopay-pix.js`

## Resumo bruto do que este material cobre

- Autenticação via Basic Auth
- Formato geral do webhook
- Endpoint de criação de transação
- Lista de status documentados pelo provedor

## Limitações

- O conteúdo original mistura texto promocional e referência técnica
- Não explica todas as inconsistências observadas na prática
- Não registra com clareza as diferenças entre centavos, reais e formatos de data

## Regra de manutenção

Se houver divergência entre este arquivo e `docs/gestaopay-normalizado.md`, prevalece sempre o documento normalizado.
