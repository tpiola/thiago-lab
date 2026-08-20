import { useState } from "react";
import { trpc } from "@/providers/trpc";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Plus, Globe, ExternalLink, Eye, Trash2, Smartphone, Monitor, Tablet } from "lucide-react";

const tL: Record<string, string> = { landing: "Landing Page", website: "Website", funnel: "Funil", store: "Loja" };
const tC: Record<string, string> = { landing: "#8b5cf6", website: "#3b82f6", funnel: "#00ff88", store: "#f97316" };
const bg = 'var(--bg-secondary)';
const borderC = 'var(--border)';
const elevBg = 'var(--bg-card)';
const txt = 'var(--text)';
const tsec = 'var(--text-secondary)';
const tm = 'var(--text-muted)';
const ac = 'var(--accent)';

export default function Sites() {
  const utils = trpc.useUtils();
  const { data: sites, isLoading } = trpc.site.list.useQuery();
  const createS = trpc.site.create.useMutation({ onSuccess: () => { utils.site.list.invalidate(); setOpen(false); setForm({ name: "", slug: "", type: "landing" }); } });
  const updateS = trpc.site.update.useMutation({ onSuccess: () => utils.site.list.invalidate() });
  const deleteS = trpc.site.delete.useMutation({ onSuccess: () => utils.site.list.invalidate() });
  const [open, setOpen] = useState(false);
  const [previewSite, setPreviewSite] = useState<any>(null);
  const [form, setForm] = useState({ name: "", slug: "", type: "landing" });

  return (
    <div className="p-4 lg:p-6 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div><h1 className="text-xl lg:text-2xl font-bold tracking-tight" style={{ color: txt }}>Sites & Paginas</h1><p className="text-sm mt-0.5" style={{ color: tm }}>Crie landing pages, sites e lojas</p></div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button className="font-semibold shrink-0 text-xs h-8" style={{ background: ac, color: '#000' }}><Plus className="w-3.5 h-3.5 mr-1" /> Novo Site</Button></DialogTrigger>
          <DialogContent className="max-w-md border" style={{ background: bg, borderColor: borderC }}>
            <DialogHeader><DialogTitle style={{ color: txt }}>Novo Site</DialogTitle></DialogHeader>
            <form onSubmit={e => { e.preventDefault(); createS.mutate({ name: form.name, slug: form.slug || form.name.toLowerCase().replace(/\s+/g, "-"), type: form.type as any }); }} className="space-y-3">
              <div><Label className="text-xs" style={{ color: tm }}>Nome *</Label><Input value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="mt-1 border" style={{ background: elevBg, borderColor, color: txt }} required /></div>
              <div><Label className="text-xs" style={{ color: tm }}>Slug (URL)</Label><Input value={form.slug} onChange={e => setForm({...form, slug: e.target.value})} className="mt-1 border" style={{ background: elevBg, borderColor, color: txt }} placeholder="meu-site" /></div>
              <div><Label className="text-xs" style={{ color: tm }}>Tipo</Label>
                <Select value={form.type} onValueChange={v => setForm({...form, type: v})}>
                  <SelectTrigger className="mt-1 border text-xs" style={{ background: elevBg, borderColor, color: txt }}><SelectValue /></SelectTrigger>
                  <SelectContent style={{ background: elevBg, borderColor }}>{Object.entries(tL).map(([k,l]) => <SelectItem key={k} value={k} className="text-xs" style={{ color: txt }}>{l}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <Button type="submit" className="w-full font-semibold" style={{ background: ac, color: '#000' }} disabled={createS.isPending}>{createS.isPending ? "Criando..." : "Criar Site"}</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      {previewSite && <Dialog open={!!previewSite} onOpenChange={() => setPreviewSite(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] p-0 overflow-hidden border" style={{ background: bg, borderColor: borderC }}>
          <div className="flex items-center justify-between p-3 border-b" style={{ borderColor: borderC }}>
            <div className="flex items-center gap-2"><Globe className="w-4 h-4" style={{ color: ac }} /><span className="text-sm font-medium" style={{ color: txt }}>{previewSite.name}</span><Badge className="text-[10px]" style={{ background: `${tC[previewSite.type]}15`, color: tC[previewSite.type] }}>{tL[previewSite.type]}</Badge></div>
            <div className="flex items-center gap-1"><Smartphone className="w-4 h-4" style={{ color: tm }} /><Tablet className="w-4 h-4" style={{ color: tm }} /><Monitor className="w-4 h-4" style={{ color: ac }} /></div>
          </div>
          <div className="h-[70vh] overflow-auto bg-white"><PreviewHTML site={previewSite} /></div>
        </DialogContent>
      </Dialog>}
      {isLoading ? <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">{[...Array(3)].map((_,i) => <div key={i} className="h-48 rounded-xl animate-pulse" style={{ background: bg }} />)}</div> :
        sites?.length === 0 ? <Card className="border" style={{ background: bg, borderColor: borderC }}><CardContent className="py-12 text-center"><Globe className="w-10 h-10 mx-auto mb-3" style={{ color: tm }} /><p style={{ color: tsec }}>Nenhum site criado</p></CardContent></Card> :
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sites?.map(s => (
            <Card key={s.id} className="border overflow-hidden transition-all hover:opacity-90" style={{ background: bg, borderColor: borderC }}>
              <div className="h-28 flex items-center justify-center relative" style={{ background: elevBg }}>
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at center, var(--accent) 1px, transparent 1px)', backgroundSize: '16px 16px' }} />
                <Globe className="w-10 h-10 relative z-10" style={{ color: ac, opacity: 0.3 }} />
                <Badge className="absolute top-3 right-3 text-[10px]" style={{ background: `${tC[s.type]}15`, color: tC[s.type] }}>{tL[s.type]}</Badge>
              </div>
              <CardContent className="p-4 space-y-3">
                <div><p className="text-sm font-medium" style={{ color: txt }}>{s.name}</p><p className="text-xs" style={{ color: tm }}>/{s.slug}</p></div>
                <div className="flex items-center gap-3 text-xs">
                  <span className="flex items-center gap-1" style={{ color: tsec }}><Eye className="w-3 h-3" />{s.visits || 0} visitas</span>
                  <Badge className="text-[10px]" style={{ background: s.published ? `${ac}15` : '#f59e0b15', color: s.published ? ac : '#f59e0b' }}>{s.published ? "Publicado" : "Rascunho"}</Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" className="flex-1 text-xs h-8" style={{ borderColor, color: tsec }} onClick={() => setPreviewSite(s)}><ExternalLink className="w-3 h-3 mr-1" /> Visualizar</Button>
                  <Button variant="outline" size="sm" className="flex-1 text-xs h-8" style={{ borderColor, color: tsec }} onClick={() => updateS.mutate({ id: s.id, published: !s.published })}>{s.published ? "Despublicar" : "Publicar"}</Button>
                  <Button variant="ghost" size="icon" className="w-8 h-8 hover:text-red-400" style={{ color: tm }} onClick={() => { if (confirm('Excluir?')) deleteS.mutate({ id: s.id }); }}><Trash2 className="w-3.5 h-3.5" /></Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>}
    </div>
  );
}

function PreviewHTML({ site }: { site: any }) {
  const html = `<!DOCTYPE html><html lang="pt-BR"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>${site.name}</title><style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:Inter,system-ui,sans-serif;color:#333;line-height:1.6}.hero{background:linear-gradient(135deg,#070707 0%,#161616 100%);color:white;padding:80px 20px;text-align:center}.hero h1{font-size:2.5rem;font-weight:800;margin-bottom:16px}.hero p{font-size:1.1rem;color:#888;max-width:600px;margin:0 auto 32px}.btn{display:inline-block;padding:14px 32px;background:#00ff88;color:#000;text-decoration:none;border-radius:8px;font-weight:600}.features{padding:60px 20px;max-width:1000px;margin:0 auto}.features h2{text-align:center;font-size:1.8rem;margin-bottom:40px}.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:24px}.feature{padding:24px;border:1px solid #eee;border-radius:12px}.feature h3{font-size:1.1rem;margin-bottom:8px}.feature p{color:#666;font-size:.9rem}.cta{background:#f8f8f8;padding:60px 20px;text-align:center}.cta h2{font-size:1.8rem;margin-bottom:16px}footer{background:#070707;color:#888;text-align:center;padding:24px;font-size:.85rem}</style></head><body><section class="hero"><h1>${site.name}</h1><p>Uma pagina de alta conversao criada com a Thiagolab. Transforme visitantes em clientes.</p><a href="#" class="btn">Comecar Agora</a></section><section class="features"><h2>Recursos</h2><div class="grid"><div class="feature"><h3>Alta Conversao</h3><p>Otimizado para gerar leads e vendas.</p></div><div class="feature"><h3>Design Responsivo</h3><p>Funciona em qualquer dispositivo.</p></div><div class="feature"><h3>Analytics</h3><p>Acompanhe visitas em tempo real.</p></div></div></section><section class="cta"><h2>Pronto para comecar?</h2><p>Junte-se a milhares de empreendedores.</p><br><a href="#" class="btn">Garantir Acesso</a></section><footer><p>2026 ${site.name} - Criado com Thiagolab</p></footer></body></html>`;
  return <iframe srcDoc={html} className="w-full h-full border-0" title={site.name} />;
}
