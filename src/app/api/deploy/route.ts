/* ==========================================================================
   /api/deploy — Deploy 1-Clique via Vercel API
   Cria projeto + faz deploy em produção
   Intelligence OS — thiagolab.com
   ========================================================================== */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

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
  const components = blocks.map((b) => renderBlockComponent(b)).join('\n\n');

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

function renderBlockComponent(block: BlockData): string {
  const p = block.props as Record<string, unknown>;
  const id = block.id;

  switch (block.type) {
    case 'hero': {
      const title = esc(String(p.title ?? ''));
      const subtitle = esc(String(p.subtitle ?? ''));
      const cta = esc(String(p.cta ?? ''));
      const bgColor = String(p.bgColor ?? '#06080C');
      const accentColor = String(p.accentColor ?? '#3DF5C5');
      return `<section id="${id}" style="background:${bgColor};color:#E8EDF2;padding:6rem 1.5rem;text-align:center;min-height:80vh;display:flex;flex-direction:column;justify-content:center;align-items:center">
        <h1 style="font-size:clamp(2rem,6vw,4rem);font-weight:700;max-width:800px;margin:0 auto 1rem;line-height:1.1">${title}</h1>
        <p style="font-size:1.25rem;color:#B0B8C4;max-width:600px;margin:0 auto 2rem">${subtitle}</p>
        <a href="#contato" style="display:inline-block;background:${accentColor};color:#06080C;padding:0.75rem 2rem;border-radius:8px;font-weight:600;font-size:1rem">${cta}</a>
      </section>`;
    }
    case 'features': {
      const title = esc(String(p.title ?? 'Recursos'));
      const items = (p.items as Array<Record<string, string>>) || [];
      return `<section id="${id}" style="padding:4rem 1.5rem;background:#0C0F15">
        <h2 style="font-size:2rem;text-align:center;margin-bottom:3rem;color:#E8EDF2">${title}</h2>
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:1.5rem;max-width:1200px;margin:0 auto">
          ${items.map((item) =>
            `<div style="background:#12161E;border:1px solid #1E2433;border-radius:12px;padding:1.5rem">
              ${item.icon ? `<div style="font-size:2rem;margin-bottom:0.5rem">${item.icon}</div>` : ''}
              <h3 style="color:#E8EDF2;margin:0 0 0.5rem">${esc(item.title ?? '')}</h3>
              <p style="color:#7A8694;margin:0">${esc(item.desc ?? '')}</p>
            </div>`
          ).join('\n          ')}
        </div>
      </section>`;
    }
    case 'pricing': {
      const title = esc(String(p.title ?? 'Planos'));
      const plans = (p.plans as Array<Record<string, unknown>>) || [];
      return `<section id="${id}" style="padding:4rem 1.5rem;background:#06080C">
        <h2 style="font-size:2rem;text-align:center;margin-bottom:3rem;color:#E8EDF2">${title}</h2>
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:1.5rem;max-width:1000px;margin:0 auto">
          ${plans.map((plan) => {
            const name = esc(String(plan.name ?? ''));
            const price = String(plan.price ?? '');
            const featured = !!plan.featured;
            const features = (plan.features as string[]) || [];
            return `<div style="background:#12161E;border:1px solid ${featured ? '#3DF5C5' : '#1E2433'};border-radius:12px;padding:2rem;text-align:center">
              <h3 style="color:#E8EDF2;margin:0 0 0.5rem">${name}</h3>
              <div style="font-size:2.5rem;font-weight:700;color:#3DF5C5;margin:1rem 0">R$${price}<span style="font-size:1rem;color:#7A8694">/mês</span></div>
              <ul style="list-style:none;padding:0;margin:1.5rem 0;color:#B0B8C4">
                ${features.map((f) => `<li style="padding:0.375rem 0">✓ ${esc(f)}</li>`).join('\n                ')}
              </ul>
              <a href="#" style="display:inline-block;background:${featured ? '#3DF5C5' : 'transparent'};color:${featured ? '#06080C' : '#E8EDF2'};border:1px solid ${featured ? '#3DF5C5' : '#1E2433'};padding:0.75rem 2rem;border-radius:8px;font-weight:600">Escolher</a>
            </div>`;
          }).join('\n          ')}
        </div>
      </section>`;
    }
    case 'testimonials': {
      const title = esc(String(p.title ?? 'Depoimentos'));
      const items = (p.items as Array<Record<string, string>>) || [];
      return `<section id="${id}" style="padding:4rem 1.5rem;background:#0C0F15">
        <h2 style="font-size:2rem;text-align:center;margin-bottom:3rem;color:#E8EDF2">${title}</h2>
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:1.5rem;max-width:1000px;margin:0 auto">
          ${items.map((item) =>
            `<div style="background:#12161E;border:1px solid #1E2433;border-radius:12px;padding:1.5rem">
              <p style="color:#B0B8C4;font-style:italic;margin:0 0 1rem">"${esc(item.text ?? '')}"</p>
              <div><strong style="color:#E8EDF2">${esc(item.name ?? '')}</strong><span style="color:#7A8694;margin-left:0.5rem">${esc(item.role ?? '')}</span></div>
            </div>`
          ).join('\n          ')}
        </div>
      </section>`;
    }
    case 'faq': {
      const title = esc(String(p.title ?? 'FAQ'));
      const items = (p.items as Array<Record<string, string>>) || [];
      return `<section id="${id}" style="padding:4rem 1.5rem;background:#06080C">
        <h2 style="font-size:2rem;text-align:center;margin-bottom:3rem;color:#E8EDF2">${title}</h2>
        <div style="max-width:700px;margin:0 auto">
          ${items.map((item) =>
            `<details style="background:#12161E;border:1px solid #1E2433;border-radius:12px;margin-bottom:0.75rem;padding:1rem">
              <summary style="color:#E8EDF2;font-weight:600;cursor:pointer">${esc(item.q ?? '')}</summary>
              <p style="color:#7A8694;margin-top:0.75rem">${esc(item.a ?? '')}</p>
            </details>`
          ).join('\n          ')}
        </div>
      </section>`;
    }
    case 'cta': {
      const title = esc(String(p.title ?? ''));
      const subtitle = esc(String(p.subtitle ?? ''));
      const buttonText = esc(String(p.buttonText ?? ''));
      return `<section id="${id}" style="padding:4rem 1.5rem;text-align:center;background:linear-gradient(135deg,#1A1F2B,#0C0F15)">
        <h2 style="font-size:2rem;color:#E8EDF2;margin:0 0 0.5rem">${title}</h2>
        <p style="color:#B0B8C4;margin:0 0 2rem">${subtitle}</p>
        <a href="#contato" style="display:inline-block;background:#3DF5C5;color:#06080C;padding:0.75rem 2rem;border-radius:8px;font-weight:600">${buttonText}</a>
      </section>`;
    }
    case 'footer': {
      const copyright = esc(String(p.copyright ?? ''));
      const links = (p.links as Array<Record<string, string>>) || [];
      return `<footer id="${id}" style="padding:2rem 1.5rem;background:#06080C;border-top:1px solid #1E2433;text-align:center">
        <p style="color:#7A8694;margin:0 0 1rem">${copyright}</p>
        <div style="display:flex;justify-content:center;gap:1.5rem">
          ${links.map((link) =>
            `<a href="${esc(link.href ?? '#')}" style="color:#B0B8C4;text-decoration:none;font-size:0.875rem">${esc(link.label ?? '')}</a>`
          ).join('\n          ')}
        </div>
      </footer>`;
    }
    case 'stats': {
      const title = esc(String(p.title ?? ''));
      const items = (p.items as Array<Record<string, unknown>>) || [];
      return `<section id="${id}" style="padding:4rem 1.5rem;background:#0C0F15">
        <h2 style="font-size:2rem;text-align:center;margin-bottom:3rem;color:#E8EDF2">${title}</h2>
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:2rem;max-width:800px;margin:0 auto;text-align:center">
          ${items.map((item) =>
            `<div>
              <div style="font-size:2.5rem;font-weight:700;color:#3DF5C5">${String(item.value ?? 0)}</div>
              <div style="color:#7A8694;margin-top:0.25rem">${esc(String(item.label ?? ''))}</div>
            </div>`
          ).join('\n          ')}
        </div>
      </section>`;
    }
    case 'gallery': {
      const title = esc(String(p.title ?? 'Galeria'));
      const images = (p.images as Array<Record<string, string>>) || [];
      return `<section id="${id}" style="padding:4rem 1.5rem;background:#06080C">
        <h2 style="font-size:2rem;text-align:center;margin-bottom:3rem;color:#E8EDF2">${title}</h2>
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:1rem;max-width:1000px;margin:0 auto">
          ${images.map((img) =>
            `<div style="border-radius:12px;overflow:hidden;background:#12161E;aspect-ratio:16/10">
              <img src="${esc(img.src ?? '/placeholder.svg')}" alt="${esc(img.alt ?? '')}" style="width:100%;height:100%;object-fit:cover" />
            </div>`
          ).join('\n          ')}
        </div>
      </section>`;
    }
    case 'contact': {
      const title = esc(String(p.title ?? 'Contato'));
      const email = esc(String(p.email ?? ''));
      const phone = esc(String(p.phone ?? ''));
      const address = esc(String(p.address ?? ''));
      return `<section id="${id}" style="padding:4rem 1.5rem;background:#06080C">
        <h2 style="font-size:2rem;text-align:center;margin-bottom:3rem;color:#E8EDF2">${title}</h2>
        <div style="max-width:500px;margin:0 auto;text-align:center">
          ${email ? `<p style="color:#B0B8C4;margin:0.5rem 0">✉ ${email}</p>` : ''}
          ${phone ? `<p style="color:#B0B8C4;margin:0.5rem 0">📞 ${phone}</p>` : ''}
          ${address ? `<p style="color:#B0B8C4;margin:0.5rem 0">📍 ${address}</p>` : ''}
        </div>
      </section>`;
    }
    default:
      return '';
  }
}

function generateBlockStyles(_block: BlockData): string {
  // Could add custom CSS per block if needed
  return '';
}

function esc(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
