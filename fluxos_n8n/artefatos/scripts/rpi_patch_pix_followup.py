import copy
import json
import urllib.error
import urllib.request
from datetime import datetime, timezone


BASE = "http://127.0.0.1:5678/api/v1"
PIX_ID = "ebbDSb9Z955Udl49"
FOLLOWUP_ID = "mVo6oZMEERqNmhwI"

HTTP_HEADER_CREDENTIAL = {
    "httpHeaderAuth": {
        "id": "HagGgE8Z5tPJHMtF",
        "name": "Chatwoot API Access Token",
    }
}


DECIDE_FOLLOWUP_CODE = r'''const conversation = $json.payload ?? $json.data ?? $json;
const attrs = conversation.custom_attributes ?? {};

const toInt = (value, fallback = 0) => {
  const parsed = Number.parseInt(String(value ?? ""), 10);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : fallback;
};

const normalizeStatus = (value) => {
  const raw = String(value ?? "UNKNOWN").trim().toUpperCase();

  if (["PAID", "PAGO"].includes(raw)) return "PAID";
  if (["PENDING", "PENDENTE", "PIX_ENVIADO", "PIX_PENDENTE"].includes(raw)) return "PENDING";
  if (["EXPIRED", "EXPIRADO"].includes(raw)) return "EXPIRED";
  if (["CANCELLED", "CANCELED", "CANCELADO"].includes(raw)) return "CANCELLED";

  return "UNKNOWN";
};

const accountId = conversation.account_id ?? attrs.account_id;
const conversationId = conversation.id ?? conversation.conversation_id ?? attrs.conversation_id;
const contactId = conversation.contact_id ?? attrs.contact_id;
const inboxId = conversation.inbox_id ?? attrs.inbox_id;

const pixStatus = normalizeStatus(attrs.pix_status ?? attrs.status_pagamento);
const currentCount = toInt(attrs.pix_followup_count, 0);

if (pixStatus !== "PENDING") {
  return [{
    json: {
      account_id: accountId,
      conversation_id: conversationId,
      contact_id: contactId,
      inbox_id: inboxId,
      pix_status: pixStatus,
      pix_followup_count: currentCount,
      route: "stop",
      should_send_message: false,
      should_wait_again: false,
      should_resolve: false,
      reason: "Pagamento não está pendente no Chatwoot"
    }
  }];
}

const nextCount = currentCount + 1;

let route;
let message;
let statusPagamento = "pix_pendente";
let shouldWaitAgain = false;
let shouldResolve = false;

if (nextCount === 1) {
  route = "followup_1";
  shouldWaitAgain = true;
  message = "Oi, passando só para te lembrar: seu PIX do Mapa da Palavra ainda consta como pendente por aqui. Se já pagou, eu libero seu acesso assim que a confirmação chegar.";
} else if (nextCount === 2) {
  route = "followup_2";
  shouldWaitAgain = true;
  message = "Último lembrete sobre seu PIX do Mapa da Palavra: ele ainda aparece como pendente. Se quiser continuar, é só concluir o pagamento pelo copia-e-cola que te enviei.";
} else {
  route = "cancel";
  statusPagamento = "expirado";
  shouldResolve = true;
  message = "Como o pagamento do PIX não foi confirmado, vou encerrar esta tentativa por aqui. Se quiser gerar um novo PIX depois, é só me chamar.";
}

return [{
  json: {
    account_id: accountId,
    conversation_id: conversationId,
    contact_id: contactId,
    inbox_id: inboxId,
    transaction_id: attrs.transaction_id,
    gateway_id: attrs.gateway_id,
    pix_status: nextCount > 2 ? "EXPIRED" : "PENDING",
    status_pagamento: statusPagamento,
    pix_followup_count: nextCount,
    route,
    followup_message: message,
    should_send_message: true,
    should_wait_again: shouldWaitAgain,
    should_resolve: shouldResolve,
    custom_attributes_to_update: {
      pix_status: nextCount > 2 ? "EXPIRED" : "PENDING",
      status_pagamento: statusPagamento,
      pix_followup_count: nextCount,
      pix_followup_last_action: route,
      transaction_id: attrs.transaction_id,
      gateway_id: attrs.gateway_id
    }
  }
}];'''


