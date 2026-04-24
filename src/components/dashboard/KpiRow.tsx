import { ArrowDownRight, ArrowUpRight } from "lucide-react";

type RiskTone = "low" | "medium" | "high";

type Kpi = {
  label: string;
  value: string;
  change: number;
  context: string;
  highlight?: boolean;
  risk?: {
    tone: RiskTone;
    pctOfRevenue: number; // share of organic revenue at risk
  };
};

// Organic Revenue baseline used to compute Risk %
// (kept inline to mirror the static demo values)
const ORGANIC_REVENUE = 1_840_000;
const REVENUE_AT_RISK = 612_000; // ~33% → orange band
const RISK_PCT = REVENUE_AT_RISK / ORGANIC_REVENUE;

function riskTone(pct: number): RiskTone {
  if (pct >= 0.35) return "high";
  if (pct >= 0.25) return "medium";
  return "low";
}

const KPIS: Kpi[] = [
  { label: "Organic Revenue", value: "£1.84M", change: 12.4, context: "vs prev. 30 days" },
  { label: "Revenue Potential (ORP)", value: "£4.21M", change: 3.1, context: "modelled ceiling" },
  { label: "Revenue Gap", value: "£2.37M", change: -4.8, context: "missed opportunity", highlight: true },
  {
    label: "Revenue at Risk",
    value: "£612k",
    change: 8.2,
    context: `${Math.round(RISK_PCT * 100)}% of organic revenue`,
    risk: { tone: riskTone(RISK_PCT), pctOfRevenue: RISK_PCT },
  },
  { label: "Avg Conversion Rate", value: "2.84%", change: 0.6, context: "session → order" },
  { label: "Avg CTR", value: "4.12%", change: -1.2, context: "SERP click-through" },
];

export function KpiRow() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
      {KPIS.map((kpi) => (
        <KpiCard key={kpi.label} kpi={kpi} />
      ))}
    </div>
  );
}

function riskStyles(tone: RiskTone) {
  switch (tone) {
    case "high":
      return {
        border: "border-destructive/40",
        value: "text-destructive",
        glow: "bg-destructive/20",
        dot: "bg-destructive",
        chip: "text-destructive bg-destructive/10 border-destructive/20",
        label: "High risk",
      };
    case "medium":
      return {
        border: "border-chart-4/40",
        value: "text-chart-4",
        glow: "bg-chart-4/20",
        dot: "bg-chart-4",
        chip: "text-chart-4 bg-chart-4/10 border-chart-4/20",
        label: "Elevated risk",
      };
    default:
      return {
        border: "border-primary/30",
        value: "text-primary",
        glow: "bg-primary/15",
        dot: "bg-primary",
        chip: "text-primary bg-primary/10 border-primary/20",
        label: "Low risk",
      };
  }
}

function KpiCard({ kpi }: { kpi: Kpi }) {
  const positive = kpi.change >= 0;
  const risk = kpi.risk ? riskStyles(kpi.risk.tone) : null;

  // For "Revenue at Risk", an INCREASE is bad (red), a DECREASE is good (green).
  const changeIsGood = risk ? !positive : positive;

  return (
    <div
      className={`relative rounded-lg border bg-card p-4 transition-colors hover:border-primary/40 ${
        risk ? risk.border : kpi.highlight ? "border-primary/30" : "border-border"
      }`}
    >
      {(kpi.highlight || risk) && (
        <div
          className={`absolute inset-0 rounded-lg opacity-20 blur-2xl pointer-events-none ${
            risk ? risk.glow : "bg-glow"
          }`}
        />
      )}
      <div className="relative">
        <div className="flex items-center justify-between gap-2">
          <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
            {kpi.label}
          </p>
          {risk && (
            <span
              className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md border text-[9px] font-mono uppercase tracking-wider ${risk.chip}`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${risk.dot}`} />
              {risk.label}
            </span>
          )}
        </div>
        <p
          className={`mt-2 text-2xl font-bold font-mono ${
            risk ? risk.value : kpi.highlight ? "text-primary" : "text-foreground"
          }`}
        >
          {kpi.value}
        </p>
        <div className="mt-2 flex items-center justify-between">
          <span
            className={`inline-flex items-center gap-0.5 text-[11px] font-mono font-medium ${
              changeIsGood ? "text-primary" : "text-chart-5"
            }`}
          >
            {positive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
            {positive ? "+" : ""}
            {kpi.change}%
          </span>
          <span className="text-[10px] text-muted-foreground">{kpi.context}</span>
        </div>
      </div>
    </div>
  );
}
