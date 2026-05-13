# Task List — Módulo PIX

## Tarefa 1 — Detecção de intenção de compra
Arquivos afetados: `workflow/intent-detector.js` (ou equivalente)
Depende de: nenhuma
Descrição: Identificar no fluxo de conversa quando o usuário demonstra intenção de compra (palavras-chave, botão, comando). Acionar o módulo PIX a partir desse gatilho.
Critério de conclusão: O workflow entra no módulo PIX automaticamente ao detectar intenção. PARE AQUI.

## Tarefa 2 — Geração e envio da mensagem PIX
Arquivos afetados: `workflow/pix-sender.js`, `templates/pix-message.md`
Depende de: Tarefa 1
Descrição: Gerar o payload PIX (chave Pix ou QR Code dinâmico) e enviar a mensagem ao usuário com valor, descrição e prazo de validade.
Critério de conclusão: Usuário recebe mensagem com dados PIX corretos e formatados. PARE AQUI.

## Tarefa 3 — Confirmação de pagamento
Arquivos afetados: `workflow/pix-confirmation.js`
Depende de: Tarefa 2
Descrição: Implementar polling ou listener de webhook para confirmar o pagamento junto ao gateway. Definir timeout (sugerido: 15 minutos) e lógica de follow-up caso não haja confirmação.
Critério de conclusão: Sistema detecta pagamento confirmado E aciona entrega. Timeout registrado em log. PARE AQUI.

## Tarefa 4 — Entrega do acesso
Arquivos afetados: `workflow/access-delivery.js`
Depende de: Tarefa 3
Descrição: Após confirmação do pagamento, entregar o acesso ao comprador (link, credenciais, liberação de recurso — conforme o produto). Registrar entrega em progress.md.
Critério de conclusão: Acesso entregue, log atualizado, fluxo encerrado com mensagem de confirmação ao usuário. PARE AQUI.
