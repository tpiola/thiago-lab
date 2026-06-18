"use client";

import { Clock, UserPlus, FileText, CheckCircle, Zap, TrendingUp } from "lucide-react";

const ACTIVITIES = [
  { type: "lead", text: "Novo lead: Empresa XYZ", time: "2 min atrás", icon: UserPlus, color: "#FBBF24" },
  { type: "proposal", text: "Proposta enviada para Acme Corp", time: "15 min atrás", icon: FileText, color: "#C9A227" },
  { type: "deal", text: "Negócio fechado: TechStart", time: "1h atrás", icon: CheckCircle, color: "#34D399" },
  { type: "automation", text: "Automação 'Follow-up' executada", time: "2h atrás", icon: Zap, color: "#60A5FA" },
  { type: "lead", text: "Novo lead: Maria Silva (Potencial)", time: "3h atrás", icon: UserPlus, color: "#FBBF24" },
  { type: "deal", text: "Pipeline atualizado: GlobalTech", time: "5h atrás", icon: TrendingUp, color: "#C9A227" },
];

export function ActivityWidget() {
  return (
    <div className="h-full overflow-y-auto">
      <div className="flex items-center gap-1 text-xs text-[#6B7280] mb-3">
        <Clock size={12} />
        <span>Hoje</span>
      </div>
      <div className="space-y-0">
        {ACTIVITIES.map((a, i) => {
          const Icon = a.icon;
          return (
            <div key={i} className="nexus-timeline-item last:pb-0">
              <div className="flex items-start gap-3">
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                  style={{ background: `${a.color}15`, border: `1px solid ${a.color}25` }}
                >
                  <Icon size={13} style={{ color: a.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-[#E8EDF2]">{a.text}</p>
                  <p className="text-xs text-[#6B7280] mt-0.5">{a.time}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
