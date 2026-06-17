#!/usr/bin/env python3
"""
Deploy thiagolab.com para VPS Hostinger (195.200.2.101)
Uso: python3 scripts/deploy-vps.py
"""
import json, urllib.request, sys, os

token = open("/opt/data/tokens/hostinger-token").read().strip()
domain = "thiagolab.com"
vps_ip = "195.200.2.101"

headers = {
    "Authorization": f"Bearer {token}",
    "Content-Type": "application/json",
    "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36",
    "Origin": "https://hpanel.hostinger.com",
    "Referer": "https://hpanel.hostinger.com/"
}

# 1. Confirmar DNS
print("=" * 60)
print("  DEPLOY thiagolab.com → VPS Hostinger")
print("=" * 60)

print("\n1. Verificando DNS...")
req = urllib.request.Request(
    f"https://developers.hostinger.com/api/dns/v1/zones/{domain}",
    headers=headers, method="GET"
)
try:
    with urllib.request.urlopen(req, timeout=15) as resp:
        dns = json.loads(resp.read())
        for r in dns:
            if r.get("name") == "@" and r.get("type") == "A":
                ip = r["records"][0]["content"]
                print(f"   A record @ → {ip}")
                if ip == vps_ip:
                    print("   ✅ Apontando para VPS!")
                else:
                    print(f"   ⚠️ Ainda aponta para {ip} (propagação pendente)")
except Exception as e:
    print(f"   ❌ Erro: {e}")

# 2. Instruções VPS
print("\n2. DEPLOY MANUAL NA VPS:")
print("-" * 60)
print("""   Acesse hPanel: https://hpanel.hostinger.com/vps/830509/overview
   Ou SSH (requer senha root):

   # No VPS:
   cd /docker
   git clone https://github.com/tpiola/thiago-lab.git thiagolab
   cd thiagolab
   docker compose up -d --build

   # Traefik já deve detectar o container pelas labels
   # Verificar logs:
   docker logs thiagolab --tail 20

   # Verificar Traefik:
   docker exec traefik traefik healthcheck
""")

print("3. VERIFICAR DEPLOY:")
print("-" * 60)
print(f"""   curl -sI https://thiagolab.com
   curl -sI https://www.thiagolab.com
""")

print("4. STATUS ATUAL:")
# Check current HTTP response
try:
    req2 = urllib.request.Request(
        f"https://{domain}",
        headers={"User-Agent": "Mozilla/5.0"},
        method="GET"
    )
    with urllib.request.urlopen(req2, timeout=10) as resp:
        print(f"   HTTP {resp.status} - {domain}")
except Exception as e:
    print(f"   Ainda não responde: {e}")

print("\n✅ Script concluído.")
