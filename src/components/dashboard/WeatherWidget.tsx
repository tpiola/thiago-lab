"use client";

import { CloudSun } from "lucide-react";

export function WeatherWidget() {
  return (
    <div className="h-full flex flex-col items-center justify-center text-center p-4">
      <CloudSun size={32} className="text-[#6B7280] mb-3" />
      <p className="text-sm font-medium text-[#9BA3B8]">
        Clima — em implementação
      </p>
      <p className="text-xs text-[#6B7280] mt-1">
        Conecte uma API de previsão do tempo para dados reais.
      </p>
    </div>
  );
}
