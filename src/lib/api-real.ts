/* ==========================================================================
   api-real.ts — Camada de APIs Reais
   Conecta thiagolab.com com n8n, CIE Platform, OmniRoute, GitHub e serviços
   Intelligence OS — thiagolab.com
   ========================================================================== */

// ─── Constantes ────────────────────────────────────────────────────────────

const N8N_API_URL = process.env.N8N_API_URL || 'http://localhost:32768';
const N8N_API_KEY = process.env.N8N_API_KEY || '';
const N8N_WEBHOOK_LEAD = process.env.N8N_WEBHOOK_LEAD || 'http://localhost:32768/webhook/captura-lead';
const CIE_API_URL = process.env.CIE_API_URL || 'http://localhost:8000';
const OMNIROUTE_URL = process.env.OMNIROUTE_URL || 'http://localhost:20128';
const OMNIROUTE_MODEL = process.env.OMNIROUTE_MODEL || 'oc/deepseek-v4-flash-free';
const MAKE_API_URL = 'https://eu1.make.com/api/v2';
const MAKE_API_TOKEN = process.env.MAKE_API_TOKEN || '';

const SITES = [
  'https://thiagopiola.com.br',
  'https://saudegpt.com.br',
  'https://reidasvendas.com.br',
  'https://thiago-lab.vercel.app',
];

/** Timeout padrão de 5s para chamadas externas */
function controller(ms = 5000): AbortController {
  return new AbortController();
}

// ─── Helpers ───────────────────────────────────────────────────────────────

function n8nHeaders(): Record<string, string> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (N8N_API_KEY) headers['X-N8N-API-KEY'] = N8N_API_KEY;
  return headers;
}

async function safeFetch<T>(
  url: string,
  options: RequestInit = {},
  timeoutMs = 5000,
): Promise<{ data: T | null; error: string | null }> {
  const ac = new AbortController();
  const timer = setTimeout(() => ac.abort(), timeoutMs);
  try {
    const res = await fetch(url, { ...options, signal: ac.signal });
    clearTimeout(timer);
    if (!res.ok) {
      const text = await res.text().catch(() => '');
      return { data: null, error: `HTTP ${res.status}: ${text.slice(0, 200)}` };
    }
    const data = (await res.json()) as T;
    return { data, error: null };
  } catch (err) {
    clearTimeout(timer);
    const msg = err instanceof Error ? err.message : String(err);
    return { data: null, error: msg };
  }
}

// ─── n8n ───────────────────────────────────────────────────────────────────

export interface N8nWorkflow {
  id: string;
  name: string;
  active: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface N8nExecution {
  id: string;
  workflowId: string;
  status: string;
  startedAt?: string;
  finishedAt?: string;
}

/**
 * Busca execuções recentes do n8n (geral, ou filtradas por workflow)
 */
export async function fetchN8nExecutions(
  workflowId?: string,
  limit = 20,
): Promise<{ data: N8nExecution[] | null; error: string | null }> {
  let url = `${N8N_API_URL}/api/v1/executions?limit=${limit}`;
  if (workflowId) url += `&workflowId=${workflowId}`;
  return safeFetch<N8nExecution[]>(url, { headers: n8nHeaders() });
}

/**
 * Busca leads capturados — execuções do workflow de captura de leads
 * Workflow: "🤝 Captura de Leads - Site → n8n → Telegram" (id: sVqDjfKZjtE4xMm6)
 */
export async function fetchN8nLeads(limit = 50): Promise<{
  data: N8nExecution[] | null;
  error: string | null;
}> {
  return fetchN8nExecutions('sVqDjfKZjtE4xMm6', limit);
}

/**
 * Lista workflows ativos do n8n
 */
export async function fetchN8nWorkflows(): Promise<{
  data: N8nWorkflow[] | null;
  error: string | null;
}> {
  const { data, error } = await safeFetch<{ data: N8nWorkflow[] }>(
    `${N8N_API_URL}/api/v1/workflows`,
    { headers: n8nHeaders() },
  );
  if (data?.data) return { data: data.data, error: null };
  if (Array.isArray(data)) return { data: data as N8nWorkflow[], error: null };
  return { data: null, error };
}

/**
 * Envia lead para o webhook do n8n
 */
export async function submitLeadToN8n(lead: {
  name: string;
  email: string;
  phone?: string;
  message?: string;
  source?: string;
}): Promise<{ data: any; error: string | null }> {
  console.log('[API-REAL] Enviando lead para n8n webhook:', lead.email);
  return safeFetch<any>(N8N_WEBHOOK_LEAD, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ...lead,
      source: lead.source || 'thiagolab.com',
      capturedAt: new Date().toISOString(),
    }),
  });
}

