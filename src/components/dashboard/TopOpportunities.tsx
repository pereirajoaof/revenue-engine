import { ArrowRight, Target } from "lucide-react";

type Action = {
  title: string;
  category: string;
  impact: string;
  effort: "Low" | "Medium" | "High";
  confidence: number;
};

const ACTIONS: Action[] = [
  {
    title: "Improve internal linking on /routes/ pages",
    category: "Authority",
    impact: "+£120K/yr",
    effort: "Medium",
    confidence: 86,
  },
  {
    title: "Add structured data to /cities/ templates",
    category: "Technical",
    impact: "+£92K/yr",
    effort: "Low",
    confidence: 79,
  },
  {
    title: "Rewrite titles for top 50 underperforming pages",
    category: "Content",
    impact: "+£64K/yr",
    effort: "Low",
    confidence: 91,
  },
  {
    title: "Build comparison page templates for /vs/",
    category: "Content",
    impact: "+£145K/yr",
    effort: "High",
    confidence: 65,
  },
];

export function TopOpportunities() {
  return (
    <div className="rounded-lg border border-border bg-card p-5 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Top actions</p>
          <h2 className="text-base font-semibold mt-0.5">Recommended next moves</h2>
        </div>
        <Target className="w-4 h-4 text-primary" />
      </div>

      <div className="space-y-2.5 flex-1 overflow-y-auto pr-1 min-h-0">
        {ACTIONS.map((action) => (
          <div
            key={action.title}
            className="group rounded-md border border-border bg-surface/40 p-3.5 hover:border-primary/40 hover:bg-surface transition-all"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">{action.category}</p>
                <p className="text-sm font-medium mt-1 leading-snug">{action.title}</p>
              </div>
              <span className="text-sm font-mono font-bold text-primary whitespace-nowrap">{action.impact}</span>
            </div>

            <div className="mt-3 flex items-center justify-between">
              <div className="flex items-center gap-3 text-[11px] font-mono text-muted-foreground">
                <span>
                  Effort: <span className="text-foreground">{action.effort}</span>
                </span>
                <span className="w-px h-3 bg-border" />
                <span>
                  Confidence: <span className="text-foreground">{action.confidence}%</span>
                </span>
              </div>
              <button className="inline-flex items-center gap-1 text-[11px] font-mono text-muted-foreground group-hover:text-primary transition-colors">
                Create Task
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
