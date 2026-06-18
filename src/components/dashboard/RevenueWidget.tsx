"use client";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

const DATA = [
  { month: "Jan", receita: 128000 },
  { month: "Fev", receita: 135000 },
  { month: "Mar", receita: 142000 },
  { month: "Abr", receita: 158000 },
  { month: "Mai", receita: 165000 },
  { month: "Jun", receita: 184700 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload) return null;
  return (
    <div className="nexus-card p-3 text-xs shadow-xl">
      <p className="text-[#9BA3B8] mb-1">{label}</p>
      {payload.map((p: any, i: number) => (
        <p key={i} style={{ color: p.color }} className="font-medium">
          Receita: R$ {(p.value / 1000).toFixed(1)}k
        </p>
      ))}
    </div>
  );
};

export function RevenueWidget() {
  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-3">
        <span className="text-2xl font-bold text-[#E8EDF2] font-['Clash_Display',system-ui,sans-serif]">
          R$ 184.7k
        </span>
        <span className="text-xs text-[#34D399] font-medium">+12.5%</span>
      </div>
      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={DATA}>
            <defs>
              <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#C9A227" stopOpacity={0.25} />
                <stop offset="100%" stopColor="#C9A227" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(201,162,39,0.06)" />
            <XAxis dataKey="month" tick={{ fill: "#6B7280", fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: "#6B7280", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `R$${(v / 1000).toFixed(0)}k`} />
            <Tooltip content={<CustomTooltip />} />
            <Area type="monotone" dataKey="receita" stroke="#C9A227" strokeWidth={2} fill="url(#revGrad)" name="receita" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
