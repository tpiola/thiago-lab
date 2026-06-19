/* ==========================================================================
   design-system.ts — Design Tokens Premium para Geração de Sites
   50+ paletas de cores, 20+ font pairings, layout templates,
   animações baseadas em Tailwind.
   AI Site Generator — thiagolab.com
   ========================================================================== */

// ─── Tipos ──────────────────────────────────────────────────────────────────

export interface ColorPalette {
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
  /** Setores recomendados */
  industries: string[];
}

export interface FontPairing {
  name: string;
  display: string;
  body: string;
  /** Google Fonts import string */
  googleImport: string;
  /** CSS font-family for display */
  displayFamily: string;
  /** CSS font-family for body */
  bodyFamily: string;
  /** Tamanhos de heading */
  headingSizes: {
    h1: string;
    h2: string;
    h3: string;
    h4: string;
  };
  /** Estilos recomendados */
  description: string;
  /** Setores recomendados */
  industries: string[];
}

export interface TailwindAnimation {
  name: string;
  keyframes: string;
  utility: string;
  description: string;
}

export interface LayoutTemplate {
  name: string;
  type: string;
  description: string;
  sections: string[];
  gridConfig: string;
}

// ─── 50+ PALETAS DE CORES ───────────────────────────────────────────────────

export const COLOR_PALETTES: ColorPalette[] = [
  // 🥇 LUXO / PREMIUM
  {
    name: 'Gold Noir',
    description: 'Elegância dourada sobre fundo escuro — luxo supremo',
    colors: {
      primary: '#1A1A2E',
      secondary: '#D4AF37',
      accent: '#F5E6A3',
      background: '#0A0A0F',
      surface: '#1A1A2E',
      text: '#F5F0E8',
      textSecondary: '#A09888',
      border: '#2A2A3E',
      error: '#FF4444',
      success: '#4CAF50',
      warning: '#FFB74D',
    },
    industries: ['luxo', 'joias', 'moda', 'premium', 'imobiliário de alto padrão'],
  },
  {
    name: 'Platinum Silk',
    description: 'Prata elegante com toques de creme — sofisticação sutil',
    colors: {
      primary: '#2D2D3A',
      secondary: '#E8E0D8',
      accent: '#C0B0A0',
      background: '#FCFAF5',
      surface: '#FFFFFF',
      text: '#1A1A24',
      textSecondary: '#8A8A9A',
      border: '#E8E0D8',
      error: '#D32F2F',
      success: '#388E3C',
      warning: '#F57C00',
    },
    industries: ['joias', 'moda', 'cosméticos', 'hotelaria'],
  },
  {
    name: 'Royal Burgundy',
    description: 'Bordô profundo com dourado — realeza e poder',
    colors: {
      primary: '#4A0E2E',
      secondary: '#D4AF37',
      accent: '#8B1A4A',
      background: '#1A0A14',
      surface: '#2D0F1E',
      text: '#F5E8EC',
      textSecondary: '#B098A4',
      border: '#3A1A2A',
      error: '#FF4444',
      success: '#4CAF50',
      warning: '#FFB74D',
    },
    industries: ['luxo', 'vinhos', 'perfumes', 'eventos'],
  },
  {
    name: 'Champagne Dream',
    description: 'Champagne rosé com tons quentes — celebração e requinte',
    colors: {
      primary: '#8B6F5E',
      secondary: '#F7E8D0',
      accent: '#E8C4A0',
      background: '#FFF8F0',
      surface: '#FFFEF8',
      text: '#2D2018',
      textSecondary: '#8B7D72',
      border: '#E8D8C8',
      error: '#D32F2F',
      success: '#388E3C',
      warning: '#F57C00',
    },
    industries: ['casamentos', 'eventos', 'gastronomia', 'spa'],
  },
  {
    name: 'Obsidian Gold',
    description: 'Preto obsidiana com detalhes dourados — minimalismo luxuoso',
    colors: {
      primary: '#0D0D0D',
      secondary: '#C9A94E',
      accent: '#E8D5A3',
      background: '#000000',
      surface: '#141414',
      text: '#F0ECE0',
      textSecondary: '#8A8478',
      border: '#2A2820',
      error: '#FF4444',
      success: '#4CAF50',
      warning: '#FFB74D',
    },
    industries: ['luxo', 'moda', 'automotivo', 'tech premium'],
  },

  // 🥇 DARK / TECH
  {
    name: 'Cyber Violet',
    description: 'Roxo neon sobre dark — tech futurista',
    colors: {
      primary: '#0F0B1A',
      secondary: '#6C3BF7',
      accent: '#B76CF7',
      background: '#08060F',
      surface: '#1A1530',
      text: '#FFFFFF',
      textSecondary: '#B0A8CC',
      border: '#2A2040',
      error: '#FF4466',
      success: '#00E676',
      warning: '#FFAB40',
    },
    industries: ['tech', 'startup', 'gaming', 'blockchain'],
  },
  {
    name: 'Ocean Deep',
    description: 'Azul profundo com teal — tech corporativo',
    colors: {
      primary: '#0A1628',
      secondary: '#0EA5E9',
      accent: '#38BDF8',
      background: '#020617',
      surface: '#0F172A',
      text: '#F0F9FF',
      textSecondary: '#94A3B8',
      border: '#1E293B',
      error: '#EF4444',
      success: '#10B981',
      warning: '#F59E0B',
    },
    industries: ['tech', 'SaaS', 'fintech', 'cybersecurity'],
  },
  {
    name: 'Midnight Teal',
    description: 'Verde teal noturno — moderno e profissional',
    colors: {
      primary: '#0D2137',
      secondary: '#14B8A6',
      accent: '#5EEAD4',
      background: '#0B1926',
      surface: '#132A41',
      text: '#ECFDF5',
      textSecondary: '#8B9DAE',
      border: '#1E3A5F',
      error: '#EF4444',
      success: '#22C55E',
      warning: '#F59E0B',
    },
    industries: ['tech', 'saúde', 'fintech', 'consultoria'],
  },
  {
    name: 'Matrix Green',
    description: 'Verde neon sobre preto — hacker/cyber aesthetic',
    colors: {
      primary: '#0A0A0A',
      secondary: '#00FF41',
      accent: '#39FF14',
      background: '#000000',
      surface: '#0D1E0D',
      text: '#E0FFE0',
      textSecondary: '#6BAF6B',
      border: '#1A3A1A',
      error: '#FF3355',
      success: '#00FF41',
      warning: '#FFD700',
    },
    industries: ['tech', 'cybersecurity', 'gaming', 'blockchain'],
  },
  {
    name: 'Slate Storm',
    description: 'Cinza escuro com azul aço — corporativo moderno',
    colors: {
      primary: '#1E293B',
      secondary: '#64748B',
      accent: '#3B82F6',
      background: '#0F172A',
      surface: '#1E293B',
      text: '#F1F5F9',
      textSecondary: '#94A3B8',
      border: '#334155',
      error: '#EF4444',
      success: '#22C55E',
      warning: '#F59E0B',
    },
    industries: ['corporativo', 'tech', 'fintech', 'B2B'],
  },
  {
    name: 'Carbon Fiber',
    description: 'Preto carbono com toques azul tech — material design escuro',
    colors: {
      primary: '#1A1A1A',
      secondary: '#2563EB',
      accent: '#60A5FA',
      background: '#0A0A0A',
      surface: '#1A1A1A',
      text: '#F8FAFC',
      textSecondary: '#9CA3AF',
      border: '#2A2A2A',
      error: '#EF4444',
      success: '#22C55E',
      warning: '#F59E0B',
    },
    industries: ['tech', 'automotivo', 'industrial', 'B2B'],
  },

  // 🌿 SAÚDE / BEM-ESTAR
  {
    name: 'Nature Heal',
    description: 'Verde sálvia com toques terrosos — saúde natural',
    colors: {
      primary: '#2D5016',
      secondary: '#7CB342',
      accent: '#AED581',
      background: '#F7FBF2',
      surface: '#FFFFFF',
      text: '#1B3A0E',
      textSecondary: '#6B7B5A',
      border: '#DCE8D0',
      error: '#D32F2F',
      success: '#43A047',
      warning: '#FFA000',
    },
    industries: ['saúde', 'bem-estar', 'orgânico', 'jardinagem'],
  },
  {
    name: 'Clinical White',
    description: 'Branco clínico com azul calmante — consultórios e clínicas',
    colors: {
      primary: '#1565C0',
      secondary: '#42A5F5',
      accent: '#90CAF9',
      background: '#F5F9FF',
      surface: '#FFFFFF',
      text: '#0D2137',
      textSecondary: '#6B7B8A',
      border: '#E3EDF7',
      error: '#E53935',
      success: '#43A047',
      warning: '#FB8C00',
    },
    industries: ['saúde', 'clínica', 'hospital', 'laboratório'],
  },
  {
    name: 'Forest Calm',
    description: 'Verde floresta com bege — spa e bem-estar',
    colors: {
      primary: '#2E7D32',
      secondary: '#81C784',
      accent: '#A5D6A7',
      background: '#F1F8E9',
      surface: '#FFFFFF',
      text: '#1B3A1B',
      textSecondary: '#5A7A5A',
      border: '#C8E6C9',
      error: '#E53935',
      success: '#43A047',
      warning: '#FB8C00',
    },
    industries: ['spa', 'bem-estar', 'yoga', 'meditação'],
  },
  {
    name: 'Teal Wellness',
    description: 'Teal suave com toques coral — saúde moderna',
    colors: {
      primary: '#00897B',
      secondary: '#4DB6AC',
      accent: '#FF8A65',
      background: '#F0F9F8',
      surface: '#FFFFFF',
      text: '#004D40',
      textSecondary: '#5A7D78',
      border: '#B2DFDB',
      error: '#D32F2F',
      success: '#388E3C',
      warning: '#F57C00',
    },
    industries: ['saúde', 'fitness', 'nutrição', 'bem-estar'],
  },
  {
    name: 'Lavender Serenity',
    description: 'Lavanda suave com verde sálvia — calmante e acolhedor',
    colors: {
      primary: '#6A1B9A',
      secondary: '#CE93D8',
      accent: '#BA68C8',
      background: '#F8F4FA',
      surface: '#FFFFFF',
      text: '#2D0F3E',
      textSecondary: '#7A5A8A',
      border: '#E8DAEE',
      error: '#D32F2F',
      success: '#388E3C',
      warning: '#F57C00',
    },
    industries: ['saúde mental', 'terapia', 'bem-estar', 'spa'],
  },

  // 💼 CORPORATIVO / B2B
  {
    name: 'Navy Prestige',
    description: 'Azul marinho com dourado suave — corporativo sofisticado',
    colors: {
      primary: '#1A2940',
      secondary: '#C9A94E',
      accent: '#E8D5A3',
      background: '#F8F7F4',
      surface: '#FFFFFF',
      text: '#1A2940',
      textSecondary: '#6B7588',
      border: '#D6D8DC',
      error: '#C62828',
      success: '#2E7D32',
      warning: '#EF6C00',
    },
    industries: ['corporativo', 'consultoria', 'advocacia', 'finanças'],
  },
  {
    name: 'Steel Blue',
    description: 'Azul aço com cinza — confiança e profissionalismo',
    colors: {
      primary: '#1A365D',
      secondary: '#2B6CB0',
      accent: '#63B3ED',
      background: '#F7FAFC',
      surface: '#FFFFFF',
      text: '#1A202C',
      textSecondary: '#718096',
      border: '#CBD5E0',
      error: '#E53E3E',
      success: '#38A169',
      warning: '#DD6B20',
    },
    industries: ['corporativo', 'seguros', 'banco', 'imobiliário'],
  },
  {
    name: 'Executive Gray',
    description: 'Cinza executivo com azul royal — sério e confiável',
    colors: {
      primary: '#2D3436',
      secondary: '#0984E3',
      accent: '#74B9FF',
      background: '#F5F6FA',
      surface: '#FFFFFF',
      text: '#2D3436',
      textSecondary: '#636E72',
      border: '#DFE6E9',
      error: '#D63031',
      success: '#00B894',
      warning: '#FDCB6E',
    },
    industries: ['corporativo', 'tech B2B', 'fintech', 'consultoria'],
  },
  {
    name: 'Clay Corporate',
    description: 'Tom terroso com azul — corporativo com personalidade',
    colors: {
      primary: '#3D2E24',
      secondary: '#B8865C',
      accent: '#D4A574',
      background: '#FDFAF7',
      surface: '#FFFFFF',
      text: '#2D2018',
      textSecondary: '#8B7D72',
      border: '#E8DED4',
      error: '#BF360C',
      success: '#33691E',
      warning: '#E65100',
    },
    industries: ['corporativo', 'arquitetura', 'design', 'imobiliário'],
  },
  {
    name: 'Midnight Blue',
    description: 'Azul meia-noite — clássico corporativo',
    colors: {
      primary: '#0D1B2A',
      secondary: '#1B4965',
      accent: '#62B6CB',
      background: '#F8FAFC',
      surface: '#FFFFFF',
      text: '#0D1B2A',
      textSecondary: '#5A6B7A',
      border: '#DEE2E6',
      error: '#C1121F',
      success: '#2D6A4F',
      warning: '#D68C45',
    },
    industries: ['corporativo', 'banco', 'seguros', 'governo'],
  },

  // 🎨 CRIATIVO / AGÊNCIA
  {
    name: 'Sunset Gradient',
    description: 'Laranja-rosa vibrante sobre escuro — criativo e ousado',
    colors: {
      primary: '#FF6B35',
      secondary: '#F7C59F',
      accent: '#EF3E36',
      background: '#1A0A0A',
      surface: '#2D1515',
      text: '#FFF5F0',
      textSecondary: '#C0A090',
      border: '#3A2020',
      error: '#FF4444',
      success: '#4CAF50',
      warning: '#FFB74D',
    },
    industries: ['agência', 'criativo', 'marketing', 'entretenimento'],
  },
  {
    name: 'Electric Purple',
    description: 'Roxo elétrico com rosa — moderno e disruptivo',
    colors: {
      primary: '#7C3AED',
      secondary: '#EC4899',
      accent: '#FB923C',
      background: '#0F0A1A',
      surface: '#1F1530',
      text: '#FFFFFF',
      textSecondary: '#B0A0C0',
      border: '#2A2040',
      error: '#FF4466',
      success: '#22C55E',
      warning: '#FBBF24',
    },
    industries: ['criativo', 'fashion', 'beleza', 'música'],
  },
  {
    name: 'Neon Pulse',
    description: 'Neon ciano e rosa — cyberpunk criativo',
    colors: {
      primary: '#00F5D4',
      secondary: '#FF006E',
      accent: '#FFBE0B',
      background: '#0A0A1A',
      surface: '#151530',
      text: '#FFFFFF',
      textSecondary: '#B0B0C0',
      border: '#2A2A40',
      error: '#FF3355',
      success: '#00FF87',
      warning: '#FFD700',
    },
    industries: ['gaming', 'tech criativo', 'eventos', 'entretenimento'],
  },
  {
    name: 'Pastel Dream',
    description: 'Pastéis suaves — delicado e acolhedor',
    colors: {
      primary: '#F48FB1',
      secondary: '#B39DDB',
      accent: '#FFE082',
      background: '#FEF7F9',
      surface: '#FFFFFF',
      text: '#2D1B2E',
      textSecondary: '#8A7A8A',
      border: '#F0E0E8',
      error: '#E57373',
      success: '#81C784',
      warning: '#FFD54F',
    },
    industries: ['moda', 'beleza', 'maternidade', 'infantil'],
  },
  {
    name: 'Artisan Warm',
    description: 'Tons terrosos e artesanais — autêntico e acolhedor',
    colors: {
      primary: '#8D6E63',
      secondary: '#A1887F',
      accent: '#FFAB91',
      background: '#FBF7F4',
      surface: '#FFFFFF',
      text: '#3E2723',
      textSecondary: '#8D6E63',
      border: '#E0D5CC',
      error: '#BF360C',
      success: '#558B2F',
      warning: '#E65100',
    },
    industries: ['artesanato', 'decoração', 'gastronomia', 'cafeteria'],
  },

  // 🏪 E-COMMERCE
  {
    name: 'Coral Commerce',
    description: 'Coral vibrante com azul marinho — e-commerce confiante',
    colors: {
      primary: '#FF6F61',
      secondary: '#2C3E50',
      accent: '#E74C3C',
      background: '#FFFFFF',
      surface: '#F8F5F4',
      text: '#2C3E50',
      textSecondary: '#7F8C8D',
      border: '#E8E0DE',
      error: '#C0392B',
      success: '#27AE60',
      warning: '#F39C12',
    },
    industries: ['e-commerce', 'moda', 'acessórios', 'cosméticos'],
  },
  {
    name: 'Emerald Cart',
    description: 'Verde esmeralda com ouro — e-commerce premium',
    colors: {
      primary: '#0B6B43',
      secondary: '#D4AF37',
      accent: '#1B8C5E',
      background: '#FFFFFF',
      surface: '#F5FAF8',
      text: '#0A2A1A',
      textSecondary: '#5A7A6A',
      border: '#D0E0D8',
      error: '#C0392B',
      success: '#27AE60',
      warning: '#F39C12',
    },
    industries: ['e-commerce', 'joias', 'presentes', 'luxo'],
  },
  {
    name: 'Berry Fresh',
    description: 'Framboesa com creme — vibrante e apetitoso',
    colors: {
      primary: '#C62828',
      secondary: '#FF8A80',
      accent: '#FF4081',
      background: '#FFF8F8',
      surface: '#FFFFFF',
      text: '#2D1215',
      textSecondary: '#8A5A5A',
      border: '#F0D8D8',
      error: '#C62828',
      success: '#2E7D32',
      warning: '#F57C00',
    },
    industries: ['alimentos', 'bebidas', 'confeitaria', 'gastronomia'],
  },
  {
    name: 'Ocean Breeze',
    description: 'Azul oceano com areia — e-commerce de verão',
    colors: {
      primary: '#006064',
      secondary: '#00BCD4',
      accent: '#FFD54F',
      background: '#F0FDFF',
      surface: '#FFFFFF',
      text: '#002F35',
      textSecondary: '#5A8088',
      border: '#B8E0E8',
      error: '#C62828',
      success: '#2E7D32',
      warning: '#F57C00',
    },
    industries: ['e-commerce', 'moda praia', 'viagens', 'turismo'],
  },

  // 🎓 EDUCAÇÃO
  {
    name: 'Learn Blue',
    description: 'Azul acadêmico com laranja — educação dinâmica',
    colors: {
      primary: '#1565C0',
      secondary: '#FF8F00',
      accent: '#42A5F5',
      background: '#F5F9FF',
      surface: '#FFFFFF',
      text: '#0D2137',
      textSecondary: '#5A728A',
      border: '#D8E3F0',
      error: '#D32F2F',
      success: '#388E3C',
      warning: '#F57C00',
    },
    industries: ['educação', 'cursos', 'e-learning', 'academia'],
  },
  {
    name: 'Mind Growth',
    description: 'Verde menta com roxo — aprendizado criativo',
    colors: {
      primary: '#00BFA5',
      secondary: '#7C4DFF',
      accent: '#B388FF',
      background: '#F0FDFA',
      surface: '#FFFFFF',
      text: '#003D33',
      textSecondary: '#5A7D78',
      border: '#C8ECE6',
      error: '#D32F2F',
      success: '#388E3C',
      warning: '#F57C00',
    },
    industries: ['educação', 'infantil', 'criativo', 'desenvolvimento'],
  },

  // ☀️ MINIMALISTA / CLEAN
  {
    name: 'Pure White',
    description: 'Branco puro com preto — minimalismo absoluto',
    colors: {
      primary: '#000000',
      secondary: '#FFFFFF',
      accent: '#FF3366',
      background: '#FFFFFF',
      surface: '#F8F8F8',
      text: '#000000',
      textSecondary: '#666666',
      border: '#E0E0E0',
      error: '#D32F2F',
      success: '#388E3C',
      warning: '#F57C00',
    },
    industries: ['design', 'arte', 'fotografia', 'portfólio'],
  },
  {
    name: 'Warm Minimal',
    description: 'Branco quente com areia — minimalismo acolhedor',
    colors: {
      primary: '#2D2018',
      secondary: '#F5F0EB',
      accent: '#B8865C',
      background: '#FDFBF9',
      surface: '#FFFFFF',
      text: '#2D2018',
      textSecondary: '#8B7D72',
      border: '#E8E2DC',
      error: '#BF360C',
      success: '#33691E',
      warning: '#E65100',
    },
    industries: ['design', 'interiores', 'arquitetura', 'slow living'],
  },
  {
    name: 'Cool Minimal',
    description: 'Branco frio com azul gelo — minimalismo técnico',
    colors: {
      primary: '#1A202C',
      secondary: '#E2E8F0',
      accent: '#3182CE',
      background: '#FFFFFF',
      surface: '#F7FAFC',
      text: '#1A202C',
      textSecondary: '#718096',
      border: '#E2E8F0',
      error: '#E53E3E',
      success: '#38A169',
      warning: '#DD6B20',
    },
    industries: ['tech', 'SaaS', 'startup', 'design'],
  },
  {
    name: 'Beige Serenity',
    description: 'Bege suave com marrom — minimalismo natural',
    colors: {
      primary: '#6B4F3A',
      secondary: '#D4C5B0',
      accent: '#A08868',
      background: '#FAF7F3',
      surface: '#FFFFFF',
      text: '#3D2E24',
      textSecondary: '#8A7A6A',
      border: '#E0D8D0',
      error: '#BF360C',
      success: '#33691E',
      warning: '#E65100',
    },
    industries: ['slow living', 'design', 'moda', 'cafeteria'],
  },

  // 🔥 RESTAURANTES / GASTRONOMIA
  {
    name: 'Spice Market',
    description: 'Vermelho apimentado com laranja — gastronomia vibrante',
    colors: {
      primary: '#B71C1C',
      secondary: '#FF6F00',
      accent: '#FFAB00',
      background: '#FFF8F0',
      surface: '#FFFFFF',
      text: '#2D0A0A',
      textSecondary: '#8A4040',
      border: '#F0D8D0',
      error: '#C62828',
      success: '#2E7D32',
      warning: '#F57C00',
    },
    industries: ['restaurante', 'gastronomia', 'comida', 'bar'],
  },
  {
    name: 'Earthy Kitchen',
    description: 'Tons terrosos e verdes — restaurante natural',
    colors: {
      primary: '#4E342E',
      secondary: '#8D6E63',
      accent: '#6D4C41',
      background: '#FBF7F4',
      surface: '#FFFFFF',
      text: '#2D1B13',
      textSecondary: '#7A6058',
      border: '#E0D5CC',
      error: '#BF360C',
      success: '#33691E',
      warning: '#E65100',
    },
    industries: ['restaurante', 'café', 'padaria', 'comida natural'],
  },
  {
    name: 'Sakura Bloom',
    description: 'Rosa cerejeira com dourado — gastronomia oriental',
    colors: {
      primary: '#880E4F',
      secondary: '#F8BBD0',
      accent: '#D4AF37',
      background: '#FEF8FA',
      surface: '#FFFFFF',
      text: '#2D0A1A',
      textSecondary: '#8A5A6A',
      border: '#F0D8E0',
      error: '#C62828',
      success: '#2E7D32',
      warning: '#F57C00',
    },
    industries: ['restaurante', 'culinária oriental', 'japonês', 'confeitaria'],
  },

  // 🌴 VIAGENS / TURISMO
  {
    name: 'Tropical Paradise',
    description: 'Azul caribenho com verde palmeira — férias e viagens',
    colors: {
      primary: '#00796B',
      secondary: '#FFD54F',
      accent: '#00BCD4',
      background: '#F0FFF8',
      surface: '#FFFFFF',
      text: '#00332A',
      textSecondary: '#5A7A6A',
      border: '#B8E0D8',
      error: '#C62828',
      success: '#2E7D32',
      warning: '#F57C00',
    },
    industries: ['viagens', 'turismo', 'hotéis', 'resorts'],
  },
  {
    name: 'Desert Dusk',
    description: 'Dourado deserto com roxo crepúsculo — viagens exóticas',
    colors: {
      primary: '#B8865C',
      secondary: '#6A1B9A',
      accent: '#E8A040',
      background: '#FEF8F0',
      surface: '#FFFFFF',
      text: '#3D2E0A',
      textSecondary: '#8A7A5A',
      border: '#E8DCC8',
      error: '#BF360C',
      success: '#33691E',
      warning: '#E65100',
    },
    industries: ['viagens', 'aventura', 'turismo', 'fotografia'],
  },

  // 🏢 IMOBILIÁRIO
  {
    name: 'Estate Gold',
    description: 'Azul marinho e dourado — imobiliário de luxo',
    colors: {
      primary: '#1A2940',
      secondary: '#D4AF37',
      accent: '#C0A040',
      background: '#F8F7F4',
      surface: '#FFFFFF',
      text: '#1A2940',
      textSecondary: '#6B7588',
      border: '#D6D0C8',
      error: '#C62828',
      success: '#2E7D32',
      warning: '#EF6C00',
    },
    industries: ['imobiliário', 'luxo', 'incorporação', 'corretagem'],
  },
  {
    name: 'Modern Living',
    description: 'Cinza moderno com verde — imobiliário contemporâneo',
    colors: {
      primary: '#37474F',
      secondary: '#78909C',
      accent: '#4DB6AC',
      background: '#F5F7FA',
      surface: '#FFFFFF',
      text: '#263238',
      textSecondary: '#607D8B',
      border: '#CFD8DC',
      error: '#D32F2F',
      success: '#388E3C',
      warning: '#F57C00',
    },
    industries: ['imobiliário', 'arquitetura', 'design de interiores'],
  },

  // 🎮 GAMING / ENTRETENIMENTO
  {
    name: 'Arcade Neon',
    description: 'Neon azul, rosa e amarelo — gaming retrô-moderno',
    colors: {
      primary: '#000B2B',
      secondary: '#FF00FF',
      accent: '#00FFFF',
      background: '#05001A',
      surface: '#0F0033',
      text: '#FFFFFF',
      textSecondary: '#B0A0C0',
      border: '#2A0050',
      error: '#FF0044',
      success: '#00FF87',
      warning: '#FFD700',
    },
    industries: ['gaming', 'e-sports', 'streaming', 'entretenimento'],
  },
  {
    name: 'Dragon Scale',
    description: 'Verde escuro com dourado — gaming fantasia',
    colors: {
      primary: '#1A3A1A',
      secondary: '#D4AF37',
      accent: '#FF6B35',
      background: '#0A1A0A',
      surface: '#152915',
      text: '#F0F5E8',
      textSecondary: '#8A9A78',
      border: '#2A4A2A',
      error: '#FF4444',
      success: '#4CAF50',
      warning: '#FFB74D',
    },
    industries: ['gaming', 'RPG', 'fantasia', 'entretenimento'],
  },

  // 👶 INFANTIL
  {
    name: 'Rainbow Kids',
    description: 'Arco-íris vibrante — infantil e divertido',
    colors: {
      primary: '#FF6B6B',
      secondary: '#4ECDC4',
      accent: '#FFE66D',
      background: '#FFF8F0',
      surface: '#FFFFFF',
      text: '#2D1B2E',
      textSecondary: '#8A7A8A',
      border: '#F0E0E8',
      error: '#E57373',
      success: '#81C784',
      warning: '#FFD54F',
    },
    industries: ['infantil', 'educação', 'brinquedos', 'entretenimento'],
  },
  {
    name: 'Toys Color',
    description: 'Cores primárias vibrantes — brinquedos e diversão',
    colors: {
      primary: '#D32F2F',
      secondary: '#1976D2',
      accent: '#FBC02D',
      background: '#FFFDF5',
      surface: '#FFFFFF',
      text: '#1A1A2E',
      textSecondary: '#6B6B7A',
      border: '#E0E0E0',
      error: '#D32F2F',
      success: '#388E3C',
      warning: '#F57C00',
    },
    industries: ['infantil', 'brinquedos', 'escolas', 'parques'],
  },

  // ♻️ SUSTENTABILIDADE
  {
    name: 'Eco Green',
    description: 'Verde sustentável com terra — eco-friendly',
    colors: {
      primary: '#2E7D32',
      secondary: '#8D6E63',
      accent: '#66BB6A',
      background: '#F1F8E9',
      surface: '#FFFFFF',
      text: '#1B3A1B',
      textSecondary: '#5A7A5A',
      border: '#C8E6C9',
      error: '#D32F2F',
      success: '#388E3C',
      warning: '#F57C00',
    },
    industries: ['sustentabilidade', 'orgânico', 'energia', 'ambiental'],
  },
  {
    name: 'Ocean Clean',
    description: 'Azul oceano com areia — sustentabilidade marítima',
    colors: {
      primary: '#00695C',
      secondary: '#FFAB91',
      accent: '#26A69A',
      background: '#F0FDF8',
      surface: '#FFFFFF',
      text: '#00332A',
      textSecondary: '#5A7D72',
      border: '#B2DFDB',
      error: '#D32F2F',
      success: '#388E3C',
      warning: '#F57C00',
    },
    industries: ['sustentabilidade', 'oceanografia', 'ambiental'],
  },

  // 🏋️ FITNESS
  {
    name: 'Iron Will',
    description: 'Preto e laranja — fitness e performance',
    colors: {
      primary: '#1A1A1A',
      secondary: '#FF6F00',
      accent: '#FF9100',
      background: '#F8F8F8',
      surface: '#FFFFFF',
      text: '#1A1A1A',
      textSecondary: '#6B6B6B',
      border: '#E0E0E0',
      error: '#D32F2F',
      success: '#388E3C',
      warning: '#F57C00',
    },
    industries: ['fitness', 'academia', 'esportes', 'performance'],
  },
  {
    name: 'Energy Blast',
    description: 'Vermelho e amarelo — energia e movimento',
    colors: {
      primary: '#D50000',
      secondary: '#FFD600',
      accent: '#FF6D00',
      background: '#FFF8F0',
      surface: '#FFFFFF',
      text: '#1A0A0A',
      textSecondary: '#8A4040',
      border: '#F0D8D0',
      error: '#C62828',
      success: '#2E7D32',
      warning: '#F57C00',
    },
    industries: ['fitness', 'esportes', 'crossfit', 'nutrição esportiva'],
  },

  // 🎵 MÚSICA
  {
    name: 'Vibe Purple',
    description: 'Roxo musical com rosa — criativo e moderno',
    colors: {
      primary: '#4A148C',
      secondary: '#E040FB',
      accent: '#7C4DFF',
      background: '#0D0A1A',
      surface: '#1A1530',
      text: '#FFFFFF',
      textSecondary: '#B0A0C0',
      border: '#2A2040',
      error: '#FF4466',
      success: '#22C55E',
      warning: '#FBBF24',
    },
    industries: ['música', 'eventos', 'entretenimento', 'criativo'],
  },
  {
    name: 'Vinyl Classic',
    description: 'Preto vinil com ouro — música clássica e sofisticada',
    colors: {
      primary: '#1A1A1A',
      secondary: '#D4AF37',
      accent: '#8B4513',
      background: '#F5F0E8',
      surface: '#FFFFFF',
      text: '#1A1A1A',
      textSecondary: '#8A7A6A',
      border: '#D8D0C8',
      error: '#C62828',
      success: '#2E7D32',
      warning: '#F57C00',
    },
    industries: ['música', 'instrumentos', 'audiovisual', 'entretenimento'],
  },
];

