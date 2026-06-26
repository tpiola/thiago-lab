import { useState } from "react";
import { trpc } from "@/providers/trpc";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Plus, FileText, Eye, Trash2, ChevronLeft, Save, Globe, Lock } from "lucide-react";

const bg = 'var(--bg-secondary)';
const borderC = 'var(--border)';
const elevBg = 'var(--bg-card)';
const txt = 'var(--text)';
const tsec = 'var(--text-secondary)';
const tm = 'var(--text-muted)';
const ac = 'var(--accent)';

export default function Docs() {
  const utils = trpc.useUtils();
  const { data: docs, isLoading } = trpc.document.list.useQuery();
  const createD = trpc.document.create.useMutation({ onSuccess: () => { utils.document.list.invalidate(); setOpen(false); setForm({ title: "", content: "" }); } });
  const updateD = trpc.document.update.useMutation({ onSuccess: () => utils.document.list.invalidate() });
  const deleteD = trpc.document.delete.useMutation({ onSuccess: () => { utils.document.list.invalidate(); setActiveDoc(null); } });
  const [open, setOpen] = useState(false);
  const [activeDoc, setActiveDoc] = useState<any>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [form, setForm] = useState({ title: "", content: "" });

  const openDoc = (doc: any) => { setActiveDoc(doc); setEditTitle(doc.title); setEditContent(doc.content || ""); };
  const saveDoc = () => { if (!activeDoc) return; updateD.mutate({ id: activeDoc.id, title: editTitle, content: editContent }); };

  if (activeDoc) return (
    <div className="p-4 lg:p-6 space-y-4 max-w-4xl">
      <div className="flex items-center gap-3">
        <button onClick={() => setActiveDoc(null)} className="w-8 h-8 flex items-center justify-center" style={{ color: tm }}><ChevronLeft className="w-5 h-5" /></button>
        <div className="flex-1"><Input value={editTitle} onChange={e => setEditTitle(e.target.value)} className="border-0 text-lg font-semibold px-0 focus-visible:ring-0" style={{ background: 'transparent', color: txt }} /></div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="text-xs h-8" style={{ borderColor, color: tm }} onClick={() => updateD.mutate({ id: activeDoc.id, isPublished: !activeDoc.isPublished })}>{activeDoc.isPublished ? <><Globe className="w-3 h-3 mr-1" /> Publico</> : <><Lock className="w-3 h-3 mr-1" /> Privado</>}</Button>
          <Button size="sm" className="text-xs h-8 font-semibold" style={{ background: ac, color: '#000' }} onClick={saveDoc}><Save className="w-3 h-3 mr-1" /> Salvar</Button>
          <button onClick={() => { if (confirm('Excluir?')) deleteD.mutate({ id: activeDoc.id }); }} className="w-8 h-8 flex items-center justify-center hover:text-red-400" style={{ color: tm }}><Trash2 className="w-4 h-4" /></button>
        </div>
      </div>
      <Textarea value={editContent} onChange={e => setEditContent(e.target.value)} placeholder="Comece a escrever..." className="border min-h-[70vh] resize-none text-sm leading-relaxed p-4" style={{ background: bg, borderColor, color: txt }} />
    </div>
  );

  return (
    <div className="p-4 lg:p-6 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div><h1 className="text-xl lg:text-2xl font-bold tracking-tight" style={{ color: txt }}>Docs & Wiki</h1><p className="text-sm mt-0.5" style={{ color: tm }}>Documentos e base de conhecimento</p></div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button className="font-semibold shrink-0 text-xs h-8" style={{ background: ac, color: '#000' }}><Plus className="w-3.5 h-3.5 mr-1" /> Novo Doc</Button></DialogTrigger>
          <DialogContent className="max-w-md border" style={{ background: bg, borderColor: borderC }}>
            <DialogHeader><DialogTitle style={{ color: txt }}>Novo Documento</DialogTitle></DialogHeader>
            <form onSubmit={e => { e.preventDefault(); createD.mutate({ title: form.title, content: form.content || undefined }); }} className="space-y-3">
              <div><Input value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="border" style={{ background: elevBg, borderColor, color: txt }} placeholder="Titulo do documento" required /></div>
              <div><Textarea value={form.content} onChange={e => setForm({...form, content: e.target.value})} className="border min-h-[100px]" style={{ background: elevBg, borderColor, color: txt }} placeholder="Conteudo..." /></div>
              <Button type="submit" className="w-full font-semibold" style={{ background: ac, color: '#000' }} disabled={createD.isPending}>{createD.isPending ? "Criando..." : "Criar"}</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      {isLoading ? <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">{[...Array(6)].map((_,i) => <div key={i} className="h-28 rounded-xl animate-pulse" style={{ background: bg }} />)}</div> :
        docs?.length === 0 ? <Card className="border" style={{ background: bg, borderColor: borderC }}><CardContent className="py-12 text-center"><BookOpen className="w-10 h-10 mx-auto mb-3" style={{ color: tm }} /><p style={{ color: tsec }}>Nenhum documento ainda</p></CardContent></Card> :
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {docs?.map(doc => (
            <Card key={doc.id} className="border transition-all cursor-pointer group" style={{ background: bg, borderColor: borderC }} onClick={() => openDoc(doc)}>
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ background: `${ac}10` }}><FileText className="w-4 h-4" style={{ color: ac }} /></div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium truncate" style={{ color: txt }}>{doc.title}</h3>
                    <div className="flex items-center gap-2 mt-1.5 text-[10px]" style={{ color: tm }}>
                      <span className="flex items-center gap-0.5"><Eye className="w-2.5 h-2.5" />{doc.views || 0}</span>
                    </div>
                  </div>
                  <Badge className="text-[9px]" style={{ background: doc.isPublished ? `${ac}10` : 'rgba(128,128,128,0.1)', color: doc.isPublished ? ac : tm }}>{doc.isPublished ? 'Publico' : 'Privado'}</Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>}
    </div>
  );
}
