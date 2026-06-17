import subprocess, sys
with open('/opt/data/tokens/vercel-token') as f:
    token = f.read().strip()

print("Deploying to Vercel --prod...", flush=True)
result = subprocess.run(
    ['npx', 'vercel', '--prod', '--token', token, '--yes'],
    capture_output=True, text=True, timeout=300,
    cwd='/opt/data/projects/thiago-lab'
)
print("STDOUT:", result.stdout[-2000:])
if result.stderr:
    print("STDERR:", result.stderr[-2000:])
print("Exit code:", result.returncode)
