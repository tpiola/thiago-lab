"use client";

import { BarChart3 } from "lucide-react";

export function AnalyticsWidget() {
  return (
    <div className="h-full flex flex-col items-center justify-center text-center p-4">
      <BarChart3 size={32} className="text-[#6B7280] mb-3" />
      <p className="text-sm font-medium text-[#9BA3B8]">
        Demonstração — dados ilustrativos
      </p>
      <p className="text-xs text-[#6B7280] mt-1">
        Analytics disponível após configurar fontes de dados.
      </p>
    </div>
  );
}
