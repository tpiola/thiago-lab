import { useState } from "react";
import { trpc } from "@/providers/trpc";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FolderKanban, Plus, TrendingUp, CheckCircle2, DollarSign, PauseCircle, Archive, Target, Trash2 } from "lucide-react";

const stC: Record<string, { label: string; color: string }> = { planning: { label: "Planejamento", color: "#3b82f6" }, active: { label: "Ativo", color: "#00ff88" }, paused: { label: "Pausado", color: "#f59e0b" }, completed: { label: "Concluido", color: "#8b5cf6" }, archived: { label: "Arquivado", color: "#444" } };
const prC: Record<string, string> = { low: "#444", medium: "#3b82f6", high: "#f59e0b", urgent: "#ef4444" };
const bg = 'var(--bg-secondary)';
const borderC = 'var(--border)';
const txt = 'var(--text)';
const tm = 'var(--text-muted)';
const ac = 'var(--accent)';

export default function Projects() {
  const utils = trpc.useUtils();
  const { data: projects, isLoading } = trpc.project.list.useQuery();
  const { data: stats } = trpc.project.stats.useQuery();
  const createP = trpc.project.create.useMutation({ onSuccess: () => { utils.project.list.invalidate(); setOpen(false); resetForm(); } });
  const updateP = trpc.project.update.useMutation({ onSuccess: () => utils.project.list.invalidate() });
  const deleteP = trpc.project.delete.useMutation({ onSuccess: () => utils.project.list.invalidate() });
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", description: "", status: "planning" as const, priority: "medium" as const, color: "#00ff88", budget: "", startDate: "", endDate: "" });
  const resetForm = () => setForm({ name: "", description: "", status: "planning", priority: "medium", color: "#00ff88", budget: "", startDate: "", endDate: "" });

  const handleCreate = (e: React.FormEvent) => { e.preventDefault(); createP.mutate({ name: form.name, description: form.description || undefined, status: form.status, priority: form.priority, color: form.color, budget: form.budget ? Number(form.budget) * 100 : undefined, startDate: form.startDate || undefined, endDate: form.endDate || undefined }); };

  return (
    <div className="p-4 lg:p-6 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div><h1 className="text-xl lg:text-2xl font-bold tracking-tight" style={{ color: txt }}>Projetos</h1><p className="text-sm mt-0.5" style={{ color: tm }}>Gerencie projetos como no Notion</p></div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button className="font-semibold shrink-0 text-xs h-8" style={{ background: ac, color: '#000' }}><Plus className="w-3.5 h-3.5 mr-1" /> Novo Projeto</Button></DialogTrigger>
          <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto border" style={{ background: bg, borderColor: borderC }}>
            <DialogHeader><DialogTitle style={{ color: txt }}>Novo Projeto</DialogTitle></DialogHeader>
            <form onSubmit={handleCreate} className="space-y-3">
              <div><Label className="text-xs" style={{ color: tm }}>Nome *</Label><Input value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="mt-1 border" style={{ background: 'var(--bg-card)', borderColor, color: txt }} required /></div>
              <div><Label className="text-xs" style={{ color: tm }}>Descricao</Label><Textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="mt-1 border min-h-[60px]" style={{ background: 'var(--bg-card)', borderColor, color: txt }} /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label className="text-xs" style={{ color: tm }}>Status</Label>
                  <Select value={form.status} onValueChange={v => setForm({...form, status: v as any})}>
                    <SelectTrigger className="mt-1 border text-xs" style={{ background: 'var(--bg-card)', borderColor, color: txt }}><SelectValue /></SelectTrigger>
                    <SelectContent style={{ background: 'var(--bg-card)', borderColor }}>{Object.entries(stC).map(([k,v]) => <SelectItem key={k} value={k} className="text-xs" style={{ color: txt }}>{v.label}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div><Label className="text-xs" style={{ color: tm }}>Prioridade</Label>
                  <Select value={form.priority} onValueChange={v => setForm({...form, priority: v as any})}>
                    <SelectTrigger className="mt-1 border text-xs" style={{ background: 'var(--bg-card)', borderColor, color: txt }}><SelectValue /></SelectTrigger>
                    <SelectContent style={{ background: 'var(--bg-card)', borderColor }}>
                      <SelectItem value="low" className="text-xs" style={{ color: txt }}>Baixa</SelectItem>
                      <SelectItem value="medium" className="text-xs" style={{ color: txt }}>Media</SelectItem>
                      <SelectItem value="high" className="text-xs" style={{ color: txt }}>Alta</SelectItem>
                      <SelectItem value="urgent" className="text-xs" style={{ color: txt }}>Urgente</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label className="text-xs" style={{ color: tm }}>Orcamento (R$)</Label><Input type="number" value={form.budget} onChange={e => setForm({...form, budget: e.target.value})} className="mt-1 border" style={{ background: 'var(--bg-card)', borderColor, color: txt }} placeholder="0" /></div>
                <div><Label className="text-xs" style={{ color: tm }}>Cor</Label>
                  <div className="flex gap-2 mt-1.5">{["#00ff88", "#3b82f6", "#8b5cf6", "#f59e0b", "#ef4444", "#00d4ff"].map(c => <button key={c} type="button" onClick={() => setForm({...form, color: c })} className={`w-6 h-6 rounded-full transition-all ${form.color === c ? "ring-2 ring-white ring-offset-1 scale-110" : ""}`} style={{ background: c, ringOffsetColor: 'var(--bg-secondary)' }} />)}</div>
                </div>
              </div>
              <Button type="submit" className="w-full font-semibold" style={{ background: ac, color: '#000' }} disabled={createP.isPending}>{createP.isPending ? "Criando..." : "Criar Projeto"}</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[{ label: "Total", value: stats?.total || 0, icon: FolderKanban, color: ac }, { label: "Ativos", value: stats?.active || 0, icon: TrendingUp, color: "#3b82f6" }, { label: "Concluidos", value: stats?.completed || 0, icon: CheckCircle2, color: "#8b5cf6" }, { label: "Receita", value: stats ? `R$ ${((stats.totalRevenue || 0) / 100).toLocaleString()}` : "R$ 0", icon: DollarSign, color: "#f59e0b" }].map(s => (
          <Card key={s.label} className="border" style={{ background: bg, borderColor: borderC }}><CardContent className="p-3 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: `${s.color}15` }}><s.icon className="w-4 h-4" style={{ color: s.color }} /></div>
            <div><p className="text-lg font-semibold leading-tight" style={{ color: txt }}>{s.value}</p><p className="text-[10px] uppercase tracking-wider" style={{ color: tm }}>{s.label}</p></div>
          </CardContent></Card>
        ))}
      </div>

      {isLoading ? <div className="grid grid-cols-1 md:grid-cols-2 gap-3">{[...Array(4)].map((_,i) => <div key={i} className="h-36 rounded-xl animate-pulse" style={{ background: bg }} />)}</div> :
        projects?.length === 0 ? <Card className="border" style={{ background: bg, borderColor: borderC }}><CardContent className="py-12 text-center"><FolderKanban className="w-10 h-10 mx-auto mb-3" style={{ color: tm }} /><p style={{ color: 'var(--text-secondary)' }}>Nenhum projeto ainda</p></CardContent></Card> :
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {projects?.map(p => {
            const st = stC[p.status] || stC.planning;
            return (
              <Card key={p.id} className="border transition-all hover:opacity-90 group" style={{ background: bg, borderColor: borderC }}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 min-w-0 flex-1">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${p.color || ac}15` }}><FolderKanban className="w-5 h-5" style={{ color: p.color || ac }} /></div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-sm font-semibold truncate" style={{ color: txt }}>{p.name}</h3>
                          <Badge className="text-[10px]" style={{ background: `${st.color}15`, color: st.color }}>{st.label}</Badge>
                        </div>
                        <p className="text-xs mt-1 line-clamp-2" style={{ color: 'var(--text-secondary)' }}>{p.description || "Sem descricao"}</p>
                        <div className="flex flex-wrap gap-x-3 gap-y-1 mt-2 text-[11px]">
                          {p.budget ? <span className="flex items-center gap-1" style={{ color: '#f59e0b' }}><DollarSign className="w-3 h-3" />R$ {(p.budget / 100).toLocaleString()}</span> : null}
                          {p.revenue ? <span className="flex items-center gap-1" style={{ color: ac }}><TrendingUp className="w-3 h-3" />R$ {(p.revenue / 100).toLocaleString()}</span> : null}
                          <span style={{ color: prC[p.priority] || tm }}>Prioridade: {p.priority}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" size="icon" className="w-7 h-7" style={{ color: tm }} onClick={() => updateP.mutate({ id: p.id, status: p.status === "active" ? "completed" : "active" })}>{p.status === "active" ? <CheckCircle2 className="w-3.5 h-3.5" /> : <TrendingUp className="w-3.5 h-3.5" />}</Button>
                      <Button variant="ghost" size="icon" className="w-7 h-7 hover:text-red-400" style={{ color: tm }} onClick={() => { if (confirm('Excluir?')) deleteP.mutate({ id: p.id }); }}><Trash2 className="w-3.5 h-3.5" /></Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>}
    </div>
  );
}
