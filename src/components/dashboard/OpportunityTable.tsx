import { ArrowRight } from "lucide-react";

type Row = {
  pageType: string;
  current: string;
  potential: string;
  gap: string;
  priority: number;
  effort: "Low" | "Medium" | "High";
};

const ROWS: Row[] = [
  { pageType: "Routes", current: "£412k", potential: "£1.21M", gap: "£798k", priority: 94, effort: "Medium" },
  { pageType: "Cities", current: "£308k", potential: "£842k", gap: "£534k", priority: 88, effort: "Low" },
  { pageType: "Blog", current: "£186k", potential: "£412k", gap: "£226k", priority: 71, effort: "Low" },
  { pageType: "Category", current: "£524k", potential: "£790k", gap: "£266k", priority: 64, effort: "High" },
  { pageType: "Comparison", current: "£94k", potential: "£312k", gap: "£218k", priority: 58, effort: "Medium" },
  { pageType: "Glossary", current: "£42k", potential: "£128k", gap: "£86k", priority: 41, effort: "Low" },
];

export function OpportunityTable() {
  return (
    <div className="rounded-lg border border-border bg-card overflow-hidden">
      <div className="px-5 py-4 border-b border-border flex items-center justify-between">
        <div>
          <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Opportunity breakdown</p>
          <h2 className="text-base font-semibold mt-0.5">Where the revenue gap lives</h2>
        </div>
        <button className="text-xs font-mono text-muted-foreground hover:text-primary transition-colors">
          Export CSV
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground border-b border-border">
              <th className="text-left font-normal px-5 py-3">Page Type</th>
              <th className="text-right font-normal px-3 py-3">Current</th>
              <th className="text-right font-normal px-3 py-3">Potential</th>
              <th className="text-right font-normal px-3 py-3">Gap</th>
              <th className="text-left font-normal px-3 py-3">Priority</th>
              <th className="text-left font-normal px-3 py-3">Effort</th>
              <th className="text-right font-normal px-5 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {ROWS.map((row) => (
              <tr
                key={row.pageType}
                className="border-b border-border last:border-0 hover:bg-surface/60 transition-colors group cursor-pointer"
              >
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                    <span className="font-medium">/{row.pageType.toLowerCase()}/</span>
                  </div>
                </td>
                <td className="px-3 py-3.5 text-right font-mono text-muted-foreground">{row.current}</td>
                <td className="px-3 py-3.5 text-right font-mono text-foreground">{row.potential}</td>
                <td className="px-3 py-3.5 text-right font-mono font-semibold text-primary">{row.gap}</td>
                <td className="px-3 py-3.5">
                  <PriorityBar score={row.priority} />
                </td>
                <td className="px-3 py-3.5">
                  <EffortPill level={row.effort} />
                </td>
                <td className="px-5 py-3.5 text-right">
                  <button className="inline-flex items-center gap-1 text-xs font-mono text-muted-foreground group-hover:text-primary transition-colors">
                    Create Task
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function PriorityBar({ score }: { score: number }) {
  return (
    <div className="flex items-center gap-2 w-32">
      <div className="flex-1 h-1.5 rounded-full bg-surface overflow-hidden">
        <div
          className="h-full rounded-full bg-primary"
          style={{ width: `${score}%` }}
        />
      </div>
      <span className="text-xs font-mono text-muted-foreground w-7 text-right">{score}</span>
    </div>
  );
}

function EffortPill({ level }: { level: "Low" | "Medium" | "High" }) {
  const styles = {
    Low: "border-primary/30 text-primary bg-primary/10",
    Medium: "border-chart-4/30 text-chart-4 bg-chart-4/10",
    High: "border-chart-5/30 text-chart-5 bg-chart-5/10",
  }[level];
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-medium border ${styles}`}>
      {level}
    </span>
  );
}
