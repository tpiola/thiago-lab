"use client";

import { Clock } from "lucide-react";

export function ActivityWidget() {
  return (
    <div className="h-full flex flex-col items-center justify-center text-center p-4">
      <Clock size={32} className="text-[#6B7280] mb-3" />
      <p className="text-sm font-medium text-[#9BA3B8]">
        Nenhuma atividade recente
      </p>
      <p className="text-xs text-[#6B7280] mt-1">
        Atividades aparecerão automaticamente com o uso da plataforma.
      </p>
    </div>
  );
}