// ─── 20+ FONT PAIRINGS ──────────────────────────────────────────────────────

export const FONT_PAIRINGS: FontPairing[] = [
  {
    name: 'clash-display-inter',
    display: 'Clash Display',
    body: 'Inter',
    googleImport: '@import url("https://api.fontshare.com/v2/css?f[]=clash-display@400,500,600,700&display=swap");@import url("https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap");',
    displayFamily: '"Clash Display", sans-serif',
    bodyFamily: '"Inter", sans-serif',
    headingSizes: { h1: 'text-5xl md:text-7xl lg:text-8xl', h2: 'text-3xl md:text-5xl lg:text-6xl', h3: 'text-2xl md:text-3xl lg:text-4xl', h4: 'text-xl md:text-2xl' },
    description: 'Display moderno e ousado + corpo limpo versátil. Ideal para landing pages e startups.',
    industries: ['tech', 'startup', 'SaaS', 'landing', 'moderno'],
  },
  {
    name: 'playfair-inter',
    display: 'Playfair Display',
    body: 'Inter',
    googleImport: '@import url("https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400;1,500&family=Inter:wght@300;400;500;600;700&display=swap");',
    displayFamily: '"Playfair Display", serif',
    bodyFamily: '"Inter", sans-serif',
    headingSizes: { h1: 'text-5xl md:text-7xl lg:text-8xl', h2: 'text-3xl md:text-5xl lg:text-6xl', h3: 'text-2xl md:text-3xl lg:text-4xl', h4: 'text-xl md:text-2xl' },
    description: 'Display serifado elegante + corpo moderno. Luxo e sofisticação.',
    industries: ['luxo', 'moda', 'editorial', 'hotelaria', 'elegante'],
  },
  {
    name: 'space-grotesk-inter',
    display: 'Space Grotesk',
    body: 'Inter',
    googleImport: '@import url("https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@300;400;500;600;700&display=swap");',
    displayFamily: '"Space Grotesk", sans-serif',
    bodyFamily: '"Inter", sans-serif',
    headingSizes: { h1: 'text-4xl md:text-6xl lg:text-7xl', h2: 'text-3xl md:text-4xl lg:text-5xl', h3: 'text-2xl md:text-3xl', h4: 'text-xl md:text-2xl' },
    description: 'Display tech/geometric + corpo clean. Perfeito para startups e tech.',
    industries: ['tech', 'startup', 'criativo', 'gaming', 'futurista'],
  },
  {
    name: 'jakarta-inter',
    display: 'Plus Jakarta Sans',
    body: 'Inter',
    googleImport: '@import url("https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Inter:wght@300;400;500;600;700&display=swap");',
    displayFamily: '"Plus Jakarta Sans", sans-serif',
    bodyFamily: '"Inter", sans-serif',
    headingSizes: { h1: 'text-4xl md:text-6xl lg:text-7xl', h2: 'text-3xl md:text-4xl lg:text-5xl', h3: 'text-2xl md:text-3xl', h4: 'text-xl md:text-2xl' },
    description: 'Sans-serif moderno e amigável + corpo confiável. Corporativo com personalidade.',
    industries: ['corporativo', 'fintech', 'consultoria', 'B2B', 'profissional'],
  },
  {
    name: 'poppins-inter',
    display: 'Poppins',
    body: 'Inter',
    googleImport: '@import url("https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&family=Inter:wght@300;400;500;600;700&display=swap");',
    displayFamily: '"Poppins", sans-serif',
    bodyFamily: '"Inter", sans-serif',
    headingSizes: { h1: 'text-4xl md:text-6xl lg:text-7xl', h2: 'text-3xl md:text-4xl lg:text-5xl', h3: 'text-2xl md:text-3xl', h4: 'text-xl md:text-2xl' },
    description: 'Display geométrico e divertido + corpo funcional. Ideal para marcas jovens.',
    industries: ['criativo', 'moda', 'infantil', 'educação', 'jovem'],
  },
  {
    name: 'inter-roboto-mono',
    display: 'Inter',
    body: 'Roboto Mono',
    googleImport: '@import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Roboto+Mono:wght@400;500;600;700&display=swap");',
    displayFamily: '"Inter", sans-serif',
    bodyFamily: '"Roboto Mono", monospace',
    headingSizes: { h1: 'text-4xl md:text-6xl lg:text-7xl', h2: 'text-2xl md:text-4xl lg:text-5xl', h3: 'text-xl md:text-2xl lg:text-3xl', h4: 'text-lg md:text-xl' },
    description: 'Display limpo + corpo mono-espaçado. Estética dev/tech minimalista.',
    industries: ['tech', 'dev', 'cybersecurity', 'SaaS', 'minimalista'],
  },
  {
    name: 'cabinet-grotesk-inter',
    display: 'Cabinet Grotesk',
    body: 'Inter',
    googleImport: '@import url("https://api.fontshare.com/v2/css?f[]=cabinet-grotesk@400,500,700,800,900&display=swap");@import url("https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap");',
    displayFamily: '"Cabinet Grotesk", sans-serif',
    bodyFamily: '"Inter", sans-serif',
    headingSizes: { h1: 'text-5xl md:text-7xl lg:text-8xl', h2: 'text-3xl md:text-5xl lg:text-6xl', h3: 'text-2xl md:text-3xl lg:text-4xl', h4: 'text-xl md:text-2xl' },
    description: 'Display condensado e ousado + corpo limpo. Impacto visual máximo.',
    industries: ['agência', 'criativo', 'fashion', 'premium', 'design'],
  },
  {
    name: 'satoshi-inter',
    display: 'Satoshi',
    body: 'Inter',
    googleImport: '@import url("https://api.fontshare.com/v2/css?f[]=satoshi@400,500,700,900&display=swap");@import url("https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap");',
    displayFamily: '"Satoshi", sans-serif',
    bodyFamily: '"Inter", sans-serif',
    headingSizes: { h1: 'text-4xl md:text-6xl lg:text-7xl', h2: 'text-3xl md:text-4xl lg:text-5xl', h3: 'text-2xl md:text-3xl', h4: 'text-xl md:text-2xl' },
    description: 'Display versátil e moderno + corpo elegante. Ótimo para qualquer projeto.',
    industries: ['tech', 'design', 'agência', 'moderno', 'corporativo'],
  },
  {
    name: 'fraunces-inter',
    display: 'Fraunces',
    body: 'Inter',
    googleImport: '@import url("https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;0,9..144,600;0,9..144,700;0,9..144,800;1,9..144,400&family=Inter:wght@300;400;500;600;700&display=swap");',
    displayFamily: '"Fraunces", serif',
    bodyFamily: '"Inter", sans-serif',
    headingSizes: { h1: 'text-5xl md:text-7xl lg:text-8xl', h2: 'text-3xl md:text-5xl lg:text-6xl', h3: 'text-2xl md:text-3xl lg:text-4xl', h4: 'text-xl md:text-2xl' },
    description: 'Display serifado vintage-moderno + corpo clean. Personalidade e tradição.',
    industries: ['editorial', 'luxo', 'gastronomia', 'moda', 'premium'],
  },
  {
    name: 'montserrat-inter',
    display: 'Montserrat',
    body: 'Inter',
    googleImport: '@import url("https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800;900&family=Inter:wght@300;400;500;600;700&display=swap");',
    displayFamily: '"Montserrat", sans-serif',
    bodyFamily: '"Inter", sans-serif',
    headingSizes: { h1: 'text-4xl md:text-6xl lg:text-7xl', h2: 'text-3xl md:text-4xl lg:text-5xl', h3: 'text-2xl md:text-3xl', h4: 'text-xl md:text-2xl' },
    description: 'Display geométrico popular + corpo limpo. Confiável e versátil.',
    industries: ['corporativo', 'moda', 'turismo', 'imobiliário', 'geral'],
  },
  {
    name: 'archivo-inter',
    display: 'Archivo',
    body: 'Inter',
    googleImport: '@import url("https://fonts.googleapis.com/css2?family=Archivo:wght@400;500;600;700;800;900&family=Inter:wght@300;400;500;600;700&display=swap");',
    displayFamily: '"Archivo", sans-serif',
    bodyFamily: '"Inter", sans-serif',
    headingSizes: { h1: 'text-5xl md:text-7xl lg:text-8xl', h2: 'text-3xl md:text-5xl lg:text-6xl', h3: 'text-2xl md:text-3xl lg:text-4xl', h4: 'text-xl md:text-2xl' },
    description: 'Display condensado industrial + corpo moderno. Impacto e legibilidade.',
    industries: ['tech', 'industrial', 'automotivo', 'corporativo', 'design'],
  },
  {
    name: 'sora-inter',
    display: 'Sora',
    body: 'Inter',
    googleImport: '@import url("https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&family=Inter:wght@300;400;500;600;700&display=swap");',
    displayFamily: '"Sora", sans-serif',
    bodyFamily: '"Inter", sans-serif',
    headingSizes: { h1: 'text-4xl md:text-6xl lg:text-7xl', h2: 'text-3xl md:text-4xl lg:text-5xl', h3: 'text-2xl md:text-3xl', h4: 'text-xl md:text-2xl' },
    description: 'Display moderno e arejado + corpo funcional. Startup e inovação.',
    industries: ['startup', 'tech', 'design', 'inovação', 'moderno'],
  },
  {
    name: 'dm-serif-inter',
    display: 'DM Serif Display',
    body: 'Inter',
    googleImport: '@import url("https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Inter:wght@300;400;500;600;700&display=swap");',
    displayFamily: '"DM Serif Display", serif',
    bodyFamily: '"Inter", sans-serif',
    headingSizes: { h1: 'text-5xl md:text-7xl lg:text-8xl', h2: 'text-3xl md:text-5xl lg:text-6xl', h3: 'text-2xl md:text-3xl lg:text-4xl', h4: 'text-xl md:text-2xl' },
    description: 'Display serifado elegante + corpo moderno. Sofisticação sem perder a modernidade.',
    industries: ['editorial', 'luxo', 'moda', 'gastronomia', 'premium'],
  },
  {
    name: 'outfit-inter',
    display: 'Outfit',
    body: 'Inter',
    googleImport: '@import url("https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&family=Inter:wght@300;400;500;600;700&display=swap");',
    displayFamily: '"Outfit", sans-serif',
    bodyFamily: '"Inter", sans-serif',
    headingSizes: { h1: 'text-4xl md:text-6xl lg:text-7xl', h2: 'text-3xl md:text-4xl lg:text-5xl', h3: 'text-2xl md:text-3xl', h4: 'text-xl md:text-2xl' },
    description: 'Display geométrico suave + corpo limpo. Moderno e amigável.',
    industries: ['moderno', 'startup', 'design', 'criativo', 'fashion'],
  },
  {
    name: 'bricolage-inter',
    display: 'Bricolage Grotesque',
    body: 'Inter',
    googleImport: '@import url("https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400;12..96,500;12..96,600;12..96,700;12..96,800&family=Inter:wght@300;400;500;600;700&display=swap");',
    displayFamily: '"Bricolage Grotesque", sans-serif',
    bodyFamily: '"Inter", sans-serif',
    headingSizes: { h1: 'text-4xl md:text-6xl lg:text-7xl', h2: 'text-3xl md:text-4xl lg:text-5xl', h3: 'text-2xl md:text-3xl', h4: 'text-xl md:text-2xl' },
    description: 'Display dinâmico e criativo + corpo versátil. Personalidade única.',
    industries: ['criativo', 'agência', 'design', 'arte', 'fashion'],
  },
  {
    name: 'expletus-sans-inter',
    display: 'Expletus Sans',
    body: 'Inter',
    googleImport: '@import url("https://fonts.googleapis.com/css2?family=Expletus+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Inter:wght@300;400;500;600;700&display=swap");',
    displayFamily: '"Expletus Sans", sans-serif',
    bodyFamily: '"Inter", sans-serif',
    headingSizes: { h1: 'text-4xl md:text-6xl lg:text-7xl', h2: 'text-3xl md:text-4xl lg:text-5xl', h3: 'text-2xl md:text-3xl', h4: 'text-xl md:text-2xl' },
    description: 'Display itálico expressivo + corpo limpo. Arte e criatividade.',
    industries: ['arte', 'criativo', 'design', 'fashion', 'música'],
  },
  {
    name: 'spline-sans-inter',
    display: 'Spline Sans',
    body: 'Inter',
    googleImport: '@import url("https://fonts.googleapis.com/css2?family=Spline+Sans:wght@400;500;600;700&family=Inter:wght@300;400;500;600;700&display=swap");',
    displayFamily: '"Spline Sans", sans-serif',
    bodyFamily: '"Inter", sans-serif',
    headingSizes: { h1: 'text-4xl md:text-6xl lg:text-7xl', h2: 'text-3xl md:text-4xl lg:text-5xl', h3: 'text-2xl md:text-3xl', h4: 'text-xl md:text-2xl' },
    description: 'Display limpo e moderno + corpo versátil. UI/UX focado.',
    industries: ['tech', 'UI/UX', 'design', 'SaaS', 'moderno'],
  },
  {
    name: 'sentient-inter',
    display: 'Sentient',
    body: 'Inter',
    googleImport: '@import url("https://api.fontshare.com/v2/css?f[]=sentient@400,500,600,700&display=swap");@import url("https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap");',
    displayFamily: '"Sentient", serif',
    bodyFamily: '"Inter", sans-serif',
    headingSizes: { h1: 'text-5xl md:text-7xl lg:text-8xl', h2: 'text-3xl md:text-5xl lg:text-6xl', h3: 'text-2xl md:text-3xl lg:text-4xl', h4: 'text-xl md:text-2xl' },
    description: 'Display serifado contemporâneo + corpo moderno. Inteligente e refinado.',
    industries: ['editorial', 'luxo', 'acadêmico', 'premium', 'conteúdo'],
  },
  {
    name: 'bebas-neue-inter',
    display: 'Bebas Neue',
    body: 'Inter',
    googleImport: '@import url("https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@300;400;500;600;700&display=swap");',
    displayFamily: '"Bebas Neue", sans-serif',
    bodyFamily: '"Inter", sans-serif',
    headingSizes: { h1: 'text-6xl md:text-8xl lg:text-9xl', h2: 'text-4xl md:text-6xl lg:text-7xl', h3: 'text-3xl md:text-4xl lg:text-5xl', h4: 'text-2xl md:text-3xl' },
    description: 'Display condensado impactante + corpo versátil. Máximo impacto visual.',
    industries: ['moda', 'esportes', 'entretenimento', 'gaming', 'criativo'],
  },
  {
    name: 'manrope-inter',
    display: 'Manrope',
    body: 'Inter',
    googleImport: '@import url("https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=Inter:wght@300;400;500;600;700&display=swap");',
    displayFamily: '"Manrope", sans-serif',
    bodyFamily: '"Inter", sans-serif',
    headingSizes: { h1: 'text-4xl md:text-6xl lg:text-7xl', h2: 'text-3xl md:text-4xl lg:text-5xl', h3: 'text-2xl md:text-3xl', h4: 'text-xl md:text-2xl' },
    description: 'Sans-serif moderna e profissional para tudo. Versátil e confiável.',
    industries: ['corporativo', 'tech', 'fintech', 'geral', 'B2B'],
  },
];

