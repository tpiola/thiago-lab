'use client';

import Link from 'next/link';
import { useRef, useState } from 'react';

const app = '/gods-eye-view/app/index.html';
const views = {
  franca: '#lat=-20.5386&lon=-47.4008&alt=42000&heading=0&pitch=-55&style=normal&map=esri-imagery',
  brazil: '#lat=-15.78&lon=-47.93&alt=5500000&heading=0&pitch=-90&style=normal&map=esri-imagery',
  world: '#lat=-15&lon=-47&alt=21000000&heading=0&pitch=-90&style=normal&map=esri-imagery',
};

export function GlobeWorkspace() {
  const frame = useRef<HTMLIFrameElement>(null);
  const [help, setHelp] = useState(false);
  const [selected, setSelected] = useState<keyof typeof views>('franca');
  const navigate = (view: keyof typeof views) => {
    setSelected(view);
    if (frame.current?.contentWindow) frame.current.contentWindow.location.hash = views[view];
  };
  return (
    <main className="flex h-[100dvh] min-h-[480px] flex-col overflow-hidden bg-[#080e13] text-[#e4eee9]">
      <header className="z-10 flex shrink-0 flex-wrap items-center justify-between gap-3 border-b border-white/10 bg-[#0c151b] px-4 py-3 md:px-6">
        <div className="flex items-center gap-3">
          <Link href="/" aria-label="Voltar ao Thiago Lab" className="grid h-9 w-9 place-items-center border border-[#81bdaa]/40 font-mono text-xs text-[#99d8bf]">TL/</Link>
          <div><h1 className="text-sm font-semibold tracking-tight">God&apos;s Eye View</h1><p className="text-[10px] tracking-[0.14em] text-[#81a99b]">THIAGO LAB · EXPLORADOR GEOSPACIAL</p></div>
        </div>
        <nav className="flex items-center gap-1.5 text-xs" aria-label="Localização do globo">
          {(['franca', 'brazil', 'world'] as const).map((view) => (
            <button type="button" key={view} onClick={() => navigate(view)} aria-pressed={selected === view} className={`min-h-10 rounded px-3 transition-colors ${selected === view ? 'bg-[#99d8bf] font-semibold text-[#0a1913]' : 'border border-white/15 text-[#b8c6c0] hover:bg-white/10'}`}>
              {{ franca: 'Franca', brazil: 'Brasil', world: 'Mundo' }[view]}
            </button>
          ))}
          <button type="button" onClick={() => setHelp(!help)} aria-expanded={help} aria-controls="globe-help" className="ml-1 min-h-10 border-l border-white/15 px-3 text-[#b8c6c0]">Como usar</button>
        </nav>
      </header>
      {help && <section id="globe-help" className="shrink-0 border-b border-white/10 bg-[#15231e] px-5 py-4 text-sm leading-6 text-[#c6d9d0]">
        <p>Arraste para navegar. Use a roda do mouse ou dois dedos para aproximar. Em <strong>Data Layers</strong>, ative voos, satélites, terremotos e clima. Os voos cobrem a região da câmera e os dados podem ter atraso. Navegadores sem WebGL abrem automaticamente o mapa 2D, com voos, satélites e terremotos.</p>
        <p className="mt-2 text-xs text-[#9bb5a8]">Esta edição usa mapas sem chave. Voz, cidades fotorrealistas, navios e algumas câmeras precisam de configuração adicional. Dados de cabos submarinos e a cena do Nepal foram excluídos por restrições de licença.</p>
        <a href="https://github.com/bilawalsidhu/gods-eye-view" target="_blank" rel="noopener noreferrer" className="mt-2 inline-block underline underline-offset-4">Conhecer o projeto original</a>
      </section>}
      <iframe ref={frame} src={`${app}${views.franca}`} title="Globo interativo God's Eye View" allow="fullscreen" allowFullScreen className="min-h-0 w-full flex-1 border-0" />
      <footer className="flex shrink-0 flex-wrap items-center justify-between gap-x-4 gap-y-1 border-t border-white/10 bg-[#0c151b] px-4 py-2 text-[10px] text-[#91a69c]">
        <span>Dados públicos · cobertura varia por camada</span>
        <div className="flex gap-4"><a href={`${app}${views[selected]}`} target="_blank" rel="noopener noreferrer" className="hover:text-white">Abrir globo completo ↗</a><a href="/gods-eye-view/app/credits/LICENSE" className="hover:text-white">God&apos;s Eye View · MIT</a></div>
      </footer>
    </main>
  );
}
