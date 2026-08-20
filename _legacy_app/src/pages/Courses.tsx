import { useState } from "react";
import { trpc } from "@/providers/trpc";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Plus, GraduationCap, Users, BookOpen, Trash2, ChevronDown, ChevronUp, Play } from "lucide-react";

const bg = 'var(--bg-secondary)';
const borderC = 'var(--border)';
const elevBg = 'var(--bg-card)';
const txt = 'var(--text)';
const tsec = 'var(--text-secondary)';
const tm = 'var(--text-muted)';

export default function Courses() {
  const utils = trpc.useUtils();
  const { data: courses, isLoading } = trpc.course.list.useQuery();
  const createC = trpc.course.create.useMutation({ onSuccess: () => { utils.course.list.invalidate(); setOpen(false); setForm({ title: "", description: "", price: "" }); } });
  const updateC = trpc.course.update.useMutation({ onSuccess: () => utils.course.list.invalidate() });
  const deleteC = trpc.course.delete.useMutation({ onSuccess: () => utils.course.list.invalidate() });
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState<number | null>(null);
  const [form, setForm] = useState({ title: "", description: "", price: "" });

  return (
    <div className="p-4 lg:p-6 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div><h1 className="text-xl lg:text-2xl font-bold tracking-tight" style={{ color: txt }}>Cursos</h1><p className="text-sm mt-0.5" style={{ color: tm }}>Crie e venda cursos online</p></div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button className="font-semibold shrink-0 text-xs h-8" style={{ background: 'var(--accent)', color: '#000' }}><Plus className="w-3.5 h-3.5 mr-1" /> Novo Curso</Button></DialogTrigger>
          <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto border" style={{ background: bg, borderColor: borderC }}>
            <DialogHeader><DialogTitle style={{ color: txt }}>Novo Curso</DialogTitle></DialogHeader>
            <form onSubmit={e => { e.preventDefault(); createC.mutate({ title: form.title, description: form.description || undefined, price: form.price ? Number(form.price) * 100 : undefined }); }} className="space-y-3">
              <div><Label className="text-xs" style={{ color: tm }}>Titulo *</Label><Input value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="mt-1 border" style={{ background: elevBg, borderColor: borderC, color: txt }} required /></div>
              <div><Label className="text-xs" style={{ color: tm }}>Descricao</Label><Textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="mt-1 border min-h-[80px]" style={{ background: elevBg, borderColor: borderC, color: txt }} /></div>
              <div><Label className="text-xs" style={{ color: tm }}>Preco (R$)</Label><Input type="number" value={form.price} onChange={e => setForm({...form, price: e.target.value})} className="mt-1 border" style={{ background: elevBg, borderColor: borderC, color: txt }} placeholder="0,00" /></div>
              <Button type="submit" className="w-full font-semibold" style={{ background: 'var(--accent)', color: '#000' }} disabled={createC.isPending}>{createC.isPending ? "Criando..." : "Criar Curso"}</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      {isLoading ? <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{[...Array(4)].map((_,i) => <div key={i} className="h-64 rounded-xl animate-pulse" style={{ background: bg }} />)}</div> :
        courses?.length === 0 ? <Card className="border" style={{ background: bg, borderColor: borderC }}><CardContent className="py-12 text-center"><GraduationCap className="w-10 h-10 mx-auto mb-3" style={{ color: tm }} /><p style={{ color: tsec }}>Nenhum curso criado</p></CardContent></Card> :
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {courses?.map(c => (
            <Card key={c.id} className="border overflow-hidden" style={{ background: bg, borderColor: borderC }}>
              <div className="h-32 flex items-center justify-center relative" style={{ background: elevBg }}>
                <GraduationCap className="w-12 h-12" style={{ color: 'var(--accent)', opacity: 0.3 }} />
                <Badge className="absolute top-3 right-3 text-[10px]" style={{ background: c.published ? 'var(--accent)15' : '#f59e0b15', color: c.published ? 'var(--accent)' : '#f59e0b' }}>{c.published ? "Publicado" : "Rascunho"}</Badge>
              </div>
              <CardContent className="p-4 space-y-3">
                <div><p className="text-base font-medium" style={{ color: txt }}>{c.title}</p><p className="text-xs mt-1 line-clamp-2" style={{ color: tsec }}>{c.description || "Sem descricao"}</p></div>
                <div className="flex items-center gap-4 text-xs" style={{ color: tsec }}>
                  <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" />{c.enrollments || 0} alunos</span>
                  <span className="flex items-center gap-1 font-medium" style={{ color: 'var(--accent)' }}><BookOpen className="w-3.5 h-3.5" />{c.price ? `R$ ${(c.price/100).toLocaleString('pt-BR',{minimumFractionDigits:2})}` : "Gratis"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" className="flex-1 text-xs h-8" style={{ borderColor: borderC, color: tsec }} onClick={() => updateC.mutate({ id: c.id, published: !c.published })}>{c.published ? "Despublicar" : "Publicar"}</Button>
                  <Button variant="ghost" size="icon" className="w-8 h-8 hover:text-red-400" style={{ color: tm }} onClick={() => { if (confirm('Excluir?')) deleteC.mutate({ id: c.id }); }}><Trash2 className="w-3.5 h-3.5" /></Button>
                </div>
                {c.modules && (c.modules as any[]).length > 0 && (
                  <div className="border-t pt-3" style={{ borderColor: borderC }}>
                    <button className="flex items-center gap-1 text-xs transition-colors" style={{ color: tm }} onClick={() => setExpanded(expanded === c.id ? null : c.id)}>
                      {expanded === c.id ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}{(c.modules as any[]).length} modulos
                    </button>
                    {expanded === c.id && <div className="mt-2 space-y-1">{(c.modules as any[]).map((m, i) => <div key={i} className="flex items-center gap-2 p-2 rounded-lg" style={{ background: elevBg }}><Play className="w-3 h-3" style={{ color: 'var(--accent)' }} /><span className="text-xs" style={{ color: txt }}>{m.title}</span></div>)}</div>}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>}
    </div>
  );
}
