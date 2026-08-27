import type { Metadata, Viewport } from "next";
import { Geist, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";
import { CookieConsent } from "@/components/CookieConsent";

const SITE_URL = "https://thiago-lab.vercel.app";
const SITE_NAME = "Thiago Lab";
const DESCRIPTION =
  "Ambiente de trabalho para conectar contexto, automações e agentes de IA em fluxos que a equipe consegue revisar.";

const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Thiago Lab | Contexto, automações e agentes em um só fluxo",
  description: DESCRIPTION,
  generator: "Hermes Agent",
  authors: [{ name: "Thiago Piola", url: "https://thiagopiola.com.br" }],
  creator: "Thiago Lab",
  publisher: "Thiago Lab",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "/",
    languages: { "pt-BR": "/" },
  },
  openGraph: {
    title: "Thiago Lab | Contexto, automações e agentes em um só fluxo",
    description: DESCRIPTION,
    type: "website",
    locale: "pt_BR",
    siteName: SITE_NAME,
    url: SITE_URL,
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Thiago Lab — mapa de contexto, automações e próximos passos",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Thiago Lab | Contexto, automações e agentes em um só fluxo",
    description: DESCRIPTION,
    images: ["/og-image.png"],
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION ?? "",
  },
};

export const viewport: Viewport = {
  themeColor: "#E9E5DA",
  colorScheme: "light",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: SITE_NAME,
      url: SITE_URL,
      description: DESCRIPTION,
      logo: `${SITE_URL}/og-image.png`,
      founder: {
        "@type": "Person",
        name: "Thiago Piola",
        url: "https://thiagopiola.com.br",
      },
      knowsAbout: [
        "Arquitetura de automações",
        "Agentes de IA",
        "Integração de dados",
        "Operações digitais",
      ],
      areaServed: { "@type": "Country", name: "Brasil" },
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      name: SITE_NAME,
      url: SITE_URL,
      inLanguage: "pt-BR",
      publisher: { "@id": `${SITE_URL}/#organization` },
    },
    {
      "@type": "WebApplication",
      "@id": `${SITE_URL}/#application`,
      name: "Thiago Lab Intelligence OS",
      url: SITE_URL,
      description: DESCRIPTION,
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
      browserRequirements: "Navegador moderno com JavaScript",
      featureList: [
        "Organização de contexto",
        "Fluxos de automação",
        "Agentes especializados",
        "Registro de decisões",
      ],
      author: { "@id": `${SITE_URL}/#organization` },
      inLanguage: "pt-BR",
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="pt-BR"
      className={`${geistSans.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body className="min-h-full bg-[#E9E5DA] text-[#122024]">
        <AuthProvider>{children}</AuthProvider>
        <CookieConsent />
      </body>
    </html>
  );
}
