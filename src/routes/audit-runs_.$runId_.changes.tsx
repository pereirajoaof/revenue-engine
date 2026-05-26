import { useMemo } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { fallback, zodValidator } from "@tanstack/zod-adapter";
import { z } from "zod";
import { ArrowLeft, ArrowRight, ExternalLink, GitCompare } from "lucide-react";
import { DashboardNav } from "@/components/dashboard/DashboardNav";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Bucket = "all" | "new" | "resolved" | "persisting";

const searchSchema = z.object({
  bucket: fallback(z.enum(["all", "new", "resolved", "persisting"]), "all").default("all"),
  issue_type: fallback(z.string(), "all").default("all"),
});

export const Route = createFileRoute("/audit-runs_/$runId_/changes")({
  validateSearch: zodValidator(searchSchema),
  component: ChangesRoute,
  head: () => ({
    meta: [
      { title: "Crawl-over-crawl changes — OrganicOS" },
      {
        name: "description",
        content:
          "What changed since the previous crawl: new, resolved, and persisting issue-URLs across this audit run.",
      },
      { property: "og:title", content: "Crawl-over-crawl changes — OrganicOS" },
      {
        property: "og:description",
        content:
          "New, resolved, and persisting issue-URLs for this OrganicOS audit run, filterable by bucket and issue type.",
      },
    ],
  }),
});

type IssueChange = {
  id: string;
  name: string;
  severity: "error" | "warning" | "notice";
  prev: number;
  now: number;
  urls: Array<{ url: string; bucket: Exclude<Bucket, "all">; firstSeen?: string }>;
};

const RUNS: Record<string, { name: string; currentCrawl: string; previousCrawl: string }> = {
  "core-commerce": { name: "Core Revenue Pages", currentCrawl: "Today · 08:42", previousCrawl: "Apr 25 · 07:30" },
  international: { name: "International Expansion", currentCrawl: "Running now", previousCrawl: "Apr 24 · 14:10" },
  "content-hubs": { name: "Editorial Hubs", currentCrawl: "Yesterday · 21:16", previousCrawl: "Apr 22 · 19:02" },
  templates: { name: "Template QA Sweep", currentCrawl: "Apr 24 · 04:12", previousCrawl: "Apr 17 · 04:05" },
  migration: { name: "Post-Migration Guardrail", currentCrawl: "Apr 23 · 01:04", previousCrawl: "Apr 22 · 02:30" },
  marketplace: { name: "Marketplace Supply Pages", currentCrawl: "Apr 22 · 13:30", previousCrawl: "Apr 15 · 13:01" },
  brand: { name: "Brand & Support Surface", currentCrawl: "Apr 18 · 10:00", previousCrawl: "Apr 11 · 10:14" },
};

