#!/usr/bin/env python3
import json, urllib.request, sys

token = open("/opt/data/tokens/hostinger-token").read().strip()
domain = sys.argv[1] if len(sys.argv) > 1 else "thiagolab.com"
vps_ip = "195.200.2.101"

headers = {
    "Authorization": f"Bearer {token}",
    "Content-Type": "application/json",
    "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36",
    "Origin": "https://hpanel.hostinger.com",
    "Referer": "https://hpanel.hostinger.com/"
}

payload = {
    "overwrite": True,
    "zone": [
        {"name": "@", "type": "A", "ttl": 300, "records": [{"content": vps_ip}]},
        {"name": "www", "type": "CNAME", "ttl": 300, "records": [{"content": "thiagolab.com."}]},
    ]
}

data = json.dumps(payload).encode()
req = urllib.request.Request(
    f"https://developers.hostinger.com/api/dns/v1/zones/{domain}",
    data=data,
    headers=headers,
    method="PUT"
)

try:
    with urllib.request.urlopen(req, timeout=20) as resp:
        result = json.loads(resp.read())
        print(f"✅ PUT Status: {resp.status}")
        print(json.dumps(result, indent=2)[:2000])
except urllib.error.HTTPError as e:
    print(f"❌ HTTP {e.code}: {e.reason}")
    print(e.read().decode()[:1000])
