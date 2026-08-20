import { useState } from "react";
import { trpc } from "@/providers/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Rocket, Zap, Globe, Users, BookOpen, ShoppingCart, Link2, GraduationCap, MessageCircle, Briefcase, Trash2, Star, TrendingUp, CheckCircle2, Clock, DollarSign, Target } from "lucide-react";

const catC: Record<string, { label: string; icon: any; color: string }> = {
  saas: { label: "SaaS", icon: Globe, color: "#00ff88" }, agency: { label: "Agencia", icon: Briefcase, color: "#3b82f6" },
  content: { label: "Conteudo", icon: BookOpen, color: "#f59e0b" }, ecommerce: { label: "E-commerce", icon: ShoppingCart, color: "#8b5cf6" },
  affiliate: { label: "Afiliados", icon: Link2, color: "#f97316" }, course: { label: "Cursos", icon: GraduationCap, color: "#ec4899" },
  community: { label: "Comunidade", icon: MessageCircle, color: "#00d4ff" }, freelance: { label: "Freelance", icon: Users, color: "#22c55e" },
};

const difC: Record<string, string> = { beginner: "#00ff88", intermediate: "#f59e0b", advanced: "#ef4444" };
const bg = 'var(--bg-secondary)';
const borderC = 'var(--border)';
const elevBg = 'var(--bg-card)';
const txt = 'var(--text)';
const tsec = 'var(--text-secondary)';
const tm = 'var(--text-muted)';
const ac = 'var(--accent)';

