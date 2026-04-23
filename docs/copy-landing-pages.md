# Inventário de Copy Implementada — Mapa da Palavra

> **Última atualização**: 2026-04-23  
> **Objetivo**: Documentar a copy que está realmente em produção no código hoje.  
> **Importante**: Este arquivo não descreve a copy alvo ideal; ele registra o estado atual implementado.

## 1. Naming

- Nome canônico do produto: `Mapa da Palavra`
- Descritor recomendado: `Guia Visual dos 66 Livros da Bíblia`
- Nome ainda exibido em várias partes da UI: `Diário Bíblico - Mapa da Palavra`

## 2. Landing evergreen (`/`)

### Tom atual

- Pastoral
- Forte apelo devocional
- Linguagem de pacto, direção e recomeço

### CTA dominante atual

`Quero firmar meu pacto`

### Mensagens centrais implementadas

- Barra: chama o visitante a separar "tempo santo"
- Hero: posiciona o produto como convite para parar de ler "no improviso"
- Prova social: usa número alto e tom testemunhal
- Problema: reforça culpa leve, dispersão e falta de direção
- Benefícios: vende constância espiritual, não apenas clareza estrutural

## 3. Landing Dia das Mães (`/dia-das-maes`)

### Tom atual

- Emocional
- Religioso
- Presente com significado espiritual
- Brinde físico oficial: `Colar Coração de Jesus`

### CTA dominante atual

`Quero garantir esse presente para minha mãe`

### Mensagens centrais implementadas

- Barra: urgência por data
- Hero: presente como convite diário ao encontro com Deus
- Prova social: frases curtas sobre presentear
- Dor: rejeita presentes "mais do mesmo"
- Diferencial: valor simbólico acima do embrulho
- Brinde: a landing destaca o `Colar Coração de Jesus` como presente incluído na oferta de Dia das Mães

### Inventário oficial do brinde

- Nome do produto: `Colar Coração de Jesus`
- Headline: `Um símbolo de amor que toca o coração`
- Descrição curta: Colar físico em formato de coração com a palavra `Jesus`, pensado como presente de alto valor percebido para mães cristãs
- Bullets de valor:
  - Expressa fé de forma bonita e discreta
  - Acrescenta significado espiritual ao presente principal
  - Fica exclusivo da oferta de Dia das Mães
- CTA sugerido: `Quero receber meu Colar Coração de Jesus`

## 4. Copy transacional implementada

### Checkout

- Título visual: `DIÁRIO BÍBLICO`
- CTA final: `Pagar agora`
- Selo de segurança: `Pagamento seguro`
- Resumo do pedido: fala em "Seu Diário para separar tempo com Deus"
- Cupom: existe apenas como UI

### PIX

- Headline: `Seu PIX está pronto`
- Apoio: aprovação costuma acontecer em instantes
- CTA de cópia: `Copiar Código`
- Fluxo de expiração: `PIX expirado` + `Gerar novo PIX`

### Confirmação

- Headline: `Pagamento confirmado`
- Tom: acolhedor
- Brinde exibido: somente o brinde físico

## 5. Divergências importantes

1. A copy implementada não segue integralmente o plano estratégico mais recente
2. O naming ainda mistura `Mapa da Palavra` com `Diário Bíblico - Mapa da Palavra`
3. A landing sazonal agora destaca o `Colar Coração de Jesus` como brinde físico, alinhado ao fluxo transacional
4. A FAQ evergreen ainda usa placeholder de prazo de entrega
5. O hero ainda não mostra o produto real

## 6. Arquivos do código mais afetados pela copy

- `src/app/page.tsx`
- `src/app/dia-das-maes/page.tsx`
- `src/app/checkout/page.tsx`
- `src/components/checkout/CheckoutForm.tsx`
- `src/components/checkout/OrderSummary.tsx`
- `src/components/checkout/PixPayment.tsx`
- `src/components/checkout/Confirmation.tsx`
- `src/lib/constants.ts`

## 7. Como usar este documento

- Use este arquivo para entender a copy atual do app
- Use o plano estratégico para orientar reescritas futuras
- Não trate este arquivo como aprovação criativa final