// ─── ANIMAÇÕES TAILWIND ─────────────────────────────────────────────────────

export const TAILWIND_ANIMATIONS: TailwindAnimation[] = [
  {
    name: 'fade-in',
    keyframes: '@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }',
    utility: 'animate-fade-in',
    description: 'Fade in suave — ótimo para qualquer elemento',
  },
  {
    name: 'fade-in-up',
    keyframes: '@keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }',
    utility: 'animate-fade-in-up',
    description: 'Fade in subindo — padrão para seções ao scroll',
  },
  {
    name: 'fade-in-down',
    keyframes: '@keyframes fadeInDown { from { opacity: 0; transform: translateY(-20px); } to { opacity: 1; transform: translateY(0); } }',
    utility: 'animate-fade-in-down',
    description: 'Fade in descendo — para headers e elementos superiores',
  },
  {
    name: 'scale-in',
    keyframes: '@keyframes scaleIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }',
    utility: 'animate-scale-in',
    description: 'Scale in — cards e elementos que devem chamar atenção',
  },
  {
    name: 'slide-in-left',
    keyframes: '@keyframes slideInLeft { from { opacity: 0; transform: translateX(-30px); } to { opacity: 1; transform: translateX(0); } }',
    utility: 'animate-slide-in-left',
    description: 'Slide da esquerda — imagens e elementos laterais',
  },
  {
    name: 'slide-in-right',
    keyframes: '@keyframes slideInRight { from { opacity: 0; transform: translateX(30px); } to { opacity: 1; transform: translateX(0); } }',
    utility: 'animate-slide-in-right',
    description: 'Slide da direita — CTAs e elementos de ação',
  },
  {
    name: 'float',
    keyframes: '@keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }',
    utility: 'animate-float',
    description: 'Flutuação suave — elementos decorativos, badges',
  },
  {
    name: 'pulse-glow',
    keyframes: '@keyframes pulseGlow { 0%, 100% { box-shadow: 0 0 0 0 rgba(59,130,246,0.4); } 50% { box-shadow: 0 0 20px 10px rgba(59,130,246,0.1); } }',
    utility: 'animate-pulse-glow',
    description: 'Glow pulsante — CTAs e destaques',
  },
  {
    name: 'gradient-shift',
    keyframes: '@keyframes gradientShift { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }',
    utility: 'animate-gradient-shift',
    description: 'Movimento de gradiente — backgrounds animados',
  },
  {
    name: 'stagger-fade',
    keyframes: '@keyframes staggerFade { from { opacity: 0; transform: translateY(15px); } to { opacity: 1; transform: translateY(0); } }',
    utility: 'animate-stagger-fade',
    description: 'Fade com stagger — grids de cards e listas',
  },
];