const ISSUE_CHANGES: IssueChange[] = [
  {
    id: "broken-4xx",
    name: "Broken pages (4xx)",
    severity: "error",
    prev: 42,
    now: 31,
    urls: [
      { url: "https://www.busbud.com/en/about/careers", bucket: "new", firstSeen: "Latest crawl" },
      { url: "https://www.busbud.com/en/about/refund-policy", bucket: "new", firstSeen: "Latest crawl" },
      { url: "https://www.busbud.com/en/routes/london-paris", bucket: "new", firstSeen: "Latest crawl" },
      { url: "https://www.busbud.com/en/legal/terms-fr", bucket: "resolved" },
      { url: "https://www.busbud.com/en/operator/contact", bucket: "resolved" },
      { url: "https://www.busbud.com/en/bus-tickets/montreal-quebec", bucket: "persisting" },
      { url: "https://www.busbud.com/en/bus-tickets/toronto-ottawa", bucket: "persisting" },
    ],
  },
  {
    id: "canonical-conflict",
    name: "Canonical conflicts",
    severity: "error",
    prev: 23,
    now: 11,
    urls: [
      { url: "https://www.busbud.com/en/bus-routes/madrid-barcelona", bucket: "resolved" },
      { url: "https://www.busbud.com/en/bus-routes/madrid-valencia", bucket: "resolved" },
      { url: "https://www.busbud.com/en/city/rome", bucket: "resolved" },
      { url: "https://www.busbud.com/en/city/milan", bucket: "persisting" },
      { url: "https://www.busbud.com/en/city/naples?ref=footer", bucket: "new", firstSeen: "Latest crawl" },
    ],
  },
  {
    id: "redirect-chain",
    name: "Redirect chains (>2 hops)",
    severity: "warning",
    prev: 18,
    now: 6,
    urls: [
      { url: "https://www.busbud.com/en/operator/flixbus", bucket: "resolved" },
      { url: "https://www.busbud.com/en/operator/megabus", bucket: "resolved" },
      { url: "https://www.busbud.com/en/operator/national-express", bucket: "resolved" },
      { url: "https://www.busbud.com/en/stops/victoria-coach-station", bucket: "new", firstSeen: "Latest crawl" },
      { url: "https://www.busbud.com/en/stops/gare-routiere-bercy", bucket: "persisting" },
    ],
  },
  {
    id: "noindex-money",
    name: "Noindex on money pages",
    severity: "error",
    prev: 15,
    now: 7,
    urls: [
      { url: "https://www.busbud.com/en/bus-tickets/new-york-boston", bucket: "new", firstSeen: "Latest crawl" },
      { url: "https://www.busbud.com/en/train/london-manchester", bucket: "new", firstSeen: "Latest crawl" },
      { url: "https://www.busbud.com/en/bus-tickets/paris-amsterdam", bucket: "resolved" },
      { url: "https://www.busbud.com/en/bus-tickets/paris-brussels", bucket: "resolved" },
      { url: "https://www.busbud.com/en/bus-tickets/lyon-marseille", bucket: "persisting" },
    ],
  },
  {
    id: "duplicate-titles",
    name: "Duplicate titles",
    severity: "warning",
    prev: 87,
    now: 64,
    urls: [
      { url: "https://www.busbud.com/en/category/weekend-getaways", bucket: "resolved" },
      { url: "https://www.busbud.com/en/category/student-deals", bucket: "resolved" },
      { url: "https://www.busbud.com/en/blog/cheap-bus-routes-2026", bucket: "persisting" },
      { url: "https://www.busbud.com/en/blog/eurolines-vs-flixbus", bucket: "persisting" },
      { url: "https://www.busbud.com/en/help/refund-window", bucket: "new", firstSeen: "Latest crawl" },
    ],
  },
  {
    id: "missing-structured-data",
    name: "Missing structured data",
    severity: "notice",
    prev: 61,
    now: 24,
    urls: [
      { url: "https://www.busbud.com/en/bus-company/alsa", bucket: "resolved" },
      { url: "https://www.busbud.com/en/bus-company/ouibus", bucket: "resolved" },
      { url: "https://www.busbud.com/en/blog/best-bus-routes-europe", bucket: "persisting" },
    ],
  },
];

