"use client";

import { Sparkles, Lightbulb, TrendingUp, AlertTriangle, ArrowRight } from "lucide-react";

const INSIGHTS = [
  {
    icon: TrendingUp,
    color: "#34D399",
    title: "Oportunidade",
    text: "Leads orgânicos cresceram 18% este mês. Invista em SEO.",
  },
  {
    icon: Lightbulb,
    color: "#C9A227",
    title: "Sugestão",
    text: "Automação de follow-up pode recuperar 12 leads inativos.",
  },
  {
    icon: AlertTriangle,
    color: "#FBBF24",
    title: "Alerta",
    text: "Taxa de conversão caiu 3% na última semana. Revise o pipeline.",
  },
];

export function AIInsightsWidget() {
  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center gap-2 mb-3">
        <Sparkles size={14} className="text-[#C9A227]" />
        <span className="text-[10px] text-[#6B7280] uppercase tracking-wider font-medium">
          Análise em tempo real
        </span>
      </div>
      <div className="flex-1 space-y-3">
        {INSIGHTS.map((insight, i) => {
          const Icon = insight.icon;
          return (
            <div
              key={i}
              className="nexus-card p-3 border-l-2"
              style={{ borderLeftColor: insight.color }}
            >
              <div className="flex items-start gap-2.5">
                <div
                  className="w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5"
                  style={{ background: `${insight.color}15` }}
                >
                  <Icon size={12} style={{ color: insight.color }} />
                </div>
                <div className="min-w-0 flex-1">
                  <p
                    className="text-xs font-semibold mb-0.5"
                    style={{ color: insight.color }}
                  >
                    {insight.title}
                  </p>
                  <p className="text-xs text-[#9BA3B8] leading-relaxed">
                    {insight.text}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <button className="mt-3 flex items-center gap-1 text-xs text-[#C9A227] hover:text-[#F5D76E] transition-colors">
        Ver todos os insights
        <ArrowRight size={12} />
      </button>
    </div>
  );
}
