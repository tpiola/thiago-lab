/* ==========================================================================
   /api/health — Health Check do sistema
   Verifica gateway OmniRoute, Vercel token e status geral
   Intelligence OS — thiagolab.com
   ========================================================================== */

import { NextResponse } from 'next/server';

const OMNIROUTE_URL = process.env.OMNIROUTE_URL || 'http://localhost:20128';
const VERCEL_TOKEN = process.env.NEXT_PUBLIC_VERCEL_TOKEN || '';

export const dynamic = 'force-dynamic';

interface CheckResult {
  status: string;
  latency?: string;
  error?: string;
  models?: number;
  user?: string;
  email?: string;
}

export async function GET() {
  const checks: Record<string, CheckResult> = {};
  const start = Date.now();

  // 1. Verificar OmniRoute Gateway
  try {
    const omniStart = Date.now();
    const omniRes = await fetch(`${OMNIROUTE_URL}/v1/models`, {
      method: 'GET',
      signal: AbortSignal.timeout(5000),
    });
    const omniLatency = Date.now() - omniStart;

    if (omniRes.ok) {
      const omniData = await omniRes.json();
      const models = Array.isArray(omniData) ? omniData.length : (omniData.data?.length ?? 0);
      checks.omniRoute = {
        status: 'Online',
        latency: `${omniLatency}ms`,
        models,
      };
    } else {
      checks.omniRoute = {
        status: 'Error',
        error: `HTTP ${omniRes.status}`,
      };
    }
  } catch (err) {
    checks.omniRoute = {
      status: 'Offline',
      error: err instanceof Error ? err.message : String(err),
    };
  }

  // 2. Verificar Vercel Token
  if (VERCEL_TOKEN && VERCEL_TOKEN.startsWith('vcp_')) {
    try {
      const vcStart = Date.now();
      const vcRes = await fetch('https://api.vercel.com/v9/user', {
        headers: { Authorization: `Bearer ${VERCEL_TOKEN}` },
        signal: AbortSignal.timeout(5000),
      });
      const vcLatency = Date.now() - vcStart;

      if (vcRes.ok) {
        const vcData = await vcRes.json();
        checks.vercel = {
          status: 'Authenticated',
          latency: `${vcLatency}ms`,
          user: vcData.user?.name,
          email: vcData.user?.email,
        };
      } else {
        checks.vercel = {
          status: 'Invalid Token',
          error: `HTTP ${vcRes.status}`,
        };
      }
    } catch (err) {
      checks.vercel = {
        status: 'Error',
        error: err instanceof Error ? err.message : String(err),
      };
    }
  } else {
    checks.vercel = {
      status: 'Not Configured',
      error: 'NEXT_PUBLIC_VERCEL_TOKEN not found',
    };
  }

  // 3. Status do servidor
  const totalTime = Date.now() - start;
  const allOk = Object.values(checks).every((c) => c.status.startsWith('O'));

  return NextResponse.json({
    status: allOk ? 'All systems operational' : 'Some services have issues',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    totalLatency: `${totalTime}ms`,
    checks,
  });
}
