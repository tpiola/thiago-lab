import { useState } from "react";
import { trpc } from "@/providers/trpc";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Trash2, Wand2, Sparkles, Image, Clapperboard, Type, Headphones, Globe } from "lucide-react";

const tools = [
  { type: "image", label: "Imagem", icon: Image, desc: "Gere imagens com IA", color: "#8b5cf6" },
  { type: "video", label: "Video", icon: Clapperboard, desc: "Gere videos com IA", color: "#f59e0b" },
  { type: "copy", label: "Copywriting", icon: Type, desc: "Textos persuasivos", color: "#00ff88" },
  { type: "audio", label: "Audio", icon: Headphones, desc: "Gere audio e voz", color: "#3b82f6" },
  { type: "site", label: "Site", icon: Globe, desc: "Gere paginas web", color: "#f97316" },
] as const;

const typeLabels: Record<string, string> = { image: "Imagem", video: "Video", copy: "Copy", audio: "Audio", site: "Site" };

const bg = 'var(--bg-secondary)';
const borderC = 'var(--border)';
const elevBg = 'var(--bg-card)';
const txt = 'var(--text)';
const tsec = 'var(--text-secondary)';
const tm = 'var(--text-muted)';
const ac = 'var(--accent)';

export default function AIStudio() {
  const utils = trpc.useUtils();
  const { data: generations, isLoading } = trpc.ai.list.useQuery();
  const createG = trpc.ai.create.useMutation({ onSuccess: () => { utils.ai.list.invalidate(); setPrompt(""); } });
  const completeG = trpc.ai.complete.useMutation({ onSuccess: () => utils.ai.list.invalidate() });
  const deleteG = trpc.ai.delete.useMutation({ onSuccess: () => utils.ai.list.invalidate() });
  const [selectedType, setSelectedType] = useState<string>("copy");
  const [prompt, setPrompt] = useState("");
  const [generating, setGenerating] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setGenerating(true);
    try {
      const result = await createG.mutateAsync({ type: selectedType as any, prompt });
      if (result) {
        setTimeout(async () => {
          await completeG.mutateAsync({ id: result.id, resultText: selectedType === "copy" ? genCopy(prompt) : undefined, resultUrl: ["image", "video", "audio"].includes(selectedType) ? `https://placehold.co/600x400/0e0e0e/00ff88?text=${selectedType.toUpperCase()}+AI` : undefined });
          setGenerating(false);
        }, 2000);
      }
    } catch { setGenerating(false); }
  };

  const filtered = generations?.filter(g => g.type === selectedType);

  return (
    <div className="p-4 lg:p-6 space-y-4">
      <div><h1 className="text-xl lg:text-2xl font-bold tracking-tight" style={{ color: txt }}>AI Studio</h1><p className="text-sm mt-0.5" style={{ color: tm }}>Gere conteudo com inteligencia artificial</p></div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {tools.map(tool => {
          const Icon = tool.icon;
          const active = selectedType === tool.type;
          return (
            <button key={tool.type} onClick={() => setSelectedType(tool.type)} className="flex flex-col items-center gap-2 p-4 rounded-xl border transition-all" style={active ? { borderColor: `${ac}40`, background: `${ac}08` } : { borderColor: borderC, background: bg }}>
              <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: `${tool.color}15` }}><Icon className="w-5 h-5" style={{ color: tool.color }} /></div>
              <div className="text-center"><p className="text-sm font-medium" style={{ color: active ? ac : txt }}>{tool.label}</p><p className="text-[10px]" style={{ color: tm }}>{tool.desc}</p></div>
            </button>
          );
        })}
      </div>
      <Card className="border" style={{ background: bg, borderColor: borderC }}>
        <CardContent className="p-4">
          <Textarea value={prompt} onChange={e => setPrompt(e.target.value)} placeholder="Descreva o que voce quer gerar..." className="border min-h-[100px] resize-none" style={{ background: elevBg, borderColor, color: txt }} />
          <div className="flex justify-between items-center mt-3">
            <div className="flex items-center gap-2"><Sparkles className="w-4 h-4" style={{ color: ac }} /><span className="text-xs" style={{ color: tm }}>{typeLabels[selectedType]} AI</span></div>
            <Button className="font-semibold text-xs" style={{ background: ac, color: '#000' }} disabled={!prompt.trim() || generating || createG.isPending} onClick={handleGenerate}><Wand2 className="w-4 h-4 mr-1" />{generating ? "Gerando..." : "Gerar"}</Button>
          </div>
        </CardContent>
      </Card>
      <div>
        <h2 className="text-sm font-medium mb-3" style={{ color: txt }}>Geracoes Recentes</h2>
        {isLoading ? <div className="space-y-3">{[...Array(3)].map((_,i) => <div key={i} className="h-24 rounded-xl animate-pulse" style={{ background: bg }} />)}</div> :
          filtered?.length === 0 ? <Card className="border" style={{ background: bg, borderColor: borderC }}><CardContent className="py-8 text-center"><Sparkles className="w-8 h-8 mx-auto mb-2" style={{ color: tm }} /><p className="text-sm" style={{ color: tsec }}>Nenhuma geracao ainda</p></CardContent></Card> :
          <div className="space-y-3">
            {filtered?.map(gen => (
              <Card key={gen.id} className="border" style={{ background: bg, borderColor: borderC }}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <Badge className="text-[10px] capitalize" style={{ background: `${ac}15`, color: ac }}>{gen.type}</Badge>
                        <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: gen.status === 'completed' ? `${ac}15` : gen.status === 'failed' ? '#ef444415' : '#f59e0b15', color: gen.status === 'completed' ? ac : gen.status === 'failed' ? '#ef4444' : '#f59e0b' }}>{gen.status}</span>
                      </div>
                      <p className="text-sm mt-2" style={{ color: txt }}>{gen.prompt}</p>
                      {gen.resultText && <div className="mt-2 p-3 rounded-lg whitespace-pre-wrap text-xs leading-relaxed" style={{ background: elevBg, color: tsec }}>{gen.resultText}</div>}
                      {gen.resultUrl && <div className="mt-2"><img src={gen.resultUrl} alt="AI" className="rounded-lg max-h-40 object-cover" /></div>}
                    </div>
                    <Button variant="ghost" size="icon" className="w-8 h-8 shrink-0 hover:text-red-400" style={{ color: tm }} onClick={() => { if (confirm('Excluir?')) deleteG.mutate({ id: gen.id }); }}><Trash2 className="w-3.5 h-3.5" /></Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>}
      </div>
    </div>
  );
}

function genCopy(prompt: string): string {
  const frameworks = [
    `**Headline AIDA:**\n\n**ATENCAO:** ${prompt} - Voce nao vai acreditar!\n\n**INTERESSE:** Milhares de pessoas ja usam esta tecnica secreta para triplicar resultados em 30 dias.\n\n**DESEJO:** Metodo comprovado, testado por 10.000+ alunos, resultados reais.\n\n**ACAO:** Clique agora - 50% OFF, vagas limitadas!`,
    `**Headline PAS:**\n\n**PROBLEMA:** Cansado de ${prompt} sem resultados?\n\n**AGITACAO:** A cada dia, concorrentes dominam o mercado enquanto voce fica para tras.\n\n**SOLUCAO:** Framework definitivo para ${prompt}. Passo-a-passo validado.`,
    `**Storytelling:**\n\n"Havia um homem que sonhava dominar ${prompt}. Todos diziam ser impossivel. Mas ele descobriu um segredo...\n\nEm 90 dias, transformou sua realidade. Hoje ensina milhares.\n\n**Voce pode ser a proxima historia de sucesso.**"`,
  ];
  return frameworks[Math.floor(Math.random() * frameworks.length)];
}
