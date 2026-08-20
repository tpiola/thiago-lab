import { useState } from "react";
import { trpc } from "@/providers/trpc";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "react-router";
import { TrendingUp, Users, DollarSign, Target, FolderKanban, BookOpen, Workflow, Sparkles, Rocket, CheckCircle2, BarChart3, Globe, Zap, Activity, Bot, Database, Brain } from "lucide-react";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const COLORS = ["#00ff88", "#3b82f6", "#8b5cf6", "#f59e0b", "#f97316", "#ef4444"];
const weekData = [
  { day: "Seg", receita: 8200, leads: 45 }, { day: "Ter", receita: 11500, leads: 67 },
  { day: "Qua", receita: 9800, leads: 52 }, { day: "Qui", receita: 15200, leads: 89 },
  { day: "Sex", receita: 13400, leads: 74 }, { day: "Sab", receita: 7600, leads: 38 },
  { day: "Dom", receita: 10100, leads: 55 },
];
const modules = [
  { path: "/projetos", label: "Projetos", icon: FolderKanban, color: "#00ff88", desc: "Gestao de projetos" },
  { path: "/docs", label: "Docs & Wiki", icon: BookOpen, color: "#3b82f6", desc: "Base de conhecimento" },
  { path: "/automacoes", label: "Automacoes", icon: Workflow, color: "#8b5cf6", desc: "Workflows inteligentes" },
  { path: "/crm", label: "CRM", icon: Users, color: "#f59e0b", desc: "Gestao de leads" },
  { path: "/pipeline", label: "Pipeline", icon: Target, color: "#f97316", desc: "Oportunidades" },
  { path: "/templates", label: "Monetizacao", icon: Rocket, color: "#00d4ff", desc: "Templates $10K/dia" },
  { path: "/ia", label: "AI Studio", icon: Sparkles, color: "#ec4899", desc: "Geracao com IA" },
  { path: "/notion", label: "Notion", icon: Database, color: "#ffffff", desc: "Base de conhecimento" },
];
const tabs = ["Visao Geral", "Analytics", "Hermes OS", "Pipeline"];

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState(0);
  const { data: dealStats, isLoading: dl } = trpc.deal.stats.useQuery();
  const { data: ps } = trpc.project.stats.useQuery();
  const { data: cs } = trpc.contact.list.useQuery();
  const { data: ts } = trpc.task.list.useQuery();
  const { data: au } = trpc.automation.list.useQuery();
  const { data: tm } = trpc.template.list.useQuery();
  const pipelineData = dealStats?.byStage ? Object.entries(dealStats.byStage).map(([name, v]) => ({ name, count: (v as any).count, value: (v as any).value })) : [];
  const pieData = pipelineData.map((s) => ({ name: s.name, value: s.count }));
  const sc: Record<string, string> = { new: "#00ff88", qualified: "#3b82f6", proposal: "#8b5cf6", negotiation: "#f59e0b", closed_won: "#00ff88", closed_lost: "#ef4444" };
  const kpis = [
    { label: "Receita", value: dealStats ? `R$ ${((dealStats.won || 0) / 100).toLocaleString()}` : "R$ 0", icon: DollarSign, color: "#00ff88", change: "+23%", up: true, loading: dl },
    { label: "Pipeline", value: dealStats ? `R$ ${((dealStats.pipeline || 0) / 100).toLocaleString()}` : "R$ 0", icon: BarChart3, color: "#3b82f6", change: "+12%", up: true, loading: dl },
    { label: "Contatos", value: `${cs?.length || 0}`, icon: Users, color: "#8b5cf6", change: "+8%", up: true, loading: !cs },
    { label: "Conversao", value: dealStats ? `${dealStats.winRate}%` : "0%", icon: TrendingUp, color: "#f59e0b", change: "+0.5pp", up: true, loading: dl },
    { label: "Projetos", value: `${ps?.active || 0}/${ps?.total || 0}`, icon: FolderKanban, color: "#f97316", change: "+3", up: true, loading: !ps },
    { label: "Tarefas", value: `${ts?.filter((t) => t.status === "done").length || 0}/${ts?.length || 0}`, icon: CheckCircle2, color: "#00d4ff", change: "done", up: true, loading: !ts },
  ];
  const bg = 'var(--bg-secondary)'; const borderC = 'var(--border)'; const txt = 'var(--text)'; const tm2 = 'var(--text-muted)'; const ac = 'var(--accent)';
  return (
    <div className="p-4 lg:p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div><h1 className="text-xl lg:text-2xl font-bold tracking-tight" style={{ color: txt }}>Dashboard</h1><p className="text-sm mt-0.5" style={{ color: tm2 }}>Visao geral da sua operacao — Hermes OS</p></div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium" style={{ background: '#00ff8815', border: '1px solid #00ff8830', color: '#00ff88' }}><div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />Hermes Online</div>
      </div>
      <div className="flex gap-1 p-1 rounded-xl" style={{ background: bg, border: `1px solid ${borderC}` }}>
        {tabs.map((tab, i) => (
          <button key={tab} onClick={() => setActiveTab(i)} className="flex-1 py-2 px-3 rounded-lg text-xs font-medium transition-all" style={activeTab === i ? { background: ac, color: '#000' } : { color: tm2 }}>{tab}</button>
        ))}
      </div>
      {activeTab === 0 && (<>
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
          {kpis.map((k) => (
            <Card key={k.label} className="border" style={{ background: bg, borderColor: borderC }}>
              <CardContent className="p-3">
                <div className="flex items-start justify-between mb-2">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: `${k.color}15` }}><k.icon className="w-3.5 h-3.5" style={{ color: k.color }} /></div>
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full" style={{ background: '#00ff8815', color: '#00ff88' }}>↑{k.change}</span>
                </div>
                {k.loading ? <Skeleton className="h-5 w-16" style={{ background: 'var(--bg-card)' }} /> : <p className="text-base font-bold" style={{ color: txt }}>{k.value}</p>}
                <p className="text-[10px] uppercase tracking-wider mt-0.5" style={{ color: tm2 }}>{k.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card className="border" style={{ background: bg, borderColor: borderC }}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3"><p className="text-xs font-semibold" style={{ color: txt }}>Receita — 7 Dias</p><span className="text-lg font-bold" style={{ color: ac }}>R$ 75.8k</span></div>
              <div className="h-[180px]"><ResponsiveContainer width="100%" height="100%"><AreaChart data={weekData}><defs><linearGradient id="colorR" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#00ff88" stopOpacity={0.3}/><stop offset="95%" stopColor="#00ff88" stopOpacity={0}/></linearGradient></defs><CartesianGrid strokeDasharray="3 3" stroke="rgba(128,128,128,0.1)"/><XAxis dataKey="day" stroke="var(--text-muted)" fontSize={10}/><YAxis stroke="var(--text-muted)" fontSize={10} tickFormatter={(v) => `R$${(v/1000).toFixed(0)}k`}/><Tooltip contentStyle={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 11, color: 'var(--text)' }}/><Area type="monotone" dataKey="receita" stroke="#00ff88" strokeWidth={2} fill="url(#colorR)"/></AreaChart></ResponsiveContainer></div>
            </CardContent>
          </Card>
          <Card className="border" style={{ background: bg, borderColor: borderC }}>
            <CardContent className="p-4">
              <p className="text-xs font-semibold mb-3" style={{ color: txt }}>Pipeline por Estagio</p>
              <div className="h-[180px]"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={pieData.length ? pieData : [{ name: 'Vazio', value: 1 }]} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" stroke="none">{(pieData.length ? pieData : [{ name: 'Vazio', value: 1 }]).map((_, i) => (<Cell key={i} fill={sc[_.name] || COLORS[i % COLORS.length]}/>))}</Pie><Tooltip contentStyle={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 11 }}/></PieChart></ResponsiveContainer></div>
            </CardContent>
          </Card>
        </div>
        <div><p className="text-[10px] uppercase tracking-wider font-semibold mb-3" style={{ color: tm2 }}>Modulos</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">{modules.map((m) => (<Link key={m.path} to={m.path}><Card className="border transition-all hover:opacity-80" style={{ background: bg, borderColor: borderC }}><CardContent className="p-3 flex items-center gap-3"><div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ background: `${m.color}15` }}><m.icon className="w-4 h-4" style={{ color: m.color }}/></div><div className="min-w-0"><p className="text-xs font-medium" style={{ color: txt }}>{m.label}</p><p className="text-[9px]" style={{ color: tm2 }}>{m.desc}</p></div></CardContent></Card></Link>))}</div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card className="border" style={{ background: bg, borderColor: borderC }}><CardContent className="p-4"><p className="text-xs font-semibold mb-3 flex items-center gap-1" style={{ color: txt }}><Workflow className="w-3.5 h-3.5" style={{ color: '#8b5cf6' }}/> Automacoes Ativas</p>{au?.filter(a => a.status === "active").length ? au.filter(a => a.status === "active").slice(0, 4).map(a => (<div key={a.id} className="flex justify-between p-2 rounded-lg mb-1" style={{ background: 'var(--bg-card)' }}><span className="text-xs truncate" style={{ color: txt }}>{a.name}</span><span className="text-[10px]" style={{ color: ac }}>{a.runCount || 0} runs</span></div>)) : <p className="text-xs text-center py-4" style={{ color: tm2 }}>Nenhuma automacao ativa</p>}</CardContent></Card>
          <Card className="border" style={{ background: bg, borderColor: borderC }}><CardContent className="p-4"><p className="text-xs font-semibold mb-3 flex items-center gap-1" style={{ color: txt }}><Rocket className="w-3.5 h-3.5" style={{ color: '#00d4ff' }}/> Templates de Monetizacao</p>{tm?.length ? tm.slice(0, 4).map(t => (<div key={t.id} className="flex justify-between p-2 rounded-lg mb-1" style={{ background: 'var(--bg-card)' }}><span className="text-xs truncate" style={{ color: txt }}>{t.name}</span><span className="text-[10px]" style={{ color: '#00d4ff' }}>{t.used || 0}x</span></div>)) : <p className="text-xs text-center py-4" style={{ color: tm2 }}>Carregando templates...</p>}</CardContent></Card>
        </div>
      </>)}
      {activeTab === 1 && (<>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[{ label: "Receita Semanal", value: "R$ 75.8k", sub: "Ultimos 7 dias", change: "+23%" },{ label: "Leads Novos", value: "847", sub: "Este mes", change: "+12%" },{ label: "Vendas Fechadas", value: "89", sub: "Conversoes", change: "+8%" },{ label: "Taxa de Conversao", value: "4.8%", sub: "Meta: 5%", change: "+0.5pp" }].map(k => (
            <Card key={k.label} className="border" style={{ background: bg, borderColor: borderC }}><CardContent className="p-4"><div className="flex justify-between"><div><p className="text-xs" style={{ color: tm2 }}>{k.label}</p><p className="text-2xl font-bold mt-1" style={{ color: txt }}>{k.value}</p><p className="text-xs mt-1" style={{ color: tm2 }}>{k.sub}</p></div><span className="text-xs px-2 py-1 rounded-full h-fit" style={{ background: '#00ff8815', color: '#00ff88' }}>{k.change}</span></div></CardContent></Card>
          ))}
        </div>
        <Card className="border" style={{ background: bg, borderColor: borderC }}><CardContent className="p-4"><p className="text-xs font-semibold mb-4" style={{ color: txt }}>Receita vs Leads</p><div className="h-[250px]"><ResponsiveContainer width="100%" height="100%"><BarChart data={weekData}><CartesianGrid strokeDasharray="3 3" stroke="rgba(128,128,128,0.08)"/><XAxis dataKey="day" stroke="var(--text-muted)" fontSize={11}/><YAxis yAxisId="left" orientation="left" stroke="var(--text-muted)" fontSize={11} tickFormatter={(v) => `R$${(v/1000).toFixed(0)}k`}/><YAxis yAxisId="right" orientation="right" stroke="var(--text-muted)" fontSize={11}/><Tooltip contentStyle={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 11 }}/><Bar yAxisId="left" dataKey="receita" fill="#00ff88" opacity={0.8} radius={[4,4,0,0]}/><Bar yAxisId="right" dataKey="leads" fill="#3b82f6" opacity={0.8} radius={[4,4,0,0]}/></BarChart></ResponsiveContainer></div></CardContent></Card>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card className="border" style={{ background: bg, borderColor: borderC }}><CardContent className="p-4"><p className="text-xs font-semibold mb-3" style={{ color: txt }}>Sites — 8/8 Online</p>{["thiagopiola","reidasvendas","saudegot","thiagolab","sentinela","valdecikeeus","terapeuta","chuteiras"].map(site => (<div key={site} className="flex items-center justify-between py-1.5 border-b last:border-0" style={{ borderColor: borderC }}><div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-green-400"/><span className="text-xs" style={{ color: txt }}>{site}</span></div><span className="text-[10px]" style={{ color: ac }}>Online</span></div>))}</CardContent></Card>
          <Card className="border" style={{ background: bg, borderColor: borderC }}><CardContent className="p-4"><p className="text-xs font-semibold mb-3" style={{ color: txt }}>Performance por Canal</p>{[{ canal: "Telegram", msgs: 2371, color: "#3b82f6" },{ canal: "WhatsApp", msgs: 847, color: "#00ff88" },{ canal: "CLI", msgs: 156, color: "#8b5cf6" },{ canal: "Cron Jobs", msgs: 89, color: "#f59e0b" }].map(c => (<div key={c.canal} className="flex items-center gap-3 mb-3"><span className="text-xs w-20" style={{ color: tm2 }}>{c.canal}</span><div className="flex-1 h-2 rounded-full" style={{ background: 'var(--bg-card)' }}><div className="h-2 rounded-full" style={{ width: `${Math.min((c.msgs/2371)*100,100)}%`, background: c.color }}/></div><span className="text-xs w-12 text-right font-medium" style={{ color: txt }}>{c.msgs.toLocaleString()}</span></div>))}</CardContent></Card>
        </div>
      </>)}
      {activeTab === 2 && (<>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[{ label: "Sessoes Ativas", value: "2,949", icon: Bot, color: "#00ff88" },{ label: "Mensagens", value: "51,367", icon: Activity, color: "#3b82f6" },{ label: "Cron Jobs", value: "2,371", icon: Zap, color: "#8b5cf6" },{ label: "IA Tokens/dia", value: "∞", icon: Brain, color: "#f59e0b" }].map(k => (
            <Card key={k.label} className="border" style={{ background: bg, borderColor: borderC }}><CardContent className="p-4"><div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ background: `${k.color}15` }}><k.icon className="w-5 h-5" style={{ color: k.color }}/></div><p className="text-2xl font-bold" style={{ color: txt }}>{k.value}</p><p className="text-xs mt-1" style={{ color: tm2 }}>{k.label}</p></CardContent></Card>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card className="border" style={{ background: bg, borderColor: borderC }}><CardContent className="p-4"><p className="text-xs font-semibold mb-3" style={{ color: txt }}>Plataformas Conectadas</p>{[{ name: "Telegram", status: "Conectado", color: "#00ff88" },{ name: "WhatsApp", status: "Desconectado", color: "#ef4444" },{ name: "Notion", status: "Integrado", color: "#00ff88" },{ name: "n8n", status: "Ativo", color: "#00ff88" },{ name: "DeepSeek V4 Pro", status: "Online", color: "#00ff88" }].map(p => (<div key={p.name} className="flex items-center justify-between py-2.5 border-b last:border-0" style={{ borderColor: borderC }}><div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full" style={{ background: p.color }}/><span className="text-sm" style={{ color: txt }}>{p.name}</span></div><span className="text-xs px-2 py-0.5 rounded-full" style={{ background: `${p.color}15`, color: p.color }}>{p.status}</span></div>))}</CardContent></Card>
          <Card className="border" style={{ background: bg, borderColor: borderC }}><CardContent className="p-4"><p className="text-xs font-semibold mb-3" style={{ color: txt }}>Capacidades do Agente Hermes</p>{["Gerenciamento completo de CRM e leads","Automacoes via n8n + webhooks","Pesquisa inteligente multi-fonte","Geracao de conteudo com IA","Gestao de projetos e tarefas","Pipeline de vendas visual","Integracao Notion como base de dados","Templates de monetizacao","Sites e funis de vendas","Campanhas e email marketing","Agenda e agendamentos","Cursos e comunidades"].map((cap, i) => (<div key={i} className="flex items-center gap-2 py-1.5"><CheckCircle2 className="w-3.5 h-3.5 shrink-0" style={{ color: ac }}/><span className="text-xs" style={{ color: 'var(--text-secondary)' }}>{cap}</span></div>))}</CardContent></Card>
        </div>
      </>)}
      {activeTab === 3 && (<>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[{ label: "Oportunidades", value: dealStats?.total || 0, color: ac },{ label: "Ganhos", value: dealStats?.wonCount || 0, color: "#00ff88" },{ label: "Win Rate", value: `${dealStats?.winRate || 0}%`, color: "#3b82f6" },{ label: "Valor Total", value: dealStats ? `R$ ${((dealStats.pipeline||0)/100).toLocaleString()}` : "R$ 0", color: "#f59e0b" }].map(k => (
            <Card key={k.label} className="border" style={{ background: bg, borderColor: borderC }}><CardContent className="p-3 text-center"><p className="text-2xl font-bold" style={{ color: k.color }}>{k.value}</p><p className="text-[10px] uppercase tracking-wider mt-1" style={{ color: tm2 }}>{k.label}</p></CardContent></Card>
          ))}
        </div>
        <Card className="border" style={{ background: bg, borderColor: borderC }}><CardContent className="p-4"><p className="text-xs font-semibold mb-4" style={{ color: txt }}>Pipeline por Estagio</p><div className="h-[200px]"><ResponsiveContainer width="100%" height="100%"><BarChart data={pipelineData.length ? pipelineData : [{ name: 'Sem dados', value: 0, count: 0 }]}><CartesianGrid strokeDasharray="3 3" stroke="rgba(128,128,128,0.1)"/><XAxis dataKey="name" stroke="var(--text-muted)" fontSize={10} tickFormatter={(v) => v.slice(0,8)}/><YAxis stroke="var(--text-muted)" fontSize={10}/><Tooltip contentStyle={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 11 }}/><Bar dataKey="value" radius={[4,4,0,0]}>{pipelineData.map((s, i) => (<Cell key={i} fill={sc[s.name] || COLORS[i % COLORS.length]}/>))}</Bar></BarChart></ResponsiveContainer></div></CardContent></Card>
      </>)}
    </div>
  );
    }
