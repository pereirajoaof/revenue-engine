import { ArrowRight } from "lucide-react";
import { AppLink as Link } from "@/lib/app-link";
import { OPPORTUNITIES, gapOf, money, type Effort } from "@/lib/opportunity-data";

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
            {OPPORTUNITIES.map((row) => {
              const gap = gapOf(row);
              return (
                <tr
                  key={row.slug}
                  className="border-b border-border last:border-0 hover:bg-surface/60 transition-colors group"
                >
                  <td className="px-5 py-3.5">
                    <Link
                      to="/dashboard/opportunity/$pageType"
                      params={{ pageType: row.slug }}
                      className="flex items-center gap-2 hover:text-primary transition-colors"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                      <span className="font-medium">{row.path}</span>
                    </Link>
                  </td>
                  <td className="px-3 py-3.5 text-right font-mono text-muted-foreground">{money(row.current)}</td>
                  <td className="px-3 py-3.5 text-right font-mono text-foreground">{money(row.potential)}</td>
                  <td className="px-3 py-3.5 text-right font-mono font-semibold text-primary">
                    {gap > 0 ? money(gap) : "—"}
                  </td>
                  <td className="px-3 py-3.5">
                    <PriorityBar score={row.priority} />
                  </td>
                  <td className="px-3 py-3.5">
                    <EffortPill level={row.effort} />
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <Link
                      to="/dashboard/opportunity/$pageType"
                      params={{ pageType: row.slug }}
                      className="inline-flex items-center gap-1 text-xs font-mono text-muted-foreground group-hover:text-primary transition-colors"
                    >
                      View breakdown
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </td>
                </tr>
              );
            })}
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
        <div className="h-full rounded-full bg-primary" style={{ width: `${score}%` }} />
      </div>
      <span className="text-xs font-mono text-muted-foreground w-7 text-right">{score}</span>
    </div>
  );
}

function EffortPill({ level }: { level: Effort }) {
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
