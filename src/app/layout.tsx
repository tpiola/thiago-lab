import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";

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
  openGraph: {
    title: "Thiago Lab — Intelligence OS",
    description:
      "IA aplicada para transformar perguntas em decisões, sistemas e resultados. Um laboratório de aplicação.",
    type: "website",
    locale: "pt_BR",
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
  return (
    <html
      lang="pt-BR"
      className={`${geistSans.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col grain">
        {children}
      </body>
    </html>
  );
}
