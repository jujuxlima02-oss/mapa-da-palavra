import json
import urllib.request


BASE = "http://127.0.0.1:5678/api/v1"
IDS = {
    "pix": "ebbDSb9Z955Udl49",
    "followup": "mVo6oZMEERqNmhwI",
}


def get(path):
    key = open("/root/.n8n-api-key", "r", encoding="utf-8").read().strip()
    req = urllib.request.Request(
        BASE + path,
        headers={"X-N8N-API-KEY": key, "Accept": "application/json"},
    )
    return json.load(urllib.request.urlopen(req, timeout=30))


def node(wf, name):
    return next((item for item in wf["nodes"] if item.get("name") == name), None)


def next_nodes(wf, name):
    result = []
    for output in wf.get("connections", {}).get(name, {}).get("main", []):
        result.extend(edge.get("node") for edge in output)
    return result


def has_global_static_data(wf):
    return "$getGlobalStaticData" in json.dumps(wf, ensure_ascii=False)


def main():
    pix = get(f"/workflows/{IDS['pix']}")
    followup = get(f"/workflows/{IDS['followup']}")
    return_node = node(pix, "Set — Retornar dados para Tool")
    followup_get = node(followup, "HTTP — Ler estado PIX no Chatwoot")
    decide = node(followup, "Code — Decidir follow-up PIX")
    validation = {
        "pix": {
            "active": pix.get("active"),
            "node_count": len(pix.get("nodes", [])),
            "sync_chain": {
                "Set — Extrair dados PIX": next_nodes(pix, "Set — Extrair dados PIX"),
                "HTTP — Atualizar custom attributes Chatwoot": next_nodes(pix, "HTTP — Atualizar custom attributes Chatwoot"),
                "HTTP — Disparar follow-up assíncrono": next_nodes(pix, "HTTP — Disparar follow-up assíncrono"),
                "Set — Retornar dados para Tool": next_nodes(pix, "Set — Retornar dados para Tool"),
            },
            "tool_return_fields": [
                item.get("name")
                for item in return_node["parameters"]["assignments"]["assignments"]
            ],
            "tool_return_options": return_node["parameters"].get("options", {}),
            "uses_global_static_data": has_global_static_data(pix),
        },
        "followup": {
            "active": followup.get("active"),
            "node_count": len(followup.get("nodes", [])),
            "webhook_path": node(followup, "Webhook — Follow-up PIX")["parameters"].get("path"),
            "fresh_state_get_url": followup_get["parameters"].get("url"),
            "decide_after_get": next_nodes(followup, "HTTP — Ler estado PIX no Chatwoot"),
            "decide_has_required_routes": all(
                text in decide["parameters"].get("jsCode", "")
                for text in ["followup_1", "followup_2", "cancel", "stop"]
            ),
            "uses_global_static_data": has_global_static_data(followup),
        },
    }
    print(json.dumps(validation, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
