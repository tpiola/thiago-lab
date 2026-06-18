'use client';

/* ==========================================================================
   /builder/[id] — Editor Visual Drag & Drop
   ========================================================================== */

import { useEffect, useCallback, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Save, Eye, Download, Undo2, Redo2, ArrowLeft } from 'lucide-react';
import { BuilderProvider, useBuilderStore } from '@/components/Builder/BuilderStore';
import { ComponentPalette } from '@/components/Builder/ComponentPalette';
import { BuilderCanvas } from '@/components/Builder/BuilderCanvas';
import { PropertyPanel } from '@/components/Builder/PropertyPanel';

function EditorContent() {
  const params = useParams();
  const router = useRouter();
  const { state, dispatch, exportHTML, canUndo, canRedo } = useBuilderStore();
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    const project = state.projects.find(p => p.id === params.id);
    if (project) {
      dispatch({ type: 'SET_PROJECT', project });
    } else {
      // Create empty project
      const now = new Date().toISOString();
      dispatch({
        type: 'SET_PROJECT',
        project: { id: params.id as string, name: 'Novo Projeto', createdAt: now, updatedAt: now, blocks: [] },
      });
    }
  }, [params.id, state.projects, dispatch]);

  const handleSave = useCallback(() => {
    if (state.project) {
      dispatch({ type: 'MARK_SAVED' });
      // Trigger a notification
      const btn = document.getElementById('save-btn');
      if (btn) {
        btn.textContent = '✓ Salvo';
        setTimeout(() => { btn.textContent = 'Salvar'; }, 2000);
      }
    }
  }, [state.project, dispatch]);

  const handleExport = useCallback(() => {
    const html = exportHTML();
    if (!html) return;
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${state.project?.name || 'site'}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [exportHTML, state.project]);

  const handlePreview = useCallback(() => {
    const html = exportHTML();
    if (!html) return;
    const w = window.open('', '_blank');
    if (w) {
      w.document.write(html);
      w.document.close();
    }
  }, [exportHTML]);

  return (
    <div className="h-screen flex flex-col bg-ios-base">
      {/* ── Toolbar ── */}
      <header className="h-12 flex-shrink-0 flex items-center justify-between px-4 bg-ios-surface border-b border-ios-border">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push('/builder')}
            className="flex items-center gap-1 text-ios-text-secondary hover:text-ios-text text-xs transition-colors"
          >
            <ArrowLeft size={14} />
            Dashboard
          </button>
          <div className="h-4 w-px bg-ios-border" />
          <span className="text-sm font-medium text-ios-text truncate max-w-[200px]">
            {state.project?.name || 'Sem nome'}
          </span>
          {state.isDirty && (
            <span className="text-[10px] text-ios-warning font-mono">· não salvo</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => dispatch({ type: 'UNDO' })}
            disabled={!canUndo}
            className="p-1.5 text-ios-text-secondary hover:text-ios-text disabled:opacity-30 transition-colors"
            title="Desfazer"
          >
            <Undo2 size={16} />
          </button>
          <button
            onClick={() => dispatch({ type: 'REDO' })}
            disabled={!canRedo}
            className="p-1.5 text-ios-text-secondary hover:text-ios-text disabled:opacity-30 transition-colors"
            title="Refazer"
          >
            <Redo2 size={16} />
          </button>
          <div className="h-4 w-px bg-ios-border" />
          <button
            onClick={handlePreview}
            className="btn-outline gap-1.5 px-3 py-1.5 text-[11px]"
          >
            <Eye size={14} />
            Preview
          </button>
          <button
            onClick={handleExport}
            className="btn-outline gap-1.5 px-3 py-1.5 text-[11px]"
          >
            <Download size={14} />
            Export HTML
          </button>
          <button
            id="save-btn"
            onClick={handleSave}
            className="btn-accent gap-1.5 px-3 py-1.5 text-[11px]"
          >
            <Save size={14} />
            Salvar
          </button>
        </div>
      </header>

      {/* ── Editor Body ── */}
      <div className="flex-1 flex overflow-hidden">
        <ComponentPalette />
        <BuilderCanvas />
        <PropertyPanel />
      </div>
    </div>
  );
}

export default function BuilderEditorPage() {
  return (
    <BuilderProvider>
      <EditorContent />
    </BuilderProvider>
  );
}
