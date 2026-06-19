# Copilot Instructions — Thiago Lab

## Sobre o Projeto
Este é o repositório principal de Thiago Piola (tpiola), um Laboratório de IA Aplicada.
Stack principal: Next.js 15, TypeScript, Tailwind CSS v4, Supabase, Vercel.

## Linguagem e Comunicação
- Sempre responda em **português do Brasil (pt-BR)**
- Comentários de código devem ser em português quando não houver padrão já estabelecido
- Mensagens de commit devem seguir o padrão Conventional Commits em inglês

## Stack e Convenções de Código

### Frontend
- Framework: Next.js 15 com App Router
- Linguagem: TypeScript (strict mode)
- Estilização: Tailwind CSS v4
- Componentes: funcionais com React hooks
- Sempre usar `const` ao invés de `let` quando possível
- Preferir arrow functions para componentes e handlers

### Backend / Banco de Dados
- Backend as a Service: Supabase (PostgreSQL)
- Autenticação: Supabase Auth
- Sempre usar Row Level Security (RLS) no Supabase
- Queries com Supabase Client (nunca SQL raw sem sanitização)

### Qualidade de Código
- Sempre tipar explicitamente variáveis e retornos de funções
- Usar interfaces TypeScript para objetos de dados
- Evitar `any` — usar tipos específicos ou `unknown`
- Seguir padrão de exportação: `export default` para páginas, `export` nomeado para componentes e utils
- Tratamento de erros obrigatório em chamadas assíncronas

### Testes
- Framework: Jest + Testing Library
- Sempre sugerir testes unitários para funções utilitárias
- Testes de integração para rotas de API

## Padrão de Commits (Conventional Commits)
- `feat:` nova funcionalidade
- `fix:` correção de bug
- `chore:` tarefas de manutenção
- `refactor:` refatoração sem mudança de comportamento
- `docs:` documentação
- `test:` testes
- `style:` formatação/estilo
- `perf:` performance

## Boas Práticas de IA Aplicada
- Sempre considerar privacidade e segurança ao trabalhar com dados de saúde
- Seguir LGPD para tratamento de dados pessoais
- Documentar integrações com APIs de IA (OpenAI, Anthropic, etc.)

## O que Evitar
- Não usar `console.log` em produção — usar logger estruturado
- Não commitar secrets ou variáveis de ambiente
- Não usar `!` (non-null assertion) sem justificativa
- Não ignorar erros de TypeScript com `// @ts-ignore`
