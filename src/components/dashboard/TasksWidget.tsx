"use client";

import { useState } from "react";
import { CheckCircle2, Circle, Plus } from "lucide-react";

interface Task {
  id: string;
  text: string;
  done: boolean;
}

const INITIAL_TASKS: Task[] = [
  { id: "1", text: "Revisar pipeline de vendas", done: false },
  { id: "2", text: "Enviar proposta para TechStart", done: true },
  { id: "3", text: "Agendar demo com Acme Corp", done: false },
  { id: "4", text: "Atualizar funil de marketing", done: false },
  { id: "5", text: "Reunião de alinhamento às 14h", done: true },
];

export function TasksWidget() {
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [newTask, setNewTask] = useState("");

  const toggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
    );
  };

  const addTask = () => {
    if (!newTask.trim()) return;
    setTasks((prev) => [
      ...prev,
      { id: Date.now().toString(), text: newTask.trim(), done: false },
    ]);
    setNewTask("");
  };

  const doneCount = tasks.filter((t) => t.done).length;

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs text-[#6B7280]">
          {doneCount}/{tasks.length} concluídas
        </span>
      </div>
      <div className="flex-1 space-y-1 overflow-y-auto mb-3">
        {tasks.map((task) => (
          <button
            key={task.id}
            onClick={() => toggleTask(task.id)}
            className="flex items-center gap-2 w-full text-left px-2 py-1.5 rounded-md hover:bg-[rgba(201,162,39,0.04)] transition-colors group"
          >
            {task.done ? (
              <CheckCircle2 size={16} className="text-[#34D399] flex-shrink-0" />
            ) : (
              <Circle size={16} className="text-[#6B7280] flex-shrink-0 group-hover:text-[#C9A227]" />
            )}
            <span
              className={`text-sm truncate ${
                task.done
                  ? "text-[#6B7280] line-through"
                  : "text-[#E8EDF2]"
              }`}
            >
              {task.text}
            </span>
          </button>
        ))}
      </div>
      <div className="flex items-center gap-2 border-t border-[rgba(201,162,39,0.06)] pt-3">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addTask()}
          placeholder="Adicionar tarefa..."
          className="nexus-input flex-1 text-xs py-1.5 px-2"
        />
        <button
          onClick={addTask}
          className="p-1.5 rounded-md text-[#C9A227] hover:bg-[rgba(201,162,39,0.1)] transition-colors"
        >
          <Plus size={14} />
        </button>
      </div>
    </div>
  );
}
