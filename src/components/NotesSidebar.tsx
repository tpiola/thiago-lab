'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  FileText,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ArrowLeft,
  Home,
  Trash2,
  LogOut,
} from 'lucide-react';
import {
  listNotes,
  createNote,
  deleteNote,
  type Note,
} from '@/lib/notes-store';

/* ==========================================================================
   NotesSidebar — Reusable workspace sidebar
   Collapsed: icons only (64px) / Expanded: 280px
   Intelligence OS design
   ========================================================================== */

interface NotesSidebarProps {
  activeNoteId?: string | null;
}

export function NotesSidebar({ activeNoteId }: NotesSidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [notes, setNotes] = useState<Note[]>([]);
  const [mobileOpen, setMobileOpen] = useState(false);

  const refresh = useCallback(() => {
    setNotes(listNotes());
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh, pathname]);

  const handleNewNote = () => {
    const note = createNote('Nova nota');
    refresh();
    router.push(`/app/${note.id}`);
    if (window.innerWidth < 768) setMobileOpen(false);
  };

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    deleteNote(id);
    refresh();
    if (activeNoteId === id) {
      router.push('/app');
    }
  };

  const isActive = (id: string) => activeNoteId === id;

  /* ── Sidebar Content ── */
  const sidebarContent = (
    <div className="flex h-full flex-col">
      {/* Logo + Collapse */}
      <div className={`flex items-center border-b border-ios-border/50 px-3 ${collapsed ? 'justify-center py-4' : 'justify-between py-3'}`}>
        {!collapsed && (
          <a href="/app" className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded border border-ios-border bg-ios-surface text-xs font-bold text-ios-accent">
              T
            </span>
            <span className="font-display text-sm font-semibold tracking-tight text-ios-text">
              THIAGO LAB
            </span>
          </a>
        )}
        {collapsed && (
          <a href="/app">
            <span className="flex h-7 w-7 items-center justify-center rounded border border-ios-border bg-ios-surface text-xs font-bold text-ios-accent">
              T
            </span>
          </a>
        )}
        <button
          type="button"
          onClick={() => setCollapsed(!collapsed)}
          className="hidden md:flex items-center justify-center rounded p-1 text-ios-muted hover:bg-ios-surface-2 hover:text-ios-accent transition-colors"
          aria-label={collapsed ? 'Expandir sidebar' : 'Recolher sidebar'}
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      {/* Nova Nota */}
      <div className={`px-2 pt-3 ${collapsed ? 'flex justify-center' : ''}`}>
        <button
          type="button"
          onClick={handleNewNote}
          className={`flex items-center gap-2 rounded-md bg-ios-accent/10 border border-ios-accent/20 text-ios-accent hover:bg-ios-accent/20 transition-all ${
            collapsed
              ? 'w-9 h-9 justify-center'
              : 'w-full px-3 py-2 text-sm font-medium'
          }`}
        >
          <Plus size={collapsed ? 16 : 18} />
          {!collapsed && <span>Nova nota</span>}
        </button>
      </div>

      {/* Workspace section */}
      {!collapsed && (
        <div className="mt-4 px-3">
          <p className="mb-1 text-[10px] font-semibold uppercase tracking-widest text-ios-muted">
            Workspace
          </p>
          <button
            type="button"
            onClick={() => router.push('/app')}
            className={`flex w-full items-center gap-2 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
              pathname === '/app'
                ? 'bg-ios-accent/10 text-ios-accent'
                : 'text-ios-text-secondary hover:bg-ios-surface-2 hover:text-ios-text'
            }`}
          >
            <Home size={14} />
            <span>Visão geral</span>
          </button>
        </div>
      )}

      {/* Notes list */}
      <div className="mt-3 flex-1 overflow-y-auto px-2">
        {!collapsed && notes.length > 0 && (
          <p className="mb-1 px-1 text-[10px] font-semibold uppercase tracking-widest text-ios-muted">
            Notas ({notes.length})
          </p>
        )}
        <div className={`space-y-0.5 ${collapsed ? 'flex flex-col items-center' : ''}`}>
          {notes.map((note) => (
            <button
              key={note.id}
              type="button"
              onClick={() => {
                router.push(`/app/${note.id}`);
                if (window.innerWidth < 768) setMobileOpen(false);
              }}
              className={`group flex items-center rounded-md transition-all ${
                collapsed
                  ? 'w-9 h-9 justify-center'
                  : 'w-full px-2 py-1.5'
              } ${
                isActive(note.id)
                  ? 'bg-ios-accent/10 text-ios-accent border-l-2 border-ios-accent'
                  : 'text-ios-text-secondary hover:bg-ios-surface-2 hover:text-ios-text border-l-2 border-transparent'
              }`}
              title={collapsed ? note.title : undefined}
            >
              <FileText size={14} className={`${collapsed ? '' : 'mr-2 shrink-0'} ${isActive(note.id) ? 'text-ios-accent' : 'text-ios-muted'}`} />
              {!collapsed && (
                <>
                  <span className="flex-1 truncate text-left text-xs leading-tight">
                    {note.title}
                  </span>
                  <button
                    type="button"
                    onClick={(e) => handleDelete(e, note.id)}
                    className="shrink-0 rounded p-0.5 opacity-0 group-hover:opacity-100 hover:bg-ios-error/10 hover:text-ios-error transition-all"
                    aria-label={`Deletar ${note.title}`}
                  >
                    <Trash2 size={12} />
                  </button>
                </>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Bottom */}
      <div className={`border-t border-ios-border/50 px-2 py-3 ${collapsed ? 'flex justify-center' : ''}`}>
        <a
          href="/"
          className={`flex items-center gap-2 rounded-md text-xs font-medium text-ios-muted hover:text-ios-accent transition-colors ${
            collapsed ? 'justify-center w-9 h-9' : 'px-2 py-1.5'
          }`}
        >
          <LogOut size={14} />
          {!collapsed && <span>Voltar ao site</span>}
        </a>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile hamburger */}
      <button
        type="button"
        onClick={() => setMobileOpen(true)}
        className="fixed left-3 top-3 z-40 flex md:hidden items-center justify-center w-9 h-9 rounded-md bg-ios-surface border border-ios-border text-ios-text-secondary hover:text-ios-accent"
        aria-label="Abrir menu"
      >
        <ChevronRight size={18} />
      </button>

      {/* Desktop sidebar */}
      <aside
        className={`hidden md:flex flex-col h-full bg-ios-surface border-r border-ios-border/50 transition-all duration-300 ease-out-expo overflow-hidden ${
          collapsed ? 'w-16' : 'w-[280px]'
        }`}
      >
        {sidebarContent}
      </aside>

      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className="fixed left-0 top-0 z-50 h-full w-[280px] bg-ios-surface border-r border-ios-border/50 md:hidden"
            >
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

export default NotesSidebar;
