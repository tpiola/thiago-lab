/* ==========================================================================
   notes-store.ts — localStorage CRUD for TipTap notes
   Intelligence OS — thiagolab.com
   ========================================================================== */

export interface Note {
  id: string;
  title: string;
  content: string; // JSON string from TipTap
  createdAt: string; // ISO
  updatedAt: string; // ISO
}

const STORAGE_KEY = 'thiagolab_notes';

/* ── Helpers ─────────────────────────────────────────────────────────────── */

function getNotes(): Note[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as Note[];
  } catch {
    return [];
  }
}

function persistNotes(notes: Note[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
}

function generateId(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}

/* ── Default content (TipTap JSON) ───────────────────────────────────────── */

function defaultContent(): string {
  return JSON.stringify({
    type: 'doc',
    content: [
      {
        type: 'paragraph',
        content: [
          {
            type: 'text',
            text: 'Comece a escrever aqui...',
          },
        ],
      },
    ],
  });
}

/* ── Public API ──────────────────────────────────────────────────────────── */

export function createNote(title: string, content?: string): Note {
  const now = new Date().toISOString();
  const note: Note = {
    id: generateId(),
    title,
    content: content ?? defaultContent(),
    createdAt: now,
    updatedAt: now,
  };
  const notes = getNotes();
  notes.unshift(note);
  persistNotes(notes);
  return note;
}

export function getNote(id: string): Note | undefined {
  return getNotes().find((n) => n.id === id);
}

export function updateNote(id: string, data: Partial<Pick<Note, 'title' | 'content'>>): Note | undefined {
  const notes = getNotes();
  const idx = notes.findIndex((n) => n.id === id);
  if (idx === -1) return undefined;

  notes[idx] = {
    ...notes[idx],
    ...data,
    updatedAt: new Date().toISOString(),
  };
  persistNotes(notes);
  return notes[idx];
}

export function deleteNote(id: string): void {
  const notes = getNotes().filter((n) => n.id !== id);
  persistNotes(notes);
}

export function listNotes(): Note[] {
  const notes = getNotes();
  return notes.sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
  );
}

export function seedExampleNotes(): void {
  const existing = getNotes();
  if (existing.length > 0) return;

  const now = new Date();

  const examples: Note[] = [
    {
      id: generateId(),
      title: '🚀 Quick Start — Intelligence OS',
      content: JSON.stringify({
        type: 'doc',
        content: [
          { type: 'heading', attrs: { level: 1 }, content: [{ type: 'text', text: 'Bem-vindo ao Intelligence OS' }] },
          { type: 'paragraph', content: [{ type: 'text', text: 'Este é seu workspace pessoal de anotações. Aqui você pode:' }] },
          { type: 'bulletList', content: [
            { type: 'listItem', content: [{ type: 'paragraph', content: [{ type: 'text', marks: [{ type: 'bold' }], text: 'Criar notas' }, { type: 'text', text: ' com formatação rica' }] }] },
            { type: 'listItem', content: [{ type: 'paragraph', content: [{ type: 'text', marks: [{ type: 'bold' }], text: 'Organizar ideias' }, { type: 'text', text: ' com listas e tarefas' }] }] },
            { type: 'listItem', content: [{ type: 'paragraph', content: [{ type: 'text', marks: [{ type: 'bold' }], text: 'Código' }, { type: 'text', text: ' com blocos de código destacados' }] }] },
          ] },
          { type: 'paragraph', content: [{ type: 'text', text: 'Use a toolbar acima para formatar seu conteúdo. Tudo é salvo automaticamente no seu navegador.' }] },
        ],
      }),
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    },
    {
      id: generateId(),
      title: '💡 Ideias e Anotações',
      content: JSON.stringify({
        type: 'doc',
        content: [
          { type: 'heading', attrs: { level: 2 }, content: [{ type: 'text', text: 'Ideias para explorar' }] },
          { type: 'taskList', content: [
            { type: 'taskItem', attrs: { checked: true }, content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Configurar pipeline de automação n8n' }] }] },
            { type: 'taskItem', attrs: { checked: false }, content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Escrever artigo sobre agentes AI' }] }] },
            { type: 'taskItem', attrs: { checked: false }, content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Revisar arquitetura do LLM Gateway' }] }] },
          ] },
          { type: 'blockquote', content: [{ type: 'paragraph', content: [{ type: 'text', marks: [{ type: 'italic' }], text: '"A melhor maneira de prever o futuro é criá-lo."' }] }] },
        ],
      }),
      createdAt: new Date(now.getTime() - 3600000).toISOString(),
      updatedAt: new Date(now.getTime() - 3600000).toISOString(),
    },
    {
      id: generateId(),
      title: '📋 Style Guide — Formatação',
      content: JSON.stringify({
        type: 'doc',
        content: [
          { type: 'heading', attrs: { level: 2 }, content: [{ type: 'text', text: 'Opções de formatação' }] },
          { type: 'paragraph', content: [{ type: 'text', marks: [{ type: 'bold' }], text: 'Negrito' }, { type: 'text', text: ' — ' }, { type: 'text', marks: [{ type: 'italic' }], text: 'Itálico' }, { type: 'text', text: ' — ' }, { type: 'text', marks: [{ type: 'underline' }], text: 'Sublinhado' }, { type: 'text', text: ' — ' }, { type: 'text', marks: [{ type: 'strike' }], text: 'Riscado' }] },
          { type: 'codeBlock', attrs: { language: 'typescript' }, content: [{ type: 'text', text: 'const greeting = "Hello, World!";\nconsole.log(greeting);' }] },
          { type: 'paragraph', content: [{ type: 'text', text: 'Use `highlight` para chamar atenção.' }] },
          { type: 'orderedList', content: [
            { type: 'listItem', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Headings H1, H2, H3' }] }] },
            { type: 'listItem', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Listas ordenadas e não ordenadas' }] }] },
            { type: 'listItem', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Task lists com checkboxes' }] }] },
          ] },
        ],
      }),
      createdAt: new Date(now.getTime() - 7200000).toISOString(),
      updatedAt: new Date(now.getTime() - 7200000).toISOString(),
    },
  ];

  persistNotes(examples);
}
