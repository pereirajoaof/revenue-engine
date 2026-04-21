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

// Custom 3D-style bubble: drop shadow ellipse + radial gradient sphere + specular highlight
const Bubble3D = (props: {
  cx?: number;
  cy?: number;
  node?: { z?: number };
  payload?: Point;
}) => {
  const { cx = 0, cy = 0, node, payload } = props;
  const z = node?.z ?? 200;
  // recharts maps z into a size area; convert to a visual radius
  const r = Math.max(8, Math.sqrt(z / Math.PI));
  const id = `sphere-${payload?.name?.replace(/\W+/g, "")}`;

  return (
    <g style={{ pointerEvents: "all" }}>
      <defs>
        <radialGradient id={id} cx="35%" cy="30%" r="70%">
          <stop offset="0%" stopColor="oklch(0.95 0.05 160)" stopOpacity={0.95} />
          <stop offset="35%" stopColor="var(--primary)" stopOpacity={0.95} />
          <stop offset="100%" stopColor="oklch(0.35 0.12 160)" stopOpacity={1} />
        </radialGradient>
      </defs>
      {/* ground shadow */}
      <ellipse
        cx={cx}
        cy={cy + r * 0.85}
        rx={r * 0.95}
        ry={r * 0.22}
        fill="rgba(0,0,0,0.45)"
        style={{ filter: "blur(3px)" }}
      />
      {/* outer glow */}
      <circle cx={cx} cy={cy} r={r + 2} fill="var(--primary)" opacity={0.15} style={{ filter: "blur(6px)" }} />
      {/* sphere body */}
      <circle cx={cx} cy={cy} r={r} fill={`url(#${id})`} stroke="oklch(0.25 0.08 160)" strokeWidth={0.5} />
      {/* specular highlight */}
      <ellipse
        cx={cx - r * 0.3}
        cy={cy - r * 0.4}
        rx={r * 0.35}
        ry={r * 0.22}
        fill="white"
        opacity={0.55}
        style={{ filter: "blur(1px)" }}
      />
    </g>
  );
};

export function ImpactEffortMatrix() {
  return (
    <div className="relative rounded-lg border border-border bg-card p-5 overflow-hidden">
      {/* layered depth backdrop */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 75% 15%, color-mix(in oklab, var(--primary) 18%, transparent) 0%, transparent 55%), radial-gradient(ellipse at 15% 90%, color-mix(in oklab, var(--primary) 10%, transparent) 0%, transparent 50%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "linear-gradient(var(--foreground) 1px, transparent 1px), linear-gradient(90deg, var(--foreground) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
          maskImage: "linear-gradient(180deg, transparent 0%, black 30%, black 70%, transparent 100%)",
        }}
      />

      <div className="relative flex items-start justify-between">
        <div>
          <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Decision tool</p>
          <h2 className="text-base font-semibold mt-0.5">Impact vs Effort</h2>
        </div>
        <span className="text-[10px] font-mono text-muted-foreground">Bubble size = confidence</span>
      </div>

      {/* quadrant labels — outside the plot area */}
      <div className="relative mt-4">
        {/* top labels (above plot) */}
        <div className="flex justify-between text-[9px] font-mono uppercase tracking-wider text-muted-foreground/70 pl-14 pr-6 mb-1">
          <span>↖ Quick wins</span>
          <span>Big bets ↗</span>
        </div>

        <div className="relative h-[300px]">

        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 20, right: 20, bottom: 30, left: 10 }}>
            <defs>
              <linearGradient id="plotFloor" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.06} />
                <stop offset="100%" stopColor="var(--primary)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="var(--border)" strokeDasharray="2 4" strokeOpacity={0.5} />
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
            <ZAxis type="number" dataKey="confidence" range={[200, 1400]} />
            <Tooltip
              cursor={{ strokeDasharray: "3 3", stroke: "var(--border)" }}
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null;
                const p = payload[0].payload as Point;
                return (
                  <div className="rounded-md border border-border bg-popover p-3 shadow-xl">
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
            <Scatter data={POINTS} shape={<Bubble3D />} />
          </ScatterChart>
        </ResponsiveContainer>
        </div>

        {/* bottom labels (below plot, under x-axis) */}
        <div className="flex justify-between text-[9px] font-mono uppercase tracking-wider text-muted-foreground/70 pl-14 pr-6 mt-1">
          <span>↙ Fill-ins</span>
          <span>Money pits ↘</span>
        </div>
      </div>
    </div>
  );
}
