/* ==========================================================================
   /api/scraper/scrape — Endpoint de Raspagem
   Aceita URL e profundidade, executa o motor de scraping e retorna
   dados completos estruturados com tempo de execução.
   Firecrawl-like Scraper — thiagolab.com
   ========================================================================== */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { scrape, deepScrape } from '@/lib/scraper/scraper-engine';

export const dynamic = 'force-dynamic';
export const maxDuration = 60; // 60s no Vercel

/**
 * POST /api/scraper/scrape
 *
 * Raspa uma URL e retorna dados estruturados.
 *
 * Body:
 * ```json
 * {
 *   "url": "https://thiagolab.com",
 *   "depth": 1,
 *   "extractImages": true,
 *   "extractLinks": true,
 *   "toMarkdown": true
 * }
 * ```
 *
 * Resposta:
 * ```json
 * {
 *   "success": true,
 *   "data": { ... ScrapeResult ... },
 *   "duration": 1234
 * }
 * ```
 */
export async function POST(request: NextRequest) {
  const startTime = Date.now();

  try {
    // ─── Validar body ────────────────────────────────────────────────
    let body: any;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { success: false, error: 'Body JSON inválido' },
        { status: 400 },
      );
    }

    const { url, depth = 1, extractImages = true, extractLinks = true, toMarkdown = true } = body;

    if (!url || typeof url !== 'string') {
      return NextResponse.json(
        { success: false, error: 'URL é obrigatória' },
        { status: 400 },
      );
    }

    // ─── Validar profundidade ────────────────────────────────────────
    const parsedDepth = typeof depth === 'number' ? Math.max(1, Math.min(3, depth)) : 1;

    console.log(`[Scraper API] POST /api/scraper/scrape — url=${url}, depth=${parsedDepth}`);

    // ─── Executar scraping ───────────────────────────────────────────
    let result;
    if (parsedDepth > 1) {
      result = await deepScrape({ url, depth: parsedDepth, extractImages, extractLinks, toMarkdown });
    } else {
      result = await scrape({ url, depth: parsedDepth, extractImages, extractLinks, toMarkdown });
    }

    const totalDuration = Date.now() - startTime;

    // ─── Tratar erro ─────────────────────────────────────────────────
    if (result.error) {
      return NextResponse.json(
        {
          success: false,
          error: result.error,
          url: result.url,
          duration: result.duration,
          totalDuration,
          partialData: {
            title: result.title,
            description: result.description,
            statusCode: result.statusCode,
          },
        },
        { status: 502 },
      );
    }

    // ─── Retornar dados ──────────────────────────────────────────────
    console.log(`[Scraper API] ✅ ${result.url} — ${result.duration}ms, ${result.wordCount} palavras`);

    return NextResponse.json({
      success: true,
      data: {
        url: result.url,
        title: result.title,
        description: result.description,
        markdown: result.markdown,
        techStack: result.techStack,
        headings: result.headings,
        images: result.images,
        links: {
          total: result.links.length,
          internal: result.links.filter((l) => l.isInternal).length,
          external: result.links.filter((l) => l.isExternal).length,
          items: result.links.slice(0, 50), // limitar para não estourar payload
        },
        metadata: result.metadata,
        wordCount: result.wordCount,
        statusCode: result.statusCode,
        depth: parsedDepth,
        pages: 'pages' in result ? (result as any).pages?.length || 0 : 0,
      },
      duration: result.duration,
      totalDuration,
    });
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    console.error('[Scraper API] ❌ Erro:', errorMessage);

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
        duration: Date.now() - startTime,
      },
      { status: 500 },
    );
  }
}

/**
 * GET /api/scraper/scrape?url=https://thiagolab.com&depth=1
 *
 * Versão simplificada via query params para testes rápidos.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get('url');
  const depth = parseInt(searchParams.get('depth') || '1', 10);

  if (!url) {
    return NextResponse.json(
      {
        success: false,
        error: 'Use ?url=https://...&depth=1',
        exemplo: '/api/scraper/scrape?url=https://thiagolab.com',
      },
      { status: 400 },
    );
  }

  // Reutilizar o POST handler criando um request simulado
  return POST(
    new Request(request.url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url, depth }),
    }) as NextRequest,
  );
}
