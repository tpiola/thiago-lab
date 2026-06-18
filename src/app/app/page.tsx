'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import NotesSidebar from '@/components/NotesSidebar';
import {
  seedExampleNotes,
  listNotes,
  createNote,
  type Note,
} from '@/lib/notes-store';
import {
  FileText,
  Clock,
  Plus,
  ArrowRight,
} from 'lucide-react';

/* ==========================================================================
   /app — Workspace Dashboard
   Intelligence OS design
   ========================================================================== */

export default function AppWorkspace() {
  const router = useRouter();
  const [notes, setNotes] = useState<Note[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    seedExampleNotes();
    setNotes(listNotes());
  }, []);

  const handleNewNote = () => {
    const note = createNote('Nova nota');
    router.push(`/app/${note.id}`);
  };

  if (!mounted) {
    return (
      <div className="flex h-screen bg-ios-base">
        <div className="hidden md:flex w-[280px] bg-ios-surface border-r border-ios-border/50 animate-pulse" />
        <main className="flex-1 p-6">
          <div className="space-y-4">
            <div className="h-8 w-48 skeleton rounded" />
            <div className="h-4 w-96 skeleton rounded" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-32 skeleton rounded-lg" />
              ))}
            </div>
          </div>
        </main>
      </div>
    );
  }

  const recentNotes = notes.slice(0, 6);

  return (
    <div className="flex h-screen bg-ios-base">
      {/* Sidebar */}
      <NotesSidebar />

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-5xl px-6 py-8 md:px-10 md:py-10">
          {/* Header */}
          <div className="mb-8">
            <h1 className="font-display text-3xl font-semibold tracking-tight text-ios-text md:text-4xl">
              Workspace
            </h1>
            <p className="mt-1 text-sm text-ios-text-secondary">
              {notes.length > 0
                ? `${notes.length} nota${notes.length !== 1 ? 's' : ''} · Última edição ${timeAgo(notes[0]?.updatedAt ?? '')}`
                : 'Seu espaço pessoal de anotações'}
            </p>
          </div>

          {/* Stats */}
          <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-lg border border-ios-border/50 bg-ios-surface p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-ios-accent/10 text-ios-accent">
                  <FileText size={18} />
                </div>
                <div>
                  <p className="text-2xl font-semibold text-ios-text">{notes.length}</p>
                  <p className="text-xs text-ios-muted">Total de notas</p>
                </div>
              </div>
            </div>
            <div className="rounded-lg border border-ios-border/50 bg-ios-surface p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-ios-accent/10 text-ios-accent">
                  <Clock size={18} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-ios-text">
                    {notes.length > 0 ? timeAgo(notes[0]?.updatedAt ?? '') : '—'}
                  </p>
                  <p className="text-xs text-ios-muted">Última edição</p>
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={handleNewNote}
              className="group rounded-lg border border-dashed border-ios-border/50 bg-ios-surface/50 p-4 text-left transition-all hover:border-ios-accent/30 hover:bg-ios-accent/5"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-ios-accent/10 text-ios-accent transition-colors group-hover:bg-ios-accent/20">
                  <Plus size={18} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-ios-accent">Criar nota</p>
                  <p className="text-xs text-ios-muted">Nova página em branco</p>
                </div>
              </div>
            </button>
          </div>

          {/* Notes Grid */}
          {notes.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-ios-border/60 bg-ios-surface/30 px-6 py-16 text-center">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-ios-accent/10 text-ios-accent">
                <FileText size={24} />
              </div>
              <h2 className="font-display text-xl font-semibold text-ios-text">
                Nenhuma nota ainda
              </h2>
              <p className="mt-1 max-w-md text-sm text-ios-text-secondary">
                Crie sua primeira nota para começar a usar o workspace.
              </p>
              <button
                type="button"
                onClick={handleNewNote}
                className="btn-accent mt-6 flex items-center gap-2 px-5 py-2.5 text-sm font-semibold"
              >
                <Plus size={16} />
                <span>Criar primeira nota</span>
              </button>
            </div>
          ) : (
            <div>
              <h2 className="mb-4 font-display text-lg font-semibold text-ios-text">
                Notas recentes
              </h2>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {recentNotes.map((note) => (
                  <button
                    key={note.id}
                    type="button"
                    onClick={() => router.push(`/app/${note.id}`)}
                    className="group text-left rounded-lg border border-ios-border/40 bg-ios-surface p-4 transition-all hover:border-ios-accent/20 hover:shadow-ios-glow-sm"
                  >
                    <div className="flex items-start justify-between">
                      <h3 className="font-display text-sm font-semibold text-ios-text line-clamp-1">
                        {note.title}
                      </h3>
                      <ArrowRight
                        size={14}
                        className="mt-0.5 shrink-0 text-ios-muted opacity-0 transition-opacity group-hover:opacity-100"
                      />
                    </div>
                    <p className="mt-2 text-xs leading-relaxed text-ios-text-secondary line-clamp-3">
                      {extractPreview(note.content)}
                    </p>
                    <p className="mt-3 text-[10px] font-mono text-ios-muted">
                      {timeAgo(note.updatedAt)}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

/* ── Helpers ─────────────────────────────────────────────────────────────── */

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'agora mesmo';
  if (mins < 60) return `há ${mins} min`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `há ${hrs}h`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `há ${days}d`;
  return new Date(iso).toLocaleDateString('pt-BR');
}

function extractPreview(json: string): string {
  try {
    const doc = JSON.parse(json);
    const texts: string[] = [];
    function walk(node: any) {
      if (node.text) texts.push(node.text);
      if (node.content) node.content.forEach(walk);
    }
    walk(doc);
    return texts.join(' ').slice(0, 120) || 'Sem conteúdo';
  } catch {
    return 'Sem conteúdo';
  }
}
