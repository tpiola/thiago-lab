/* ==========================================================================
   /api/export — Exportar código como ZIP
   Gera projeto Next.js + Tailwind completo a partir dos blocks
   Intelligence OS — thiagolab.com
   ========================================================================== */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import JSZip from 'jszip';
import { renderBlockHtml } from '@/lib/generator/blockHtml';

interface BlockData {
  id: string;
  type: string;
  props: Record<string, unknown>;
}

interface ExportRequest {
  name: string;
  blocks: BlockData[];
}

export async function POST(request: NextRequest) {
  try {
    const body: ExportRequest = await request.json();
    const { name, blocks } = body;

    if (!name || !blocks || !Array.isArray(blocks)) {
      return NextResponse.json(
        { error: 'Campos "name" e "blocks" (array) são obrigatórios.' },
        { status: 400 },
      );
    }

    const zip = new JSZip();
    const sanitizedName = name.replace(/[<>"']/g, '').trim() || 'meu-site';
    const slug = sanitizedName
      .toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9-]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
      .slice(0, 40);

    // ── package.json ──
    zip.file('package.json', JSON.stringify({
      name: slug,
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
    }, null, 2));

    // ── next.config.ts ──
    zip.file('next.config.ts', `import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
`);

    // ── tsconfig.json ──
    zip.file('tsconfig.json', JSON.stringify({
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
    }, null, 2));

    // ── postcss.config.mjs ──
    zip.file('postcss.config.mjs', `const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};
export default config;
`);

    // ── src/app/globals.css ──
    zip.file('src/app/globals.css', `@import "tailwindcss";

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
`);

    // ── src/app/layout.tsx ──
    zip.file('src/app/layout.tsx', `import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "${sanitizedName}",
  description: "Site criado com Thiago Lab Builder",
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
`);

    // ── src/app/page.tsx ──
    zip.file('src/app/page.tsx', generatePageFromBlocks(blocks));

    // ── README.md ──
    zip.file('README.md', `# ${sanitizedName}

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
`);

    // ── Gerar ZIP ──
    const zipRaw = await zip.generateAsync({
      type: 'uint8array',
      compression: 'DEFLATE',
      compressionOptions: { level: 9 },
    });
    const zipBuffer = new Uint8Array(zipRaw);

    const filename = encodeURIComponent(`${slug}.zip`);

    return new NextResponse(zipBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename="${slug}.zip"; filename*=UTF-8''${filename}`,
        'Content-Length': zipBuffer.length.toString(),
      },
    });
  } catch (err) {
    console.error('[POST /api/export]', err);
    return NextResponse.json(
      { error: 'Erro ao gerar ZIP: ' + (err instanceof Error ? err.message : String(err)) },
      { status: 500 },
    );
  }
}

/* ─── Gerar página a partir dos blocks ────────────────────────────── */

function generatePageFromBlocks(blocks: BlockData[]): string {
  const components = blocks.map((b) => renderBlockHtml(b)).join('\n\n');

  return `'use client';

/* ============================================================
   Página gerada automaticamente pelo Thiago Lab Builder
   ============================================================ */

export default function HomePage() {
  return (
    <main>
      ${components}
    </main>
  );
}
`;
}
