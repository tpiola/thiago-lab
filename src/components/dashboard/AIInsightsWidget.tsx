"use client";

import { Sparkles } from "lucide-react";

export function AIInsightsWidget() {
  return (
    <div className="h-full flex flex-col items-center justify-center text-center p-4">
      <Sparkles size={32} className="text-[#6B7280] mb-3" />
      <p className="text-sm font-medium text-[#9BA3B8]">
        Demonstração — insights ilustrativos
      </p>
      <p className="text-xs text-[#6B7280] mt-1">
        Insights gerados por IA serão exibidos aqui quando houver dados suficientes.
      </p>
    </div>
  );
}
