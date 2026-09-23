import { useState } from "react";
import {
  Area,
  ComposedChart,
  CartesianGrid,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { money, weeklySeries, type PageTypeOpportunity } from "@/lib/opportunity-data";

const TABS = ["Traffic", "Conversions", "Revenue"] as const;
type Tab = (typeof TABS)[number];

export function OpportunityGapChart({ opportunity }: { opportunity: PageTypeOpportunity }) {
  const [tab, setTab] = useState<Tab>("Revenue");
  const data = weeklySeries(opportunity, tab);
  const fmt = (n: number) =>
    tab === "Revenue" ? money(n) : tab === "Conversions" ? `${n.toLocaleString("en-GB")}` : `${Math.round(n / 1000)}k`;

  return (
    <section className="rounded-lg border border-border bg-card p-5">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
        <div>
          <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Trend</p>
          <h2 className="text-base font-semibold mt-0.5">Actual vs potential — last 12 weeks</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Weekly figures. Everything else on this page is annual.
          </p>
          <div className="mt-2 flex items-center gap-4 font-mono text-[11px] text-muted-foreground">
            <span className="inline-flex items-center gap-2">
              <span className="inline-block h-[2px] w-6 bg-primary" />
              Actual
            </span>
            <span className="inline-flex items-center gap-2">
              <span
                className="inline-block w-6"
                style={{ borderTop: "2px dashed var(--muted-foreground)" }}
              />
              Potential
            </span>
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

      <div className="mt-5 h-[260px]">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="oppActualGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.35} />
                <stop offset="100%" stopColor="var(--primary)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="week"
              stroke="var(--muted-foreground)"
              tick={{ fontSize: 10, fontFamily: "var(--font-mono)" }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="var(--muted-foreground)"
              tick={{ fontSize: 10, fontFamily: "var(--font-mono)" }}
              tickLine={false}
              axisLine={false}
              tickFormatter={fmt}
              width={56}
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
            <Area type="monotone" dataKey="actual" stroke="var(--primary)" strokeWidth={2} fill="url(#oppActualGrad)" />
            <Line
              type="monotone"
              dataKey="potential"
              stroke="var(--muted-foreground)"
              strokeWidth={1.5}
              strokeDasharray="4 4"
              dot={false}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
