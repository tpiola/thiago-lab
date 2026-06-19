"use client";

import { motion } from "framer-motion";
import {
  BarChart3,
  Activity,
} from "lucide-react";

/* ═══════════════════════════════════════════════════════════════════════════
   ANALYTICS & BI — Em construção
   Intelligence OS — thiagolab.com
   ═══════════════════════════════════════════════════════════════════════════ */

const C = {
  bg: "#06080C",
  surface: "#0C0F15",
  text: "#E8EDF2",
  muted: "#7A8694",
  accent: "#3DF5C5",
  accentDim: "rgba(61, 245, 197, 0.12)",
  border: "rgba(61, 245, 197, 0.08)",
  glass: "rgba(12, 15, 21, 0.75)",
};

export default function AnalyticsPage() {
  return (
    <div className="min-h-screen" style={{ background: C.bg }}>
      <div className="mx-auto max-w-7xl px-4 py-6 lg:px-8 lg:py-8">
        {/* ── Header ────────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-2xl font-bold text-[#E8EDF2] font-['Clash_Display',system-ui,sans-serif]">
            Analytics & BI
          </h1>
          <p className="text-sm text-[#7A8694] mt-1">
            MRR, ARR, Churn, LTV, receita, cohort — plataforma em desenvolvimento
          </p>
        </motion.div>

        {/* ── Em construção ──────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col items-center justify-center py-20 px-4 text-center rounded-2xl border border-[rgba(61,245,197,0.06)] bg-[rgba(12,15,21,0.5)]"
        >
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
               style={{ background: C.accentDim, border: `1px solid ${C.border}` }}>
            <Activity size={32} style={{ color: C.accent }} />
          </div>
          <h2 className="text-xl font-bold text-[#E8EDF2] mb-2 font-['Clash_Display',system-ui,sans-serif]">
            Analytics em construção
          </h2>
          <p className="text-sm text-[#7A8694] max-w-md mb-8">
            Os dados reais de MRR, ARR, Churn e LTV serão exibidos aqui
            quando as integrações financeiras estiverem configuradas.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-3xl w-full">
            {[
              { label: "Receita", desc: "MRR, ARR, receita mensal" },
              { label: "Cohorts", desc: "Retenção e churn por período" },
              { label: "Funil", desc: "Conversão em cada etapa" },
              { label: "Previsão", desc: "Forecast com cenários" },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-xl p-4 text-left"
                style={{ background: C.surface, border: `1px solid ${C.border}` }}
              >
                <BarChart3 size={20} style={{ color: C.accent }} className="mb-2" />
                <p className="text-sm font-semibold text-[#E8EDF2]">{item.label}</p>
                <p className="text-xs text-[#7A8694] mt-0.5">{item.desc}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
