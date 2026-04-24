import { ArrowRight, Plus } from "lucide-react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, YAxis } from "recharts";

export type IssueStatus = "good" | "atRisk" | "critical";

export type IssueMetric = { label: string; value: string };

export type Issue = {
  key: string;
  name: string;
  icon: React.ReactNode;
  status: IssueStatus;
  score: number; // 0-100
  recoverable: string; // e.g. "£320k"
  atRisk: string; // e.g. "£480k"
  trend: { week: string; score: number }[];
  insight: string;
  metrics: IssueMetric[];
  action: { label: string; uplift: string };
};

const STATUS: Record<
  IssueStatus,
  { label: string; chip: string; ring: string; trend: string }
> = {
  good: {
    label: "Good",
    chip: "text-primary bg-primary/10 border-primary/20",
    ring: "ring-primary/30",
    trend: "var(--primary)",
  },
  atRisk: {
    label: "At Risk",
    chip: "text-foreground bg-surface border-border",
    ring: "ring-border",
    trend: "var(--chart-4)",
  },
  critical: {
    label: "Critical",
    chip: "text-destructive bg-destructive/10 border-destructive/20",
    ring: "ring-destructive/30",
    trend: "var(--destructive)",
  },
};

export function IssueCard({ issue }: { issue: Issue }) {
  const s = STATUS[issue.status];
  const gradId = `grad-${issue.key}`;

  return (
    <div className="group relative rounded-xl border border-border bg-card p-5 shadow-sm transition-all hover:shadow-md hover:border-foreground/20 flex flex-col gap-4">
      {/* A. Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-md bg-surface border border-border flex items-center justify-center text-foreground">
            {issue.icon}
          </div>
          <div>
            <h3 className="text-sm font-semibold leading-tight">{issue.name}</h3>
            <p className="text-[11px] font-mono text-muted-foreground mt-0.5">
              <span className="tabular-nums text-foreground">{issue.score}</span>
              <span className="text-muted-foreground"> / 100</span>
            </p>
          </div>
        </div>
        <span className={`text-[10px] font-mono uppercase tracking-wider px-2 py-1 rounded border ${s.chip}`}>
          {s.label}
        </span>
      </div>

      {/* B. Revenue impact */}
      <div>
        <p className="text-2xl font-mono font-semibold tabular-nums text-primary">
          {issue.recoverable} <span className="text-xs text-muted-foreground font-normal">recoverable</span>
        </p>
        <p className="text-[11px] font-mono text-destructive/80 mt-0.5">
          {issue.atRisk} at risk
        </p>
      </div>

      {/* C. Trend */}
      <div className="h-14 -mx-1">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={issue.trend} margin={{ top: 4, right: 4, bottom: 0, left: 4 }}>
            <defs>
              <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={s.trend} stopOpacity={0.4} />
                <stop offset="100%" stopColor={s.trend} stopOpacity={0} />
              </linearGradient>
            </defs>
            <YAxis hide domain={["dataMin - 5", "dataMax + 5"]} />
            <Tooltip
              cursor={{ stroke: "var(--border)" }}
              contentStyle={{
                background: "var(--popover)",
                border: "1px solid var(--border)",
                borderRadius: 6,
                fontSize: 11,
                fontFamily: "var(--font-mono)",
              }}
              labelStyle={{ color: "var(--muted-foreground)" }}
              formatter={(v: number) => [`${v}`, "Score"]}
            />
            <Area
              type="monotone"
              dataKey="score"
              stroke={s.trend}
              strokeWidth={1.5}
              fill={`url(#${gradId})`}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* D. Insight */}
      <p className="text-xs leading-relaxed text-muted-foreground">{issue.insight}</p>

      {/* E. Metric grid */}
      <div className="grid grid-cols-2 gap-2">
        {issue.metrics.map((m) => (
          <div key={m.label} className="rounded-md bg-surface border border-border px-2.5 py-2">
            <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground truncate">
              {m.label}
            </p>
            <p className="text-sm font-mono tabular-nums text-foreground mt-0.5">{m.value}</p>
          </div>
        ))}
      </div>

      {/* F. Action */}
      <div className="mt-auto pt-3 border-t border-border space-y-2">
        <p className="text-[12px] leading-snug text-foreground">
          <span className="text-muted-foreground">→ </span>
          {issue.action.label}{" "}
          <span className="font-mono text-primary">{issue.action.uplift}</span>
        </p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md bg-foreground text-background hover:opacity-90 transition-opacity"
          >
            View actions
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md border border-border bg-surface hover:bg-surface/70 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            Create task
          </button>
        </div>
      </div>
    </div>
  );
}
