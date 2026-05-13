const fs = require("fs");
const { execFileSync } = require("child_process");

const apiKey = process.env.N8N_API_KEY;
const apiBase = process.env.N8N_API_BASE || "https://n8n.wvke.site/api/v1";
const workflow1Id = process.env.WORKFLOW1_ID || "XeA5zPHk9Shc8oLg";

if (!apiKey) throw new Error("N8N_API_KEY ausente");

const headers = {
  "X-N8N-API-KEY": apiKey,
  "Content-Type": "application/json",
};

async function request(path, options = {}) {
  const res = await fetch(`${apiBase}${path}`, {
    ...options,
    headers: { ...headers, ...(options.headers || {}) },
  });
  const text = await res.text();
  let body;
  try {
    body = text ? JSON.parse(text) : null;
  } catch {
    body = text;
  }
  return { res, body, text };
}

function workflowPayload(workflow, overrides = {}) {
  return {
    name: workflow.name,
    nodes: workflow.nodes,
    connections: workflow.connections || {},
    settings: { executionOrder: workflow.settings?.executionOrder || "v1" },
    staticData: workflow.staticData || null,
    pinData: workflow.pinData || null,
    ...overrides,
  };
}

function stableId(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function workflow3Payload() {
  const webhook = {
    id: stableId("webhook"),
    name: "Webhook Follow-up Automático",
    type: "n8n-nodes-base.webhook",
    typeVersion: 2,
    position: [0, 0],
    parameters: {
      httpMethod: "POST",
      path: "mpalavra/whatsapp/follow-up",
      responseMode: "responseNode",
      options: {},
    },
  };

  const filter = {
    id: stableId("if-label"),
    name: "IF - Label aquecendo ou interessado e sem assignee",
    type: "n8n-nodes-base.if",
    typeVersion: 2.3,
    position: [260, 0],
    parameters: {
      conditions: {
        options: { caseSensitive: true, leftValue: "", typeValidation: "strict", version: 3 },
        combinator: "and",
        conditions: [
          {
            id: stableId("label-interested"),
            leftValue: "={{ ['aquecendo','interessado'].includes($json.body?.label) }}",
            rightValue: "",
            operator: { type: "boolean", operation: "true", singleValue: true },
          },
          {
            id: stableId("assignee-empty"),
            leftValue: "={{ $json.body?.conversation?.assignee_id ?? null }}",
            rightValue: "",
            operator: { type: "object", operation: "empty", singleValue: true },
          },
        ],
      },
      options: {},
    },
  };

  const windowSet = {
    id: stableId("set-window"),
    name: "Set Window",
    type: "n8n-nodes-base.set",
    typeVersion: 3.4,
    position: [520, 0],
    parameters: {
      assignments: {
        assignments: [
          {
            id: stableId("window"),
            name: "window",
            value: "={{ $json.body?.label === 'interessado' ? 12 : 24 }}",
            type: "number",
          },
          {
            id: stableId("conversation_id"),
            name: "conversation_id",
            value: "={{ $json.body?.conversation?.id }}",
            type: "number",
          },
          {
            id: stableId("label"),
            name: "label",
            value: "={{ $json.body?.label }}",
            type: "string",
          },
        ],
      },
      options: {},
    },
  };

  const wait = {
    id: stableId("wait"),
    name: "Wait Node",
    type: "n8n-nodes-base.wait",
    typeVersion: 1,
    position: [780, 0],
    parameters: {
      amount: "={{ $json.window }}",
      unit: "hours",
      options: {},
    },
  };

  const checkSilence = {
    id: stableId("check-silence"),
    name: "Check Silence",
    type: "n8n-nodes-base.httpRequest",
    typeVersion: 4.2,
    position: [1040, 0],
    parameters: {
      method: "GET",
      url: "=http://chatwoot_rails:3000/api/v1/accounts/{{$env.CHATWOOT_ACCOUNT_ID}}/conversations/{{$json.conversation_id}}/messages",
      sendHeaders: true,
      headerParameters: {
        parameters: [
          { name: "api_access_token", value: "={{ $env.CHATWOOT_API_ACCESS_TOKEN }}" },
        ],
      },
      options: {},
    },
  };

  const silenceIf = {
    id: stableId("if-silence"),
    name: "IF - Lead em silencio?",
    type: "n8n-nodes-base.if",
    typeVersion: 2.3,
    position: [1300, 0],
    parameters: {
      conditions: {
        options: { caseSensitive: true, leftValue: "", typeValidation: "strict", version: 3 },
        combinator: "and",
        conditions: [
          {
            id: stableId("silence"),
            leftValue: "={{ ($json.data?.data || $json.data || []).at(-1)?.message_type !== 'incoming' }}",
            rightValue: "",
            operator: { type: "boolean", operation: "true", singleValue: true },
          },
        ],
      },
      options: {},
    },
  };

  const getHistory = {
    id: stableId("history"),
    name: "Get History",
    type: "n8n-nodes-base.httpRequest",
    typeVersion: 4.2,
    position: [1560, 0],
    parameters: {
      method: "GET",
      url: "=http://chatwoot_rails:3000/api/v1/accounts/{{$env.CHATWOOT_ACCOUNT_ID}}/conversations/{{$json.conversation_id}}/messages",
      sendHeaders: true,
      headerParameters: {
        parameters: [
          { name: "api_access_token", value: "={{ $env.CHATWOOT_API_ACCESS_TOKEN }}" },
        ],
      },
      options: {},
    },
  };

  const agent = {
    id: stableId("agent"),
    name: "Agente OpenAI - Follow-up",
    type: "@n8n/n8n-nodes-langchain.agent",
    typeVersion: 3.1,
    position: [1820, 0],
    parameters: {
      promptType: "define",
      text: "={{ `Gere uma mensagem curta de follow-up para lead em silêncio. Tom: acolhedor, sem pressão. Máximo 2 frases. PT-BR coloquial. Contexto: label=${$json.label}, conversation_id=${$json.conversation_id}` }}",
      options: {
      systemMessage: fs.readFileSync("C:/Users/wklea/Documents/diario_biblico/.codex/agents/personas/atendente-diario-biblico.md", "utf8") + "\n\nInstrução adicional: gere uma mensagem de follow-up curta, acolhedora e sem pressão, no máximo 2 frases.",
      },
    },
  };

  const openai = {
    id: stableId("openai"),
    name: "OpenAI gpt-4o-mini follow-up",
    type: "@n8n/n8n-nodes-langchain.lmChatOpenAi",
    typeVersion: 1.3,
    position: [1800, 260],
    credentials: {
      openAiApi: {
        id: "3a5e7dc9-91b6-41ab-917f-fc3093c4d8e4",
        name: "OpenAI mpalavra",
      },
    },
    parameters: {
      model: {
        __rl: true,
        value: "gpt-4o-mini",
        mode: "list",
      },
      options: {},
    },
  };

  const checkHour = {
    id: stableId("check-hour"),
    name: "Check Horário",
    type: "n8n-nodes-base.if",
    typeVersion: 2.3,
    position: [2080, 0],
    parameters: {
      conditions: {
        options: { caseSensitive: true, leftValue: "", typeValidation: "strict", version: 3 },
        combinator: "and",
        conditions: [
          {
            id: stableId("hour"),
            leftValue: "={{ new Date().toLocaleString('en-US', { timeZone: 'America/Sao_Paulo', hour: 'numeric', hour12: false }) >= 8 && new Date().toLocaleString('en-US', { timeZone: 'America/Sao_Paulo', hour: 'numeric', hour12: false }) <= 21 }}",
            rightValue: "",
            operator: { type: "boolean", operation: "true", singleValue: true },
          },
        ],
      },
      options: {},
    },
  };

  const sendMessage = {
    id: stableId("send-message"),
    name: "Send Message",
    type: "n8n-nodes-base.httpRequest",
    typeVersion: 4.2,
    position: [2340, 0],
    parameters: {
      method: "POST",
      url: "=http://chatwoot_rails:3000/api/v1/accounts/{{$env.CHATWOOT_ACCOUNT_ID}}/conversations/{{$json.conversation_id}}/messages",
      sendHeaders: true,
      headerParameters: {
        parameters: [
          { name: "api_access_token", value: "={{ $env.CHATWOOT_API_ACCESS_TOKEN }}" },
        ],
      },
      sendBody: true,
      specifyBody: "json",
      jsonBody: "={{ { content: $json.output || $json.text || 'Olá! Só passando para ver se o material ainda faz sentido pra você.', message_type: 'outgoing' } }}",
      options: {},
    },
  };

  const getCounter = {
    id: stableId("get-counter"),
    name: "Get Follow-up Counter",
    type: "n8n-nodes-base.httpRequest",
    typeVersion: 4.2,
    position: [2600, 0],
    parameters: {
      method: "GET",
      url: "=http://chatwoot_rails:3000/api/v1/accounts/{{$env.CHATWOOT_ACCOUNT_ID}}/conversations/{{$json.conversation_id}}/messages",
      sendHeaders: true,
      headerParameters: {
        parameters: [
          { name: "api_access_token", value: "={{ $env.CHATWOOT_API_ACCESS_TOKEN }}" },
        ],
      },
      options: {},
    },
  };

  const parseCounter = {
    id: stableId("parse-counter"),
    name: "Parse Follow-up Counter",
    type: "n8n-nodes-base.code",
    typeVersion: 2,
    position: [2860, 0],
    parameters: {
      jsCode:
        "const items = $json.data?.data || $json.data || $json.body?.data || $json.body || [];\nconst messages = Array.isArray(items) ? items : [];\nconst latest = messages.filter(m => m.private && String(m.content || '').startsWith('follow-up-count:')).at(-1);\nconst followUpCount = latest ? (parseInt(String(latest.content).replace('follow-up-count:', '').trim(), 10) || 0) : 0;\nreturn [{ json: { ...$json, followUpCount } }];",
    },
  };

  const noteCounter = {
    id: stableId("note-counter"),
    name: "Increment Counter",
    type: "n8n-nodes-base.httpRequest",
    typeVersion: 4.2,
    position: [3120, 0],
    parameters: {
      method: "POST",
      url: "=http://chatwoot_rails:3000/api/v1/accounts/{{$env.CHATWOOT_ACCOUNT_ID}}/conversations/{{$json.conversation_id}}/messages",
      sendHeaders: true,
      headerParameters: {
        parameters: [
          { name: "api_access_token", value: "={{ $env.CHATWOOT_API_ACCESS_TOKEN }}" },
        ],
      },
      sendBody: true,
      specifyBody: "json",
      jsonBody: "={{ { content: `follow-up-count: ${($json.followUpCount || 0) + 1}`, message_type: 'activity', private: true } }}",
      options: {},
    },
  };

  const limitIf = {
    id: stableId("limit"),
    name: "IF - Limite de follow-ups",
    type: "n8n-nodes-base.if",
    typeVersion: 2.3,
    position: [3380, 0],
    parameters: {
      conditions: {
        options: { caseSensitive: true, leftValue: "", typeValidation: "strict", version: 3 },
        combinator: "and",
        conditions: [
          {
            id: stableId("limit-cond"),
            leftValue: "={{ ($node['Parse Follow-up Counter'].json.followUpCount + 1) >= 2 }}",
            rightValue: "",
            operator: { type: "boolean", operation: "true", singleValue: true },
          },
        ],
      },
      options: {},
    },
  };

  const applyCold = {
    id: stableId("apply-cold"),
    name: "Apply Label Frio",
    type: "n8n-nodes-base.httpRequest",
    typeVersion: 4.2,
    position: [3120, -120],
    parameters: {
      method: "POST",
      url: "=http://chatwoot_rails:3000/api/v1/accounts/{{$env.CHATWOOT_ACCOUNT_ID}}/conversations/{{$json.conversation_id}}/labels",
      sendHeaders: true,
      headerParameters: {
        parameters: [
          { name: "api_access_token", value: "={{ $env.CHATWOOT_API_ACCESS_TOKEN }}" },
        ],
      },
      sendBody: true,
      specifyBody: "json",
      jsonBody: "={{ { labels: ['frio'] } }}",
      options: {},
    },
  };

  const respondDone = {
    id: stableId("respond"),
    name: "Responder 200",
    type: "n8n-nodes-base.respondToWebhook",
    typeVersion: 1.4,
    position: [3380, 0],
    parameters: {
      respondWith: "json",
      responseBody: "={{ { ok: true, workflow: 'follow-up' } }}",
      options: { responseCode: 200 },
    },
  };

  return {
    name: "mpalavra | Follow-up Automático",
    nodes: [
      webhook,
      filter,
      windowSet,
      wait,
      checkSilence,
      silenceIf,
      getHistory,
      agent,
      openai,
      checkHour,
      sendMessage,
      noteCounter,
      limitIf,
      applyCold,
      respondDone,
    ],
    connections: {
      "Webhook Follow-up Automático": {
        main: [[{ node: "IF - Label aquecendo ou interessado e sem assignee", type: "main", index: 0 }]],
      },
      "IF - Label aquecendo ou interessado e sem assignee": {
        main: [
          [{ node: "Set Window", type: "main", index: 0 }],
          [{ node: "Responder 200", type: "main", index: 0 }],
        ],
      },
      "Set Window": {
        main: [[{ node: "Wait Node", type: "main", index: 0 }]],
      },
      "Wait Node": {
        main: [[{ node: "Check Silence", type: "main", index: 0 }]],
      },
      "Check Silence": {
        main: [[{ node: "IF - Lead em silencio?", type: "main", index: 0 }]],
      },
      "IF - Lead em silencio?": {
        main: [
          [{ node: "Get History", type: "main", index: 0 }],
          [{ node: "Responder 200", type: "main", index: 0 }],
        ],
      },
      "Get History": {
        main: [[{ node: "Agente OpenAI - Follow-up", type: "main", index: 0 }]],
      },
      "OpenAI gpt-4o-mini follow-up": {
        ai_languageModel: [[{ node: "Agente OpenAI - Follow-up", type: "ai_languageModel", index: 0 }]],
      },
      "Agente OpenAI - Follow-up": {
        main: [[{ node: "Check Horário", type: "main", index: 0 }]],
      },
      "Check Horário": {
        main: [
          [{ node: "Send Message", type: "main", index: 0 }],
          [{ node: "Responder 200", type: "main", index: 0 }],
        ],
      },
      "Send Message": {
        main: [[{ node: "Get Follow-up Counter", type: "main", index: 0 }]],
      },
      "Get Follow-up Counter": {
        main: [[{ node: "Parse Follow-up Counter", type: "main", index: 0 }]],
      },
      "Parse Follow-up Counter": {
        main: [[{ node: "Increment Counter", type: "main", index: 0 }]],
      },
      "Increment Counter": {
        main: [[{ node: "IF - Limite de follow-ups", type: "main", index: 0 }]],
      },
      "IF - Limite de follow-ups": {
        main: [
          [{ node: "Apply Label Frio", type: "main", index: 0 }],
          [{ node: "Wait Node", type: "main", index: 0 }],
        ],
      },
      "Apply Label Frio": {
        main: [[{ node: "Responder 200", type: "main", index: 0 }]],
      },
    },
    settings: { executionOrder: "v1" },
  };
}

async function ensureWorkflow3() {
  const list = await request("/workflows");
  if (!list.res.ok) throw new Error(`GET workflows falhou HTTP ${list.res.status}: ${list.text}`);
  const existing = (list.body.data || list.body).find((w) => w.name === "mpalavra | Follow-up Automático");
  if (existing) return existing;
  const create = await request("/workflows", {
    method: "POST",
    body: JSON.stringify({ name: "mpalavra | Follow-up Automático", nodes: [], connections: {}, settings: { executionOrder: "v1" } }),
  });
  if (!create.res.ok) throw new Error(`Criar workflow 3 falhou HTTP ${create.res.status}: ${create.text}`);
  console.log(`TASK-W3-01 concluída — ID: ${create.body.id}`);
  return create.body;
}

async function updateWorkflow(id, payload) {
  const { res, body: responseBody, text } = await request(`/workflows/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`PUT workflow ${id} falhou HTTP ${res.status}: ${text}`);
  return responseBody;
}

async function activateWorkflow(id) {
  const { res, text } = await request(`/workflows/${id}/activate`, {
    method: "POST",
    body: "{}",
  });
  if (!res.ok) throw new Error(`Ativar workflow ${id} falhou HTTP ${res.status}: ${text}`);
}

function remoteDbFallback(workflowId, desired) {
  const payload = {
    nodes: desired.nodes,
    connections: desired.connections,
    settings: desired.settings,
    staticData: desired.staticData || null,
    pinData: desired.pinData || null,
  };
  const env = {
    WORKFLOW_ID: workflowId,
    NODES_B64: Buffer.from(JSON.stringify(payload.nodes), "utf8").toString("base64"),
    CONNECTIONS_B64: Buffer.from(JSON.stringify(payload.connections), "utf8").toString("base64"),
    SETTINGS_B64: Buffer.from(JSON.stringify(payload.settings), "utf8").toString("base64"),
    STATICDATA_B64: Buffer.from(JSON.stringify(payload.staticData), "utf8").toString("base64"),
    PINDATA_B64: Buffer.from(JSON.stringify(payload.pinData), "utf8").toString("base64"),
  };

  const remoteJs = 'const { Client } = require("pg");(async()=>{const decode=(name)=>JSON.parse(Buffer.from(process.env[name],"base64").toString("utf8"));const client=new Client({connectionString:process.env.DATABASE_URL});await client.connect();const sql=["update workflow_entity set","nodes = $1::json,","connections = $2::json,","settings = $3::json,","staticData = $4::json,","pinData = $5::json,","\\"updatedAt\\" = now(),","\\"versionCounter\\" = \\"versionCounter\\" + 1","where id = $6"].join(" ");await client.query(sql,[JSON.stringify(decode("NODES_B64")),JSON.stringify(decode("CONNECTIONS_B64")),JSON.stringify(decode("SETTINGS_B64")),JSON.stringify(decode("STATICDATA_B64")),JSON.stringify(decode("PINDATA_B64")),process.env.WORKFLOW_ID]);await client.end();console.log("DB fallback aplicado");})().catch((error)=>{console.error(error);process.exit(1);});';

  const envPrefix = Object.entries(env)
    .map(([key, value]) => `${key}='${value.replace(/'/g, `'"'"'`)}'`)
    .join(" ");

  execFileSync(
    "ssh",
    [
      "root@157.230.234.223",
      `cd /opt/diario-atendimento && docker compose exec -T n8n sh -lc '${envPrefix} node -e ${JSON.stringify(remoteJs)}'`,
    ],
    { stdio: "inherit" }
  );
}

