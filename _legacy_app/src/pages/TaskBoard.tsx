import { useState } from "react";
import { trpc } from "@/providers/trpc";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2, ArrowRight, ArrowLeft } from "lucide-react";

const columns = [
  { key: "todo", label: "A Fazer", color: "#444" },
  { key: "in_progress", label: "Em Progresso", color: "#3b82f6" },
  { key: "review", label: "Revisao", color: "#f59e0b" },
  { key: "done", label: "Concluido", color: "#00ff88" },
] as const;

const prC: Record<string, string> = { low: "#444", medium: "#f59e0b", high: "#ef4444" };
const bg = 'var(--bg-secondary)';
const borderC = 'var(--border)';
const elevBg = 'var(--bg-card)';
const txt = 'var(--text)';
const tm = 'var(--text-muted)';
const ac = 'var(--accent)';

export default function TaskBoard() {
  const utils = trpc.useUtils();
  const { data: allTasks, isLoading } = trpc.task.list.useQuery();
  const createT = trpc.task.create.useMutation({ onSuccess: () => { utils.task.list.invalidate(); setOpen(false); setForm({ title: "", description: "", priority: "medium", assignee: "", dueDate: "" }); } });
  const updateT = trpc.task.update.useMutation({ onSuccess: () => utils.task.list.invalidate() });
  const deleteT = trpc.task.delete.useMutation({ onSuccess: () => utils.task.list.invalidate() });
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", priority: "medium" as const, assignee: "", dueDate: "" });

  const moveTask = (taskId: number, currentStatus: string, direction: "next" | "prev") => { const idx = columns.findIndex(c => c.key === currentStatus); const newIdx = direction === "next" ? Math.min(idx + 1, columns.length - 1) : Math.max(idx - 1, 0); updateT.mutate({ id: taskId, status: columns[newIdx].key as any }); };

  return (
    <div className="p-4 lg:p-6 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div><h1 className="text-xl lg:text-2xl font-bold tracking-tight" style={{ color: txt }}>Tarefas</h1><p className="text-sm mt-0.5" style={{ color: tm }}>Kanban de tarefas e atividades</p></div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button className="font-semibold shrink-0 text-xs h-8" style={{ background: ac, color: '#000' }}><Plus className="w-3.5 h-3.5 mr-1" /> Nova Tarefa</Button></DialogTrigger>
          <DialogContent className="max-w-md border" style={{ background: bg, borderColor: borderC }}>
            <DialogHeader><DialogTitle style={{ color: txt }}>Nova Tarefa</DialogTitle></DialogHeader>
            <form onSubmit={e => { e.preventDefault(); createT.mutate({ title: form.title, description: form.description || undefined, priority: form.priority, assignee: form.assignee || undefined, dueDate: form.dueDate || undefined }); }} className="space-y-3">
              <div><Label className="text-xs" style={{ color: tm }}>Titulo *</Label><Input value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="mt-1 border" style={{ background: elevBg, borderColor, color: txt }} required /></div>
              <div><Label className="text-xs" style={{ color: tm }}>Descricao</Label><Textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="mt-1 border min-h-[60px]" style={{ background: elevBg, borderColor, color: txt }} /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label className="text-xs" style={{ color: tm }}>Prioridade</Label>
                  <Select value={form.priority} onValueChange={v => setForm({...form, priority: v as any})}>
                    <SelectTrigger className="mt-1 border text-xs" style={{ background: elevBg, borderColor, color: txt }}><SelectValue /></SelectTrigger>
                    <SelectContent style={{ background: elevBg, borderColor }}>
                      <SelectItem value="low" className="text-xs" style={{ color: txt }}>Baixa</SelectItem>
                      <SelectItem value="medium" className="text-xs" style={{ color: txt }}>Media</SelectItem>
                      <SelectItem value="high" className="text-xs" style={{ color: txt }}>Alta</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div><Label className="text-xs" style={{ color: tm }}>Responsavel</Label><Input value={form.assignee} onChange={e => setForm({...form, assignee: e.target.value})} className="mt-1 border text-xs" style={{ background: elevBg, borderColor, color: txt }} placeholder="Nome" /></div>
              </div>
              <div><Label className="text-xs" style={{ color: tm }}>Prazo</Label><Input type="date" value={form.dueDate} onChange={e => setForm({...form, dueDate: e.target.value})} className="mt-1 border text-xs" style={{ background: elevBg, borderColor, color: txt }} /></div>
              <Button type="submit" className="w-full font-semibold" style={{ background: ac, color: '#000' }} disabled={createT.isPending}>{createT.isPending ? "Criando..." : "Criar"}</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      {isLoading ? <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">{[...Array(4)].map((_,i) => <div key={i} className="h-[300px] rounded-xl animate-pulse" style={{ background: bg }} />)}</div> :
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {columns.map(col => {
            const colTasks = allTasks?.filter(t => t.status === col.key) || [];
            return (
              <div key={col.key} className="flex flex-col">
                <div className="flex items-center justify-between mb-2 px-1">
                  <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full" style={{ background: col.color }} /><span className="text-xs font-medium" style={{ color: txt }}>{col.label}</span></div>
                  <span className="text-xs" style={{ color: tm }}>{colTasks.length}</span>
                </div>
                <div className="rounded-xl border p-2 space-y-2 min-h-[200px]" style={{ background: `${bg}80`, borderColor: borderC }}>
                  {colTasks.map(task => (
                    <Card key={task.id} style={{ background: elevBg }} className="border-0">
                      <CardContent className="p-3">
                        <p className="text-xs font-medium leading-tight" style={{ color: txt }}>{task.title}</p>
                        <div className="flex items-center gap-2 mt-1.5">
                          <span className="text-[9px] font-medium px-1.5 py-0.5 rounded" style={{ color: prC[task.priority], background: `${prC[task.priority]}15` }}>{task.priority?.toUpperCase()}</span>
                          {task.assignee && <span className="text-[9px]" style={{ color: tm }}>{task.assignee}</span>}
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center gap-0.5">
                            {col.key !== "todo" && <Button variant="ghost" size="icon" className="w-5 h-5" style={{ color: tm }} onClick={() => moveTask(task.id, task.status, "prev")}><ArrowLeft className="w-3 h-3" /></Button>}
                            {col.key !== "done" && <Button variant="ghost" size="icon" className="w-5 h-5" style={{ color: tm }} onClick={() => moveTask(task.id, task.status, "next")}><ArrowRight className="w-3 h-3" /></Button>}
                          </div>
                          <Button variant="ghost" size="icon" className="w-5 h-5 hover:text-red-400" style={{ color: tm }} onClick={() => { if (confirm('Excluir?')) deleteT.mutate({ id: task.id }); }}><Trash2 className="w-3 h-3" /></Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  {colTasks.length === 0 && <p className="text-xs text-center py-6" style={{ color: tm }}>Vazio</p>}
                </div>
              </div>
            );
          })}
        </div>}
    </div>
  );
}
