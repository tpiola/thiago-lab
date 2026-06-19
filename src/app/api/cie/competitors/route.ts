/* ==========================================================================
   /api/cie/competitors — Concorrentes da CIE Platform
   Intelligence OS — thiagolab.com
   ========================================================================== */

import { NextResponse } from 'next/server';

const CIE_API_URL = process.env.CIE_API_URL || 'http://localhost:3000';
const OMNIROUTE_URL = process.env.OMNIROUTE_URL || 'http://localhost:20128';

export const dynamic = 'force-dynamic';

/* ─── Mock Fallback ─── */
const MOCK_COMPETITORS = [
  {
    id: '1',
    name: 'DataPulse AI',
    logo: 'DP',
    color: '#6366f1',
    price: '$299/mês',
    features: 42,
    traffic: '2.4M',
    rating: 4.8,
    social: '145K',
    seo: 92, ads: 85, content: 78, socialMedia: 88,
    swot: {
      strengths: ['Modelos proprietários', 'API robusta', 'Ecossistema completo'],
      weaknesses: ['Curva de aprendizado alta', 'Preço elevado', 'Documentação limitada'],
      opportunities: ['Expansão LatAm', 'Parcerias enterprise', 'Mobile-first'],
      threats: ['Concorrentes open-source', 'Regulação IA', 'Commoditização'],
    },
    threats: [
      { type: 'redesign', label: 'Redesign do Dashboard', date: '2 dias atrás', severity: 'medium' },
      { type: 'funding', label: 'Série C de $50M', date: '1 semana atrás', severity: 'high' },
    ],
    position: { price: 85, quality: 92 },
    shareOfVoice: 32,
    industry: 'IA Generativa',
    location: 'San Francisco, EUA',
  },
  {
    id: '2',
    name: 'NeuralStack', logo: 'NS', color: '#f59e0b',
    price: '$149/mês', features: 35, traffic: '1.8M', rating: 4.5, social: '98K',
    seo: 78, ads: 72, content: 85, socialMedia: 70,
    swot: {
      strengths: ['Preço competitivo', 'UX simplificada', 'Suporte rápido'],
      weaknesses: ['Menos integrações', 'Performance variável', 'Recursos limitados'],
      opportunities: ['Nicho SMB', 'Verticalização', 'Automação low-code'],
      threats: ['Gigantes entrando', 'Churn alto', 'Falta de diferenciação'],
    },
    threats: [{ type: 'feature', label: 'Nova feature de AutoML', date: '3 dias atrás', severity: 'high' }],
    position: { price: 45, quality: 65 },
    shareOfVoice: 24,
    industry: 'ML Platform',
    location: 'Austin, EUA',
  },
  {
    id: '3',
    name: 'CognitiveCore', logo: 'CC', color: '#10b981',
    price: '$499/mês', features: 50, traffic: '890K', rating: 4.2, social: '67K',
    seo: 65, ads: 60, content: 72, socialMedia: 55,
    swot: {
      strengths: ['Deep learning avançado', 'Time de pesquisa forte', 'Precisão superior'],
      weaknesses: ['Alto custo', 'Setup complexo', 'Suporte lento'],
      opportunities: ['Mercado acadêmico', 'Governança IA', 'Ferramentas éticas'],
      threats: ['Brain drain', 'Custos de infra', 'Regulamentação'],
    },
    threats: [
      { type: 'funding', label: 'Aquisição pela BigTech', date: '2 semanas atrás', severity: 'critical' },
      { type: 'redesign', label: 'Rebranding completo', date: '5 dias atrás', severity: 'low' },
    ],
    position: { price: 95, quality: 78 },
    shareOfVoice: 18,
    industry: 'Deep Learning',
    location: 'Toronto, Canadá',
  },
  {
    id: '4',
    name: 'SynthMind', logo: 'SM', color: '#ec4899',
    price: '$79/mês', features: 28, traffic: '3.1M', rating: 4.6, social: '210K',
    seo: 88, ads: 91, content: 65, socialMedia: 94,
    swot: {
      strengths: ['Growth hacking', 'Viralidade', 'Comunidade forte'],
      weaknesses: ['Retenção baixa', 'Monetização fraca', 'Feature set raso'],
      opportunities: ['Modelo freemium', 'Gamificação', 'Expansão B2B'],
      threats: ['Mudanças algoritmo', 'Cansaço audiência', 'Custos aquisição'],
    },
    threats: [{ type: 'feature', label: 'Integração com TikTok Ads', date: '1 dia atrás', severity: 'medium' }],
    position: { price: 20, quality: 55 },
    shareOfVoice: 26,
    industry: 'Growth AI',
    location: 'Berlim, Alemanha',
  },
];

export async function GET() {
  // Try real CIE Platform API first
  try {
    const res = await fetch(`${CIE_API_URL}/api/cie/competitors`, {
      signal: AbortSignal.timeout(5000),
    });
    if (res.ok) {
      const data = await res.json();
      return NextResponse.json({
        competitors: Array.isArray(data) ? data : data.competitors || data.data || [],
        source: 'cie-platform',
        total: Array.isArray(data) ? data.length : (data.competitors?.length || data.data?.length || 0),
      });
    }
  } catch {
    // Fallback to mock
  }

  // Try OmniRoute-based analysis as secondary source
  try {
    const aiRes = await fetch(`${OMNIROUTE_URL}/v1/chat/completions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'tllm/deepseek_v4',
        messages: [
          { role: 'system', content: 'Você é um analista de mercado. Responda apenas com JSON contendo uma lista de concorrentes de IA no mercado.' },
          { role: 'user', content: 'Liste 4 principais concorrentes no mercado de IA generativa com nome, setor e localização.' },
        ],
        max_tokens: 512,
        temperature: 0.3,
        stream: false,
      }),
      signal: AbortSignal.timeout(10000),
    });

    if (aiRes.ok) {
      const aiData = await aiRes.json();
      const content = aiData.choices?.[0]?.message?.content || '';
      try {
        const parsed = JSON.parse(content);
        const aiCompetitors = Array.isArray(parsed) ? parsed : parsed.competitors || [];
        if (aiCompetitors.length >= 2) {
          return NextResponse.json({
            competitors: aiCompetitors.map((c: any, i: number) => ({
              ...MOCK_COMPETITORS[i],
              ...c,
              id: `ai-${i}`,
            })),
            source: 'omniroute-ai',
            total: aiCompetitors.length,
          });
        }
      } catch { /* fall through to mock */ }
    }
  } catch { /* fall through to mock */ }

  // Ultimate fallback: mock data
  return NextResponse.json({
    competitors: MOCK_COMPETITORS,
    source: 'mock-fallback',
    total: MOCK_COMPETITORS.length,
  });
}
