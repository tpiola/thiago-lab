// Biblioteca de Prompts — Dados curados
// Categorias: Saúde, Farmácia, Código, Marketing, Automação, Conteúdo

export interface PromptEntry {
  id: string;
  titulo: string;
  descricao: string;
  categoria: string;
  modelo: string;
  prompt: string;
  tags: string[];
  dica: string;
}

export const promptsData: PromptEntry[] = [
  // ═══════════════ SAÚDE ═══════════════
  {
    id: "saude-artigo-educativo",
    titulo: "Artigo Educativo em Saúde",
    descricao: "Gera artigo educativo para público leigo sobre condição de saúde, com linguagem acessível e fontes oficiais.",
    categoria: "Saúde",
    modelo: "DeepSeek / GPT-4 / Claude",
    prompt: `Escreva um artigo educativo sobre [CONDIÇÃO DE SAÚDE] para o público leigo brasileiro.

Estrutura:
1. Título acolhedor (não alarmista)
2. O que é — explicação simples em até 3 frases
3. Causas principais — lista com bullets
4. Sinais de alerta — quando procurar ajuda
5. Prevenção e cuidados diários
6. Referência: "Consulte sempre um profissional de saúde"

Tom: acolhedor, educativo, sem alarmismo.
Extensão: 800-1200 palavras.
Inclua 1 call-to-action para newsletter ao final.`,
    tags: ["artigo", "educação", "paciente", "leigo"],
    dica: "Substitua [CONDIÇÃO DE SAÚDE] pela condição específica. Use fontes como Ministério da Saúde e OMS para verificar dados.",
  },
  {
    id: "saude-caso-clinico",
    titulo: "Caso Clínico para EAD",
    descricao: "Cria caso clínico educativo com cenário, paciente, diálogo e feedback para plataforma de ensino em saúde.",
    categoria: "Saúde",
    modelo: "DeepSeek / GPT-4 / Claude",
    prompt: `Crie um caso clínico educativo sobre [TEMA] para uma plataforma EAD de saúde.

Formato:
CENÁRIO: [contexto do atendimento — farmácia, consultório, hospital]
PACIENTE: [nome], [idade], [queixa principal em 1a pessoa]
PROFISSIONAL: [resposta educativa e ética em 1a pessoa]
FEEDBACK: [análise do que foi correto e por quê]
ALERTA LEGAL: [limite da atuação profissional]
REFERÊNCIA: [fonte oficial, formato ABNT]

O caso deve:
- Ser realista (situação comum no dia a dia)
- Demonstrar conhecimento técnico
- Respeitar limites éticos da profissão
- Incluir o encaminhamento correto quando necessário`,
    tags: ["ead", "caso-clínico", "ensino", "simulação"],
    dica: "Use situações reais do dia a dia. O aluno aprende mais com casos que reconhece da prática.",
  },

  // ═══════════════ FARMÁCIA ═══════════════
  {
    id: "farmacia-orientacao-paciente",
    titulo: "Orientação Farmacêutica ao Paciente",
    descricao: "Gera script de orientação para atendente de farmácia sobre medicamento específico.",
    categoria: "Farmácia",
    modelo: "DeepSeek / GPT-4 / Claude",
    prompt: `Crie um script de orientação para atendente de farmácia sobre [MEDICAMENTO].

Inclua:
1. Nome do medicamento (princípio ativo + nomes comerciais comuns)
2. Para que serve (indicações aprovadas pela ANVISA)
3. Como tomar (posologia padrão — SEMPRE confirme na bula)
4. Efeitos colaterais mais comuns (leigos)
5. Interações importantes (alimentos, bebidas, outros medicamentos)
6. Quando NÃO usar (contraindicações principais)
7. Frase de segurança: "Consulte o(a) farmacêutico(a) para orientação personalizada."

Tom: claro, acessível, sem termos técnicos excessivos.
NÃO prescrever — apenas informar.`,
    tags: ["farmácia", "atendimento", "medicamento", "orientação"],
    dica: "Use o Bulário Eletrônico da ANVISA (consultas.anvisa.gov.br) como fonte primária.",
  },
  {
    id: "farmacia-quiz",
    titulo: "Quiz de Fixação para Farmácia",
    descricao: "Gera quiz de múltipla escolha para fixação de conteúdo em curso de farmácia.",
    categoria: "Farmácia",
    modelo: "DeepSeek / GPT-4 / Claude",
    prompt: `Crie 5 questões de múltipla escolha sobre [TEMA FARMACÊUTICO] para plataforma EAD.

Formato de cada questão:
Pergunta: [texto claro e objetivo]
a) [alternativa]
b) [alternativa]
c) [alternativa]
d) [alternativa]
Resposta correta: [letra]
Explicação: [por que está correta, com referência]

Nível: [básico | intermediário | avançado]
Foco: aplicação prática no balcão da farmácia.
Evite pegadinhas — o objetivo é fixar conhecimento, não confundir.`,
    tags: ["quiz", "ead", "farmácia", "avaliação"],
    dica: "Use casos reais de balcão como base para as questões. Torna o aprendizado mais relevante.",
  },

  // ═══════════════ CÓDIGO ═══════════════
  {
    id: "codigo-nextjs-componente",
    titulo: "Componente Next.js com Tailwind",
    descricao: "Gera componente React/Next.js com Tailwind CSS, TypeScript e animações Framer Motion.",
    categoria: "Código",
    modelo: "Claude / DeepSeek / GPT-4",
    prompt: `Crie um componente React para Next.js 15+ com as seguintes especificações:

- Nome do componente: [NOME]
- Funcionalidade: [DESCRIÇÃO]
- TypeScript estrito (sem 'any')
- Tailwind CSS v4 (classes utilitárias)
- Framer Motion para animações de entrada (fadeUp + stagger)
- Responsivo (mobile-first, breakpoints sm/md/lg)
- Dark mode com variáveis CSS (--foreground, --muted, --surface)
- Props tipadas com interface
- Acessível (aria-labels, roles, keyboard navigation)

Exporte como default function.
Inclua comentários PT-BR explicando cada seção.`,
    tags: ["react", "nextjs", "tailwind", "typescript", "componente"],
    dica: "Sempre peça TypeScript estrito. Evita bugs que só aparecem em produção.",
  },
  {
    id: "codigo-api-route",
    titulo: "API Route Next.js",
    descricao: "Gera handler de API no App Router do Next.js com validação e tratamento de erros.",
    categoria: "Código",
    modelo: "Claude / DeepSeek / GPT-4",
    prompt: `Crie uma API route para Next.js 15 (App Router) em src/app/api/[ROTA]/route.ts.

Especificações:
- Método: [GET | POST | PUT | DELETE]
- Entrada esperada: [DESCRIÇÃO DO BODY OU QUERY PARAMS]
- Validação com Zod dos campos de entrada
- Tratamento de erros com try/catch e Status Codes apropriados
- Rate limiting básico (headers)
- Resposta JSON padronizada: { data, error, timestamp }
- TypeScript estrito

Não use 'any'. Todas as funções devem ter tipos explícitos.
Adicione JSDoc no topo explicando o propósito da rota.`,
    tags: ["api", "nextjs", "typescript", "backend", "zod"],
    dica: "Sempre valide a entrada com Zod ANTES de processar. Segurança em primeiro lugar.",
  },

  // ═══════════════ MARKETING ═══════════════
  {
    id: "marketing-landing-page",
    titulo: "Copy para Landing Page",
    descricao: "Gera estrutura de copy para landing page de produto/serviço de saúde.",
    categoria: "Marketing",
    modelo: "DeepSeek / GPT-4 / Claude",
    prompt: `Crie a estrutura de copy para uma landing page de [PRODUTO/SERVIÇO DE SAÚDE].

Seções:
1. Hero — Headline (max 8 palavras) + Subheadline (max 20 palavras) + CTA principal
2. Problema — A dor que o público sente (2-3 frases empáticas)
3. Solução — Como o produto resolve (3 bullets com benefícios)
4. Prova — Dados, registros, certificações (APENAS o que for verificável)
5. Objeções — 3 objeções comuns e respostas
6. CTA Final — Urgência sem desespero

Tom: profissional, acolhedor, zero hype.
Público: [DESCREVA O PÚBLICO-ALVO]
Regulamentação: [CRF, CRN, CREFITO, CRP - se aplicável]

IMPORTANTE: NÃO invente números, depoimentos ou métricas.`,
    tags: ["copy", "landing-page", "conversão", "saúde"],
    dica: "A copy de saúde exige equilíbrio: acolher sem alarmar, informar sem prescrever, vender sem enganar.",
  },
  {
    id: "marketing-email-nutricao",
    titulo: "Email de Nutrição para Lista",
    descricao: "Gera email marketing educacional para lista de contatos na área de saúde.",
    categoria: "Marketing",
    modelo: "DeepSeek / GPT-4 / Claude",
    prompt: `Escreva um email marketing educacional sobre [TEMA DE SAÚDE] para uma lista de [PÚBLICO].

Estrutura:
1. Assunto — curto, curioso, sem clickbait (max 50 caracteres)
2. Pré-header — complemento do assunto (max 80 caracteres)
3. Corpo:
   - Saudação pessoal
   - Contexto do tema (1 parágrafo)
   - Dica prática ou informação valiosa (2-3 parágrafos)
   - CTA claro (1 link ou botão)
4. Rodapé — unsubscribe + LGPD

Tom: educativo, não comercial.
Extensão: 400-600 palavras.
Inclua referência a fonte oficial quando citar dados.`,
    tags: ["email", "newsletter", "nutrição", "lead-nurturing"],
    dica: "Email educacional converte mais que email comercial. Ensine primeiro, venda depois.",
  },

  // ═══════════════ AUTOMAÇÃO ═══════════════
  {
    id: "automacao-n8n-workflow",
    titulo: "Workflow n8n para Automação",
    descricao: "Descreve estrutura de workflow no n8n para automação de processos.",
    categoria: "Automação",
    modelo: "Claude / DeepSeek",
    prompt: `Descreva um workflow para n8n que [DESCREVA O PROCESSO A AUTOMATIZAR].

Estrutura da resposta:
1. Nome do workflow
2. Trigger (Webhook, Schedule, Email, etc.)
3. Nós em sequência:
   - [Nó 1]: [tipo] — [o que faz]
   - [Nó 2]: [tipo] — [o que faz]
   - ...
4. Tratamento de erros (Error Trigger + notificação)
5. Output final

Tipos de nós disponíveis: HTTP Request, IF, Switch, Code (JS/Python), Set, Filter, Wait, Webhook Response, Email (Gmail/IMAP), Google Sheets, Supabase, Telegram, WhatsApp, Slack.

Inclua dicas de performance (batch size, timeout, retry policy).`,
    tags: ["n8n", "workflow", "automação", "low-code"],
    dica: "Comece com o trigger e desenhe o fluxo no papel antes de montar no n8n. Debug cada nó isoladamente.",
  },

  // ═══════════════ CONTEÚDO ═══════════════
  {
    id: "conteudo-post-linkedin",
    titulo: "Post para LinkedIn — Saúde",
    descricao: "Gera post profissional para LinkedIn sobre tema de saúde, com tom educativo e autoridade.",
    categoria: "Conteúdo",
    modelo: "DeepSeek / GPT-4",
    prompt: `Crie um post para LinkedIn sobre [TEMA DE SAÚDE] no estilo:

Estrutura:
1. Hook — primeira linha que prende (pergunta, dado surpreendente, ou afirmação ousada)
2. Desenvolvimento — 3-4 parágrafos curtos, com:
   - Contexto do tema
   - Dado ou referência (com fonte)
   - Aplicação prática
3. Call-to-action — pergunta engajadora ou convite para comentar
4. Hashtags — 3 a 5 relevantes

Tom: profissional, acessível, autoridade sem arrogância.
Extensão: 800-1200 caracteres.
Use emojis com moderação (máximo 2-3).
Quebras de linha a cada 2-3 frases para legibilidade mobile.`,
    tags: ["linkedin", "post", "autoridade", "conteúdo"],
    dica: "Posts que fazem pergunta no final têm 3x mais comentários. Use isso a seu favor.",
  },
  {
    id: "conteudo-ebook-capitulo",
    titulo: "Capítulo de E-book em Saúde",
    descricao: "Gera estrutura de capítulo para e-book educativo na área de saúde.",
    categoria: "Conteúdo",
    modelo: "DeepSeek / Claude",
    prompt: `Estruture um capítulo de e-book sobre [TEMA DE SAÚDE] para [PÚBLICO-ALVO].

Estrutura do capítulo:
1. Título do capítulo (envolvente, não técnico)
2. Objetivos de aprendizado (3 bullets: "Ao final deste capítulo, você saberá...")
3. Introdução (200 palavras — contextualize o tema)
4. Corpo principal (dividido em 3-4 subtópicos):
   - Subtítulo 1: [conceito]
   - Subtítulo 2: [aplicação]
   - Subtítulo 3: [cuidados]
5. Resumo visual (tabela ou checklist)
6. Referências (2-3 fontes oficiais)

Tom: didático, acolhedor, baseado em evidências.
Extensão total: 1500-2000 palavras.`,
    tags: ["ebook", "capítulo", "conteúdo", "lead-magnet"],
    dica: "E-books educativos são excelentes iscas digitais. Entregue valor real no conteúdo gratuito.",
  },
];
