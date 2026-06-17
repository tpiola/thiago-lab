import subprocess, json, sys

with open('/opt/data/tokens/vercel-token') as f:
    token = f.read().strip()

uid = sys.argv[1] if len(sys.argv) > 1 else 'dpl_DsUKYKW2MdTgVL7GNMVpYREUXrHD'

auth_header = "Authorization: Bearer"
auth_header += " "
auth_header += token
url = "https://api.vercel.com/v13/deployments/"
url += uid
url += "?teamId=thiagoso"

result = subprocess.run(
    ['curl', '-s', url, '-H', auth_header],
    capture_output=True, text=True, timeout=15)
data = json.loads(result.stdout)

for key in ['state','readyState','errorCode','builder','createdAt','buildingAt','readyAt']:
    val = data.get(key)
    if val:
        print(key + ": " + str(val))

error = data.get('error')
if error:
    print("error: " + json.dumps(error, indent=2))

meta = data.get('meta', {})
for k,v in meta.items():
    print("  meta." + k + " = " + str(v))

for alias in data.get('alias', []):
    print("alias: " + str(alias))

aliases_assigned = data.get('aliasAssigned', False)
print("aliasAssigned: " + str(aliases_assigned))