const preloaded = [
  { name: "SaaS Micro-SaaS $10K/mes", category: "saas" as const, description: "Crie um micro-SaaS que resolve um problema especifico. Escalone com marketing de conteudo e SEO ate $10K MRR organico.", strategy: "1. Identifique uma dor em um nicho especifico. 2. Construa MVP em 2 semanas. 3. Publique 3 artigos SEO/semana. 4. Liste no Product Hunt. 5. Use LinkedIn + Twitter. 6. Implemente pricing tiered. 7. Escalone com affiliate program.", expectedRevenue: "$5.000 - $50.000/mes", difficulty: "intermediate" as const, steps: [{ order: 1, title: "Validacao da Ideia", description: "Pesquise 10 grupos de comunidade e valide a dor.", tools: ["Research AI", "Reddit"], timeline: "3-5 dias" }, { order: 2, title: "MVP em 14 dias", description: "Construa com Next.js + Supabase. Foco em UMA feature.", tools: ["Next.js", "Supabase"], timeline: "14 dias" }, { order: 3, title: "Landing Page", description: "Crie LP com copy AIDA e CTA claro.", tools: ["AI Studio"], timeline: "2 dias" }, { order: 4, title: "Maquina de Conteudo SEO", description: "Publique 3 artigos/semana otimizados.", tools: ["AI Studio"], timeline: "Continuo" }, { order: 5, title: "Lancamento", description: "Lance no Product Hunt e 10 diretorios.", tools: ["Social Hub"], timeline: "7 dias" }, { order: 6, title: "Monetizacao", description: "Freemium + tiers. Meta: 100 customers a $50/mes.", tools: ["CRM"], timeline: "30-90 dias" }] },
  { name: "Agencia Digital $15K/mes", category: "agency" as const, description: "Agencia de marketing/servicos digitais sem investimento inicial. Prospecao via LinkedIn e conteudo.", strategy: "Use sua expertise para oferecer servicos de alto valor. Prospecao ativa via LinkedIn + inbound via conteudo. Margem de 70-80%.", expectedRevenue: "$10.000 - $30.000/mes", difficulty: "beginner" as const, steps: [{ order: 1, title: "Defina seu servico", description: "Escolha UMA oferta: SEO, Ads, Web Design, ou Copy.", tools: ["Docs"], timeline: "2 dias" }, { order: 2, title: "Portfolio inicial", description: "Faca 2-3 projetos gratis para case studies.", tools: ["Sites"], timeline: "14 dias" }, { order: 3, title: "Prospecao LinkedIn", description: "Conecte com 50 prospects/dia. Voice messages.", tools: ["CRM"], timeline: "Continuo" }, { order: 4, title: "Conteudo de Autoridade", description: "Poste 1x/dia no LinkedIn com insights.", tools: ["AI Studio"], timeline: "Continuo" }, { order: 5, title: "Sistema de Vendas", description: "Call script, proposal, follow-up de 7 toques.", tools: ["Funnels"], timeline: "3 dias" }] },
  { name: "InfoProduto $20K lancamento", category: "course" as const, description: "Crie um curso ou ebook e lance com marketing de conteudo puro. Sem anuncios.", strategy: "Construa audiencia com conteudo > Crie info-produto > Lance com scarcity > Escale com evergreen funnel.", expectedRevenue: "$5.000 - $50.000/lancamento", difficulty: "intermediate" as const, steps: [{ order: 1, title: "Escolha o topico", description: "Onde voce tem resultado que outros pagariam para aprender.", tools: ["Research"], timeline: "3 dias" }, { order: 2, title: "Audiencia (30 dias)", description: "Poste conteudo diario. Crie lead magnet gratis.", tools: ["AI Studio"], timeline: "30 dias" }, { order: 3, title: "Crie o produto", description: "Grave videos com celular. Use AI para materiais.", tools: ["AI Studio"], timeline: "14 dias" }, { order: 4, title: "Funil de Lancamento", description: "Waitlist > Cart open > Webinar > Close com bonus.", tools: ["Funnels"], timeline: "7 dias" }, { order: 5, title: "Lancamento", description: "Contagem regressiva, bonus limitado, social proof.", tools: ["Communities"], timeline: "7 dias" }] },
  { name: "Afiliados High-Ticket $10K/mes", category: "affiliate" as const, description: "Promova produtos high-ticket como afiliado usando SEO e conteudo review.", strategy: "Encontre produtos que pagam $500-2000/comissao. Crie conteudo de comparacao e review. Escalone com SEO.", expectedRevenue: "$5.000 - $20.000/mes", difficulty: "beginner" as const, steps: [{ order: 1, title: "Pesquise programas", description: "Produtos SaaS, cursos que pagam 30-50% comissao.", tools: ["Research"], timeline: "3 dias" }, { order: 2, title: "Site de reviews", description: "Reviews honestos e comparativos detalhados.", tools: ["Sites", "AI Studio"], timeline: "7 dias" }, { order: 3, title: "SEO de Reviews", description: "Target 'vs', 'alternativas', 'melhor' keywords.", tools: ["AI Studio"], timeline: "30 dias" }, { order: 4, title: "Capture emails", description: "Lead magnet > 7 emails educativos > CTA afiliado.", tools: ["Funnels"], timeline: "7 dias" }, { order: 5, title: "Escala", description: "Adicione mais produtos. YouTube reviews.", tools: ["Communities"], timeline: "Continuo" }] },
  { name: "Comunidade Paga $30K/mes", category: "community" as const, description: "Crie uma comunidade paga em torno de um nicho. Receita recorrente mensal.", strategy: "Audiencia gratuita > Comunidade gratis > Comunidade paga com acesso exclusivo.", expectedRevenue: "$10.000 - $50.000/mes", difficulty: "advanced" as const, steps: [{ order: 1, title: "Niche down", description: "Nao seja 'marketing'. Seja 'SEO para dentistas'.", tools: ["Research"], timeline: "2 dias" }, { order: 2, title: "Conteudo magnetico", description: "30 dias de conteudo GRATIS. Email list de 1.000+.", tools: ["AI Studio"], timeline: "60 dias" }, { order: 3, title: "Comunidade gratis", description: "WhatsApp/Discord. De valor por 30 dias.", tools: ["Communities"], timeline: "30 dias" }, { order: 4, title: "Upgrade pago", description: "$49-297/mes. Calls, templates, network.", tools: ["Funnels"], timeline: "7 dias" }, { order: 5, title: "Retencao", description: "Gamificacao, leaderboard. Meta: <5% churn.", tools: ["Communities"], timeline: "Continuo" }] },
  { name: "Arbitragem de Servicos $15K/mes", category: "freelance" as const, description: "Venda servicos caros, delegue por menos. Lucro na margem.", strategy: "Prospec clientes de alto valor > Venda premium > Delegue para freelancers > Fique com a diferenca.", expectedRevenue: "$10.000 - $25.000/mes", difficulty: "intermediate" as const, steps: [{ order: 1, title: "Escolha o servico", description: "Web design ($3K+), SEO ($2K+/mes), Ads.", tools: ["Research"], timeline: "2 dias" }, { order: 2, title: "Monte seu time", description: "3-5 freelancers qualificados. Pague 30-40%.", tools: ["CRM"], timeline: "7 dias" }, { order: 3, title: "Prospec clientes USA/EU", description: "Upwork, LinkedIn, cold email. Cobre em USD.", tools: ["CRM"], timeline: "Continuo" }, { order: 4, title: "Sistema de entrega", description: "Gerencie projetos. Automatize onboarding.", tools: ["Projects"], timeline: "7 dias" }, { order: 5, title: "Escala", description: "Documente resultados. Aumente precos.", tools: ["Docs"], timeline: "Continuo" }] },
];

