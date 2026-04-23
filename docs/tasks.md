# Histórico Técnico do MVP — Mapa da Palavra

> **Última atualização**: 2026-04-23  
> **Objetivo**: Registrar o que já foi implementado no MVP, sem competir com o backlog ativo em `TASKS.md`.

## Status geral

O MVP funcional já existe e cobre o funil principal de venda: landing page, checkout, geração de PIX, polling, webhook e confirmação.

## Entregas concluídas

### Fundação técnica

- Projeto criado em Next.js com App Router
- Tailwind CSS `4` configurado
- Prisma `7.7.0` configurado com PostgreSQL
- Schema `Order` modelado e migrado

### Integração de pagamento

- Payload da GestãoPay descoberto e normalizado
- Client da GestãoPay implementado em `src/lib/gestaopay.ts`
- API de checkout implementada
- Webhook com double-check implementado
- Polling de status implementado

### Frontend do funil

- Landing evergreen
- Landing de Dia das Mães
- Checkout com formulário e endereço completo
- Tela PIX com QR Code e copia e cola
- Página de confirmação

### Tracking e suporte operacional

- Script do GA4 carregado no layout
- Eventos principais do funil disparados
- Redirect sazonal via `src/proxy.ts`
- Busca de CEP via ViaCEP

## Débitos e próximos passos técnicos

1. Unificar o naming público no código e na copy
2. Substituir placeholders de imagem por assets reais do produto
3. Implementar ou remover promessas não sustentadas, como Colar Coração de Jesus e prazo de entrega
4. Criar páginas institucionais reais para links já expostos na UI
5. Validar o funil completo em ambiente semelhante ao de produção

## 2026-04-23 — Melhorias de UX e CRO (Blocos 1, 2 e 3)
### O que foi feito
- Bloco 1: frete passou a ter configuração central, seleção inline no checkout e total dinâmico por modalidade.
- Bloco 2: checkout recebeu imagens com dimensões explícitas, microcopy de CPF e botão com estado de loading.
- Bloco 3: estado virou combobox com busca, o brinde ganhou thumbnail no resumo e o histórico técnico foi atualizado.
### Arquivos alterados
- `src/lib/constants.ts`
- `src/components/checkout/CheckoutClient.tsx`
- `src/components/checkout/CheckoutForm.tsx`
- `src/components/checkout/OrderSummary.tsx`
- `src/components/checkout/PixPayment.tsx`
- `src/components/checkout/Confirmation.tsx`
- `src/components/checkout/ShippingModal.tsx`
- `src/app/checkout/page.tsx`
- `src/app/dia-das-maes/page.tsx`
- `src/components/landing/Hero.tsx`
- `src/components/landing/Benefits.tsx`
- `src/components/landing/HowItWorks.tsx`
- `src/components/landing/SocialProof.tsx`
- `src/components/landing/Pricing.tsx`
- `src/components/landing/BuyNotification.tsx`
- `docs/tasks.md`
### Pendências manuais
- #1 WhatsApp: substituir placeholder pelo número real
- #6 Depoimentos: adicionar mínimo 3 com nome + cidade reais

## Relação com outros documentos

- `TASKS.md`: backlog ativo de produto, copy, UX e alinhamento
- `docs/requirements.md`: escopo atual do sistema
- `docs/design.md`: arquitetura implementada
- `docs/gestaopay-normalizado.md`: referência técnica do gateway
