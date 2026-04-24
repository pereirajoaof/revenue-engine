import { createFileRoute } from "@tanstack/react-router";
import { DashboardNav } from "@/components/dashboard/DashboardNav";
import { TechHeader } from "@/components/technical/TechHeader";
import { TechKpiStrip } from "@/components/technical/TechKpiStrip";
import { TechImpactEffort } from "@/components/technical/TechImpactEffort";
import { IssueCard } from "@/components/technical/IssueCard";
import { ISSUES } from "@/components/technical/issuesData";
import { AlertTriangle, Sparkles } from "lucide-react";

export const Route = createFileRoute("/technical-health")({
  component: TechnicalHealthPage,
  head: () => ({
    meta: [
      { title: "Technical Health — OrganicOS" },
      {
        name: "description",
        content:
          "Revenue impact of crawlability, indexation, and performance. Prioritise engineering fixes by recoverable revenue.",
      },
      { property: "og:title", content: "Technical Health — OrganicOS" },
      {
        property: "og:description",
        content:
          "A portfolio of revenue leaks for technical SEO: at-risk revenue, recoverable revenue, and prioritised actions.",
      },
    ],
  }),
});

function TechnicalHealthPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <DashboardNav />

      <div className="lg:pl-56">
        <TechHeader />

        <main className="px-6 lg:px-8 py-6 space-y-6">
          {/* Cost-of-inaction strip */}
          <div className="rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-2.5 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <AlertTriangle className="w-4 h-4 text-destructive shrink-0" />
              <p className="text-xs">
                <span className="font-mono text-destructive">£23.8k</span>{" "}
                <span className="text-muted-foreground">lost per week if technical issues remain unresolved</span>
              </p>
            </div>
            <button className="text-[11px] font-mono uppercase tracking-wider text-destructive hover:underline">
              Simulate fix →
            </button>
          </div>

          <TechKpiStrip />

          <TechImpactEffort />

          {/* Issue grid */}
          <div className="space-y-3">
            <div className="flex items-end justify-between">
              <div>
                <h2 className="text-lg font-semibold">Issue breakdown</h2>
                <p className="text-xs text-muted-foreground">
                  Each issue is a revenue lever. Sorted by recoverable impact.
                </p>
              </div>
              <button className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1.5 text-[11px] font-mono uppercase tracking-wider rounded-md border border-border bg-surface hover:bg-surface/70 transition-colors">
                <Sparkles className="w-3 h-3" />
                What if we fix all?
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {ISSUES.map((issue) => (
                <IssueCard key={issue.key} issue={issue} />
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
