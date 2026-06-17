import urllib.request
import json

all_repos = []
page = 1
while True:
    url = f"https://api.github.com/users/inematds/repos?per_page=100&page={page}"
    req = urllib.request.Request(url, headers={"User-Agent": "Hermes/1.0"})
    try:
        resp = urllib.request.urlopen(req)
        data = json.loads(resp.read())
    except Exception as e:
        print(f"Error on page {page}: {e}")
        break
    if not data:
        break
    all_repos.extend(data)
    print(f"Page {page}: {len(data)} repos (total: {len(all_repos)})")
    page += 1

with open('/tmp/inematds_all_repos.json', 'w') as f:
    json.dump(all_repos, f, indent=2)
print(f"\nTotal: {len(all_repos)} repositories saved to /tmp/inematds_all_repos.json")
