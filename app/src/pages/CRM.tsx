import { useState } from "react";
import { trpc } from "@/providers/trpc";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, Plus, Phone, Mail, Building2, Trash2, Pencil, User } from "lucide-react";

const stC: Record<string, string> = { new: "#3b82f6", contacted: "#f59e0b", qualified: "#8b5cf6", proposal: "#00ff88", negotiation: "#f97316", closed_won: "#00ff88", closed_lost: "#ef4444" };
const stL: Record<string, string> = { new: "Novo", contacted: "Contactado", qualified: "Qualificado", proposal: "Proposta", negotiation: "Negociacao", closed_won: "Ganho", closed_lost: "Perdido" };

export default function CRM() {
  const utils = trpc.useUtils();
  const { data: contacts, isLoading } = trpc.contact.list.useQuery();
  const createC = trpc.contact.create.useMutation({ onSuccess: () => { utils.contact.list.invalidate(); setOpen(false); resetForm(); } });
  const updateC = trpc.contact.update.useMutation({ onSuccess: () => { utils.contact.list.invalidate(); setEditOpen(false); setEditId(null); } });
  const deleteC = trpc.contact.delete.useMutation({ onSuccess: () => utils.contact.list.invalidate() });

  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState({ name: "", email: "", phone: "", company: "", status: "new" as const, value: "", notes: "" });
  const [editForm, setEditForm] = useState({ name: "", email: "", phone: "", company: "", status: "new" as const, value: "", notes: "" });

  const resetForm = () => setForm({ name: "", email: "", phone: "", company: "", status: "new", value: "", notes: "" });
  const filtered = contacts?.filter(c => c.name.toLowerCase().includes(search.toLowerCase()) || c.email?.toLowerCase().includes(search.toLowerCase())) || [];

  const handleCreate = (e: React.FormEvent) => { e.preventDefault(); createC.mutate({ name: form.name, email: form.email || undefined, phone: form.phone || undefined, company: form.company || undefined, status: form.status, value: form.value ? Number(form.value) * 100 : undefined, notes: form.notes || undefined }); };
  const handleUpdate = (e: React.FormEvent) => { e.preventDefault(); if (!editId) return; updateC.mutate({ id: editId, name: editForm.name || undefined, email: editForm.email || undefined, phone: editForm.phone || undefined, company: editForm.company || undefined, status: editForm.status, value: editForm.value ? Number(editForm.value) * 100 : undefined, notes: editForm.notes || undefined }); };

  const cardBg = 'var(--bg-secondary)';
  const borderC = 'var(--border)';
  const elevBg = 'var(--bg-card)';

  return (
    <div className="p-4 lg:p-6 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl lg:text-2xl font-bold tracking-tight" style={{ color: 'var(--text)' }}>CRM / Leads</h1>
          <p className="text-sm mt-0.5" style={{ color: 'var(--text-muted)' }}>Gerencie seus contatos e leads</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="font-semibold shrink-0 text-xs h-8" style={{ background: 'var(--accent)', color: '#000' }}><Plus className="w-3.5 h-3.5 mr-1" /> Novo Contato</Button>
          </DialogTrigger>
          <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto border" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)' }}>
            <DialogHeader><DialogTitle style={{ color: 'var(--text)' }}>Novo Contato</DialogTitle></DialogHeader>
            <form onSubmit={handleCreate} className="space-y-3">
              <div><Label className="text-xs" style={{ color: 'var(--text-muted)' }}>Nome *</Label><Input value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="mt-1 border text-white" style={{ background: elevBg, borderColor: borderC }} required /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label className="text-xs" style={{ color: 'var(--text-muted)' }}>Email</Label><Input value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="mt-1 border" style={{ background: elevBg, borderColor: borderC, color: 'var(--text)' }} /></div>
                <div><Label className="text-xs" style={{ color: 'var(--text-muted)' }}>Telefone</Label><Input value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} className="mt-1 border" style={{ background: elevBg, borderColor: borderC, color: 'var(--text)' }} /></div>
              </div>
              <div><Label className="text-xs" style={{ color: 'var(--text-muted)' }}>Empresa</Label><Input value={form.company} onChange={e => setForm({...form, company: e.target.value})} className="mt-1 border" style={{ background: elevBg, borderColor: borderC, color: 'var(--text)' }} /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label className="text-xs" style={{ color: 'var(--text-muted)' }}>Status</Label>
                  <Select value={form.status} onValueChange={v => setForm({...form, status: v as any})}>
                    <SelectTrigger className="mt-1 border text-xs" style={{ background: elevBg, borderColor: borderC, color: 'var(--text)' }}><SelectValue /></SelectTrigger>
                    <SelectContent style={{ background: elevBg, borderColor: borderC }}>{Object.entries(stL).map(([k,l]) => <SelectItem key={k} value={k} className="text-xs" style={{ color: 'var(--text)' }}>{l}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div><Label className="text-xs" style={{ color: 'var(--text-muted)' }}>Valor (R$)</Label><Input type="number" value={form.value} onChange={e => setForm({...form, value: e.target.value})} className="mt-1 border" style={{ background: elevBg, borderColor: borderC, color: 'var(--text)' }} placeholder="0,00" /></div>
              </div>
              <Button type="submit" className="w-full font-semibold" style={{ background: 'var(--accent)', color: '#000' }} disabled={createC.isPending}>{createC.isPending ? "Salvando..." : "Salvar Contato"}</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-muted)' }} />
        <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar contatos..." className="pl-10 border" style={{ background: cardBg, borderColor: borderC, color: 'var(--text)' }} />
      </div>

      {isLoading ? (
        <div className="grid gap-3">{[...Array(4)].map((_,i) => <Skeleton key={i} className="h-24" style={{ background: cardBg }} />)}</div>
      ) : filtered.length === 0 ? (
        <Card className="border" style={{ background: cardBg, borderColor: borderC }}><CardContent className="py-12 text-center"><User className="w-10 h-10 mx-auto mb-3" style={{ color: 'var(--text-muted)' }} /><p style={{ color: 'var(--text-secondary)' }}>Nenhum contato encontrado</p></CardContent></Card>
      ) : (
        <div className="grid gap-3">
          {filtered.map(c => (
            <Card key={c.id} className="border transition-all hover:opacity-90" style={{ background: cardBg, borderColor: borderC }}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 min-w-0 flex-1">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{ background: 'var(--accent)15' }}>
                      <span className="text-sm font-bold" style={{ color: 'var(--accent)' }}>{c.name[0]}</span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-sm font-medium" style={{ color: 'var(--text)' }}>{c.name}</p>
                        <Badge className="text-[10px]" style={{ background: `${stC[c.status]}15`, color: stC[c.status] }}>{stL[c.status] || c.status}</Badge>
                      </div>
                      <div className="flex flex-wrap gap-x-3 gap-y-1 mt-1.5 text-xs" style={{ color: 'var(--text-secondary)' }}>
                        {c.email && <span className="flex items-center gap-1"><Mail className="w-3 h-3" />{c.email}</span>}
                        {c.phone && <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{c.phone}</span>}
                        {c.company && <span className="flex items-center gap-1"><Building2 className="w-3 h-3" />{c.company}</span>}
                      </div>
                      {c.value ? <p className="text-xs font-medium mt-1" style={{ color: 'var(--accent)' }}>R$ {(c.value/100).toLocaleString('pt-BR',{minimumFractionDigits:2})}</p> : null}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <Button variant="ghost" size="icon" className="w-8 h-8" style={{ color: 'var(--text-muted)' }} onClick={() => { setEditId(c.id); setEditForm({ name: c.name, email: c.email||"", phone: c.phone||"", company: c.company||"", status: c.status, value: c.value?String(c.value/100):"", notes: c.notes||"" }); setEditOpen(true); }}><Pencil className="w-3.5 h-3.5" /></Button>
                    <Button variant="ghost" size="icon" className="w-8 h-8 hover:text-red-400" style={{ color: 'var(--text-muted)' }} onClick={() => { if (confirm('Excluir?')) deleteC.mutate({ id: c.id }); }}><Trash2 className="w-3.5 h-3.5" /></Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto border" style={{ background: 'var(--bg-secondary)', borderColor: borderC }}>
          <DialogHeader><DialogTitle style={{ color: 'var(--text)' }}>Editar Contato</DialogTitle></DialogHeader>
          <form onSubmit={handleUpdate} className="space-y-3">
            <div><Label className="text-xs" style={{ color: 'var(--text-muted)' }}>Nome</Label><Input value={editForm.name} onChange={e => setEditForm({...editForm, name: e.target.value})} className="mt-1 border" style={{ background: elevBg, borderColor: borderC, color: 'var(--text)' }} /></div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label className="text-xs" style={{ color: 'var(--text-muted)' }}>Email</Label><Input value={editForm.email} onChange={e => setEditForm({...editForm, email: e.target.value})} className="mt-1 border" style={{ background: elevBg, borderColor: borderC, color: 'var(--text)' }} /></div>
              <div><Label className="text-xs" style={{ color: 'var(--text-muted)' }}>Telefone</Label><Input value={editForm.phone} onChange={e => setEditForm({...editForm, phone: e.target.value})} className="mt-1 border" style={{ background: elevBg, borderColor: borderC, color: 'var(--text)' }} /></div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label className="text-xs" style={{ color: 'var(--text-muted)' }}>Status</Label>
                <Select value={editForm.status} onValueChange={v => setEditForm({...editForm, status: v as any})}>
                  <SelectTrigger className="mt-1 border text-xs" style={{ background: elevBg, borderColor: borderC, color: 'var(--text)' }}><SelectValue /></SelectTrigger>
                  <SelectContent style={{ background: elevBg, borderColor: borderC }}>{Object.entries(stL).map(([k,l]) => <SelectItem key={k} value={k} className="text-xs" style={{ color: 'var(--text)' }}>{l}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div><Label className="text-xs" style={{ color: 'var(--text-muted)' }}>Valor (R$)</Label><Input value={editForm.value} onChange={e => setEditForm({...editForm, value: e.target.value})} className="mt-1 border" style={{ background: elevBg, borderColor: borderC, color: 'var(--text)' }} /></div>
            </div>
            <Button type="submit" className="w-full font-semibold" style={{ background: 'var(--accent)', color: '#000' }} disabled={updateC.isPending}>{updateC.isPending ? "Salvando..." : "Atualizar"}</Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
