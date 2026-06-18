"use client";

import { X, GripHorizontal } from "lucide-react";
import type { ReactNode } from "react";

interface WidgetWrapperProps {
  id: string;
  title: string;
  subtitle?: string;
  children: ReactNode;
  onRemove?: (id: string) => void;
}

export function WidgetWrapper({ id, title, subtitle, children, onRemove }: WidgetWrapperProps) {
  return (
    <div className="nexus-card p-0 flex flex-col h-full overflow-hidden group">
      {/* Header with drag handle */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[rgba(201,162,39,0.08)] cursor-grab active:cursor-grabbing react-grid-drag-handle">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <GripHorizontal size={14} className="text-[#4B5563] flex-shrink-0" />
          <div className="min-w-0">
            <h3 className="text-sm font-semibold text-[#E8EDF2] truncate">{title}</h3>
            {subtitle && (
              <p className="text-[10px] text-[#6B7280] truncate">{subtitle}</p>
            )}
          </div>
        </div>
        {onRemove && (
          <button
            onClick={() => onRemove(id)}
            className="p-1 rounded-md text-[#6B7280] hover:text-[#EF4444] hover:bg-[rgba(239,68,68,0.1)] transition-colors opacity-0 group-hover:opacity-100"
            title="Remover widget"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 p-4 overflow-y-auto">{children}</div>
    </div>
  );
}
