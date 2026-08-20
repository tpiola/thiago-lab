import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Database, Plus, FileText, Table, Calendar, Link2,
  ChevronRight, Search, Star, Clock, Sparkles, Globe,
  CheckSquare, BookOpen, Zap, ExternalLink, Trash2
} from "lucide-react";

const bg = 'var(--bg-secondary)';
const borderC = 'var(--border)';
const elevBg = 'var(--bg-card)';
const txt = 'var(--text)';
const tsec = 'var(--text-secondary)';
const tm = 'var(--text-muted)';
const ac = 'var(--accent)';

const databaseTypes = [
  { key: "table", label: "Tabela", icon: Table },
  { key: "board", label: "Board", icon: Database },
  { key: "calendar", label: "Calendario", icon: Calendar },
  { key: "gallery", label: "Galeria", icon: Globe },
  { key: "list", label: "Lista", icon: FileText },
];

const samplePages = [
  { id: 1, title: "🚀 Estrategia de Negocio 2026", type: "doc", emoji: "🚀", lastEdited: "Hoje", starred: true, tags: ["estrategia", "negocio"] },
  { id: 2, title: "📊 CRM Dashboard", type: "database", emoji: "📊", lastEdited: "Ontem", starred: false, tags: ["crm", "vendas"] },
  { id: 3, title: "🤖 Prompts Hermes Agent", type: "doc", emoji: "🤖", lastEdited: "2 dias", starred: true, tags: ["ia", "hermes"] },
  { id: 4, title: "💰 Templates de Monetizacao", type: "database", emoji: "💰", lastEdited: "3 dias", starred: false, tags: ["monetizacao"] },
  { id: 5, title: "📅 Rotina Diaria", type: "doc", emoji: "📅", lastEdited: "Hoje", starred: false, tags: ["rotina"] },
  { id: 6, title: "🎯 OKRs Q3 2026", type: "database", emoji: "🎯", lastEdited: "4 dias", starred: true, tags: ["okr", "metas"] },
];

const sampleDb = [
  { id: 1, name: "Farmacia Economica", status: "Qualificado", valor: "R$ 5.400", resp: "Joao", data: "30/06" },
  { id: 2, name: "Rede Popular", status: "Proposta", valor: "R$ 12.800", resp: "Ana", data: "02/07" },
  { id: 3, name: "Drogaria SP", status: "Negociacao", valor: "R$ 24.500", resp: "Carlos", data: "05/07" },
  { id: 4, name: "Clinica Bem Estar", status: "Novo", valor: "R$ 8.900", resp: "Pedro", data: "10/07" },
];

const statusColors: Record<string, string> = {
  "Novo": "#3b82f6", "Qualificado": "#8b5cf6", "Proposta": "#f59e0b",
  "Negociacao": "#f97316", "Fechado": "#00ff88",
};

