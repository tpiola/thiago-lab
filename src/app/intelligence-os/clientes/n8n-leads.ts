'use client';

/* ==========================================================================
   useN8nLeads — React hook para buscar leads do n8n webhook
   Cache de 30s, atualização automática
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
        // No data from API — empty state
        cache = {
          data: [],
          live: false,
          source: 'error',
          fetchedAt: new Date().toISOString(),
          timestamp: Date.now(),
        };

        setLeads([]);
        setLive(false);
        setSource('error');
        setFetchedAt(null);
      }
    } catch (err) {
      if (!mountedRef.current) return;

      console.warn('[useN8nLeads] Erro ao buscar leads:', (err as Error).message);

      // Empty state on error
      cache = {
        data: [],
        live: false,
        source: 'error',
        fetchedAt: new Date().toISOString(),
        timestamp: Date.now(),
      };

      setLeads([]);
      setLive(false);
      setSource('error');
      setFetchedAt(null);
      setError('Não foi possível conectar à fonte de dados. Configure o n8n webhook.');
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
