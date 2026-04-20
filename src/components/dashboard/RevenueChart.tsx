import { useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const TABS = ["Revenue", "Traffic", "Conversions"] as const;
type Tab = (typeof TABS)[number];

const DATA = Array.from({ length: 30 }, (_, i) => {
  const day = i + 1;
  const base = 50000 + Math.sin(i / 3) * 8000 + i * 600;
  return {
    day: `D${day}`,
    actual: Math.round(base + Math.random() * 4000),
    potential: Math.round(base * 1.85 + Math.random() * 3000),
  };
});

const FORMATTERS: Record<Tab, (n: number) => string> = {
  Revenue: (n) => `£${(n / 1000).toFixed(0)}k`,
  Traffic: (n) => `${(n / 100).toFixed(0)}k`,
  Conversions: (n) => `${(n / 1000).toFixed(1)}k`,
};

export function RevenueChart() {
  const [tab, setTab] = useState<Tab>("Revenue");
  const fmt = FORMATTERS[tab];

  return (
    <div className="rounded-lg border border-border bg-card p-5">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
        <div>
          <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Performance vs Potential</p>
          <h2 className="text-base font-semibold mt-0.5">Organic {tab} — last 30 days</h2>
          <div className="mt-3 flex items-center gap-4 text-xs">
            <Legend color="var(--primary)" label={`${tab} (actual)`} solid />
            <Legend color="var(--muted-foreground)" label="Potential (forecast)" dashed />
          </div>
        </div>

        <div className="flex items-center rounded-md border border-border bg-surface p-0.5">
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-3 py-1.5 text-xs font-mono rounded-sm transition-colors ${
                tab === t ? "bg-card text-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-5 h-[320px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={DATA} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="actualGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.4} />
                <stop offset="100%" stopColor="var(--primary)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="day"
              stroke="var(--muted-foreground)"
              tick={{ fontSize: 10, fontFamily: "var(--font-mono)" }}
              tickLine={false}
              axisLine={false}
              interval={3}
            />
            <YAxis
              stroke="var(--muted-foreground)"
              tick={{ fontSize: 10, fontFamily: "var(--font-mono)" }}
              tickLine={false}
              axisLine={false}
              tickFormatter={fmt}
              width={50}
            />
            <Tooltip
              contentStyle={{
                background: "var(--popover)",
                border: "1px solid var(--border)",
                borderRadius: 8,
                fontSize: 12,
                fontFamily: "var(--font-mono)",
              }}
              labelStyle={{ color: "var(--muted-foreground)", fontSize: 10 }}
              formatter={(value: number, name) => [fmt(value), name === "actual" ? "Actual" : "Potential"]}
            />
            <Area
              type="monotone"
              dataKey="actual"
              stroke="var(--primary)"
              strokeWidth={2}
              fill="url(#actualGrad)"
            />
            <Line
              type="monotone"
              dataKey="potential"
              stroke="var(--muted-foreground)"
              strokeWidth={1.5}
              strokeDasharray="4 4"
              dot={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function Legend({ color, label, solid, dashed }: { color: string; label: string; solid?: boolean; dashed?: boolean }) {
  return (
    <span className="inline-flex items-center gap-2 text-muted-foreground">
      <span
        className="inline-block w-6 h-[2px]"
        style={{
          background: solid ? color : "transparent",
          borderTop: dashed ? `2px dashed ${color}` : undefined,
        }}
      />
      <span className="font-mono text-[11px]">{label}</span>
    </span>
  );
}
