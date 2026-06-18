"use client";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

const DATA = [
  { channel: "Orgânico", valor: 145 },
  { channel: "Indicação", valor: 89 },
  { channel: "Redes Sociais", valor: 52 },
  { channel: "Email", valor: 26 },
  { channel: "Pago", valor: 38 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload) return null;
  return (
    <div className="nexus-card p-3 text-xs shadow-xl">
      <p className="text-[#9BA3B8] mb-1">{label}</p>
      <p className="text-[#C9A227] font-medium">{payload[0]?.value} leads</p>
    </div>
  );
};

export function LeadsWidget() {
  const total = DATA.reduce((sum, d) => sum + d.valor, 0);
  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-3">
        <span className="text-2xl font-bold text-[#E8EDF2] font-['Clash_Display',system-ui,sans-serif]">
          {total}
        </span>
        <span className="text-xs text-[#34D399] font-medium">+8.2%</span>
      </div>
      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={DATA} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(201,162,39,0.06)" horizontal={false} />
            <XAxis type="number" tick={{ fill: "#6B7280", fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis dataKey="channel" type="category" tick={{ fill: "#6B7280", fontSize: 10 }} axisLine={false} tickLine={false} width={85} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="valor" fill="#C9A227" radius={[0, 4, 4, 0]} barSize={16} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
