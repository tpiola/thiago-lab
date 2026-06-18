import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";

/* ── Geist Sans (primary sans) ──────────────────────────────────────────── */
const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
});

/* ── JetBrains Mono (code / terminal) ───────────────────────────────────── */
const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Thiago Lab — Intelligence OS",
  description:
    "IA aplicada para transformar perguntas em decisões, sistemas e resultados. Um laboratório de aplicação.",
  keywords: [
    "Thiago Lab", "Intelligence OS", "IA", "inteligência artificial",
    "agentes AI", "automação", "n8n", "Next.js", "desenvolvimento web",
    "laboratório de aplicação", "transformação digital",
    "INEMA VIP", "LLM Gateway", "Biblioteca de Prompts", "prompt engineering",
    "Claude Code", "DeepSeek", "agentes inteligentes",
  ],
  authors: [{ name: "Thiago Lab" }],
  creator: "Thiago Lab",
  publisher: "Thiago Lab",
  robots: "index, follow",
  metadataBase: new URL("https://thiagolab.com"),
  openGraph: {
    title: "Thiago Lab — Intelligence OS",
    description:
      "IA aplicada para transformar perguntas em decisões, sistemas e resultados. Um laboratório de aplicação.",
    type: "website",
    locale: "pt_BR",
    siteName: "Thiago Lab",
    url: "https://thiagolab.com",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Thiago Lab — Intelligence OS",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Thiago Lab — Intelligence OS",
    description:
      "IA aplicada para transformar perguntas em decisões, sistemas e resultados. Um laboratório de aplicação.",
    images: ["/og-image.png"],
  },
  alternates: {
    canonical: "https://thiagolab.com",
  },
};

export const viewport: Viewport = {
  themeColor: "#06080C",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Thiago Lab — Intelligence OS',
    url: 'https://thiagolab.com',
    description:
      'IA aplicada para transformar perguntas em decisões, sistemas e resultados. Um laboratório de aplicação.',
    author: {
      '@type': 'Person',
      name: 'Thiago Lab',
    },
    inLanguage: 'pt-BR',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://thiagolab.com/biblioteca?q={search_term_string}',
      },
      'query-input': 'required name=search_term_string',
    },
  };

  const jsonLdBreadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    name: 'Thiago Lab',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://thiagolab.com' },
      { '@type': 'ListItem', position: 2, name: 'INEMA VIP', item: 'https://thiagolab.com/inema' },
      { '@type': 'ListItem', position: 3, name: 'LLM Gateway', item: 'https://thiagolab.com/ia' },
      { '@type': 'ListItem', position: 4, name: 'Biblioteca de Prompts', item: 'https://thiagolab.com/biblioteca' },
    ],
  };

  return (
    <html
      lang="pt-BR"
      className={`${geistSans.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb) }}
        />
      </head>
      <body className="min-h-full flex flex-col grain">
        <AuthProvider>
          {children}
        </AuthProvider>

        {/* IntersectionObserver — ativa reveal-fade, reveal-scale e reveal no viewport */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){
              var RO = window.IntersectionObserver;
              if(!RO) return;
              var obs = new RO(function(entries){
                entries.forEach(function(e){
                  if(e.isIntersecting){ e.target.classList.add('visible'); obs.unobserve(e.target); }
                });
              }, { threshold:0.1, rootMargin:'0px 0px -40px 0px' });
              document.querySelectorAll('.reveal-fade,.reveal-scale,.reveal').forEach(function(el){ obs.observe(el); });
            })();`,
          }}
        />
      </body>
    </html>
  );
}