export default function Templates() {
  const utils = trpc.useUtils();
  const { data: templates, isLoading } = trpc.template.list.useQuery();
  const createT = trpc.template.create.useMutation({ onSuccess: () => utils.template.list.invalidate() });
  const useT = trpc.template.use.useMutation({ onSuccess: () => utils.template.list.invalidate() });
  const deleteT = trpc.template.delete.useMutation({ onSuccess: () => utils.template.list.invalidate() });
  const [active, setActive] = useState<any>(null);
  const [seeded, setSeeded] = useState(false);

  if (!seeded && templates?.length === 0 && !isLoading) { setSeeded(true); preloaded.forEach(t => createT.mutate(t)); }
  const allT = templates && templates.length > 0 ? templates : [];

  return (
    <div className="p-4 lg:p-6 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2"><Rocket className="w-6 h-6" style={{ color: ac }} /><div><h1 className="text-xl lg:text-2xl font-bold tracking-tight" style={{ color: txt }}>Monetizacao</h1><p className="text-sm mt-0.5" style={{ color: tm }}>Templates prontos para $10K/dia organico</p></div></div>
        <Badge className="text-xs px-3 py-1" style={{ background: `${ac}15`, color: ac }}><DollarSign className="w-3 h-3 mr-1" /> Organico - Sem Ads</Badge>
      </div>
      <div className="grid grid-cols-3 gap-3">
        <Card className="border" style={{ background: bg, borderColor: borderC }}><CardContent className="p-3 text-center"><p className="text-xl font-bold" style={{ color: ac }}>{allT.length}</p><p className="text-[10px] uppercase" style={{ color: tm }}>Modelos</p></CardContent></Card>
        <Card className="border" style={{ background: bg, borderColor: borderC }}><CardContent className="p-3 text-center"><p className="text-xl font-bold" style={{ color: '#3b82f6' }}>{allT.reduce((s, t) => s + (t.used || 0), 0)}</p><p className="text-[10px] uppercase" style={{ color: tm }}>Usados</p></CardContent></Card>
        <Card className="border" style={{ background: bg, borderColor: borderC }}><CardContent className="p-3 text-center"><p className="text-xl font-bold" style={{ color: '#f59e0b' }}>$10K+</p><p className="text-[10px] uppercase" style={{ color: tm }}>Meta/Dia</p></CardContent></Card>
      </div>
      {isLoading ? <div className="grid grid-cols-1 md:grid-cols-2 gap-3">{[...Array(4)].map((_,i) => <div key={i} className="h-36 rounded-xl animate-pulse" style={{ background: bg }} />)}</div> :
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {allT.map(t => { const cat = catC[t.category] || catC.saas; const CatIcon = cat.icon; return (
            <Card key={t.id} className="border transition-all cursor-pointer group" style={{ background: bg, borderColor: borderC }} onClick={() => setActive(t)}>
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${cat.color}15` }}><CatIcon className="w-5 h-5" style={{ color: cat.color }} /></div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold" style={{ color: txt }}>{t.name}</h3>
                    <p className="text-xs mt-1 line-clamp-2" style={{ color: tsec }}>{t.description}</p>
                    <div className="flex items-center gap-2 mt-2 flex-wrap">
                      <Badge className="text-[9px]" style={{ background: `${cat.color}15`, color: cat.color }}>{cat.label}</Badge>
                      <Badge className="text-[9px]" style={{ background: `${difC[t.difficulty]}15`, color: difC[t.difficulty] }}>{t.difficulty}</Badge>
                      <span className="text-[10px] font-medium" style={{ color: ac }}>{t.expectedRevenue}</span>
                      {t.used ? <span className="text-[10px]" style={{ color: tm }}>{t.used}x usado</span> : null}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ); })}
        </div>}
      {active && <Dialog open={!!active} onOpenChange={() => setActive(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto border" style={{ background: bg, borderColor: borderC }}>
          <DialogHeader>
            <div className="flex items-center gap-3">
              {(() => { const cat = catC[active.category] || catC.saas; const CI = cat.icon; return <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${cat.color}15` }}><CI className="w-5 h-5" style={{ color: cat.color }} /></div>; })()}
              <div><DialogTitle className="text-lg" style={{ color: txt }}>{active.name}</DialogTitle>
                <div className="flex items-center gap-2 mt-1"><Badge className="text-[9px]" style={{ background: `${ac}15`, color: ac }}>{active.expectedRevenue}</Badge><Badge className="text-[9px]" style={{ background: `${difC[active.difficulty]}15`, color: difC[active.difficulty] }}>{active.difficulty}</Badge></div>
              </div>
            </div>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm leading-relaxed" style={{ color: tsec }}>{active.description}</p>
            <div className="rounded-lg p-3 border" style={{ background: elevBg, borderColor: borderC }}>
              <h4 className="text-xs font-semibold uppercase tracking-wider mb-2 flex items-center gap-1" style={{ color: txt }}><Target className="w-3 h-3" style={{ color: ac }} /> Estrategia</h4>
              <p className="text-xs leading-relaxed" style={{ color: tsec }}>{active.strategy}</p>
            </div>
            <div><h4 className="text-xs font-semibold uppercase tracking-wider mb-3 flex items-center gap-1" style={{ color: txt }}><Zap className="w-3 h-3" style={{ color: '#f59e0b' }} /> Passo a Passo</h4>
              <div className="space-y-2">{(active.steps as any[])?.map((step: any, i: number) => (
                <div key={i} className="flex gap-3 p-3 rounded-lg border" style={{ background: `${elevBg}80`, borderColor: borderC }}>
                  <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5" style={{ background: `${ac}15` }}><span className="text-[10px] font-bold" style={{ color: ac }}>{step.order}</span></div>
                  <div className="flex-1 min-w-0"><h5 className="text-xs font-medium" style={{ color: txt }}>{step.title}</h5><p className="text-[11px] mt-0.5" style={{ color: tm }}>{step.description}</p><div className="flex flex-wrap gap-1 mt-1.5">{step.tools?.map((tool: string) => <Badge key={tool} className="text-[8px] px-1" style={{ background: elevBg, color: tm }}>{tool}</Badge>)}<Badge className="text-[8px] px-1 flex items-center gap-0.5" style={{ background: elevBg, color: tm }}><Clock className="w-2 h-2" />{step.timeline}</Badge></div></div>
                </div>
              ))}</div>
            </div>
            <Button className="w-full font-bold" style={{ background: ac, color: '#000' }} onClick={() => { useT.mutate({ id: active.id }); setActive(null); }}><CheckCircle2 className="w-4 h-4 mr-1" /> Usar Este Modelo</Button>
          </div>
        </DialogContent>
      </Dialog>}
    </div>
  );
}
