// ═══════════════════════════════════════════════════════════════════════
// INEMA VIP — Complete Catalog of 25 Items (12 Courses + 13 Tools)
// Source: github.com/inematds
// ═══════════════════════════════════════════════════════════════════════

export interface InemaItem {
  slug: string;
  name: string;
  description: string;
  longDescription?: string;
  category: 'curso' | 'ferramenta';
  language: string;
  github: string;
  pages?: string; // GitHub Pages URL
  tags: string[];
  featured?: boolean;
}

export type InemaCategory = 'curso' | 'ferramenta' | 'todos';

export const CATEGORY_LABELS: Record<InemaCategory, string> = {
  todos: 'Todos',
  curso: 'Cursos',
  ferramenta: 'Ferramentas',
};

export const LANG_COLORS: Record<string, string> = {
  Python: 'text-blue-400 bg-blue-500/10',
  TypeScript: 'text-blue-300 bg-blue-400/10',
  JavaScript: 'text-yellow-400 bg-yellow-500/10',
  HTML: 'text-orange-400 bg-orange-500/10',
  Shell: 'text-green-400 bg-green-500/10',
  'N/A': 'text-ios-muted bg-ios-surface-2',
};

export const INEMA_ITEMS: InemaItem[] = [
  // ═══════════════════════════════════════════════════════════════════
  // CURSOS (12)
  // ═══════════════════════════════════════════════════════════════════
  {
    slug: 'fep',
    name: 'FEP',
    description: 'Formação Engenharia de Prompt — 8 módulos completos de prompt engineering com system prompts, few-shot, chain-of-thought e técnicas avançadas.',
    longDescription: `A Formação em Engenharia de Prompt (FEP) é um curso completo de 8 módulos que cobre desde os fundamentos da engenharia de prompt até técnicas avançadas como system prompts, few-shot learning, chain-of-thought reasoning, e otimização de prompts para produção. Cada módulo inclui exercícios práticos, exemplos reais e projetos para consolidar o aprendizado.

**Módulos:**
1. Fundamentos de Prompt Engineering
2. System Prompts e Personas
3. Few-Shot e Multi-Shot Learning
4. Chain-of-Thought Reasoning
5. Prompt Chaining e Composição
6. Otimização para Produção
7. Avaliação e Métricas
8. Projeto Final`,
    category: 'curso',
    language: 'HTML',
    github: 'https://github.com/inematds/FEP',
    pages: 'https://inematds.github.io/FEP',
    tags: ['prompt engineering', 'LLM', 'formação', 'completo'],
    featured: true,
  },
  {
    slug: 'fdf',
    name: 'FDF',
    description: 'Designer do Futuro — Design com IA generativa para criativos, UX designers e artistas digitais.',
    longDescription: `Designer do Futuro (FDF) é um curso que explora a interseção entre design e inteligência artificial generativa. Aprendendo a utilizar ferramentas de IA para potencializar a criatividade, automatizar fluxos de trabalho de design e criar artefatos visuais impressionantes.

**Tópicos abordados:**
- Geração de imagens com IA
- Design UX assistido por IA
- Prototipagem rápida
- Automação de design systems
- Criação de assets com IA generativa`,
    category: 'curso',
    language: 'Shell',
    github: 'https://github.com/inematds/FDF',
    pages: 'https://inematds.github.io/FDF',
    tags: ['design', 'IA generativa', 'UX', 'criatividade'],
    featured: true,
  },
  {
    slug: 'fea-ia',
    name: 'FEA-IA',
    description: 'Formação Engenheiros Agentes IA — Arquitetura de agentes, ferramentas, loops autônomos e sistemas multiagentes.',
    longDescription: `A Formação Engenheiros de Agentes IA (FEA-IA) é um programa intensivo focado em arquitetura e implementação de agentes de inteligência artificial. Aborda desde conceitos fundamentais até sistemas complexos com múltiplos agentes colaborativos.

**Conteúdo:**
- Arquitetura de Agentes IA
- Ferramentas e Function Calling
- Loops Autônomos e Reflexão
- Memória e Contexto
- Sistemas Multiagentes
- Orquestração e Deploy`,
    category: 'curso',
    language: 'HTML',
    github: 'https://github.com/inematds/FEA-IA',
    pages: 'https://inematds.github.io/FEA-IA',
    tags: ['agentes IA', 'multiagentes', 'arquitetura', 'formação'],
    featured: true,
  },
  {
    slug: 'bmad-academy',
    name: 'BMAD-Academy',
    description: 'BMAD Academy — Soluções No-Code AI para negócios. Crie agentes sem programar.',
    longDescription: `BMAD Academy é uma plataforma educacional focada em soluções No-Code de Inteligência Artificial para negócios. Ideal para empreendedores e profissionais que desejam criar agentes de IA sem necessidade de programação.

**O que você vai aprender:**
- Fundamentos de IA sem código
- Criação de assistentes virtuais
- Automação de processos de negócio
- Integração com ferramentas populares
- Deploy e monitoramento de agentes`,
    category: 'curso',
    language: 'JavaScript',
    github: 'https://github.com/inematds/BMAD-Academy',
    pages: 'https://inematds.github.io/BMAD-Academy',
    tags: ['no-code', 'negócios', 'agentes', 'automação'],
    featured: true,
  },
  {
    slug: 'cli-x',
    name: 'CLI-x',
    description: 'Terminal como Interface — CLI agents, ferramentas de terminal agentic e automação via linha de comando.',
    longDescription: `CLI-x é um curso que ensina a dominar o terminal como interface primária para agentes de IA. Aprenda a criar CLI agents poderosos, automatizar fluxos de trabalho e construir ferramentas de terminal agentic.

**Tópicos:**
- CLI Agents com Python/Node.js
- Automação de terminal
- Ferramentas agentic
- Integração com shells
- Pipelines de comando inteligentes`,
    category: 'curso',
    language: 'HTML',
    github: 'https://github.com/inematds/CLI-x',
    pages: 'https://inematds.github.io/CLI-x',
    tags: ['CLI', 'terminal', 'automação', 'agentes'],
    featured: true,
  },
  {
    slug: 'deerflow',
    name: 'deerflow',
    description: 'DeerFlow 2.0 — Agent harness para orquestração de agentes com fluxos de trabalho declarativos.',
    longDescription: `DeerFlow 2.0 é um curso sobre orquestração de agentes utilizando fluxos de trabalho declarativos. Aprenda a construir agent harness para coordenar múltiplos agentes em pipelines complexos.

**Conceitos abordados:**
- Fluxos de trabalho declarativos
- Orquestração de agentes
- Agent Harness
- Pipeline composition
- Error handling e recovery`,
    category: 'curso',
    language: 'HTML',
    github: 'https://github.com/inematds/deerflow',
    pages: 'https://inematds.github.io/deerflow',
    tags: ['orquestração', 'fluxos', 'agentes', 'pipeline'],
    featured: false,
  },
  {
    slug: '6pilarccb',
    name: '6pilarccb',
    description: '6 Pilares do Claude Code — Metodologia completa para dominar Claude Code em 6 pilares fundamentais.',
    longDescription: `O curso 6 Pilares do Claude Code apresenta uma metodologia estruturada para dominar o Claude Code, dividida em seis pilares fundamentais que cobrem desde a configuração inicial até técnicas avançadas de uso.

**Os 6 Pilares:**
1. Configuração e Setup
2. Skills e Ferramentas
3. Prompting Avançado
4. Debug e Troubleshooting
5. Deploy e Produção
6. Workflows e Automação`,
    category: 'curso',
    language: 'HTML',
    github: 'https://github.com/inematds/6pilarccb',
    pages: 'https://inematds.github.io/6pilarccb',
    tags: ['Claude Code', 'metodologia', 'completo', 'pilares'],
    featured: true,
  },
  {
    slug: 'multiagentes',
    name: 'multiagentes',
    description: 'Equipes de Agentes — Arquitetura e implementação de sistemas com múltiplos agentes colaborativos.',
    longDescription: `Multiagentes é um curso avançado sobre arquitetura e implementação de sistemas com múltiplos agentes colaborativos. Aprenda a projetar equipes de agentes que trabalham juntos para resolver problemas complexos.

**Tópicos avançados:**
- Comunicação entre agentes
- Coordenação e consenso
- Delegação de tarefas
- Memória compartilhada
- Resolução de conflitos`,
    category: 'curso',
    language: 'HTML',
    github: 'https://github.com/inematds/multiagentes',
    pages: 'https://inematds.github.io/multiagentes',
    tags: ['multiagentes', 'colaboração', 'arquitetura', 'avançado'],
    featured: false,
  },
  {
    slug: 'ccguide2026',
    name: 'ccguide2026',
    description: 'Claude Code 2026 — Guia completo de Claude Code: skills, ferramentas, configuração e melhores práticas.',
    longDescription: `Claude Code 2026 (ccguide2026) é o guia definitivo para o Claude Code, cobrindo todas as funcionalidades da plataforma: skills, ferramentas, configuração avançada, integrações e melhores práticas para desenvolvimento com IA.

**Guia completo:**
- Skills e Custom Actions
- Ferramentas e Extensões
- Configuração Avançada
- Integração com IDEs
- CI/CD com Claude Code
- Performance e Otimização`,
    category: 'curso',
    language: 'HTML',
    github: 'https://github.com/inematds/ccguide2026',
    pages: 'https://inematds.github.io/ccguide2026',
    tags: ['Claude Code', 'guia', 'skills', 'ferramentas'],
    featured: true,
  },
  {
    slug: 'aiosagi',
    name: 'aiosagi',
    description: 'AIOS — AI Agent OS: sistema operacional para agentes de IA com gerenciamento de recursos.',
    longDescription: `AIOS (AI Agent OS) é um curso sobre sistemas operacionais para agentes de IA. Aborda conceitos de gerenciamento de recursos, escalonamento, memória e execução concorrente para agentes autônomos.

**Conceitos:**
- Gerenciamento de recursos
- Escalonamento de agentes
- Memória e persistência
- Execução concorrente
- Sistema de arquivos para agentes`,
    category: 'curso',
    language: 'HTML',
    github: 'https://github.com/inematds/aiosagi',
    pages: 'https://inematds.github.io/aiosagi',
    tags: ['sistema operacional', 'agentes', 'recursos', 'AIOS'],
    featured: false,
  },
  {
    slug: 'claudecode-manual',
    name: 'claudecode-manual',
    description: 'Manual completo do Claude Code — referência técnica, skills, debug e deploy.',
    longDescription: `claudecode-manual é uma referência técnica completa do Claude Code, servindo como documentação oficial não-oficial para desenvolvedores que desejam dominar a plataforma.

**Referência:**
- API Reference
- Skills Development
- Debugging Guide
- Deployment Guide
- Best Practices
- Troubleshooting`,
    category: 'curso',
    language: 'HTML',
    github: 'https://github.com/inematds/claudecode-manual',
    pages: 'https://inematds.github.io/claudecode-manual',
    tags: ['Claude Code', 'manual', 'referência', 'documentação'],
    featured: false,
  },
  {
    slug: 'remotion-skills',
    name: 'remotion-skills',
    description: 'Remotion Skills — Criação de vídeos programáticos com React/Remotion + agentes Claude Code.',
    longDescription: `Remotion Skills é um curso sobre criação de vídeos programáticos utilizando React e Remotion, integrado com agentes Claude Code para automação de produção de conteúdo em vídeo.

**Aprendizado:**
- Fundamentos do Remotion
- Componentes React para vídeo
- Animações e transições
- Renderização programática
- Automação com Claude Code
- Pipeline de produção`,
    category: 'curso',
    language: 'TypeScript',
    github: 'https://github.com/inematds/remotion-skills',
    pages: 'https://inematds.github.io/remotion-skills',
    tags: ['Remotion', 'vídeo', 'React', 'automação'],
    featured: false,
  },

  // ═══════════════════════════════════════════════════════════════════
  // FERRAMENTAS (13)
  // ═══════════════════════════════════════════════════════════════════
  {
    slug: 'intelecto',
    name: 'intelecto',
    description: 'Telegram AI Agent em Python — assistente inteligente para Telegram com ferramentas e memória.',
    longDescription: `Intelecto é um assistente inteligente para Telegram construído em Python, equipado com ferramentas, memória persistente e capacidade de executar tarefas complexas diretamente pelo chat.

**Funcionalidades:**
- Chat inteligente com contexto
- Memória persistente (SQLite/Redis)
- Ferramentas customizáveis
- Integração com APIs externas
- Comandos administrativos
- Logs e analytics`,
    category: 'ferramenta',
    language: 'Python',
    github: 'https://github.com/inematds/intelecto',
    tags: ['Telegram', 'bot', 'Python', 'assistente'],
    featured: true,
  },
  {
    slug: 'nanobot',
    name: 'nanobot',
    description: 'Framework modular de agentes (Python/Docker) — construa agentes customizados com plugins.',
    longDescription: `Nanobot é um framework modular em Python/Docker para construção de agentes customizados. Sua arquitetura baseada em plugins permite criar agentes especializados com facilidade.

**Características:**
- Arquitetura modular baseada em plugins
- Containerização com Docker
- Suporte a múltiplos LLMs
- Sistema de memória pluggable
- CLI para gerenciamento
- API REST integrada`,
    category: 'ferramenta',
    language: 'Python',
    github: 'https://github.com/inematds/nanobot',
    tags: ['framework', 'modular', 'Python', 'Docker', 'plugins'],
    featured: true,
  },
  {
    slug: 'nm82',
    name: 'nm82',
    description: 'Sistema de Padrinhos e Afiliados INEMA.VIP — Next.js/Supabase com gestão de comissões.',
    longDescription: `nm82 é um sistema completo de gestão de padrinhos e afiliados para o INEMA.VIP, construído com Next.js e Supabase. Gerencia cadastro, comissões, rankings e pagamentos.

**Módulos:**
- Dashboard de afiliados
- Gestão de comissões
- Ranking de desempenho
- Integração com pagamentos
- Relatórios e analytics
- Níveis e bonuses`,
    category: 'ferramenta',
    language: 'TypeScript',
    github: 'https://github.com/inematds/nm82',
    tags: ['afiliados', 'Next.js', 'Supabase', 'comissões'],
    featured: false,
  },
  {
    slug: 'whatsapp-agentkit',
    name: 'whatsapp-agentkit',
    description: 'WhatsApp Bot (Node.js/TypeScript) — agente inteligente para WhatsApp Business API.',
    longDescription: `WhatsApp AgentKit é um agente inteligente para WhatsApp Business API construído em Node.js/TypeScript. Automatiza atendimento, vendas e suporte diretamente pelo WhatsApp.

**Recursos:**
- Atendimento automático
- Integração com CRM
- Envio de mídia e documentos
- Filas de atendimento
- Respostas inteligentes
- Analytics de conversas`,
    category: 'ferramenta',
    language: 'TypeScript',
    github: 'https://github.com/inematds/whatsapp-agentkit',
    tags: ['WhatsApp', 'bot', 'Node.js', 'TypeScript', 'Business API'],
    featured: true,
  },
  {
    slug: 'apipxinter',
    name: 'APIPXINTER',
    description: 'API Pix Banco Inter — integração financeira com Pix via Banco Inter (Node.js).',
    longDescription: `APIPXINTER é uma biblioteca para integração financeira com o Pix do Banco Inter em Node.js. Facilita a criação de cobranças, consultas e gestão de pagamentos via API oficial.

**Funcionalidades:**
- Criação de cobranças Pix
- Consulta de status
- Gestão de webhooks
- Conciliação bancária
- Tratamento de erros
- Logging e monitoramento`,
    category: 'ferramenta',
    language: 'JavaScript',
    github: 'https://github.com/inematds/APIPXINTER',
    tags: ['Pix', 'Banco Inter', 'API', 'financeiro', 'Node.js'],
    featured: false,
  },
  {
    slug: 'yt-pub-livesx',
    name: 'yt-pub-livesx',
    description: 'YouTube Live Management — gerencie lives e publicações no YouTube automaticamente (Python).',
    longDescription: `yt-pub-livesx é uma ferramenta Python para gerenciamento automatizado de lives e publicações no YouTube. Agenda, publica e monitora conteúdo em vídeo.

**Automações:**
- Agendamento de lives
- Publicação automática
- Gestão de playlists
- Monitoramento de métricas
- Comentários e moderação
- Relatórios de desempenho`,
    category: 'ferramenta',
    language: 'Python',
    github: 'https://github.com/inematds/yt-pub-livesx',
    tags: ['YouTube', 'lives', 'automação', 'Python'],
    featured: false,
  },
  {
    slug: 'inemavox',
    name: 'inemavox',
    description: 'Processamento de áudio/vídeo com IA — transcrição, síntese de voz e edição automatizada (Python).',
    longDescription: `InemaVox é uma plataforma de processamento de áudio e vídeo com IA em Python. Realiza transcrição, síntese de voz, edição automatizada e geração de conteúdo multimídia.

**Capacidades:**
- Transcrição de áudio (ASR)
- Síntese de voz (TTS)
- Edição automatizada
- Separação de fontes
- Geração de legendas
- Conversão formato`,
    category: 'ferramenta',
    language: 'Python',
    github: 'https://github.com/inematds/inemavox',
    tags: ['áudio', 'vídeo', 'transcrição', 'TTS', 'Python'],
    featured: false,
  },
  {
    slug: 'ai-strategy-factory',
    name: 'ai-strategy-factory',
    description: 'Fábrica de Estratégias de IA — gera planos estratégicos personalizados de adoção de IA.',
    longDescription: `AI Strategy Factory é uma ferramenta que gera planos estratégicos personalizados para adoção de inteligência artificial em empresas. Analisa o negócio e produz recomendações acionáveis.

**Entregas:**
- Diagnóstico de maturidade IA
- Roadmap de implementação
- Seleção de ferramentas
- Análise de ROI
- Gestão de mudanças
- KPIs e métricas`,
    category: 'ferramenta',
    language: 'Python',
    github: 'https://github.com/inematds/ai-strategy-factory',
    tags: ['estratégia', 'IA', 'consultoria', 'Python', 'planejamento'],
    featured: false,
  },
  {
    slug: 'docker-moltbot',
    name: 'docker-moltbot',
    description: 'Container Docker para agente MoltBot — deploy rápido de agentes em contêiner.',
    longDescription: `Docker MoltBot é uma imagem Docker pronta para deploy do agente MoltBot. Facilita a implantação de agentes em ambientes conteinerizados com configuração simplificada.

**Features:**
- Dockerfile otimizado
- Docker Compose
- Configuração via env vars
- Health checks
- Logs estruturados
- Escalabilidade`,
    category: 'ferramenta',
    language: 'Shell',
    github: 'https://github.com/inematds/docker-moltbot',
    tags: ['Docker', 'container', 'MoltBot', 'deploy', 'Shell'],
    featured: false,
  },
  {
    slug: 'docker-clawdbot',
    name: 'docker-clawdbot',
    description: 'Container Docker para agente ClawdBot — ambiente isolado para agentes de código.',
    longDescription: `Docker ClawdBot fornece um ambiente isolado e pronto para execução do agente ClawdBot. Ideal para desenvolvimento e produção de agentes de código.

**Features:**
- Imagem Docker leve
- Ambiente isolado
- Configuração simplificada
- Suporte a volumes
- Rede configurável
- CI/CD ready`,
    category: 'ferramenta',
    language: 'Shell',
    github: 'https://github.com/inematds/docker-clawdbot',
    tags: ['Docker', 'container', 'ClawdBot', 'ambiente', 'Shell'],
    featured: false,
  },
  {
    slug: 'lk-agente-v3',
    name: 'lk_agente_v3',
    description: 'Agente de Voz com LiveKit — assistente de voz inteligente em Português com LiveKit.',
    longDescription: `lk_agente_v3 é um assistente de voz inteligente em Português construído com LiveKit. Suporta conversação natural, reconhecimento de fala e síntese de voz em tempo real.

**Recursos:**
- Conversação em tempo real
- Reconhecimento de fala (STT)
- Síntese de voz (TTS)
- Memória de conversação
- Ferramentas por voz
- Integração LiveKit`,
    category: 'ferramenta',
    language: 'Python',
    github: 'https://github.com/inematds/lk_agente_v3',
    tags: ['voz', 'LiveKit', 'assistente', 'STT', 'TTS'],
    featured: false,
  },
  {
    slug: 'openpcbot',
    name: 'openpcbot',
    description: 'PC Bot — automação e controle remoto de computador via bot.',
    longDescription: `PC Bot (openpcbot) é uma ferramenta de automação e controle remoto de computador via bot. Permite executar comandos, gerenciar arquivos e monitorar o sistema remotamente.

**Funcionalidades:**
- Controle remoto via chat
- Execução de comandos
- Gerenciamento de arquivos
- Monitoramento do sistema
- Automação de tarefas
- Notificações push`,
    category: 'ferramenta',
    language: 'TypeScript',
    github: 'https://github.com/inematds/openpcbot',
    tags: ['automação', 'controle remoto', 'bot', 'TypeScript', 'PC'],
    featured: false,
  },
  {
    slug: 'gipm',
    name: 'GIPM',
    description: 'GIPM — Gestão Integrada de Projetos e Marketing com dashboards e automação.',
    longDescription: `GIPM (Gestão Integrada de Projetos e Marketing) é uma plataforma que unifica gestão de projetos e marketing em um só lugar, com dashboards interativos e automações inteligentes.

**Módulos:**
- Gestão de projetos
- Marketing digital
- Dashboards integrados
- Automação de campanhas
- Relatórios analíticos
- Integração com redes sociais`,
    category: 'ferramenta',
    language: 'HTML',
    github: 'https://github.com/inematds/GIPM',
    pages: 'https://inematds.github.io/GIPM',
    tags: ['gestão', 'projetos', 'marketing', 'dashboard'],
    featured: false,
  },
];

export const INEMA_STATS = {
  total: INEMA_ITEMS.length,
  cursos: INEMA_ITEMS.filter(i => i.category === 'curso').length,
  ferramentas: INEMA_ITEMS.filter(i => i.category === 'ferramenta').length,
  featured: INEMA_ITEMS.filter(i => i.featured).length,
};
