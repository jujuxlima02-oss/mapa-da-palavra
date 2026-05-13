import json
import urllib.request

key = open("/root/.n8n-api-key", "r", encoding="utf-8").read().strip()
req = urllib.request.Request(
    "http://127.0.0.1:5678/api/v1/workflows/ebbDSb9Z955Udl49",
    headers={"X-N8N-API-KEY": key, "Accept": "application/json"},
)
wf = json.load(urllib.request.urlopen(req, timeout=30))
nodes = [
    node
    for node in wf["nodes"]
    if "Trigger" in node.get("name", "") or node.get("type") == "n8n-nodes-base.executeWorkflowTrigger"
]
print(json.dumps(nodes, ensure_ascii=False, indent=2))
