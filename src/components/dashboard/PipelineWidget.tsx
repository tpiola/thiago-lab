"use client";

export function PipelineWidget() {
  const stages = [
    { stage: "Lead", count: 48, pct: 100, color: "#FBBF24" },
    { stage: "Contato", count: 32, pct: 67, color: "#60A5FA" },
    { stage: "Proposta", count: 18, pct: 38, color: "#C9A227" },
    { stage: "Fechado", count: 12, pct: 25, color: "#34D399" },
  ];

  return (
    <div className="h-full flex flex-col justify-between">
      <div className="space-y-4">
        {stages.map((s) => (
          <div key={s.stage}>
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="text-[#9BA3B8]">{s.stage}</span>
              <span className="text-[#6B7280]">{s.count} leads</span>
            </div>
            <div className="nexus-progress">
              <div
                className="nexus-progress-bar"
                style={{ width: `${s.pct}%`, background: s.color }}
              />
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 pt-4 border-t border-[rgba(201,162,39,0.06)]">
        <div className="flex items-center justify-between text-xs">
          <span className="text-[#6B7280]">Taxa de Conversão</span>
          <span className="text-[#34D399] font-semibold">25.0%</span>
        </div>
      </div>
    </div>
  );
}
