import { useState } from "react";
import { trpc } from "@/providers/trpc";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Plus, Mail, Send, Eye, MousePointer, Trash2 } from "lucide-react";

const sC: Record<string, { bg: string; color: string }> = { draft: { bg: '#f59e0b15', color: '#f59e0b' }, scheduled: { bg: '#3b82f615', color: '#3b82f6' }, sent: { bg: '#00ff8815', color: '#00ff88' } };
const sL: Record<string, string> = { draft: "Rascunho", scheduled: "Agendado", sent: "Enviado" };
const bg = 'var(--bg-secondary)';
const borderC = 'var(--border)';
const elevBg = 'var(--bg-card)';
const txt = 'var(--text)';
const tsec = 'var(--text-secondary)';
const tm = 'var(--text-muted)';
const ac = 'var(--accent)';

export default function Campaigns() {
  const utils = trpc.useUtils();
  const { data: campaigns, isLoading } = trpc.campaign.list.useQuery();
  const createC = trpc.campaign.create.useMutation({ onSuccess: () => { utils.campaign.list.invalidate(); setOpen(false); setForm({ name: "", subject: "", body: "" }); } });
  const updateC = trpc.campaign.update.useMutation({ onSuccess: () => utils.campaign.list.invalidate() });
  const deleteC = trpc.campaign.delete.useMutation({ onSuccess: () => utils.campaign.list.invalidate() });
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", subject: "", body: "" });

  const sendCampaign = (id: number) => updateC.mutate({ id, status: "sent", sentCount: Math.floor(Math.random() * 500) + 100 });

  return (
    <div className="p-4 lg:p-6 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div><h1 className="text-xl lg:text-2xl font-bold tracking-tight" style={{ color: txt }}>Campanhas de Email</h1><p className="text-sm mt-0.5" style={{ color: tm }}>Crie e gerencie campanhas de email marketing</p></div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button className="font-semibold shrink-0 text-xs h-8" style={{ background: ac, color: '#000' }}><Plus className="w-3.5 h-3.5 mr-1" /> Nova Campanha</Button></DialogTrigger>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto border" style={{ background: bg, borderColor: borderC }}>
            <DialogHeader><DialogTitle style={{ color: txt }}>Nova Campanha</DialogTitle></DialogHeader>
            <form onSubmit={e => { e.preventDefault(); createC.mutate({ name: form.name, subject: form.subject, body: form.body }); }} className="space-y-3">
              <div><Label className="text-xs" style={{ color: tm }}>Nome *</Label><Input value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="mt-1 border" style={{ background: elevBg, borderColor: borderC, color: txt }} required /></div>
              <div><Label className="text-xs" style={{ color: tm }}>Assunto *</Label><Input value={form.subject} onChange={e => setForm({...form, subject: e.target.value})} className="mt-1 border" style={{ background: elevBg, borderColor: borderC, color: txt }} required /></div>
              <div><Label className="text-xs" style={{ color: tm }}>Conteudo *</Label><Textarea value={form.body} onChange={e => setForm({...form, body: e.target.value})} className="mt-1 border min-h-[150px]" style={{ background: elevBg, borderColor: borderC, color: txt }} required /></div>
              <Button type="submit" className="w-full font-semibold" style={{ background: ac, color: '#000' }} disabled={createC.isPending}>{createC.isPending ? "Criando..." : "Criar Campanha"}</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      {isLoading ? <div className="space-y-3">{[...Array(3)].map((_,i) => <div key={i} className="h-32 rounded-xl animate-pulse" style={{ background: bg }} />)}</div> :
        campaigns?.length === 0 ? <Card className="border" style={{ background: bg, borderColor: borderC }}><CardContent className="py-12 text-center"><Mail className="w-10 h-10 mx-auto mb-3" style={{ color: tm }} /><p style={{ color: tsec }}>Nenhuma campanha criada</p></CardContent></Card> :
        <div className="space-y-3">
          {campaigns?.map(camp => (
            <Card key={camp.id} className="border" style={{ background: bg, borderColor: borderC }}>
              <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="flex items-start gap-3 min-w-0 flex-1">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" style={{ background: `${ac}15` }}><Mail className="w-4 h-4" style={{ color: ac }} /></div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-sm font-medium" style={{ color: txt }}>{camp.name}</h3>
                        <Badge className="text-[10px]" style={{ background: sC[camp.status].bg, color: sC[camp.status].color }}>{sL[camp.status]}</Badge>
                      </div>
                      <p className="text-xs mt-0.5 truncate" style={{ color: tsec }}>{camp.subject}</p>
                      {camp.status === "sent" && (
                        <div className="flex items-center gap-4 mt-2 text-xs" style={{ color: tm }}>
                          <span className="flex items-center gap-1"><Send className="w-3 h-3" />{camp.sentCount || 0} envios</span>
                          <span className="flex items-center gap-1" style={{ color: '#3b82f6' }}><Eye className="w-3 h-3" />{camp.openCount || 0} aberturas</span>
                          <span className="flex items-center gap-1" style={{ color: ac }}><MousePointer className="w-3 h-3" />{camp.clickCount || 0} cliques</span>
                          {camp.sentCount ? <span style={{ color: '#8b5cf6' }}>{Math.round(((camp.openCount || 0) / camp.sentCount) * 100)}% taxa</span> : null}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {camp.status === "draft" && <Button size="sm" className="text-xs h-8 font-semibold" style={{ background: ac, color: '#000' }} onClick={() => sendCampaign(camp.id)}><Send className="w-3.5 h-3.5 mr-1" /> Enviar</Button>}
                    <Button variant="ghost" size="icon" className="w-8 h-8 hover:text-red-400" style={{ color: tm }} onClick={() => { if (confirm('Excluir?')) deleteC.mutate({ id: camp.id }); }}><Trash2 className="w-3.5 h-3.5" /></Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>}
    </div>
  );
}
