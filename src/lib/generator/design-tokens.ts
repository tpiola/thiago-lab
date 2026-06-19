/* ==========================================================================
   design-tokens.ts — Design Tokens Premium
   30 paletas, 15 font pairings, layout types com seções recomendadas.
   Prompt → Site React + Tailwind completo (v0/Framer-like).
   thiagolab.com
   ========================================================================== */

// ─── Tipos ──────────────────────────────────────────────────────────────────

export interface Palette {
  name: string;
  description: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
    border: string;
    error: string;
    success: string;
    warning: string;
  };
  industries: string[];
}

export interface FontSet {
  name: string;
  display: string;
  body: string;
  googleImport: string;
  displayFamily: string;
  bodyFamily: string;
  headingSizes: { h1: string; h2: string; h3: string; h4: string };
  description: string;
  industries: string[];
}

export interface LayoutType {
  name: string;
  description: string;
  recommendedSections: string[];
  heroType: string;
  gridConfig: string;
}

// ─── 30 PALETAS PREMIUM ─────────────────────────────────────────────────────

const PALETTES: Palette[] = [
  // 🥇 LUXO
  {
    name: 'Gold Noir',
    description: 'Elegância dourada sobre fundo escuro — luxo supremo',
    colors: {
      primary: '#1A1A2E', secondary: '#D4AF37', accent: '#F5E6A3',
      background: '#0A0A0F', surface: '#1A1A2E', text: '#F5F0E8',
      textSecondary: '#A09888', border: '#2A2A3E', error: '#FF4444',
      success: '#4CAF50', warning: '#FFB74D',
    },
    industries: ['luxo', 'joias', 'moda', 'premium', 'imobiliário alto padrão'],
  },
  {
    name: 'Obsidian Gold',
    description: 'Preto obsidiana com detalhes dourados — minimalismo luxuoso',
    colors: {
      primary: '#0D0D0D', secondary: '#C9A94E', accent: '#E8D5A3',
      background: '#000000', surface: '#141414', text: '#F0ECE0',
      textSecondary: '#8A8478', border: '#2A2820', error: '#FF4444',
      success: '#4CAF50', warning: '#FFB74D',
    },
    industries: ['luxo', 'moda', 'automotivo', 'tech premium'],
  },
  {
    name: 'Royal Burgundy',
    description: 'Bordô profundo com dourado — realeza e poder',
    colors: {
      primary: '#4A0E2E', secondary: '#D4AF37', accent: '#8B1A4A',
      background: '#1A0A14', surface: '#2D0F1E', text: '#F5E8EC',
      textSecondary: '#B098A4', border: '#3A1A2A', error: '#FF4444',
      success: '#4CAF50', warning: '#FFB74D',
    },
    industries: ['luxo', 'vinhos', 'perfumes', 'eventos'],
  },
  {
    name: 'Platinum Silk',
    description: 'Prata elegante com toques de creme — sofisticação sutil',
    colors: {
      primary: '#2D2D3A', secondary: '#E8E0D8', accent: '#C0B0A0',
      background: '#FCFAF5', surface: '#FFFFFF', text: '#1A1A24',
      textSecondary: '#8A8A9A', border: '#E8E0D8', error: '#D32F2F',
      success: '#388E3C', warning: '#F57C00',
    },
    industries: ['joias', 'moda', 'cosméticos', 'hotelaria'],
  },
  {
    name: 'Champagne Dream',
    description: 'Champagne rosé com tons quentes — celebração e requinte',
    colors: {
      primary: '#8B6F5E', secondary: '#F7E8D0', accent: '#E8C4A0',
      background: '#FFF8F0', surface: '#FFFEF8', text: '#2D2018',
      textSecondary: '#8B7D72', border: '#E8D8C8', error: '#D32F2F',
      success: '#388E3C', warning: '#F57C00',
    },
    industries: ['casamentos', 'eventos', 'gastronomia', 'spa'],
  },

  // 🥇 DARK / TECH
  {
    name: 'Cyber Violet',
    description: 'Roxo neon sobre dark — tech futurista',
    colors: {
      primary: '#0F0B1A', secondary: '#6C3BF7', accent: '#B76CF7',
      background: '#08060F', surface: '#1A1530', text: '#FFFFFF',
      textSecondary: '#B0A8CC', border: '#2A2040', error: '#FF4466',
      success: '#00E676', warning: '#FFAB40',
    },
    industries: ['tech', 'startup', 'gaming', 'blockchain'],
  },
  {
    name: 'Ocean Deep',
    description: 'Azul profundo com teal — tech corporativo',
    colors: {
      primary: '#0A1628', secondary: '#0EA5E9', accent: '#38BDF8',
      background: '#020617', surface: '#0F172A', text: '#F0F9FF',
      textSecondary: '#94A3B8', border: '#1E293B', error: '#EF4444',
      success: '#10B981', warning: '#F59E0B',
    },
    industries: ['tech', 'SaaS', 'fintech', 'cybersecurity'],
  },
  {
    name: 'Midnight Teal',
    description: 'Verde teal noturno — moderno e profissional',
    colors: {
      primary: '#0D2137', secondary: '#14B8A6', accent: '#5EEAD4',
      background: '#0B1926', surface: '#132A41', text: '#ECFDF5',
      textSecondary: '#8B9DAE', border: '#1E3A5F', error: '#EF4444',
      success: '#22C55E', warning: '#F59E0B',
    },
    industries: ['tech', 'saúde', 'fintech', 'consultoria'],
  },
  {
    name: 'Matrix Green',
    description: 'Verde neon sobre preto — hacker/cyber aesthetic',
    colors: {
      primary: '#0A0A0A', secondary: '#00FF41', accent: '#39FF14',
      background: '#000000', surface: '#0D1E0D', text: '#E0FFE0',
      textSecondary: '#6BAF6B', border: '#1A3A1A', error: '#FF3355',
      success: '#00FF41', warning: '#FFD700',
    },
    industries: ['tech', 'cybersecurity', 'gaming', 'blockchain'],
  },
  {
    name: 'Slate Storm',
    description: 'Cinza escuro com azul aço — corporativo moderno',
    colors: {
      primary: '#1E293B', secondary: '#64748B', accent: '#3B82F6',
      background: '#0F172A', surface: '#1E293B', text: '#F1F5F9',
      textSecondary: '#94A3B8', border: '#334155', error: '#EF4444',
      success: '#22C55E', warning: '#F59E0B',
    },
    industries: ['corporativo', 'tech', 'fintech', 'B2B'],
  },
  {
    name: 'Carbon Fiber',
    description: 'Preto carbono com toques azul tech — material design escuro',
    colors: {
      primary: '#1A1A1A', secondary: '#2563EB', accent: '#60A5FA',
      background: '#0A0A0A', surface: '#1A1A1A', text: '#F8FAFC',
      textSecondary: '#9CA3AF', border: '#2A2A2A', error: '#EF4444',
      success: '#22C55E', warning: '#F59E0B',
    },
    industries: ['tech', 'automotivo', 'industrial', 'B2B'],
  },

  // 🌿 SAÚDE / BEM-ESTAR
  {
    name: 'Nature Heal',
    description: 'Verde sálvia com toques terrosos — saúde natural',
    colors: {
      primary: '#2D5016', secondary: '#7CB342', accent: '#AED581',
      background: '#F7FBF2', surface: '#FFFFFF', text: '#1B3A0E',
      textSecondary: '#6B7B5A', border: '#DCE8D0', error: '#D32F2F',
      success: '#43A047', warning: '#FFA000',
    },
    industries: ['saúde', 'bem-estar', 'orgânico', 'jardinagem'],
  },
  {
    name: 'Clinical White',
    description: 'Branco clínico com azul calmante — consultórios e clínicas',
    colors: {
      primary: '#1565C0', secondary: '#42A5F5', accent: '#90CAF9',
      background: '#F5F9FF', surface: '#FFFFFF', text: '#0D2137',
      textSecondary: '#6B7B8A', border: '#E3EDF7', error: '#E53935',
      success: '#43A047', warning: '#FB8C00',
    },
    industries: ['saúde', 'clínica', 'hospital', 'laboratório'],
  },
  {
    name: 'Forest Calm',
    description: 'Verde floresta com bege — spa e bem-estar',
    colors: {
      primary: '#2E7D32', secondary: '#81C784', accent: '#A5D6A7',
      background: '#F1F8E9', surface: '#FFFFFF', text: '#1B3A1B',
      textSecondary: '#5A7A5A', border: '#C8E6C9', error: '#E53935',
      success: '#43A047', warning: '#FB8C00',
    },
    industries: ['spa', 'bem-estar', 'yoga', 'meditação'],
  },
  {
    name: 'Teal Wellness',
    description: 'Teal suave com toques coral — saúde moderna',
    colors: {
      primary: '#00897B', secondary: '#4DB6AC', accent: '#FF8A65',
      background: '#F0F9F8', surface: '#FFFFFF', text: '#004D40',
      textSecondary: '#5A7D78', border: '#B2DFDB', error: '#D32F2F',
      success: '#388E3C', warning: '#F57C00',
    },
    industries: ['saúde', 'fitness', 'nutrição', 'bem-estar'],
  },
  {
    name: 'Lavender Serenity',
    description: 'Lavanda suave com verde sálvia — calmante e acolhedor',
    colors: {
      primary: '#6A1B9A', secondary: '#CE93D8', accent: '#BA68C8',
      background: '#F8F4FA', surface: '#FFFFFF', text: '#2D0F3E',
      textSecondary: '#7A5A8A', border: '#E8DAEE', error: '#D32F2F',
      success: '#388E3C', warning: '#F57C00',
    },
    industries: ['saúde mental', 'terapia', 'bem-estar', 'spa'],
  },

  // 💼 CORPORATIVO / B2B
  {
    name: 'Navy Prestige',
    description: 'Azul marinho com dourado suave — corporativo sofisticado',
    colors: {
      primary: '#1A2940', secondary: '#C9A94E', accent: '#E8D5A3',
      background: '#F8F7F4', surface: '#FFFFFF', text: '#1A2940',
      textSecondary: '#6B7588', border: '#D6D8DC', error: '#C62828',
      success: '#2E7D32', warning: '#EF6C00',
    },
    industries: ['corporativo', 'consultoria', 'advocacia', 'finanças'],
  },
  {
    name: 'Steel Blue',
    description: 'Azul aço com cinza — confiança e profissionalismo',
    colors: {
      primary: '#1A365D', secondary: '#2B6CB0', accent: '#63B3ED',
      background: '#F7FAFC', surface: '#FFFFFF', text: '#1A202C',
      textSecondary: '#718096', border: '#CBD5E0', error: '#E53E3E',
      success: '#38A169', warning: '#DD6B20',
    },
    industries: ['corporativo', 'seguros', 'banco', 'imobiliário'],
  },
  {
    name: 'Executive Gray',
    description: 'Cinza executivo com azul royal — sério e confiável',
    colors: {
      primary: '#2D3436', secondary: '#0984E3', accent: '#74B9FF',
      background: '#F5F6FA', surface: '#FFFFFF', text: '#2D3436',
      textSecondary: '#636E72', border: '#DFE6E9', error: '#D63031',
      success: '#00B894', warning: '#FDCB6E',
    },
    industries: ['corporativo', 'tech B2B', 'fintech', 'consultoria'],
  },
  {
    name: 'Clay Corporate',
    description: 'Tom terroso com azul — corporativo com personalidade',
    colors: {
      primary: '#3D2E24', secondary: '#B8865C', accent: '#D4A574',
      background: '#FDFAF7', surface: '#FFFFFF', text: '#2D2018',
      textSecondary: '#8B7D72', border: '#E8DED4', error: '#BF360C',
      success: '#33691E', warning: '#E65100',
    },
    industries: ['corporativo', 'arquitetura', 'design', 'imobiliário'],
  },
  {
    name: 'Midnight Blue',
    description: 'Azul meia-noite — clássico corporativo',
    colors: {
      primary: '#0D1B2A', secondary: '#1B4965', accent: '#62B6CB',
      background: '#F8FAFC', surface: '#FFFFFF', text: '#0D1B2A',
      textSecondary: '#5A6B7A', border: '#DEE2E6', error: '#C1121F',
      success: '#2D6A4F', warning: '#D68C45',
    },
    industries: ['corporativo', 'banco', 'seguros', 'governo'],
  },

  // 🎨 CRIATIVO / AGÊNCIA
  {
    name: 'Sunset Gradient',
    description: 'Laranja-rosa vibrante sobre escuro — criativo e ousado',
    colors: {
      primary: '#FF6B35', secondary: '#F7C59F', accent: '#EF3E36',
      background: '#1A0A0A', surface: '#2D1515', text: '#FFF5F0',
      textSecondary: '#C0A090', border: '#3A2020', error: '#FF4444',
      success: '#4CAF50', warning: '#FFB74D',
    },
    industries: ['agência', 'criativo', 'marketing', 'entretenimento'],
  },
  {
    name: 'Electric Purple',
    description: 'Roxo elétrico com rosa — moderno e disruptivo',
    colors: {
      primary: '#7C3AED', secondary: '#EC4899', accent: '#FB923C',
      background: '#0F0A1A', surface: '#1F1530', text: '#FFFFFF',
      textSecondary: '#B0A0C0', border: '#2A2040', error: '#FF4466',
      success: '#22C55E', warning: '#FBBF24',
    },
    industries: ['criativo', 'fashion', 'beleza', 'música'],
  },
  {
    name: 'Neon Pulse',
    description: 'Neon ciano e rosa — cyberpunk criativo',
    colors: {
      primary: '#00F5D4', secondary: '#FF006E', accent: '#FFBE0B',
      background: '#0A0A0F', surface: '#1A1520', text: '#F0FFF0',
      textSecondary: '#A0A8B0', border: '#2A2530', error: '#FF3355',
      success: '#00E676', warning: '#FFD700',
    },
    industries: ['criativo', 'gaming', 'eventos', 'tech'],
  },
  {
    name: 'Coral Reef',
    description: 'Coral vibrante com azul oceano — fresco e moderno',
    colors: {
      primary: '#FF6B6B', secondary: '#4ECDC4', accent: '#FFE66D',
      background: '#FFFFFF', surface: '#F8FAFA', text: '#2D3436',
      textSecondary: '#6C7A89', border: '#E0E6E8', error: '#E74C3C',
      success: '#27AE60', warning: '#F39C12',
    },
    industries: ['criativo', 'turismo', 'lazer', 'food'],
  },
  {
    name: 'Aura Pink',
    description: 'Rosa aura com roxo místico — moderno e feminino',
    colors: {
      primary: '#FF1493', secondary: '#DA70D6', accent: '#FF69B4',
      background: '#0D0A14', surface: '#1A1525', text: '#FFF0F5',
      textSecondary: '#B090A8', border: '#2A2030', error: '#FF4466',
      success: '#22C55E', warning: '#FFD700',
    },
    industries: ['beleza', 'moda', 'cosméticos', 'bem-estar'],
  },

  // 🌅 NATUREZA / VIAGEM
  {
    name: 'Ocean Breeze',
    description: 'Azul oceano com areia — viagem e lazer',
    colors: {
      primary: '#0077B6', secondary: '#00B4D8', accent: '#90E0EF',
      background: '#F0F8FF', surface: '#FFFFFF', text: '#023E8A',
      textSecondary: '#5A7A8A', border: '#CAF0F8', error: '#D32F2F',
      success: '#2E7D32', warning: '#F57C00',
    },
    industries: ['turismo', 'hotelaria', 'viagem', 'lazer'],
  },
  {
    name: 'Forest Deep',
    description: 'Verde floresta profunda com terra — natureza e aventura',
    colors: {
      primary: '#1B4332', secondary: '#2D6A4F', accent: '#95D5B2',
      background: '#F5FBF5', surface: '#FFFFFF', text: '#081C15',
      textSecondary: '#52796F', border: '#D8F3DC', error: '#D32F2F',
      success: '#2E7D32', warning: '#F57C00',
    },
    industries: ['natureza', 'eco', 'aventura', 'jardinagem'],
  },
  {
    name: 'Desert Sand',
    description: 'Areia do deserto com terracota — calor e acolhimento',
    colors: {
      primary: '#A0522D', secondary: '#D2B48C', accent: '#DEB887',
      background: '#FFF8F0', surface: '#FFFEF8', text: '#3D2E24',
      textSecondary: '#8B7D72', border: '#E8DED4', error: '#BF360C',
      success: '#33691E', warning: '#E65100',
    },
    industries: ['arquitetura', 'design', 'decoração', 'imobiliário'],
  },
  {
    name: 'Arctic Frost',
    description: 'Azul gelo com branco puro — minimalismo nórdico',
    colors: {
      primary: '#1A365D', secondary: '#E2E8F0', accent: '#90CDF4',
      background: '#FAFBFC', surface: '#FFFFFF', text: '#1A202C',
      textSecondary: '#718096', border: '#E2E8F0', error: '#E53E3E',
      success: '#38A169', warning: '#DD6B20',
    },
    industries: ['design', 'tech', 'moda', 'minimalista'],
  },
];

