import { ArrowDownRight, ArrowUpRight } from "lucide-react";

type Kpi = {
  label: string;
  value: string;
  change: number;
  context: string;
  highlight?: boolean;
};

const KPIS: Kpi[] = [
  { label: "Organic Revenue", value: "£1.84M", change: 12.4, context: "vs prev. 30 days" },
  { label: "Revenue Potential (ORP)", value: "£4.21M", change: 3.1, context: "modelled ceiling" },
  { label: "Revenue Gap", value: "£2.37M", change: -4.8, context: "missed opportunity", highlight: true },
  { label: "Avg Conversion Rate", value: "2.84%", change: 0.6, context: "session → order" },
  { label: "Avg CTR", value: "4.12%", change: -1.2, context: "SERP click-through" },
];

export function KpiRow() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3">
      {KPIS.map((kpi) => (
        <KpiCard key={kpi.label} kpi={kpi} />
      ))}
    </div>
  );
}

function KpiCard({ kpi }: { kpi: Kpi }) {
  const positive = kpi.change >= 0;
  return (
    <div
      className={`relative rounded-lg border bg-card p-4 transition-colors hover:border-primary/40 ${
        kpi.highlight ? "border-primary/30" : "border-border"
      }`}
    >
      {kpi.highlight && (
        <div className="absolute inset-0 rounded-lg bg-glow opacity-20 blur-2xl pointer-events-none" />
      )}
      <div className="relative">
        <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">{kpi.label}</p>
        <p className={`mt-2 text-2xl font-bold font-mono ${kpi.highlight ? "text-primary" : "text-foreground"}`}>
          {kpi.value}
        </p>
        <div className="mt-2 flex items-center justify-between">
          <span
            className={`inline-flex items-center gap-0.5 text-[11px] font-mono font-medium ${
              positive ? "text-primary" : "text-chart-5"
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
