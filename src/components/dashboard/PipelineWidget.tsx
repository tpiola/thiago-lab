"use client";

import { LayoutDashboard } from "lucide-react";

export function PipelineWidget() {
  return (
    <div className="h-full flex flex-col items-center justify-center text-center p-4">
      <LayoutDashboard size={32} className="text-[#6B7280] mb-3" />
      <p className="text-sm font-medium text-[#9BA3B8]">
        Demonstração — dados ilustrativos
      </p>
      <p className="text-xs text-[#6B7280] mt-1">
        Pipeline de vendas aparecerá aqui quando houver leads reais.
      </p>
    </div>
  );
}
