/* ==========================================================================
   /api/cie/investigate — Nova análise de concorrente
   Intelligence OS — thiagolab.com
   ========================================================================== */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const CIE_API_URL = process.env.CIE_API_URL || 'http://localhost:3000';
const OMNIROUTE_URL = process.env.OMNIROUTE_URL || 'http://localhost:20128';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const { company, industry, location } = await req.json();

    if (!company || typeof company !== 'string' || company.trim().length < 2) {
      return NextResponse.json(
        { error: 'Nome da empresa é obrigatório (mín. 2 caracteres)' },
        { status: 400 },
      );
    }

    // Try CIE API first
    try {
      const res = await fetch(`${CIE_API_URL}/api/cie/investigate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ company, industry, location }),
        signal: AbortSignal.timeout(15000),
      });

      if (res.ok) {
        const data = await res.json();
        return NextResponse.json({
          ...data,
          source: 'cie-platform',
        });
      }
    } catch { /* fall through */ }

    // Use OmniRoute for AI-generated analysis
    const systemPrompt = `Você é um analista de mercado especializado em competitive intelligence.
Analise a empresa fornecida e gere um relatório SWOT completo em JSON.
Responda APENAS com JSON no formato:
{
  "company": "nome",
  "industry": "setor",
  "location": "localização",
  "swot": {
    "strengths": ["força1", "força2", "força3"],
    "weaknesses": ["fraqueza1", "fraqueza2", "fraqueza3"],
    "opportunities": ["oportunidade1", "oportunidade2", "oportunidade3"],
    "threats": ["ameaça1", "ameaça2", "ameaça3"]
  },
  "overallScore": 0-100,
  "marketPosition": "leader|challenger|niche|emerging",
  "keyInsights": ["insight1", "insight2"],
  "recommendations": ["recomendação1", "recomendação2"]
}`;

    const aiRes = await fetch(`${OMNIROUTE_URL}/v1/chat/completions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'tllm/deepseek_v4',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Analise a empresa: ${company}${industry ? `, setor: ${industry}` : ''}${location ? `, localização: ${location}` : ''}` },
        ],
        max_tokens: 1024,
        temperature: 0.3,
        stream: false,
      }),
      signal: AbortSignal.timeout(30000),
    });

    if (aiRes.ok) {
      const aiData = await aiRes.json();
      const content = aiData.choices?.[0]?.message?.content || '';
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return NextResponse.json({
          ...parsed,
          source: 'omniroute-ai',
          analyzedAt: new Date().toISOString(),
        });
      }
    }

    // Ultimate fallback
    return NextResponse.json({
      company,
      industry: industry || 'Tecnologia',
      location: location || 'Desconhecida',
      swot: {
        strengths: [`Marca ${company} reconhecida no mercado`, 'Equipe experiente', 'Tecnologia proprietária'],
        weaknesses: ['Presença digital limitada', 'Dependência de parceiros', 'Escalabilidade'],
        opportunities: ['Expansão para novos mercados', 'Parcerias estratégicas', 'Inovação em produto'],
        threats: ['Concorrentes estabelecidos', 'Mudanças regulatórias', 'Pressão de preços'],
      },
      overallScore: 65,
      marketPosition: 'challenger',
      keyInsights: [
        `${company} tem potencial para crescer no segmento ${industry || 'tecnologia'}`,
        'Pontos fortes podem ser alavancados com investimento em marketing digital',
      ],
      recommendations: [
        'Fortalecer presença digital e SEO',
        'Investir em diferenciação de produto',
        'Criar programa de referência',
      ],
      source: 'mock-fallback',
      analyzedAt: new Date().toISOString(),
    });
  } catch (err) {
    return NextResponse.json(
      { error: 'Erro interno ao analisar concorrente', details: err instanceof Error ? err.message : String(err) },
      { status: 500 },
    );
  }
}
