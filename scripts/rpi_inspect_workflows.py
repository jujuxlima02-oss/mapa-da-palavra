import json
import urllib.request


BASE = "http://127.0.0.1:5678/api/v1"
WORKFLOWS = {
    "pix": "ebbDSb9Z955Udl49",
    "followup": "mVo6oZMEERqNmhwI",
    "main": "bkVfT1QcpWGokG69",
}


def api_get(path):
    key = open("/root/.n8n-api-key", "r", encoding="utf-8").read().strip()
    req = urllib.request.Request(
        BASE + path,
        headers={"X-N8N-API-KEY": key, "Accept": "application/json"},
    )
    with urllib.request.urlopen(req, timeout=30) as resp:
        return json.loads(resp.read().decode("utf-8"))


def summarize_node(node):
    return {
        "name": node.get("name"),
        "id": node.get("id"),
        "type": node.get("type"),
        "position": node.get("position"),
        "parameters": node.get("parameters", {}),
        "credentials": node.get("credentials", {}),
    }


def main():
    out = {}
    for label, workflow_id in WORKFLOWS.items():
        wf = api_get(f"/workflows/{workflow_id}")
        nodes = wf.get("nodes", [])
        out[label] = {
            "id": wf.get("id"),
            "name": wf.get("name"),
            "active": wf.get("active"),
            "node_count": len(nodes),
            "connection_groups": len(wf.get("connections", {})),
            "nodes": [summarize_node(node) for node in nodes],
            "connections": wf.get("connections", {}),
            "settings": wf.get("settings", {}),
        }
    print(json.dumps(out, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
