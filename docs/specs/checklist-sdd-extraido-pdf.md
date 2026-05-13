# Checklist SDD — Extraído de Spec-Driven_Development_SDD.pdf

> Fonte de referência. Não carregar como skill ativa.
> Use para validar se uma spec está completa antes de delegar.

## Checklist de requirements.md

- [ ] Tipo de produto e modelo de negócio definidos
- [ ] Problema central e usuário-alvo em 1–2 frases
- [ ] Lista de funcionalidades do MVP com jornada do usuário
- [ ] Fora de Escopo listado explicitamente
- [ ] Regras de negócio documentadas
- [ ] Requisitos não funcionais (performance, segurança, LGPD)

## Checklist de design.md

- [ ] Stack tecnológica com justificativa
- [ ] Esquema de banco de dados (entidades, campos, relacionamentos)
- [ ] Rotas e estrutura de páginas (pública, protegida, role)
- [ ] Variáveis de ambiente necessárias (nomes, sem valores)
- [ ] Estratégia de deploy e ambientes

## Checklist de tasks.md

- [ ] Cada task tem escopo de 1 prompt para o worker
- [ ] Critério de conclusão definido por task
- [ ] Dependências explícitas entre tasks
- [ ] Sequência: Setup → Auth → Core MVP → Integrações → Polimento
- [ ] Instrução "PARE AQUI" ao fim de cada task

## Validação pós-task (obrigatória)

- [ ] npm run build — build não quebrou
- [ ] npm run type-check — sem erros de TypeScript
- [ ] npm run lint — conformidade com ESLint

Se algum item estiver faltando na spec, o arquiteto-senior DEVE completar
antes de delegar ao worker.
