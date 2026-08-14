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
  | 'contact'
  | 'whatsapp'
  | 'localBusiness';

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
  whatsapp: {
    label: 'WhatsApp CTA',
    icon: 'MessageCircle',
    defaultProps: {
      phone: '16999999999',
      message: 'Olá! Vim pelo site e quero um atendimento.',
      source: 'site',
    },
  },
  localBusiness: {
    label: 'LocalBusiness (SEO)',
    icon: 'MapPin',
    defaultProps: {
      businessName: 'Minha Clínica',
      addressLocality: 'Franca',
      addressRegion: 'SP',
      phone: '+55-16-99999-9999',
      openingHours: 'Mo-Fr 08:00-18:00',
      areaServed: 'Franca e região',
      ratingValue: '4.9',
      reviewCount: '120',
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

  /* ── PremiumSite OS — Verticais de Negócio Local ─────────────────────── */
  {
    id: 'local-clinica-saude',
    name: 'Clínica de Saúde',
    description: 'Site para clínicas e consultórios: agendamento, WhatsApp e SEO local. Linguagem informativa, sem promessa de resultado.',
    category: 'Negócios Locais',
    blocks: [
      { id: 'lch1', type: 'hero', props: { ...COMPONENT_META.hero.defaultProps, title: 'Cuidado próximo, humano e no seu tempo', subtitle: 'Agende sua consulta com nossa equipe especializada', cta: 'Agendar consulta' } },
      { id: 'lcf1', type: 'features', props: { title: 'Especialidades', items: [
        { icon: '🩺', title: 'Consultas', desc: 'Atendimento clínico especializado' },
        { icon: '📅', title: 'Agendamento fácil', desc: 'Marque pelo WhatsApp ou site' },
        { icon: '🧾', title: 'Convênios', desc: 'Consulte convênios aceitos' },
      ] } },
      { id: 'lct1', type: 'testimonials', props: { title: 'Depoimentos de pacientes', items: [
        { name: 'Paciente identificado com consentimento', role: 'Consulta de rotina', text: 'Atendimento atencioso e explicações claras sobre cada etapa.' },
      ] } },
      { id: 'lcq1', type: 'faq', props: { title: 'Perguntas Frequentes', items: [
        { q: 'Como faço para agendar?', a: 'Pelo WhatsApp ou pelo formulário de agendamento no site.' },
        { q: 'Quais convênios são aceitos?', a: 'Entre em contato para confirmar a cobertura do seu convênio.' },
      ] } },
      { id: 'lclb1', type: 'localBusiness', props: COMPONENT_META.localBusiness.defaultProps },
      { id: 'lcw1', type: 'whatsapp', props: { ...COMPONENT_META.whatsapp.defaultProps, source: 'clinica-saude' } },
      { id: 'lcc1', type: 'contact', props: COMPONENT_META.contact.defaultProps },
      { id: 'lcfo1', type: 'footer', props: COMPONENT_META.footer.defaultProps },
    ],
  },
  {
    id: 'local-juridico',
    name: 'Escritório de Advocacia',
    description: 'Site para escritórios de advocacia com orientação jurídica clara. Sem promessa de resultado de causa.',
    category: 'Negócios Locais',
    blocks: [
      { id: 'ljh1', type: 'hero', props: { ...COMPONENT_META.hero.defaultProps, title: 'Orientação jurídica clara e acessível', subtitle: 'Fale com nosso escritório e entenda seus direitos', cta: 'Falar com advogado' } },
      { id: 'ljf1', type: 'features', props: { title: 'Áreas de atuação', items: [
        { icon: '⚖️', title: 'Direito Civil', desc: 'Orientação e acompanhamento de processos cíveis' },
        { icon: '👨‍👩‍👧', title: 'Direito de Família', desc: 'Suporte em questões familiares' },
        { icon: '🏢', title: 'Direito Empresarial', desc: 'Consultoria jurídica para empresas' },
      ] } },
      { id: 'ljt1', type: 'testimonials', props: { title: 'Depoimentos de clientes', items: [
        { name: 'Cliente identificado com consentimento', role: 'Atendimento jurídico', text: 'Explicações claras e atendimento transparente durante todo o processo.' },
      ] } },
      { id: 'ljq1', type: 'faq', props: { title: 'Perguntas Frequentes', items: [
        { q: 'Como funciona a primeira consulta?', a: 'Agendamos uma conversa inicial para entender seu caso e orientar os próximos passos.' },
        { q: 'Os atendimentos são sigilosos?', a: 'Sim, todo atendimento segue o sigilo profissional da advocacia.' },
      ] } },
      { id: 'jlb1', type: 'localBusiness', props: { ...COMPONENT_META.localBusiness.defaultProps, businessName: 'Escritório de Advocacia' } },
      { id: 'ljw1', type: 'whatsapp', props: { ...COMPONENT_META.whatsapp.defaultProps, source: 'juridico' } },
      { id: 'ljc1', type: 'contact', props: COMPONENT_META.contact.defaultProps },
      { id: 'ljfo1', type: 'footer', props: COMPONENT_META.footer.defaultProps },
    ],
  },
  {
    id: 'local-estetica',
    name: 'Estúdio de Estética',
    description: 'Site para estúdios de estética e bem-estar com agendamento e conversão via WhatsApp.',
    category: 'Negócios Locais',
    blocks: [
      { id: 'leh1', type: 'hero', props: { ...COMPONENT_META.hero.defaultProps, title: 'Beleza e bem-estar para o seu dia a dia', subtitle: 'Conheça nossos tratamentos e agende seu horário', cta: 'Agendar horário' } },
      { id: 'lef1', type: 'features', props: { title: 'Tratamentos', items: [
        { icon: '✨', title: 'Skincare', desc: 'Cuidados faciais personalizados' },
        { icon: '💆', title: 'Massoterapia', desc: 'Massagens relaxantes e terapêuticas' },
        { icon: '💅', title: 'Estética', desc: 'Procedimentos estéticos com equipe qualificada' },
      ] } },
      { id: 'leg1', type: 'gallery', props: { title: 'Nosso espaço', images: COMPONENT_META.gallery.defaultProps.images } },
      { id: 'let1', type: 'testimonials', props: COMPONENT_META.testimonials.defaultProps },
      { id: 'leq1', type: 'faq', props: { title: 'Perguntas Frequentes', items: [
        { q: 'Preciso agendar com antecedência?', a: 'Recomendamos agendar com pelo menos 1 dia de antecedência.' },
        { q: 'Quais formas de pagamento aceitam?', a: 'Pix, cartão e dinheiro.' },
      ] } },
      { id: 'elb1', type: 'localBusiness', props: { ...COMPONENT_META.localBusiness.defaultProps, businessName: 'Estúdio de Estética' } },
      { id: 'lew1', type: 'whatsapp', props: { ...COMPONENT_META.whatsapp.defaultProps, source: 'estetica' } },
      { id: 'lec1', type: 'contact', props: COMPONENT_META.contact.defaultProps },
      { id: 'lefo1', type: 'footer', props: COMPONENT_META.footer.defaultProps },
    ],
  },
  {
    id: 'local-oficina',
    name: 'Oficina Mecânica',
    description: 'Site para oficinas mecânicas com orçamento rápido via WhatsApp e prova social.',
    category: 'Negócios Locais',
    blocks: [
      { id: 'loh1', type: 'hero', props: { ...COMPONENT_META.hero.defaultProps, title: 'Sua oficina de confiança', subtitle: 'Revisão, freios, suspensão e elétrica com orçamento sem compromisso', cta: 'Solicitar orçamento' } },
      { id: 'lof1', type: 'features', props: { title: 'Serviços', items: [
        { icon: '🔧', title: 'Revisão completa', desc: 'Checagem geral do veículo' },
        { icon: '🛑', title: 'Freios', desc: 'Troca e manutenção de freios' },
        { icon: '⚡', title: 'Elétrica', desc: 'Diagnóstico e reparo elétrico' },
      ] } },
      { id: 'los1', type: 'stats', props: { title: 'Números da oficina', items: [
        { label: 'Anos de experiência', value: 15 },
        { label: 'Veículos atendidos', value: 3200 },
        { label: 'Mecânicos', value: 6 },
      ] } },
      { id: 'lot1', type: 'testimonials', props: COMPONENT_META.testimonials.defaultProps },
      { id: 'loq1', type: 'faq', props: { title: 'Perguntas Frequentes', items: [
        { q: 'O orçamento tem custo?', a: 'Não, o orçamento é gratuito e sem compromisso.' },
        { q: 'Vocês atendem todas as marcas?', a: 'Sim, atendemos veículos nacionais e importados.' },
      ] } },
      { id: 'olb1', type: 'localBusiness', props: { ...COMPONENT_META.localBusiness.defaultProps, businessName: 'Oficina Mecânica' } },
      { id: 'low1', type: 'whatsapp', props: { ...COMPONENT_META.whatsapp.defaultProps, message: 'Olá! Quero um orçamento para meu veículo.', source: 'oficina' } },
      { id: 'loc1', type: 'contact', props: COMPONENT_META.contact.defaultProps },
      { id: 'lofo1', type: 'footer', props: COMPONENT_META.footer.defaultProps },
    ],
  },
  {
    id: 'local-imobiliaria',
    name: 'Imobiliária',
    description: 'Site para imobiliárias e corretores com vitrine de imóveis e contato direto por WhatsApp.',
    category: 'Negócios Locais',
    blocks: [
      { id: 'lih1', type: 'hero', props: { ...COMPONENT_META.hero.defaultProps, title: 'Encontre o imóvel ideal', subtitle: 'Compra, venda e locação com atendimento personalizado', cta: 'Falar com corretor' } },
      { id: 'lif1', type: 'features', props: { title: 'Serviços', items: [
        { icon: '🏠', title: 'Venda', desc: 'Anúncio e negociação de imóveis' },
        { icon: '🔑', title: 'Locação', desc: 'Aluguel com contrato e vistoria' },
        { icon: '📋', title: 'Avaliação', desc: 'Avaliação gratuita do seu imóvel' },
      ] } },
      { id: 'lig1', type: 'gallery', props: { title: 'Imóveis em destaque', images: COMPONENT_META.gallery.defaultProps.images } },
      { id: 'lit1', type: 'testimonials', props: COMPONENT_META.testimonials.defaultProps },
      { id: 'liq1', type: 'faq', props: { title: 'Perguntas Frequentes', items: [
        { q: 'A avaliação do imóvel tem custo?', a: 'Não, a avaliação inicial é gratuita.' },
        { q: 'Vocês atendem toda a região?', a: 'Sim, atendemos a cidade e região.' },
      ] } },
      { id: 'ilb1', type: 'localBusiness', props: { ...COMPONENT_META.localBusiness.defaultProps, businessName: 'Imobiliária' } },
      { id: 'liw1', type: 'whatsapp', props: { ...COMPONENT_META.whatsapp.defaultProps, message: 'Olá! Tenho interesse em um imóvel.', source: 'imobiliaria' } },
      { id: 'lic1', type: 'contact', props: COMPONENT_META.contact.defaultProps },
      { id: 'lifo1', type: 'footer', props: COMPONENT_META.footer.defaultProps },
    ],
  },
  {
    id: 'local-servicos-gerais',
    name: 'Serviços Gerais',
    description: 'Site para prestadores de serviço (encanador, eletricista, chaveiro etc.) com chamada rápida via WhatsApp.',
    category: 'Negócios Locais',
    blocks: [
      { id: 'lsh1', type: 'hero', props: { ...COMPONENT_META.hero.defaultProps, title: 'Serviço rápido e de confiança', subtitle: 'Atendimento no mesmo dia para sua região', cta: 'Chamar no WhatsApp' } },
      { id: 'lsf1', type: 'features', props: { title: 'Serviços oferecidos', items: [
        { icon: '🔧', title: 'Manutenção', desc: 'Reparos e manutenção preventiva' },
        { icon: '🚨', title: 'Emergência', desc: 'Atendimento urgente' },
        { icon: '📝', title: 'Orçamento', desc: 'Orçamento sem compromisso' },
      ] } },
      { id: 'lss1', type: 'stats', props: { title: 'Números', items: [
        { label: 'Anos de atuação', value: 10 },
        { label: 'Atendimentos', value: 5000 },
        { label: 'Nota média', value: 4.9 },
      ] } },
      { id: 'lst1', type: 'testimonials', props: COMPONENT_META.testimonials.defaultProps },
      { id: 'lsq1', type: 'faq', props: { title: 'Perguntas Frequentes', items: [
        { q: 'Atendem em quais bairros?', a: 'Atendemos a cidade e região — confirme sua área pelo WhatsApp.' },
        { q: 'Quanto tempo leva o atendimento?', a: 'Na maioria dos casos, atendimento no mesmo dia.' },
      ] } },
      { id: 'slb1', type: 'localBusiness', props: { ...COMPONENT_META.localBusiness.defaultProps, businessName: 'Serviços Gerais' } },
      { id: 'lsw1', type: 'whatsapp', props: { ...COMPONENT_META.whatsapp.defaultProps, message: 'Olá! Preciso de um serviço.', source: 'servicos-gerais' } },
      { id: 'lsc1', type: 'contact', props: COMPONENT_META.contact.defaultProps },
      { id: 'lsfo1', type: 'footer', props: COMPONENT_META.footer.defaultProps },
    ],
  },
];
