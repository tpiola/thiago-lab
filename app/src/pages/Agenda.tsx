import { useState } from "react";
import { trpc } from "@/providers/trpc";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Plus, CalendarDays, Clock, User, Mail, Trash2, CheckCircle2, XCircle } from "lucide-react";

const sC: Record<string, string> = { confirmed: '#00ff88', cancelled: '#ef4444', completed: '#3b82f6' };
const sL: Record<string, string> = { confirmed: "Confirmado", cancelled: "Cancelado", completed: "Concluido" };
const bg = 'var(--bg-secondary)';
const borderC = 'var(--border)';
const txt = 'var(--text)';
const tsec = 'var(--text-secondary)';
const tm = 'var(--text-muted)';
const ac = 'var(--accent)';

export default function Agenda() {
  const utils = trpc.useUtils();
  const { data: bookings, isLoading } = trpc.booking.list.useQuery();
  const createB = trpc.booking.create.useMutation({ onSuccess: () => { utils.booking.list.invalidate(); setOpen(false); setForm({ contactName: "", contactEmail: "", title: "", startTime: "", endTime: "", notes: "" }); } });
  const updateB = trpc.booking.update.useMutation({ onSuccess: () => utils.booking.list.invalidate() });
  const deleteB = trpc.booking.delete.useMutation({ onSuccess: () => utils.booking.list.invalidate() });
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ contactName: "", contactEmail: "", title: "", startTime: "", endTime: "", notes: "" });

  const sorted = bookings?.slice().sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
  const today = new Date().toISOString().split("T")[0];
  const todayB = sorted?.filter(b => b.startTime.toISOString().startsWith(today));
  const upcoming = sorted?.filter(b => b.startTime > new Date() && !b.startTime.toISOString().startsWith(today));
  const past = sorted?.filter(b => b.startTime <= new Date() && !b.startTime.toISOString().startsWith(today));

  const renderCard = (b: any) => (
    <Card key={b.id} className="border" style={{ background: bg, borderColor: borderC }}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 min-w-0 flex-1">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" style={{ background: `${ac}15` }}><CalendarDays className="w-4 h-4" style={{ color: ac }} /></div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="text-sm font-medium" style={{ color: txt }}>{b.title}</p>
                <Badge className="text-[10px]" style={{ background: `${sC[b.status]}15`, color: sC[b.status] }}>{sL[b.status]}</Badge>
              </div>
              <div className="flex flex-wrap gap-x-3 gap-y-1 mt-1 text-xs" style={{ color: tm }}>
                <span className="flex items-center gap-1"><User className="w-3 h-3" />{b.contactName}</span>
                {b.contactEmail && <span className="flex items-center gap-1"><Mail className="w-3 h-3" />{b.contactEmail}</span>}
                <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{new Date(b.startTime).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })} - {new Date(b.endTime).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            {b.status === "confirmed" && <><Button variant="ghost" size="icon" className="w-7 h-7" style={{ color: tm }} onClick={() => updateB.mutate({ id: b.id, status: "completed" })}><CheckCircle2 className="w-4 h-4" /></Button><Button variant="ghost" size="icon" className="w-7 h-7 hover:text-red-400" style={{ color: tm }} onClick={() => updateB.mutate({ id: b.id, status: "cancelled" })}><XCircle className="w-4 h-4" /></Button></>}
            <Button variant="ghost" size="icon" className="w-7 h-7 hover:text-red-400" style={{ color: tm }} onClick={() => { if (confirm('Excluir?')) deleteB.mutate({ id: b.id }); }}><Trash2 className="w-3.5 h-3.5" /></Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="p-4 lg:p-6 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div><h1 className="text-xl lg:text-2xl font-bold tracking-tight" style={{ color: txt }}>Agenda</h1><p className="text-sm mt-0.5" style={{ color: tm }}>Gerencie seus agendamentos</p></div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button className="font-semibold shrink-0 text-xs h-8" style={{ background: ac, color: '#000' }}><Plus className="w-3.5 h-3.5 mr-1" /> Novo</Button></DialogTrigger>
          <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto border" style={{ background: bg, borderColor: borderC }}>
            <DialogHeader><DialogTitle style={{ color: txt }}>Novo Agendamento</DialogTitle></DialogHeader>
            <form onSubmit={e => { e.preventDefault(); createB.mutate({ contactName: form.contactName, contactEmail: form.contactEmail || undefined, title: form.title, startTime: form.startTime, endTime: form.endTime, notes: form.notes || undefined }); }} className="space-y-3">
              <div><Label className="text-xs" style={{ color: tm }}>Titulo *</Label><Input value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="mt-1 border" style={{ background: 'var(--bg-card)', borderColor, color: txt }} required placeholder="Reuniao de vendas" /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label className="text-xs" style={{ color: tm }}>Nome *</Label><Input value={form.contactName} onChange={e => setForm({...form, contactName: e.target.value})} className="mt-1 border" style={{ background: 'var(--bg-card)', borderColor, color: txt }} required /></div>
                <div><Label className="text-xs" style={{ color: tm }}>Email</Label><Input type="email" value={form.contactEmail} onChange={e => setForm({...form, contactEmail: e.target.value})} className="mt-1 border" style={{ background: 'var(--bg-card)', borderColor, color: txt }} /></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label className="text-xs" style={{ color: tm }}>Inicio *</Label><Input type="datetime-local" value={form.startTime} onChange={e => setForm({...form, startTime: e.target.value})} className="mt-1 border text-xs" style={{ background: 'var(--bg-card)', borderColor, color: txt }} required /></div>
                <div><Label className="text-xs" style={{ color: tm }}>Fim *</Label><Input type="datetime-local" value={form.endTime} onChange={e => setForm({...form, endTime: e.target.value})} className="mt-1 border text-xs" style={{ background: 'var(--bg-card)', borderColor, color: txt }} required /></div>
              </div>
              <Button type="submit" className="w-full font-semibold" style={{ background: ac, color: '#000' }} disabled={createB.isPending}>{createB.isPending ? "Salvando..." : "Agendar"}</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      {isLoading ? <div className="space-y-3">{[...Array(4)].map((_,i) => <div key={i} className="h-24 rounded-xl animate-pulse" style={{ background: bg }} />)}</div> :
        sorted?.length === 0 ? <Card className="border" style={{ background: bg, borderColor: borderC }}><CardContent className="py-12 text-center"><CalendarDays className="w-10 h-10 mx-auto mb-3" style={{ color: tm }} /><p style={{ color: tsec }}>Nenhum agendamento</p></CardContent></Card> :
        <div className="space-y-4">
          {todayB && todayB.length > 0 && <div><h2 className="text-xs font-medium uppercase tracking-wider mb-2" style={{ color: ac }}>Hoje</h2><div className="space-y-2">{todayB.map(renderCard)}</div></div>}
          {upcoming && upcoming.length > 0 && <div><h2 className="text-xs font-medium uppercase tracking-wider mb-2" style={{ color: tm }}>Proximos</h2><div className="space-y-2">{upcoming.map(renderCard)}</div></div>}
          {past && past.length > 0 && <div><h2 className="text-xs font-medium uppercase tracking-wider mb-2" style={{ color: tm }}>Anteriores</h2><div className="space-y-2 opacity-60">{past.map(renderCard)}</div></div>}
        </div>}
    </div>
  );
}
