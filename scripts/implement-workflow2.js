const fs = require("fs");

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
    ...overrides,
  };
}

function stableId(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function makeWorkflow2() {
  const webhook = {
    parameters: {
      httpMethod: "POST",
      path: "mpalavra/whatsapp/escalar-humano",
      responseMode: "responseNode",
      options: {},
    },
    id: stableId("webhook"),
    name: "Webhook Escalar Humano",
    type: "n8n-nodes-base.webhook",
    typeVersion: 2,
    position: [0, 0],
  };

  const filter = {
    parameters: {
      conditions: {
        options: {
          caseSensitive: true,
          leftValue: "",
          typeValidation: "strict",
          version: 3,
        },
        conditions: [
          {
            id: stableId("label"),
            leftValue: "={{ $json.body?.label }}",
            rightValue: "humano-necessario",
            operator: { type: "string", operation: "equals" },
          },
          {
            id: stableId("assignee-empty"),
            leftValue: "={{ $json.body?.conversation?.assignee_id ?? null }}",
            rightValue: "",
            operator: { type: "object", operation: "empty", singleValue: true },
          },
        ],
        combinator: "and",
      },
      options: {},
    },
    id: stableId("if-label"),
    name: "IF - Label humano necessario e sem assignee",
    type: "n8n-nodes-base.if",
    typeVersion: 2.3,
    position: [260, 0],
  };

  const respondIgnored = {
    parameters: {
      respondWith: "json",
      responseBody:
        "={{ { ok: true, ignored: true, reason: 'sem humano-necessario ou ja atribuido' } }}",
      options: { responseCode: 200 },
    },
    id: stableId("respond-ignored"),
    name: "Responder 200 - Ignorado",
    type: "n8n-nodes-base.respondToWebhook",
    typeVersion: 1.4,
    position: [520, 180],
  };

  const assign = {
    parameters: {
      method: "POST",
      url: "=http://chatwoot_rails:3000/api/v1/accounts/{{$env.CHATWOOT_ACCOUNT_ID}}/conversations/{{$json.body.conversation.id}}/assignments",
      sendHeaders: true,
      headerParameters: {
        parameters: [
          {
            name: "api_access_token",
            value: "={{ $env.CHATWOOT_API_ACCESS_TOKEN }}",
          },
        ],
      },
      sendBody: true,
      specifyBody: "json",
      jsonBody: "={{ { assignee_id: Number($env.HUMAN_AGENT_ID || 1) } }}",
      options: {},
    },
    id: stableId("assign-human"),
    name: "Assign Human Agent",
    type: "n8n-nodes-base.httpRequest",
    typeVersion: 4.2,
    position: [520, -80],
  };

  const privateNote = {
    parameters: {
      method: "POST",
      url: "=http://chatwoot_rails:3000/api/v1/accounts/{{$env.CHATWOOT_ACCOUNT_ID}}/conversations/{{$node['Webhook Escalar Humano'].json.body.conversation.id}}/messages",
      sendHeaders: true,
      headerParameters: {
        parameters: [
          {
            name: "api_access_token",
            value: "={{ $env.CHATWOOT_API_ACCESS_TOKEN }}",
          },
        ],
      },
      sendBody: true,
      specifyBody: "json",
      jsonBody:
        '={{ { content: "⚠️ Escalado para humano pelo Atendente Elias.", message_type: "activity", private: true } }}',
      options: {},
    },
    id: stableId("private-note"),
    name: "Nota privada Chatwoot",
    type: "n8n-nodes-base.httpRequest",
    typeVersion: 4.2,
    position: [780, -80],
  };

  const respondOk = {
    parameters: {
      respondWith: "json",
      responseBody:
        "={{ { ok: true, escalated: true, conversation_id: $node['Webhook Escalar Humano'].json.body.conversation.id } }}",
      options: { responseCode: 200 },
    },
    id: stableId("respond-ok"),
    name: "Responder 200 - Escalado",
    type: "n8n-nodes-base.respondToWebhook",
    typeVersion: 1.4,
    position: [1040, -80],
  };

  return {
    name: "mpalavra | Escalar Humano",
    nodes: [webhook, filter, respondIgnored, assign, privateNote, respondOk],
    connections: {
      "Webhook Escalar Humano": {
        main: [[{ node: "IF - Label humano necessario e sem assignee", type: "main", index: 0 }]],
      },
      "IF - Label humano necessario e sem assignee": {
        main: [
          [{ node: "Assign Human Agent", type: "main", index: 0 }],
          [{ node: "Responder 200 - Ignorado", type: "main", index: 0 }],
        ],
      },
      "Assign Human Agent": {
        main: [[{ node: "Nota privada Chatwoot", type: "main", index: 0 }]],
      },
      "Nota privada Chatwoot": {
        main: [[{ node: "Responder 200 - Escalado", type: "main", index: 0 }]],
      },
    },
    settings: { executionOrder: "v1" },
    active: false,
  };
}

async function getWorkflow(id) {
  const { res, body, text } = await request(`/workflows/${id}`);
  if (!res.ok) throw new Error(`GET workflow ${id} falhou HTTP ${res.status}: ${text}`);
  return body;
}

async function updateWorkflow(id, workflow, overrides = {}) {
  const payload = workflowPayload(workflow, overrides);
  const { res, body, text } = await request(`/workflows/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`PUT workflow ${id} falhou HTTP ${res.status}: ${text}`);
  return body;
}

async function activateWorkflow(id) {
  const { res, body, text } = await request(`/workflows/${id}/activate`, {
    method: "POST",
    body: "{}",
  });
  if (!res.ok) throw new Error(`Ativar workflow ${id} falhou HTTP ${res.status}: ${text}`);
  return body;
}

async function createWorkflow() {
  const desired = makeWorkflow2();
  const existingList = await request("/workflows");
  if (!existingList.res.ok) {
    throw new Error(`GET workflows falhou HTTP ${existingList.res.status}: ${existingList.text}`);
  }
  const existing = (existingList.body.data || existingList.body).find(
    (workflow) => workflow.name === desired.name,
  );
  if (existing) {
    console.log(`TASK-W2-01 existente — ID: ${existing.id}`);
    return getWorkflow(existing.id);
  }

  let create = await request("/workflows", {
    method: "PUT",
    body: JSON.stringify({
      name: desired.name,
      nodes: [],
      connections: {},
      settings: desired.settings,
    }),
  });

  if (create.res.status === 405 || create.res.status === 404) {
    create = await request("/workflows", {
      method: "POST",
      body: JSON.stringify({
        name: desired.name,
        nodes: [],
        connections: {},
        settings: desired.settings,
      }),
    });
  }

  if (!create.res.ok) {
    throw new Error(`Criar workflow falhou HTTP ${create.res.status}: ${create.text}`);
  }
  console.log(`TASK-W2-01 concluída — ID: ${create.body.id}`);
  return create.body;
}

function addWorkflow1Guard(workflow) {
  const beforeNodeCount = workflow.nodes.length;
  const triggerName = "TRIGGER - Webhook mensagem recebida";
  const firstNodeName = "NÓ 1 - Extrair dados da mensagem Chatwoot";
  const ignoredName = "Responder 200 - Ignorado";

  if (workflow.nodes.some((node) => node.name === "IF - Humano ativo?")) {
    return { workflow, onlyOneNodeAdded: false, alreadyExists: true };
  }

  const guard = {
    parameters: {
      conditions: {
        options: {
          caseSensitive: true,
          leftValue: "",
          typeValidation: "strict",
          version: 3,
        },
        conditions: [
          {
            id: stableId("human-active"),
            leftValue: "={{ $json.body?.conversation?.assignee_id ?? null }}",
            rightValue: "",
            operator: { type: "object", operation: "notEmpty", singleValue: true },
          },
        ],
        combinator: "and",
      },
      options: {},
    },
    id: stableId("if-human-active"),
    name: "IF - Humano ativo?",
    type: "n8n-nodes-base.if",
    typeVersion: 2.3,
    position: [136, 0],
  };

  workflow.nodes.push(guard);
  workflow.connections[triggerName] = {
    main: [[{ node: "IF - Humano ativo?", type: "main", index: 0 }]],
  };
  workflow.connections["IF - Humano ativo?"] = {
    main: [
      [{ node: ignoredName, type: "main", index: 0 }],
      [{ node: firstNodeName, type: "main", index: 0 }],
    ],
  };

  return {
    workflow,
    onlyOneNodeAdded: workflow.nodes.length === beforeNodeCount + 1,
    alreadyExists: false,
  };
}

(async () => {
  const logs = [];

  let workflow2 = await createWorkflow();
  const workflow2Id = workflow2.id;

  const desiredW2 = makeWorkflow2();
  workflow2.name = desiredW2.name;
  workflow2.nodes = desiredW2.nodes;
  workflow2.connections = desiredW2.connections;
  workflow2.settings = desiredW2.settings;

  workflow2 = await updateWorkflow(workflow2Id, workflow2);
  logs.push(`TASK-W2-02 concluída — Webhook path mpalavra/whatsapp/escalar-humano salvo.`);
  logs.push("TASK-W2-03 concluída — IF label humano-necessario + assignee vazio configurado.");
  logs.push("TASK-W2-05 concluída — Assign Human Agent usa CHATWOOT_ACCOUNT_ID/CHATWOOT_API_ACCESS_TOKEN e HUMAN_AGENT_ID fallback 1.");
  logs.push("TASK-W2-06 concluída — Nota privada Chatwoot configurada.");

  const wf1Before = await getWorkflow(workflow1Id);
  const guardResult = addWorkflow1Guard(wf1Before);
  if (!guardResult.alreadyExists) {
    await updateWorkflow(workflow1Id, guardResult.workflow);
  }
  const wf1After = await getWorkflow(workflow1Id);
  logs.push(
    `TASK-W2-04 concluída — guard Workflow 1 ${guardResult.alreadyExists ? "já existia" : "adicionado"}; onlyOneNodeAdded=${guardResult.onlyOneNodeAdded}; nodeCount=${wf1After.nodes.length}`,
  );

  await activateWorkflow(workflow2Id);
  const verifyW2 = await getWorkflow(workflow2Id);
  logs.push(`TASK-W2-07 concluída — active=${verifyW2.active}`);

  const summary = {
    workflow2Id,
    workflow2Name: verifyW2.name,
    workflow2Active: verifyW2.active,
    workflow2Nodes: verifyW2.nodes.map((node) => ({
      name: node.name,
      type: node.type,
    })),
    workflow1GuardExists: wf1After.nodes.some((node) => node.name === "IF - Humano ativo?"),
    logs,
  };

  fs.writeFileSync("/tmp/workflow2-implementation-summary.json", JSON.stringify(summary, null, 2));
  console.log(JSON.stringify(summary, null, 2));
})().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
