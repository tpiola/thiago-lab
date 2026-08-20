import { useState } from "react";
import { trpc } from "@/providers/trpc";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { MessageCircle, Users, Heart, Send, Trash2, ChevronLeft, Plus } from "lucide-react";
import { Label } from "@/components/ui/label";

const bg = 'var(--bg-secondary)';
const borderC = 'var(--border)';
const elevBg = 'var(--bg-card)';
const txt = 'var(--text)';
const tsec = 'var(--text-secondary)';
const tm = 'var(--text-muted)';
const ac = 'var(--accent)';

export default function Communities() {
  const utils = trpc.useUtils();
  const { data: communities, isLoading } = trpc.community.list.useQuery();
  const createC = trpc.community.create.useMutation({ onSuccess: () => { utils.community.list.invalidate(); setOpen(false); setForm({ name: "", description: "" }); } });
  const addPost = trpc.community.addPost.useMutation({ onSuccess: () => { utils.community.list.invalidate(); setPostContent(""); } });
  const deleteC = trpc.community.delete.useMutation({ onSuccess: () => { utils.community.list.invalidate(); setActive(null); } });
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<number | null>(null);
  const [form, setForm] = useState({ name: "", description: "" });
  const [postContent, setPostContent] = useState("");

  const activeComm = communities?.find(c => c.id === active);
  if (active && activeComm) return (
    <div className="p-4 lg:p-6 space-y-4">
      <div className="flex items-center gap-3">
        <button onClick={() => setActive(null)} className="w-8 h-8 flex items-center justify-center" style={{ color: tm }}><ChevronLeft className="w-5 h-5" /></button>
        <div className="flex-1 min-w-0"><h1 className="text-lg font-bold truncate" style={{ color: txt }}>{activeComm.name}</h1><p className="text-xs" style={{ color: tm }}>{activeComm.members || 0} membros</p></div>
        <button onClick={() => { if (confirm('Excluir?')) deleteC.mutate({ id: activeComm.id }); }} className="w-8 h-8 flex items-center justify-center hover:text-red-400" style={{ color: tm }}><Trash2 className="w-4 h-4" /></button>
      </div>
      <Card className="border" style={{ background: bg, borderColor: borderC }}><CardContent className="p-4">
        <Textarea value={postContent} onChange={e => setPostContent(e.target.value)} placeholder="Compartilhe algo..." className="border min-h-[80px] resize-none" style={{ background: elevBg, borderColor: borderC, color: txt }} />
        <div className="flex justify-end mt-2"><Button className="text-xs h-8 font-semibold" style={{ background: ac, color: '#000' }} disabled={!postContent.trim() || addPost.isPending} onClick={() => addPost.mutate({ id: activeComm.id, author: "Thiago", content: postContent })}><Send className="w-3.5 h-3.5 mr-1" /> Publicar</Button></div>
      </CardContent></Card>
      <div className="space-y-3">
        {activeComm.posts && (activeComm.posts as any[]).length > 0 ? (activeComm.posts as any[]).map((post, i) => (
          <Card key={i} className="border" style={{ background: bg, borderColor: borderC }}><CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0" style={{ background: `${ac}20` }}><span className="text-xs font-bold" style={{ color: ac }}>{(post.author as string)?.[0] || "U"}</span></div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2"><span className="text-sm font-medium" style={{ color: txt }}>{post.author}</span><span className="text-[10px]" style={{ color: tm }}>{post.createdAt ? new Date(post.createdAt).toLocaleDateString('pt-BR') : ''}</span></div>
                <p className="text-sm mt-1" style={{ color: tsec }}>{post.content}</p>
                <div className="flex items-center gap-1 mt-2"><button className="h-6 px-2 text-xs flex items-center gap-1" style={{ color: tm }}><Heart className="w-3 h-3" /> {post.likes || 0}</button></div>
              </div>
            </div>
          </CardContent></Card>
        )) : <Card className="border" style={{ background: bg, borderColor: borderC }}><CardContent className="py-8 text-center"><MessageCircle className="w-8 h-8 mx-auto mb-2" style={{ color: tm }} /><p className="text-sm" style={{ color: tsec }}>Sem posts ainda. Seja o primeiro!</p></CardContent></Card>}
      </div>
    </div>
  );

  return (
    <div className="p-4 lg:p-6 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div><h1 className="text-xl lg:text-2xl font-bold tracking-tight" style={{ color: txt }}>Comunidades</h1><p className="text-sm mt-0.5" style={{ color: tm }}>Crie comunidades e engaje seu publico</p></div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button className="font-semibold shrink-0 text-xs h-8" style={{ background: ac, color: '#000' }}><Plus className="w-3.5 h-3.5 mr-1" /> Nova Comunidade</Button></DialogTrigger>
          <DialogContent className="max-w-md border" style={{ background: bg, borderColor: borderC }}>
            <DialogHeader><DialogTitle style={{ color: txt }}>Nova Comunidade</DialogTitle></DialogHeader>
            <form onSubmit={e => { e.preventDefault(); createC.mutate({ name: form.name, description: form.description || undefined }); }} className="space-y-3">
              <div><Label className="text-xs" style={{ color: tm }}>Nome *</Label><Input value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="mt-1 border" style={{ background: elevBg, borderColor: borderC, color: txt }} required /></div>
              <div><Label className="text-xs" style={{ color: tm }}>Descricao</Label><Textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="mt-1 border" style={{ background: elevBg, borderColor: borderC, color: txt }} /></div>
              <Button type="submit" className="w-full font-semibold" style={{ background: ac, color: '#000' }} disabled={createC.isPending}>{createC.isPending ? "Criando..." : "Criar"}</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      {isLoading ? <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{[...Array(4)].map((_,i) => <div key={i} className="h-40 rounded-xl animate-pulse" style={{ background: bg }} />)}</div> :
        communities?.length === 0 ? <Card className="border" style={{ background: bg, borderColor: borderC }}><CardContent className="py-12 text-center"><MessageCircle className="w-10 h-10 mx-auto mb-3" style={{ color: tm }} /><p style={{ color: tsec }}>Nenhuma comunidade criada</p></CardContent></Card> :
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {communities?.map(c => (
            <Card key={c.id} className="border transition-all hover:opacity-90 cursor-pointer" style={{ background: bg, borderColor: borderC }} onClick={() => setActive(c.id)}>
              <CardContent className="p-5">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${ac}15` }}><MessageCircle className="w-5 h-5" style={{ color: ac }} /></div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium" style={{ color: txt }}>{c.name}</h3>
                    <p className="text-xs mt-0.5 line-clamp-2" style={{ color: tsec }}>{c.description || "Sem descricao"}</p>
                    <div className="flex items-center gap-3 mt-3 text-xs" style={{ color: tm }}>
                      <span className="flex items-center gap-1"><Users className="w-3 h-3" />{c.members || 0} membros</span>
                      <span className="flex items-center gap-1"><MessageCircle className="w-3 h-3" />{(c.posts as any[])?.length || 0} posts</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>}
    </div>
  );
}


