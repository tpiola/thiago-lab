'use client';

/* ==========================================================================
   useN8nLeads — React hook para buscar leads do n8n webhook
   Cache de 30s, atualização automática, fallback para dados mock
   Intelligence OS — thiagolab.com
   ========================================================================== */

import { useState, useEffect, useCallback, useRef } from 'react';

/* ─── Tipos ──────────────────────────────────────────────────────── */

export interface Cliente {
  id: number | string;
  nome: string;
  empresa: string;
  telefone: string;
  email: string;
  status: 'Ativo' | 'Lead' | 'Inativo';
  ultimoContato: string;
  valor: string;
}

export interface N8nLeadsResult {
  leads: Cliente[];
  loading: boolean;
  error: string | null;
  live: boolean;
  source: 'n8n' | 'supabase' | 'mock' | 'error';
  fetchedAt: string | null;
  refetch: () => void;
}

/* ─── Mock Data (fallback) ────────────────────────────────────────── */

const CLIENTES_MOCK: Cliente[] = [
  { id: 1, nome: 'Carlos Silva', empresa: 'Empresa XYZ', telefone: '(11) 99999-0001', email: 'carlos@xyz.com', status: 'Ativo', ultimoContato: '18/06/2026', valor: 'R$ 12.000' },
  { id: 2, nome: 'Ana Costa', empresa: 'TechStart', telefone: '(11) 99999-0002', email: 'ana@techstart.com', status: 'Lead', ultimoContato: '17/06/2026', valor: 'R$ 8.500' },
  { id: 3, nome: 'Pedro Santos', empresa: 'GlobalWeb', telefone: '(21) 99999-0003', email: 'pedro@globalweb.com', status: 'Ativo', ultimoContato: '16/06/2026', valor: 'R$ 22.000' },
  { id: 4, nome: 'Julia Lima', empresa: 'NovaTech', telefone: '(31) 99999-0004', email: 'julia@novatech.com', status: 'Lead', ultimoContato: '15/06/2026', valor: 'R$ 5.000' },
  { id: 5, nome: 'Roberto Alves', empresa: 'Acme Corp', telefone: '(11) 99999-0005', email: 'roberto@acme.com', status: 'Ativo', ultimoContato: '17/06/2026', valor: 'R$ 35.000' },
  { id: 6, nome: 'Marina Dias', empresa: 'BetaTech', telefone: '(41) 99999-0006', email: 'marina@betatech.com', status: 'Lead', ultimoContato: '16/06/2026', valor: 'R$ 18.000' },
  { id: 7, nome: 'Lucas Nunes', empresa: 'Sigma Soluções', telefone: '(51) 99999-0007', email: 'lucas@sigma.com', status: 'Inativo', ultimoContato: '14/06/2026', valor: 'R$ 9.000' },
  { id: 8, nome: 'Fernanda Torres', empresa: 'MegaCorp', telefone: '(11) 99999-0008', email: 'fernanda@megacorp.com', status: 'Ativo', ultimoContato: '16/06/2026', valor: 'R$ 65.000' },
  { id: 9, nome: 'Rafael Costa', empresa: 'DataFlow', telefone: '(21) 99999-0009', email: 'rafael@dataflow.com', status: 'Ativo', ultimoContato: '15/06/2026', valor: 'R$ 28.000' },
  { id: 10, nome: 'Camila Rocha', empresa: 'WebDev Ltda', telefone: '(31) 99999-0010', email: 'camila@webdev.com', status: 'Ativo', ultimoContato: '10/06/2026', valor: 'R$ 42.000' },
  { id: 11, nome: 'Thiago Martins', empresa: 'Startup A', telefone: '(11) 99999-0011', email: 'thiago@startupa.com', status: 'Inativo', ultimoContato: '12/06/2026', valor: 'R$ 15.000' },
  { id: 12, nome: 'Amanda Oliveira', empresa: 'InovaTech', telefone: '(61) 99999-0012', email: 'amanda@inovatech.com', status: 'Lead', ultimoContato: '11/06/2026', valor: 'R$ 7.500' },
];