def key():
    return open("/root/.n8n-api-key", "r", encoding="utf-8").read().strip()


def request(method, path, body=None):
    data = None
    headers = {"X-N8N-API-KEY": key(), "Accept": "application/json"}
    if body is not None:
        data = json.dumps(body).encode("utf-8")
        headers["Content-Type"] = "application/json"
    req = urllib.request.Request(BASE + path, data=data, method=method, headers=headers)
    try:
        with urllib.request.urlopen(req, timeout=60) as resp:
            raw = resp.read().decode("utf-8")
            return resp.status, json.loads(raw) if raw else {}
    except urllib.error.HTTPError as exc:
        detail = exc.read().decode("utf-8", errors="replace")
        raise RuntimeError(f"{method} {path} failed: HTTP {exc.code} {detail}") from exc


def get_wf(workflow_id):
    return request("GET", f"/workflows/{workflow_id}")[1]


def put_wf(workflow_id, wf):
    payload = {
        "name": wf["name"],
        "nodes": wf["nodes"],
        "connections": wf.get("connections", {}),
        "settings": {
            k: v
            for k, v in wf.get("settings", {}).items()
            if k in {"executionOrder", "callerPolicy", "timezone", "saveExecutionProgress", "saveManualExecutions", "saveDataErrorExecution", "saveDataSuccessExecution", "executionTimeout", "errorWorkflow", "availableInMCP"}
        },
    }
    return request("PUT", f"/workflows/{workflow_id}", payload)


def activate(workflow_id):
    return request("POST", f"/workflows/{workflow_id}/activate")


def node_by_name(wf, name):
    for node in wf["nodes"]:
        if node.get("name") == name:
            return node
    return None


def remove_nodes_by_name(wf, names):
    wf["nodes"] = [node for node in wf["nodes"] if node.get("name") not in names]
    for source in list(wf.get("connections", {}).keys()):
        if source in names:
            del wf["connections"][source]
            continue
        for conn_type, outputs in list(wf["connections"][source].items()):
            for output in outputs:
                output[:] = [edge for edge in output if edge.get("node") not in names]


def set_main_connection(wf, source, targets):
    wf.setdefault("connections", {})[source] = {
        "main": [[{"node": target, "type": "main", "index": 0} for target in targets]]
    }


def add_or_replace_nodes(wf, nodes):
    remove_nodes_by_name(wf, {node["name"] for node in nodes})
    wf["nodes"].extend(nodes)


