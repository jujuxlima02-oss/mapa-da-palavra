# Mapa da Palavra

Aplicação Next.js 16 para vender o produto físico `Mapa da Palavra`, um guia visual dos 66 livros da Bíblia, por meio de duas landing pages, checkout com PIX via GestãoPay e persistência de pedidos em PostgreSQL com Prisma.

## Nome do produto

- Nome principal: `Mapa da Palavra`
- Descritor padronizado: `Guia Visual dos 66 Livros da Bíblia`
- Termo legado encontrado no repositório: `Diário Bíblico`

## Estado atual

- Landing evergreen em `/`
- Landing sazonal em `/dia-das-maes`
- Checkout com coleta de endereço completo
- Busca de CEP via ViaCEP no checkout
- Geração de PIX via GestãoPay
- Webhook + polling para atualização de status
- Página de confirmação de pedido
- Tracking com Google Analytics 4
- Prova social dinâmica local controlada por feature flag

## Stack atual

| Camada | Tecnologia |
| --- | --- |
| Frontend | Next.js `16.2.3`, React `19.2.4`, Tailwind CSS `4` |
| Backend | Route Handlers do App Router |
| Banco | PostgreSQL com Prisma `7.7.0` |
| Gateway | GestãoPay |
| Analytics | Google Analytics 4 |
| Infra | Projeto preparado para Vercel |

## Rodando localmente

1. Instale as dependências com `npm install`
2. Crie o arquivo `.env.local` a partir de `.env.example`
3. Preencha as variáveis obrigatórias
4. Rode `npm run dev`
5. Acesse `http://localhost:3000`

## Variáveis de ambiente

| Variável | Uso |
| --- | --- |
| `DATABASE_URL` | Conexão PostgreSQL |
| `GESTAOPAY_PUBLIC_KEY` | Chave pública da GestãoPay |
| `GESTAOPAY_SECRET_KEY` | Chave secreta da GestãoPay |
| `GESTAOPAY_API_URL` | Base URL da API GestãoPay |
| `BASE_URL` | URL base server-side para webhook e links absolutos |
| `NEXT_PUBLIC_BASE_URL` | URL pública do app |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | ID do GA4 |
| `NEXT_PUBLIC_PRODUCT_PRICE_CENTS` | Preço do produto em centavos |
| `NEXT_PUBLIC_PRODUCT_NAME` | Nome exibido atualmente no código |
| `SEASONAL_CAMPAIGN_END_DATE` | Data-limite da rota sazonal |

## Scripts

| Script | Descrição |
| --- | --- |
| `npm run dev` | Sobe o ambiente local |
| `npm run build` | Gera o build de produção |
| `npm run start` | Inicia o build gerado |
| `npm run lint` | Executa o ESLint |

## Rotas principais

| Rota | Finalidade |
| --- | --- |
| `/` | Landing evergreen |
| `/dia-das-maes` | Landing sazonal |
| `/checkout?offer=...` | Checkout |
| `/checkout/pix/[orderId]` | Pagamento PIX |
| `/checkout/confirmacao/[orderId]` | Confirmação |
| `POST /api/checkout` | Criação do pedido e do PIX |
| `GET /api/order/[orderId]` | Polling de status |
| `POST /api/webhooks/gestaopay` | Webhook da GestãoPay |

## Documentação principal

- `README.md`: visão geral do projeto
- `docs/ai-context.md`: contexto rápido para agentes
- `docs/requirements.md`: escopo e regras atuais do produto
- `docs/design.md`: arquitetura técnica implementada
- `docs/gestaopay-normalizado.md`: fonte técnica canônica da GestãoPay
- `docs/copy-landing-pages.md`: inventário da copy atualmente implementada
- `docs/tasks.md`: histórico técnico do MVP
- `TASKS.md`: backlog ativo de conteúdo, UX e alinhamento

## Gaps conhecidos

- O naming ainda está misto no código entre `Mapa da Palavra` e `Diário Bíblico - Mapa da Palavra`
- A copy implementada nas landing pages diverge do plano estratégico mais recente
- O hero ainda usa placeholder visual, não fotos reais do produto
- A FAQ ainda contém placeholders de prazo de entrega
- A landing de Dia das Mães promete bônus digital, mas o fluxo transacional implementado só materializa o brinde físico
- Existem links institucionais ainda não implementados no app, como `/termos`, `/privacidade`, `/garantia` e `/politica-de-garantia`
