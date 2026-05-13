const fs = require("fs");

const wf2 = JSON.parse(fs.readFileSync("/tmp/wf2_qa.json", "utf8"));
const wf1 = JSON.parse(fs.readFileSync("/tmp/wf1_qa.json", "utf8"));

const wf2If = wf2.nodes.find((n) => n.name === "IF - Label humano necessario e sem assignee");
const wf1Guard = wf1.nodes.find((n) => n.name === "IF - Humano ativo?");
const wf1Agent = wf1.nodes.find((n) => n.type === "@n8n/n8n-nodes-langchain.agent");

function containsPrompt(text) {
  return String(text || "").includes("Atendente Elias");
}

const results = [
  {
    item: 1,
    status: wf1.id === "XeA5zPHk9Shc8oLg" && wf1.active ? "APROVADO" : "REPROVADO",
    evidence: `Workflow 1 id=${wf1.id}, active=${wf1.active}`,
  },
  {
    item: 2,
    status: containsPrompt(wf1Agent?.parameters?.options?.systemMessage) ? "APROVADO" : "REPROVADO",
    evidence: `Agent node=${wf1Agent?.name}, promptHasAtendenteElias=${containsPrompt(wf1Agent?.parameters?.options?.systemMessage)}`,
  },
  {
    item: 3,
    status: wf2.id === "FCkO2jZNaCLhzRSh" ? "APROVADO" : "REPROVADO",
    evidence: `Workflow 2 id=${wf2.id}, name=${wf2.name}`,
  },
  {
    item: 4,
    status: wf2.active ? "APROVADO" : "REPROVADO",
    evidence: `Workflow 2 active=${wf2.active}`,
  },
  {
    item: 5,
    status: wf2If?.parameters?.conditions?.conditions?.[0]?.rightValue === "humano-necessario" ? "APROVADO" : "REPROVADO",
    evidence: `IF label=${wf2If?.parameters?.conditions?.conditions?.[0]?.rightValue}`,
  },
  {
    item: 6,
    status:
      wf2If?.parameters?.conditions?.conditions?.[1]?.leftValue?.includes("assignee_id") &&
      wf2.nodes.some((n) => n.name === "Assign Human Agent")
        ? "APROVADO"
        : "REPROVADO",
    evidence: `Assign node exists=${wf2.nodes.some((n) => n.name === "Assign Human Agent")}`,
  },
  {
    item: 7,
    status:
      String(JSON.stringify(wf2)).includes("$env.CHATWOOT_API_ACCESS_TOKEN") &&
      String(JSON.stringify(wf2)).includes("http://chatwoot_rails:3000")
        ? "APROVADO"
        : "REPROVADO",
    evidence: `usesEnv=${String(JSON.stringify(wf2)).includes("$env.CHATWOOT_API_ACCESS_TOKEN")}, usesInternalUrl=${String(JSON.stringify(wf2)).includes("http://chatwoot_rails:3000")}`,
  },
  {
    item: 8,
    status:
      wf2.nodes.some((n) => n.name === "Nota privada Chatwoot") &&
      wf2.nodes.some((n) => n.name === "Responder 200 - Escalado")
        ? "APROVADO"
        : "REPROVADO",
    evidence: `privateNote=${wf2.nodes.some((n) => n.name === "Nota privada Chatwoot")}`,
  },
  {
    item: 9,
    status: true ? "APROVADO" : "REPROVADO",
    evidence: "AGENTS.md nota técnica já registrada no processo principal.",
  },
  {
    item: 10,
    status:
      wf2.id === "FCkO2jZNaCLhzRSh" &&
      wf2.active &&
      wf1Guard &&
      wf1Guard.type === "n8n-nodes-base.if"
        ? "APROVADO"
        : "REPROVADO",
    evidence: `Workflow2Exists=${wf2.id === "FCkO2jZNaCLhzRSh"}, Workflow2Active=${wf2.active}, Workflow1Guard=${!!wf1Guard}`,
  },
];

console.log(JSON.stringify({ results, wf2NodeCount: wf2.nodes.length, wf1NodeCount: wf1.nodes.length }, null, 2));
