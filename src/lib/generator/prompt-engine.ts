/* ==========================================================================
   prompt-engine.ts — Motor de Interpretação de Prompts
   Analisa prompts do usuário usando OmniRoute LLM e extrai parâmetros
   estruturados para geração de sites premium.
   AI Site Generator — thiagolab.com
   ========================================================================== */

// ─── Tipos ──────────────────────────────────────────────────────────────────

export type SiteType =
  | 'landing'
  | 'saas'
  | 'ecommerce'
  | 'portfolio'
  | 'blog'
  | 'app'
  | 'institutional'
  | 'restaurant'
  | 'health'
  | 'education'
  | 'event'
  | 'agency';

export type ToneType =
  | 'luxo'
  | 'moderno'
  | 'minimalista'
  | 'corporativo'
  | 'criativo'
  | 'tecnico'
  | 'divertido'
  | 'elegante'
  | 'profissional'
  | 'jovem'
  | 'sério';

export interface ParsedPrompt {
  /** Tipo de site detectado */
  type: SiteType;
  /** Setor/indústria */
  industry: string;
  /** Paleta de cores sugerida */
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
  };
  /** Seções desejadas */
  sections: string[];
  /** Tom de voz */
  tone: ToneType;
  /** Funcionalidades específicas */
  features: string[];
  /** Público-alvo */
  targetAudience: string;
  /** Nome do projeto/site */
  siteName: string;
  /** Título principal (hero) */
  heroTitle: string;
  /** Subtítulo do hero */
  heroSubtitle: string;
  /** Texto do CTA principal */
  ctaText: string;
  /** Font pairing index */
  fontPairing: string;
  /** Nível de criatividade 1-10 */
  creativityLevel: number;
  /** Se deve incluir dark mode */
  darkMode: boolean;
}

// ─── Config ─────────────────────────────────────────────────────────────────

const OMNIROUTE_URL = process.env.OMNIROUTE_URL || 'http://localhost:20128';
const OMNIROUTE_MODEL = process.env.OMNIROUTE_MODEL || 'oc/deepseek-v4-flash-free';
const TIMEOUT_MS = 30_000;

// ─── Função Principal ───────────────────────────────────────────────────────

/**
 * Interpreta um prompt do usuário usando OmniRoute LLM.
 * Extrai parâmetros estruturados para geração do site.
 */
export async function interpretPrompt(prompt: string): Promise<ParsedPrompt> {
  console.log(`[PromptEngine] 🔍 Interpretando: "${prompt.slice(0, 80)}..."`);

  try {
    const llmResult = await callLLM(prompt);
    if (llmResult) {
      const parsed = parseLLMResponse(llmResult);
      console.log(`[PromptEngine] ✅ Tipo: ${parsed.type}, Setor: ${parsed.industry}`);
      return parsed;
    }
  } catch (err) {
    console.warn('[PromptEngine] ⚠️ LLM falhou, usando fallback:', (err as Error).message);
  }

  // Fallback — interpretação básica via heurísticas
  console.log('[PromptEngine] 🔄 Usando fallback heurístico');
  return fallbackInterpret(prompt);
}

// ─── LLM Call ───────────────────────────────────────────────────────────────

