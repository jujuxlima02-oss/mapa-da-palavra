/goal Completar Fase 3.4 e validar mpalavra | Agente WhatsApp Principal



OBJETIVO VERIFICÁVEL:

Workflow XeA5zPHk9Shc8oLg ativo com 44 nós, todos os 9 nós Postgres

com queries reais, tabelas confirmadas no Neon, active=true.



TOKEN BUDGET: 400k



\---



\## CONTEXTO DO PROJETO



VPS: root@157.230.234.223

n8n: https://n8n.wvke.site

Workflow alvo: XeA5zPHk9Shc8oLg (mpalavra | Agente WhatsApp Principal)

Projeto local: /opt/diario-atendimento/

Relatórios: C:\\Users\\wklea\\Documents\\diario\_biblico\\docs\\tasks\\



Credenciais n8n confirmadas:

\- Chatwoot: id=uyvTqyJscvgHiPVZ | type=fazerAiChatwootApi

\- OpenAI:   id=3a5e7dc9-91b6-41ab-917f-fc3093c4d8e4 | type=openAiApi

\- Postgres: id=XFcFZfjAkygxUzxc | type=postgres



Parâmetros Chatwoot:

\- accountId: 1

\- inboxId: 1



\---



\## REGRAS ABSOLUTAS (não sobrescrever)



1\. SQL: sempre psql -c "SQL" -v ON\_ERROR\_STOP=1 — NUNCA heredoc via SSH

2\. PUT n8n: sanitizar GET antes — campos permitidos APENAS:

&#x20;  name, nodes, connections, settings, staticData, pinData

&#x20;  settings APENAS: {"executionOrder": "v1"}

3\. STOP em qualquer HTTP 4xx ou 5xx

4\. Nunca expor senha no output

5\. Senha Neon: ler com grep + cut -d= -f2- (não cut -d= -f2)

6\. Após cada PUT: sempre tentar reativar e fazer GET de confirmação



\---



\## PASSO 1 — Diagnóstico das tabelas Neon



Verificar contexto da conexão e onde estão as tabelas:



ssh root@157.230.234.223 'PGPASS=$(grep -E "PGPASSWORD|NEON\_PASSWORD|DATABASE\_PASSWORD|POSTGRES\_PASSWORD" /opt/diario-atendimento/.env.local | head -1 | cut -d= -f2- | tr -d "\\"'"'"'" | tr -d "\\r\\n") \&\& PGPASSWORD="$PGPASS" psql "postgresql://neondb\_owner@ep-red-darkness-acrhoqum-pooler.sa-east-1.aws.neon.tech/neondb?sslmode=require" -c "SELECT current\_database(), current\_schema(), session\_user;"'



ssh root@157.230.234.223 'PGPASS=$(grep -E "PGPASSWORD|NEON\_PASSWORD|DATABASE\_PASSWORD|POSTGRES\_PASSWORD" /opt/diario-atendimento/.env.local | head -1 | cut -d= -f2- | tr -d "\\"'"'"'" | tr -d "\\r\\n") \&\& PGPASSWORD="$PGPASS" psql "postgresql://neondb\_owner@ep-red-darkness-acrhoqum-pooler.sa-east-1.aws.neon.tech/neondb?sslmode=require" -c "\\dt \*.\*"'



Se as 4 tabelas (message\_queue, attendance\_status, n8n\_chat\_histories,

tool\_calls\_log) não aparecerem em nenhum schema:

Criar cada uma com -c individual:



ssh root@157.230.234.223 'PGPASS=$(...) \&\& PGPASSWORD="$PGPASS" psql "postgresql://neondb\_owner@ep-red-darkness-acrhoqum-pooler.sa-east-1.aws.neon.tech/neondb?sslmode=require" -v ON\_ERROR\_STOP=1 -c "CREATE TABLE IF NOT EXISTS message\_queue (id SERIAL PRIMARY KEY, conversation\_id TEXT NOT NULL, message\_text TEXT, created\_at TIMESTAMP DEFAULT NOW());"'



