/* ==========================================================================
   /api/scraper/analyze — Endpoint de Análise Inteligente
   Raspa um site, depois envia para OmniRoute LLM analisar e retorna
   análise completa: tecnologia, conteúdo, SEO e mais.
   Firecrawl-like Scraper — thiagolab.com
   ========================================================================== */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { scrape } from '@/lib/scraper/scraper-engine';
import { convertHtmlToComponents, smartConvert } from '@/lib/scraper/html-to-components';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

const OMNIROUTE_URL = process.env.OMNIROUTE_URL || 'http://localhost:20128';
const OMNIROUTE_MODEL = process.env.OMNIROUTE_MODEL || 'oc/deepseek-v4-flash-free';

/** Tipos de análise disponíveis */
type AnalysisType = 'tecnologia' | 'conteudo' | 'seo' | 'completo';

interface AnalyzeRequest {
  url: string;
  tipo?: AnalysisType;
  model?: string;
}

/**
 * POST /api/scraper/analyze
 *
 * Raspa e analisa um site usando OmniRoute LLM.
 *
 * Body:
 * ```json
 * {
 *   "url": "https://thiago-lab.vercel.app",
 *   "tipo": "completo",
 *   "model": "oc/deepseek-v4-flash-free"
 * }
 * ```
 *
 * Tipos de análise:
 * - "tecnologia": Detecta tech stack, frameworks, CMS
 * - "conteudo": Analisa conteúdo, estrutura, tom de voz
 * - "seo": Análise SEO (meta tags, headings, links)
 * - "completo": Análise completa (default)
 */