// ─── LAYOUT TEMPLATES ───────────────────────────────────────────────────────

export const LAYOUT_TEMPLATES: Record<string, LayoutTemplate> = {
  'landing-premium': {
    name: 'Landing Page Premium',
    type: 'landing',
    description: 'Landing page completa com header fixo, hero fullscreen, features grid, pricing, testimonials, CTA e footer premium',
    sections: ['header', 'hero', 'logo-cloud', 'features', 'stats', 'pricing', 'testimonials', 'cta', 'faq', 'footer'],
    gridConfig: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8',
  },
  'saas-platform': {
    name: 'SaaS Platform',
    type: 'saas',
    description: 'Landing page SaaS com hero explicativo, features detalhadas, pricing comparativo, testimonials e CTA',
    sections: ['header', 'hero', 'logo-cloud', 'features', 'stats', 'pricing', 'testimonials', 'cta', 'footer'],
    gridConfig: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8',
  },
  'ecommerce': {
    name: 'E-commerce Estilo',
    type: 'ecommerce',
    description: 'Loja virtual clean com hero promocional, grid de produtos, categorias, testimonials e footer',
    sections: ['header', 'hero', 'features', 'gallery', 'testimonials', 'cta', 'footer'],
    gridConfig: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8',
  },
  'portfolio': {
    name: 'Portfólio Criativo',
    type: 'portfolio',
    description: 'Portfólio visual com hero minimalista, grid de projetos, about, testimonials e contato',
    sections: ['header', 'hero', 'gallery', 'about', 'testimonials', 'contact', 'footer'],
    gridConfig: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8',
  },
  'health-clinic': {
    name: 'Clínica de Saúde',
    type: 'health',
    description: 'Site clínico acolhedor com hero, especialidades, equipe, depoimentos, FAQ e contato',
    sections: ['header', 'hero', 'about', 'features', 'team', 'testimonials', 'faq', 'contact', 'footer'],
    gridConfig: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8',
  },
  'restaurant': {
    name: 'Restaurante',
    type: 'restaurant',
    description: 'Site de restaurante com hero apetitoso, menu/galeria, sobre, depoimentos, reserva e footer',
    sections: ['header', 'hero', 'about', 'gallery', 'testimonials', 'contact', 'footer'],
    gridConfig: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8',
  },
  'agency': {
    name: 'Agência Criativa',
    type: 'agency',
    description: 'Site de agência com hero ousado, serviços, portfolio, cases, equipe e contato',
    sections: ['header', 'hero', 'logo-cloud', 'features', 'gallery', 'team', 'testimonials', 'contact', 'footer'],
    gridConfig: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8',
  },
  'blog': {
    name: 'Blog Moderno',
    type: 'blog',
    description: 'Blog com hero editorial, grid de posts, categorias, newsletter e footer',
    sections: ['header', 'hero', 'blog', 'cta', 'footer'],
    gridConfig: 'max-w-6xl mx-auto px-4 sm:px-6 lg:px-8',
  },
  'event': {
    name: 'Página de Evento',
    type: 'event',
    description: 'Landing de evento com hero contador, agenda, palestrantes, galeria e inscrição',
    sections: ['header', 'hero', 'stats', 'features', 'team', 'gallery', 'cta', 'footer'],
    gridConfig: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8',
  },
};

