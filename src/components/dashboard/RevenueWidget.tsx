"use client";

import { TrendingUp } from "lucide-react";

export function RevenueWidget() {
  return (
    <div className="h-full flex flex-col items-center justify-center text-center p-4">
      <TrendingUp size={32} className="text-[#6B7280] mb-3" />
      <p className="text-sm font-medium text-[#9BA3B8]">
        Demonstração — dados ilustrativos
      </p>
      <p className="text-xs text-[#6B7280] mt-1">
        Conecte sua integração financeira para ver receita real.
      </p>
    </div>
  );
}
