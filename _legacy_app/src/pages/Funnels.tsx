import { useState } from "react";
import { trpc } from "@/providers/trpc";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Plus, Globe, Trash2 } from "lucide-react";

const bg = 'var(--bg-secondary)';
const borderC = 'var(--border)';
const elevBg = 'var(--bg-card)';

export default function Funnels() {
  const utils = trpc.useUtils();
  const { data: funnels, isLoading } = trpc.funnel.list.useQuery();
  const createF = trpc.funnel.create.useMutation({ onSuccess: () => { utils.funnel.list.invalidate(); setOpen(false); setForm({ name: "", slug: "" }); } });
  const updateF = trpc.funnel.update.useMutation({ onSuccess: () => utils.funnel.list.invalidate() });
  const deleteF = trpc.funnel.delete.useMutation({ onSuccess: () => utils.funnel.list.invalidate() });
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", slug: "" });

  return (
    <div className="p-4 lg:p-6 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl lg:text-2xl font-bold tracking-tight" style={{ color: 'var(--text)' }}>Funis de Conversao</h1>
          <p className="text-sm mt-0.5" style={{ color: 'var(--text-muted)' }}>Crie e gerencie funis de vendas</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="font-semibold shrink-0 text-xs h-8" style={{ background: 'var(--accent)', color: '#000' }}><Plus className="w-3.5 h-3.5 mr-1" /> Novo Funil</Button>
          </DialogTrigger>
          <DialogContent className="max-w-md border" style={{ background: bg, borderColor: borderC }}>
            <DialogHeader><DialogTitle style={{ color: 'var(--text)' }}>Novo Funil</DialogTitle></DialogHeader>
            <form onSubmit={e => { e.preventDefault(); createF.mutate({ name: form.name, slug: form.slug || form.name.toLowerCase().replace(/\s+/g, "-") }); }} className="space-y-3">
              <div><Label className="text-xs" style={{ color: 'var(--text-muted)' }}>Nome *</Label><Input value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="mt-1 border" style={{ background: elevBg, borderColor: borderC, color: 'var(--text)' }} required /></div>
              <div><Label className="text-xs" style={{ color: 'var(--text-muted)' }}>Slug (URL)</Label><Input value={form.slug} onChange={e => setForm({...form, slug: e.target.value})} className="mt-1 border" style={{ background: elevBg, borderColor: borderC, color: 'var(--text)' }} placeholder="meu-funil" /></div>
              <Button type="submit" className="w-full font-semibold" style={{ background: 'var(--accent)', color: '#000' }} disabled={createF.isPending}>{createF.isPending ? "Criando..." : "Criar Funil"}</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      {isLoading ? <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">{[...Array(3)].map((_,i) => <div key={i} className="h-48 rounded-xl animate-pulse" style={{ background: bg }} />)}</div> :
        funnels?.length === 0 ? <Card className="border" style={{ background: bg, borderColor: borderC }}><CardContent className="py-12 text-center"><Globe className="w-10 h-10 mx-auto mb-3" style={{ color: 'var(--text-muted)' }} /><p style={{ color: 'var(--text-secondary)' }}>Nenhum funil criado</p></CardContent></Card> :
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {funnels?.map(f => (
            <Card key={f.id} className="border transition-all hover:opacity-90" style={{ background: bg, borderColor: borderC }}>
              <CardContent className="p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: 'var(--accent)15' }}><Globe className="w-4 h-4" style={{ color: 'var(--accent)' }} /></div>
                    <div><p className="text-sm font-medium" style={{ color: 'var(--text)' }}>{f.name}</p><p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>/{f.slug}</p></div>
                  </div>
                  <Badge className="text-[10px]" style={{ background: f.published ? 'var(--accent)15' : '#f59e0b15', color: f.published ? 'var(--accent)' : '#f59e0b' }}>{f.published ? "Publicado" : "Rascunho"}</Badge>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {[{ l: "Visitas", v: f.visits || 0 }, { l: "Conv.", v: f.conversions || 0 }, { l: "Taxa", v: f.visits ? Math.round(((f.conversions || 0) / f.visits) * 100) + '%' : '0%' }].map(s => (
                    <div key={s.l} className="rounded-lg p-2 text-center" style={{ background: elevBg }}><p className="text-sm font-semibold" style={{ color: 'var(--text)' }}>{s.v}</p><p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{s.l}</p></div>
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" className="flex-1 text-xs h-8" style={{ borderColor: borderC, color: 'var(--text-secondary)' }} onClick={() => updateF.mutate({ id: f.id, published: !f.published })}>{f.published ? "Despublicar" : "Publicar"}</Button>
                  <Button variant="ghost" size="icon" className="w-8 h-8 hover:text-red-400" style={{ color: 'var(--text-muted)' }} onClick={() => { if (confirm('Excluir funil?')) deleteF.mutate({ id: f.id }); }}><Trash2 className="w-3.5 h-3.5" /></Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>}
    </div>
  );
}