// ─── FUNÇÕES DE SELEÇÃO ─────────────────────────────────────────────────────

/**
 * Seleciona a paleta de cores mais adequada baseada na análise do prompt.
 */
export function selectPalette(params: {
  tone: string;
  industry: string;
  darkMode: boolean;
}): ColorPalette {
  const { tone, industry, darkMode } = params;
  const lower = `${tone} ${industry}`.toLowerCase();

  // Paletas escuras se darkMode
  const darkPalettes = COLOR_PALETTES.filter((p) => {
    const c = p.colors;
    const isDark = isColorDark(c.background);
    return isDark;
  });

  const lightPalettes = COLOR_PALETTES.filter((p) => {
    return !isColorDark(p.colors.background);
  });

  const pool = darkMode ? darkPalettes : lightPalettes;
  if (pool.length === 0) return COLOR_PALETTES[0];

  // Score matching
  let best = pool[0];
  let bestScore = 0;

  for (const pal of pool) {
    let score = 0;

    // Match industry keywords
    for (const ind of pal.industries) {
      if (lower.includes(ind.toLowerCase())) {
        score += 3;
      }
    }

    // Match tone-specific keywords
    if (tone === 'luxo' && pal.name.toLowerCase().includes('gold')) score += 2;
    if (tone === 'criativo' && (pal.name.toLowerCase().includes('neon') || pal.name.toLowerCase().includes('purple'))) score += 2;
    if (tone === 'corporativo' && (pal.name.toLowerCase().includes('navy') || pal.name.toLowerCase().includes('corporate'))) score += 2;
    if (tone === 'minimalista' && (pal.name.toLowerCase().includes('minimal') || pal.name.toLowerCase().includes('white'))) score += 2;
    if (tone === 'tecnico' && (pal.name.toLowerCase().includes('tech') || pal.name.toLowerCase().includes('dark'))) score += 2;
    if (tone === 'moderno' && (pal.name.toLowerCase().includes('modern') || pal.name.toLowerCase().includes('teal'))) score += 2;

    if (score > bestScore) {
      bestScore = score;
      best = pal;
    }
  }

  return best;
}