def patch_pix_workflow(wf):
    trigger = node_by_name(wf, "Execute Workflow Trigger — Criar PIX")
    if trigger:
        trigger.setdefault("parameters", {})["workflowInputs"] = {
            "values": [
                {"name": "conversation_id", "type": "string"},
                {"name": "contact_id", "type": "string"},
                {"name": "account_id", "type": "string"},
                {"name": "inbox_id", "type": "number"},
                {"name": "customer_email", "type": "string"},
                {"name": "customer_document", "type": "string"},
                {"name": "customer_name", "type": "string"},
                {"name": "customer_phone", "type": "string"},
                {"name": "produto", "type": "string"},
                {"name": "valor", "type": "number"},
            ]
        }

    extract = node_by_name(wf, "Set — Extrair dados PIX")
    if not extract:
        raise RuntimeError("Nó Set — Extrair dados PIX não encontrado")
    assignments = extract["parameters"]["assignments"]["assignments"]
    existing = {item["name"] for item in assignments}
    new_assignments = [
        {"id": "pix-copia-e-cola", "name": "pix_copia_e_cola", "value": "={{ $json.data.pix.qr_code }}", "type": "string"},
        {"id": "pix-transaction-id", "name": "transaction_id", "value": "={{ $json.data.id }}", "type": "string"},
        {"id": "pix-status-persistido", "name": "pix_status", "value": "PENDING", "type": "string"},
        {"id": "pix-followup-count", "name": "pix_followup_count", "value": "={{ 0 }}", "type": "number"},
    ]
    assignments.extend([item for item in new_assignments if item["name"] not in existing])

    attrs = node_by_name(wf, "HTTP — Atualizar custom attributes Chatwoot")
    if not attrs:
        raise RuntimeError("Nó HTTP — Atualizar custom attributes Chatwoot não encontrado")
    attrs["parameters"]["jsonBody"] = '={{ { custom_attributes: { pix_status: "PENDING", status_pagamento: "pix_enviado", pix_followup_count: 0, pix_followup_last_action: "pix_created", transaction_id: $json.transaction_id, gateway_id: $json.gateway_id, pix_qr_code: $json.pix_qr_code, pix_copia_e_cola: $json.pix_copia_e_cola, pix_key: $json.pix_key, produto_comprado: "Mapa da Palavra" } } }}'

    new_nodes = [
        {
            "name": "HTTP — Disparar follow-up assíncrono",
            "id": "pix-disparar-followup-async",
            "type": "n8n-nodes-base.httpRequest",
            "typeVersion": 4,
            "position": [1680, 0],
            "parameters": {
                "method": "POST",
                "url": "https://n8n.wvke.site/webhook/mpalavra/pix/followup-assincrono",
                "sendBody": True,
                "specifyBody": "json",
                "jsonBody": '={{ { account_id: $("Set — Extrair dados PIX").first().json.account_id, conversation_id: $("Set — Extrair dados PIX").first().json.conversation_id, contact_id: $("Set — Extrair dados PIX").first().json.contact_id, inbox_id: $("Set — Extrair dados PIX").first().json.inbox_id, transaction_id: $("Set — Extrair dados PIX").first().json.transaction_id, gateway_id: $("Set — Extrair dados PIX").first().json.gateway_id } }}',
                "options": {"timeout": 10000},
            },
        },
        {
            "name": "Set — Retornar dados para Tool",
            "id": "pix-retornar-dados-tool",
            "type": "n8n-nodes-base.set",
            "typeVersion": 3.4,
            "position": [1920, 0],
            "parameters": {
                "assignments": {
                    "assignments": [
                        {"name": "status", "value": "pending", "type": "string"},
                        {"name": "pix_qr_code", "value": "={{ String($('Set — Extrair dados PIX').first().json.pix_qr_code || $('Set — Extrair dados PIX').first().json.pix_key || '').trim() }}", "type": "string"},
                        {"name": "pix_copia_e_cola", "value": "={{ String($('Set — Extrair dados PIX').first().json.pix_copia_e_cola || $('Set — Extrair dados PIX').first().json.pix_qr_code || $('Set — Extrair dados PIX').first().json.pix_key || '').trim() }}", "type": "string"},
                        {"name": "valor", "value": "={{ Number($('Set — Extrair dados PIX').first().json.valor || 49.9) }}", "type": "number"},
                    ]
                },
                "options": {},
            },
        },
    ]
    add_or_replace_nodes(wf, new_nodes)
    set_main_connection(wf, "HTTP — Atualizar custom attributes Chatwoot", ["HTTP — Disparar follow-up assíncrono"])
    set_main_connection(wf, "HTTP — Disparar follow-up assíncrono", ["Set — Retornar dados para Tool"])
    wf.get("connections", {}).pop("Chatwoot — Enviar PIX", None)
    return wf


