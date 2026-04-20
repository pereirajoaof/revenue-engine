import {
  CartesianGrid,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
  ZAxis,
} from "recharts";

type Point = { name: string; effort: number; impact: number; confidence: number };

const POINTS: Point[] = [
  { name: "Internal linking on /routes/", effort: 25, impact: 120, confidence: 86 },
  { name: "Schema for /cities/", effort: 18, impact: 92, confidence: 79 },
  { name: "Title rewrites — top 50", effort: 12, impact: 64, confidence: 91 },
  { name: "Refresh blog top 20", effort: 35, impact: 58, confidence: 72 },
  { name: "Comparison page templates", effort: 70, impact: 145, confidence: 65 },
  { name: "Category facet pages", effort: 82, impact: 88, confidence: 54 },
  { name: "Glossary expansion", effort: 22, impact: 32, confidence: 68 },
  { name: "Core Web Vitals fixes", effort: 55, impact: 110, confidence: 81 },
];

export function ImpactEffortMatrix() {
  return (
    <div className="rounded-lg border border-border bg-card p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Decision tool</p>
          <h2 className="text-base font-semibold mt-0.5">Impact vs Effort</h2>
        </div>
        <span className="text-[10px] font-mono text-muted-foreground">Bubble size = confidence</span>
      </div>

      <div className="mt-4 h-[320px]">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 20, right: 20, bottom: 30, left: 10 }}>
            <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" />
            <XAxis
              type="number"
              dataKey="effort"
              name="Effort"
              domain={[0, 100]}
              stroke="var(--muted-foreground)"
              tick={{ fontSize: 10, fontFamily: "var(--font-mono)" }}
              tickLine={false}
              axisLine={false}
              label={{
                value: "Effort →",
                position: "insideBottom",
                offset: -15,
                style: { fontSize: 10, fontFamily: "var(--font-mono)", fill: "var(--muted-foreground)" },
              }}
            />
            <YAxis
              type="number"
              dataKey="impact"
              name="Impact"
              stroke="var(--muted-foreground)"
              tick={{ fontSize: 10, fontFamily: "var(--font-mono)" }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => `£${v}k`}
              label={{
                value: "Revenue impact",
                angle: -90,
                position: "insideLeft",
                offset: 10,
                style: { fontSize: 10, fontFamily: "var(--font-mono)", fill: "var(--muted-foreground)" },
              }}
            />
            <ZAxis type="number" dataKey="confidence" range={[60, 400]} />
            <Tooltip
              cursor={{ strokeDasharray: "3 3", stroke: "var(--border)" }}
              contentStyle={{
                background: "var(--popover)",
                border: "1px solid var(--border)",
                borderRadius: 8,
                fontSize: 12,
              }}
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null;
                const p = payload[0].payload as Point;
                return (
                  <div className="rounded-md border border-border bg-popover p-3 shadow-lg">
                    <p className="text-xs font-semibold">{p.name}</p>
                    <div className="mt-2 space-y-1 text-[11px] font-mono text-muted-foreground">
                      <div className="flex justify-between gap-6">
                        <span>Impact</span>
                        <span className="text-primary">+£{p.impact}k/yr</span>
                      </div>
                      <div className="flex justify-between gap-6">
                        <span>Effort</span>
                        <span className="text-foreground">{p.effort}/100</span>
                      </div>
                      <div className="flex justify-between gap-6">
                        <span>Confidence</span>
                        <span className="text-foreground">{p.confidence}%</span>
                      </div>
                    </div>
                  </div>
                );
              }}
            />
            <Scatter data={POINTS} fill="var(--primary)" fillOpacity={0.7} stroke="var(--primary)" />
          </ScatterChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