ssh root@157.230.234.223 'PGPASS=$(...) \&\& PGPASSWORD="$PGPASS" psql "postgresql://neondb\_owner@ep-red-darkness-acrhoqum-pooler.sa-east-1.aws.neon.tech/neondb?sslmode=require" -v ON\_ERROR\_STOP=1 -c "CREATE TABLE IF NOT EXISTS attendance\_status (conversation\_id TEXT PRIMARY KEY, status TEXT NOT NULL DEFAULT '"'"'idle'"'"', locked\_at TIMESTAMP, updated\_at TIMESTAMP DEFAULT NOW());"'



ssh root@157.230.234.223 'PGPASS=$(...) \&\& PGPASSWORD="$PGPASS" psql "postgresql://neondb\_owner@ep-red-darkness-acrhoqum-pooler.sa-east-1.aws.neon.tech/neondb?sslmode=require" -v ON\_ERROR\_STOP=1 -c "CREATE TABLE IF NOT EXISTS n8n\_chat\_histories (id SERIAL PRIMARY KEY, session\_id TEXT NOT NULL, message JSONB NOT NULL, created\_at TIMESTAMP DEFAULT NOW());"'



ssh root@157.230.234.223 'PGPASS=$(...) \&\& PGPASSWORD="$PGPASS" psql "postgresql://neondb\_owner@ep-red-darkness-acrhoqum-pooler.sa-east-1.aws.neon.tech/neondb?sslmode=require" -v ON\_ERROR\_STOP=1 -c "CREATE TABLE IF NOT EXISTS tool\_calls\_log (id SERIAL PRIMARY KEY, conversation\_id TEXT NOT NULL, tool\_name TEXT, tool\_input JSONB, tool\_output JSONB, created\_at TIMESTAMP DEFAULT NOW());"'



Confirmar com \\dt antes de avançar.



\---



\## PASSO 2 — Substituir queries placeholder nos 9 nós Postgres



Ler payload atual via GET sanitizado:



KEY=$(obter via psql)

curl GET /api/v1/workflows/XeA5zPHk9Shc8oLg



Sanitizar com python3:

payload = {

&#x20; "name": w\["name"],

&#x20; "nodes": w\["nodes"],

&#x20; "connections": w\["connections"],

&#x20; "settings": {"executionOrder": "v1"},

&#x20; "staticData": w.get("staticData", None),

&#x20; "pinData": w.get("pinData", {})

}



Substituir parameters de cada nó Postgres conforme mapeamento abaixo.

Usar operation="executeQuery" e query=<SQL> em todos.



\### Mapeamento de queries reais



\*\*Buscar mensagens em fila:\*\*

operation: executeQuery

query: SELECT id, message\_text FROM message\_queue WHERE conversation\_id = '{{ $json.conversation\_id }}' ORDER BY created\_at ASC LIMIT 50



\*\*Enfileirar mensagem:\*\*

operation: executeQuery

query: INSERT INTO message\_queue (conversation\_id, message\_text) VALUES ('{{ $json.conversation\_id }}', '{{ $json.message\_text }}') RETURNING id



\*\*Verificar status atendimento:\*\*

operation: executeQuery

query: SELECT status FROM attendance\_status WHERE conversation\_id = '{{ $json.conversation\_id }}' LIMIT 1



\*\*Bloquear status atendimento:\*\*

operation: executeQuery

query: INSERT INTO attendance\_status (conversation\_id, status, locked\_at) VALUES ('{{ $json.conversation\_id }}', 'busy', NOW()) ON CONFLICT (conversation\_id) DO UPDATE SET status = 'busy', locked\_at = NOW(), updated\_at = NOW()



\*\*Limpar fila de mensagens:\*\*

operation: executeQuery

