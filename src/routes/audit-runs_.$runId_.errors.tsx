import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  ArrowDown,
  ArrowUp,
  AlertTriangle,
  BarChart3,
  Download,
  Globe,
  Layers,
  Search,
  Share2,
  TrendingUp,
} from "lucide-react";
import { Area, AreaChart, ResponsiveContainer, YAxis } from "recharts";
import { DashboardNav } from "@/components/dashboard/DashboardNav";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/audit-runs_/$runId_/errors")({
  component: AuditErrorsRoute,
  head: () => ({
    meta: [
      { title: "Crawl Errors — OrganicOS" },
      {
        name: "description",
        content:
          "Every error-level report from an OrganicOS crawl, weighted by revenue impact with trend, change, added, moved and missing URL counts.",
      },
      { property: "og:title", content: "Crawl Errors — OrganicOS" },
      {
        property: "og:description",
        content: "Error reports for an audit run, sorted by weighted revenue impact.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

type Category = "Indexability" | "Experience" | "Availability" | "Rankability" | "Discoverability" | "Uniqueness";

type ErrorReport = {
  id: string;
  name: string;
  category: Category;
  total: number;
  weight: number; // 0-5 bars
  revenue: string;
  trend: number[];
  change: number;
  changePct: number;
  added: number;
  moved: number;
  missing: number;
};

const CATEGORY_ICON: Record<Category, React.ReactNode> = {
  Indexability: <Layers className="h-3.5 w-3.5" />,
  Experience: <BarChart3 className="h-3.5 w-3.5" />,
  Availability: <Globe className="h-3.5 w-3.5" />,
  Rankability: <TrendingUp className="h-3.5 w-3.5" />,
  Discoverability: <Search className="h-3.5 w-3.5" />,
  Uniqueness: <AlertTriangle className="h-3.5 w-3.5" />,
};

const spark = (base: number, drift: number) =>
  Array.from({ length: 24 }, (_, i) => base + Math.round(Math.sin(i / 2.4) * base * 0.03) + Math.round((drift * i) / 23));

const REPORTS: ErrorReport[] = [
  {
    id: "https-without-hsts",
    name: "HTTPS Pages without HSTS",
    category: "Experience",
    total: 48120,
    weight: 5,
    revenue: "£412k",
    trend: spark(48120, -3200),
    change: -51946,
    changePct: -51.9,
    added: 8132,
    moved: 0,
    missing: 60078,
  },
  {
    id: "poor-ux",
    name: "Poor UX Pages with Traffic",
    category: "Experience",
    total: 4586,
    weight: 4,
    revenue: "£286k",
    trend: spark(4586, 240),
    change: 285,
    changePct: 6.63,
    added: 2662,
    moved: 2377,
    missing: 0,
  },
  {
    id: "thin-pages",
    name: "Thin Pages",
    category: "Rankability",
    total: 9209,
    weight: 4,
    revenue: "£244k",
    trend: spark(9209, 1800),
    change: 2025,
    changePct: 28.2,
    added: 2276,
    moved: 251,
    missing: 0,
  },
  {
    id: "unique-broken-links",
    name: "Unique Broken Links",
    category: "Availability",
    total: 972,
    weight: 4,
    revenue: "£198k",
    trend: spark(972, -260),
    change: -1378,
    changePct: -58.6,
    added: 111,
    moved: 5,
    missing: 1484,
  },
  {
    id: "broken-pages",
    name: "Broken Pages (4xx Errors)",
    category: "Availability",
    total: 757,
    weight: 3,
    revenue: "£176k",
    trend: spark(757, -190),
    change: -1141,
    changePct: -60.1,
    added: 112,
    moved: 3,
    missing: 1250,
  },
  {
    id: "non-indexable-traffic",
    name: "Non-Indexable Pages with Traffic",
    category: "Indexability",
    total: 3729,
    weight: 3,
    revenue: "£154k",
    trend: spark(3729, 60),
    change: 23,
    changePct: 0.62,
    added: 45,
    moved: 20,
    missing: 2,
  },
  {
    id: "non-indexable-inlinks",
    name: "Non-Indexable Pages with Inlinks",
    category: "Indexability",
    total: 3700,
    weight: 3,
    revenue: "£121k",
    trend: spark(3700, 40),
    change: 19,
    changePct: 0.52,
    added: 34,
    moved: 14,
    missing: 1,
  },
  {
    id: "max-title-length",
    name: "Max Title Length",
    category: "Rankability",
    total: 13223,
    weight: 3,
    revenue: "£98k",
    trend: spark(13223, 6400),
    change: 7108,
    changePct: 116,
    added: 7109,
    moved: 1,
    missing: 0,
  },
  {
    id: "images-missing-alt",
    name: "Links with Images Missing Alt Text",
    category: "Experience",
    total: 1815,
    weight: 2,
    revenue: "£72k",
    trend: spark(1815, -420),
    change: -1576,
    changePct: -46.5,
    added: 18,
    moved: 0,
    missing: 1594,
  },
  {
    id: "uncategorised-http",
    name: "Uncategorised HTTP Responses",
    category: "Availability",
    total: 531,
    weight: 2,
    revenue: "£61k",
    trend: spark(531, -120),
    change: -445,
    changePct: -45.6,
    added: 531,
    moved: 0,
    missing: 976,
  },
  {
    id: "low-pageviews",
    name: "Low Pageviews per Session",
    category: "Experience",
    total: 11281,
    weight: 2,
    revenue: "£54k",
    trend: spark(11281, 700),
    change: 825,
    changePct: 7.89,
    added: 965,
    moved: 135,
    missing: 5,
  },
  {
    id: "low-time-on-page",
    name: "Low Avg Time on Page",
    category: "Experience",
    total: 5302,
    weight: 2,
    revenue: "£43k",
    trend: spark(5302, -20),
    change: -2,
    changePct: -0.04,
    added: 130,
    moved: 131,
    missing: 1,
  },
  {
    id: "internal-redirects",
    name: "Internal Redirects Found",
    category: "Discoverability",
    total: 727,
    weight: 1,
    revenue: "£31k",
    trend: spark(727, -600),
    change: -8079,
    changePct: -91.7,
    added: 8,
    moved: 7937,
    missing: 150,
  },
  {
    id: "duplicate-titles",
    name: "Duplicate Page Titles",
    category: "Uniqueness",
    total: 2418,
    weight: 1,
    revenue: "£26k",
    trend: spark(2418, 130),
    change: 142,
    changePct: 6.2,
    added: 205,
    moved: 63,
    missing: 12,
  },
  {
    id: "orphaned-pages",
    name: "Orphaned Pages in Sitemaps",
    category: "Discoverability",
    total: 1094,
    weight: 1,
    revenue: "£18k",
    trend: spark(1094, -80),
    change: -96,
    changePct: -8.1,
    added: 22,
    moved: 4,
    missing: 118,
  },
];

const CATEGORIES: ("All categories" | Category)[] = [
  "All categories",
  "Indexability",
  "Experience",
  "Availability",
  "Rankability",
  "Discoverability",
  "Uniqueness",
];

type SortKey = "weight" | "total" | "change" | "added" | "moved" | "missing" | "name";

const fmt = (n: number) => n.toLocaleString("en-GB");

function AuditErrorsRoute() {
  const { runId } = Route.useParams();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<(typeof CATEGORIES)[number]>("All categories");
  const [sortKey, setSortKey] = useState<SortKey>("weight");
  const [desc, setDesc] = useState(true);

  const rows = useMemo(() => {
    const filtered = REPORTS.filter(
      (r) =>
        (category === "All categories" || r.category === category) &&
        r.name.toLowerCase().includes(query.trim().toLowerCase()),
    );
    return [...filtered].sort((a, b) => {
      if (sortKey === "name") return desc ? b.name.localeCompare(a.name) : a.name.localeCompare(b.name);
      const av = a[sortKey] as number;
      const bv = b[sortKey] as number;
      return desc ? bv - av : av - bv;
    });
  }, [query, category, sortKey, desc]);

  const totals = useMemo(
    () => ({
      reports: rows.length,
      urls: rows.reduce((sum, r) => sum + r.total, 0),
      added: rows.reduce((sum, r) => sum + r.added, 0),
      missing: rows.reduce((sum, r) => sum + r.missing, 0),
    }),
    [rows],
  );

  const toggleSort = (key: SortKey) => {
    if (key === sortKey) setDesc((v) => !v);
    else {
      setSortKey(key);
      setDesc(true);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <DashboardNav />

      <div className="lg:pl-56">
        <header className="sticky top-0 z-30 border-b border-border bg-background/85 backdrop-blur">
          <div className="flex flex-col gap-4 px-6 py-5 lg:px-8 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex items-start gap-3">
              <Button variant="ghost" size="icon" asChild aria-label="Back to audit run overview">
                <Link to="/audit-runs/$runId" params={{ runId }}>
                  <ArrowLeft className="h-4 w-4" />
                </Link>
              </Button>
              <div>
                <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                  Audit run · {runId}
                </p>
                <h1 className="mt-1 text-2xl font-bold tracking-tight">
                  Errors <span className="text-muted-foreground font-normal">({REPORTS.length})</span>
                </h1>
                <p className="mt-1 text-sm text-muted-foreground">
                  Error-level reports from the latest crawl, weighted by revenue exposure.
                </p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-md border border-border bg-surface px-3 py-1.5 text-xs font-mono text-muted-foreground">
                Sep 4, 2026 · 12:45
              </span>
              <Button variant="outline" size="sm">
                <Download className="h-3.5 w-3.5" /> Export
              </Button>
              <Button variant="outline" size="sm">
                <Share2 className="h-3.5 w-3.5" /> Share
              </Button>
              <ThemeToggle />
            </div>
          </div>

          {/* Section tabs */}
          <div className="flex items-center gap-1 px-6 lg:px-8">
            <Link
              to="/audit-runs/$runId"
              params={{ runId }}
              className="border-b-2 border-transparent px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              Dashboard
            </Link>
            <Link
              to="/audit-runs/$runId/inventory"
              params={{ runId }}
              className="border-b-2 border-transparent px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              All reports <span className="text-muted-foreground/70">(288)</span>
            </Link>
            <span className="-mb-px border-b-2 border-primary px-3 py-2.5 text-sm font-medium text-foreground">
              Errors <span className="text-muted-foreground">({REPORTS.length})</span>
            </span>
          </div>
        </header>

        <main className="space-y-6 px-6 py-6 lg:px-8">
          {/* Summary strip */}
          <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            <SummaryTile label="Error reports" value={fmt(totals.reports)} hint="in current view" />
            <SummaryTile label="URLs affected" value={fmt(totals.urls)} hint="across all error reports" />
            <SummaryTile label="Newly added" value={`+${fmt(totals.added)}`} hint="vs previous crawl" tone="danger" />
            <SummaryTile label="Resolved / missing" value={fmt(totals.missing)} hint="no longer failing" tone="good" />
          </section>

          {/* Toolbar */}
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative w-full lg:max-w-sm">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search reports in table"
                className="pl-9"
                aria-label="Search error reports"
              />
            </div>
            <div className="flex flex-wrap items-center gap-1.5">
              {CATEGORIES.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCategory(c)}
                  className={`rounded-md border px-2.5 py-1.5 text-xs transition-colors ${
                    category === c
                      ? "border-primary/25 bg-primary/10 text-primary"
                      : "border-border bg-surface text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Table */}
          <section className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1080px] text-sm">
                <thead>
                  <tr className="border-b border-border bg-surface/60 text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                    <Th className="w-[34%] text-left" onClick={() => toggleSort("name")} active={sortKey === "name"} desc={desc}>
                      Report
                    </Th>
                    <Th className="text-right" onClick={() => toggleSort("total")} active={sortKey === "total"} desc={desc}>
                      Total
                    </Th>
                    <Th className="text-left" onClick={() => toggleSort("weight")} active={sortKey === "weight"} desc={desc}>
                      Weighted impact
                    </Th>
                    <th className="px-3 py-2.5 text-left font-normal">Total trend</th>
                    <Th className="text-right" onClick={() => toggleSort("change")} active={sortKey === "change"} desc={desc}>
                      Change
                    </Th>
                    <Th className="text-right" onClick={() => toggleSort("added")} active={sortKey === "added"} desc={desc}>
                      Added
                    </Th>
                    <Th className="text-right" onClick={() => toggleSort("moved")} active={sortKey === "moved"} desc={desc}>
                      Moved
                    </Th>
                    <Th className="text-right" onClick={() => toggleSort("missing")} active={sortKey === "missing"} desc={desc}>
                      Missing
                    </Th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r) => {
                    const worse = r.change > 0;
                    return (
                      <tr key={r.id} className="border-b border-border/70 transition-colors last:border-0 hover:bg-surface/50">
                        <td className="px-3 py-3">
                          <div className="flex items-start gap-2.5">
                            <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md border border-border bg-surface text-muted-foreground">
                              {CATEGORY_ICON[r.category]}
                            </span>
                            <span className="mt-1.5 h-2 w-2 shrink-0 rounded-[3px] bg-destructive" aria-hidden />
                            <div className="min-w-0">
                              <Link
                                to="/audit-runs/$runId/issues/$issueId"
                                params={{ runId, issueId: r.id }}
                                className="block truncate font-medium hover:text-primary"
                              >
                                {r.name}
                              </Link>
                              <p className="mt-0.5 text-[11px] font-mono text-muted-foreground">
                                {r.category} · {r.revenue} exposure
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-3 py-3 text-right font-mono tabular-nums text-destructive">{fmt(r.total)}</td>
                        <td className="px-3 py-3">
                          <WeightBars weight={r.weight} />
                        </td>
                        <td className="px-3 py-3">
                          <Sparkline data={r.trend} up={worse} />
                        </td>
                        <td className="px-3 py-3 text-right">
                          <div className="font-mono tabular-nums">
                            {r.change > 0 ? `+${fmt(r.change)}` : fmt(r.change)}
                          </div>
                          <div
                            className={`mt-0.5 inline-flex items-center gap-0.5 rounded px-1 py-0.5 text-[10px] font-mono ${
                              worse ? "bg-destructive/10 text-destructive" : "bg-primary/10 text-primary"
                            }`}
                          >
                            {worse ? <ArrowUp className="h-2.5 w-2.5" /> : <ArrowDown className="h-2.5 w-2.5" />}
                            {Math.abs(r.changePct)}%
                          </div>
                        </td>
                        <td className="px-3 py-3 text-right font-mono tabular-nums text-muted-foreground">{fmt(r.added)}</td>
                        <td className="px-3 py-3 text-right font-mono tabular-nums text-muted-foreground">{fmt(r.moved)}</td>
                        <td className="px-3 py-3 text-right font-mono tabular-nums text-muted-foreground">{fmt(r.missing)}</td>
                      </tr>
                    );
                  })}
                  {rows.length === 0 && (
                    <tr>
                      <td colSpan={8} className="px-3 py-10 text-center text-sm text-muted-foreground">
                        No error reports match this filter.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>

          <p className="text-[11px] font-mono text-muted-foreground">
            Weighted impact combines URL volume, organic traffic and revenue per page type. Sorted by {sortKey}{" "}
            {desc ? "descending" : "ascending"}.
          </p>
        </main>
      </div>
    </div>
  );
}

function Th({
  children,
  className = "",
  onClick,
  active,
  desc,
}: {
  children: React.ReactNode;
  className?: string;
  onClick: () => void;
  active: boolean;
  desc: boolean;
}) {
  return (
    <th className={`px-3 py-2.5 font-normal ${className}`}>
      <button
        type="button"
        onClick={onClick}
        className={`inline-flex items-center gap-1 uppercase tracking-wider transition-colors hover:text-foreground ${
          active ? "text-foreground" : ""
        }`}
      >
        {children}
        {active && (desc ? <ArrowDown className="h-3 w-3" /> : <ArrowUp className="h-3 w-3" />)}
      </button>
    </th>
  );
}

function WeightBars({ weight }: { weight: number }) {
  return (
    <div className="flex items-end gap-0.5" aria-label={`Weighted impact ${weight} of 5`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <span
          key={i}
          style={{ height: `${4 + i * 3}px` }}
          className={`w-1.5 rounded-[2px] ${i <= weight ? "bg-destructive" : "bg-border"}`}
        />
      ))}
    </div>
  );
}

function Sparkline({ data, up }: { data: number[]; up: boolean }) {
  const points = data.map((value, i) => ({ i, value }));
  const color = up ? "var(--destructive)" : "var(--primary)";
  return (
    <div className="h-9 w-[160px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={points} margin={{ top: 4, right: 2, bottom: 0, left: 2 }}>
          <YAxis hide domain={["dataMin", "dataMax"]} />
          <Area type="monotone" dataKey="value" stroke={color} strokeWidth={1.5} fill={color} fillOpacity={0.1} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

function SummaryTile({
  label,
  value,
  hint,
  tone = "neutral",
}: {
  label: string;
  value: string;
  hint: string;
  tone?: "neutral" | "good" | "danger";
}) {
  const toneClass =
    tone === "good" ? "text-primary" : tone === "danger" ? "text-destructive" : "text-foreground";
  return (
    <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
      <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className={`mt-1.5 font-mono text-2xl font-semibold tabular-nums ${toneClass}`}>{value}</p>
      <p className="mt-0.5 text-[11px] text-muted-foreground">{hint}</p>
    </div>
  );
}
