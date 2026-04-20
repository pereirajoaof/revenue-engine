import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const DATA = [
  { type: "Routes", current: 412, gap: 798 },
  { type: "Cities", current: 308, gap: 534 },
  { type: "Category", current: 524, gap: 266 },
  { type: "Blog", current: 186, gap: 226 },
  { type: "Comparison", current: 94, gap: 218 },
  { type: "Glossary", current: 42, gap: 86 },
];

export function RevenueByPageType() {
  return (
    <div className="rounded-lg border border-border bg-card p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Distribution</p>
          <h2 className="text-base font-semibold mt-0.5">Revenue & gap by page type</h2>
        </div>
        <div className="flex items-center gap-3 text-[11px] font-mono text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-sm bg-primary" /> Current
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-sm bg-muted-foreground/40" /> Gap
          </span>
        </div>
      </div>

      <div className="mt-4 h-[260px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={DATA} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="type"
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
              tickFormatter={(v) => `£${v}k`}
              width={45}
            />
            <Tooltip
              cursor={{ fill: "var(--surface)", opacity: 0.5 }}
              contentStyle={{
                background: "var(--popover)",
                border: "1px solid var(--border)",
                borderRadius: 8,
                fontSize: 12,
                fontFamily: "var(--font-mono)",
              }}
              formatter={(v: number, name) => [`£${v}k`, name === "current" ? "Current" : "Gap"]}
            />
            <Bar dataKey="current" stackId="a" fill="var(--primary)" radius={[0, 0, 0, 0]} />
            <Bar dataKey="gap" stackId="a" fill="var(--muted-foreground)" fillOpacity={0.25} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
