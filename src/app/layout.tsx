import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";
import { CookieConsent } from "@/components/CookieConsent";

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
  title: "Thiago Lab — Intelligence OS Soberano | IA que não trai você",
  description:
    "Intelligence OS soberano para vida e negócios. Agentes de IA locais que não treinam em seus dados. Framework Soberano Thiagolab® — soberania digital real no Brasil.",
  keywords: [
    "intelligence os soberano",
    "agentes ia pessoais",
    "ia que não treina em dados",
    "soberania digital brasil",
    "life os ia",
    "agente soberano pessoal",
    "ia local-first",
    "ia privacidade",
    "produtividade com ia",
    "decisão com ia",
    "finanças pessoais ia",
    "carreira saúde ia",
    "Thiago Lab",
    "framework soberano",
    "IA soberana",
    "agentes de IA",
    "privacidade digital",
  ],
  authors: [{ name: "Thiago Piola", url: "https://thiagolab.com" }],
  creator: "Thiago Lab",
  publisher: "Thiago Lab",
  robots: "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
  metadataBase: new URL("https://thiagolab.com"),
  openGraph: {
    title: "Thiago Lab — Intelligence OS Soberano | IA que não trai você",
    description:
      "Intelligence OS soberano para vida e negócios. Agentes de IA locais que não treinam em seus dados. Framework Soberano Thiagolab® — soberania digital real no Brasil.",
    type: "website",
    locale: "pt_BR",
    siteName: "Thiago Lab",
    url: "https://thiagolab.com",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Thiago Lab — Intelligence OS Soberano | IA que não trai você",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Thiago Lab — Intelligence OS Soberano | IA que não trai você",
    description:
      "Intelligence OS soberano para vida e negócios. Agentes de IA locais que não treinam em seus dados. Framework Soberano Thiagolab® — soberania digital real no Brasil.",
    images: ["/og-image.png"],
    site: "@thiagolab",
    creator: "@thiagolab",
  },
  alternates: {
    canonical: "https://thiagolab.com",
    languages: {
      "pt-BR": "https://thiagolab.com",
    },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION ?? "",
    yandex: process.env.NEXT_PUBLIC_YANDEX_VERIFICATION ?? "",
  },
  other: {
    "geo.region": "BR",
    "geo.placename": "Brasil",
    "geo.position": "-14.2350;-51.9253",
    ICBM: "-14.2350, -51.9253",
    "author": "Thiago Piola",
    "copyright": "Thiago Lab",
    "generator": "Next.js 15 + Thiago Lab Framework",
    "MobileOptimized": "width",
    "HandheldFriendly": "true",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "black-translucent",
    "apple-mobile-web-app-title": "Thiago Lab",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#06080C" },
    { media: "(prefers-color-scheme: light)", color: "#0C0F15" },
  ],
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: true,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  /* ── Schema.org JSON-LD: Organization ────────────────────────────────── */
  const jsonLdOrganization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Thiago Lab",
    url: "https://thiagolab.com",
    description:
      "Intelligence OS soberano para vida e negócios. Agentes de IA locais que não treinam em seus dados. Framework Soberano Thiagolab®.",
    logo: "https://thiagolab.com/og-image.png",
    sameAs: [
      "https://thiagolab.com",
    ],
    founder: {
      "@type": "Person",
      name: "Thiago Piola",
      jobTitle: "Farmacêutico",
      description: "CRF/SP 58.519 — Fundador do Thiago Lab, criador do Framework Soberano Thiagolab®",
      url: "https://thiagolab.com",
    },
    knowsAbout: [
      "IA Soberana",
      "Agentes Pessoais",
      "Privacy-First AI",
      "Intelligence OS",
      "Soberania Digital",
      "Local-First AI",
      "Framework Soberano Thiagolab®",
      "Automação com IA",
    ],
    inLanguage: "pt-BR",
    areaServed: {
      "@type": "Country",
      name: "Brasil",
    },
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer support",
      url: "https://thiagolab.com",
    },
  };

  /* ── Schema.org JSON-LD: FAQPage ─────────────────────────────────────── */
  const jsonLdFAQ = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "O que é um Agente Soberano Pessoal?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Um Agente Soberano Pessoal é uma IA que roda localmente no seu dispositivo, sem depender de servidores externos. Ele não treina em seus dados, não compartilha informações com terceiros e garante soberania digital total — você é o único dono dos seus dados e decisões. Faz parte do Framework Soberano Thiagolab®.",
        },
      },
      {
        "@type": "Question",
        name: "Meus dados estão seguros?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Sim. No modelo local-first do Thiago Lab, seus dados nunca saem do seu dispositivo. Diferente de soluções como ChatGPT ou Gemini, nossos agentes não enviam suas informações para servidores na nuvem para treinamento. A arquitetura privacy-first garante que você mantenha total controle sobre seus dados pessoais, financeiros e profissionais.",
        },
      },
      {
        "@type": "Question",
        name: "Como o Thiago Lab difere de ChatGPT/Gemini?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "O Thiago Lab oferece um Intelligence OS soberano, não apenas um chatbot. Nossos Agentes Soberanos Pessoais rodam localmente no seu computador, não treinam em seus dados e garantem privacidade real. Enquanto ChatGPT e Gemini processam tudo em servidores externos e podem usar suas conversas para treinamento, o Thiago Lab coloca a soberania digital nas suas mãos — com agentes especializados para produtividade, finanças pessoais, carreira e saúde.",
        },
      },
    ],
  };

  /* ── Schema.org JSON-LD: Product (Agente Soberano Pessoal) ────────────── */
  const jsonLdProduct = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: "Agente Soberano Pessoal — Thiago Lab",
    description:
      "Agente de IA local-first que não treina em seus dados. Privacidade total, soberania digital e inteligência pessoal para produtividade, finanças, carreira e saúde. Parte do Framework Soberano Thiagolab®.",
    brand: {
      "@type": "Brand",
      name: "Thiago Lab",
    },
    offers: {
      "@type": "Offer",
      url: "https://thiagolab.com",
      availability: "https://schema.org/InStock",
    },
    category: "SoftwareApplication > ArtificialIntelligence",
    audience: {
      "@type": "Audience",
      audienceType: "Profissionais e indivíduos que valorizam soberania digital e privacidade de dados no Brasil",
    },
    review: {
      "@type": "Review",
      reviewBody:
        "O Framework Soberano Thiagolab® redefine a relação entre humanos e IA, priorizando privacidade, controle local e inteligência aplicada à vida real.",
    },
  };

  /* ── Schema.org JSON-LD: WebApplication ────────────────────────────────── */
  const jsonLdWebApplication = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Thiago Lab — Intelligence OS Soberano",
    url: "https://thiagolab.com",
    description:
      "Intelligence OS soberano com agentes de IA local-first. Framework Soberano Thiagolab® para produtividade, finanças, carreira e saúde.",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web, Windows, macOS, Linux",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "BRL",
      availability: "https://schema.org/InStock",
      url: "https://thiagolab.com",
    },
    browserRequirements: "Requere navegador moderno com suporte a JavaScript",
    permissions: "localStorage, IndexedDB",
    featureList: [
      "Agentes Soberanos Pessoais",
      "IA Local-First",
      "Biblioteca de Prompts",
      "LLM Gateway",
      "INEMA VIP",
      "Automações n8n",
    ],
    author: {
      "@type": "Organization",
      name: "Thiago Lab",
      url: "https://thiagolab.com",
    },
    inLanguage: "pt-BR",
    datePublished: "2024-01-01",
    keywords:
      "intelligence os, agente soberano, ia local, soberania digital, framework soberano, privacy-first ai",
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "5",
      bestRating: "5",
      worstRating: "1",
      ratingCount: "42",
    },
  };

  /* ── Schema.org JSON-LD: SoftwareApplication ───────────────────────────── */
  const jsonLdSoftwareApplication = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Framework Soberano Thiagolab®",
    url: "https://thiagolab.com",
    description:
      "Framework de inteligência soberana — agentes de IA locais que não treinam em seus dados. Local-first, privacy-first, soberania digital real.",
    applicationCategory: "ArtificialIntelligenceApplication",
    applicationSubCategory: "PersonalAgent",
    operatingSystem: "Windows, macOS, Linux",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "BRL",
      availability: "https://schema.org/InStock",
    },
    author: {
      "@type": "Person",
      name: "Thiago Piola",
      jobTitle: "Farmacêutico",
      url: "https://thiagolab.com",
    },
    datePublished: "2024-01-01",
    softwareVersion: "2.0",
    downloadUrl: "https://thiagolab.com/intelligence-os",
    installUrl: "https://thiagolab.com/intelligence-os",
    releaseNotes: "Intelligence OS 2.0 — Agentes Soberanos Pessoais com IA local-first e privacidade total",
    screenshot: {
      "@type": "ImageObject",
      url: "https://thiagolab.com/og-image.png",
      caption: "Thiago Lab — Intelligence OS Soberano",
    },
    inLanguage: ["pt-BR"],
    countriesSupported: "BR",
    permissions: "localStorage, IndexedDB",
    memoryRequirements: "8 GB RAM",
    processorRequirements: "Processador moderno com suporte a WebAssembly",
    storageRequirements: "1 GB espaço livre",
    softwareHelp: {
      "@type": "CreativeWork",
      name: "Biblioteca de Prompts",
      url: "https://thiagolab.com/biblioteca",
    },
    softwareAddOn: {
      "@type": "SoftwareApplication",
      name: "INEMA VIP",
      url: "https://thiagolab.com/inema",
      applicationCategory: "ArtificialIntelligenceApplication",
    },
  };

  /* ── Schema.org JSON-LD: HowTo ───────────────────────────────────────── */
  const jsonLdHowTo = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "Como começar com soberania digital",
    description:
      "Guia passo a passo para iniciar sua jornada de soberania digital com o Intelligence OS do Thiago Lab.",
    step: [
      {
        "@type": "HowToStep",
        position: 1,
        name: "Acesse o Thiago Lab",
        text: "Visite https://thiagolab.com e conheça o Intelligence OS Soberano — a plataforma que coloca IA no seu controle.",
        url: "https://thiagolab.com",
      },
      {
        "@type": "HowToStep",
        position: 2,
        name: "Configure seu Agente Soberano Pessoal",
        text: "Instale o Agente Soberano Pessoal localmente no seu dispositivo. Ele roda em sua máquina, sem enviar dados para servidores externos.",
      },
      {
        "@type": "HowToStep",
        position: 3,
        name: "Defina seus fluxos de inteligência",
        text: "Configure agentes para produtividade, finanças pessoais, carreira e saúde — cada um operando com seus dados locais e total privacidade.",
      },
      {
        "@type": "HowToStep",
        position: 4,
        name: "Expanda sua soberania digital",
        text: "Explore a Biblioteca de Prompts, conecte automações via n8n e integre o LLM Gateway para potencializar seus agentes pessoais com o Framework Soberano Thiagolab®.",
      },
    ],
  };

  /* ── Schema.org JSON-LD: BreadcrumbList ──────────────────────────────── */
  const jsonLdBreadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://thiagolab.com" },
      { "@type": "ListItem", position: 2, name: "Intelligence OS", item: "https://thiagolab.com/intelligence-os" },
      { "@type": "ListItem", position: 3, name: "INEMA VIP", item: "https://thiagolab.com/inema" },
      { "@type": "ListItem", position: 4, name: "LLM Gateway", item: "https://thiagolab.com/ia" },
      { "@type": "ListItem", position: 5, name: "Biblioteca de Prompts", item: "https://thiagolab.com/biblioteca" },
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
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdOrganization) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdFAQ) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdProduct) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdHowTo) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdWebApplication) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdSoftwareApplication) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb) }}
        />
      </head>
      <body className="min-h-full flex flex-col grain">
        <div id="scroll-progress" className="scroll-progress" />
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
        <script dangerouslySetInnerHTML={{__html: `(function(){
          var bar = document.getElementById('scroll-progress');
          window.addEventListener('scroll', function(){
            var h = document.documentElement;
            var scrolled = (h.scrollTop) / (h.scrollHeight - h.clientHeight);
            if(bar) bar.style.width = (scrolled * 100) + '%';
          });
        })();`}} />
        <CookieConsent />
      </body>
    </html>
  );
}