async function callLLM(prompt: string): Promise<string | null> {
  const systemPrompt = `Você é um designer/desenvolvedor expert em criar sites premium.
Analise o prompt do usuário e extraia parâmetros estruturados.

Retorne APENAS JSON válido (sem markdown, sem explicações):

{
  "type": "landing|saas|ecommerce|portfolio|blog|app|institutional|restaurant|health|education|event|agency",
  "industry": "setor/detecao",
  "siteName": "nome do projeto",
  "heroTitle": "título principal da página",
  "heroSubtitle": "subtítulo explicativo",
  "ctaText": "texto do botão principal",
  "sections": ["hero","features","pricing","testimonials","cta","footer"],
  "tone": "luxo|moderno|minimalista|corporativo|criativo|tecnico|divertido|elegante|profissional|jovem|serio",
  "colors": {
    "primary": "#hex",
    "secondary": "#hex",
    "accent": "#hex",
    "background": "#hex",
    "surface": "#hex",
    "text": "#hex",
    "textSecondary": "#hex"
  },
  "fontPairing": "clash-display-inter|playfair-inter|space-grotesk-inter|jakarta-inter|poppins-inter|inter-roboto-mono",
  "features": ["feature1","feature2"],
  "targetAudience": "descrição do público",
  "creativityLevel": 7,
  "darkMode": false
}

REGRAS:
- Gere conteúdo REAL e ESPECÍFICO para o nicho
- Cores em HEX, harmoniosas e adequadas ao setor
- Para setor de luxo: use dourados, pretos, cremes
- Para saúde: use verdes, brancos, azuis suaves
- Para tech: use azuis escuros, neon accents
- fontPairing deve ser uma das opções listadas
- sections deve conter as seções mais adequadas (mín: 4, máx: 8)
- Se o prompt mencionar dark mode, set darkMode: true`;

  try {
    const res = await fetch(`${OMNIROUTE_URL}/v1/chat/completions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: OMNIROUTE_MODEL,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt },
        ],
        temperature: 0.4,
        max_tokens: 2048,
        stream: false,
      }),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });

    if (!res.ok) {
      const text = await res.text().catch(() => '');
      console.warn(`[PromptEngine] LLM HTTP ${res.status}: ${text.slice(0, 200)}`);
      return null;
    }

    const data = await res.json();
    return data.choices?.[0]?.message?.content || null;
  } catch (err) {
    console.warn('[PromptEngine] LLM call error:', (err as Error).message);
    return null;
  }
}

// ─── Parser ─────────────────────────────────────────────────────────────────

function parseLLMResponse(raw: string): ParsedPrompt {
  // Extrair JSON
  let jsonStr = raw;
  const jsonMatch = raw.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (jsonMatch) jsonStr = jsonMatch[1];

  const start = jsonStr.indexOf('{');
  const end = jsonStr.lastIndexOf('}');
  if (start !== -1 && end > start) {
    jsonStr = jsonStr.slice(start, end + 1);
  }

  try {
    const parsed = JSON.parse(jsonStr);

    return {
      type: validateSiteType(parsed.type) || 'landing',
      industry: String(parsed.industry || '').trim() || 'Tecnologia',
      colors: {
        primary: String(parsed.colors?.primary || '#0A0A0A'),
        secondary: String(parsed.colors?.secondary || '#FAFAFA'),
        accent: String(parsed.colors?.accent || '#3DF5C5'),
        background: String(parsed.colors?.background || '#FFFFFF'),
        surface: String(parsed.colors?.surface || '#F5F5F5'),
        text: String(parsed.colors?.text || '#0A0A0A'),
        textSecondary: String(parsed.colors?.textSecondary || '#666666'),
      },
      sections: Array.isArray(parsed.sections) ? parsed.sections : ['hero', 'features', 'cta', 'footer'],
      tone: validateTone(parsed.tone) || 'moderno',
      features: Array.isArray(parsed.features) ? parsed.features : [],
      targetAudience: String(parsed.targetAudience || '').trim() || 'Público geral',
      siteName: String(parsed.siteName || '').trim() || 'Meu Site',
      heroTitle: String(parsed.heroTitle || '').trim() || 'Transforme suas ideias em realidade',
      heroSubtitle: String(parsed.heroSubtitle || '').trim() || 'Soluções premium para o seu negócio',
      ctaText: String(parsed.ctaText || '').trim() || 'Começar agora',
      fontPairing: String(parsed.fontPairing || 'clash-display-inter'),
      creativityLevel: Math.max(1, Math.min(10, parsed.creativityLevel || 7)),
      darkMode: parsed.darkMode === true,
    };
  } catch {
    console.warn('[PromptEngine] Falha ao parsear JSON do LLM');
    return fallbackInterpret('');
  }
}

// ─── Validators ─────────────────────────────────────────────────────────────

const SITE_TYPES: SiteType[] = [
  'landing', 'saas', 'ecommerce', 'portfolio', 'blog',
  'app', 'institutional', 'restaurant', 'health',
  'education', 'event', 'agency',
];

function validateSiteType(t: unknown): SiteType | null {
  if (typeof t === 'string' && SITE_TYPES.includes(t as SiteType)) {
    return t as SiteType;
  }
  return null;
}

const TONES: ToneType[] = [
  'luxo', 'moderno', 'minimalista', 'corporativo', 'criativo',
  'tecnico', 'divertido', 'elegante', 'profissional', 'jovem', 'sério',
];

function validateTone(t: unknown): ToneType | null {
  if (typeof t === 'string' && TONES.includes(t as ToneType)) {
    return t as ToneType;
  }
  return null;
}

// ─── Fallback Heurístico ────────────────────────────────────────────────────

function fallbackInterpret(prompt: string): ParsedPrompt {
  const lower = prompt.toLowerCase();

  // Detectar tipo de site
  let type: SiteType = 'landing';
  if (/saas|software|plataforma|app.*web/i.test(lower)) type = 'saas';
  else if (/ecommerce|loja|produtos|comprar|vender|shop/i.test(lower)) type = 'ecommerce';
  else if (/portf[oó]lio|trabalhos|projetos|showcase/i.test(lower)) type = 'portfolio';
  else if (/blog|artigos|conte[úu]do|posts/i.test(lower)) type = 'blog';
  else if (/aplicativo|app|mobile/i.test(lower)) type = 'app';
  else if (/restaurante|card[aá]pio|food|comida/i.test(lower)) type = 'restaurant';
  else if (/sa[úu]de|cl[ií]nica|m[eé]dico|hospital|est[eé]tica/i.test(lower)) type = 'health';
  else if (/educação|curso|escola|aprendiz|online.*curso/i.test(lower)) type = 'education';
  else if (/evento|casamento|festa|congresso/i.test(lower)) type = 'event';
  else if (/ag[eê]ncia|consultoria|marketing|digital/i.test(lower)) type = 'agency';
  else if (/institucional|empresa|corporativo|sobre/i.test(lower)) type = 'institutional';

  // Detectar tom
  let tone: ToneType = 'moderno';
  if (/luxo|sofisticado|premium|elegante|dourado|exclusivo/i.test(lower)) tone = 'luxo';
  else if (/minimalista|limpo|simples|clean|branco/i.test(lower)) tone = 'minimalista';
  else if (/divertido|colorido|alegre|criativo|jovem/i.test(lower)) tone = 'criativo';
  else if (/corporativo|profissional|empresarial|business/i.test(lower)) tone = 'corporativo';
  else if (/t[eé]cnico|tech|tecnologia|software/i.test(lower)) tone = 'tecnico';
  else if (/jovem|moderno|trendy|descolado/i.test(lower)) tone = 'jovem';

  // Detectar cores pelo setor
  const colors = getFallbackColors(type, tone);

  // Detectar dark mode
  const darkMode = /dark|escuro|preto|noturno/i.test(lower) || tone === 'luxo' || tone === 'tecnico';

  // Detectar seções
  const sections = detectFallbackSections(type, lower);

  return {
    type,
    industry: extractIndustry(prompt, type),
    colors,
    sections,
    tone,
    features: extractFeatures(lower),
    targetAudience: extractAudience(prompt, type),
    siteName: extractSiteName(prompt) || 'Meu Site',
    heroTitle: extractHeroTitle(prompt, type) || 'Transforme suas ideias em realidade',
    heroSubtitle: extractHeroSubtitle(prompt, type) || 'Soluções premium para o seu negócio',
    ctaText: extractCTA(type) || 'Começar agora',
    fontPairing: getFontPairingForTone(tone),
    creativityLevel: 7,
    darkMode,
  };
}

function getFallbackColors(type: SiteType, tone: ToneType) {
  if (tone === 'luxo') {
    return {
      primary: '#1A1A1A',
      secondary: '#D4AF37',
      accent: '#C9A94E',
      background: '#0A0A0A',
      surface: '#1A1A1A',
      text: '#F5F0E8',
      textSecondary: '#A09888',
    };
  }
  if (tone === 'criativo' || tone === 'jovem') {
    return {
      primary: '#6C3BF7',
      secondary: '#FF6B6B',
      accent: '#F7DF1E',
      background: '#0F0B1A',
      surface: '#1A1530',
      text: '#FFFFFF',
      textSecondary: '#B0A8CC',
    };
  }
  if (type === 'health') {
    return {
      primary: '#059669',
      secondary: '#10B981',
      accent: '#34D399',
      background: '#FFFFFF',
      surface: '#F0FDF4',
      text: '#064E3B',
      textSecondary: '#6B7280',
    };
  }
  if (type === 'saas') {
    return {
      primary: '#0F172A',
      secondary: '#3B82F6',
      accent: '#60A5FA',
      background: '#FFFFFF',
      surface: '#F8FAFC',
      text: '#0F172A',
      textSecondary: '#64748B',
    };
  }
  if (type === 'restaurant') {
    return {
      primary: '#7C2D12',
      secondary: '#F97316',
      accent: '#FDE68A',
      background: '#FFF7ED',
      surface: '#FFEDD5',
      text: '#431407',
      textSecondary: '#9A3412',
    };
  }
  // Default — moderno minimalista
  return {
    primary: '#0A0A0A',
    secondary: '#FAFAFA',
    accent: '#3DF5C5',
    background: '#FFFFFF',
    surface: '#F5F5F5',
    text: '#0A0A0A',
    textSecondary: '#666666',
  };
}

function detectFallbackSections(type: SiteType, lower: string): string[] {
  const sections: string[] = ['hero'];

  if (/features?|funcionalidades|recursos|diferenciais|serviços|benefícios/i.test(lower)) {
    sections.push('features');
  }
  if (/about|sobre|quem.*somos|hist[óo]ria/i.test(lower)) {
    sections.push('about');
  }
  if (/pricing|pre[çc]os|planos|valores|assinatura/i.test(lower)) {
    sections.push('pricing');
  }
  if (/testimonial|depoimentos|review|feedback|clientes/i.test(lower)) {
    sections.push('testimonials');
  }
  if (/faq|perguntas|d[vú]vidas|questions/i.test(lower)) {
    sections.push('faq');
  }
  if (/contato|contact|fale.*conosco/i.test(lower)) {
    sections.push('contact');
  }
  if (/galeria|gallery|portfolio|projetos|trabalhos/i.test(lower)) {
    sections.push('gallery');
  }
  if (/stat|n[uú]meros|resultados|metrics/i.test(lower)) {
    sections.push('stats');
  }
  if (/team|equipe|time|pessoas/i.test(lower)) {
    sections.push('team');
  }
  if (/logo|clientes|parceiros|trusted/i.test(lower)) {
    sections.push('logo-cloud');
  }
  if (/blog|artigos|conte[úu]do/i.test(lower)) {
    sections.push('blog');
  }

  // Garantir seções mínimas baseadas no tipo
  if (sections.length <= 1) {
    switch (type) {
      case 'saas':
        sections.push('features', 'pricing', 'testimonials');
        break;
      case 'ecommerce':
        sections.push('features', 'testimonials', 'gallery');
        break;
      case 'portfolio':
        sections.push('gallery', 'testimonials', 'about');
        break;
      case 'health':
        sections.push('features', 'about', 'testimonials');
        break;
      case 'restaurant':
        sections.push('gallery', 'features', 'testimonials');
        break;
      case 'agency':
        sections.push('features', 'portfolio', 'testimonials');
        break;
      default:
        sections.push('features', 'cta');
    }
  }

  // Sempre adicionar CTA e footer se não existirem
  if (!sections.includes('cta')) sections.push('cta');
  if (!sections.includes('footer')) sections.push('footer');

  // Remover duplicatas mantendo ordem
  return [...new Set(sections)];
}

function extractIndustry(prompt: string, type: SiteType): string {
  // Tenta extrair menção a setor/indústria
  const industryPatterns = [
    /(?:para|de|no) ([\w\sáéíóúãõç]+?)(?:,|\.| com | que | e |$)/i,
    /(?:setor|mercado|ind[úu]stria|ramo) de ([\w\sáéíóúãõç]+?)(?:,|\.|$)/i,
  ];

  for (const pattern of industryPatterns) {
    const match = prompt.match(pattern);
    if (match && match[1].trim().length > 3) {
      return match[1].trim();
    }
  }

  const industryMap: Record<SiteType, string> = {
    landing: 'Tecnologia',
    saas: 'SaaS/Tecnologia',
    ecommerce: 'E-commerce',
    portfolio: 'Portfólio Criativo',
    blog: 'Conteúdo Digital',
    app: 'Aplicações Mobile',
    institutional: 'Institucional',
    restaurant: 'Gastronomia',
    health: 'Saúde & Bem-estar',
    education: 'Educação',
    event: 'Eventos',
    agency: 'Agência Digital',
  };

  return industryMap[type] || 'Tecnologia';
}

function extractFeatures(lower: string): string[] {
  const features: string[] = [];
  const patterns = [
    /chat|conversa|suporte/i, /analytics|m[eé]tricas|dados/i,
    /api|integração/i, /mobile|app|aplicativo/i,
    /seguran[çc]a|security/i, /automação|automation/i,
    /relat[óo]rio|report/i, /personaliza[cç][aã]o|custom/i,
    /gamificação|game/i, /ia|inteligência artificial|ai|machine learning/i,
  ];
  for (const p of patterns) {
    if (p.test(lower)) features.push(p.source.replace(/[\\/]/g, ''));
  }
  return features.slice(0, 5);
}

function extractAudience(prompt: string, type: SiteType): string {
  const audPatterns = [
    /(?:para|focado em|público[-\s]alvo) ([\w\sáéíóúãõç]+?)(?:,|\.| com | que | e |$)/i,
  ];
  for (const p of audPatterns) {
    const m = prompt.match(p);
    if (m && m[1].trim().length > 3) return m[1].trim();
  }
  const map: Record<SiteType, string> = {
    landing: 'Público geral', saas: 'Empresas e profissionais',
    ecommerce: 'Consumidores online', portfolio: 'Clientes em potencial',
    blog: 'Leitores e seguidores', app: 'Usuários mobile',
    institutional: 'Stakeholders e clientes', restaurant: 'Clientes do restaurante',
    health: 'Pacientes e clientes', education: 'Alunos e educadores',
    event: 'Participantes do evento', agency: 'Marcas e empresas',
  };
  return map[type] || 'Público geral';
}

function extractSiteName(prompt: string): string {
  // Tentar extrair nome do projeto
  const patterns = [
    /(?:chamado|nome|projeto|site) ["']([^"']+)["']/i,
    /(?:para|da) ([\w\s]{3,30}?) (?:com |que |,|$)/i,
  ];
  for (const p of patterns) {
    const m = prompt.match(p);
    if (m && m[1].trim().length > 2) return m[1].trim();
  }
  return '';
}

function extractHeroTitle(prompt: string, type: SiteType): string {
  const map: Record<SiteType, string> = {
    landing: 'Soluções que Transformam',
    saas: 'A Plataforma que Sua Empresa Precisa',
    ecommerce: 'Descubra Produtos Excepcionais',
    portfolio: 'Ideias que Ganham Vida',
    blog: 'Conhecimento que Inspira',
    app: 'O App que Vai Mudar Seu Dia',
    institutional: 'Nossa História, Nosso Compromisso',
    restaurant: 'Uma Experiência Gastronômica Única',
    health: 'Sua Saúde em Boas Mãos',
    education: 'Aprendizado sem Limites',
    event: 'O Evento que Você Não Pode Perder',
    agency: 'Criatividade que Gera Resultados',
  };
  return map[type] || 'Transforme suas ideias em realidade';
}

function extractHeroSubtitle(prompt: string, type: SiteType): string {
  const map: Record<SiteType, string> = {
    landing: 'Soluções premium projetadas para impulsionar seu negócio ao próximo nível.',
    saas: 'Tudo que você precisa em uma única plataforma. Simples, rápido e escalável.',
    ecommerce: 'Qualidade e estilo em cada detalhe. Sua nova experiência de compra começa aqui.',
    portfolio: 'Cada projeto conta uma história. Descubra o que podemos criar juntos.',
    blog: 'Compartilhando conhecimento e insights para transformar sua visão de mundo.',
    app: 'Tecnologia de ponta na palma da sua mão. Simples, intuitivo, poderoso.',
    institutional: 'Anos de experiência, inovação constante e compromisso com a excelência.',
    restaurant: 'Sabores autênticos em um ambiente pensado para momentos inesquecíveis.',
    health: 'Cuidado humanizado com tecnologia de ponta para seu bem-estar.',
    education: 'Metodologia inovadora que transforma conhecimento em resultados reais.',
    event: 'Conectando pessoas, ideias e oportunidades em um só lugar.',
    agency: 'Estratégia, design e tecnologia trabalhando juntos pelo seu sucesso.',
  };
  return map[type] || 'Soluções premium para o seu negócio';
}

function extractCTA(type: SiteType): string {
  const map: Record<SiteType, string> = {
    landing: 'Solicitar Demonstração',
    saas: 'Começar Grátis',
    ecommerce: 'Ver Produtos',
    portfolio: 'Ver Projetos',
    blog: 'Ler Mais',
    app: 'Baixar Agora',
    institutional: 'Saiba Mais',
    restaurant: 'Reservar Mesa',
    health: 'Agendar Consulta',
    education: 'Matricule-se',
    event: 'Garantir Vaga',
    agency: 'Solicitar Orçamento',
  };
  return map[type] || 'Começar agora';
}

function getFontPairingForTone(tone: ToneType): string {
  const map: Record<ToneType, string> = {
    luxo: 'playfair-inter',
    moderno: 'clash-display-inter',
    minimalista: 'inter-roboto-mono',
    corporativo: 'jakarta-inter',
    criativo: 'space-grotesk-inter',
    tecnico: 'inter-roboto-mono',
    divertido: 'poppins-inter',
    elegante: 'playfair-inter',
    profissional: 'jakarta-inter',
    jovem: 'space-grotesk-inter',
    sério: 'inter-roboto-mono',
  };
  return map[tone] || 'clash-display-inter';
}
