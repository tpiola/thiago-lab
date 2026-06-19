/* ==========================================================================
   /api/projects — Listar e criar projetos
   Conecta com repositórios reais do GitHub
   Intelligence OS — thiagolab.com
   ========================================================================== */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createAnonClient } from '@/lib/supabase-server';
import { fetchGitHubRepos } from '@/lib/api-real';

export const dynamic = 'force-dynamic';

/**
 * GET /api/projects — Lista projetos
 * GET /api/projects?source=github — Lista repositórios do GitHub
 * GET /api/projects?source=all — Lista projetos + GitHub combinados
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const source = searchParams.get('source') || 'db';

    // ── GitHub repos ───────────────────────────────────────────
    if (source === 'github') {
      const { data, error } = await fetchGitHubRepos();
      if (error) {
        return NextResponse.json({ error: 'GitHub unavailable', detail: error }, { status: 502 });
      }
      return NextResponse.json({
        projects: data?.map((repo) => ({
          id: repo.name,
          name: repo.name,
          description: repo.description || '',
          url: repo.url,
          language: repo.language,
          stars: repo.stars,
          forks: repo.forks,
          updatedAt: repo.updatedAt,
          source: 'github',
        })) || [],
        total: data?.length || 0,
        source: 'github',
      });
    }

    // ── Supabase projects + GitHub ─────────────────────────────
    if (source === 'all') {
      // Tenta GitHub (fallback se não disponível)
      const ghResult = await fetchGitHubRepos();
      const ghProjects = ghResult.data?.map((repo) => ({
        id: repo.name,
        name: repo.name,
        description: repo.description || '',
        url: repo.url,
        language: repo.language,
        stars: repo.stars,
        forks: repo.forks,
        updatedAt: repo.updatedAt,
        source: 'github',
      })) || [];

      // Tenta Supabase
      let dbProjects: any[] = [];
      try {
        const supabase = createAnonClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data } = await supabase
            .from('projects')
            .select('*')
            .eq('user_id', user.id)
            .order('updated_at', { ascending: false })
            .limit(50);
          if (data) dbProjects = data.map((p) => ({ ...p, source: 'database' }));
        }
      } catch {
        // Supabase pode não estar configurado
      }

      const allProjects = [...ghProjects, ...dbProjects];
      return NextResponse.json({
        projects: allProjects,
        total: allProjects.length,
        source: 'all',
      });
    }

    // ── Apenas banco de dados local ────────────────────────────
    const supabase = createAnonClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Não autorizado. Faça login primeiro.' },
        { status: 401 },
      );
    }

    const limit = Math.min(Number(searchParams.get('limit')) || 50, 100);
    const offset = Number(searchParams.get('offset')) || 0;
    const sortBy = searchParams.get('sort') || 'updated_at';
    const order = searchParams.get('order') === 'asc' ? 'asc' : 'desc';

    const { data, error, count } = await supabase
      .from('projects')
      .select('*', { count: 'exact' })
      .eq('user_id', user.id)
      .order(sortBy, { ascending: order === 'asc' })
      .range(offset, offset + limit - 1);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ projects: data, total: count, source: 'database' });
  } catch (err) {
    console.error('[GET /api/projects]', err);
    return NextResponse.json(
      { error: 'Erro interno do servidor.', detail: err instanceof Error ? err.message : String(err) },
      { status: 500 },
    );
  }
}

/**
 * POST /api/projects — Cria projeto no Supabase
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = createAnonClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Não autorizado. Faça login primeiro.' },
        { status: 401 },
      );
    }

    const body = await request.json();

    if (!body.name || typeof body.name !== 'string') {
      return NextResponse.json(
        { error: 'Campo "name" é obrigatório.' },
        { status: 400 },
      );
    }

    const { data, error } = await supabase
      .from('projects')
      .insert({
        user_id: user.id,
        name: body.name,
        blocks: body.blocks || [],
        template_id: body.template_id || null,
        domain: body.domain || null,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ project: data }, { status: 201 });
  } catch (err) {
    console.error('[POST /api/projects]', err);
    return NextResponse.json(
      { error: 'Erro interno do servidor.' },
      { status: 500 },
    );
  }
}