def followup_nodes():
    return [
        {
            "name": "Webhook — Follow-up PIX",
            "id": "pix-followup-webhook",
            "type": "n8n-nodes-base.webhook",
            "typeVersion": 2,
            "position": [100, 900],
            "parameters": {
                "httpMethod": "POST",
                "path": "mpalavra/pix/followup-assincrono",
                "responseMode": "onReceived",
                "responseData": "firstEntryJson",
                "options": {},
            },
        },
        {
            "name": "Wait — Timeout sem pagamento PIX",
            "id": "pix-followup-wait",
            "type": "n8n-nodes-base.wait",
            "typeVersion": 1.1,
            "position": [340, 900],
            "parameters": {"amount": 15, "unit": "minutes"},
        },
        {
            "name": "HTTP — Ler estado PIX no Chatwoot",
            "id": "pix-followup-get-chatwoot",
            "type": "n8n-nodes-base.httpRequest",
            "typeVersion": 4,
            "position": [580, 900],
            "parameters": {
                "method": "GET",
                "url": "=http://chatwoot_rails:3000/api/v1/accounts/{{ $json.account_id }}/conversations/{{ $json.conversation_id }}",
                "authentication": "genericCredentialType",
                "genericAuthType": "httpHeaderAuth",
                "sendHeaders": True,
                "headerParameters": {"parameters": [{"name": "Accept", "value": "application/json"}]},
                "options": {},
            },
            "credentials": copy.deepcopy(HTTP_HEADER_CREDENTIAL),
        },
        {
            "name": "Code — Decidir follow-up PIX",
            "id": "pix-followup-decidir",
            "type": "n8n-nodes-base.code",
            "typeVersion": 2,
            "position": [820, 900],
            "parameters": {"jsCode": DECIDE_FOLLOWUP_CODE},
        },
        {
            "name": "IF — Follow-up 1 ou 2?",
            "id": "pix-followup-if-followup",
            "type": "n8n-nodes-base.if",
            "typeVersion": 2,
            "position": [1060, 820],
            "parameters": {
                "conditions": {
                    "options": {"caseSensitive": True, "leftValue": "", "typeValidation": "strict", "version": 1},
                    "conditions": [
                        {
                            "id": "route-followup",
                            "leftValue": "={{ $json.route }}",
                            "rightValue": "followup_1,followup_2",
                            "operator": {"type": "string", "operation": "in"},
                        }
                    ],
                    "combinator": "and",
                },
                "options": {},
            },
        },
        {
            "name": "IF — Cancelar PIX?",
            "id": "pix-followup-if-cancel",
            "type": "n8n-nodes-base.if",
            "typeVersion": 2,
            "position": [1060, 1040],
            "parameters": {
                "conditions": {
                    "options": {"caseSensitive": True, "leftValue": "", "typeValidation": "strict", "version": 1},
                    "conditions": [
                        {
                            "id": "route-cancel",
                            "leftValue": "={{ $json.route }}",
                            "rightValue": "cancel",
                            "operator": {"type": "string", "operation": "equals"},
                        }
                    ],
                    "combinator": "and",
                },
                "options": {},
            },
        },
        {
            "name": "HTTP — Persistir estado follow-up PIX",
            "id": "pix-followup-put-attrs",
            "type": "n8n-nodes-base.httpRequest",
            "typeVersion": 4,
            "position": [1300, 820],
            "parameters": {
                "method": "PUT",
                "url": "=http://chatwoot_rails:3000/api/v1/accounts/{{ $json.account_id }}/conversations/{{ $json.conversation_id }}/custom_attributes",
                "authentication": "genericCredentialType",
                "genericAuthType": "httpHeaderAuth",
                "sendHeaders": True,
                "headerParameters": {"parameters": [{"name": "Content-Type", "value": "application/json"}, {"name": "Accept", "value": "application/json"}]},
                "sendBody": True,
                "specifyBody": "json",
                "jsonBody": "={{ { custom_attributes: $json.custom_attributes_to_update } }}",
                "options": {},
            },
            "credentials": copy.deepcopy(HTTP_HEADER_CREDENTIAL),
        },
        {
            "name": "HTTP — Enviar follow-up PIX",
            "id": "pix-followup-send-message",
            "type": "n8n-nodes-base.httpRequest",
            "typeVersion": 4,
            "position": [1540, 820],
            "parameters": {
                "method": "POST",
                "url": "=http://chatwoot_rails:3000/api/v1/accounts/{{ $json.account_id }}/conversations/{{ $json.conversation_id }}/messages",
                "authentication": "genericCredentialType",
                "genericAuthType": "httpHeaderAuth",
                "sendHeaders": True,
                "headerParameters": {"parameters": [{"name": "Content-Type", "value": "application/json"}, {"name": "Accept", "value": "application/json"}]},
                "sendBody": True,
                "specifyBody": "json",
                "jsonBody": "={{ { content: $json.followup_message, message_type: 'outgoing', private: false } }}",
                "options": {},
            },
            "credentials": copy.deepcopy(HTTP_HEADER_CREDENTIAL),
        },
        {
            "name": "HTTP — Reagendar follow-up PIX",
            "id": "pix-followup-redispatch",
            "type": "n8n-nodes-base.httpRequest",
            "typeVersion": 4,
            "position": [1780, 820],
            "parameters": {
                "method": "POST",
                "url": "https://n8n.wvke.site/webhook/mpalavra/pix/followup-assincrono",
                "sendBody": True,
                "specifyBody": "json",
                "jsonBody": "={{ { account_id: $json.account_id, conversation_id: $json.conversation_id, contact_id: $json.contact_id, inbox_id: $json.inbox_id, transaction_id: $json.transaction_id, gateway_id: $json.gateway_id } }}",
                "options": {"timeout": 10000},
            },
        },
        {
            "name": "HTTP — Persistir cancelamento PIX",
            "id": "pix-followup-put-cancel",
            "type": "n8n-nodes-base.httpRequest",
            "typeVersion": 4,
            "position": [1300, 1040],
            "parameters": {
                "method": "PUT",
                "url": "=http://chatwoot_rails:3000/api/v1/accounts/{{ $json.account_id }}/conversations/{{ $json.conversation_id }}/custom_attributes",
                "authentication": "genericCredentialType",
                "genericAuthType": "httpHeaderAuth",
                "sendHeaders": True,
                "headerParameters": {"parameters": [{"name": "Content-Type", "value": "application/json"}, {"name": "Accept", "value": "application/json"}]},
                "sendBody": True,
                "specifyBody": "json",
                "jsonBody": "={{ { custom_attributes: $json.custom_attributes_to_update } }}",
                "options": {},
            },
            "credentials": copy.deepcopy(HTTP_HEADER_CREDENTIAL),
        },
        {
            "name": "HTTP — Enviar cancelamento PIX",
            "id": "pix-followup-send-cancel",
            "type": "n8n-nodes-base.httpRequest",
            "typeVersion": 4,
            "position": [1540, 1040],
            "parameters": {
                "method": "POST",
                "url": "=http://chatwoot_rails:3000/api/v1/accounts/{{ $json.account_id }}/conversations/{{ $json.conversation_id }}/messages",
                "authentication": "genericCredentialType",
                "genericAuthType": "httpHeaderAuth",
                "sendHeaders": True,
                "headerParameters": {"parameters": [{"name": "Content-Type", "value": "application/json"}, {"name": "Accept", "value": "application/json"}]},
                "sendBody": True,
                "specifyBody": "json",
                "jsonBody": "={{ { content: $json.followup_message, message_type: 'outgoing', private: false } }}",
                "options": {},
            },
            "credentials": copy.deepcopy(HTTP_HEADER_CREDENTIAL),
        },
        {
            "name": "HTTP — Resolver conversa PIX",
            "id": "pix-followup-resolve",
            "type": "n8n-nodes-base.httpRequest",
            "typeVersion": 4,
            "position": [1780, 1040],
            "parameters": {
                "method": "POST",
                "url": "=http://chatwoot_rails:3000/api/v1/accounts/{{ $json.account_id }}/conversations/{{ $json.conversation_id }}/toggle_status",
                "authentication": "genericCredentialType",
                "genericAuthType": "httpHeaderAuth",
                "sendHeaders": True,
                "headerParameters": {"parameters": [{"name": "Content-Type", "value": "application/json"}, {"name": "Accept", "value": "application/json"}]},
                "sendBody": True,
                "specifyBody": "json",
                "jsonBody": '={{ { status: "resolved" } }}',
                "options": {},
            },
            "credentials": copy.deepcopy(HTTP_HEADER_CREDENTIAL),
        },
    ]


