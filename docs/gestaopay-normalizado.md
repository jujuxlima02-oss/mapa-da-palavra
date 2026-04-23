# GestãoPay — Referência Técnica Normalizada

> **Versão**: 2.0  
> **Data**: 2026-04-23  
> **Escopo**: Integração PIX usada por este projeto  
> **Fonte canônica interna**: este arquivo

## 1. Objetivo

Consolidar em PT-BR o comportamento realmente observado da GestãoPay no projeto `Mapa da Palavra`, sem depender da documentação bruta do provedor.

## 2. Arquivos de apoio

- Fixture de criação: `scripts/gestaopay-response.json`
- Fixture de consulta: `scripts/gestaopay-get-response.json`
- Script de descoberta: `scripts/test-gestaopay-pix.js`
- Referência bruta legado: `Documentação Atualizada GestãoPay.md`

> Os arquivos de fixture preservam nomes legados usados no teste original, como `Teste - Diário Bíblico`. Eles são históricos e não definem o naming atual do produto.

## 3. Autenticação

- Tipo: `Basic Auth`
- Formato: `Authorization: Basic Base64(PUBLIC_KEY:SECRET_KEY)`

## 4. Endpoints usados

| Método | Endpoint | Uso |
| --- | --- | --- |
| `POST` | `/v1/payment-transaction/create` | Criação do PIX |
| `GET` | `/v1/payment-transaction/info/{id}` | Double-check e consulta |

Base URL padrão:

```text
https://api.gestaopayments.com
```

## 5. Payload enviado pelo projeto

```json
{
  "amount": 3990,
  "payment_method": "pix",
  "postback_url": "https://seu-dominio/api/webhooks/gestaopay",
  "customer": {
    "name": "Maria Silva",
    "email": "maria@email.com",
    "phone": "11999998888",
    "document": {
      "number": "12345678901",
      "type": "cpf"
    }
  },
  "items": [
    {
      "title": "Mapa da Palavra",
      "unit_price": 3990,
      "quantity": 1,
      "tangible": true,
      "external_ref": "order-id"
    }
  ],
  "pix": {
    "expires_in_days": 1
  },
  "metadata": {
    "provider_name": "Saints Label",
    "offer_source": "evergreen",
    "order_id": "order-id"
  }
}
```

## 6. Fatos confirmados na API

1. A criação bem-sucedida retorna `201`, não apenas `200`
2. O envelope da resposta inclui `data`, `success`, `return_message_type`, `error_messages` e `inner_exception`
3. `data.pix.qr_code` é o copia e cola EMV
4. `data.pix.url` vem `null`
5. `data.pix.expiration_date` retorna `0001-01-01T00:00:00`
6. O frontend precisa gerar o QR Code a partir da string do EMV

## 7. Inconsistências já observadas

| Tema | Comportamento |
| --- | --- |
| Unidade monetária | `POST amount` em centavos; `GET amount` e webhook em reais |
| Convenção de chaves | API usa `snake_case`; webhook usa `PascalCase` |
| Datas | Parte da API usa `dd/MM/yyyy HH:mm:ss`; parte usa ISO |
| Expiração | A API não entrega uma expiração útil; o projeto calcula localmente |

## 8. Webhook

Campos relevantes confirmados:

```json
{
  "Id": "gateway-id",
  "Status": "PENDING",
  "Amount": 100,
  "PaidAt": "0001-01-01T00:00:00"
}
```

Tratamento recomendado e já aplicado no projeto:

1. Fazer parse seguro do JSON
2. Normalizar `PascalCase`
3. Buscar o pedido por `gatewayId`
4. Ignorar pedidos já finalizados
5. Confirmar o status via `GET /info/{id}`
6. Só então atualizar o pedido
7. Sempre retornar `200`

## 9. Status usados pelo projeto

- `PENDING`
- `PAID`
- `EXPIRED`
- `ERROR`

O projeto converte `REFUSED` para `ERROR` no fluxo interno.

## 10. Implicações para implementação

- Não esperar imagem pronta do QR Code
- Não confiar na expiração retornada pela API
- Não comparar valores do webhook diretamente com centavos sem normalização
- Não confiar apenas no webhook; usar double-check

## 11. Lacunas ainda abertas

- A GestãoPay não documenta assinatura de webhook neste material
- O formato exato de alguns erros `400` ainda não foi explorado além do envelope
- Não existe sandbox documentado nas evidências locais; os testes históricos foram feitos com credenciais `live`
