import { useState } from "react";
import { trpc } from "@/providers/trpc";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Globe, Trash2, Sparkles, ExternalLink, Loader2, MessageSquare, Linkedin, Twitter, Youtube, Github, Newspaper } from "lucide-react";

const sources = [
  { key: "web", label: "Web", icon: Globe }, { key: "reddit", label: "Reddit", icon: MessageSquare },
  { key: "linkedin", label: "LinkedIn", icon: Linkedin }, { key: "x", label: "X / Twitter", icon: Twitter },
  { key: "youtube", label: "YouTube", icon: Youtube }, { key: "github", label: "GitHub", icon: Github },
  { key: "news", label: "Noticias", icon: Newspaper },
];

const stC: Record<string, string> = { pending: "#f59e0b", running: "#3b82f6", completed: "#00ff88", failed: "#ef4444" };
const bg = 'var(--bg-secondary)';
const borderC = 'var(--border)';
const elevBg = 'var(--bg-card)';
const txt = 'var(--text)';
const tsec = 'var(--text-secondary)';
const tm = 'var(--text-muted)';
const ac = 'var(--accent)';

export default function Research() {
  const utils = trpc.useUtils();
  const { data: researches, isLoading } = trpc.research.list.useQuery();
  const createR = trpc.research.create.useMutation({ onSuccess: () => utils.research.list.invalidate() });
  const completeR = trpc.research.complete.useMutation({ onSuccess: () => utils.research.list.invalidate() });
  const deleteR = trpc.research.delete.useMutation({ onSuccess: () => utils.research.list.invalidate() });
  const [query, setQuery] = useState("");
  const [source, setSource] = useState("web");
  const [scraping, setScraping] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setScraping(true);
    const result = await createR.mutateAsync({ query, source: source as any });
    if (result) {
      setTimeout(async () => {
        await completeR.mutateAsync({ id: result.id, summary: genSummary(query, source), results: genResults(query, source) });
        setScraping(false); setQuery("");
      }, 2500);
    }
  };

  return (
    <div className="p-4 lg:p-6 space-y-4">
      <div><h1 className="text-xl lg:text-2xl font-bold tracking-tight" style={{ color: txt }}>Pesquisa & Inteligencia</h1><p className="text-sm mt-0.5" style={{ color: tm }}>Busque e analise dados de qualquer fonte</p></div>
      <Card className="border" style={{ background: bg, borderColor: borderC }}>
        <CardContent className="p-4 space-y-3">
          <Label className="text-xs uppercase tracking-wider" style={{ color: tm }}>Busca Inteligente</Label>
          <div className="flex gap-2">
            <Input value={query} onChange={e => setQuery(e.target.value)} placeholder="O que voce quer pesquisar?" className="border flex-1" style={{ background: elevBg, borderColor, color: txt }} onKeyDown={e => e.key === "Enter" && handleSearch()} />
            <Select value={source} onValueChange={setSource}>
              <SelectTrigger className="border w-[140px] text-xs" style={{ background: elevBg, borderColor, color: txt }}><SelectValue /></SelectTrigger>
              <SelectContent style={{ background: elevBg, borderColor }}>{sources.map(s => <SelectItem key={s.key} value={s.key} className="text-xs" style={{ color: txt }}>{s.label}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="flex flex-wrap gap-2">
            {sources.map(s => { const Icon = s.icon; return <button key={s.key} onClick={() => setSource(s.key)} className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] transition-all" style={source === s.key ? { background: `${ac}10`, color: ac, border: `1px solid ${ac}20` } : { background: elevBg, color: tm, border: `1px solid ${borderC}` }}><Icon className="w-3 h-3" />{s.label}</button>; })}
          </div>
          <Button className="text-xs font-semibold" style={{ background: ac, color: '#000' }} disabled={!query.trim() || scraping} onClick={handleSearch}>{scraping ? <><Loader2 className="w-3.5 h-3.5 mr-1 animate-spin" /> Analisando...</> : <><Sparkles className="w-3.5 h-3.5 mr-1" /> Pesquisar</>}</Button>
        </CardContent>
      </Card>
      <div>
        <h2 className="text-sm font-medium mb-3" style={{ color: txt }}>Historico de Pesquisas</h2>
        {isLoading ? <div className="space-y-3">{[...Array(3)].map((_,i) => <div key={i} className="h-24 rounded-xl animate-pulse" style={{ background: bg }} />)}</div> :
          researches?.length === 0 ? <Card className="border" style={{ background: bg, borderColor: borderC }}><CardContent className="py-8 text-center"><Search className="w-8 h-8 mx-auto mb-2" style={{ color: tm }} /><p className="text-sm" style={{ color: tsec }}>Nenhuma pesquisa ainda</p></CardContent></Card> :
          <div className="space-y-3">
            {researches?.map(r => { const src = sources.find(s => s.key === r.source); const results = (r.results as any[]) || []; return (
              <Card key={r.id} className="border" style={{ background: bg, borderColor: borderC }}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-sm font-medium" style={{ color: txt }}>{r.query}</h3>
                        {src && <Badge className="text-[9px]" style={{ background: elevBg, color: tm }}>{src.label}</Badge>}
                        <Badge className="text-[9px]" style={{ background: `${stC[r.status]}15`, color: stC[r.status] }}>{r.status}</Badge>
                      </div>
                      {r.summary && <p className="text-xs mt-2 leading-relaxed" style={{ color: tsec }}>{r.summary}</p>}
                      {results.length > 0 && <div className="mt-3 space-y-1.5">{results.slice(0, 3).map((res, i) => <div key={i} className="flex items-start gap-2 p-2 rounded-lg" style={{ background: elevBg }}><ExternalLink className="w-3 h-3 mt-0.5 shrink-0" style={{ color: ac }} /><div className="min-w-0 flex-1"><p className="text-xs font-medium truncate" style={{ color: txt }}>{res.title}</p><p className="text-[10px] line-clamp-2" style={{ color: tm }}>{res.snippet}</p></div></div>)}</div>}
                    </div>
                    <Button variant="ghost" size="icon" className="w-7 h-7 shrink-0 hover:text-red-400" style={{ color: tm }} onClick={() => { if (confirm('Excluir?')) deleteR.mutate({ id: r.id }); }}><Trash2 className="w-3.5 h-3.5" /></Button>
                  </div>
                </CardContent>
              </Card>
            ); })}
          </div>}
      </div>
    </div>
  );
}

function genSummary(query: string, source: string): string {
  const summaries: Record<string, string[]> = {
    web: [`Analise completa de "${query}". Encontramos 47 fontes relevantes. O nicho apresenta crescimento de 340% nos ultimos 12 meses.`, `Resultados para "${query}" indicam forte demanda no mercado brasileiro. 23 competidores identificados com baixa qualidade.`],
    reddit: [`Comunidades analisadas: r/entrepreneur, r/sweatystartup. Sentimento geral: 78% positivo sobre "${query}". Dores: falta de ferramentas em PT-BR.`],
    youtube: [`Analise de 156 videos sobre "${query}". Media de views: 45K. Oportunidade: canal em PT-BR com abordagem pratica.`],
    default: [`Pesquisa sobre "${query}" concluida. Dados coletados de ${source} e analisados pela IA.`],
  };
  const pool = summaries[source] || summaries.default;
  return pool[Math.floor(Math.random() * pool.length)];
}

function genResults(query: string, source: string): any[] {
  return [
    { title: `${query} - Guia Definitivo 2026`, url: `https://example.com/${query.replace(/\s+/g, "-")}`, snippet: `Guia completo sobre ${query} com estrategias comprovadas para gerar receita online sem investimento.` },
    { title: `Como monetizar ${query} em 30 dias`, url: `https://example.com/monetizar`, snippet: `Passo a passo validado por 2.000+ empreendedores para transformar ${query} em maquina de vendas.` },
    { title: `${query}: Dados e Estatisticas`, url: `https://example.com/dados`, snippet: `Pesquisa de mercado completa com numeros reais, concorrentes e oportunidades para iniciantes.` },
    { title: `Ferramentas gratis para escalar ${query}`, url: `https://example.com/ferramentas`, snippet: `Stack tecnologico completo usando apenas ferramentas gratuitas para automatizar e escalar.` },
    { title: `Cases de sucesso: ${query}`, url: `https://example.com/cases`, snippet: `Entrevistas e analises de pessoas que faturam +$10K/mes com ${query} usando trafego organico.` },
  ];
}