def patch_followup_workflow(wf):
    new_names = {node["name"] for node in followup_nodes()}
    remove_nodes_by_name(wf, new_names)
    wf["nodes"].extend(followup_nodes())
    set_main_connection(wf, "Webhook — Follow-up PIX", ["Wait — Timeout sem pagamento PIX"])
    set_main_connection(wf, "Wait — Timeout sem pagamento PIX", ["HTTP — Ler estado PIX no Chatwoot"])
    set_main_connection(wf, "HTTP — Ler estado PIX no Chatwoot", ["Code — Decidir follow-up PIX"])
    wf.setdefault("connections", {})["Code — Decidir follow-up PIX"] = {
        "main": [[
            {"node": "IF — Follow-up 1 ou 2?", "type": "main", "index": 0},
            {"node": "IF — Cancelar PIX?", "type": "main", "index": 0},
        ]]
    }
    set_main_connection(wf, "IF — Follow-up 1 ou 2?", ["HTTP — Persistir estado follow-up PIX"])
    set_main_connection(wf, "HTTP — Persistir estado follow-up PIX", ["HTTP — Enviar follow-up PIX"])
    set_main_connection(wf, "HTTP — Enviar follow-up PIX", ["HTTP — Reagendar follow-up PIX"])
    set_main_connection(wf, "IF — Cancelar PIX?", ["HTTP — Persistir cancelamento PIX"])
    set_main_connection(wf, "HTTP — Persistir cancelamento PIX", ["HTTP — Enviar cancelamento PIX"])
    set_main_connection(wf, "HTTP — Enviar cancelamento PIX", ["HTTP — Resolver conversa PIX"])
    return wf