// ─── 15 FONT PAIRINGS ────────────────────────────────────────────────────────

const FONTS: FontSet[] = [
  {
    name: 'Clash Display + Inter',
    display: 'Clash Display',
    body: 'Inter',
    googleImport: `@import url('https://api.fontshare.com/v2/css?f[]=clash-display@200,300,400,500,600,700&f[]=inter@400,500,600,700&display=swap');`,
    displayFamily: "'Clash Display', sans-serif",
    bodyFamily: "'Inter', sans-serif",
    headingSizes: { h1: 'text-5xl md:text-7xl lg:text-8xl', h2: 'text-3xl md:text-5xl', h3: 'text-2xl md:text-3xl', h4: 'text-xl md:text-2xl' },
    description: 'Display bold + body clean — perfeito para startups e tech',
    industries: ['tech', 'startup', 'moderno', 'criativo'],
  },
  {
    name: 'Playfair Display + Inter',
    display: 'Playfair Display',
    body: 'Inter',
    googleImport: `@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400&family=Inter:wght@400;500;600;700&display=swap');`,
    displayFamily: "'Playfair Display', serif",
    bodyFamily: "'Inter', sans-serif",
    headingSizes: { h1: 'text-5xl md:text-7xl lg:text-8xl', h2: 'text-3xl md:text-5xl', h3: 'text-2xl md:text-3xl', h4: 'text-xl md:text-2xl' },
    description: 'Serif elegante + sans-serif moderno — luxo e sofisticação',
    industries: ['luxo', 'moda', 'editorial', 'premium'],
  },
  {
    name: 'Space Grotesk + Inter',
    display: 'Space Grotesk',
    body: 'Inter',
    googleImport: `@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@400;500;600;700&display=swap');`,
    displayFamily: "'Space Grotesk', sans-serif",
    bodyFamily: "'Inter', sans-serif",
    headingSizes: { h1: 'text-5xl md:text-7xl lg:text-8xl', h2: 'text-3xl md:text-5xl', h3: 'text-2xl md:text-3xl', h4: 'text-xl md:text-2xl' },
    description: 'Display tech/geométrico — startups e SaaS',
    industries: ['tech', 'SaaS', 'startup', 'developer'],
  },
  {
    name: 'Plus Jakarta Sans + Inter',
    display: 'Plus Jakarta Sans',
    body: 'Inter',
    googleImport: `@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Inter:wght@400;500;600;700&display=swap');`,
    displayFamily: "'Plus Jakarta Sans', sans-serif",
    bodyFamily: "'Inter', sans-serif",
    headingSizes: { h1: 'text-5xl md:text-7xl lg:text-8xl', h2: 'text-3xl md:text-5xl', h3: 'text-2xl md:text-3xl', h4: 'text-xl md:text-2xl' },
    description: 'Display moderno arredondado — design amigável e profissional',
    industries: ['design', 'produto', 'SaaS', 'moderno'],
  },
  {
    name: 'Poppins + Inter',
    display: 'Poppins',
    body: 'Inter',
    googleImport: `@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&family=Inter:wght@400;500;600;700&display=swap');`,
    displayFamily: "'Poppins', sans-serif",
    bodyFamily: "'Inter', sans-serif",
    headingSizes: { h1: 'text-5xl md:text-7xl lg:text-8xl', h2: 'text-3xl md:text-5xl', h3: 'text-2xl md:text-3xl', h4: 'text-xl md:text-2xl' },
    description: 'Display amigável e versátil — bom para todos os setores',
    industries: ['geral', 'educação', 'saúde', 'corporativo'],
  },
  {
    name: 'Inter + Roboto Mono',
    display: 'Inter',
    body: 'Roboto Mono',
    googleImport: `@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Roboto+Mono:wght@400;500;600&display=swap');`,
    displayFamily: "'Inter', sans-serif",
    bodyFamily: "'Roboto Mono', monospace",
    headingSizes: { h1: 'text-5xl md:text-7xl lg:text-8xl', h2: 'text-3xl md:text-5xl', h3: 'text-2xl md:text-3xl', h4: 'text-xl md:text-2xl' },
    description: 'Body monospace tech — developer tools e cybersecurity',
    industries: ['tech', 'developer', 'cybersecurity', 'devtools'],
  },
  {
    name: 'DM Serif + DM Sans',
    display: 'DM Serif Display',
    body: 'DM Sans',
    googleImport: `@import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@400;500;600;700&display=swap');`,
    displayFamily: "'DM Serif Display', serif",
    bodyFamily: "'DM Sans', sans-serif",
    headingSizes: { h1: 'text-5xl md:text-7xl lg:text-8xl', h2: 'text-3xl md:text-5xl', h3: 'text-2xl md:text-3xl', h4: 'text-xl md:text-2xl' },
    description: 'Serif display com sans-serif moderno — editorial e criativo',
    industries: ['editorial', 'criativo', 'agência', 'moda'],
  },
  {
    name: 'Cabinet Grotesk + Inter',
    display: 'Cabinet Grotesk',
    body: 'Inter',
    googleImport: `@import url('https://api.fontshare.com/v2/css?f[]=cabinet-grotesk@100,200,300,400,500,600,700,800&f[]=inter@400,500,600,700&display=swap');`,
    displayFamily: "'Cabinet Grotesk', sans-serif",
    bodyFamily: "'Inter', sans-serif",
    headingSizes: { h1: 'text-5xl md:text-7xl lg:text-8xl', h2: 'text-3xl md:text-5xl', h3: 'text-2xl md:text-3xl', h4: 'text-xl md:text-2xl' },
    description: 'Grotesk compacto para títulos — design moderno e ousado',
    industries: ['design', 'agência', 'criativo', 'moda'],
  },
  {
    name: 'Sentient + Inter',
    display: 'Sentient',
    body: 'Inter',
    googleImport: `@import url('https://api.fontshare.com/v2/css?f[]=sentient@200,300,400,500,600,700&f[]=inter@400,500,600,700&display=swap');`,
    displayFamily: "'Sentient', serif",
    bodyFamily: "'Inter', sans-serif",
    headingSizes: { h1: 'text-5xl md:text-7xl lg:text-8xl', h2: 'text-3xl md:text-5xl', h3: 'text-2xl md:text-3xl', h4: 'text-xl md:text-2xl' },
    description: 'Serif variável elegante — premium editorial',
    industries: ['luxo', 'editorial', 'premium', 'moda'],
  },
  {
    name: 'Satoshi + Inter',
    display: 'Satoshi',
    body: 'Inter',
    googleImport: `@import url('https://api.fontshare.com/v2/css?f[]=satoshi@300,400,500,600,700,800&f[]=inter@400,500,600,700&display=swap');`,
    displayFamily: "'Satoshi', sans-serif",
    bodyFamily: "'Inter', sans-serif",
    headingSizes: { h1: 'text-5xl md:text-7xl lg:text-8xl', h2: 'text-3xl md:text-5xl', h3: 'text-2xl md:text-3xl', h4: 'text-xl md:text-2xl' },
    description: 'Sans-serif versátil e moderno — alternativa premium ao Inter',
    industries: ['tech', 'corporativo', 'design', 'startup'],
  },
  {
    name: 'Merriweather + Inter',
    display: 'Merriweather',
    body: 'Inter',
    googleImport: `@import url('https://fonts.googleapis.com/css2?family=Merriweather:wght@300;400;700;900&family=Inter:wght@400;500;600;700&display=swap');`,
    displayFamily: "'Merriweather', serif",
    bodyFamily: "'Inter', sans-serif",
    headingSizes: { h1: 'text-5xl md:text-7xl lg:text-8xl', h2: 'text-3xl md:text-5xl', h3: 'text-2xl md:text-3xl', h4: 'text-xl md:text-2xl' },
    description: 'Serif clássico e legível — conteúdo e leitura longa',
    industries: ['blog', 'educação', 'notícias', 'editorial'],
  },
  {
    name: 'Mona Sans + Hubot Sans',
    display: 'Mona Sans',
    body: 'Hubot Sans',
    googleImport: `@import url('https://api.fontsource.org/v1/fonts/mona-sans/latin-400-normal.css');`,
    displayFamily: "'Mona Sans', sans-serif",
    bodyFamily: "'Hubot Sans', sans-serif",
    headingSizes: { h1: 'text-5xl md:text-7xl lg:text-8xl', h2: 'text-3xl md:text-5xl', h3: 'text-2xl md:text-3xl', h4: 'text-xl md:text-2xl' },
    description: 'Dupla moderna GitHub — tech e developer focused',
    industries: ['tech', 'developer', 'open-source', 'devtools'],
  },
  {
    name: 'Zodiak + Inter',
    display: 'Zodiak',
    body: 'Inter',
    googleImport: `@import url('https://api.fontshare.com/v2/css?f[]=zodiak@300,400,500,600,700&f[]=inter@400,500,600,700&display=swap');`,
    displayFamily: "'Zodiak', serif",
    bodyFamily: "'Inter', sans-serif",
    headingSizes: { h1: 'text-5xl md:text-7xl lg:text-8xl', h2: 'text-3xl md:text-5xl', h3: 'text-2xl md:text-3xl', h4: 'text-xl md:text-2xl' },
    description: 'Serif variável distinto — personalidade e caráter',
    industries: ['agência', 'criativo', 'moda', 'premium'],
  },
  {
    name: 'Manrope + Inter',
    display: 'Manrope',
    body: 'Inter',
    googleImport: `@import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=Inter:wght@400;500;600;700&display=swap');`,
    displayFamily: "'Manrope', sans-serif",
    bodyFamily: "'Inter', sans-serif",
    headingSizes: { h1: 'text-5xl md:text-7xl lg:text-8xl', h2: 'text-3xl md:text-5xl', h3: 'text-2xl md:text-3xl', h4: 'text-xl md:text-2xl' },
    description: 'Sans-serif geométrico moderno — limpo e profissional',
    industries: ['corporativo', 'fintech', 'consultoria', 'SaaS'],
  },
  {
    name: 'Lora + Inter',
    display: 'Lora',
    body: 'Inter',
    googleImport: `@import url('https://fonts.googleapis.com/css2?family=Lora:wght@400;500;600;700&family=Inter:wght@400;500;600;700&display=swap');`,
    displayFamily: "'Lora', serif",
    bodyFamily: "'Inter', sans-serif",
    headingSizes: { h1: 'text-5xl md:text-7xl lg:text-8xl', h2: 'text-3xl md:text-5xl', h3: 'text-2xl md:text-3xl', h4: 'text-xl md:text-2xl' },
    description: 'Serif calmo e elegante — conteúdo longo e blogs',
    industries: ['blog', 'educação', 'editorial', 'cultura'],
  },
];