// ─── CIE Platform ──────────────────────────────────────────────────────────

export interface CieSummary {
  total_investigations?: number;
  active_enterprises?: number;
  recent_alerts?: number;
  [key: string]: unknown;
}

/**
 * Busca dashboard/summary da CIE Platform
 */
export async function fetchCieDashboard(): Promise<{
  data: CieSummary | null;
  error: string | null;
}> {
  return safeFetch<CieSummary>(`${CIE_API_URL}/api/dashboard/summary`);
}

/**
 * Busca análise de concorrentes via CIE
 */
export async function fetchCieCompetitors(
  empresa: string,
  setor?: string,
): Promise<{ data: any; error: string | null }> {
  return safeFetch<any>(`${CIE_API_URL}/api/competitors/analyze`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ empresa, setor: setor || '' }),
  });
}

/**
 * Busca informações de uma empresa
 */
export async function fetchCieEnterprise(
  enterpriseId: string,
): Promise<{ data: any; error: string | null }> {
  return safeFetch<any>(`${CIE_API_URL}/api/enterprise/${enterpriseId}`);
}

/**
 * Busca score de uma empresa
 */
export async function fetchCieScore(
  enterpriseId: string,
): Promise<{ data: any; error: string | null }> {
  return safeFetch<any>(`${CIE_API_URL}/api/score/${enterpriseId}`);
}

/**
 * Inicia investigação na CIE
 */
export async function fetchCieInvestigate(params: {
  empresa: string;
  localizacao?: string;
  mercado?: string;
}): Promise<{ data: any; error: string | null }> {
  return safeFetch<any>(`${CIE_API_URL}/api/investigate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
}

// ─── OmniRoute Gateway ─────────────────────────────────────────────────────

export interface OmniRouteModel {
  id: string;
  object?: string;
  created?: number;
  owned_by?: string;
}

/**
 * Lista modelos disponíveis no gateway OmniRoute
 */
export async function fetchOmniRouteModels(): Promise<{
  data: OmniRouteModel[] | null;
  error: string | null;
}> {
  const { data, error } = await safeFetch<{ data: OmniRouteModel[] }>(
    `${OMNIROUTE_URL}/v1/models`,
  );
  if (data?.data) return { data: data.data, error: null };
  if (Array.isArray(data)) return { data, error: null };
  return { data: null, error };
}

/**
 * Envia prompt para OmniRoute usando OpenAI-compatible chat completions
 * Retorna o texto completo (não-streaming)
 */
export async function fetchOmniRouteChat(
  prompt: string,
  options?: {
    model?: string;
    system?: string;
    temperature?: number;
    maxTokens?: number;
  },
): Promise<{ data: string | null; error: string | null }> {
  const body = {
    model: options?.model || OMNIROUTE_MODEL,
    messages: [
      ...(options?.system ? [{ role: 'system' as const, content: options.system }] : []),
      { role: 'user' as const, content: prompt },
    ],
    temperature: options?.temperature ?? 0.7,
    max_tokens: options?.maxTokens ?? 2048,
    stream: false,
  };

  try {
    const res = await fetch(`${OMNIROUTE_URL}/v1/chat/completions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(30000),
    });

    if (!res.ok) {
      const text = await res.text().catch(() => '');
      return { data: null, error: `HTTP ${res.status}: ${text.slice(0, 200)}` };
    }

    const json = await res.json();
    const content = json.choices?.[0]?.message?.content || null;
    return { data: content, error: null };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return { data: null, error: msg };
  }
}

// ─── Sites ─────────────────────────────────────────────────────────────────

export interface SiteHealthResult {
  url: string;
  status: 'Online' | 'Offline' | 'Error';
  httpStatus?: number;
  latency?: string;
  error?: string;
}

/**
 * Verifica se um site está online
 */
export async function fetchSiteHealth(
  url: string,
): Promise<SiteHealthResult> {
  const start = Date.now();
  try {
    const res = await fetch(url, {
      method: 'HEAD',
      signal: AbortSignal.timeout(5000),
    });
    const latency = Date.now() - start;
    return {
      url,
      status: res.ok ? 'Online' : 'Error',
      httpStatus: res.status,
      latency: `${latency}ms`,
    };
  } catch (err) {
    return {
      url,
      status: 'Offline',
      error: err instanceof Error ? err.message : String(err),
    };
  }
}

