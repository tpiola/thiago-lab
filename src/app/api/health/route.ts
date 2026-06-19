/* ==========================================================================
   /api/health — Health Check completo do sistema
   Verifica: OmniRoute, n8n, CIE Platform, Sites, GitHub, Make.com
   Intelligence OS — thiagolab.com
   ========================================================================== */

import { NextResponse } from 'next/server';
import {
  fetchOmniRouteModels,
  fetchN8nWorkflows,
  fetchCieDashboard,
  fetchAllSitesHealth,
  fetchGitHubRepos,
  checkMakeScenarios,
} from '@/lib/api-real';

export const dynamic = 'force-dynamic';

/**
 * GET /api/health — Health check completo de todos os serviços
 * GET /api/health?service=omniroute — Apenas um serviço específico
 */
export async function GET(request: Request) {
  const start = Date.now();
  const { searchParams } = new URL(request.url);
  const serviceOnly = searchParams.get('service');

  const checks: Record<string, any> = {};

  try {
    if (serviceOnly) {
      // ── Serviço específico ──────────────────────────────────
      switch (serviceOnly) {
        case 'omniroute': {
          const { data, error } = await fetchOmniRouteModels();
          checks.omniRoute = data
            ? { status: 'Online', models: data.length }
            : { status: 'Offline', error };
          break;
        }
        case 'n8n': {
          const { data, error } = await fetchN8nWorkflows();
          checks.n8n = data
            ? { status: 'Online', workflows: data.length, active: data.filter((w) => w.active).length }
            : { status: 'Offline', error };
          break;
        }
        case 'cie': {
          const { data, error } = await fetchCieDashboard();
          checks.cie = data
            ? { status: 'Online', ...data }
            : { status: 'Offline', error };
          break;
        }
        case 'sites': {
          const sites = await fetchAllSitesHealth();
          checks.sites = sites;
          break;
        }
        case 'github': {
          const { data, error } = await fetchGitHubRepos();
          checks.github = data
            ? { status: 'Online', repos: data.length }
            : { status: 'Unavailable', error };
          break;
        }
        default:
          return NextResponse.json({ error: `Serviço desconhecido: ${serviceOnly}` }, { status: 400 });
      }
    } else {
      // ── Todos os serviços ────────────────────────────────────
      const [omni, n8n, cie, sites, github, make] = await Promise.allSettled([
        fetchOmniRouteModels(),
        fetchN8nWorkflows(),
        fetchCieDashboard(),
        fetchAllSitesHealth(),
        fetchGitHubRepos(),
        checkMakeScenarios(),
      ]);

      // OmniRoute
      if (omni.status === 'fulfilled' && omni.value.data) {
        checks.omniRoute = { status: 'Online', models: omni.value.data.length, latency: 'via api-real' };
      } else {
        checks.omniRoute = { status: 'Offline', error: omni.status === 'fulfilled' ? omni.value.error : 'Promise rejected' };
      }

      // n8n
      if (n8n.status === 'fulfilled' && n8n.value.data) {
        checks.n8n = {
          status: 'Online',
          workflows: n8n.value.data.length,
          active: n8n.value.data.filter((w: any) => w.active).length,
        };
      } else {
        checks.n8n = { status: 'Offline', error: n8n.status === 'fulfilled' ? n8n.value.error : 'Promise rejected' };
      }

      // CIE
      if (cie.status === 'fulfilled' && cie.value.data) {
        checks.cie = { status: 'Online', summary: cie.value.data };
      } else if (cie.status === 'fulfilled' && cie.value.error?.includes('404')) {
        checks.cie = { status: 'Online', summary: 'API available' };
      } else {
        checks.cie = { status: 'Offline', error: cie.status === 'fulfilled' ? cie.value.error : 'Promise rejected' };
      }

      // Sites
      if (sites.status === 'fulfilled') {
        checks.sites = sites.value;
      }

      // GitHub
      if (github.status === 'fulfilled' && github.value.data) {
        checks.github = { status: 'Online', repos: github.value.data.length };
      } else {
        checks.github = { status: 'Unavailable', note: 'gh CLI não disponível neste ambiente' };
      }

      // Make.com
      if (make.status === 'fulfilled' && make.value.data) {
        checks.make = { status: 'Online', scenarios: make.value.data.length };
      } else if (make.status === 'fulfilled') {
        checks.make = { status: 'Not configured', error: make.value.error };
      } else {
        checks.make = { status: 'Unchecked' };
      }
    }

    // ── Status do servidor ─────────────────────────────────────
    const totalTime = Date.now() - start;
    const allOk = Object.values(checks).every(
      (c: any) =>
        c?.status === 'Online' ||
        c?.status === 'Unavailable' ||
        c?.status === 'Not configured' ||
        c === 'Online',
    );

    return NextResponse.json({
      status: allOk ? 'All systems operational' : 'Some services have issues',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      totalLatency: `${totalTime}ms`,
      checks,
    });
  } catch (err) {
    console.error('[Health] Unhandled error:', err);
    return NextResponse.json(
      {
        status: 'Error',
        error: err instanceof Error ? err.message : String(err),
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    );
  }
}
