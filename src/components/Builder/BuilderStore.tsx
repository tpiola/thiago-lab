'use client';

/* ==========================================================================
   Builder Store — React Context + useReducer
   Gerencia estado do editor visual e persistência localStorage
   ========================================================================== */

import React, { createContext, useContext, useReducer, useCallback, useEffect, useRef } from 'react';
import type { BuilderBlock, BuilderProject, Template } from './BuilderTypes';
import { TEMPLATES } from './BuilderTypes';

/* ─── State ─────────────────────────────────────────────────────────────── */
interface BuilderState {
  project: BuilderProject | null;
  selectedBlockId: string | null;
  history: BuilderBlock[][];
  historyIndex: number;
  projects: BuilderProject[];
  isDirty: boolean;
}

type BuilderAction =
  | { type: 'SET_PROJECT'; project: BuilderProject }
  | { type: 'ADD_BLOCK'; block: BuilderBlock }
  | { type: 'REMOVE_BLOCK'; blockId: string }
  | { type: 'MOVE_BLOCK'; blockId: string; direction: 'up' | 'down' }
  | { type: 'UPDATE_BLOCK_PROPS'; blockId: string; props: Record<string, unknown> }
  | { type: 'REORDER_BLOCKS'; blocks: BuilderBlock[] }
  | { type: 'SELECT_BLOCK'; blockId: string | null }
  | { type: 'UNDO' }
  | { type: 'REDO' }
  | { type: 'LOAD_PROJECTS'; projects: BuilderProject[] }
  | { type: 'ADD_PROJECT'; project: BuilderProject }
  | { type: 'MARK_SAVED' };

const STORAGE_KEY = 'thiagolab-builder-projects';

function saveToStorage(projects: BuilderProject[]) {
  if (typeof window === 'undefined') return;
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(projects)); } catch { /* quota */ }
}

