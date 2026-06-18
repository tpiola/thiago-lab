'use client';

import { type Editor } from '@tiptap/react';
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  CheckSquare,
  Code,
  Quote,
  Minus,
  Undo2,
  Redo2,
  Highlighter,
} from 'lucide-react';

/* ==========================================================================
   Toolbar — Intelligence OS terminal-style editor toolbar
   ========================================================================== */

interface ToolbarProps {
  editor: Editor | null;
}

type ToolGroup = {
  label: string;
  tools: ToolButton[];
};

type ToolButton = {
  icon: React.ReactNode;
  label: string;
  action: () => void;
  isActive?: boolean;
};

const buttonBase =
  'flex items-center justify-center w-8 h-8 rounded text-ios-muted hover:bg-ios-surface-2 hover:text-ios-text transition-all duration-150';
const buttonActive =
  'bg-ios-accent/15 text-ios-accent border border-ios-accent/20 shadow-ios-glow-sm';
const separator = 'w-px h-5 bg-ios-border/40';

export function Toolbar({ editor }: ToolbarProps) {
  if (!editor) return null;

  const groups: ToolGroup[] = [
    {
      label: 'Ações',
      tools: [
        {
          icon: <Undo2 size={15} />,
          label: 'Desfazer',
          action: () => editor.chain().focus().undo().run(),
        },
        {
          icon: <Redo2 size={15} />,
          label: 'Refazer',
          action: () => editor.chain().focus().redo().run(),
        },
      ],
    },
    {
      label: 'Blocos',
      tools: [
        {
          icon: <Heading1 size={15} />,
          label: 'Título 1',
          action: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
          isActive: editor.isActive('heading', { level: 1 }),
        },
        {
          icon: <Heading2 size={15} />,
          label: 'Título 2',
          action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
          isActive: editor.isActive('heading', { level: 2 }),
        },
        {
          icon: <Heading3 size={15} />,
          label: 'Título 3',
          action: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
          isActive: editor.isActive('heading', { level: 3 }),
        },
        {
          icon: <Quote size={15} />,
          label: 'Citação',
          action: () => editor.chain().focus().toggleBlockquote().run(),
          isActive: editor.isActive('blockquote'),
        },
        {
          icon: <Code size={15} />,
          label: 'Bloco de código',
          action: () => editor.chain().focus().toggleCodeBlock().run(),
          isActive: editor.isActive('codeBlock'),
        },
        {
          icon: <Minus size={15} />,
          label: 'Divisor',
          action: () => editor.chain().focus().setHorizontalRule().run(),
        },
      ],
    },
    {
      label: 'Formatação',
      tools: [
        {
          icon: <Bold size={15} />,
          label: 'Negrito',
          action: () => editor.chain().focus().toggleBold().run(),
          isActive: editor.isActive('bold'),
        },
        {
          icon: <Italic size={15} />,
          label: 'Itálico',
          action: () => editor.chain().focus().toggleItalic().run(),
          isActive: editor.isActive('italic'),
        },
        {
          icon: <Underline size={15} />,
          label: 'Sublinhado',
          action: () => editor.chain().focus().toggleUnderline().run(),
          isActive: editor.isActive('underline'),
        },
        {
          icon: <Strikethrough size={15} />,
          label: 'Riscado',
          action: () => editor.chain().focus().toggleStrike().run(),
          isActive: editor.isActive('strike'),
        },
        {
          icon: <Highlighter size={15} />,
          label: 'Destacar',
          action: () => editor.chain().focus().toggleHighlight().run(),
          isActive: editor.isActive('highlight'),
        },
      ],
    },
    {
      label: 'Listas',
      tools: [
        {
          icon: <List size={15} />,
          label: 'Lista',
          action: () => editor.chain().focus().toggleBulletList().run(),
          isActive: editor.isActive('bulletList'),
        },
        {
          icon: <ListOrdered size={15} />,
          label: 'Lista ordenada',
          action: () => editor.chain().focus().toggleOrderedList().run(),
          isActive: editor.isActive('orderedList'),
        },
        {
          icon: <CheckSquare size={15} />,
          label: 'Lista de tarefas',
          action: () => editor.chain().focus().toggleTaskList().run(),
          isActive: editor.isActive('taskList'),
        },
      ],
    },
  ];

  return (
    <div className="flex flex-wrap items-center gap-1 rounded-lg border border-ios-border/50 bg-ios-surface/80 px-3 py-2 backdrop-blur-xl">
      {groups.map((group, gIdx) => (
        <div key={group.label} className="flex items-center gap-0.5">
          {gIdx > 0 && <div className={separator} />}
          {group.tools.map((tool) => (
            <button
              key={tool.label}
              type="button"
              onClick={tool.action}
              className={`${buttonBase} ${tool.isActive ? buttonActive : ''}`}
              title={tool.label}
            >
              {tool.icon}
            </button>
          ))}
        </div>
      ))}
    </div>
  );
}

export default Toolbar;
