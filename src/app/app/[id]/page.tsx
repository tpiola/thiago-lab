'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import ImageExt from '@tiptap/extension-image';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import Highlight from '@tiptap/extension-highlight';
import Placeholder from '@tiptap/extension-placeholder';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import { common, createLowlight } from 'lowlight';
import { motion } from 'framer-motion';
import { ArrowLeft, Trash2, Clock } from 'lucide-react';
import NotesSidebar from '@/components/NotesSidebar';
import Toolbar from '@/components/Toolbar';
import {
  getNote,
  updateNote,
  deleteNote,
  type Note,
} from '@/lib/notes-store';

/* ==========================================================================
   /app/[id] — Note Editor Page
   TipTap with full toolbar, localStorage auto-save (debounce 2s)
   Intelligence OS design
   ========================================================================== */

const lowlight = createLowlight(common);

export default function NoteEditor() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [note, setNote] = useState<Note | null>(null);
  const [title, setTitle] = useState('');
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const titleRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: false,
      }),
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { class: 'text-ios-accent underline underline-offset-2' },
      }),
      ImageExt.configure({
        inline: false,
        allowBase64: true,
      }),
      TaskList,
      TaskItem.configure({
        nested: true,
        HTMLAttributes: { class: 'flex items-start gap-2 my-1' },
      }),
      Highlight.configure({
        multicolor: false,
        HTMLAttributes: { class: 'bg-ios-accent/20 text-ios-text rounded px-0.5' },
      }),
      Placeholder.configure({
        placeholder: 'Digite / para comandos, ou comece a escrever...',
      }),
      CodeBlockLowlight.configure({
        lowlight,
        defaultLanguage: 'typescript',
        HTMLAttributes: { class: 'code-block' },
      }),
    ],
    content: '',
    editorProps: {
      attributes: {
        class:
          'prose prose-invert max-w-none focus:outline-none min-h-[60vh] px-0 text-[15px] leading-relaxed text-ios-text',
      },
    },
    onUpdate: ({ editor: ed }) => {
      handleAutoSave(ed.getJSON());
    },
  });

  /* ── Load note ── */
  useEffect(() => {
    setMounted(true);
    const found = getNote(id);
    if (!found) {
      router.push('/app');
      return;
    }
    setNote(found);
    setTitle(found.title);

    if (editor) {
      try {
        const content = JSON.parse(found.content);
        editor.commands.setContent(content);
      } catch {
        editor.commands.setContent({
          type: 'doc',
          content: [{ type: 'paragraph', content: [{ type: 'text', text: found.content }] }],
        });
      }
    }
  }, [id, editor, router]);

  /* ── Auto-save with debounce ── */
  const handleAutoSave = useCallback(
    (json: any) => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      setSaving(true);
      debounceRef.current = setTimeout(() => {
        const contentStr = JSON.stringify(json);
        const updated = updateNote(id, { content: contentStr });
        if (updated) {
          setNote(updated);
          setLastSaved(updated.updatedAt);
        }
        setSaving(false);
      }, 2000);
    },
    [id],
  );

  /* ── Save title on blur ── */
  const handleTitleBlur = () => {
    if (title.trim() && note && title.trim() !== note.title) {
      const updated = updateNote(id, { title: title.trim() });
      if (updated) setNote(updated);
    }
  };

  const handleTitleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleTitleBlur();
      editor?.commands.focus();
    }
  };

  /* ── Delete ── */
  const handleDelete = () => {
    if (window.confirm('Tem certeza que deseja deletar esta nota?')) {
      deleteNote(id);
      router.push('/app');
    }
  };

  /* ── Cleanup ── */
  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  if (!mounted || !note) {
    return (
      <div className="flex h-screen bg-ios-base">
        <div className="hidden md:flex w-[280px] bg-ios-surface border-r border-ios-border/50 animate-pulse" />
        <main className="flex-1 p-6">
          <div className="space-y-4 max-w-3xl mx-auto">
            <div className="h-6 w-20 skeleton rounded" />
            <div className="h-10 w-2/3 skeleton rounded mt-6" />
            <div className="h-4 w-32 skeleton rounded" />
            <div className="h-64 skeleton rounded-lg mt-4" />
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-ios-base">
      {/* Sidebar */}
      <NotesSidebar activeNoteId={id} />

      {/* Main editor area */}
      <main className="flex flex-1 flex-col overflow-hidden">
        {/* Top bar */}
        <div className="flex items-center justify-between border-b border-ios-border/30 bg-ios-surface/80 px-4 py-2 backdrop-blur-xl md:px-6">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => router.push('/app')}
              className="flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium text-ios-text-secondary transition-colors hover:bg-ios-surface-2 hover:text-ios-text"
            >
              <ArrowLeft size={14} />
              <span className="hidden sm:inline">Voltar</span>
            </button>
          </div>

          <div className="flex items-center gap-3">
            {/* Saving indicator */}
            <div className="flex items-center gap-1.5 text-[10px] font-mono text-ios-muted">
              {saving ? (
                <>
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-ios-warning animate-pulse" />
                  Salvando...
                </>
              ) : lastSaved ? (
                <>
                  <Clock size={10} />
                  {formatTime(lastSaved)}
                </>
              ) : null}
            </div>

            <button
              type="button"
              onClick={handleDelete}
              className="flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium text-ios-error/70 transition-colors hover:bg-ios-error/10 hover:text-ios-error"
            >
              <Trash2 size={14} />
              <span className="hidden sm:inline">Deletar</span>
            </button>
          </div>
        </div>

        {/* Toolbar */}
        <div className="border-b border-ios-border/20 bg-ios-base/80 px-4 py-2 md:px-6">
          <Toolbar editor={editor} />
        </div>

        {/* Editor content */}
        <div className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-3xl px-4 py-6 md:px-8 md:py-8">
            {/* Title input */}
            <input
              ref={titleRef}
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={handleTitleBlur}
              onKeyDown={handleTitleKeyDown}
              placeholder="Título da nota..."
              className="w-full bg-transparent font-display text-3xl font-semibold tracking-tight text-ios-text placeholder-ios-muted/50 outline-none md:text-4xl"
            />

            {/* Editor */}
            <div className="mt-6">
              <EditorContent editor={editor} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

/* ── Helpers ─────────────────────────────────────────────────────────────── */

function formatTime(iso: string): string {
  const d = new Date(iso);
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  if (diff < 60000) return 'Agora';
  if (diff < 3600000) return `Há ${Math.floor(diff / 60000)} min`;
  return d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
}
