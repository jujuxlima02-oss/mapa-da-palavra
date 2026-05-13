# 🧠 Engenharia de Prompt — Guia Completo

> [!quote] Meta-Lição
> *"Se você não consegue explicar claramente, não consegue dar o prompt."* — Daniel Miessler
> A qualidade da resposta de uma IA depende **diretamente** da qualidade do prompt que você escreve.

---

## 📌 Tags
#engenharia-de-prompt #ia #produtividade #chatgpt #claude #gemini

---

## 🗺️ Mapa do Guia

- [[#Nível 1 — Fundamentos Os 4 Pilares]]
- [[#Nível 2 — Intermediário Técnicas de Controle]]
- [[#Nível 3 — Avançado Técnicas Profissionais]]
- [[#✅ Checklist Antes de Enviar Qualquer Prompt]]
- [[#📋 Template Universal]]
- [[#🛠️ Templates Prontos por Caso de Uso]]
- [[#💡 Dicas por Modelo de IA]]
- [[#🚫 Os 5 Erros Mais Comuns]]

---

## Nível 1 — Fundamentos: Os 4 Pilares

> [!tip] Regra de Ouro
> Se você consegue interpretar seu próprio prompt de mais de uma forma, a IA também consegue — e pode escolher a interpretação **errada**.

Todo prompt eficaz tem 4 elementos. Quando um resultado é ruim, geralmente é porque um deles está faltando.

---

### 1️⃣ Clareza — O quê?

Seja específico. A IA não lê sua mente: ela só trabalha com o que você escreve.

| ❌ Vago | ✅ Claro |
|---|---|
| Escreve um texto sobre produtividade | Escreve um post de LinkedIn sobre produtividade para profissionais de RH, com 3 dicas práticas, em tom informal |
| Me ajuda com isso | Me ajuda a revisar esse email de proposta comercial para um cliente enterprise |
| Faz um código | Cria uma função em Python que recebe uma lista de números e retorna a média |
| Dá umas ideias | Me dá 5 ideias de títulos para um vídeo sobre automação com IA para o YouTube |

---

### 2️⃣ Contexto — Por quê? Onde?

A IA não sabe quem você é, qual é seu objetivo nem para quem o conteúdo é destinado. Sem contexto, ela adivinha — e frequentemente erra.

> [!example] Exemplo Prático
> **Sem contexto:** "Escreve um email de follow-up"
>
> **Com contexto:** "Sou freelancer de design. Enviei uma proposta há 5 dias e não recebi resposta. O cliente é uma startup. Escreve um email de follow-up profissional, mas não desesperado"

> [!tip] Dica
> Pense no contexto como o **briefing que você daria a um funcionário novo**. O que ele precisaria saber para fazer um bom trabalho?

**Contexto responde:**
- Quem você é?
- Qual seu objetivo?
- Para quem é o conteúdo?
- O que já foi feito?
- Quais são as restrições?

---

### 3️⃣ Formato — Como?

A IA pode entregar a mesma informação de mil formas. Se você não especifica, ela escolhe por você.

**Formatos que você pode pedir:**
- Lista com bullets
- Parágrafo corrido
- Tabela comparativa
- JSON estruturado
- Passo a passo numerado
- Resumo em X palavras
- Tópicos com subtópicos

| ❌ Sem formato | ✅ Com formato |
|---|---|
| Me fala dos benefícios do exercício | Liste os 5 principais benefícios do exercício em bullets curtos, com no máximo 2 linhas cada |
| Compare React e Vue | Compare React vs Vue em uma tabela com as colunas: Critério, React, Vue, Veredito |

> [!tip] Dica
> Pense em **como vai usar** a resposta. Vai colar em email? Pede texto corrido. Vai apresentar? Pede bullets. Vai usar em código? Pede JSON.

---

### 4️⃣ Restrições — O que não fazer?

Tão importante quanto dizer o que você quer é dizer o que você **não** quer.

| ❌ Sem restrições | ✅ Com restrições |
|---|---|
| Escreve uma bio para o meu LinkedIn | Escreve uma bio para o LinkedIn. Máx. 300 caracteres. Não use "apaixonado por". Não comece com "Sou". Tom profissional mas não robótico |

**Tipos de restrições úteis:**
- **Tamanho:** máximo 200 palavras, no máximo 5 itens
- **Tom:** sem ser formal demais, evite jargões técnicos
- **Conteúdo:** não inclua introdução, vá direto ao ponto
- **Abordagem:** não use clichês, evite exemplos genéricos
- **Escopo:** foque só em X, não entre em Y

---

## Nível 2 — Intermediário: Técnicas de Controle

---

### 🎭 Role Prompting — Dê uma Persona à IA

Quando você diz *"você é especialista em X"*, a IA ajusta vocabulário, profundidade e perspectiva inteiros.

> [!example] Exemplo Prático
> **Sem persona:** "Como melhorar a conversão do meu site?"
>
> **Com persona:** "Você é um especialista em CRO com 15 anos de experiência em e-commerce. Analise os pontos que impactam conversão em uma loja de roupas femininas e dê 5 recomendações práticas, priorizadas por impacto."

**Template de Role Prompting:**
```
Você é [PROFISSÃO/ESPECIALIDADE] com X anos de experiência em [ÁREA ESPECÍFICA].
Seu estilo de comunicação é [CARACTERÍSTICAS].
Seu público geralmente são [TIPO DE PESSOA].
Agora me ajude com [TAREFA].
```

**Personas úteis para o dia a dia:**

| Persona | Usar quando... |
|---|---|
| Revisor editorial rigoroso | Revisar textos |
| Desenvolvedor senior pragmático | Code review |
| Copywriter de resposta direta | Textos persuasivos |
| Professor paciente | Explicações didáticas |
| Consultor estratégico | Análises de negócio |
| Crítico construtivo | Feedback honesto |

---

### 📚 Few-Shot Prompting — Mostre, Não Descreva

Dar 2–3 exemplos de entrada/saída é mais eficaz do que tentar descrever o padrão em palavras. A IA identifica o padrão e replica.

> [!example] Exemplo Prático
> ```
> Preciso converter descrições em títulos chamativos.
> Exemplos:
> - Descrição: App de finanças → Título: Controle seu dinheiro em 5 minutos por dia
> - Descrição: Curso de programação → Título: Do zero ao primeiro emprego como dev
> - Descrição: Ferramenta de automação → Título: Deixe o robô trabalhar enquanto você descansa
>
> Agora faça:
> - Descrição: Plataforma de cursos de IA
> ```

**Quando usar:**
- Quando precisa de um formato muito específico
- Quando quer manter consistência de estilo
- Quando é mais fácil mostrar do que explicar
- Quando quer que a IA aprenda seu tom de voz

> [!tip] Dica
> 2–3 exemplos geralmente são suficientes. Mais que 5 raramente melhora.

---

### 🔗 Chain of Thought — Force o Raciocínio Passo a Passo

Pedir uma resposta direta para perguntas complexas aumenta a probabilidade de erro. Instrua a IA a pensar antes de responder.

> [!example] Exemplo Prático
> **Sem CoT:** "Qual a melhor linguagem para um iniciante?"
> → Resposta provável: "Python." *(seco, sem justificativa)*
>
> **Com CoT:** "Qual a melhor linguagem para um iniciante? Antes de responder: liste os critérios importantes para iniciantes, avalie 3 linguagens nesses critérios, e só então dê sua recomendação justificada."
> → Resposta: análise completa e fundamentada

**Frases que ativam o CoT:**
- *"Pense passo a passo antes de responder"*
- *"Antes de dar a resposta final, explique seu raciocínio"*
- *"Identifique os fatores relevantes, analise cada um, depois conclua"*
- *"Let's think step by step"* *(funciona bem mesmo em prompts em português)*

**Quando usar:**
- Problemas de lógica ou matemática
- Análises com múltiplos fatores
- Decisões com prós e contras
- Debugging de código

**Template de Chain of Thought:**
```
Preciso que você [TAREFA].
Antes de dar a resposta final:
1. Identifique os fatores relevantes
2. Analise cada fator
3. Considere diferentes perspectivas
4. Só então apresente sua conclusão com justificativa
```

---

### 📐 Output Structuring — Controle o Formato da Saída

Peça formatos específicos, especialmente quando vai usar a resposta em outro lugar.

| Formato | Usar quando... |
|---|---|
| JSON | Integrar com código ou automações |
| Tabela Markdown | Comparações |
| Lista numerada | Passos sequenciais |
| CSV | Importar em planilhas |
| XML | Sistemas legados |
| Código comentado | Implementação direta |

> [!example] Pedindo tabela
> ```
> Compare React, Vue e Angular.
> Formato: tabela markdown com as colunas
> Critério | React | Vue | Angular | Melhor para
> Critérios: curva de aprendizado, performance, ecossistema, empregabilidade
> ```

> [!example] Pedindo JSON
> ```
> Analise esse produto e retorne no formato JSON:
> { "nome": "...", "categoria": "...", "precoSugerido": "...",
>   "publicoAlvo": "...", "pontosFortes": [...], "pontosFracos": [...] }
> Produto: [DESCRIÇÃO]
> ```

---

## Nível 3 — Avançado: Técnicas Profissionais

---

### 📄 Mega Prompts — Sistema Completo em Um Prompt

Um documento completo que define persona, contexto, regras, exemplos e formato de uma vez só. Ideal para consistência em múltiplas interações.

**Quando usar Mega Prompts:**
- Quando vai fazer várias perguntas sobre o mesmo tema
- Quando precisa de um assistente especializado
- Quando quer padronizar respostas
- Quando vai usar em automações

**Estrutura:**
```
## IDENTIDADE
Você é [NOME], [PROFISSÃO] com X anos de experiência em [ÁREA].
Sua especialidade: [ESPECIALIDADE].
Seu estilo de comunicação: [CARACTERÍSTICAS].

## CONTEXTO
Você está ajudando [TIPO DE PESSOA] que [SITUAÇÃO].
Objetivo final: [META].

## CONHECIMENTO
Você tem expertise em:
- [ÁREA 1]
- [ÁREA 2]
- [ÁREA 3]

## REGRAS DE COMPORTAMENTO
SEMPRE:
- [COMPORTAMENTO 1]
- [COMPORTAMENTO 2]
NUNCA:
- [COMPORTAMENTO 3]
- [COMPORTAMENTO 4]

## FORMATO PADRÃO DE RESPOSTA
[ESTRUTURA QUE VOCÊ QUER EM TODAS AS RESPOSTAS]

## EXEMPLOS
Usuário: [EXEMPLO DE PERGUNTA]
Você: [EXEMPLO DE RESPOSTA IDEAL]
```

---

### 🔄 Prompts Iterativos — Refine, Não Recomece

Você raramente vai acertar de primeira — e tudo bem. O segredo é saber iterar com eficiência.

**O processo iterativo:**
1. Pede uma primeira versão
2. Analisa o que ficou bom e o que ficou ruim
3. Pede ajustes específicos (não refaz tudo)
4. Repete até ficar do jeito que você quer

**Frases úteis para iterar:**

| Objetivo | Frase |
|---|---|
| Ajustar tom | *"Gostei, mas deixa mais informal"* |
| Ajustar tom | *"Tá muito seco, adiciona mais personalidade"* |
| Ajustar estrutura | *"Mantém a estrutura, mas expande o ponto 2"* |
| Ajustar estrutura | *"Inverte a ordem, começa pela conclusão"* |
| Ajustar conteúdo | *"Adiciona um exemplo prático em cada ponto"* |
| Ajustar conteúdo | *"Remove a parte sobre X, não é relevante"* |
| Ajustar formato | *"Transforma os parágrafos em bullets"* |
| Ajustar formato | *"Quebra esse texto em seções com títulos"* |

> [!warning] Atenção
> Seja específico nos ajustes. *"Melhora"* não ajuda. *"Deixa mais curto e mais direto"* ajuda.

---

### 🪞 Self-Reflection — Peça a Auto-Crítica

Você pede para a IA avaliar a própria resposta. Ela identifica problemas que você nem percebeu.

```
Agora revise sua resposta e:
1. Identifique 3 pontos que poderiam melhorar
2. Explique por que são problemas
3. Reescreva corrigindo esses pontos
```

**Variações úteis:**
```
Revise sua resposta focando em:
- Clareza: tem algo confuso?
- Completude: faltou algum ponto importante?
- Precisão: tem algo que pode estar errado?
Se algum item falhar, corrija.
```

**Quando usar:**
- Quando precisa de qualidade alta
- Quando não tem certeza se a resposta está boa
- Quando quer uma segunda opinião sem sair da conversa

---

### ⛓️ Prompt Chaining — Quebre Tarefas Complexas

Em vez de pedir tudo de uma vez, construa em etapas. O resultado de cada etapa vira entrada da próxima.

> [!example] Exemplo: Criar um artigo completo
> ```
> Etapa 1 (Pesquisa):
> "Liste os 5 pontos principais que um artigo sobre [TEMA] deve cobrir"
>
> Etapa 2 (Estrutura):
> "Com base nesses pontos, crie um outline detalhado"
>
> Etapa 3 (Introdução):
> "Escreva a introdução seguindo o outline. Gancho forte."
>
> Etapa 4 (Desenvolvimento):
> "Escreva a seção 1 do outline." → repete para cada seção
>
> Etapa 5 (Revisão):
> "Revise o artigo completo verificando fluidez, consistência de tom e repetições"
> ```

---

### 🌳 Tree of Thought — Múltiplos Caminhos

Force a IA a explorar várias abordagens antes de sintetizar a melhor.

```
Para este problema, faça um brainstorm de 3 abordagens
estratégicas distintas (A, B, C).
Avalie os prós e contras de cada ramo.
Depois, sintetize a melhor abordagem, combinando os
elementos mais fortes de cada uma.
```

---

### ⚔️ Validação Adversária — Batalha de Bots

A IA é frequentemente melhor a criticar do que a criar. Use múltiplas personas para refinar o resultado.

```
Simule uma competição de 3 rodadas com 3 personas:

Rodada 1: O Especialista e o Gestor escrevem [TAREFA]
Rodada 2: O Cliente irritado critica-os brutalmente
Rodada 3: O Especialista e o Gestor colaboram para
          produzir uma versão final incorporando as críticas
```

---

## ✅ Checklist: Antes de Enviar Qualquer Prompt

- [ ] Defini o contexto? (quem sou, qual a situação)
- [ ] A tarefa está clara e específica?
- [ ] Especifiquei o formato de saída?
- [ ] Incluí exemplos se a tarefa é complexa?
- [ ] Defini restrições? (o que não quero)
- [ ] O prompt está completo, mas não verborrágico?
- [ ] Defini tom e público, se for texto?
- [ ] Se for código: incluí a linguagem e o erro/contexto?

---

## 📋 Template Universal

Funciona para 90% das situações. Copie, adapte e use.

```
Você é [PERSONA COM EXPERTISE].
Eu sou [SUA DESCRIÇÃO RELEVANTE].
A situação: [CONTEXTO DA TAREFA].

Preciso que você [TAREFA ESPECÍFICA E CLARA].

Responda em formato de [FORMATO: lista, texto, JSON, etc.].
Tamanho: [CURTO/MÉDIO/LONGO ou número específico].

- Não inclua [O QUE NÃO QUER]
- Evite [ABORDAGENS INDESEJADAS]
- Priorize [O QUE É MAIS IMPORTANTE]
```

---

## 🛠️ Templates Prontos por Caso de Uso

### ✉️ Email Profissional
```
Escreva um email de [TIPO: proposta/follow-up/cobrança/apresentação].
De: [SEU CARGO/POSIÇÃO]
Para: [CARGO/POSIÇÃO DO DESTINATÁRIO]
Contexto: [EXPLIQUE A SITUAÇÃO, HISTÓRICO, RELAÇÃO]
Objetivo: [O QUE VOCÊ QUER CONSEGUIR COM ESSE EMAIL]
Tom: [FORMAL/CASUAL/URGENTE/AMIGÁVEL]
Tamanho: máximo X palavras
Pontos obrigatórios:
- [PONTO 1]
- [PONTO 2]
```

### 📝 Post para LinkedIn
```
Crie um post para LinkedIn sobre [TEMA].
Sobre mim (autor):
- Profissão: [SUA PROFISSÃO]
- Área: [SUA ÁREA]
- Tom de voz: [SEU ESTILO]
Objetivo: [ENGAJAMENTO/AUTORIDADE/CONVERSÃO]
Estrutura:
- Gancho forte na primeira linha
- Desenvolvimento com valor real
- CTA ou pergunta no final
Formato:
- Frases curtas, espaçamento entre parágrafos
- Máximo X linhas
- Sem hashtags ou no máximo 3
```

### 🐛 Debug de Código
```
Estou com o seguinte erro no meu código [LINGUAGEM]:
[COLE A MENSAGEM DE ERRO COMPLETA]

O código relevante:
[COLE O CÓDIGO]

Contexto:
- O que eu estava tentando fazer: [EXPLIQUE]
- O que eu já tentei: [LISTE]

Por favor:
1. Explique o que está causando o erro
2. Mostre a correção
3. Explique por que a correção funciona
```

### 🔍 Análise de Documento
```
Analise o documento abaixo:
[COLE O DOCUMENTO]

Objetivo da análise: [O QUE VOCÊ QUER DESCOBRIR]

Me entregue:
1. RESUMO EXECUTIVO (2–3 frases com o essencial)
2. PONTOS PRINCIPAIS (lista dos pontos mais importantes)
3. PONTOS DE ATENÇÃO (riscos, problemas, inconsistências)
4. RECOMENDAÇÕES (o que fazer com base na análise)
5. PERGUNTAS EM ABERTO (o que não ficou claro)
```

### 🆚 Comparação de Opções
```
Compare [OPÇÃO A] vs [OPÇÃO B] vs [OPÇÃO C].
Contexto: [POR QUE ESTOU COMPARANDO]
Critérios de avaliação:
- [CRITÉRIO 1] (peso: alto/médio/baixo)
- [CRITÉRIO 2]
- [CRITÉRIO 3]
Formato da resposta:
1. Tabela comparativa
2. Análise de cada critério
3. Para quem cada opção é melhor
4. Recomendação final com justificativa
```

### 💡 Brainstorm de Ideias
```
Preciso de ideias para [OBJETIVO].
Contexto: [SITUAÇÃO, RESTRIÇÕES, PÚBLICO]
O que já foi tentado/descartado: [SE HOUVER]
Tipo de ideias que busco: [CRIATIVAS/PRÁTICAS/INOVADORAS]

Gere X ideias. Para cada uma, inclua:
- A ideia em 1 frase
- Por que pode funcionar
- Principal obstáculo
- Próximo passo para testar
```

### 📊 Tomada de Decisão
```
Preciso tomar uma decisão e quero sua ajuda para pensar.
A decisão: [DESCREVA]
Opções:
1. [OPÇÃO A]
2. [OPÇÃO B]
Contexto: [SITUAÇÃO, HISTÓRICO, STAKEHOLDERS]
O que mais importa para mim:
- [PRIORIDADE 1]
- [PRIORIDADE 2]
Meus receios:
- [MEDO 1]
- [MEDO 2]
Me ajude a pensar de forma estruturada:
1. Prós e contras de cada opção
2. Riscos e como mitigar
3. O que estou deixando de considerar?
4. Perguntas que eu deveria me fazer
```

---

## 💡 Dicas por Modelo de IA

| Modelo | Dica Principal | Extra |
|---|---|---|
| **Gemini** | Use tags XML/Markdown para estruturar o prompt | Coloque a tarefa no **final** do prompt; peça um plano antes de executar |
| **GPT (OpenAI)** | Seja explícito com papéis e lógica | Use a role `developer` para instruções de sistema com alta prioridade |
| **Claude (Anthropic)** | Use tags XML para delimitar seções | Preencha o início da resposta para guiar o formato; ative Extended Thinking para problemas complexos |

---

## 🚫 Os 5 Erros Mais Comuns

> [!warning] Corrija esses 5 erros e seus resultados vão melhorar drasticamente

| # | Erro | Solução |
|---|---|---|
| 1 | **Prompts vagos** — "me ajuda com isso" | Seja específico: o quê, para quem, com qual objetivo |
| 2 | **Falta de contexto** — não explicar quem você é nem o objetivo | Sempre inclua contexto relevante |
| 3 | **Sem definir formato** — quer lista, recebe texto corrido | Sempre especifique como quer a resposta |
| 4 | **Aceitar a primeira resposta** — sem iterar | Use a conversa; peça ajustes; refine |
| 5 | **Prompt gigante logo de cara** — misturar múltiplas tarefas | Quebre em etapas; faça uma coisa de cada vez |

---

## 🎯 A Meta-Competência

Dominar engenharia de prompt é, no fundo, dominar a **clareza de pensamento**.

- A **Persona** força a definir a perspectiva
- O **Contexto** força a identificar os fatos relevantes
- O **Chain of Thought** força a mapear o fluxo lógico
- Os **Exemplos** forçam a definir o que é um bom resultado

> [!important] Quando um prompt falha, não é problema da IA
> É um sinal de que o seu próprio pensamento precisa ser refinado. A IA só pode ser tão clara quanto você.

---

## 🚀 Plano de Prática (1 Semana)

- [ ] **Dia 1–2:** Aplique os 4 Pilares em todas as suas interações com IA
- [ ] **Dia 3:** Use Role Prompting nas próximas 5 interações
- [ ] **Dia 4:** Teste Few-Shot Prompting em uma tarefa repetitiva
- [ ] **Dia 5:** Use Chain of Thought em uma análise ou decisão
- [ ] **Dia 6:** Crie seu primeiro Mega Prompt para uma tarefa recorrente
- [ ] **Dia 7:** Revise e salve os melhores prompts na sua biblioteca pessoal

---

*Fonte: Guia Definitivo de Engenharia de Prompt — Matheus Battisti (Hora de Codar) + Mapa Mental de Engenharia de Prompt*
