"use client";

import { TrendingUp, Users, Activity, Package, ArrowUpRight, ArrowDownRight } from "lucide-react";

const METRICS = [
  { label: "Receita", value: "R$ 184.7k", change: "+12.5%", positive: true, icon: TrendingUp },
  { label: "Leads", value: "312", change: "+8.2%", positive: true, icon: Users },
  { label: "Automações", value: "89", change: "+23.1%", positive: true, icon: Activity },
  { label: "Produtos", value: "47", change: "-2.4%", positive: false, icon: Package },
];

export function AnalyticsWidget() {
  return (
    <div className="h-full grid grid-cols-2 gap-3">
      {METRICS.map((m) => {
        const Icon = m.icon;
        return (
          <div
            key={m.label}
            className="nexus-card p-3 flex flex-col justify-center"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="w-7 h-7 rounded-lg bg-[rgba(201,162,39,0.08)] border border-[rgba(201,162,39,0.06)] flex items-center justify-center">
                <Icon size={13} className="text-[#C9A227]" />
              </div>
              <span
                className={`text-[10px] font-medium ${
                  m.positive ? "text-[#34D399]" : "text-[#EF4444]"
                }`}
              >
                {m.positive ? (
                  <ArrowUpRight size={10} className="inline mr-0.5" />
                ) : (
                  <ArrowDownRight size={10} className="inline mr-0.5" />
                )}
                {m.change}
              </span>
            </div>
            <div className="text-lg font-bold text-[#E8EDF2] font-['Clash_Display',system-ui,sans-serif]">
              {m.value}
            </div>
            <div className="text-[10px] text-[#6B7280] mt-0.5">{m.label}</div>
          </div>
        );
      })}
    </div>
  );
}
