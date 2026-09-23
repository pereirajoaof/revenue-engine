import { useMemo, useState } from "react";
import { createFileRoute, notFound } from "@tanstack/react-router";
import {
  ArrowLeft,
  ArrowUpRight,
  CheckCircle2,
  Clock,
  Info,
  Plug,
  RefreshCw,
  Search,
  ShieldCheck,
  TriangleAlert,
} from "lucide-react";
import { AppLink as Link } from "@/lib/app-link";
import { DashboardNav } from "@/components/dashboard/DashboardNav";
import { ThemeToggle } from "@/components/ThemeToggle";
import { OpportunityGapChart } from "@/components/dashboard/OpportunityGapChart";
import {
  TOTAL_SITE_GAP,
  UNMAPPED_CLICK_SHARE,
  gapOf,
  getOpportunity,
  money,
  moneyExact,
  pct,
  type Confidence,
  type Effort,
  type OpportunityAction,
  type PageTypeOpportunity,
} from "@/lib/opportunity-data";

type DemoState = "default" | "loading" | "empty";

export const Route = createFileRoute("/project/$projectId/dashboard/opportunity/$pageType")({
  component: OpportunityBreakdownPage,
  validateSearch: (search: Record<string, unknown>): { state?: DemoState } => {
    const state = search.state;
    return state === "loading" || state === "empty" ? { state } : {};
  },
  loader: ({ params }) => {
    const opportunity = getOpportunity(params.pageType);
    if (!opportunity) throw notFound();
    return { slug: opportunity.slug, name: opportunity.name };
  },
  head: ({ loaderData }) => {
    const title = loaderData ? `${loaderData.name} — Opportunity breakdown` : "Opportunity breakdown";
    const description = loaderData
      ? `Where the revenue gap sits for ${loaderData.name.toLowerCase()}, why it exists, and the actions that recover it.`
      : "Revenue gap detail for a single page type.";
    return {
      meta: [
        { title: `${title} — OrganicOS` },
        { name: "description", content: description },
        ...(loaderData ? [] : [{ name: "robots", content: "noindex" }]),
        { property: "og:title", content: `${title} — OrganicOS` },
        { property: "og:description", content: description },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
});

function OpportunityBreakdownPage() {
  const { slug } = Route.useLoaderData();
  const { state = "default" } = Route.useSearch();
  const opportunity = getOpportunity(slug)!;

  const gap = gapOf(opportunity);
  const directional = opportunity.confidence === "Directional";
  const staleDays = parseInt(opportunity.lastUpdated, 10) || 0;
  const isStale = staleDays > 14;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <DashboardNav />
      <div className="lg:pl-56">
        <Header opportunity={opportunity} />

        <main className="px-6 lg:px-8 py-6 space-y-6">
          {state === "loading" ? (
            <LoadingSkeleton />
          ) : state === "empty" ? (
            <EmptyState name={opportunity.name} />
          ) : (
            <>
              {isStale && <StaleBanner lastUpdated={opportunity.lastUpdated} />}
              {UNMAPPED_CLICK_SHARE > 0.1 && <UnmappedBanner />}
              {directional && <DirectionalBanner weeks={opportunity.weeksOfData} />}

              <GapHero opportunity={opportunity} gap={gap} directional={directional} />
              <OpportunityGapChart opportunity={opportunity} />
              {gap > 0 ? (
                <WhyTheGap opportunity={opportunity} gap={gap} directional={directional} />
              ) : (
                <ProtectRevenue opportunity={opportunity} />
              )}
              <Actions opportunity={opportunity} directional={directional} />
              <Pages opportunity={opportunity} directional={directional} />
            </>
          )}
        </main>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- 1 · Header */

function Header({ opportunity }: { opportunity: PageTypeOpportunity }) {
  return (
    <header className="border-b border-border bg-background/80 backdrop-blur sticky top-0 z-20">
      <div className="px-6 lg:px-8 py-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-wider text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-3 h-3" />
            Back to Revenue &amp; Opportunities
          </Link>
          <h1 className="text-2xl font-bold tracking-tight mt-1.5 truncate">{opportunity.name}</h1>
          <p className="mt-1 font-mono text-xs text-muted-foreground">{opportunity.path}</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Meta icon={<Clock className="w-3 h-3" />} label={`${opportunity.weeksOfData} weeks of data`} />
          <Meta icon={<RefreshCw className="w-3 h-3" />} label={`Updated ${opportunity.lastUpdated}`} />
          <ConfidenceChip level={opportunity.confidence} />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}

function Meta({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-md border border-border bg-surface px-2.5 py-1.5 font-mono text-[11px] text-muted-foreground">
      {icon}
      {label}
    </span>
  );
}

function ConfidenceChip({ level }: { level: Confidence }) {
  const styles: Record<Confidence, string> = {
    High: "border-primary/30 bg-primary/10 text-primary",
    Medium: "border-chart-4/30 bg-chart-4/10 text-chart-4",
    Directional: "border-chart-5/40 bg-chart-5/10 text-chart-5",
  };
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1.5 font-mono text-[11px] font-medium ${styles[level]}`}
      title="How reliable these figures are, based on how much data we have"
    >
      <ShieldCheck className="w-3 h-3" />
      {level} confidence
    </span>
  );
}

/* ------------------------------------------------------------- Banner states */

function Banner({
  tone,
  icon,
  title,
  children,
}: {
  tone: "amber" | "muted";
  icon: React.ReactNode;
  title: string;
  children?: React.ReactNode;
}) {
  const styles =
    tone === "amber"
      ? "border-chart-5/30 bg-chart-5/10 text-chart-5"
      : "border-border bg-surface text-muted-foreground";
  return (
    <div className={`flex items-start gap-3 rounded-lg border px-4 py-3 text-sm ${styles}`}>
      <span className="mt-0.5 shrink-0">{icon}</span>
      <div className="min-w-0">
        <p className="font-medium">{title}</p>
        {children && <div className="mt-0.5 text-xs opacity-90">{children}</div>}
      </div>
    </div>
  );
}

function UnmappedBanner() {
  return (
    <Banner
      tone="amber"
      icon={<TriangleAlert className="w-4 h-4" />}
      title={`${pct(UNMAPPED_CLICK_SHARE)} of clicks aren't assigned to a page type`}
    >
      The figures below may be understated.{" "}
      <Link to="/settings" className="underline underline-offset-2 hover:opacity-80">
        Review your page-type rules in Settings
      </Link>
      .
    </Banner>
  );
}

function StaleBanner({ lastUpdated }: { lastUpdated: string }) {
  return (
    <Banner tone="amber" icon={<Clock className="w-4 h-4" />} title={`Data as of ${lastUpdated}`}>
      This page type hasn't been synced in over two weeks. Re-sync for current figures.
    </Banner>
  );
}

function DirectionalBanner({ weeks }: { weeks: number }) {
  return (
    <Banner tone="muted" icon={<Info className="w-4 h-4" />} title="Directional figures">
      Only {weeks} weeks of data so far, so revenue figures are rounded and should be read as a direction of travel,
      not a forecast.
    </Banner>
  );
}

/* ------------------------------------------------------------- 2 · The gap */

function GapHero({
  opportunity,
  gap,
  directional,
}: {
  opportunity: PageTypeOpportunity;
  gap: number;
  directional: boolean;
}) {
  const share = TOTAL_SITE_GAP > 0 ? gap / TOTAL_SITE_GAP : 0;
  const topThree = [...opportunity.actions].sort((a, b) => b.value - a.value).slice(0, 3);
  const recovers = topThree.reduce((sum, a) => sum + a.value, 0);
  const capture = opportunity.potential > 0 ? opportunity.current / opportunity.potential : 1;

  if (gap === 0) {
    return (
      <section className="rounded-lg border border-primary/30 bg-primary/5 p-6">
        <div className="flex items-start gap-3">
          <CheckCircle2 className="w-5 h-5 text-primary mt-1" />
          <div>
            <p className="text-[10px] font-mono uppercase tracking-wider text-primary">No gap</p>
            <h2 className="mt-1 text-2xl font-bold tracking-tight">
              {opportunity.name} are performing at their potential
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {money(opportunity.current, { suffix: "/yr" })} earned against {money(opportunity.potential, { suffix: "/yr" })}{" "}
              possible, at average position {opportunity.avgPosition.toFixed(1)}. The job here is protecting the
              revenue you already have.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="rounded-lg border border-border bg-card overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr]">
        <div className="p-6 lg:p-7 border-b lg:border-b-0 lg:border-r border-border">
          <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
            Annual revenue gap{opportunity.estimated ? " · estimated" : ""}
          </p>
          <p className="mt-2 font-mono text-5xl lg:text-6xl font-bold tracking-tight text-primary">
            {money(gap, { directional, suffix: "/yr" })}
          </p>
          <p className="mt-3 text-sm text-muted-foreground max-w-xl">
            {opportunity.name} earn {money(opportunity.current, { directional, suffix: "/yr" })} today and could earn{" "}
            {money(opportunity.potential, { directional, suffix: "/yr" })}. That difference is{" "}
            <span className="text-foreground font-medium">{pct(share)}</span> of your site's total gap.
          </p>

          <div className="mt-5">
            <div className="h-2 rounded-full bg-surface overflow-hidden">
              <div className="h-full rounded-full bg-primary" style={{ width: `${Math.round(capture * 100)}%` }} />
            </div>
            <div className="mt-2 flex justify-between font-mono text-[11px] text-muted-foreground">
              <span>Earning {pct(capture)} of potential</span>
              <span>{money(opportunity.potential, { directional })} potential</span>
            </div>
          </div>

          {recovers > 0 && (
            <p className="mt-5 inline-flex items-center gap-2 rounded-md border border-primary/30 bg-primary/10 px-3 py-2 text-xs text-primary">
              <ArrowUpRight className="w-3.5 h-3.5" />
              Top 3 actions recover about {money(recovers, { directional })} of the {money(gap, { directional })} gap
            </p>
          )}
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-1 divide-x lg:divide-x-0 lg:divide-y divide-border">
          <HeroStat label="Current" value={money(opportunity.current, { directional, suffix: "/yr" })} muted />
          <HeroStat label="Potential" value={money(opportunity.potential, { directional, suffix: "/yr" })} />
          <HeroStat label="Average position" value={opportunity.avgPosition.toFixed(1)} muted />
        </div>
      </div>
    </section>
  );
}

function HeroStat({ label, value, muted }: { label: string; value: string; muted?: boolean }) {
  return (
    <div className="px-6 py-5">
      <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className={`mt-1 font-mono text-xl font-semibold ${muted ? "text-muted-foreground" : "text-foreground"}`}>
        {value}
      </p>
    </div>
  );
}

/* ------------------------------------------------------- 4 · Why the gap exists */

function WhyTheGap({
  opportunity,
  gap,
  directional,
}: {
  opportunity: PageTypeOpportunity;
  gap: number;
  directional: boolean;
}) {
  if (opportunity.causes.length === 0) {
    return (
      <section className="rounded-lg border border-border bg-card p-5">
        <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Why the gap exists</p>
        <h2 className="text-base font-semibold mt-0.5">Recommended next move</h2>
        <p className="mt-3 text-sm text-foreground max-w-2xl">{opportunity.fallbackMove}</p>
        <p className="mt-2 text-xs text-muted-foreground">
          A full cause-by-cause split of this gap isn't available for this page type yet.
        </p>
      </section>
    );
  }

  const total = opportunity.causes.reduce((sum, c) => sum + c.value, 0);

  return (
    <section className="rounded-lg border border-border bg-card overflow-hidden">
      <div className="px-5 py-4 border-b border-border">
        <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Why the gap exists</p>
        <h2 className="text-base font-semibold mt-0.5">
          Where the {money(gap, { directional })} is going
        </h2>
        <p className="mt-1 text-xs text-muted-foreground">
          Causes overlap, so they add up to more than the gap. Each figure is the revenue that cause alone holds back.
        </p>
      </div>

      <div className="divide-y divide-border">
        {opportunity.causes.map((cause) => {
          const width = total > 0 ? Math.round((cause.value / total) * 100) : 0;
          const bar =
            cause.tone === "amber" ? "bg-chart-5" : cause.tone === "primary" ? "bg-primary" : "bg-muted-foreground";
          return (
            <div key={cause.id} className="px-5 py-4">
              <div className="flex items-start justify-between gap-6">
                <div className="min-w-0">
                  <p className="font-medium text-sm">{cause.label}</p>
                  <p className="mt-1 text-xs text-muted-foreground max-w-2xl">{cause.explain}</p>
                </div>
                <p className="font-mono text-lg font-semibold shrink-0">
                  {money(cause.value, { directional, suffix: "/yr" })}
                </p>
              </div>
              <div className="mt-3 h-1.5 rounded-full bg-surface overflow-hidden">
                <div className={`h-full rounded-full ${bar}`} style={{ width: `${width}%` }} />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function ProtectRevenue({ opportunity }: { opportunity: PageTypeOpportunity }) {
  return (
    <section className="rounded-lg border border-border bg-card p-5">
      <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Protect this revenue</p>
      <h2 className="text-base font-semibold mt-0.5">Nothing to recover — something to defend</h2>
      <p className="mt-3 text-sm text-foreground max-w-2xl">{opportunity.fallbackMove}</p>
    </section>
  );
}

/* --------------------------------------------------------------- 5 · Actions */

function Actions({ opportunity, directional }: { opportunity: PageTypeOpportunity; directional: boolean }) {
  const actions = [...opportunity.actions].sort((a, b) => b.value - a.value);

  return (
    <section className="rounded-lg border border-border bg-card overflow-hidden">
      <div className="px-5 py-4 border-b border-border flex items-center justify-between gap-4">
        <div>
          <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Actions</p>
          <h2 className="text-base font-semibold mt-0.5">What to do, ranked by revenue recovered</h2>
        </div>
        <Link
          to="/dashboard/actions"
          className="shrink-0 font-mono text-xs text-muted-foreground hover:text-primary transition-colors"
        >
          All actions
        </Link>
      </div>

      <div className="divide-y divide-border">
        {actions.map((action, i) => (
          <ActionRow key={action.id} action={action} rank={i + 1} directional={directional} />
        ))}
      </div>
    </section>
  );
}

function ActionRow({ action, rank, directional }: { action: OpportunityAction; rank: number; directional: boolean }) {
  return (
    <Link
      to="/dashboard/actions"
      className="group flex flex-col gap-3 px-5 py-4 transition-colors hover:bg-surface/60 sm:flex-row sm:items-center"
    >
      <span className="font-mono text-[11px] text-muted-foreground w-6 shrink-0">{String(rank).padStart(2, "0")}</span>

      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium group-hover:text-primary transition-colors">{action.title}</p>
        <p className="mt-0.5 text-xs text-muted-foreground">{action.why}</p>
        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
          <span>{action.pagesAffected} pages</span>
          <span className="opacity-40">·</span>
          <span>{action.effort} effort</span>
          <span className="opacity-40">·</span>
          <span>{action.confidence} confidence</span>
        </div>
      </div>

      <div className="flex items-center gap-4 shrink-0">
        <p className="font-mono text-lg font-semibold text-primary">
          {action.value > 0 ? `+${money(action.value, { directional, suffix: "/yr" })}` : "Protects revenue"}
        </p>
        <EffortDots level={action.effort} />
        <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
      </div>
    </Link>
  );
}

function EffortDots({ level }: { level: Effort }) {
  const filled = level === "Low" ? 1 : level === "Medium" ? 2 : 3;
  return (
    <span className="hidden sm:flex items-center gap-1" title={`${level} effort`}>
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className={`h-1.5 w-1.5 rounded-full ${i < filled ? "bg-muted-foreground" : "bg-surface border border-border"}`}
        />
      ))}
    </span>
  );
}

/* ----------------------------------------------------------------- 6 · Pages */

type SortKey = "gap" | "clicks" | "position" | "revenue";

function Pages({ opportunity, directional }: { opportunity: PageTypeOpportunity; directional: boolean }) {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortKey>("gap");

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return opportunity.pages
      .filter((p) => (q ? p.url.toLowerCase().includes(q) : true))
      .sort((a, b) => (sort === "position" ? a.position - b.position : b[sort] - a[sort]));
  }, [opportunity.pages, query, sort]);

  return (
    <section className="rounded-lg border border-border bg-card overflow-hidden">
      <div className="px-5 py-4 border-b border-border flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Pages</p>
          <h2 className="text-base font-semibold mt-0.5">The URLs behind the gap</h2>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search URLs"
              className="w-48 rounded-md border border-border bg-surface pl-8 pr-3 py-1.5 text-xs outline-none focus:border-primary/50"
            />
          </div>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            className="rounded-md border border-border bg-surface px-2 py-1.5 font-mono text-xs outline-none focus:border-primary/50"
          >
            <option value="gap">Sort: Gap</option>
            <option value="revenue">Sort: Revenue</option>
            <option value="clicks">Sort: Clicks</option>
            <option value="position">Sort: Position</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground border-b border-border">
              <th className="text-left font-normal px-5 py-3">URL</th>
              <th className="text-right font-normal px-3 py-3">Gap /yr</th>
              <th className="text-right font-normal px-3 py-3">Revenue /yr</th>
              <th className="text-right font-normal px-3 py-3">Clicks</th>
              <th className="text-right font-normal px-3 py-3">Position</th>
              <th className="text-right font-normal px-5 py-3">Clicks vs expected</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((page) => {
              const ratio = page.expectedCtr > 0 ? page.ctr / page.expectedCtr : 1;
              const below = ratio < 0.95;
              return (
                <tr key={page.url} className="border-b border-border last:border-0 hover:bg-surface/60 transition-colors">
                  <td className="px-5 py-3.5 font-mono text-xs">{page.url}</td>
                  <td className="px-3 py-3.5 text-right font-mono font-semibold text-primary">
                    {page.gap > 0 ? money(page.gap, { directional }) : "—"}
                  </td>
                  <td className="px-3 py-3.5 text-right font-mono text-muted-foreground">{moneyExact(page.revenue)}</td>
                  <td className="px-3 py-3.5 text-right font-mono text-muted-foreground">
                    {page.clicks.toLocaleString("en-GB")}
                  </td>
                  <td className="px-3 py-3.5 text-right font-mono text-muted-foreground">{page.position.toFixed(1)}</td>
                  <td className="px-5 py-3.5 text-right">
                    <span
                      className={`font-mono text-xs ${below ? "text-chart-5" : "text-primary"}`}
                      title={`${pct(page.ctr, 1)} actual vs ${pct(page.expectedCtr, 1)} expected for position ${page.position.toFixed(1)}`}
                    >
                      {below ? "−" : "+"}
                      {pct(Math.abs(1 - ratio))}
                    </span>
                  </td>
                </tr>
              );
            })}
            {rows.length === 0 && (
              <tr>
                <td colSpan={6} className="px-5 py-10 text-center text-sm text-muted-foreground">
                  No URLs match “{query}”.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------- Page states */

function LoadingSkeleton() {
  return (
    <div className="space-y-6" aria-busy="true">
      <div className="h-[220px] rounded-lg border border-border bg-card animate-pulse" />
      <div className="h-[340px] rounded-lg border border-border bg-card animate-pulse" />
      <div className="h-[260px] rounded-lg border border-border bg-card animate-pulse" />
      <div className="h-[220px] rounded-lg border border-border bg-card animate-pulse" />
    </div>
  );
}

function EmptyState({ name }: { name: string }) {
  return (
    <div className="rounded-lg border border-border bg-card px-6 py-16 text-center">
      <Plug className="mx-auto w-6 h-6 text-muted-foreground" />
      <h2 className="mt-4 text-lg font-semibold">No data for {name} yet</h2>
      <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
        Connect Search Console and run a crawl. Once we have a few weeks of data we can show the revenue gap for this
        page type.
      </p>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
        <Link
          to="/settings"
          className="inline-flex items-center gap-1.5 rounded-md bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:brightness-110 transition-all"
        >
          Connect data sources
        </Link>
        <Link
          to="/audit-runs"
          className="inline-flex items-center gap-1.5 rounded-md border border-border bg-surface px-4 py-2 text-xs font-mono hover:bg-card transition-colors"
        >
          Run a crawl
        </Link>
      </div>
    </div>
  );
}