export async function POST(request: NextRequest) {
  const startTime = Date.now();

  try {
    // ─── Validar body ────────────────────────────────────────────────
    let body: AnalyzeRequest;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { success: false, error: 'Body JSON inválido' },
        { status: 400 },
      );
    }

    const { url, tipo = 'completo', model } = body;

    if (!url || typeof url !== 'string') {
      return NextResponse.json(
        { success: false, error: 'URL é obrigatória' },
        { status: 400 },
      );
    }

    const validTipos: AnalysisType[] = ['tecnologia', 'conteudo', 'seo', 'completo'];
    const analysisType: AnalysisType = validTipos.includes(tipo as AnalysisType)
      ? (tipo as AnalysisType)
      : 'completo';

    console.log(`[Scraper Analyze] POST /api/scraper/analyze — url=${url}, tipo=${analysisType}`);

    // ─── 1. Raspar o site ────────────────────────────────────────────
    const scrapeResult = await scrape({
      url,
      depth: 1,
      extractImages: true,
      extractLinks: true,
      toMarkdown: true,
    });

    if (scrapeResult.error) {
      return NextResponse.json(
        {
          success: false,
          error: `Falha ao raspar: ${scrapeResult.error}`,
          url,
        },
        { status: 502 },
      );
    }

    console.log(`[Scraper Analyze] ✅ Site raspado: "${scrapeResult.title}" (${scrapeResult.wordCount} palavras)`);

    // ─── 2. Preparar prompt para LLM ─────────────────────────────────
    const { systemPrompt, userPrompt } = buildAnalysisPrompt(
      analysisType,
      scrapeResult,
    );

    // ─── 3. Chamar OmniRoute ─────────────────────────────────────────
    console.log(`[Scraper Analyze] 🤖 Chamando OmniRoute (${OMNIROUTE_MODEL}) para análise ${analysisType}...`);

    let llmAnalysis: string | null = null;
    let llmError: string | null = null;

    try {
      const res = await fetch(`${OMNIROUTE_URL}/v1/chat/completions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: model || OMNIROUTE_MODEL,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt },
          ],
          temperature: 0.3,
          max_tokens: 4096,
          stream: false,
        }),
        signal: AbortSignal.timeout(45000),
      });

      if (!res.ok) {
        const text = await res.text().catch(() => '');
        llmError = `HTTP ${res.status}: ${text.slice(0, 200)}`;
      } else {
        const json = await res.json();
        llmAnalysis = json.choices?.[0]?.message?.content || null;
        if (!llmAnalysis) llmError = 'Resposta vazia do LLM';
      }
    } catch (err) {
      llmError = err instanceof Error ? err.message : String(err);
    }

    // ─── 4. Análise de componentes React (conversão) ─────────────────
    const componentAnalysis = convertHtmlToComponents(scrapeResult.rawHtml || '', {
      useLlm: false,
    });

    // ─── 5. Construir resposta ───────────────────────────────────────
    const response: any = {
      success: !llmError || analysisType === 'completo',
      url: scrapeResult.url,
      title: scrapeResult.title,
      analysisType,
      duration: Date.now() - startTime,
      scrapeDuration: scrapeResult.duration,
      data: {
        tecnologia: {
          techStack: scrapeResult.techStack,
          statusCode: scrapeResult.statusCode,
        },
        seo: {
          title: scrapeResult.metadata.title,
          description: scrapeResult.metadata.description,
          ogImage: scrapeResult.metadata.ogImage,
          ogTitle: scrapeResult.metadata.ogTitle,
          canonical: scrapeResult.metadata.canonical,
          favicon: scrapeResult.metadata.favicon,
          language: scrapeResult.metadata.language,
          wordCount: scrapeResult.wordCount,
          headingsCount: scrapeResult.headings.length,
          imagesCount: scrapeResult.images.length,
          linksCount: scrapeResult.links.length,
          internalLinks: scrapeResult.links.filter((l) => l.isInternal).length,
          externalLinks: scrapeResult.links.filter((l) => l.isExternal).length,
          headings: scrapeResult.headings.slice(0, 20),
        },
        conteudo: {
          markdown: scrapeResult.markdown.slice(0, 5000),
          images: scrapeResult.images.slice(0, 10),
        },
        componentes: {
          sections: componentAnalysis.sections
            .filter((s) => s.confidence > 0.4)
            .map((s) => ({
              type: s.type,
              name: s.name,
              layout: s.layout,
              confidence: s.confidence,
              tailwindClasses: s.tailwind.slice(0, 20),
            })),
          layout: componentAnalysis.layout,
        },
      },
    };

    // Adicionar análise LLM se disponível
    if (llmAnalysis) {
      response.llmAnalysis = llmAnalysis;
    }
    if (llmError) {
      response.llmError = llmError;
    }

    console.log(`[Scraper Analyze] ✅ Análise concluída em ${Date.now() - startTime}ms`);

    return NextResponse.json(response);
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    console.error('[Scraper Analyze] ❌ Erro:', errorMessage);

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

// ─── Funções Auxiliares ─────────────────────────────────────────────────────

/**
 * Constrói prompts para análise LLM baseado no tipo.
 */
function buildAnalysisPrompt(
  tipo: AnalysisType,
  scrapeResult: any,
): { systemPrompt: string; userPrompt: string } {
  const baseSystem = `Você é um analista técnico sênior especializado em análise de sites.
Analise o site fornecido e retorne APENAS JSON válido (sem markdown, sem explicações adicionais).`;

  const baseData = `
Título: ${scrapeResult.title}
Descrição: ${scrapeResult.description}
URL: ${scrapeResult.url}
Tech Stack: ${JSON.stringify(scrapeResult.techStack, null, 2)}
Headings: ${JSON.stringify(scrapeResult.headings.slice(0, 15), null, 2)}
Links: ${scrapeResult.links.length} (${scrapeResult.links.filter((l: any) => l.isInternal).length} internos, ${scrapeResult.links.filter((l: any) => l.isExternal).length} externos)
Imagens: ${scrapeResult.images.length}
Palavras: ${scrapeResult.wordCount}
Markdown (primeiros 3000 chars):
${scrapeResult.markdown.slice(0, 3000)}`;

  switch (tipo) {
    case 'tecnologia':
      return {
        systemPrompt: `${baseSystem}
Analise a TECNOLOGIA usada no site.
Retorne JSON com:
{
  "framework": "framework principal detectado",
  "cssFramework": "framework CSS",
  "cms": "CMS se aplicável",
  "hosting": "hospedagem detectada",
  "analytics": ["ferramentas de analytics"],
  "bibliotecas": ["outras libs JS"],
  "qualidadeCodigo": "boa | media | ruim",
  "performance": "otimizado | aceitavel | lento",
  "modernidade": "moderno | classico | desatualizado",
  "observacoes": ["observações técnicas relevantes"]
}`,
        userPrompt: `Analise a tecnologia do site ${scrapeResult.url}:\n\n${baseData}`,
      };

    case 'conteudo':
      return {
        systemPrompt: `${baseSystem}
Analise o CONTEÚDO do site.
Retorne JSON com:
{
  "nicho": "nicho/mercado do site",
  "tomVoz": "formal | casual | tecnico | persuasivo | educacional",
  "publicoAlvo": "descrição do público-alvo",
  "proposito": "vendas | informacao | entretenimento | educacao | saas",
  "qualidadeConteudo": "excelente | boa | media | ruim",
  "callToAction": ["principais CTAs encontrados"],
  "secoes": ["seções identificadas"],
  "pontosFortes": ["pontos fortes do conteúdo"],
  "pontosFracos": ["pontos a melhorar"],
  "sugestoes": ["sugestões de melhoria"]
}`,
        userPrompt: `Analise o conteúdo do site ${scrapeResult.url}:\n\n${baseData}`,
      };

    case 'seo':
      return {
        systemPrompt: `${baseSystem}
Analise o SEO do site.
Retorne JSON com:
{
  "title": "qualidade do title (boa | media | ruim)",
  "metaDescription": "qualidade da meta description",
  "headingsEstrutura": "bem estruturado | pode melhorar | mal estruturado",
  "ogTags": "completas | parciais | ausentes",
  "favicon": "presente | ausente",
  "canonical": "configurado | ausente",
  "linksInternos": numero_de_links_internos,
  "linksExternos": numero_de_links_externos,
  "imagesComAlt": "quantas imagens têm alt text",
  "imagesSemAlt": "quantas imagens não têm alt text",
  "velocidadeEstimada": "rapido | medio | lento",
  "mobileFriendly": "sim | nao | parcial",
  "scoreGeral": 0-100,
  "recomendacoes": ["recomendações de SEO"]
}`,
        userPrompt: `Analise o SEO do site ${scrapeResult.url}:\n\n${baseData}\n\nImagens:\n${JSON.stringify(scrapeResult.images.slice(0, 20).map((i: any) => ({ src: i.src, alt: i.alt })), null, 2)}`,
      };

    case 'completo':
    default:
      return {
        systemPrompt: `${baseSystem}
Faça uma análise COMPLETA do site.
Retorne JSON com:
{
  "resumo": "resumo executivo do site em 2-3 frases",
  "tipoSite": "landing-page | ecommerce | blog | saas | institucional | portfolio | app",
  "nichoMercado": "nicho identificado",
  "publicoAlvo": "público-alvo",
  "tecnologia": {
    "framework": "framework",
    "cssFramework": "css framework",
    "cms": "cms",
    "hosting": "hospedagem",
    "analytics": ["analytics"]
  },
  "seo": {
    "score": 0-100,
    "titleOk": true/false,
    "descriptionOk": true/false,
    "ogTagsOk": true/false,
    "estruturaHeadings": "avaliação"
  },
  "conteudo": {
    "tomVoz": "tom",
    "qualidade": "avaliação",
    "ctas": ["CTAs"],
    "secoes": ["seções"]
  },
  "design": {
    "estilo": "moderno | classico | minimalista | criativo | corporativo",
    "layout": "grid | flex | misto",
    "cores": ["cores predominantes"],
    "responsivo": "sim | nao | parcial"
  },
  "pontosFortes": ["pontos fortes"],
  "oportunidades": ["oportunidades de melhoria"],
  "notaGeral": 1-10
}`,
        userPrompt: `Faça uma análise completa do site ${scrapeResult.url}:\n\n${baseData}`,
      };
  }
}