function ChangesRoute() {
  const { runId } = Route.useParams();
  const { bucket, issue_type } = Route.useSearch();
  const navigate = useNavigate({ from: "/audit-runs/$runId/changes" });

  const run = RUNS[runId] ?? { name: runId, currentCrawl: "Latest crawl", previousCrawl: "Previous crawl" };

  const totals = useMemo(() => {
    let newC = 0;
    let resolvedC = 0;
    let persistingC = 0;
    for (const issue of ISSUE_CHANGES) {
      for (const u of issue.urls) {
        if (u.bucket === "new") newC++;
        else if (u.bucket === "resolved") resolvedC++;
        else persistingC++;
      }
    }
    return { new: newC, resolved: resolvedC, persisting: persistingC, all: newC + resolvedC + persistingC };
  }, []);

  const filteredIssues = useMemo(() => {
    return ISSUE_CHANGES
      .filter((i) => (issue_type === "all" ? true : i.id === issue_type))
      .map((issue) => ({
        ...issue,
        filteredUrls: bucket === "all" ? issue.urls : issue.urls.filter((u) => u.bucket === bucket),
      }))
      .filter((i) => i.filteredUrls.length > 0);
  }, [bucket, issue_type]);

  const setBucket = (b: Bucket) =>
    navigate({ search: (prev: z.infer<typeof searchSchema>) => ({ ...prev, bucket: b }), replace: true });
  const setIssueType = (id: string) =>
    navigate({ search: (prev: z.infer<typeof searchSchema>) => ({ ...prev, issue_type: id }), replace: true });

  return (
    <div className="min-h-screen bg-background text-foreground">
      <DashboardNav />
      <div className="lg:pl-56">
        <header className="sticky top-0 z-30 border-b border-border bg-background/85 backdrop-blur">
          <div className="space-y-5 px-6 py-5 lg:px-8">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
              <div className="flex items-start gap-3">
                <Button variant="ghost" size="icon" asChild aria-label="Back to run detail">
                  <Link to="/audit-runs/$runId" params={{ runId }}>
                    <ArrowLeft className="h-4 w-4" />
                  </Link>
                </Button>
                <div>
                  <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                    Audit run / What changed
                  </p>
                  <h1 className="mt-1 flex items-center gap-2 text-2xl font-bold tracking-tight">
                    <GitCompare className="h-5 w-5 text-muted-foreground" />
                    {run.name}
                  </h1>
                  <p className="mt-1 font-mono text-xs text-muted-foreground">
                    {run.previousCrawl} <ArrowRight className="inline h-3 w-3 align-text-bottom" /> {run.currentCrawl}
                  </p>
                </div>
              </div>
              <div className="flex items-end gap-2">
                <ThemeToggle />
              </div>
            </div>

            {/* Bucket tiles */}
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <BucketTile
                label="New"
                count={totals.new}
                tone="danger"
                active={bucket === "new"}
                onClick={() => setBucket("new")}
                description="Affected this crawl, not last"
              />
              <BucketTile
                label="Resolved"
                count={totals.resolved}
                tone="success"
                active={bucket === "resolved"}
                onClick={() => setBucket("resolved")}
                description="Affected last crawl, not this"
              />
              <BucketTile
                label="Persisting"
                count={totals.persisting}
                tone="neutral"
                active={bucket === "persisting"}
                onClick={() => setBucket("persisting")}
                description="Affected in both crawls"
              />
              <BucketTile
                label="All changes"
                count={totals.all}
                tone="muted"
                active={bucket === "all"}
                onClick={() => setBucket("all")}
                description="No bucket filter applied"
              />
            </div>

            {/* Issue-type chips */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                Issue type
              </span>
              <FilterChip active={issue_type === "all"} onClick={() => setIssueType("all")}>
                All
              </FilterChip>
              {ISSUE_CHANGES.map((i) => (
                <FilterChip
                  key={i.id}
                  active={issue_type === i.id}
                  onClick={() => setIssueType(i.id)}
                  severity={i.severity}
                >
                  {i.name}
                </FilterChip>
              ))}
            </div>
          </div>
        </header>

        <main className="space-y-4 px-6 py-6 lg:px-8">
          {filteredIssues.length === 0 ? (
            <EmptyState bucket={bucket} issueType={issue_type} />
          ) : (
            filteredIssues.map((issue) => (
              <IssueSection key={issue.id} issue={issue} runId={runId} bucketFilter={bucket} />
            ))
          )}

          <p className="pt-2 text-center font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
            Diff is always this crawl vs the one immediately before it · {run.previousCrawl} →{" "}
            {run.currentCrawl}
          </p>
        </main>
      </div>
    </div>
  );
}

function BucketTile({
  label,
  count,
  tone,
  active,
  onClick,
  description,
}: {
  label: string;
  count: number;
  tone: "danger" | "success" | "neutral" | "muted";
  active: boolean;
  onClick: () => void;
  description: string;
}) {
  const toneText =
    tone === "danger"
      ? "text-destructive"
      : tone === "success"
      ? "text-primary"
      : tone === "neutral"
      ? "text-chart-3"
      : "text-foreground";
  const accentBar =
    tone === "danger"
      ? "bg-destructive"
      : tone === "success"
      ? "bg-primary"
      : tone === "neutral"
      ? "bg-chart-3"
      : "bg-muted-foreground";

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "group relative overflow-hidden rounded-xl border bg-card p-4 text-left shadow-sm transition-all",
        "hover:border-primary/40 focus:outline-none focus:ring-2 focus:ring-ring",
        active ? "border-primary/60 ring-1 ring-primary/40" : "border-border",
      )}
    >
      <span className={cn("absolute inset-y-0 left-0 w-0.5", accentBar)} aria-hidden />
      <div className="flex items-baseline justify-between gap-3">
        <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">{label}</p>
        {active && (
          <span className="rounded-md border border-primary/30 bg-primary/10 px-1.5 py-0.5 font-mono text-[9px] uppercase text-primary">
            Filtered
          </span>
        )}
      </div>
      <p className={cn("mt-2 font-mono text-3xl font-bold tabular-nums", toneText)}>{count}</p>
      <p className="mt-1 text-xs text-muted-foreground">{description}</p>
    </button>
  );
}

function FilterChip({
  active,
  onClick,
  children,
  severity,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  severity?: "error" | "warning" | "notice";
}) {
  const dot =
    severity === "error"
      ? "bg-destructive"
      : severity === "warning"
      ? "bg-chart-3"
      : severity === "notice"
      ? "bg-muted-foreground"
      : "";
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex h-7 items-center gap-1.5 rounded-full border px-3 text-xs transition-colors",
        active
          ? "border-primary/60 bg-primary/10 text-primary"
          : "border-border bg-card text-foreground hover:border-primary/40",
      )}
    >
      {severity && <span className={cn("h-1.5 w-1.5 rounded-full", dot)} aria-hidden />}
      {children}
    </button>
  );
}

