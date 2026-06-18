/* ==========================================================================
   Builder — Tipos compartilhados
   ========================================================================== */

export type BlockType =
  | 'hero'
  | 'features'
  | 'pricing'
  | 'testimonials'
  | 'faq'
  | 'cta'
  | 'footer'
  | 'stats'
  | 'gallery'
  | 'contact';

export interface BuilderBlock {
  id: string;
  type: BlockType;
  props: Record<string, unknown>;
}

export interface BuilderProject {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  blocks: BuilderBlock[];
}

export interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  blocks: BuilderBlock[];
  thumbnail?: string;
}

export const COMPONENT_META: Record<BlockType, { label: string; icon: string; defaultProps: Record<string, unknown> }> = {
  hero: {
    label: 'Hero',
    icon: 'Layout',
    defaultProps: {
      title: 'Sua marca aqui',
      subtitle: 'Transforme ideias em resultados',
      cta: 'Começar agora',
      bgColor: '#06080C',
      accentColor: '#3DF5C5',
    },
  },
  features: {
    label: 'Features',
    icon: 'Grid3x3',
    defaultProps: {
      columns: 3,
      title: 'Recursos',
      items: [
        { icon: '⚡', title: 'Rápido', desc: 'Carregamento instantâneo' },
        { icon: '🔒', title: 'Seguro', desc: 'Dados protegidos' },
        { icon: '📱', title: 'Responsivo', desc: 'Funciona em qualquer tela' },
      ],
    },
  },
  pricing: {
    label: 'Pricing',
    icon: 'DollarSign',
    defaultProps: {
      title: 'Planos',
      monthly: true,
      plans: [
        { name: 'Básico', price: 29, features: ['1 projeto', 'Suporte email', '1GB armazenamento'] },
        { name: 'Pro', price: 79, features: ['10 projetos', 'Suporte prioritário', '10GB armazenamento', 'API access'], featured: true },
        { name: 'Enterprise', price: 199, features: ['Projetos ilimitados', 'Suporte 24/7', 'Armazenamento ilimitado', 'API access', 'Custom domain'] },
      ],
    },
  },
  testimonials: {
    label: 'Testimonials',
    icon: 'MessageSquare',
    defaultProps: {
      title: 'Depoimentos',
      items: [
        { name: 'Ana Silva', role: 'CEO, TechCo', text: 'Transformou completamente nossa operação.' },
        { name: 'Carlos Mendes', role: 'CTO, StartupX', text: 'Resultado acima do esperado.' },
        { name: 'Julia Costa', role: 'Diretora, InovaCorp', text: 'Profissionalismo e entrega impecável.' },
      ],
    },
  },
  faq: {
    label: 'FAQ',
    icon: 'HelpCircle',
    defaultProps: {
      title: 'Perguntas Frequentes',
      items: [
        { q: 'Como funciona?', a: 'Simples e direto ao ponto. Agende uma conversa e entendemos seu problema.' },
        { q: 'Quanto tempo leva?', a: 'Projetos típicos levam de 2 a 4 semanas, dependendo da complexidade.' },
        { q: 'Preciso ter equipe técnica?', a: 'Não. Cuidamos de tudo, do planejamento ao deploy.' },
      ],
    },
  },
  cta: {
    label: 'CTA',
    icon: 'Target',
    defaultProps: {
      title: 'Pronto para começar?',
      subtitle: 'Transforme sua ideia em um produto funcional hoje mesmo.',
      buttonText: 'Fale conosco',
    },
  },
  footer: {
    label: 'Footer',
    icon: 'Copyright',
    defaultProps: {
      copyright: '© 2025 Thiago Lab. Todos os direitos reservados.',
      links: [
        { label: 'Privacidade', href: '#' },
        { label: 'Termos', href: '#' },
        { label: 'Contato', href: '#' },
      ],
    },
  },
  stats: {
    label: 'Stats',
    icon: 'BarChart3',
    defaultProps: {
      title: 'Números que falam',
      items: [
        { label: 'Projetos', value: 150 },
        { label: 'Clientes', value: 80 },
        { label: 'Anos', value: 5 },
        { label: 'Países', value: 12 },
      ],
    },
  },
  gallery: {
    label: 'Gallery',
    icon: 'Image',
    defaultProps: {
      title: 'Galeria',
      images: [
        { src: '/placeholder.svg', alt: 'Projeto 1' },
        { src: '/placeholder.svg', alt: 'Projeto 2' },
        { src: '/placeholder.svg', alt: 'Projeto 3' },
      ],
    },
  },
  contact: {
    label: 'Contact',
    icon: 'Mail',
    defaultProps: {
      title: 'Entre em contato',
      email: 'contato@thiagolab.com',
      phone: '(11) 99999-9999',
      address: 'São Paulo, SP',
    },
  },
};

