import { trpc } from "@/providers/trpc";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "react-router";
import {
  TrendingUp, Users, DollarSign, Target, FolderKanban,
  BookOpen, Workflow, Sparkles, Rocket, CheckCircle2,
  BarChart3, Globe
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const COLORS = ["#00ff88", "#3b82f6", "#8b5cf6", "#f59e0b", "#f97316", "#ef4444"];

const modules = [
  { path: "/projetos", label: "Projetos", icon: FolderKanban, color: "#00ff88", desc: "Gestao de projetos" },
  { path: "/docs", label: "Docs & Wiki", icon: BookOpen, color: "#3b82f6", desc: "Base de conhecimento" },
  { path: "/automacoes", label: "Automacoes", icon: Workflow, color: "#8b5cf6", desc: "Workflows inteligentes" },
  { path: "/crm", label: "CRM", icon: Users, color: "#f59e0b", desc: "Gestao de leads" },
  { path: "/pipeline", label: "Pipeline", icon: Target, color: "#f97316", desc: "Oportunidades" },
  { path: "/templates", label: "Monetizacao", icon: Rocket, color: "#00d4ff", desc: "$10K/day templates" },
  { path: "/ia", label: "AI Studio", icon: Sparkles, color: "#ec4899", desc: "Geracao com IA" },
  { path: "/sites", label: "Sites", icon: Globe, color: "#22c55e", desc: "Landing pages" },
];

export default function Dashboard() {
  const { data: dealStats, isLoading: dl } = trpc.deal.stats.useQuery();
  const { data: ps } = trpc.project.stats.useQuery();
  const { data: cs } = trpc.contact.list.useQuery();
  const { data: ts } = trpc.task.list.useQuery();
  const { data: au } = trpc.automation.list.useQuery();
  const { data: tm } = trpc.template.list.useQuery();

  const pipelineData = dealStats?.byStage ? Object.entries(dealStats.byStage).map(([name, v]) => ({ name, count: v.count, value: v.value })) : [];
  const pieData = pipelineData.map((s) => ({ name: s.name, value: s.count }));
  const sc: Record<string, string> = { new: "#00ff88", qualified: "#3b82f6", proposal: "#8b5cf6", negotiation: "#f59e0b", closed_won: "#00ff88", closed_lost: "#ef4444" };

  const kpis = [
    { label: "Receita", value: dealStats ? `R$ ${((dealStats.won || 0) / 100).toLocaleString()}` : "R$ 0", icon: DollarSign, color: "#00ff88", loading: dl },
    { label: "Pipeline", value: dealStats ? `R$ ${((dealStats.pipeline || 0) / 100).toLocaleString()}` : "R$ 0", icon: BarChart3, color: "#3b82f6", loading: dl },
    { label: "Contatos", value: `${cs?.length || 0}`, icon: Users, color: "#8b5cf6", loading: !cs },
    { label: "Taxa Conv.", value: dealStats ? `${dealStats.winRate}%` : "0%", icon: TrendingUp, color: "#f59e0b", loading: dl },
    { label: "Projetos", value: `${ps?.active || 0}/${ps?.total || 0}`, icon: FolderKanban, color: "#f97316", loading: !ps },
    { label: "Tarefas", value: `${(ts?.filter((t) => t.status === "done").length || 0)}/${ts?.length || 0}`, icon: CheckCircle2, color: "#00d4ff", loading: !ts },
  ];

  return (
    <div className="p-4 lg:p-6 space-y-6">
      <div>
        <h1 className="text-xl lg:text-2xl font-bold tracking-tight" style={{ color: 'var(--text)' }}>Dashboard</h1>
        <p className="text-sm mt-0.5" style={{ color: 'var(--text-muted)' }}>Visao geral da sua operacao</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
        {kpis.map((k) => (
          <Card key={k.label} className="border" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)' }}>
            <CardContent className="p-3">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center mb-2" style={{ background: `${k.color}15` }}>
                <kpi.icon className="w-3.5 h-3.5" style={{ color: k.color }} />
              </div>
              {k.loading ? <Skeleton className="h-5 w-16" style={{ background: 'var(--bg-card)' }} /> : <p className="text-base font-bold" style={{ color: 'var(--text)' }}>{k.value}</p>}
              <p className="text-[10px] uppercase tracking-wider mt-0.5" style={{ color: 'var(--text-muted)' }}>{k.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="border" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)' }}>
          <CardContent className="p-4">
            <p className="text-xs font-semibold mb-3" style={{ color: 'var(--text)' }}>Pipeline por Estagio</p>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={pipelineData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(128,128,128,0.1)" />
                  <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={10} tickFormatter={(v) => v.slice(0, 6)} />
                  <YAxis stroke="var(--text-muted)" fontSize={10} />
                  <Tooltip contentStyle={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 11, color: 'var(--text)' }} />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]}>{pipelineData.map((s, i) => <Cell key={i} fill={sc[s.name] || COLORS[i % COLORS.length]} />)}</Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        <Card className="border" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)' }}>
          <CardContent className="p-4">
            <p className="text-xs font-semibold mb-3" style={{ color: 'var(--text)' }}>Distribuicao de Deals</p>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" stroke="none">
                    {pieData.map((_, i) => <Cell key={i} fill={sc[_.name] || COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip contentStyle={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 11, color: 'var(--text)' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div>
        <p className="text-[10px] uppercase tracking-wider font-semibold mb-3" style={{ color: 'var(--text-muted)' }}>Modulos</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {modules.map((m) => (
            <Link key={m.path} to={m.path}>
              <Card className="border transition-all hover:opacity-80" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)' }}>
                <CardContent className="p-3 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ background: `${m.color}15` }}>
                    <m.icon className="w-4 h-4" style={{ color: m.color }} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-medium" style={{ color: 'var(--text)' }}>{m.label}</p>
                    <p className="text-[9px]" style={{ color: 'var(--text-muted)' }}>{m.desc}</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="border" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)' }}>
          <CardContent className="p-4">
            <p className="text-xs font-semibold mb-3 flex items-center gap-1" style={{ color: 'var(--text)' }}><Workflow className="w-3.5 h-3.5" style={{ color: '#8b5cf6' }} /> Automacoes Ativas</p>
            {au?.filter(a => a.status === "active").length ? au.filter(a => a.status === "active").slice(0, 4).map(a => (
              <div key={a.id} className="flex justify-between p-2 rounded-lg mb-1" style={{ background: 'var(--bg-card)' }}>
                <span className="text-xs truncate" style={{ color: 'var(--text)' }}>{a.name}</span>
                <span className="text-[10px]" style={{ color: 'var(--accent)' }}>{a.runCount || 0} runs</span>
              </div>
            )) : <p className="text-xs text-center py-4" style={{ color: 'var(--text-muted)' }}>Nenhuma automacao ativa</p>}
          </CardContent>
        </Card>
        <Card className="border" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)' }}>
          <CardContent className="p-4">
            <p className="text-xs font-semibold mb-3 flex items-center gap-1" style={{ color: 'var(--text)' }}><Rocket className="w-3.5 h-3.5" style={{ color: '#00d4ff' }} /> Templates de Monetizacao</p>
            {tm?.length ? tm.slice(0, 4).map(t => (
              <div key={t.id} className="flex justify-between p-2 rounded-lg mb-1" style={{ background: 'var(--bg-card)' }}>
                <span className="text-xs truncate" style={{ color: 'var(--text)' }}>{t.name}</span>
                <span className="text-[10px]" style={{ color: '#00d4ff' }}>{t.used || 0}x usado</span>
              </div>
            )) : <p className="text-xs text-center py-4" style={{ color: 'var(--text-muted)' }}>Carregando templates...</p>}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
