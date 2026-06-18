'use client';

/* ==========================================================================
   /builder/[id] — Editor Visual Drag & Drop
   Com Deploy 1-Clique, Export ZIP e Preview
   Intelligence OS — thiagolab.com
   ========================================================================== */

import { useEffect, useCallback, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Save, Eye, Download, Undo2, Redo2, ArrowLeft,
  Globe, FileArchive, Loader2, CheckCircle2, ExternalLink,
  XCircle,
} from 'lucide-react';
import { BuilderProvider, useBuilderStore } from '@/components/Builder/BuilderStore';
import { ComponentPalette } from '@/components/Builder/ComponentPalette';
import { BuilderCanvas } from '@/components/Builder/BuilderCanvas';
import { PropertyPanel } from '@/components/Builder/PropertyPanel';
import { Preview } from '@/components/Builder/Preview';

type DeployStatus = 'idle' | 'deploying' | 'success' | 'error';

function EditorContent() {
  const params = useParams();
  const router = useRouter();
  const { state, dispatch, exportHTML, canUndo, canRedo } = useBuilderStore();
  const initialized = useRef(false);

  // ── Deploy state ──
  const [deployStatus, setDeployStatus] = useState<DeployStatus>('idle');
  const [deployUrl, setDeployUrl] = useState<string>('');
  const [deployError, setDeployError] = useState<string>('');
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    const project = state.projects.find(p => p.id === params.id);
    if (project) {
      dispatch({ type: 'SET_PROJECT', project });
    } else {
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
      const btn = document.getElementById('save-btn');
      if (btn) {
        btn.textContent = '✓ Salvo';
        setTimeout(() => { btn.textContent = 'Salvar'; }, 2000);
      }
    }
  }, [state.project, dispatch]);

  const handleExportZip = useCallback(async () => {
    if (!state.project || state.project.blocks.length === 0) return;

    try {
      const res = await fetch('/api/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: state.project.name,
          blocks: state.project.blocks,
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({ error: 'Erro ao exportar' }));
        alert('Erro: ' + (errData.error || res.statusText));
        return;
      }

      // Download the ZIP
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${state.project.name.toLowerCase().replace(/[^a-z0-9-]/g, '-')}.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      alert('Erro ao exportar: ' + (err instanceof Error ? err.message : String(err)));
    }
  }, [state.project]);

  const handleExportHtml = useCallback(() => {
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

  const handleDeploy = useCallback(async () => {
    if (!state.project || state.project.blocks.length === 0) return;

    setDeployStatus('deploying');
    setDeployError('');

    try {
      const res = await fetch('/api/deploy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: state.project.name,
          blocks: state.project.blocks,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Falha no deploy');
      }

      const deployData = data.deploy;
      const url = deployData.url
        ? (deployData.url.startsWith('http') ? deployData.url : `https://${deployData.url}`)
        : '';

      setDeployUrl(url);
      setDeployStatus('success');

      // Auto-fechar after 10s
      setTimeout(() => {
        setDeployStatus('idle');
      }, 10000);
    } catch (err) {
      setDeployError(err instanceof Error ? err.message : String(err));
      setDeployStatus('error');

      setTimeout(() => {
        setDeployStatus('idle');
      }, 5000);
    }
  }, [state.project]);

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
          {/* Undo / Redo */}
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

          {/* Deploy 1-Clique */}
          {deployStatus === 'idle' && (
            <button
              onClick={handleDeploy}
              disabled={!state.project || state.project.blocks.length === 0}
              className="btn-accent gap-1.5 px-3 py-1.5 text-[11px] disabled:opacity-40"
              title="Publicar na Vercel"
            >
              <Globe size={14} />
              Deploy
            </button>
          )}

          {deployStatus === 'deploying' && (
            <span className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] text-ios-accent font-mono">
              <Loader2 size={14} className="animate-spin" />
              Publicando...
            </span>
          )}

          {deployStatus === 'success' && (
            <a
              href={deployUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] bg-ios-success/10 text-ios-success font-medium rounded-lg border border-ios-success/20 hover:bg-ios-success/20 transition-all"
            >
              <CheckCircle2 size={14} />
              ✅ No ar
              <ExternalLink size={12} />
            </a>
          )}

          {deployStatus === 'error' && (
            <span className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] text-ios-error font-mono">
              <XCircle size={14} />
              Erro: {deployError.slice(0, 40)}
            </span>
          )}

          <div className="h-4 w-px bg-ios-border" />

          {/* Preview */}
          <button
            onClick={() => setShowPreview(true)}
            className="btn-outline gap-1.5 px-3 py-1.5 text-[11px]"
            title="Preview em tempo real"
          >
            <Eye size={14} />
            Preview
          </button>

          {/* Export ZIP */}
          <button
            onClick={handleExportZip}
            disabled={!state.project || state.project.blocks.length === 0}
            className="btn-outline gap-1.5 px-3 py-1.5 text-[11px] disabled:opacity-40"
            title="Exportar como ZIP (Next.js)"
          >
            <FileArchive size={14} />
            ZIP
          </button>

          {/* Export HTML */}
          <button
            onClick={handleExportHtml}
            disabled={!state.project || state.project.blocks.length === 0}
            className="btn-outline gap-1.5 px-3 py-1.5 text-[11px] disabled:opacity-40"
            title="Exportar HTML puro"
          >
            <Download size={14} />
            HTML
          </button>

          <div className="h-4 w-px bg-ios-border" />

          {/* Save */}
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

      {/* ── Preview Modal ── */}
      {showPreview && <Preview />}
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
