import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Link2 } from "lucide-react";

export const Route = createFileRoute("/website-authority/")({
  component: WebsiteAuthorityPage,
  head: () => ({
    meta: [
      { title: "Website Authority — OrganicOS" },
      { name: "description", content: "Page-level structural authority metrics and internal equity opportunities." },
    ],
  }),
});

function WebsiteAuthorityPage() {
  return (
    <main className="space-y-6 px-6 py-6 lg:px-8">
      <section className="rounded-xl border border-border bg-card p-6 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Issue</p>
            <h2 className="mt-1 text-xl font-semibold">Internal Equity</h2>
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground">Find pages that are over- or under-supported by internal link equity relative to CTR and topical relevance.</p>
          </div>
          <Link2 className="h-5 w-5 text-primary" />
        </div>
        <Link to="/website-authority/internal-equity" className="mt-6 inline-flex items-center gap-2 rounded-md border border-border bg-surface px-3 py-2 text-sm font-medium transition-colors hover:bg-card">
          Open dashboard <ArrowRight className="h-4 w-4" />
        </Link>
      </section>
    </main>
  );
}