// ─── LAYOUT TYPES ────────────────────────────────────────────────────────────

const LAYOUTS: Record<string, LayoutType> = {
  landing: {
    name: 'Landing Page',
    description: 'Página de captura com foco em conversão',
    recommendedSections: ['hero', 'features', 'testimonials', 'pricing', 'cta', 'footer'],
    heroType: 'center',
    gridConfig: 'max-w-7xl mx-auto px-4',
  },
  saas: {
    name: 'SaaS / Produto Digital',
    description: 'Plataforma SaaS com showcase de funcionalidades',
    recommendedSections: ['hero', 'features', 'stats', 'pricing', 'testimonials', 'faq', 'cta', 'footer'],
    heroType: 'split',
    gridConfig: 'max-w-7xl mx-auto px-4',
  },
  ecommerce: {
    name: 'E-commerce / Loja Virtual',
    description: 'Loja online com catálogo de produtos',
    recommendedSections: ['hero', 'features', 'gallery', 'testimonials', 'cta', 'footer'],
    heroType: 'fullscreen',
    gridConfig: 'max-w-7xl mx-auto px-4',
  },
  portfolio: {
    name: 'Portfólio / Showcase',
    description: 'Portfólio criativo com galeria',
    recommendedSections: ['hero', 'gallery', 'testimonials', 'cta', 'footer'],
    heroType: 'fullscreen',
    gridConfig: 'max-w-7xl mx-auto px-4',
  },
  blog: {
    name: 'Blog / Conteúdo',
    description: 'Blog com artigos e conteúdo editorial',
    recommendedSections: ['hero', 'features', 'cta', 'footer'],
    heroType: 'minimal',
    gridConfig: 'max-w-4xl mx-auto px-4',
  },
  app: {
    name: 'Aplicativo / Mobile',
    description: 'Landing page para app mobile',
    recommendedSections: ['hero', 'features', 'testimonials', 'cta', 'footer'],
    heroType: 'animated',
    gridConfig: 'max-w-7xl mx-auto px-4',
  },
  institutional: {
    name: 'Site Institucional',
    description: 'Site corporativo completo',
    recommendedSections: ['hero', 'features', 'about', 'testimonials', 'contact', 'footer'],
    heroType: 'center',
    gridConfig: 'max-w-7xl mx-auto px-4',
  },
  restaurant: {
    name: 'Restaurante / Gastronomia',
    description: 'Site para restaurante com cardápio',
    recommendedSections: ['hero', 'gallery', 'features', 'testimonials', 'contact', 'footer'],
    heroType: 'fullscreen',
    gridConfig: 'max-w-7xl mx-auto px-4',
  },
  health: {
    name: 'Saúde / Clínica',
    description: 'Site para clínica ou consultório',
    recommendedSections: ['hero', 'features', 'about', 'testimonials', 'contact', 'footer'],
    heroType: 'center',
    gridConfig: 'max-w-7xl mx-auto px-4',
  },
  education: {
    name: 'Educação / Curso',
    description: 'Plataforma educacional ou curso online',
    recommendedSections: ['hero', 'features', 'pricing', 'testimonials', 'cta', 'footer'],
    heroType: 'split',
    gridConfig: 'max-w-7xl mx-auto px-4',
  },
  event: {
    name: 'Evento / Casamento',
    description: 'Página de evento com contagem regressiva',
    recommendedSections: ['hero', 'features', 'gallery', 'testimonials', 'contact', 'footer'],
    heroType: 'fullscreen',
    gridConfig: 'max-w-5xl mx-auto px-4',
  },
  agency: {
    name: 'Agência / Consultoria',
    description: 'Site de agência digital ou consultoria',
    recommendedSections: ['hero', 'features', 'showcase', 'testimonials', 'pricing', 'contact', 'footer'],
    heroType: 'split',
    gridConfig: 'max-w-7xl mx-auto px-4',
  },
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

export function getPalette(type: string): Palette {
  const lower = type.toLowerCase();

  // Match by industry keyword
  if (/luxo|joias|premium|ouro|diamante/i.test(lower)) return findPalette('Gold Noir');
  if (/sa[úu]de|cl[ií]nica|m[eé]dico|hospital|bem-estar|wellness/i.test(lower)) return findPalette('Clinical White');
  if (/tech|saas|software|startup|blockchain|cyber/i.test(lower)) return findPalette('Ocean Deep');
  if (/criativo|ag[eê]ncia|marketing|design|moda|fashion/i.test(lower)) return findPalette('Electric Purple');
  if (/corporativo|consultoria|finan[çc]as|advocacia|seguros/i.test(lower)) return findPalette('Navy Prestige');
  if (/restaurante|comida|gastronomia|food|bar/i.test(lower)) return findPalette('Sunset Gradient');
  if (/natureza|eco|jardinagem|org[aâ]nico|floresta/i.test(lower)) return findPalette('Forest Deep');
  if (/turismo|viagem|hotel|praia|oceano|lazer/i.test(lower)) return findPalette('Ocean Breeze');
  if (/educa[cç][aã]o|curso|escola|aprendiz/i.test(lower)) return findPalette('Nature Heal');
  if (/imobili[aá]rio|arquitetura|decora[cç][aã]o/i.test(lower)) return findPalette('Clay Corporate');
  if (/gaming|jogos|entretenimento|eventos/i.test(lower)) return findPalette('Neon Pulse');

  // Default
  return findPalette('Slate Storm');
}

export function getFonts(type: string): FontSet {
  const lower = type.toLowerCase();

  if (/luxo|premium|joias|moda.*alta|editorial/i.test(lower)) return findFont('Playfair Display + Inter');
  if (/tech|saas|startup|developer|cyber/i.test(lower)) return findFont('Space Grotesk + Inter');
  if (/sa[úu]de|cl[ií]nica|bem-estar|educa[cç][aã]o/i.test(lower)) return findFont('Poppins + Inter');
  if (/criativo|ag[eê]ncia|design|moda/i.test(lower)) return findFont('Cabinet Grotesk + Inter');
  if (/corporativo|consultoria|finan[çc]as|seguros|banco/i.test(lower)) return findFont('Satoshi + Inter');
  if (/blog|conte[úu]do|artigo|not[ií]cias|editorial/i.test(lower)) return findFont('Merriweather + Inter');
  if (/restaurante|gastronomia|food|casamento|evento/i.test(lower)) return findFont('DM Serif + DM Sans');
  if (/tech|corp|b2b|fintech|consultoria/i.test(lower)) return findFont('Manrope + Inter');

  // Default
  return findFont('Clash Display + Inter');
}

export function getSections(type: string): string[] {
  const key = type.toLowerCase() as keyof typeof LAYOUTS;
  return LAYOUTS[key]?.recommendedSections ?? LAYOUTS.landing.recommendedSections;
}

export function getLayoutInfo(type: string): LayoutType {
  const key = type.toLowerCase() as keyof typeof LAYOUTS;
  return LAYOUTS[key] ?? LAYOUTS.landing;
}

export function getAllPalettes(): Palette[] {
  return PALETTES;
}

export function getAllFonts(): FontSet[] {
  return FONTS;
}

export function getAllLayouts(): Record<string, LayoutType> {
  return LAYOUTS;
}

// ─── Internal ────────────────────────────────────────────────────────────────

function findPalette(name: string): Palette {
  return PALETTES.find((p) => p.name === name) ?? PALETTES[0];
}

function findFont(name: string): FontSet {
  return FONTS.find((f) => f.name === name) ?? FONTS[0];
}
