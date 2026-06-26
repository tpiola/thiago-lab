import { trpc } from "@/providers/trpc";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, DollarSign, Trash2, ArrowRight, ArrowLeft } from "lucide-react";
import { useState } from "react";

const stages = [
  { key: "new", label: "Novo", color: "#00ff88" },
  { key: "qualified", label: "Qualificado", color: "#3b82f6" },
  { key: "proposal", label: "Proposta", color: "#8b5cf6" },
  { key: "negotiation", label: "Negociacao", color: "#f59e0b" },
  { key: "closed_won", label: "Ganho", color: "#00cc6a" },
  { key: "closed_lost", label: "Perdido", color: "#ef4444" },
] as const;

export default function Pipeline() {
  const utils = trpc.useUtils();
  const { data: deals, isLoading } = trpc.deal.list.useQuery();
  const { data: contacts } = trpc.contact.list.useQuery();
  const createD = trpc.deal.create.useMutation({ onSuccess: () => { utils.deal.list.invalidate(); setOpen(false); } });
  const updateD = trpc.deal.update.useMutation({ onSuccess: () => utils.deal.list.invalidate() });
  const deleteD = trpc.deal.delete.useMutation({ onSuccess: () => utils.deal.list.invalidate() });

  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ contactId: "", title: "", value: "", stage: "new" as const, priority: "medium" as const, closeDate: "" });

  const moveStage = (dealId: number, currentStage: string, direction: "next" | "prev") => {
    const idx = stages.findIndex(s => s.key === currentStage);
    const newIdx = direction === "next" ? Math.min(idx + 1, stages.length - 1) : Math.max(idx - 1, 0);
    updateD.mutate({ id: dealId, stage: stages[newIdx].key as any });
  };

  const elevBg = 'var(--bg-card)';
  const borderC = 'var(--border)';

  return (
    <div className="p-4 lg:p-6 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl lg:text-2xl font-bold tracking-tight" style={{ color: 'var(--text)' }}>Pipeline</h1>
          <p className="text-sm mt-0.5" style={{ color: 'var(--text-muted)' }}>Gerencie suas oportunidades</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="font-semibold shrink-0 text-xs h-8" style={{ background: 'var(--accent)', color: '#000' }}><Plus className="w-3.5 h-3.5 mr-1" /> Nova Oportunidade</Button>
          </DialogTrigger>
          <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto border" style={{ background: 'var(--bg-secondary)', borderColor }}>
            <DialogHeader><DialogTitle style={{ color: 'var(--text)' }}>Nova Oportunidade</DialogTitle></DialogHeader>
            <form onSubmit={e => { e.preventDefault(); createD.mutate({ contactId: Number(form.contactId), title: form.title, value: form.value ? Number(form.value) * 100 : undefined, stage: form.stage, priority: form.priority, closeDate: form.closeDate || undefined }); }} className="space-y-3">
              <div><Label className="text-xs" style={{ color: 'var(--text-muted)' }}>Titulo *</Label><Input value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="mt-1 border" style={{ background: elevBg, borderColor, color: 'var(--text)' }} required /></div>
              <div><Label className="text-xs" style={{ color: 'var(--text-muted)' }}>Contato *</Label>
                <Select value={form.contactId} onValueChange={v => setForm({...form, contactId: v})}>
                  <SelectTrigger className="mt-1 border text-xs" style={{ background: elevBg, borderColor, color: 'var(--text)' }}><SelectValue placeholder="Selecione..." /></SelectTrigger>
                  <SelectContent style={{ background: elevBg, borderColor }}>{contacts?.map(c => <SelectItem key={c.id} value={String(c.id)} className="text-xs" style={{ color: 'var(--text)' }}>{c.name}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label className="text-xs" style={{ color: 'var(--text-muted)' }}>Valor (R$)</Label><Input type="number" value={form.value} onChange={e => setForm({...form, value: e.target.value})} className="mt-1 border" style={{ background: elevBg, borderColor, color: 'var(--text)' }} /></div>
                <div><Label className="text-xs" style={{ color: 'var(--text-muted)' }}>Prioridade</Label>
                  <Select value={form.priority} onValueChange={v => setForm({...form, priority: v as any})}>
                    <SelectTrigger className="mt-1 border text-xs" style={{ background: elevBg, borderColor, color: 'var(--text)' }}><SelectValue /></SelectTrigger>
                    <SelectContent style={{ background: elevBg, borderColor }}>
                      <SelectItem value="low" className="text-xs" style={{ color: 'var(--text)' }}>Baixa</SelectItem>
                      <SelectItem value="medium" className="text-xs" style={{ color: 'var(--text)' }}>Media</SelectItem>
                      <SelectItem value="high" className="text-xs" style={{ color: 'var(--text)' }}>Alta</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div><Label className="text-xs" style={{ color: 'var(--text-muted)' }}>Data de Fechamento</Label><Input type="date" value={form.closeDate} onChange={e => setForm({...form, closeDate: e.target.value})} className="mt-1 border" style={{ background: elevBg, borderColor, color: 'var(--text)' }} /></div>
              <Button type="submit" className="w-full font-semibold" style={{ background: 'var(--accent)', color: '#000' }} disabled={createD.isPending}>{createD.isPending ? "Salvando..." : "Criar"}</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">{[...Array(6)].map((_,i) => <Skeleton key={i} className="h-[300px]" style={{ background: 'var(--bg-secondary)' }} />)}</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
          {stages.map(stage => {
            const stageDeals = deals?.filter(d => d.stage === stage.key) || [];
            const totalValue = stageDeals.reduce((s, d) => s + (d.value || 0), 0);
            return (
              <div key={stage.key} className="flex flex-col">
                <div className="flex items-center justify-between mb-2 px-1">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ background: stage.color }} />
                    <span className="text-xs font-medium" style={{ color: 'var(--text)' }}>{stage.label}</span>
                  </div>
                  <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{stageDeals.length}</span>
                </div>
                <div className="rounded-xl border p-2 space-y-2 min-h-[200px]" style={{ background: 'var(--bg-secondary)', borderColor }}>
                  {stageDeals.map(deal => (
                    <Card key={deal.id} className="border-0" style={{ background: elevBg }}>
                      <CardContent className="p-3">
                        <p className="text-xs font-medium" style={{ color: 'var(--text)' }}>{deal.title}</p>
                        <div className="flex items-center gap-1 mt-1.5">
                          <DollarSign className="w-3 h-3" style={{ color: 'var(--accent)' }} />
                          <span className="text-xs font-medium" style={{ color: 'var(--accent)' }}>R$ {((deal.value || 0) / 100).toLocaleString()}</span>
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-[10px] font-medium" style={{ color: deal.priority === 'high' ? '#ef4444' : deal.priority === 'medium' ? '#f59e0b' : 'var(--text-muted)' }}>{deal.priority?.toUpperCase()}</span>
                          <div className="flex items-center gap-0.5">
                            {stage.key !== "new" && <Button variant="ghost" size="icon" className="w-5 h-5" style={{ color: 'var(--text-muted)' }} onClick={() => moveStage(deal.id, deal.stage, "prev")}><ArrowLeft className="w-3 h-3" /></Button>}
                            {stage.key !== "closed_lost" && <Button variant="ghost" size="icon" className="w-5 h-5" style={{ color: 'var(--text-muted)' }} onClick={() => moveStage(deal.id, deal.stage, "next")}><ArrowRight className="w-3 h-3" /></Button>}
                            <Button variant="ghost" size="icon" className="w-5 h-5 hover:text-red-400" style={{ color: 'var(--text-muted)' }} onClick={() => { if (confirm('Excluir?')) deleteD.mutate({ id: deal.id }); }}><Trash2 className="w-3 h-3" /></Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  {stageDeals.length === 0 && <p className="text-xs text-center py-6" style={{ color: 'var(--text-muted)' }}>Vazio</p>}
                </div>
                <div className="mt-2 px-1"><span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>R$ {(totalValue / 100).toLocaleString()}</span></div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
