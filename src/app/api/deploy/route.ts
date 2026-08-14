/* ==========================================================================
   /api/deploy — Deploy 1-Clique via Vercel API
   Cria projeto + faz deploy em produção
   Intelligence OS — thiagolab.com
   ========================================================================== */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { renderBlockHtml } from '@/lib/generator/blockHtml';

const VERCEL_TOKEN = process.env.NEXT_PUBLIC_VERCEL_TOKEN || process.env.VERCEL_TOKEN || '';
const VERCEL_TEAM_ID = process.env.VERCEL_TEAM_ID || '';
const VERCEL_API = 'https://api.vercel.com';

interface BlockData {
  id: string;
  type: string;
  props: Record<string, unknown>;
}

interface DeployRequest {
  name: string;
  blocks: BlockData[];
  projectId?: string;
}

export async function POST(request: NextRequest) {
  try {
    // 1. Validar body
    const body: DeployRequest = await request.json();
    const { name, blocks, projectId } = body;

    if (!name || !blocks) {
      return NextResponse.json(
        { error: 'Campos "name" e "blocks" são obrigatórios.' },
        { status: 400 },
      );
    }

    if (!VERCEL_TOKEN || VERCEL_TOKEN.startsWith('vcp_') === false) {
      return NextResponse.json(
        { error: 'Vercel token inválido ou não configurado.' },
        { status: 500 },
      );
    }

    const headers: Record<string, string> = {
      Authorization: `Bearer ${VERCEL_TOKEN}`,
      'Content-Type': 'application/json',
    };

    const projectSlug = name
      .toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9-]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
      .slice(0, 40) || 'meu-site';

    let vercelProjectId = projectId || '';

    // 2. Criar ou reutilizar projeto Vercel
    if (!vercelProjectId) {
      console.log(`[Deploy] Criando projeto Vercel: ${projectSlug}`);

      const createRes = await fetch(
        `${VERCEL_API}/v9/projects${VERCEL_TEAM_ID ? `?teamId=${VERCEL_TEAM_ID}` : ''}`,
        {
          method: 'POST',
          headers,
          body: JSON.stringify({
            name: projectSlug,
            framework: 'nextjs',
            buildCommand: 'npm run build',
            outputDirectory: '.next',
            installCommand: 'npm install',
          }),
        },
      );

      if (!createRes.ok) {
        const errText = await createRes.text();
        console.error('[Vercel Create Project Error]', errText);

        // Se der conflito (projeto já existe), tenta listar e achar
        if (createRes.status === 409) {
          const listRes = await fetch(
            `${VERCEL_API}/v9/projects?search=${projectSlug}${VERCEL_TEAM_ID ? `&teamId=${VERCEL_TEAM_ID}` : ''}`,
            { headers },
          );
          if (listRes.ok) {
            const listData = await listRes.json();
            const existing = listData.projects?.find(
              (p: { name: string }) => p.name === projectSlug,
            );
            if (existing) {
              vercelProjectId = existing.id;
              console.log(`[Deploy] Projeto já existe: ${vercelProjectId}`);
            }
          }
        }

        if (!vercelProjectId) {
          return NextResponse.json(
            { error: `Falha ao criar projeto na Vercel: ${errText.slice(0, 200)}` },
            { status: 502 },
          );
        }
      } else {
        const projectData = await createRes.json();
        vercelProjectId = projectData.id || projectData.name;
        console.log(`[Deploy] Projeto criado: ${vercelProjectId}`);
      }
    }

    // 3. Gerar arquivos do projeto para o deploy via Vercel
    // Vercel aceita deploy direto com source files via API
    // Mas a abordagem mais robusta é usar o Vercel CLI ou git.
    // Para deploy 1-clique via API REST, usamos a abordagem de "deploy with existing project"
    // que usa o repositório git conectado OU faz upload de arquivos.

    // Vamos tentar deploy direto com files via Vercel API v13
    const generatedFiles = generateProjectFiles(name, blocks);

    console.log(`[Deploy] Iniciando deploy para projeto ${vercelProjectId}...`);

    const deployRes = await fetch(
      `${VERCEL_API}/v13/deployments${VERCEL_TEAM_ID ? `?teamId=${VERCEL_TEAM_ID}` : ''}`,
      {
        method: 'POST',
        headers,
        body: JSON.stringify({
          name: projectSlug,
          project: vercelProjectId,
          target: 'production',
          files: generatedFiles,
          projectSettings: {
            framework: 'nextjs',
            buildCommand: 'npm run build',
            outputDirectory: '.next',
            installCommand: 'npm install',
          },
        }),
      },
    );

    if (!deployRes.ok) {
      const deployErr = await deployRes.text();
      console.error('[Vercel Deploy Error]', deployErr);

      // Fallback: tentar deploy sem files (assume repositório conectado)
      const fallbackRes = await fetch(
        `${VERCEL_API}/v13/deployments${VERCEL_TEAM_ID ? `?teamId=${VERCEL_TEAM_ID}` : ''}`,
        {
          method: 'POST',
          headers,
          body: JSON.stringify({
            name: projectSlug,
            project: vercelProjectId,
            target: 'production',
            projectSettings: {
              framework: 'nextjs',
              buildCommand: 'npm run build',
              outputDirectory: '.next',
              installCommand: 'npm install',
            },
          }),
        },
      );

      if (!fallbackRes.ok) {
        const fallbackErr = await fallbackRes.text();
        return NextResponse.json(
          { error: `Falha no deploy: ${fallbackErr.slice(0, 300)}` },
          { status: 502 },
        );
      }

      const fallbackData = await fallbackRes.json();
      return NextResponse.json({
        deploy: {
          id: fallbackData.id,
          url: fallbackData.url,
          state: fallbackData.readyState || fallbackData.state || 'BUILDING',
          projectId: vercelProjectId,
        },
      });
    }

    const deployData = await deployRes.json();

    return NextResponse.json({
      deploy: {
        id: deployData.id,
        url: deployData.url,
        state: deployData.readyState || deployData.state || 'BUILDING',
        projectId: vercelProjectId,
      },
    });
  } catch (err) {
    console.error('[POST /api/deploy]', err);
    return NextResponse.json(
      { error: 'Erro interno do servidor: ' + (err instanceof Error ? err.message : String(err)) },
      { status: 500 },
    );
  }
}