/**
 * Verifica saúde de todos os sites monitorados
 */
export async function fetchAllSitesHealth(): Promise<SiteHealthResult[]> {
  const results = await Promise.allSettled(SITES.map(fetchSiteHealth));
  return results.map((r) =>
    r.status === 'fulfilled' ? r.value : { url: 'unknown', status: 'Error' as const, error: r.reason },
  );
}

// ─── GitHub ────────────────────────────────────────────────────────────────

export interface GitHubRepo {
  name: string;
  description: string | null;
  url: string;
  language?: string;
  stars?: number;
  forks?: number;
  updatedAt?: string;
}

/**
 * Busca repositórios do tpiola via gh CLI
 */
export async function fetchGitHubRepos(): Promise<{
  data: GitHubRepo[] | null;
  error: string | null;
}> {
  try {
    const { execSync } = await import('child_process');
    const output = execSync(
      'gh repo list tpiola --limit 50 --json name,description,url,language,stargazerCount,forkCount,updatedAt',
      { encoding: 'utf-8', timeout: 10000 },
    );
    const repos = JSON.parse(output) as GitHubRepo[];
    return { data: repos, error: null };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error('[API-REAL] GitHub CLI error:', msg);
    return { data: null, error: msg };
  }
}

// ─── Make.com ──────────────────────────────────────────────────────────────

export interface MakeScenario {
  id: number;
  name: string;
  active: boolean;
  lastRun?: string;
}

/**
 * Verifica cenários ativos no Make.com
 */
export async function checkMakeScenarios(): Promise<{
  data: MakeScenario[] | null;
  error: string | null;
}> {
  if (!MAKE_API_TOKEN || MAKE_API_TOKEN === 'seu-make-api-token-aqui') {
    return {
      data: null,
      error: 'Make.com API token não configurado',
    };
  }
  return safeFetch<MakeScenario[]>(`${MAKE_API_URL}/scenarios?active=true`, {
    headers: { Authorization: `Token ${MAKE_API_TOKEN}` },
  });
}

// ─── Health Check Geral ────────────────────────────────────────────────────

export async function runFullHealthCheck(): Promise<{
  status: string;
  timestamp: string;
  checks: Record<string, any>;
}> {
  const [omniModels, workflows, cieSummary, sites, ghRepos] = await Promise.allSettled([
    fetchOmniRouteModels(),
    fetchN8nWorkflows(),
    fetchCieDashboard(),
    fetchAllSitesHealth(),
    fetchGitHubRepos(),
  ]);

  const checks: Record<string, any> = {};

  // OmniRoute
  if (omniModels.status === 'fulfilled' && omniModels.value.data) {
    checks.omniRoute = { status: 'Online', models: omniModels.value.data.length };
  } else {
    checks.omniRoute = {
      status: 'Error',
      error: omniModels.status === 'fulfilled' ? omniModels.value.error : 'Promise rejected',
    };
  }

  // n8n
  if (workflows.status === 'fulfilled' && workflows.value.data) {
    checks.n8n = {
      status: 'Online',
      workflows: workflows.value.data.length,
      active: workflows.value.data.filter((w) => w.active).length,
    };
  } else {
    checks.n8n = {
      status: 'Error',
      error: workflows.status === 'fulfilled' ? workflows.value.error : 'Promise rejected',
    };
  }

  // CIE
  if (cieSummary.status === 'fulfilled' && cieSummary.value.data) {
    checks.cie = { status: 'Online', ...cieSummary.value.data };
  } else {
    checks.cie = {
      status: cieSummary.status === 'fulfilled' && cieSummary.value.error ? 'Empty' : 'Offline',
    };
  }

  // Sites
  checks.sites = sites;

  // GitHub
  if (ghRepos.status === 'fulfilled' && ghRepos.value.data) {
    checks.github = { status: 'Online', repos: ghRepos.value.data.length };
  } else {
    checks.github = { status: 'Unavailable', error: 'gh CLI not available' };
  }

  const allOk = Object.values(checks).every(
    (c: any) => c?.status === 'Online' || c?.status === 'Empty',
  );

  return {
    status: allOk ? 'All systems operational' : 'Some services have issues',
    timestamp: new Date().toISOString(),
    checks,
  };
}
