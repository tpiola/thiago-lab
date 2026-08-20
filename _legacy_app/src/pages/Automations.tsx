import { useState } from "react";
import { trpc } from "@/providers/trpc";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Plus, Workflow, Play, Pause, Trash2, Clock, Zap, Webhook, MousePointer, GitBranch } from "lucide-react";

const trI: Record<string, any> = { schedule: Clock, webhook: Webhook, manual: MousePointer, event: Zap };
const stC: Record<string, string> = { active: "#00ff88", paused: "#f59e0b", draft: "#444", error: "#ef4444" };
const nodeTypes = [
  { type: "trigger", label: "Gatilho", color: "#00ff88" }, { type: "delay", label: "Atraso", color: "#f59e0b" },
  { type: "email", label: "Email", color: "#3b82f6" }, { type: "webhook", label: "Webhook", color: "#8b5cf6" },
  { type: "condition", label: "Condicao", color: "#f97316" }, { type: "scrape", label: "Scraper", color: "#00d4ff" },
  { type: "ai", label: "AI Agent", color: "#ec4899" }, { type: "notify", label: "Notificar", color: "#22c55e" },
];

const bg = 'var(--bg-secondary)';
const borderC = 'var(--border)';
const elevBg = 'var(--bg-card)';
const txt = 'var(--text)';
const tm = 'var(--text-muted)';
const ac = 'var(--accent)';