/**
 * Seleciona o font pairing ideal baseado no tom e setor.
 */
export function selectFontPairing(params: {
  fontPairing?: string;
  tone: string;
  industry: string;
}): FontPairing {
  const { fontPairing, tone } = params;

  // Se um pairing específico foi solicitado
  if (fontPairing) {
    const found = FONT_PAIRINGS.find((f) => f.name === fontPairing);
    if (found) return found;
  }

  // Score matching
  const lower = tone.toLowerCase();
  let best = FONT_PAIRINGS[0];
  let bestScore = 0;

  for (const fp of FONT_PAIRINGS) {
    let score = 0;

    for (const ind of fp.industries) {
      if (lower.includes(ind.toLowerCase())) score += 2;
    }

    if (tone === 'luxo' && fp.name.includes('playfair')) score += 3;
    if (tone === 'criativo' && (fp.name.includes('space') || fp.name.includes('bricolage'))) score += 3;
    if (tone === 'corporativo' && fp.name.includes('jakarta')) score += 3;
    if (tone === 'tecnico' && fp.name.includes('mono')) score += 3;
    if (tone === 'moderno' && fp.name.includes('clash')) score += 3;
    if (tone === 'minimalista' && fp.name.includes('inter')) score += 3;
    if (tone === 'jovem' && fp.name.includes('poppins')) score += 3;

    if (score > bestScore) {
      bestScore = score;
      best = fp;
    }
  }

  return best;
}