/* ─── Cache ────────────────────────────────────────────────────────── */

interface CacheEntry {
  data: Cliente[];
  live: boolean;
  source: 'n8n' | 'supabase' | 'mock' | 'error';
  fetchedAt: string;
  timestamp: number;
}

let cache: CacheEntry | null = null;
const CACHE_TTL = 30_000; // 30 segundos

/* ─── Hook ──────────────────────────────────────────────────────────── */

export function useN8nLeads(): N8nLeadsResult {
  const [leads, setLeads] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [live, setLive] = useState(false);
  const [source, setSource] = useState<N8nLeadsResult['source']>('mock');
  const [fetchedAt, setFetchedAt] = useState<string | null>(null);
  const mountedRef = useRef(true);

  const fetchLeads = useCallback(async () => {
    // Check cache first
    if (cache && Date.now() - cache.timestamp < CACHE_TTL) {
      setLeads(cache.data);
      setLive(cache.live);
      setSource(cache.source);
      setFetchedAt(cache.fetchedAt);
      setLoading(false);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/n8n/leads', {
        method: 'GET',
        signal: AbortSignal.timeout(10000),
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      const data = await res.json();

      if (!mountedRef.current) return;

      const hasData = Array.isArray(data.leads) && data.leads.length > 0;

      if (hasData) {
        const mapped = data.leads.map((l: Record<string, unknown>) => ({
          id: l.id || String(Math.random().toString(36).slice(2, 10)),
          nome: l.nome || 'Visitante',
          empresa: l.empresa || '—',
          telefone: l.telefone || '—',
          email: l.email || '—',
          status: (l.status === 'Ativo' || l.status === 'Lead' || l.status === 'Inativo')
            ? l.status as Cliente['status']
            : 'Lead',
          ultimoContato: l.ultimoContato || new Date().toLocaleDateString('pt-BR'),
          valor: l.valor || '—',
        }));

        const isLive = data.live === true;
        const dataSource = data.source === 'n8n' || data.source === 'supabase'
          ? (data.source as N8nLeadsResult['source'])
          : 'mock';

        cache = {
          data: mapped,
          live: isLive,
          source: dataSource,
          fetchedAt: data.fetchedAt || new Date().toISOString(),
          timestamp: Date.now(),
        };

        setLeads(mapped);
        setLive(isLive);
        setSource(dataSource);
        setFetchedAt(data.fetchedAt || null);
      } else {
        // No data from API — use mock
        cache = {
          data: CLIENTES_MOCK,
          live: false,
          source: 'mock',
          fetchedAt: new Date().toISOString(),
          timestamp: Date.now(),
        };

        setLeads(CLIENTES_MOCK);
        setLive(false);
        setSource('mock');
        setFetchedAt(null);
      }
    } catch (err) {
      if (!mountedRef.current) return;

      console.warn('[useN8nLeads] Erro ao buscar leads, usando fallback mock:', (err as Error).message);

      // Use mock data on error
      cache = {
        data: CLIENTES_MOCK,
        live: false,
        source: 'mock',
        fetchedAt: new Date().toISOString(),
        timestamp: Date.now(),
      };

      setLeads(CLIENTES_MOCK);
      setLive(false);
      setSource('mock');
      setFetchedAt(null);
      setError(null); // Error silencioso — fallback mock
    } finally {
      if (mountedRef.current) {
        setLoading(false);
      }
    }
  }, []);

  /* ─── Fetch on mount ─────────────────────────────────────────────── */
  useEffect(() => {
    mountedRef.current = true;
    fetchLeads();

    // Refresh a cada 30s
    const interval = setInterval(() => {
      cache = null; // Invalidate cache
      fetchLeads();
    }, CACHE_TTL);

    return () => {
      mountedRef.current = false;
      clearInterval(interval);
    };
  }, [fetchLeads]);

  return {
    leads,
    loading,
    error,
    live,
    source,
    fetchedAt,
    refetch: fetchLeads,
  };
}