export default function Automations() {
  const utils = trpc.useUtils();
  const { data: automations, isLoading } = trpc.automation.list.useQuery();
  const createA = trpc.automation.create.useMutation({ onSuccess: () => { utils.automation.list.invalidate(); setOpen(false); setForm({ name: "", description: "" }); } });
  const updateA = trpc.automation.update.useMutation({ onSuccess: () => utils.automation.list.invalidate() });
  const runA = trpc.automation.run.useMutation({ onSuccess: () => utils.automation.list.invalidate() });
  const deleteA = trpc.automation.delete.useMutation({ onSuccess: () => utils.automation.list.invalidate() });
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState<number | null>(null);
  const [form, setForm] = useState({ name: "", description: "" });

  const addNode = (autoId: number, type: string) => {
    const auto = automations?.find(a => a.id === autoId);
    const nodes = (auto?.nodes as any[]) || [];
    const nodeDef = nodeTypes.find(n => n.type === type);
    nodes.push({ id: `node_${Date.now()}`, type, label: nodeDef?.label || type, config: {} });
    updateA.mutate({ id: autoId, nodes });
  };

  return (
    <div className="p-4 lg:p-6 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div><h1 className="text-xl lg:text-2xl font-bold tracking-tight" style={{ color: txt }}>Automacoes</h1><p className="text-sm mt-0.5" style={{ color: tm }}>Workflows inteligentes estilo n8n</p></div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button className="font-semibold shrink-0 text-xs h-8" style={{ background: ac, color: '#000' }}><Plus className="w-3.5 h-3.5 mr-1" /> Nova Automacao</Button></DialogTrigger>
          <DialogContent className="max-w-md border" style={{ background: bg, borderColor: borderC }}>
            <DialogHeader><DialogTitle style={{ color: txt }}>Nova Automacao</DialogTitle></DialogHeader>
            <form onSubmit={e => { e.preventDefault(); createA.mutate({ name: form.name, description: form.description || undefined }); }} className="space-y-3">
              <div><Label className="text-xs" style={{ color: tm }}>Nome *</Label><Input value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="mt-1 border" style={{ background: elevBg, borderColor, color: txt }} required /></div>
              <div><Label className="text-xs" style={{ color: tm }}>Descricao</Label><Input value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="mt-1 border" style={{ background: elevBg, borderColor, color: txt }} /></div>
              <Button type="submit" className="w-full font-semibold" style={{ background: ac, color: '#000' }} disabled={createA.isPending}>{createA.isPending ? "Criando..." : "Criar"}</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      {isLoading ? <div className="space-y-3">{[...Array(3)].map((_,i) => <div key={i} className="h-24 rounded-xl animate-pulse" style={{ background: bg }} />)}</div> :
        automations?.length === 0 ? <Card className="border" style={{ background: bg, borderColor: borderC }}><CardContent className="py-12 text-center"><Workflow className="w-10 h-10 mx-auto mb-3" style={{ color: tm }} /><p style={{ color: 'var(--text-secondary)' }}>Nenhuma automacao ainda</p></CardContent></Card> :
        <div className="space-y-3">
          {automations?.map(auto => {
            const TriggerIcon = trI[(auto as any).trigger || "manual"] || MousePointer;
            const nodes = (auto.nodes as any[]) || [];
            return (
              <Card key={auto.id} className="border" style={{ background: bg, borderColor: borderC }}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 min-w-0 flex-1">
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" style={{ background: `${stC[auto.status]}15` }}><TriggerIcon className="w-4 h-4" style={{ color: stC[auto.status] }} /></div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-sm font-medium" style={{ color: txt }}>{auto.name}</h3>
                          <Badge className="text-[9px]" style={{ background: `${stC[auto.status]}15`, color: stC[auto.status] }}>{auto.status}</Badge>
                        </div>
                        <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>{auto.description || "Sem descricao"}</p>
                        <div className="flex items-center gap-3 mt-1.5 text-[10px]" style={{ color: tm }}>
                          <span className="flex items-center gap-0.5"><Workflow className="w-3 h-3" />{nodes.length} nodes</span>
                          <span className="flex items-center gap-0.5"><Clock className="w-3 h-3" />{auto.runCount || 0} runs</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <Button variant="ghost" size="icon" className="w-7 h-7" style={{ color: tm }} onClick={() => runA.mutate({ id: auto.id })}><Play className="w-3.5 h-3.5" /></Button>
                      <Button variant="ghost" size="icon" className="w-7 h-7" style={{ color: tm }} onClick={() => updateA.mutate({ id: auto.id, status: auto.status === "active" ? "paused" : "active" })}>{auto.status === "active" ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}</Button>
                      <Button variant="ghost" size="icon" className="w-7 h-7 hover:text-red-400" style={{ color: tm }} onClick={() => { if (confirm('Excluir?')) deleteA.mutate({ id: auto.id }); }}><Trash2 className="w-3.5 h-3.5" /></Button>
                    </div>
                  </div>
                  <button className="mt-3 text-[10px] flex items-center gap-1 transition-colors" style={{ color: tm }} onClick={() => setExpanded(expanded === auto.id ? null : auto.id)}><GitBranch className="w-3 h-3" /> {expanded === auto.id ? "Ocultar workflow" : "Editar workflow"}</button>
                  {expanded === auto.id && (
                    <div className="mt-3 pt-3 border-t" style={{ borderColor: borderC }}>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {nodeTypes.map(nt => <button key={nt.type} onClick={() => addNode(auto.id, nt.type)} className="flex items-center gap-1.5 px-2 py-1 rounded-md text-[10px] transition-all hover:opacity-80" style={{ background: `${nt.color}15`, color: nt.color, border: `1px solid ${nt.color}20` }}><Plus className="w-2.5 h-2.5" />{nt.label}</button>)}
                      </div>
                      {nodes.length > 0 ? <div className="flex flex-wrap gap-2">{nodes.map((node, i) => { const nt = nodeTypes.find(n => n.type === node.type); return <div key={node.id || i} className="flex items-center gap-2"><div className="px-3 py-1.5 rounded-lg text-[10px] font-medium" style={{ background: `${nt?.color || "#444"}15`, color: nt?.color || "#888", border: `1px solid ${nt?.color || "#444"}20` }}>{node.label}</div>{i < nodes.length - 1 && <div className="w-4 h-[1px]" style={{ background: borderC }} />}</div>; })}</div> : <p className="text-xs" style={{ color: tm }}>Adicione nodes para construir seu workflow</p>}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>}
    </div>
  );
}