def validate(pix, followup):
    pix_wait_sources = []
    for source, conns in pix.get("connections", {}).items():
        for outputs in conns.get("main", []):
            for edge in outputs:
                if edge.get("node") == "Wait — Timeout sem pagamento":
                    pix_wait_sources.append(source)
    tool_node = node_by_name(pix, "Set — Retornar dados para Tool")
    webhook = node_by_name(followup, "Webhook — Follow-up PIX")
    decide = node_by_name(followup, "Code — Decidir follow-up PIX")
    return {
        "pix_active": pix.get("active"),
        "followup_active": followup.get("active"),
        "pix_node_count": len(pix.get("nodes", [])),
        "followup_node_count": len(followup.get("nodes", [])),
        "pix_wait_in_sync_sources": pix_wait_sources,
        "tool_return_fields": [a.get("name") for a in tool_node["parameters"]["assignments"]["assignments"]] if tool_node else [],
        "followup_webhook_path": webhook["parameters"].get("path") if webhook else None,
        "decide_uses_global_static_data": "$getGlobalStaticData" in json.dumps(decide or {}, ensure_ascii=False),
    }


def main():
    pix = patch_pix_workflow(get_wf(PIX_ID))
    followup = patch_followup_workflow(get_wf(FOLLOWUP_ID))

    put_wf(PIX_ID, pix)
    put_wf(FOLLOWUP_ID, followup)
    activate(PIX_ID)
    activate(FOLLOWUP_ID)

    pix_final = get_wf(PIX_ID)
    followup_final = get_wf(FOLLOWUP_ID)
    result = validate(pix_final, followup_final)
    result["updated_at"] = datetime.now(timezone.utc).isoformat()
    print(json.dumps(result, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