export const TEMPLATES: Template[] = [
  {
    id: 'landing-startup',
    name: 'Landing Page Startup',
    description: 'Landing page moderna para startups de tecnologia',
    category: 'Landing Pages',
    blocks: [
      { id: 'h1', type: 'hero', props: { ...COMPONENT_META.hero.defaultProps, title: 'Revolucione seu mercado', subtitle: 'Tecnologia que transforma ideias em resultados' } },
      { id: 'f1', type: 'features', props: COMPONENT_META.features.defaultProps },
      { id: 's1', type: 'stats', props: COMPONENT_META.stats.defaultProps },
      { id: 'c1', type: 'cta', props: COMPONENT_META.cta.defaultProps },
      { id: 'fo1', type: 'footer', props: COMPONENT_META.footer.defaultProps },
    ],
  },
  {
    id: 'app-saas',
    name: 'App SaaS',
    description: 'Dashboard e página de produto SaaS completo',
    category: 'Apps',
    blocks: [
      { id: 'h2', type: 'hero', props: { ...COMPONENT_META.hero.defaultProps, title: 'SaaS que escala' } },
      { id: 'f2', type: 'features', props: { ...COMPONENT_META.features.defaultProps, columns: 4, items: [...COMPONENT_META.features.defaultProps.items as Array<Record<string,string>>, { icon: '☁️', title: 'Cloud', desc: 'Sincronizado na nuvem' }] } },
      { id: 'p1', type: 'pricing', props: COMPONENT_META.pricing.defaultProps },
      { id: 't1', type: 'testimonials', props: COMPONENT_META.testimonials.defaultProps },
      { id: 'fa1', type: 'faq', props: COMPONENT_META.faq.defaultProps },
      { id: 'fo2', type: 'footer', props: COMPONENT_META.footer.defaultProps },
    ],
  },
  {
    id: 'ecommerce-minimal',
    name: 'E-commerce Minimal',
    description: 'Loja virtual limpa e focada em conversão',
    category: 'E-commerce',
    blocks: [
      { id: 'h3', type: 'hero', props: { ...COMPONENT_META.hero.defaultProps, title: 'Compre com estilo' } },
      { id: 'g1', type: 'gallery', props: COMPONENT_META.gallery.defaultProps },
      { id: 'f3', type: 'features', props: COMPONENT_META.features.defaultProps },
      { id: 'c2', type: 'cta', props: { ...COMPONENT_META.cta.defaultProps, title: 'Oferta exclusiva' } },
      { id: 'fo3', type: 'footer', props: COMPONENT_META.footer.defaultProps },
    ],
  },
  {
    id: 'portfolio-dev',
    name: 'Portfolio Dev',
    description: 'Portfolio moderno para desenvolvedores e designers',
    category: 'Portfolios',
    blocks: [
      { id: 'h4', type: 'hero', props: { ...COMPONENT_META.hero.defaultProps, title: 'Olá, sou [Seu Nome]', subtitle: 'Desenvolvedor Full Stack' } },
      { id: 's2', type: 'stats', props: COMPONENT_META.stats.defaultProps },
      { id: 'g2', type: 'gallery', props: COMPONENT_META.gallery.defaultProps },
      { id: 't2', type: 'testimonials', props: COMPONENT_META.testimonials.defaultProps },
      { id: 'co1', type: 'contact', props: COMPONENT_META.contact.defaultProps },
      { id: 'fo4', type: 'footer', props: COMPONENT_META.footer.defaultProps },
    ],
  },
  {
    id: 'blog-dev',
    name: 'Blog Tech',
    description: 'Blog moderno para conteúdo técnico e tutoriais',
    category: 'Blogs',
    blocks: [
      { id: 'h5', type: 'hero', props: { ...COMPONENT_META.hero.defaultProps, title: 'Blog de Tecnologia' } },
      { id: 'f4', type: 'features', props: COMPONENT_META.features.defaultProps },
      { id: 'fa2', type: 'faq', props: COMPONENT_META.faq.defaultProps },
      { id: 'c3', type: 'cta', props: { ...COMPONENT_META.cta.defaultProps, title: 'Assine a newsletter' } },
      { id: 'fo5', type: 'footer', props: COMPONENT_META.footer.defaultProps },
    ],
  },
  {
    id: 'site-corporativo',
    name: 'Site Corporativo',
    description: 'Site institucional completo para empresas',
    category: 'Sites',
    blocks: [
      { id: 'h6', type: 'hero', props: { ...COMPONENT_META.hero.defaultProps, title: 'Sua empresa, seu legado' } },
      { id: 'f5', type: 'features', props: COMPONENT_META.features.defaultProps },
      { id: 's3', type: 'stats', props: COMPONENT_META.stats.defaultProps },
      { id: 't3', type: 'testimonials', props: COMPONENT_META.testimonials.defaultProps },
      { id: 'co2', type: 'contact', props: COMPONENT_META.contact.defaultProps },
      { id: 'fo6', type: 'footer', props: COMPONENT_META.footer.defaultProps },
    ],
  },
];