function IssueSection({
  issue,
  runId,
  bucketFilter,
}: {
  issue: IssueChange & { filteredUrls: IssueChange["urls"] };
  runId: string;
  bucketFilter: Bucket;
}) {
  const newCount = issue.urls.filter((u) => u.bucket === "new").length;
  const resolvedCount = issue.urls.filter((u) => u.bucket === "resolved").length;
  const persistingCount = issue.urls.filter((u) => u.bucket === "persisting").length;
  const delta = issue.now - issue.prev;
  const sevTone =
    issue.severity === "error"
      ? "border-destructive/30 bg-destructive/10 text-destructive"
      : issue.severity === "warning"
      ? "border-chart-3/30 bg-chart-3/10 text-chart-3"
      : "border-border bg-surface/60 text-muted-foreground";

  return (
    <section className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
      <header className="flex flex-col gap-3 border-b border-border px-5 py-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-start gap-3">
          <span
            className={cn(
              "mt-0.5 inline-flex h-5 items-center rounded-md border px-1.5 font-mono text-[10px] uppercase tracking-wider",
              sevTone,
            )}
          >
            {issue.severity}
          </span>
          <div>
            <h2 className="text-base font-semibold">{issue.name}</h2>
            <p className="mt-0.5 font-mono text-xs text-muted-foreground">
              <span className="text-destructive">+{newCount} new</span>
              <span className="px-1.5 text-muted-foreground/60">·</span>
              <span className="text-primary">−{resolvedCount} resolved</span>
              <span className="px-1.5 text-muted-foreground/60">·</span>
              <span>{persistingCount} unchanged</span>
              <span className="px-1.5 text-muted-foreground/60">·</span>
              <span>
                was {issue.prev} → now {issue.now}{" "}
                <span className={delta < 0 ? "text-primary" : delta > 0 ? "text-destructive" : ""}>
                  ({delta > 0 ? "+" : ""}
                  {delta})
                </span>
              </span>
            </p>
          </div>
        </div>
        <Button variant="outline" size="sm" asChild>
          <Link to="/audit-runs/$runId/issues/$issueId" params={{ runId, issueId: issue.id }}>
            Open full issue
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </Button>
      </header>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-sm">
          <thead>
            <tr className="border-b border-border bg-surface/40 text-left text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
              <th className="w-24 px-5 py-2.5">Status</th>
              <th className="px-3 py-2.5">URL</th>
              <th className="w-32 px-3 py-2.5">First seen</th>
              <th className="w-10 px-3 py-2.5" />
            </tr>
          </thead>
          <tbody>
            {issue.filteredUrls.map((u) => (
              <tr key={u.url} className="border-b border-border/60 last:border-0 hover:bg-surface/40">
                <td className="px-5 py-2.5">
                  <BucketBadge bucket={u.bucket} />
                </td>
                <td className="px-3 py-2.5 font-mono text-xs text-foreground">
                  <span className="block max-w-[520px] truncate" title={u.url}>
                    {u.url}
                  </span>
                </td>
                <td className="px-3 py-2.5 font-mono text-xs text-muted-foreground">
                  {u.bucket === "resolved" ? "—" : u.firstSeen ?? "Earlier crawl"}
                </td>
                <td className="px-3 py-2.5 text-right">
                  <a
                    href={u.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-surface hover:text-foreground"
                    aria-label="Open URL in new tab"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {bucketFilter !== "all" && issue.filteredUrls.length === 0 && (
        <p className="border-t border-border px-5 py-4 text-xs text-muted-foreground">
          No URLs in this bucket for this issue type.
        </p>
      )}
    </section>
  );
}

function BucketBadge({ bucket }: { bucket: Exclude<Bucket, "all"> }) {
  const map = {
    new: "border-destructive/30 bg-destructive/10 text-destructive",
    resolved: "border-primary/30 bg-primary/10 text-primary",
    persisting: "border-border bg-surface text-muted-foreground",
  } as const;
  const label = { new: "New", resolved: "Resolved", persisting: "Persisting" }[bucket];
  return (
    <span
      className={cn(
        "inline-flex h-5 items-center rounded-md border px-1.5 font-mono text-[10px] uppercase tracking-wider",
        map[bucket],
      )}
    >
      {label}
    </span>
  );
}

function EmptyState({ bucket, issueType }: { bucket: Bucket; issueType: string }) {
  const filterLabel =
    bucket === "all" && issueType === "all"
      ? "No comparable changes between these two crawls."
      : "No URLs match the current filter.";
  return (
    <div className="rounded-xl border border-dashed border-border bg-card p-10 text-center shadow-sm">
      <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
        Empty result
      </p>
      <p className="mt-2 text-sm text-foreground">{filterLabel}</p>
      <p className="mt-1 text-xs text-muted-foreground">
        Empty buckets are shown as empty, not hidden. Adjust the filters above to widen the view.
      </p>
    </div>
  );
}
