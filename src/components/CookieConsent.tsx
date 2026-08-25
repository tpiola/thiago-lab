"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(!localStorage.getItem("cookie-consent"));
  }, []);

  if (!visible) return null;

  return (
    <aside
      className="fixed inset-x-0 bottom-0 z-[100] border-t border-[#6F756F] bg-[#F5F2E9] text-[#122024]"
      aria-label="Preferência de armazenamento"
    >
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-4 sm:flex-row sm:items-center sm:px-8">
        <p className="flex-1 text-sm leading-6 text-[#526066]">
          Salvamos sua preferência neste navegador e usamos recursos necessários quando
          você entra na plataforma.{" "}
          <Link href="/privacidade" className="font-semibold underline underline-offset-4">
            Ver detalhes
          </Link>
        </p>
        <button
          type="button"
          onClick={() => {
            localStorage.setItem("cookie-consent", "acknowledged");
            setVisible(false);
          }}
          className="min-h-11 border border-[#122024] bg-[#122024] px-5 text-sm font-semibold text-white hover:bg-[#087F70]"
        >
          Entendi
        </button>
      </div>
    </aside>
  );
}
