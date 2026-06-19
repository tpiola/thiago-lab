/* ==========================================================================
   /api/analytics/stats — Métricas reais dos serviços Intelligence OS
   GitHub, n8n, Make.com, OmniRoute, sites monitorados
   Intelligence OS — thiagolab.com
   ========================================================================== */

import { NextResponse } from 'next/server';

const OMNIROUTE_URL = process.env.OMNIROUTE_URL || 'http://localhost:20128';
const N8N_URL = process.env.N8N_URL || 'http://127.0.0.1:5678';
const GITHUB_TOKEN = process.env.GITHUB_TOKEN || '';
const GITHUB_REPO = process.env.GITHUB_REPO || 'thiago-lab';

export const dynamic = 'force-dynamic';

async function checkSite(url: string): Promise<{ status: number; label: string }> {
  try {
    const res = await fetch(url, { method: 'HEAD', signal: AbortSignal.timeout(5000) });
    return { status: res.status, label: res.ok ? 'Online' : `HTTP ${res.status}` };
  } catch {
    return { status: 0, label: 'Offline' };
  }
}

export async function GET() {
  // Run all checks in parallel with fallbacks
  const results = await Promise.allSettled([
    // 1. OmniRoute models count
    (async () => {
      try {
        const res = await fetch(`${OMNIROUTE_URL}/v1/models`, { signal: AbortSignal.timeout(5000) });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        const models = (data.data || data || []).filter((m: any) => !m.type || m.type === 'llm' || !m.type);
        return { label: 'Modelos OmniRoute Ativos', value: models.length, unit: 'modelos', status: 'online' as const };
      } catch (e) {
        return { label: 'Modelos OmniRoute Ativos', value: 25, unit: 'modelos (fallback)', status: 'degraded' as const, error: (e as Error).message };
      }
    })(),

    // 2. GitHub repositories
    (async () => {
      if (!GITHUB_TOKEN) {
        return { label: 'Repositórios GitHub', value: 12, unit: 'repos (estimado)', status: 'degraded' as const, error: 'GITHUB_TOKEN não configurado' };
      }
      try {
        const res = await fetch('https://api.github.com/user/repos?per_page=100&type=all', {
          headers: { Authorization: `Bearer ${GITHUB_TOKEN}`, Accept: 'application/vnd.github.v3+json' },
          signal: AbortSignal.timeout(8000),
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const repos = await res.json();
        return { label: 'Repositórios GitHub', value: Array.isArray(repos) ? repos.length : 0, unit: 'repos', status: 'online' as const };
      } catch (e) {
        return { label: 'Repositórios GitHub', value: 12, unit: 'repos (fallback)', status: 'degraded' as const, error: (e as Error).message };
      }
    })(),

    // 3. n8n workflows
    (async () => {
      try {
        const res = await fetch(`${N8N_URL}/api/v1/workflows`, {
          signal: AbortSignal.timeout(5000),
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        const workflows = data.data || data.results || data || [];
        const activeCount = Array.isArray(workflows) ? workflows.filter((w: any) => w.active).length : 0;
        return { label: 'Workflows n8n', value: Array.isArray(workflows) ? workflows.length : 0, sublabel: `${activeCount} ativos`, unit: 'workflows', status: 'online' as const };
      } catch (e) {
        return { label: 'Workflows n8n', value: 3, unit: 'workflows (fallback)', status: 'degraded' as const, error: (e as Error).message };
      }
    })(),

    // 4. Make.com scenarios (via API)
    (async () => {
      const MAKE_API_KEY = process.env.MAKE_API_KEY;
      const MAKE_TEAM_ID = process.env.MAKE_TEAM_ID;
      if (!MAKE_API_KEY) {
        return { label: 'Cenários Make.com', value: 5, unit: 'cenários (estimado)', status: 'degraded' as const, error: 'MAKE_API_KEY não configurada' };
      }
      try {
        const res = await fetch(`https://eu1.make.com/api/v2/scenarios?teamId=${MAKE_TEAM_ID || 1}`, {
          headers: { Authorization: `Token ${MAKE_API_KEY}` },
          signal: AbortSignal.timeout(8000),
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        const scenarios = data.scenarios || [];
        return { label: 'Cenários Make.com', value: scenarios.length, unit: 'cenários', status: 'online' as const };
      } catch (e) {
        return { label: 'Cenários Make.com', value: 5, unit: 'cenários (fallback)', status: 'degraded' as const, error: (e as Error).message };
      }
    })(),

    // 5. Site status checks
    (async () => {
      const sites = [
        { name: 'thiagolab.com', url: process.env.NEXT_PUBLIC_APP_URL || 'https://thiagolab.com' },
        { name: 'OmniRoute API', url: `${OMNIROUTE_URL}/v1/models` },
        { name: 'n8n API', url: N8N_URL },
      ];
      const results = await Promise.all(sites.map(s => checkSite(s.url)));
      const online = results.filter(r => r.status === 200 || r.status === 0).length;
      return {
        label: 'Status dos Sites',
        value: `${online}/${sites.length} online`,
        sites: sites.map((s, i) => ({ name: s.name, status: results[i].label })),
        status: online === sites.length ? 'online' as const : 'degraded' as const,
      };
    })(),
  ]);

  // Compile results
  const metrics = results.map((r, i) => {
    if (r.status === 'fulfilled') return r.value;
    return { label: `Metric ${i}`, value: 'N/A', status: 'error' as const };
  });

  // Count online services
  const onlineCount = metrics.filter(m => m.status === 'online').length;
  const totalServices = metrics.length;

  return NextResponse.json({
    timestamp: new Date().toISOString(),
    overall: onlineCount === totalServices ? 'all-online' : onlineCount > totalServices / 2 ? 'degraded' : 'critical',
    summary: `${onlineCount}/${totalServices} serviços online`,
    metrics,
  });
}
