'use client';

/* ==========================================================================
   Builder Store — React Context + useReducer
   Gerencia estado do editor visual e persistência localStorage
   ========================================================================== */

import React, { createContext, useContext, useReducer, useCallback, useEffect, useRef } from 'react';
import type { BuilderBlock, BuilderProject, Template } from './BuilderTypes';
import { TEMPLATES } from './BuilderTypes';
import { renderBlockHtml } from '@/lib/generator/blockHtml';

/* ─── State ─────────────────────────────────────────────────────────────── */
interface BuilderState {
  project: BuilderProject | null;
  selectedBlockId: string | null;
  history: BuilderBlock[][];
  historyIndex: number;
  projects: BuilderProject[];
  projectsLoaded: boolean;
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
      return { ...state, projects: action.projects, projectsLoaded: true };
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
  projectsLoaded: false,
  isDirty: false,
};

/* ─── Context ───────────────────────────────────────────────────────────── */
interface BuilderContextValue {
  state: BuilderState;
  dispatch: React.Dispatch<BuilderAction>;
  createProject: (name: string, templateId?: string) => BuilderProject;
  createProjectFromBlocks: (name: string, blocks: BuilderBlock[]) => BuilderProject;
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

  const createProjectFromBlocks = useCallback((name: string, blocks: BuilderBlock[]): BuilderProject => {
    const id = generateId();
    const now = new Date().toISOString();
    const project: BuilderProject = {
      id,
      name,
      createdAt: now,
      updatedAt: now,
      blocks: blocks.map(b => ({ ...b, id: generateId() })),
    };
    dispatch({ type: 'ADD_PROJECT', project });
    return project;
  }, []);

  const exportHTML = useCallback((): string => {
    if (!state.project) return '';
    const sections = state.project.blocks.map(b => renderBlockHtml(b)).join('\n');
    return `<!DOCTYPE html><html lang="pt-BR"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><title>${state.project.name}</title><style>body{margin:0;font-family:system-ui,-apple-system,sans-serif;background:#06080C;color:#E8EDF2}a{transition:all 0.2s}details summary::-webkit-details-marker{color:#3DF5C5}</style></head><body>${sections}</body></html>`;
  }, [state.project]);

  const canUndo = state.historyIndex > 0;
  const canRedo = state.historyIndex < state.history.length - 1;

  return (
    <BuilderContext.Provider value={{ state, dispatch, createProject, createProjectFromBlocks, exportHTML, canUndo, canRedo }}>
      {children}
    </BuilderContext.Provider>
  );
}

export function useBuilderStore() {
  const ctx = useContext(BuilderContext);
  if (!ctx) throw new Error('useBuilderStore must be used within BuilderProvider');
  return ctx;
}