function loadFromStorage(): BuilderProject[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function generateId(): string {
  return crypto.randomUUID?.() ?? Math.random().toString(36).slice(2, 11);
}

function saveSnapshot(state: BuilderState): Partial<BuilderState> {
  if (!state.project) return {};
  const blocks = state.project.blocks;
  const history = state.history.slice(0, state.historyIndex + 1);
  history.push(JSON.parse(JSON.stringify(blocks)));
  if (history.length > 50) history.shift();
  return { history, historyIndex: history.length - 1, isDirty: true };
}

function reducer(state: BuilderState, action: BuilderAction): BuilderState {
  switch (action.type) {
    case 'SET_PROJECT': {
      const snapshot = JSON.parse(JSON.stringify(action.project.blocks));
      return {
        ...state,
        project: action.project,
        selectedBlockId: null,
        history: [snapshot],
        historyIndex: 0,
        isDirty: false,
      };
    }
    case 'ADD_BLOCK': {
      if (!state.project) return state;
      const snap = saveSnapshot(state);
      return {
        ...state,
        ...snap,
        project: {
          ...state.project,
          blocks: [...state.project.blocks, action.block],
          updatedAt: new Date().toISOString(),
        },
        selectedBlockId: action.block.id,
      };
    }
    case 'REMOVE_BLOCK': {
      if (!state.project) return state;
      const snap = saveSnapshot(state);
      const blocks = state.project.blocks.filter(b => b.id !== action.blockId);
      return {
        ...state,
        ...snap,
        project: { ...state.project, blocks, updatedAt: new Date().toISOString() },
        selectedBlockId: state.selectedBlockId === action.blockId ? null : state.selectedBlockId,
      };
    }
    case 'MOVE_BLOCK': {
      if (!state.project) return state;
      const idx = state.project.blocks.findIndex(b => b.id === action.blockId);
      if (idx === -1) return state;
      const newIdx = action.direction === 'up' ? idx - 1 : idx + 1;
      if (newIdx < 0 || newIdx >= state.project.blocks.length) return state;
      const snap = saveSnapshot(state);
      const blocks = [...state.project.blocks];
      [blocks[idx], blocks[newIdx]] = [blocks[newIdx], blocks[idx]];
      return {
        ...state,
        ...snap,
        project: { ...state.project, blocks, updatedAt: new Date().toISOString() },
      };
    }
    case 'UPDATE_BLOCK_PROPS': {
      if (!state.project) return state;
      const snap = saveSnapshot(state);
      const blocks = state.project.blocks.map(b =>
        b.id === action.blockId ? { ...b, props: { ...b.props, ...action.props } } : b
      );
      return {
        ...state,
        ...snap,
        project: { ...state.project, blocks, updatedAt: new Date().toISOString() },
      };
    }
    case 'REORDER_BLOCKS': {
      if (!state.project) return state;
      const snap = saveSnapshot(state);
      return {
        ...state,
        ...snap,
        project: { ...state.project, blocks: action.blocks, updatedAt: new Date().toISOString() },
      };
    }
    case 'SELECT_BLOCK':
      return { ...state, selectedBlockId: action.blockId };
    case 'UNDO': {
      if (state.historyIndex <= 0) return state;
      const newIndex = state.historyIndex - 1;
      const blocks = JSON.parse(JSON.stringify(state.history[newIndex]));
      if (!state.project) return state;
      return {
        ...state,
        historyIndex: newIndex,
        project: { ...state.project, blocks, updatedAt: new Date().toISOString() },
        isDirty: true,
      };
    }
    case 'REDO': {
      if (state.historyIndex >= state.history.length - 1) return state;
      const newIndex = state.historyIndex + 1;
      const blocks = JSON.parse(JSON.stringify(state.history[newIndex]));
      if (!state.project) return state;
      return {
        ...state,
        historyIndex: newIndex,
        project: { ...state.project, blocks, updatedAt: new Date().toISOString() },
        isDirty: true,
      };
    }
    case 'LOAD_PROJECTS':
      return { ...state, projects: action.projects };
    case 'ADD_PROJECT': {
      const projects = [action.project, ...state.projects];
      saveToStorage(projects);
      return { ...state, projects };
    }
    case 'MARK_SAVED':
      return { ...state, isDirty: false };
    default:
      return state;
  }
}

const initialState: BuilderState = {
  project: null,
  selectedBlockId: null,
  history: [],
  historyIndex: -1,
  projects: [],
  isDirty: false,
};

/* ─── Context ───────────────────────────────────────────────────────────── */
interface BuilderContextValue {
  state: BuilderState;
  dispatch: React.Dispatch<BuilderAction>;
  createProject: (name: string, templateId?: string) => BuilderProject;
  exportHTML: () => string;
  canUndo: boolean;
  canRedo: boolean;
}

const BuilderContext = createContext<BuilderContextValue | null>(null);

export function BuilderProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const loaded = useRef(false);

  useEffect(() => {
    if (loaded.current) return;
    loaded.current = true;
    const projects = loadFromStorage();
    dispatch({ type: 'LOAD_PROJECTS', projects });
  }, []);

  useEffect(() => {
    if (loaded.current) {
      saveToStorage(state.projects);
    }
  }, [state.projects]);

  const createProject = useCallback((name: string, templateId?: string): BuilderProject => {
    const id = generateId();
    const now = new Date().toISOString();
    let blocks: BuilderBlock[] = [];
    if (templateId) {
      const template = TEMPLATES.find(t => t.id === templateId);
      if (template) {
        blocks = template.blocks.map(b => ({ ...b, id: generateId() }));
      }
    }
    const project: BuilderProject = { id, name, createdAt: now, updatedAt: now, blocks };
    dispatch({ type: 'ADD_PROJECT', project });
    return project;
  }, []);

  const exportHTML = useCallback((): string => {
    if (!state.project) return '';
    const blocks = state.project.blocks;
    const sections = blocks.map(b => {
      const p = b.props as Record<string, unknown>;
      switch (b.type) {
        case 'hero': {
          const title = String(p.title ?? '');
          const subtitle = String(p.subtitle ?? '');
          const cta = String(p.cta ?? '');
          const bgColor = String(p.bgColor ?? '#06080C');
          const accentColor = String(p.accentColor ?? '#3DF5C5');
          return `<section style="background:${bgColor};color:#E8EDF2;padding:6rem 1.5rem;text-align:center;min-height:80vh;display:flex;flex-direction:column;justify-content:center;align-items:center">
            <h1 style="font-size:clamp(2rem,6vw,4rem);font-weight:700;max-width:800px;margin:0 auto 1rem">${title}</h1>
            <p style="font-size:1.25rem;color:#B0B8C4;max-width:600px;margin:0 auto 2rem">${subtitle}</p>
            <a href="#" style="display:inline-block;background:${accentColor};color:#06080C;padding:0.75rem 2rem;border-radius:8px;font-weight:600;text-decoration:none">${cta}</a>
          </section>`;
        }
        case 'features': {
          const title = String(p.title ?? 'Recursos');
          const items = (p.items as unknown) as Array<Record<string, string>>;
          return `<section style="padding:4rem 1.5rem;background:#0C0F15">
            <h2 style="font-size:2rem;text-align:center;margin-bottom:3rem;color:#E8EDF2">${title}</h2>
            <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:1.5rem;max-width:1200px;margin:0 auto">
              ${items.map((item: Record<string, string>) =>
                `<div style="background:#12161E;border:1px solid #1E2433;border-radius:12px;padding:1.5rem">
                  <div style="font-size:2rem;margin-bottom:0.5rem">${item.icon ?? ''}</div>
                  <h3 style="color:#E8EDF2;margin:0 0 0.5rem">${item.title ?? ''}</h3>
                  <p style="color:#7A8694;margin:0">${item.desc ?? ''}</p>
                </div>`
              ).join('')}
            </div>
          </section>`;
        }
        case 'pricing': {
          const title = String(p.title ?? 'Planos');
          const plans = (p.plans as unknown) as Array<Record<string, unknown>>;
          return `<section style="padding:4rem 1.5rem;background:#06080C">
            <h2 style="font-size:2rem;text-align:center;margin-bottom:3rem;color:#E8EDF2">${title}</h2>
            <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:1.5rem;max-width:1000px;margin:0 auto">
              ${plans.map((plan: Record<string, unknown>) => {
                const name = String(plan.name ?? '');
                const price = String(plan.price ?? '');
                const featured = !!plan.featured;
                const features = (plan.features ?? []) as string[];
                return `<div style="background:#12161E;border:1px solid ${featured ? '#3DF5C5' : '#1E2433'};border-radius:12px;padding:2rem;text-align:center">
                  <h3 style="color:#E8EDF2;margin:0 0 0.5rem">${name}</h3>
                  <div style="font-size:2.5rem;font-weight:700;color:#3DF5C5;margin:1rem 0">R$${price}<span style="font-size:1rem;color:#7A8694">/mês</span></div>
                  <ul style="list-style:none;padding:0;margin:1.5rem 0;color:#B0B8C4">
                    ${features.map((f: string) => `<li style="padding:0.375rem 0">✓ ${f}</li>`).join('')}
                  </ul>
                  <a href="#" style="display:inline-block;background:${featured ? '#3DF5C5' : 'transparent'};color:${featured ? '#06080C' : '#E8EDF2'};border:1px solid ${featured ? '#3DF5C5' : '#1E2433'};padding:0.75rem 2rem;border-radius:8px;font-weight:600;text-decoration:none">Escolher</a>
                </div>`;
              }).join('')}
            </div>
          </section>`;
        }
        case 'testimonials': {
          const title = String(p.title ?? 'Depoimentos');
          const items = (p.items as unknown) as Array<Record<string, string>>;
          return `<section style="padding:4rem 1.5rem;background:#0C0F15">
            <h2 style="font-size:2rem;text-align:center;margin-bottom:3rem;color:#E8EDF2">${title}</h2>
            <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:1.5rem;max-width:1000px;margin:0 auto">
              ${items.map((item: Record<string, string>) =>
                `<div style="background:#12161E;border:1px solid #1E2433;border-radius:12px;padding:1.5rem">
                  <p style="color:#B0B8C4;font-style:italic;margin:0 0 1rem">"${item.text ?? ''}"</p>
                  <div><strong style="color:#E8EDF2">${item.name ?? ''}</strong><span style="color:#7A8694;margin-left:0.5rem">${item.role ?? ''}</span></div>
                </div>`
              ).join('')}
            </div>
          </section>`;
        }
        case 'faq': {
          const title = String(p.title ?? 'FAQ');
          const items = (p.items as unknown) as Array<Record<string, string>>;
          return `<section style="padding:4rem 1.5rem;background:#06080C">
            <h2 style="font-size:2rem;text-align:center;margin-bottom:3rem;color:#E8EDF2">${title}</h2>
            <div style="max-width:700px;margin:0 auto">
              ${items.map((item: Record<string, string>) =>
                `<details style="background:#12161E;border:1px solid #1E2433;border-radius:12px;margin-bottom:0.75rem;padding:1rem">
                  <summary style="color:#E8EDF2;font-weight:600;cursor:pointer">${item.q ?? ''}</summary>
                  <p style="color:#7A8694;margin-top:0.75rem">${item.a ?? ''}</p>
                </details>`
              ).join('')}
            </div>
          </section>`;
        }
        case 'cta': {
          const title = String(p.title ?? '');
          const subtitle = String(p.subtitle ?? '');
          const buttonText = String(p.buttonText ?? '');
          return `<section style="padding:4rem 1.5rem;text-align:center;background:linear-gradient(135deg,#1A1F2B,#0C0F15)">
            <h2 style="font-size:2rem;color:#E8EDF2;margin:0 0 0.5rem">${title}</h2>
            <p style="color:#B0B8C4;margin:0 0 2rem">${subtitle}</p>
            <a href="#" style="display:inline-block;background:#3DF5C5;color:#06080C;padding:0.75rem 2rem;border-radius:8px;font-weight:600;text-decoration:none">${buttonText}</a>
          </section>`;
        }
        case 'footer': {
          const copyright = String(p.copyright ?? '');
          const links = (p.links as unknown) as Array<Record<string, string>>;
          return `<footer style="padding:2rem 1.5rem;background:#06080C;border-top:1px solid #1E2433;text-align:center">
            <p style="color:#7A8694;margin:0 0 1rem">${copyright}</p>
            <div style="display:flex;justify-content:center;gap:1.5rem">
              ${links.map((link: Record<string, string>) =>
                `<a href="${link.href ?? '#'}" style="color:#B0B8C4;text-decoration:none;font-size:0.875rem">${link.label ?? ''}</a>`
              ).join('')}
            </div>
          </footer>`;
        }
        case 'stats': {
          const title = String(p.title ?? '');
          const items = (p.items as unknown) as Array<Record<string, unknown>>;
          return `<section style="padding:4rem 1.5rem;background:#0C0F15">
            <h2 style="font-size:2rem;text-align:center;margin-bottom:3rem;color:#E8EDF2">${title}</h2>
            <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:2rem;max-width:800px;margin:0 auto;text-align:center">
              ${items.map((item: Record<string, unknown>) =>
                `<div>
                  <div style="font-size:2.5rem;font-weight:700;color:#3DF5C5">${String(item.value ?? 0)}</div>
                  <div style="color:#7A8694;margin-top:0.25rem">${String(item.label ?? '')}</div>
                </div>`
              ).join('')}
            </div>
          </section>`;
        }
        case 'contact': {
          const title = String(p.title ?? 'Contato');
          const email = String(p.email ?? '');
          const phone = String(p.phone ?? '');
          const address = String(p.address ?? '');
          return `<section style="padding:4rem 1.5rem;background:#06080C">
            <h2 style="font-size:2rem;text-align:center;margin-bottom:3rem;color:#E8EDF2">${title}</h2>
            <div style="max-width:500px;margin:0 auto;text-align:center">
              <p style="color:#B0B8C4;margin:0.5rem 0">✉ ${email}</p>
              <p style="color:#B0B8C4;margin:0.5rem 0">📞 ${phone}</p>
              <p style="color:#B0B8C4;margin:0.5rem 0">📍 ${address}</p>
            </div>
          </section>`;
        }
        default:
          return '';
      }
    }).join('\n');
    return `<!DOCTYPE html><html lang="pt-BR"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><title>${state.project.name}</title><style>body{margin:0;font-family:system-ui,-apple-system,sans-serif;background:#06080C;color:#E8EDF2}a{transition:all 0.2s}details summary::-webkit-details-marker{color:#3DF5C5}</style></head><body>${sections}</body></html>`;
  }, [state.project]);

  const canUndo = state.historyIndex > 0;
  const canRedo = state.historyIndex < state.history.length - 1;

  return (
    <BuilderContext.Provider value={{ state, dispatch, createProject, exportHTML, canUndo, canRedo }}>
      {children}
    </BuilderContext.Provider>
  );
}

export function useBuilderStore() {
  const ctx = useContext(BuilderContext);
  if (!ctx) throw new Error('useBuilderStore must be used within BuilderProvider');
  return ctx;
}
