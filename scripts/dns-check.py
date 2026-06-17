#!/usr/bin/env python3
import json, urllib.request, sys

token = open("/opt/data/tokens/hostinger-token").read().strip()
domain = sys.argv[1] if len(sys.argv) > 1 else "thiagolab.com"

headers = {
    "Authorization": f"Bearer {token}",
    "Content-Type": "application/json",
    "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36",
    "Origin": "https://hpanel.hostinger.com",
    "Referer": "https://hpanel.hostinger.com/"
}

# GET current DNS
req = urllib.request.Request(
    f"https://developers.hostinger.com/api/dns/v1/zones/{domain}",
    headers=headers,
    method="GET"
)
try:
    with urllib.request.urlopen(req, timeout=15) as resp:
        data = json.loads(resp.read())
        print(f"GET Status: {resp.status}")
        print(json.dumps(data, indent=2)[:3000])
except urllib.error.HTTPError as e:
    print(f"GET HTTP {e.code}: {e.read().decode()[:1000]}")
