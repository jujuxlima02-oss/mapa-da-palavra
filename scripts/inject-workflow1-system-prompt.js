const fs = require("fs");

const key = process.env.N8N_API_KEY;
const workflowId = process.env.WORKFLOW_ID || "XeA5zPHk9Shc8oLg";
const promptPath = process.env.PROMPT_PATH || "/tmp/atendente-diario-biblico.md";
const apiBase = process.env.N8N_API_BASE || "https://n8n.wvke.site/api/v1";

if (!key) {
  throw new Error("N8N_API_KEY env ausente");
}

const prompt = fs.readFileSync(promptPath, "utf8");
const url = `${apiBase}/workflows/${workflowId}`;
const headers = {
  "X-N8N-API-KEY": key,
  "Content-Type": "application/json",
};

function withoutSystemPrompt(workflow) {
  const copy = JSON.parse(JSON.stringify(workflow));
  const agent = copy.nodes.find(
    (node) => node.type === "@n8n/n8n-nodes-langchain.agent",
  );
  if (agent?.parameters?.options) {
    agent.parameters.options.systemMessage = "__PROMPT__";
  }
  return copy;
}

(async () => {
  const beforeResponse = await fetch(url, { headers });
  if (!beforeResponse.ok) {
    throw new Error(`GET before failed HTTP ${beforeResponse.status}`);
  }

  const before = await beforeResponse.json();
  const agent = before.nodes.find(
    (node) => node.type === "@n8n/n8n-nodes-langchain.agent",
  );
  if (!agent) {
    throw new Error("Nó Agente OpenAI não encontrado");
  }

  const oldPrompt = agent.parameters?.options?.systemMessage || "";
  agent.parameters ||= {};
  agent.parameters.options ||= {};
  agent.parameters.options.systemMessage = prompt;

  const body = {
    name: before.name,
    nodes: before.nodes,
    connections: before.connections,
    settings: {
      executionOrder: before.settings?.executionOrder || "v1",
    },
    staticData: before.staticData || null,
  };

  const patchResponse = await fetch(url, {
    method: process.env.N8N_UPDATE_METHOD || "PUT",
    headers,
    body: JSON.stringify(body),
  });

  if (!patchResponse.ok) {
    const text = await patchResponse.text();
    throw new Error(
      `Workflow update failed HTTP ${patchResponse.status}: ${text.slice(0, 1000)}`,
    );
  }

  const afterResponse = await fetch(url, { headers });
  if (!afterResponse.ok) {
    throw new Error(`GET after failed HTTP ${afterResponse.status}`);
  }

  const after = await afterResponse.json();
  const afterAgent = after.nodes.find(
    (node) => node.type === "@n8n/n8n-nodes-langchain.agent",
  );
  const newPrompt = afterAgent.parameters?.options?.systemMessage || "";

  const beforeNormalized = withoutSystemPrompt(before);
  const afterNormalized = withoutSystemPrompt(after);

  console.log(
    JSON.stringify(
      {
        node: afterAgent.name,
        field: "parameters.options.systemMessage",
        oldLength: oldPrompt.length,
        newLength: newPrompt.length,
        startsWith: newPrompt.slice(0, 200),
        containsAtendenteElias: newPrompt.includes("Atendente Elias"),
        onlySystemPromptChanged:
          JSON.stringify(beforeNormalized.nodes) ===
            JSON.stringify(afterNormalized.nodes) &&
          JSON.stringify(beforeNormalized.connections) ===
            JSON.stringify(afterNormalized.connections),
      },
      null,
      2,
    ),
  );
})().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
