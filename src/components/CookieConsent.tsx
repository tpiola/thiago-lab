"use client";

import { useState, useEffect } from "react";

export function CookieConsent() {
  const [visivel, setVisivel] = useState(false);

  useEffect(() => {
    const consentido = localStorage.getItem("cookie-consent");
    if (!consentido) setVisivel(true);
  }, []);

  const aceitar = () => {
    localStorage.setItem("cookie-consent", "true");
    setVisivel(false);
  };

  if (!visivel) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[100] border-t border-border/40 bg-surface/95 backdrop-blur-lg shadow-[0_-8px_40px_rgba(0,0,0,0.12)]">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-3 px-4 py-3 sm:flex-row sm:px-6">
        <p className="flex-1 text-xs leading-relaxed text-muted sm:text-sm">
          Usamos cookies para melhorar sua experiência.{" "}
          <a
            href="/privacidade"
            className="underline underline-offset-2 hover:text-foreground transition-colors"
          >
            Saiba mais
          </a>
          .
        </p>
        <button
          onClick={aceitar}
          className="rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-gold-500 min-h-[44px] inline-flex items-center"
        >
          Aceitar
        </button>
      </div>
    </div>
  );
}