query: DELETE FROM message\_queue WHERE conversation\_id = '{{ $json.conversation\_id }}' RETURNING message\_text



\*\*Salvar tool calls:\*\*

operation: executeQuery

query: INSERT INTO tool\_calls\_log (conversation\_id, tool\_name, tool\_input, tool\_output) VALUES ('{{ $json.conversation\_id }}', '{{ $json.tool\_name }}', '{{ JSON.stringify($json.tool\_input) }}'::jsonb, '{{ JSON.stringify($json.tool\_output) }}'::jsonb)



\*\*Buscar novas entradas na fila:\*\*

operation: executeQuery

query: SELECT id, message\_text FROM message\_queue WHERE conversation\_id = '{{ $json.conversation\_id }}' ORDER BY created\_at ASC LIMIT 1



\*\*Limpar status atendimento:\*\*

operation: executeQuery

query: DELETE FROM attendance\_status WHERE conversation\_id = '{{ $json.conversation\_id }}'



\*\*Limpar memoria:\*\*

operation: executeQuery

query: DELETE FROM n8n\_chat\_histories WHERE session\_id = '{{ $json.conversation\_id }}'



\---



\## PASSO 3 — PUT sanitizado



Salvar payload corrigido em /tmp/agente-principal-v6.json

Confirmar tamanho com wc -c.



PUT:

curl -X PUT /api/v1/workflows/XeA5zPHk9Shc8oLg \\

&#x20; -H "X-N8N-API-KEY: $KEY" \\

&#x20; -H "Content-Type: application/json" \\

&#x20; -d @/tmp/agente-principal-v6.json



Se HTTP != 200: mostrar erro + nó exato. PARAR.



\---



\## PASSO 4 — Reativar e confirmar



POST /api/v1/workflows/XeA5zPHk9Shc8oLg/activate



GET de confirmação final — critérios obrigatórios:

\- active: true

\- nodeCount: 44

\- triggerType: @fazer-ai/n8n-nodes-chatwoot.chatwootTrigger

\- hasStickyNote: false

\- executionOrder: v1

\- FALSE do "Agente ja terminou de responder?" → Esperar fila



\---



\## PASSO 5 — Relatório e kaligos.toml



Salvar relatório completo:

C:\\Users\\wklea\\Documents\\diario\_biblico\\docs\\tasks\\fase-3.4-tabelas-teste.md



Incluir no relatório:

\- Lista das 4 tabelas confirmadas no Neon

\- Mapeamento das 9 queries aplicadas

\- Evidência do GET final (active, nodeCount, triggerType)

\- Lições aprendidas: heredoc quebra via SSH, sanitizar GET antes de PUT



Atualizar kaligos.toml:

\[n8n.put\_sanitizacao]

campos\_permitidos = \["name","nodes","connections","settings","staticData","pinData"]

settings\_permitido = '{"executionOrder":"v1"}'



\[n8n.tabelas\_postgres]

message\_queue = "fila anti-encavalamento"

attendance\_status = "lock por conversa"

n8n\_chat\_histories = "memória memoryPostgresChat"

tool\_calls\_log = "auditoria de tools"



\[n8n.lições]

sql\_via\_ssh = "usar psql -c 'SQL' -v ON\_ERROR\_STOP=1, nunca heredoc"

senha\_neon = "cut -d= -f2- preserva caracteres especiais"

credenciais\_post = "HTTP 200 = sucesso nesta instância, não 201"



\---



\## CRITÉRIOS DE CONCLUSÃO DO /goal



O /goal está completo quando TODOS forem verdadeiros:

1\. \\dt no Neon mostra as 4 tabelas em public

2\. GET do workflow mostra nodeCount=44, active=true

3\. Nenhum nó Postgres tem query "SELECT 1"

4\. Relatório fase-3.4-tabelas-teste.md salvo e fechado

5\. kaligos.toml atualizado com lições e tabelas



/goal status a cada 3 iterações para monitorar progresso. @caveman

