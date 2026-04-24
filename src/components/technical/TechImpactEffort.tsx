import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

type Point = {
  name: string;
  effort: number; // 0-100
  impact: number; // £k
  urls: number;
  severity: "critical" | "moderate" | "healthy";
};

const POINTS: Point[] = [
  { name: "Crawl prioritisation /routes/", effort: 28, impact: 320, urls: 1240, severity: "critical" },
  { name: "Redirect chains top 500", effort: 18, impact: 180, urls: 510, severity: "critical" },
  { name: "Canonical conflicts (city pages)", effort: 42, impact: 145, urls: 860, severity: "moderate" },
  { name: "LCP on /stops/ templates", effort: 65, impact: 210, urls: 3100, severity: "moderate" },
  { name: "robots.txt overblock /search", effort: 8, impact: 95, urls: 220, severity: "critical" },
  { name: "5xx on operator detail", effort: 35, impact: 60, urls: 95, severity: "moderate" },
  { name: "INP on home", effort: 78, impact: 40, urls: 1, severity: "healthy" },
  { name: "Discovered not indexed", effort: 55, impact: 115, urls: 1820, severity: "moderate" },
];

const COLORS: Record<Point["severity"], string> = {
  critical: "var(--destructive)",
  moderate: "var(--chart-4)",
  healthy: "var(--primary)",
};

export function TechImpactEffort() {
  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <div className="flex items-start justify-between mb-1">
        <div>
          <h3 className="text-sm font-semibold">Impact vs Effort</h3>
          <p className="text-xs text-muted-foreground">Where engineering time unlocks the most revenue.</p>
        </div>
        <div className="flex items-center gap-3 text-[10px] font-mono uppercase tracking-wider">
          <LegendDot color="var(--destructive)" label="Critical" />
          <LegendDot color="var(--chart-4)" label="Moderate" />
          <LegendDot color="var(--primary)" label="Healthy" />
        </div>
      </div>

      <div className="h-[320px] mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 10, right: 20, bottom: 30, left: 10 }}>
            <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" />
            <XAxis
              type="number"
              dataKey="effort"
              name="Effort"
              domain={[0, 100]}
              tick={{ fill: "var(--muted-foreground)", fontSize: 11, fontFamily: "var(--font-mono)" }}
              label={{
                value: "Engineering effort →",
                position: "insideBottom",
                offset: -15,
                style: { fill: "var(--muted-foreground)", fontSize: 11 },
              }}
            />
            <YAxis
              type="number"
              dataKey="impact"
              name="Revenue impact"
              tick={{ fill: "var(--muted-foreground)", fontSize: 11, fontFamily: "var(--font-mono)" }}
              tickFormatter={(v) => `£${v}k`}
              label={{
                value: "Revenue impact",
                angle: -90,
                position: "insideLeft",
                style: { fill: "var(--muted-foreground)", fontSize: 11 },
              }}
            />
            <ZAxis type="number" dataKey="urls" range={[80, 600]} name="URLs affected" />
            <Tooltip cursor={{ strokeDasharray: "3 3" }} content={<CustomTooltip />} />
            <Scatter data={POINTS}>
              {POINTS.map((p, i) => (
                <Cell key={i} fill={COLORS[p.severity]} fillOpacity={0.75} stroke={COLORS[p.severity]} />
              ))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <span className="flex items-center gap-1.5 text-muted-foreground">
      <span className="w-2 h-2 rounded-full" style={{ background: color }} />
      {label}
    </span>
  );
}

function CustomTooltip({ active, payload }: { active?: boolean; payload?: Array<{ payload: Point }> }) {
  if (!active || !payload?.length) return null;
  const p = payload[0].payload;
  return (
    <div className="rounded-md border border-border bg-popover px-3 py-2 shadow-lg text-xs">
      <p className="font-medium mb-1.5">{p.name}</p>
      <div className="space-y-0.5 font-mono text-[11px]">
        <Row k="Impact" v={`£${p.impact}k / yr`} />
        <Row k="Effort" v={`${p.effort}/100`} />
        <Row k="URLs" v={p.urls.toLocaleString()} />
      </div>
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-muted-foreground">{k}</span>
      <span className="text-foreground">{v}</span>
    </div>
  );
}
