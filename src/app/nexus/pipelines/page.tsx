"use client";

import { useState } from "react";
import {
  DndContext,
  DragOverlay,
  closestCorners,
  PointerSensor,
  useSensor,
  useSensors,
  type DragStartEvent,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  Plus,
  GripVertical,
  Calendar,
  Tag,
  DollarSign,
  User,
} from "lucide-react";

/* ═══════════════════════════════════════════════════════════════════════════
   TYPES
   ═══════════════════════════════════════════════════════════════════════════ */
interface CardData {
  id: string;
  title: string;
  name: string;
  value: string;
  date: string;
  tags: string[];
  column: string;
}

interface ColumnData {
  id: string;
  title: string;
  color: string;
  items: CardData[];
}

/* ═══════════════════════════════════════════════════════════════════════════
   MOCK DATA
   ═══════════════════════════════════════════════════════════════════════════ */
const INITIAL_COLUMNS: ColumnData[] = [
  {
    id: "lead",
    title: "Lead",
    color: "#FBBF24",
    items: [
      { id: "c1", title: "Empresa XYZ", name: "Carlos Silva", value: "R$ 12.000", date: "18/06", tags: ["Hot", "Tech"], column: "lead" },
      { id: "c2", title: "TechStart", name: "Ana Costa", value: "R$ 8.500", date: "17/06", tags: ["Warm"], column: "lead" },
      { id: "c3", title: "GlobalWeb", name: "Pedro Santos", value: "R$ 22.000", date: "16/06", tags: ["Cold"], column: "lead" },
      { id: "c4", title: "NovaTech", name: "Julia Lima", value: "R$ 5.000", date: "15/06", tags: ["Hot", "SaaS"], column: "lead" },
    ],
  },
  {
    id: "contato",
    title: "Contato",
    color: "#60A5FA",
    items: [
      { id: "c5", title: "Acme Corp", name: "Roberto Alves", value: "R$ 35.000", date: "17/06", tags: ["Hot", "Enterprise"], column: "contato" },
      { id: "c6", title: "BetaTech", name: "Marina Dias", value: "R$ 18.000", date: "16/06", tags: ["Warm"], column: "contato" },
      { id: "c7", title: "Sigma Soluções", name: "Lucas Nunes", value: "R$ 9.000", date: "14/06", tags: ["Meeting"], column: "contato" },
    ],
  },
  {
    id: "proposta",
    title: "Proposta",
    color: "#C9A227",
    items: [
      { id: "c8", title: "MegaCorp", name: "Fernanda Torres", value: "R$ 65.000", date: "16/06", tags: ["Urgente"], column: "proposta" },
      { id: "c9", title: "DataFlow", name: "Rafael Costa", value: "R$ 28.000", date: "15/06", tags: ["Negociação"], column: "proposta" },
    ],
  },
  {
    id: "fechado",
    title: "Fechado",
    color: "#34D399",
    items: [
      { id: "c10", title: "Startup A", name: "Thiago Martins", value: "R$ 15.000", date: "12/06", tags: ["Sucesso"], column: "fechado" },
      { id: "c11", title: "WebDev Ltda", name: "Camila Rocha", value: "R$ 42.000", date: "10/06", tags: ["Sucesso"], column: "fechado" },
    ],
  },
];

/* ═══════════════════════════════════════════════════════════════════════════
   SORTABLE CARD
   ═══════════════════════════════════════════════════════════════════════════ */