// ─── HELPERS ─────────────────────────────────────────────────────────────────

function isColorDark(hex: string): boolean {
  const c = hex.replace('#', '');
  if (c.length < 6) return false;
  const r = parseInt(c.slice(0, 2), 16);
  const g = parseInt(c.slice(2, 4), 16);
  const b = parseInt(c.slice(4, 6), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance < 0.4;
}

/**
 * Gera classes CSS globais para animações Tailwind.
 */
export function generateAnimationCSS(animations?: string[]): string {
  const selected = animations
    ? TAILWIND_ANIMATIONS.filter((a) => animations.includes(a.name))
    : TAILWIND_ANIMATIONS;

  return selected.map((a) => a.keyframes).join('\n\n');
}

/**
 * Gera utilidades Tailwind para animações.
 */
export function generateAnimationUtilities(animations?: string[]): string {
  const selected = animations
    ? TAILWIND_ANIMATIONS.filter((a) => animations.includes(a.name))
    : TAILWIND_ANIMATIONS;

  return selected
    .map((a) => {
      const name = a.name;
      return `.animate-${name} { animation: ${name} 0.6s ease-out forwards; }
.animate-${name}-delay-1 { animation-delay: 0.1s; }
.animate-${name}-delay-2 { animation-delay: 0.2s; }
.animate-${name}-delay-3 { animation-delay: 0.3s; }
.animate-${name}-delay-4 { animation-delay: 0.4s; }
.animate-${name}-delay-5 { animation-delay: 0.5s; }`;
    })
    .join('\n\n');
}

/**
 * Gera variáveis CSS para uma paleta de cores.
 */
export function generateColorCSS(palette: ColorPalette): string {
  const { colors } = palette;
  return `:root {
  --color-primary: ${colors.primary};
  --color-secondary: ${colors.secondary};
  --color-accent: ${colors.accent};
  --color-background: ${colors.background};
  --color-surface: ${colors.surface};
  --color-text: ${colors.text};
  --color-text-secondary: ${colors.textSecondary};
  --color-border: ${colors.border};
  --color-error: ${colors.error};
  --color-success: ${colors.success};
  --color-warning: ${colors.warning};
}`;
}

/**
 * Gera classes Tailwind utility para a paleta.
 */
export function generateTailwindUtilities(palette: ColorPalette): string {
  const { colors } = palette;
  return `.bg-primary { background-color: ${colors.primary}; }
.bg-secondary { background-color: ${colors.secondary}; }
.bg-accent { background-color: ${colors.accent}; }
.bg-background { background-color: ${colors.background}; }
.bg-surface { background-color: ${colors.surface}; }
.text-primary { color: ${colors.primary}; }
.text-secondary { color: ${colors.secondary}; }
.text-accent { color: ${colors.accent}; }
.text-text { color: ${colors.text}; }
.text-text-secondary { color: ${colors.textSecondary}; }
.border-primary { border-color: ${colors.primary}; }
.border-border { border-color: ${colors.border}; }`;
}
