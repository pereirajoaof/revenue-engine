import { createFileRoute } from "@tanstack/react-router";
import { Footer } from "@/components/Footer";
import { HelpHeader } from "@/components/help/HelpHeader";
import { HelpSearch } from "@/components/help/HelpSearch";
import {
  CategoryCard,
  SupportCards,
  ArticleListItem,
} from "@/components/help/HelpPieces";
import { HELP_CATEGORIES, POPULAR_ARTICLES, RECENT_ACTIVITY } from "@/components/help/HelpData";

export const Route = createFileRoute("/help/")({
  component: HelpHome,
  head: () => ({
    meta: [
      { title: "OrganicOS Knowledge Center" },
      {
        name: "description",
        content:
          "Find answers about OrganicOS, crawler behaviour, data sources, scoring methodology, integrations, and troubleshooting.",
      },
      { property: "og:title", content: "OrganicOS Knowledge Center" },
      {
        property: "og:description",
        content:
          "Public documentation for customers, developers, IT, and security teams.",
      },
    ],
  }),
});

function HelpHome() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <HelpHeader />

      {/* Hero */}
      <section className="border-b border-border bg-gradient-to-b from-surface/40 to-background">
        <div className="mx-auto max-w-4xl px-6 py-20 text-center sm:py-28">
          <p className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
            Knowledge Center
          </p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
            OrganicOS Knowledge Center
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base text-muted-foreground sm:text-lg">
            Find answers about OrganicOS, crawler behaviour, data sources, scoring
            methodology, integrations, and troubleshooting.
          </p>
          <div className="mx-auto mt-8 max-w-2xl">
            <HelpSearch />
          </div>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2 font-mono text-[11px] text-muted-foreground">
            <span className="uppercase tracking-wider">Popular:</span>
            {["OrganicOS Crawler", "Allowlist crawler", "Revenue Gap", "Connect GSC"].map(
              (t) => (
                <button
                  key={t}
                  className="rounded-md border border-border bg-card px-2 py-1 hover:border-primary/40 hover:text-foreground"
                >
                  {t}
                </button>
              ),
            )}
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-6xl space-y-20 px-6 py-16">
        {/* Categories */}
        <section>
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                Browse by category
              </p>
              <h2 className="mt-1 text-2xl font-bold tracking-tight">
                Categories
              </h2>
            </div>
            <span className="font-mono text-[11px] text-muted-foreground">
              {HELP_CATEGORIES.length} categories
            </span>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {HELP_CATEGORIES.map((c) => (
              <CategoryCard key={c.slug} category={c} />
            ))}
          </div>
        </section>

        {/* Popular + Recent */}
        <section className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold tracking-tight">Popular articles</h2>
              <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                Most read
              </span>
            </div>
            <div className="divide-y divide-border/70">
              {POPULAR_ARTICLES.map((a) => (
                <ArticleListItem key={a.title} title={a.title} meta={a.category} />
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold tracking-tight">Recent activity</h2>
              <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                Last 7 days
              </span>
            </div>
            <ul className="space-y-3">
              {RECENT_ACTIVITY.map((r) => (
                <li
                  key={r.title}
                  className="flex items-start justify-between gap-4 border-b border-border/70 pb-3 last:border-b-0 last:pb-0"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-foreground">
                      {r.title}
                    </p>
                    <p className="mt-0.5 font-mono text-[11px] text-muted-foreground">
                      {r.action} · {r.when}
                    </p>
                  </div>
                  <span className="mt-1 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                </li>
              ))}
            </ul>
          </div>
        </section>

        <SupportCards />
      </main>

      <Footer />
    </div>
  );
}
