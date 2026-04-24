import { TrendingDown, TrendingUp, Gauge, Zap } from "lucide-react";

type Kpi = {
  label: string;
  sublabel: string;
  value: string;
  delta?: string;
  tone: "risk" | "opportunity" | "neutral" | "accent";
  icon: React.ReactNode;
  highlight?: boolean;
};

const KPIS: Kpi[] = [
  {
    label: "Revenue at Risk",
    sublabel: "Estimated yearly loss if unresolved",
    value: "£1.24M",
    delta: "+8.2% vs prev. 30d",
    tone: "risk",
    icon: <TrendingDown className="w-4 h-4" />,
  },
  {
    label: "Recoverable Revenue",
    sublabel: "If top 6 issues are fixed",
    value: "£852k",
    delta: "68% of risk",
    tone: "opportunity",
    icon: <TrendingUp className="w-4 h-4" />,
    highlight: true,
  },
  {
    label: "Technical Health Score",
    sublabel: "Composite of crawl, index, perf, status",
    value: "72",
    delta: "/ 100 · -3 vs prev.",
    tone: "neutral",
    icon: <Gauge className="w-4 h-4" />,
  },
  {
    label: "Opportunity Efficiency",
    sublabel: "Revenue per engineering sprint",
    value: "£142k",
    delta: "per 2-week sprint",
    tone: "accent",
    icon: <Zap className="w-4 h-4" />,
  },
];

export function TechKpiStrip() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {KPIS.map((k) => (
        <KpiCard key={k.label} kpi={k} />
      ))}
    </div>
  );
}

function toneClasses(tone: Kpi["tone"]) {
  switch (tone) {
    case "risk":
      return { value: "text-destructive", chip: "text-destructive bg-destructive/10 border-destructive/20" };
    case "opportunity":
      return { value: "text-primary", chip: "text-primary bg-primary/10 border-primary/20" };
    case "accent":
      return { value: "text-foreground", chip: "text-foreground bg-surface border-border" };
    default:
      return { value: "text-foreground", chip: "text-muted-foreground bg-surface border-border" };
  }
}

function KpiCard({ kpi }: { kpi: Kpi }) {
  const t = toneClasses(kpi.tone);
  return (
    <div
      className={`relative rounded-xl border bg-card p-5 shadow-sm overflow-hidden ${
        kpi.highlight ? "border-primary/40" : "border-border"
      }`}
    >
      {kpi.highlight && (
        <div
          aria-hidden
          className="absolute -top-16 -right-16 w-40 h-40 rounded-full opacity-30 pointer-events-none"
          style={{ background: "var(--glow)", filter: "blur(40px)" }}
        />
      )}
      <div className="relative flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
            {kpi.label}
          </p>
          <p className="text-[11px] text-muted-foreground/80 max-w-[200px]">{kpi.sublabel}</p>
        </div>
        <div className={`p-1.5 rounded-md border ${t.chip}`}>{kpi.icon}</div>
      </div>
      <div className="relative mt-4 flex items-baseline gap-2">
        <span className={`text-3xl font-mono font-semibold tabular-nums ${t.value}`}>{kpi.value}</span>
      </div>
      {kpi.delta && (
        <p className="relative mt-1.5 text-[11px] font-mono text-muted-foreground">{kpi.delta}</p>
      )}
    </div>
  );
}