/* ─── Gerar arquivos do projeto para upload Vercel ────────────────────── */

function generateProjectFiles(
  name: string,
  blocks: BlockData[],
): Array<{ file: string; data: string; encoding: string }> {
  const pageContent = generatePageFromBlocks(blocks);
  const sanitizedName = name.replace(/[<>"']/g, '');

  const files: Array<{ file: string; data: string; encoding: string }> = [
    {
      file: 'package.json',
      data: JSON.stringify({
        name: sanitizedName.toLowerCase().replace(/[^a-z0-9-]/g, '-'),
        version: '1.0.0',
        private: true,
        scripts: {
          dev: 'next dev',
          build: 'next build',
          start: 'next start',
        },
        dependencies: {
          next: '^15.2.0',
          react: '^19.0.0',
          'react-dom': '^19.0.0',
        },
        devDependencies: {
          '@tailwindcss/postcss': '^4',
          tailwindcss: '^4',
          '@types/node': '^22',
          '@types/react': '^19',
          '@types/react-dom': '^19',
          typescript: '^5',
        },
      }, null, 2),
      encoding: 'utf-8',
    },
    {
      file: 'next.config.ts',
      data: `import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
`,
      encoding: 'utf-8',
    },
    {
      file: 'tsconfig.json',
      data: JSON.stringify({
        compilerOptions: {
          target: 'ES2017',
          lib: ['dom', 'dom.iterable', 'esnext'],
          allowJs: true,
          skipLibCheck: true,
          strict: true,
          noEmit: true,
          esModuleInterop: true,
          module: 'esnext',
          moduleResolution: 'bundler',
          resolveJsonModule: true,
          isolatedModules: true,
          jsx: 'preserve',
          incremental: true,
          plugins: [{ name: 'next' }],
          paths: { '@/*': ['./src/*'] },
        },
        include: ['next-env.d.ts', '**/*.ts', '**/*.tsx', '.next/types/**/*.ts'],
        exclude: ['node_modules'],
      }, null, 2),
      encoding: 'utf-8',
    },
    {
      file: 'postcss.config.mjs',
      data: `const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};
export default config;
`,
      encoding: 'utf-8',
    },
    {
      file: 'src/app/globals.css',
      data: `@import "tailwindcss";

:root {
  --base: #06080C;
  --surface: #0C0F15;
  --surface-2: #12161E;
  --border: #1E2433;
  --text: #E8EDF2;
  --text-secondary: #B0B8C4;
  --muted: #7A8694;
  --accent: #3DF5C5;
}

* { margin: 0; padding: 0; box-sizing: border-box; }

body {
  background-color: var(--base);
  color: var(--text);
  font-family: system-ui, -apple-system, sans-serif;
  -webkit-font-smoothing: antialiased;
  overflow-x: hidden;
}

::selection {
  background-color: rgba(61, 245, 197, 0.25);
  color: var(--text);
}

a { transition: all 0.2s; text-decoration: none; }
img { max-width: 100%; height: auto; }
`,
      encoding: 'utf-8',
    },
    {
      file: 'src/app/layout.tsx',
      data: `import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "${sanitizedName}",
  description: "Site criado com Thiago Lab Builder",
  openGraph: {
    title: "${sanitizedName}",
    description: "Site criado com Thiago Lab Builder",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
`,
      encoding: 'utf-8',
    },
    {
      file: 'src/app/page.tsx',
      data: pageContent,
      encoding: 'utf-8',
    },
    {
      file: 'README.md',
      data: `# ${sanitizedName}

Site gerado com [Thiago Lab Builder](https://thiagolab.com/builder).

## Deploy

### Vercel (recomendado)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

1. Clique no botão acima
2. Conecte seu repositório Git
3. Deploy automático!

### Manual

\`\`\`bash
npm install
npm run build
npm start
\`\`\`

O servidor rodará em \`http://localhost:3000\`.

## Estrutura

\`\`\`
.
├── src/
│   └── app/
│       ├── globals.css    # Estilos globais Tailwind v4
│       ├── layout.tsx     # Layout principal
│       └── page.tsx       # Página gerada
├── package.json
├── next.config.ts
├── tsconfig.json
└── README.md
\`\`\`
`,
      encoding: 'utf-8',
    },
  ];

  return files;
}

/* ─── Gerar page.tsx a partir dos blocks ────────────────────────────── */

function generatePageFromBlocks(blocks: BlockData[]): string {
  const components = blocks.map((b) => renderBlockHtml(b)).join('\n\n');

  return `'use client';

import { useState } from 'react';

/* ============================================================
   Página gerada automaticamente pelo Thiago Lab Builder
   ============================================================ */

${blocks.map((b) => generateBlockStyles(b)).filter(Boolean).join('\n\n')}

export default function HomePage() {
  return (
    <main>
      ${components}
    </main>
  );
}
`;
}

function generateBlockStyles(_block: BlockData): string {
  // Could add custom CSS per block if needed
  return '';
}