function KanbanCard({ card }: { card: CardData }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: card.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="nexus-kanban-card mb-2" {...attributes} {...listeners}>
      <div className="flex items-start justify-between mb-2">
        <h4 className="text-sm font-semibold text-[#E8EDF2]">{card.title}</h4>
        <GripVertical size={14} className="text-[#6B7280] flex-shrink-0 mt-0.5" />
      </div>
      <div className="flex items-center gap-1.5 text-xs text-[#6B7280] mb-2">
        <User size={11} />
        <span>{card.name}</span>
      </div>
      <div className="flex items-center gap-1.5 text-xs text-[#6B7280] mb-2">
        <DollarSign size={11} />
        <span>{card.value}</span>
        <span className="mx-1">·</span>
        <Calendar size={11} />
        <span>{card.date}</span>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {card.tags.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium"
            style={{
              background: "rgba(201,162,39,0.08)",
              color: "#C9A227",
              border: "1px solid rgba(201,162,39,0.12)",
            }}
          >
            <Tag size={9} />
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   KANBAN COLUMN
   ═══════════════════════════════════════════════════════════════════════════ */
function KanbanColumn({ column }: { column: ColumnData }) {
  return (
    <div className="nexus-kanban-col">
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-2">
          <div
            className="w-2.5 h-2.5 rounded-full"
            style={{ background: column.color, boxShadow: `0 0 6px ${column.color}60` }}
          />
          <h3 className="text-sm font-semibold text-[#E8EDF2]">{column.title}</h3>
          <span
            className="text-[10px] font-medium px-1.5 py-0.5 rounded-full"
            style={{ background: `${column.color}15`, color: column.color }}
          >
            {column.items.length}
          </span>
        </div>
        <button className="p-1 text-[#6B7280] hover:text-[#E8EDF2] rounded transition-colors">
          <Plus size={14} />
        </button>
      </div>
      <SortableContext items={column.items.map((c) => c.id)} strategy={verticalListSortingStrategy}>
        {column.items.map((card) => (
          <KanbanCard key={card.id} card={card} />
        ))}
      </SortableContext>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   PIPELINES PAGE
   ═══════════════════════════════════════════════════════════════════════════ */
export default function PipelinesPage() {
  const [columns, setColumns] = useState<ColumnData[]>(INITIAL_COLUMNS);
  const [activeCard, setActiveCard] = useState<CardData | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  const findColumnByCardId = (cardId: string) =>
    columns.find((col) => col.items.some((c) => c.id === cardId));

  const handleDragStart = (event: DragStartEvent) => {
    const cardId = String(event.active.id);
    const col = findColumnByCardId(cardId);
    const card = col?.items.find((c) => c.id === cardId);
    if (card) setActiveCard(card);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveCard(null);
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const fromCol = findColumnByCardId(String(active.id));
    const toCol = columns.find((col) => col.id === String(over.id)) ?? findColumnByCardId(String(over.id));

    if (!fromCol || !toCol) return;

    const activeIndex = fromCol.items.findIndex((c) => c.id === active.id);
    if (activeIndex === -1) return;

    const card = fromCol.items[activeIndex];
    const updatedCard = { ...card, column: toCol.id };

    // Remove from source
    const newFromItems = fromCol.items.filter((c) => c.id !== active.id);

    // Add to target
    let newToItems: CardData[];
    if (toCol.id === String(over.id)) {
      // Dropped on column
      newToItems = [...toCol.items, updatedCard];
    } else {
      // Dropped on a card
      const overIndex = toCol.items.findIndex((c) => c.id === over.id);
      newToItems = [...toCol.items];
      newToItems.splice(overIndex, 0, updatedCard);
    }

    setColumns((prev) =>
      prev.map((col) => {
        if (col.id === fromCol.id) return { ...col, items: newFromItems };
        if (col.id === toCol.id) return { ...col, items: newToItems };
        return col;
      })
    );
  };

  // Count total for progress
  const totalLeads = columns.reduce((acc, col) => acc + col.items.length, 0);

  return (
    <div className="p-4 lg:p-6 min-h-full nexus-grid-bg">
      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="nexus-section-title text-2xl">Pipelines</h1>
          <p className="nexus-section-subtitle mt-1">
            Gerencie seus leads em cada etapa do funil
          </p>
        </div>
        <button className="nexus-btn-primary">
          <Plus size={16} />
          Novo Lead
        </button>
      </div>

      {/* ── Progress Bar ────────────────────────────────────────────────── */}
      <div className="nexus-card p-4 mb-6">
        <div className="flex items-center justify-between text-xs mb-2">
          <span className="text-[#9BA3B8] font-medium">Progresso do Pipeline</span>
          <span className="text-[#6B7280]">{totalLeads} leads ativos</span>
        </div>
        <div className="nexus-progress" style={{ height: 8 }}>
          {columns.map((col) => {
            const pct = totalLeads > 0 ? (col.items.length / totalLeads) * 100 : 0;
            return (
              <div
                key={col.id}
                className="inline-block h-full first:rounded-l-full last:rounded-r-full transition-all duration-500"
                style={{
                  width: `${pct}%`,
                  background: col.color,
                  opacity: 0.8,
                }}
                title={`${col.title}: ${col.items.length}`}
              />
            );
          })}
        </div>
        <div className="flex items-center justify-between mt-2">
          {columns.map((col) => (
            <div key={col.id} className="flex items-center gap-1.5 text-[10px] text-[#6B7280]">
              <div className="w-2 h-2 rounded-full" style={{ background: col.color }} />
              <span>{col.title}: {col.items.length}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Kanban Board ────────────────────────────────────────────────── */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="flex gap-4 overflow-x-auto pb-4 nexus-scrollbar" style={{ minHeight: 500 }}>
          {columns.map((col) => (
            <KanbanColumn key={col.id} column={col} />
          ))}
        </div>
        <DragOverlay>
          {activeCard ? (
            <div className="nexus-kanban-card shadow-xl opacity-90" style={{ width: 240 }}>
              <h4 className="text-sm font-semibold text-[#E8EDF2] mb-2">{activeCard.title}</h4>
              <p className="text-xs text-[#6B7280]">{activeCard.name} · {activeCard.value}</p>
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