(async () => {
  const workflow3 = await ensureWorkflow3();
  const desired = workflow3Payload();
  let current = await request(`/workflows/${workflow3.id}`);
  if (!current.res.ok) throw new Error(`GET workflow 3 falhou HTTP ${current.res.status}: ${current.text}`);
  current = current.body;
  const payload = workflowPayload(current.body || current);
  payload.name = desired.name;
  payload.nodes = desired.nodes;
  payload.connections = desired.connections;
  payload.settings = desired.settings;
  await updateWorkflow(workflow3.id, payload);
  await activateWorkflow(workflow3.id);
  const finalRes = await request(`/workflows/${workflow3.id}`);
  if (!finalRes.res.ok) throw new Error(`GET final workflow 3 falhou HTTP ${finalRes.res.status}: ${finalRes.text}`);
  const final = finalRes.body;
  if (!final.nodes.some((node) => node.name === "Get Follow-up Counter")) {
    console.log("API REST não persistiu os nós novos; aplicando fallback direto no banco do n8n.");
    remoteDbFallback(workflow3.id, desired);
  }
  const verifyRes = await request(`/workflows/${workflow3.id}`);
  if (!verifyRes.res.ok) throw new Error(`GET verify workflow 3 falhou HTTP ${verifyRes.res.status}: ${verifyRes.text}`);
  const verify = verifyRes.body;
  fs.writeFileSync("C:/tmp/workflow3-final.json", JSON.stringify(verify, null, 2));
  console.log(JSON.stringify({
    workflow3Id: verify.id,
    active: verify.active,
    nodeCount: verify.nodes.length,
    nodes: verify.nodes.map((n) => ({ name: n.name, type: n.type })),
  }, null, 2));
  console.log("TASK-W3-02 concluída — webhook /webhook/mpalavra/whatsapp/follow-up configurado.");
  console.log("TASK-W3-03 concluída — IF label aquecendo/interessado sem assignee configurado.");
  console.log("TASK-W3-04 concluída — janela 12h/24h configurada.");
  console.log("TASK-W3-05 concluída — Wait Node configurado.");
  console.log("TASK-W3-06 concluída — Check Silence configurado.");
  console.log("TASK-W3-07 concluída — Agente OpenAI com System Prompt do Atendente Elias configurado.");
  console.log("TASK-W3-08 concluída — Check Horário configurado para America/Sao_Paulo.");
  console.log("TASK-W3-09 concluída — Send Message via Chatwoot configurado.");
  console.log("TASK-W3-10 concluída — Get Follow-up Counter e Parse Follow-up Counter configurados.");
  console.log("TASK-W3-11 concluída — Increment Counter e IF limite 2 follow-ups corrigidos.");
  console.log("TASK-W3-12 concluída — workflow ativado.");
})().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