export default function Notion() {
  const [search, setSearch] = useState("");
  const [activeView, setActiveView] = useState("pages");
  const [dbView, setDbView] = useState("table");
  const [pages, setPages] = useState(samplePages);
  const [openNew, setOpenNew] = useState(false);
  const [newPage, setNewPage] = useState({ title: "", emoji: "📄", type: "doc", content: "" });
  const [selectedPage, setSelectedPage] = useState<any>(null);
  const [notionToken, setNotionToken] = useState(localStorage.getItem('notion-token') || '');
  const [tokenSaved, setTokenSaved] = useState(!!localStorage.getItem('notion-token'));

  const filteredPages = pages.filter(p =>
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    p.tags.some(t => t.includes(search.toLowerCase()))
  );

  const handleSaveToken = () => {
    localStorage.setItem('notion-token', notionToken);
    setTokenSaved(true);
  };

  const handleCreatePage = () => {
    if (!newPage.title.trim()) return;
    const page = { id: Date.now(), ...newPage, lastEdited: 'Agora', starred: false };
    setPages(prev => [page, ...prev]);
    setOpenNew(false);
    setNewPage({ title: "", emoji: "📄", type: "doc", content: "" });
  };

  const handleDeletePage = (id: number) => {
    setPages(prev => prev.filter(p => p.id !== id));
    if (selectedPage?.id === id) setSelectedPage(null);
  };

  return (
    <div className="p-4 lg:p-6 space-y-4 h-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: '#ffffff10', border: '1px solid #ffffff20' }}>
            <Database className="w-5 h-5" style={{ color: '#ffffff' }} />
          </div>
          <div>
            <h1 className="text-xl lg:text-2xl font-bold tracking-tight" style={{ color: txt }}>Notion</h1>
            <p className="text-sm mt-0.5" style={{ color: tm }}>Base de conhecimento e gestao integrada</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Dialog open={openNew} onOpenChange={setOpenNew}>
            <DialogTrigger asChild>
              <Button className="font-semibold shrink-0 text-xs h-8" style={{ background: ac, color: '#000' }}>
                <Plus className="w-3.5 h-3.5 mr-1" /> Nova Pagina
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md border" style={{ background: bg, borderColor: borderC }}>
              <DialogHeader><DialogTitle style={{ color: txt }}>Nova Pagina</DialogTitle></DialogHeader>
              <div className="space-y-3">
                <div className="flex gap-2">
                  <div>
                    <Label className="text-xs" style={{ color: tm }}>Emoji</Label>
                    <Input value={newPage.emoji} onChange={e => setNewPage({...newPage, emoji: e.target.value})} className="mt-1 border w-16 text-center" style={{ background: elevBg, borderColor, color: txt }} />
                  </div>
                  <div className="flex-1">
                    <Label className="text-xs" style={{ color: tm }}>Titulo *</Label>
                    <Input value={newPage.title} onChange={e => setNewPage({...newPage, title: e.target.value})} className="mt-1 border" style={{ background: elevBg, borderColor, color: txt }} placeholder="Nome da pagina" />
                  </div>
                </div>
                <div>
                  <Label className="text-xs" style={{ color: tm }}>Tipo</Label>
                  <Select value={newPage.type} onValueChange={v => setNewPage({...newPage, type: v})}>
                    <SelectTrigger className="mt-1 border text-xs" style={{ background: elevBg, borderColor, color: txt }}><SelectValue /></SelectTrigger>
                    <SelectContent style={{ background: elevBg, borderColor }}>
                      <SelectItem value="doc" style={{ color: txt }}>Documento</SelectItem>
                      <SelectItem value="database" style={{ color: txt }}>Database</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-xs" style={{ color: tm }}>Conteudo inicial</Label>
                  <Textarea value={newPage.content} onChange={e => setNewPage({...newPage, content: e.target.value})} className="mt-1 border min-h-[80px]" style={{ background: elevBg, borderColor, color: txt }} placeholder="Comece a escrever..." />
                </div>
                <Button className="w-full font-semibold" style={{ background: ac, color: '#000' }} onClick={handleCreatePage}>Criar Pagina</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Notion Token Config */}
      {!tokenSaved && (
        <Card className="border" style={{ background: '#f59e0b08', borderColor: '#f59e0b30' }}>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <Zap className="w-4 h-4" style={{ color: '#f59e0b' }} />
              <p className="text-sm font-medium" style={{ color: '#f59e0b' }}>Conectar Notion API</p>
            </div>
            <p className="text-xs mb-3" style={{ color: tm }}>
              Para sincronizar com seu workspace Notion real, adicione seu Integration Token.
              Crie em: <a href="https://www.notion.so/my-integrations" target="_blank" rel="noreferrer" className="underline" style={{ color: ac }}>notion.so/my-integrations</a>
            </p>
            <div className="flex gap-2">
              <Input value={notionToken} onChange={e => setNotionToken(e.target.value)} placeholder="secret_xxxx..." className="border flex-1 text-xs" style={{ background: elevBg, borderColor, color: txt }} />
              <Button onClick={handleSaveToken} className="text-xs" style={{ background: ac, color: '#000' }}>Salvar</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* View Tabs */}
      <div className="flex gap-2">
        {[{ key: "pages", label: "Paginas", icon: FileText }, { key: "database", label: "Database", icon: Table }, { key: "workspace", label: "Workspace", icon: Globe }].map(v => (
          <button key={v.key} onClick={() => setActiveView(v.key)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-all" style={activeView === v.key ? { background: ac, color: '#000' } : { background: bg, color: tm, border: `1px solid ${borderC}` }}>
            <v.icon className="w-3.5 h-3.5" />{v.label}
          </button>
        ))}
      </div>

      {/* Pages View */}
      {activeView === "pages" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-full">
          {/* Sidebar */}
          <div className="space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: tm }} />
              <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar paginas..." className="pl-10 border text-xs" style={{ background: bg, borderColor, color: txt }} />
            </div>

            {filteredPages.filter(p => p.starred).length > 0 && (
              <div>
                <p className="text-[10px] uppercase tracking-wider mb-2 flex items-center gap-1" style={{ color: tm }}><Star className="w-3 h-3" /> Favoritas</p>
                {filteredPages.filter(p => p.starred).map(p => (
                  <div key={p.id} onClick={() => setSelectedPage(p)} className="flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-all group" style={selectedPage?.id === p.id ? { background: `${ac}15` } : { hover: 'opacity-80' }}>
                    <span className="text-base">{p.emoji}</span>
                    <span className="text-xs truncate flex-1" style={{ color: selectedPage?.id === p.id ? ac : txt }}>{p.title.replace(/^[^ ]+ /, '')}</span>
                    <button className="opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => { e.stopPropagation(); handleDeletePage(p.id); }}><Trash2 className="w-3 h-3" style={{ color: tm }} /></button>
                  </div>
                ))}
              </div>
            )}

            <div>
              <p className="text-[10px] uppercase tracking-wider mb-2" style={{ color: tm }}>Todas as Paginas</p>
              {filteredPages.map(p => (
                <div key={p.id} onClick={() => setSelectedPage(p)} className="flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-all group" style={selectedPage?.id === p.id ? { background: `${ac}15` } : {}}>
                  <span className="text-sm">{p.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs truncate" style={{ color: selectedPage?.id === p.id ? ac : txt }}>{p.title.replace(/^[^ ]+ /, '')}</p>
                    <p className="text-[9px]" style={{ color: tm }}>{p.lastEdited}</p>
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {p.type === 'database' ? <Table className="w-3 h-3" style={{ color: tm }} /> : <FileText className="w-3 h-3" style={{ color: tm }} />}
                    <button onClick={(e) => { e.stopPropagation(); handleDeletePage(p.id); }}><Trash2 className="w-3 h-3" style={{ color: tm }} /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Content Area */}
          <div className="lg:col-span-2">
            {selectedPage ? (
              <Card className="border h-full" style={{ background: bg, borderColor }}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="text-4xl mb-2">{selectedPage.emoji}</div>
                      <h2 className="text-xl font-bold" style={{ color: txt }}>{selectedPage.title.replace(/^[^ ]+ /, '')}</h2>
                      <div className="flex items-center gap-2 mt-1">
                        <Clock className="w-3 h-3" style={{ color: tm }} />
                        <span className="text-xs" style={{ color: tm }}>Editado {selectedPage.lastEdited}</span>
                        <Badge className="text-[9px]" style={{ background: selectedPage.type === 'database' ? '#3b82f615' : '#8b5cf615', color: selectedPage.type === 'database' ? '#3b82f6' : '#8b5cf6' }}>{selectedPage.type === 'database' ? 'Database' : 'Documento'}</Badge>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {selectedPage.starred && <Star className="w-4 h-4" style={{ color: '#f59e0b' }} fill="#f59e0b" />}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1 mb-4">
                    {selectedPage.tags.map((tag: string) => (
                      <Badge key={tag} className="text-[10px]" style={{ background: elevBg, color: tm }}>#{tag}</Badge>
                    ))}
                  </div>
                  <div className="border-t pt-4" style={{ borderColor }}>
                    <p className="text-sm leading-relaxed" style={{ color: tsec }}>
                      {selectedPage.id === 1 && "Estrategia de crescimento para 2026. Foco em automacao, IA e escalonamento organico. Meta: R$ 100K/mes ate dezembro.\n\n**Pilares:**\n1. Hermes OS como centro nervoso\n2. Notion como base de conhecimento\n3. n8n para automacoes\n4. Conteudo organico + comunidades"}
                      {selectedPage.id === 2 && "Dashboard integrado com CRM para gestao de leads. Conectado ao pipeline de vendas com atualizacoes em tempo real."}
                      {selectedPage.id === 3 && "Colecao de prompts otimizados para o Hermes Agent. Inclui templates para CRM, pesquisa, geracao de conteudo e automacoes."}
                      {selectedPage.id === 4 && "Templates prontos para monetizacao organica. SaaS, Agencia, Cursos, Afiliados, Comunidades e mais."}
                      {selectedPage.id === 5 && "Rotina diaria para maximizar produtividade. 5h-6h: Deep work. 8h-12h: Reunioes e vendas. 14h-17h: Criacao de conteudo."}
                      {selectedPage.id === 6 && "OKRs do Q3 2026. Objetivo: Escalar para R$ 50K/mes. Key Results: 200 leads/mes, 15% conversao, 3 novos produtos."}
                      {!([1,2,3,4,5,6].includes(selectedPage.id)) && (selectedPage.content || "Conteudo da pagina. Clique para editar...")}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="border h-64 flex items-center justify-center" style={{ background: bg, borderColor }}>
                <CardContent className="text-center">
                  <Database className="w-12 h-12 mx-auto mb-3" style={{ color: tm }} />
                  <p className="text-sm font-medium" style={{ color: tsec }}>Selecione uma pagina</p>
                  <p className="text-xs mt-1" style={{ color: tm }}>Ou crie uma nova</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      )}

      {/* Database View */}
      {activeView === "database" && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium" style={{ color: txt }}>CRM Database</p>
            <div className="flex gap-1 ml-auto">
              {databaseTypes.map(v => (
                <button key={v.key} onClick={() => setDbView(v.key)} className="flex items-center gap-1 px-2.5 py-1 rounded text-xs" style={dbView === v.key ? { background: ac, color: '#000' } : { background: bg, color: tm, border: `1px solid ${borderC}` }}>
                  <v.icon className="w-3 h-3" />{v.label}
                </button>
              ))}
            </div>
          </div>

          {dbView === "table" && (
            <Card className="border" style={{ background: bg, borderColor }}>
              <CardContent className="p-0 overflow-auto">
                <table className="w-full">
                  <thead>
                    <tr style={{ borderBottom: `1px solid ${borderC}` }}>
                      {["Nome", "Status", "Valor", "Responsavel", "Data"].map(h => (
                        <th key={h} className="px-4 py-3 text-left text-[10px] uppercase tracking-wider" style={{ color: tm }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {sampleDb.map(row => (
                      <tr key={row.id} style={{ borderBottom: `1px solid ${borderC}40` }} className="hover:opacity-80 transition-opacity">
                        <td className="px-4 py-3 text-sm font-medium" style={{ color: txt }}>{row.name}</td>
                        <td className="px-4 py-3">
                          <Badge className="text-[10px]" style={{ background: `${statusColors[row.status] || '#444'}15`, color: statusColors[row.status] || '#888' }}>{row.status}</Badge>
                        </td>
                        <td className="px-4 py-3 text-sm font-medium" style={{ color: ac }}>{row.valor}</td>
                        <td className="px-4 py-3 text-sm" style={{ color: tsec }}>{row.resp}</td>
                        <td className="px-4 py-3 text-xs" style={{ color: tm }}>{row.data}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          )}

          {dbView === "board" && (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {["Novo", "Qualificado", "Proposta", "Negociacao"].map(status => (
                <div key={status}>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 rounded-full" style={{ background: statusColors[status] }} />
                    <p className="text-xs font-medium" style={{ color: txt }}>{status}</p>
                    <Badge className="text-[9px] ml-auto" style={{ background: elevBg, color: tm }}>{sampleDb.filter(r => r.status === status).length}</Badge>
                  </div>
                  <div className="space-y-2">
                    {sampleDb.filter(r => r.status === status).map(row => (
                      <Card key={row.id} className="border" style={{ background: elevBg, borderColor }}>
                        <CardContent className="p-3">
                          <p className="text-xs font-medium" style={{ color: txt }}>{row.name}</p>
                          <p className="text-[10px] mt-1 font-medium" style={{ color: ac }}>{row.valor}</p>
                          <p className="text-[9px] mt-1" style={{ color: tm }}>{row.resp} · {row.data}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {(dbView === "calendar" || dbView === "gallery" || dbView === "list") && (
            <Card className="border" style={{ background: bg, borderColor }}>
              <CardContent className="py-12 text-center">
                <Database className="w-10 h-10 mx-auto mb-3" style={{ color: tm }} />
                <p className="text-sm" style={{ color: tsec }}>Vista {dbView} em desenvolvimento</p>
                <p className="text-xs mt-1" style={{ color: tm }}>Use a vista Tabela ou Board por enquanto</p>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Workspace View */}
      {activeView === "workspace" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <Card className="border lg:col-span-2" style={{ background: bg, borderColor }}>
              <CardContent className="p-4">
                <p className="text-xs font-semibold mb-3" style={{ color: txt }}>Workspace Overview</p>
                <div className="grid grid-cols-3 gap-3 mb-4">
                  {[{ label: "Paginas", value: pages.length, icon: FileText, color: "#3b82f6" },{ label: "Databases", value: pages.filter(p => p.type === 'database').length, icon: Table, color: "#8b5cf6" },{ label: "Favoritos", value: pages.filter(p => p.starred).length, icon: Star, color: "#f59e0b" }].map(s => (
                    <div key={s.label} className="text-center p-3 rounded-lg" style={{ background: elevBg }}>
                      <s.icon className="w-4 h-4 mx-auto mb-1" style={{ color: s.color }} />
                      <p className="text-xl font-bold" style={{ color: txt }}>{s.value}</p>
                      <p className="text-[10px]" style={{ color: tm }}>{s.label}</p>
                    </div>
                  ))}
                </div>
                <div>
                  <p className="text-xs font-medium mb-2" style={{ color: tm }}>Editados recentemente</p>
                  {pages.slice(0, 4).map(p => (
                    <div key={p.id} className="flex items-center gap-2 py-2 border-b last:border-0" style={{ borderColor: `${borderC}50` }}>
                      <span>{p.emoji}</span>
                      <span className="text-xs flex-1 truncate" style={{ color: txt }}>{p.title.replace(/^[^ ]+ /, '')}</span>
                      <span className="text-[10px]" style={{ color: tm }}>{p.lastEdited}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="space-y-3">
              <Card className="border" style={{ background: bg, borderColor }}>
                <CardContent className="p-4">
                  <p className="text-xs font-semibold mb-3 flex items-center gap-1" style={{ color: txt }}><Sparkles className="w-3.5 h-3.5" style={{ color: ac }} /> Integracao Hermes</p>
                  <p className="text-xs mb-3" style={{ color: tsec }}>O Hermes Agent usa seu Notion como memoria persistente e base de conhecimento.</p>
                  <div className="space-y-2">
                    {[{ label: "Salva contexto automaticamente", enabled: true },{ label: "Acessa databases em tempo real", enabled: true },{ label: "Cria paginas por comando", enabled: true },{ label: "Sincroniza com CRM", enabled: tokenSaved }].map(f => (
                      <div key={f.label} className="flex items-center gap-2">
                        <CheckSquare className="w-3.5 h-3.5 shrink-0" style={{ color: f.enabled ? ac : tm }} />
                        <span className="text-[11px]" style={{ color: f.enabled ? tsec : tm }}>{f.label}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="border" style={{ background: bg, borderColor }}>
                <CardContent className="p-4">
                  <p className="text-xs font-semibold mb-2" style={{ color: txt }}>Links Rapidos</p>
                  {[{ label: "Notion.so", url: "https://notion.so", icon: Globe },{ label: "My Integrations", url: "https://notion.so/my-integrations", icon: Link2 },{ label: "API Docs", url: "https://developers.notion.com", icon: BookOpen }].map(l => (
                    <a key={l.label} href={l.url} target="_blank" rel="noreferrer" className="flex items-center gap-2 py-2 border-b last:border-0 hover:opacity-80 transition-opacity" style={{ borderColor: `${borderC}50` }}>
                      <l.icon className="w-3.5 h-3.5" style={{ color: tm }} />
                      <span className="text-xs flex-1" style={{ color: txt }}>{l.label}</span>
                      <ExternalLink className="w-3 h-3" style={{ color: tm }} />
                    </a>
                  ))}
                </CardContent>
              </Card>

              {tokenSaved && (
                <Card className="border" style={{ background: '#00ff8808', borderColor: '#00ff8830' }}>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                      <p className="text-xs font-medium" style={{ color: '#00ff88' }}>Notion Conectado</p>
                    </div>
                    <p className="text-[11px] mt-1" style={{ color: tm }}>Token salvo. O Hermes pode acessar seu workspace.</p>
                    <button onClick={() => { localStorage.removeItem('notion-token'); setNotionToken(''); setTokenSaved(false); }} className="text-[10px] mt-2" style={{ color: tm }}>Desconectar</button>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
  }
