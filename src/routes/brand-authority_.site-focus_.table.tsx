import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowUpDown,
  Check,
  ChevronDown,
  Columns3,
  Download,
  ExternalLink,
  Filter,
  Minus,
  Search,
  SlidersHorizontal,
  TrendingDown,
  X,
} from "lucide-react";
import { DashboardNav } from "@/components/dashboard/DashboardNav";
import { ThemeToggle } from "@/components/ThemeToggle";

export const Route = createFileRoute("/brand-authority_/site-focus_/table")({
  component: SiteFocusTablePage,
  head: () => ({
    meta: [
      { title: "URL-level Drift Priorities — Site Focus" },
      {
        name: "description",
        content:
          "Page-by-page table of topical drift, click performance, indexability and recoverable revenue across the site.",
      },
    ],
  }),
});

// --- Domain types ----------------------------------------------------------

type TopicFit = "core" | "supporting" | "off";
type ClickStatus = "underperforming" | "ontarget" | "outperforming";
type Indexable = "yes" | "no" | "warn";

type Row = {
  url: string;
  cluster: string;
  topicFit: TopicFit;
  action: string;
  clickStatus: ClickStatus;
  actualCtr: number; // 0..1
  typicalCtr: number;
  rank: number;
  revenue: number;
  recoverable: number;
  potential: number;
  status: 200 | 301 | 404 | 410 | 500;
  indexable: Indexable;
  canonical: "self" | "external" | "—";
  anomaly?: boolean;
};

// --- Mock data (~22 representative rows) -----------------------------------

const ROWS: Row[] = [
  row("/8-tips-for-conversion", "Conversion guides", "off", "Fix indexability issue", 0, 0.005, 45, 0, 12_400, 0, 200, "no", "self", true),
  row("/how-to-use-search-console", "SEO tutorials", "supporting", "Improve internal linking", 0, 0.005, 20, 0, 6_800, 9_400, 200, "yes", "self"),
  row("/the-pros-and-cons-of-ai-content", "AI search", "off", "Reposition into core topic", 0, 0.005, 78, 0, 18_200, 22_000, 200, "yes", "self", true),
  row("/blogging-101", "Content strategy", "supporting", "Consolidate duplicates", 0, 0.005, 38, 0, 4_900, 5_600, 200, "warn", "self"),
  row("/support-wordpress-setup", "Support", "off", "De-index / consolidate", 0, 0.005, 27, 0, 2_100, 3_400, 200, "yes", "external"),
  row("/email-marketing-checklist", "Lifecycle", "supporting", "Fix indexability issue", 0, 0.005, 51, 0, 9_800, 14_200, 200, "no", "self", true),
  row("/importance-of-meta-titles", "SEO tutorials", "core", "Strengthen internal linking", 0.021, 0.018, 9, 38_400, 4_200, 47_100, 200, "yes", "self"),
  row("/services/technical-seo", "Services", "core", "Strengthen internal linking", 0.034, 0.027, 6, 92_300, 8_700, 114_500, 200, "yes", "self"),
  row("/services/content-strategy", "Services", "core", "Strengthen internal linking", 0.029, 0.024, 8, 71_200, 6_100, 88_400, 200, "yes", "self"),
  row("/blog/cheap-weekend-routes", "Travel guides", "off", "Move to separate content hub", 0.004, 0.011, 22, 14_600, 41_200, 56_800, 200, "yes", "self", true),
  row("/blog/best-days-out-uk", "Travel guides", "off", "Move to separate content hub", 0.003, 0.011, 24, 11_900, 37_400, 49_100, 200, "yes", "self", true),
  row("/poi/stonehenge-day-trip", "POI pages", "off", "Move to separate content hub", 0.006, 0.013, 19, 22_300, 58_900, 81_400, 200, "yes", "self"),
  row("/poi/harry-potter-studio-tour", "POI pages", "off", "Move to separate content hub", 0.007, 0.014, 16, 31_800, 66_200, 98_700, 200, "yes", "self"),
  row("/routes/london-to-manchester", "Intercity routes", "core", "Strengthen internal linking", 0.052, 0.041, 3, 184_000, 12_000, 196_000, 200, "yes", "self"),
  row("/routes/edinburgh-to-glasgow", "Intercity routes", "core", "Strengthen internal linking", 0.046, 0.039, 4, 151_000, 11_000, 162_000, 200, "yes", "self"),
  row("/old-timetable-guide", "Legacy guides", "off", "De-index / consolidate", 0.001, 0.008, 71, 800, 4_100, 4_900, 410, "no", "—", true),
  row("/help/luggage-rules", "Support", "supporting", "Consolidate into route templates", 0.011, 0.014, 14, 7_400, 18_200, 25_600, 200, "yes", "self"),
  row("/city/birmingham", "City hubs", "supporting", "Reposition into core topic", 0.018, 0.022, 11, 28_900, 19_800, 48_700, 200, "yes", "self"),
  row("/city/leeds", "City hubs", "supporting", "Improve internal linking", 0.014, 0.019, 13, 19_400, 23_600, 43_000, 200, "warn", "self"),
  row("/operator/national-express", "Operator pages", "off", "Reposition into core topic", 0.009, 0.016, 17, 24_100, 39_400, 63_500, 200, "yes", "self", true),
  row("/stops/victoria-coach-station", "Transport nodes", "supporting", "Move to separate content hub", 0.012, 0.017, 15, 17_800, 20_900, 38_700, 200, "yes", "self"),
  row("/services/seo-audits", "Services", "core", "Strengthen internal linking", 0.038, 0.031, 5, 64_500, 5_800, 78_300, 200, "yes", "self"),
];

function row(
  url: string,
  cluster: string,
  topicFit: TopicFit,
  action: string,
  actualCtr: number,
  typicalCtr: number,
  rank: number,
  revenue: number,
  recoverable: number,
  potential: number,
  status: Row["status"],
  indexable: Indexable,
  canonical: Row["canonical"],
  anomaly = false,
): Row {
  const clickStatus: ClickStatus =
    actualCtr < typicalCtr * 0.7
      ? "underperforming"
      : actualCtr > typicalCtr * 1.15
        ? "outperforming"
        : "ontarget";
  return {
    url: `:web.co.uk${url}`,
    cluster,
    topicFit,
    action,
    clickStatus,
    actualCtr,
    typicalCtr,
    rank,
    revenue,
    recoverable,
    potential,
    status,
    indexable,
    canonical,
    anomaly,
  };
}

// --- Filter primitives -----------------------------------------------------

const TOPIC_FILTERS: { key: "all" | TopicFit; label: string }[] = [
  { key: "all", label: "All topics" },
  { key: "core", label: "Core" },
  { key: "supporting", label: "Supporting" },
  { key: "off", label: "Off-topic" },
];

const SORT_KEYS = ["revenue", "recoverable", "potential", "rank"] as const;
type SortKey = (typeof SORT_KEYS)[number];

// --- Page ------------------------------------------------------------------

function SiteFocusTablePage() {
  const [topic, setTopic] = useState<"all" | TopicFit>("all");
  const [anomaliesOnly, setAnomaliesOnly] = useState(false);
  const [cluster, setCluster] = useState<string>("all");
  const [action, setAction] = useState<string>("all");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortKey>("recoverable");
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const clusters = useMemo(
    () => ["all", ...Array.from(new Set(ROWS.map((r) => r.cluster)))],
    [],
  );
  const actions = useMemo(
    () => ["all", ...Array.from(new Set(ROWS.map((r) => r.action)))],
    [],
  );

  const filtered = useMemo(() => {
    return ROWS.filter((r) => topic === "all" || r.topicFit === topic)
      .filter((r) => !anomaliesOnly || r.anomaly)
      .filter((r) => cluster === "all" || r.cluster === cluster)
      .filter((r) => action === "all" || r.action === action)
      .filter((r) =>
        query.trim()
          ? r.url.toLowerCase().includes(query.toLowerCase()) ||
            r.cluster.toLowerCase().includes(query.toLowerCase())
          : true,
      )
      .sort((a, b) => (sort === "rank" ? a.rank - b.rank : b[sort] - a[sort]));
  }, [topic, anomaliesOnly, cluster, action, query, sort]);

  const totals = useMemo(() => aggregate(filtered), [filtered]);
  const allTotals = useMemo(() => aggregate(ROWS), []);
  const maxRecoverable = Math.max(1, ...ROWS.map((r) => r.recoverable));
  const anomalyCount = ROWS.filter((r) => r.anomaly).length;

  const toggleRow = (url: string) => {
    setSelected((s) => {
      const n = new Set(s);
      n.has(url) ? n.delete(url) : n.add(url);
      return n;
    });
  };
  const toggleAll = () => {
    setSelected((s) =>
      s.size === filtered.length ? new Set() : new Set(filtered.map((r) => r.url)),
    );
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <DashboardNav />
      <div className="lg:pl-56">
        {/* Page header */}
        <header className="border-b border-border bg-background/80 backdrop-blur">
          <div className="px-6 py-6 lg:px-8">
            <Link
              to="/brand-authority/site-focus"
              className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft className="h-3 w-3" /> Back to Site Focus
            </Link>
            <div className="mt-3 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                  Growth driver · Brand authority · Site focus
                </p>
                <h1 className="mt-1 text-3xl font-bold tracking-tight">
                  URL-level drift priorities
                </h1>
                <p className="mt-1.5 text-sm text-muted-foreground">
                  Week of 2026-05-18 · {ROWS.length} pages audited · sorted by recoverable revenue
                </p>
              </div>
              <ThemeToggle />
            </div>
          </div>
        </header>

        <main className="space-y-5 px-6 py-6 lg:px-8">
          {/* Summary strip */}
          <section className="grid gap-px overflow-hidden rounded-xl border border-border bg-border md:grid-cols-4">
            <SummaryCell
              label="Pages in scope"
              value={`${filtered.length}`}
              hint={`of ${ROWS.length} total`}
            />
            <SummaryCell
              label="Recoverable revenue"
              value={formatMoney(totals.recoverable)}
              hint={`${pct(totals.recoverable, allTotals.recoverable)} of site`}
              tone="primary"
            />
            <SummaryCell
              label="Revenue at risk"
              value={formatMoney(totals.atRisk)}
              hint={`${totals.offCount} off-topic pages`}
              tone="destructive"
            />
            <SummaryCell
              label="Anomalies"
              value={`${anomalyCount}`}
              hint="flagged this week"
              tone="warn"
              onClick={() => setAnomaliesOnly((v) => !v)}
              active={anomaliesOnly}
            />
          </section>

          {/* Toolbar */}
          <section className="rounded-xl border border-border bg-card">
            <div className="flex flex-col gap-3 border-b border-border p-3 lg:flex-row lg:items-center lg:justify-between">
              {/* Topic pills */}
              <div className="flex flex-wrap items-center gap-1.5">
                {TOPIC_FILTERS.map((t) => {
                  const active = topic === t.key;
                  const count =
                    t.key === "all"
                      ? ROWS.length
                      : ROWS.filter((r) => r.topicFit === t.key).length;
                  return (
                    <button
                      key={t.key}
                      type="button"
                      onClick={() => setTopic(t.key)}
                      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${
                        active
                          ? "border-primary/40 bg-primary/15 text-primary"
                          : "border-border bg-surface/40 text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {t.label}
                      <span
                        className={`rounded-full px-1.5 font-mono text-[10px] tabular-nums ${
                          active ? "bg-primary/20" : "bg-background/60"
                        }`}
                      >
                        {count}
                      </span>
                    </button>
                  );
                })}
                <button
                  type="button"
                  onClick={() => setAnomaliesOnly((v) => !v)}
                  className={`ml-1 inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${
                    anomaliesOnly
                      ? "border-destructive/40 bg-destructive/15 text-destructive"
                      : "border-border bg-surface/40 text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <AlertTriangle className="h-3 w-3" /> Anomalies
                  <span className="rounded-full bg-background/60 px-1.5 font-mono text-[10px] tabular-nums">
                    {anomalyCount}
                  </span>
                </button>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <div className="relative">
                  <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search URL or cluster…"
                    className="h-8 w-56 rounded-md border border-border bg-surface/40 pl-8 pr-2 text-xs placeholder:text-muted-foreground focus:border-primary/40 focus:outline-none"
                  />
                </div>
                <SelectMenu
                  icon={<Filter className="h-3 w-3" />}
                  value={cluster}
                  onChange={setCluster}
                  options={clusters}
                  labelFor={(v) => (v === "all" ? "All clusters" : v)}
                />
                <SelectMenu
                  icon={<SlidersHorizontal className="h-3 w-3" />}
                  value={action}
                  onChange={setAction}
                  options={actions}
                  labelFor={(v) => (v === "all" ? "All actions" : v)}
                />
                <SelectMenu
                  icon={<ArrowUpDown className="h-3 w-3" />}
                  value={sort}
                  onChange={(v) => setSort(v as SortKey)}
                  options={[...SORT_KEYS]}
                  labelFor={(v) => `Sort: ${v}`}
                />
                <button
                  type="button"
                  className="inline-flex items-center gap-1.5 rounded-md border border-border bg-surface/40 px-2.5 py-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground"
                >
                  <Columns3 className="h-3 w-3" /> Columns
                </button>
                <button
                  type="button"
                  className="inline-flex items-center gap-1.5 rounded-md bg-primary px-2.5 py-1.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90"
                >
                  <Download className="h-3 w-3" /> Export CSV
                </button>
              </div>
            </div>

            {/* Selection bar */}
            {selected.size > 0 && (
              <div className="flex items-center justify-between border-b border-border bg-primary/5 px-3 py-2 text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-semibold text-primary">
                    {selected.size} selected
                  </span>
                  <span className="text-muted-foreground">— bulk apply recommended action</span>
                </div>
                <div className="flex items-center gap-2">
                  <button className="rounded-md border border-border bg-card px-2 py-1 font-semibold hover:bg-surface/60">
                    Create tasks
                  </button>
                  <button className="rounded-md border border-border bg-card px-2 py-1 font-semibold hover:bg-surface/60">
                    Assign owner
                  </button>
                  <button
                    onClick={() => setSelected(new Set())}
                    className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-3 w-3" /> Clear
                  </button>
                </div>
              </div>
            )}

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1280px] border-collapse text-left text-sm">
                <thead className="sticky top-0 z-10 bg-surface/80 backdrop-blur">
                  {/* Grouped header */}
                  <tr className="border-b border-border text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                    <th className="w-8 px-3 py-2"></th>
                    <th className="px-3 py-2" colSpan={3}>
                      Page
                    </th>
                    <th
                      className="border-l border-border px-3 py-2 text-primary/80"
                      colSpan={2}
                    >
                      Performance
                    </th>
                    <th
                      className="border-l border-border px-3 py-2 text-primary/80"
                      colSpan={3}
                    >
                      Revenue
                    </th>
                    <th
                      className="border-l border-border px-3 py-2 text-muted-foreground"
                      colSpan={3}
                    >
                      Health
                    </th>
                  </tr>
                  <tr className="border-b border-border text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                    <th className="w-8 px-3 py-2.5">
                      <input
                        type="checkbox"
                        checked={selected.size === filtered.length && filtered.length > 0}
                        onChange={toggleAll}
                        className="h-3.5 w-3.5 cursor-pointer accent-primary"
                      />
                    </th>
                    <th className="px-3 py-2.5 font-medium">URL</th>
                    <th className="px-3 py-2.5 font-medium">Topic fit</th>
                    <th className="px-3 py-2.5 font-medium">Recommended action</th>
                    <th className="border-l border-border px-3 py-2.5 font-medium">Click performance</th>
                    <th className="px-3 py-2.5 text-right font-medium">Rank</th>
                    <th className="border-l border-border px-3 py-2.5 text-right font-medium">Revenue</th>
                    <th className="px-3 py-2.5 font-medium">Recoverable</th>
                    <th className="px-3 py-2.5 text-right font-medium">Potential</th>
                    <th className="border-l border-border px-3 py-2.5 text-center font-medium">Status</th>
                    <th className="px-3 py-2.5 text-center font-medium">Indexable</th>
                    <th className="px-3 py-2.5 font-medium">Canonical</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((r) => (
                    <DataRow
                      key={r.url}
                      row={r}
                      maxRecoverable={maxRecoverable}
                      selected={selected.has(r.url)}
                      onToggle={() => toggleRow(r.url)}
                    />
                  ))}
                  {filtered.length === 0 && (
                    <tr>
                      <td colSpan={12} className="px-4 py-16 text-center text-sm text-muted-foreground">
                        No pages match the current filters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Footer */}
            <div className="flex flex-col gap-2 border-t border-border px-3 py-2.5 text-xs text-muted-foreground lg:flex-row lg:items-center lg:justify-between">
              <span>
                Showing <span className="font-mono text-foreground">{filtered.length}</span> of{" "}
                <span className="font-mono text-foreground">{ROWS.length}</span> pages
              </span>
              <div className="flex items-center gap-3">
                <Legend />
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

// --- Row -------------------------------------------------------------------

function DataRow({
  row,
  maxRecoverable,
  selected,
  onToggle,
}: {
  row: Row;
  maxRecoverable: number;
  selected: boolean;
  onToggle: () => void;
}) {
  const recoverPct = Math.min(100, (row.recoverable / maxRecoverable) * 100);
  return (
    <tr
      className={`border-b border-border align-middle transition-colors ${
        selected ? "bg-primary/5" : "hover:bg-surface/40"
      }`}
    >
      <td className="px-3 py-3">
        <input
          type="checkbox"
          checked={selected}
          onChange={onToggle}
          className="h-3.5 w-3.5 cursor-pointer accent-primary"
        />
      </td>
      <td className="px-3 py-3">
        <div className="flex items-center gap-2">
          <span className="truncate font-mono text-xs font-semibold text-foreground">
            {row.url}
          </span>
          <ExternalLink className="h-3 w-3 shrink-0 text-muted-foreground" />
          {row.anomaly && (
            <span className="inline-flex items-center gap-1 rounded-full border border-destructive/30 bg-destructive/10 px-1.5 py-0.5 text-[9px] font-mono uppercase tracking-wider text-destructive">
              <AlertTriangle className="h-2.5 w-2.5" /> anomaly
            </span>
          )}
        </div>
        <p className="mt-0.5 text-[11px] text-muted-foreground">{row.cluster}</p>
      </td>
      <td className="px-3 py-3">
        <TopicFitPill fit={row.topicFit} />
      </td>
      <td className="px-3 py-3">
        <span className="text-xs text-foreground">{row.action}</span>
      </td>
      <td className="border-l border-border px-3 py-3">
        <ClickPerfCell row={row} />
      </td>
      <td className="px-3 py-3 text-right">
        <span className="font-mono text-xs tabular-nums text-foreground">
          {row.rank > 0 ? `#${row.rank}` : "—"}
        </span>
      </td>
      <td className="border-l border-border px-3 py-3 text-right">
        <span className="font-mono text-sm tabular-nums">
          {row.revenue > 0 ? formatMoney(row.revenue) : <span className="text-muted-foreground">£0</span>}
        </span>
      </td>
      <td className="px-3 py-3">
        <div className="flex items-center gap-2">
          <div className="h-1.5 w-20 overflow-hidden rounded-full bg-surface">
            <div
              className="h-full rounded-full bg-primary"
              style={{ width: `${recoverPct}%` }}
            />
          </div>
          <span className="font-mono text-xs font-semibold tabular-nums text-primary">
            +{formatMoney(row.recoverable)}
          </span>
        </div>
      </td>
      <td className="px-3 py-3 text-right">
        <span className="font-mono text-xs tabular-nums text-foreground">
          {formatMoney(row.potential)}
        </span>
      </td>
      <td className="border-l border-border px-3 py-3 text-center">
        <StatusPill status={row.status} />
      </td>
      <td className="px-3 py-3 text-center">
        <IndexableMark value={row.indexable} />
      </td>
      <td className="px-3 py-3">
        <span className="font-mono text-xs text-muted-foreground">{row.canonical}</span>
      </td>
    </tr>
  );
}

// --- Cell components -------------------------------------------------------

function TopicFitPill({ fit }: { fit: TopicFit }) {
  const map: Record<TopicFit, { label: string; cls: string; dot: string }> = {
    core: {
      label: "Core",
      cls: "border-primary/30 bg-primary/10 text-primary",
      dot: "bg-primary",
    },
    supporting: {
      label: "Supporting",
      cls: "border-border bg-surface/60 text-foreground",
      dot: "bg-chart-3",
    },
    off: {
      label: "Off-topic",
      cls: "border-destructive/30 bg-destructive/10 text-destructive",
      dot: "bg-destructive",
    },
  };
  const m = map[fit];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 text-[11px] font-semibold ${m.cls}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${m.dot}`} />
      {m.label}
    </span>
  );
}

function ClickPerfCell({ row }: { row: Row }) {
  const map: Record<ClickStatus, { label: string; cls: string; icon: React.ReactNode }> = {
    underperforming: {
      label: "Underperforming",
      cls: "text-destructive",
      icon: <TrendingDown className="h-3 w-3" />,
    },
    ontarget: {
      label: "On target",
      cls: "text-muted-foreground",
      icon: <Minus className="h-3 w-3" />,
    },
    outperforming: {
      label: "Outperforming",
      cls: "text-primary",
      icon: <TrendingDown className="h-3 w-3 rotate-180" />,
    },
  };
  const m = map[row.clickStatus];
  return (
    <div className="flex flex-col gap-0.5">
      <span className={`inline-flex items-center gap-1 text-[11px] font-mono font-bold uppercase tracking-wider ${m.cls}`}>
        {m.icon}
        {m.label}
      </span>
      <span className="text-[11px] text-muted-foreground">
        <span className="font-mono tabular-nums text-foreground">
          {(row.actualCtr * 100).toFixed(1)}%
        </span>{" "}
        vs{" "}
        <span className="font-mono tabular-nums">{(row.typicalCtr * 100).toFixed(1)}%</span> typical
      </span>
    </div>
  );
}

function StatusPill({ status }: { status: Row["status"] }) {
  const ok = status >= 200 && status < 300;
  const warn = status >= 300 && status < 400;
  const cls = ok
    ? "border-primary/30 bg-primary/10 text-primary"
    : warn
      ? "border-border bg-surface/60 text-foreground"
      : "border-destructive/30 bg-destructive/10 text-destructive";
  return (
    <span className={`inline-flex rounded-md border px-1.5 py-0.5 font-mono text-[11px] font-bold tabular-nums ${cls}`}>
      {status}
    </span>
  );
}

function IndexableMark({ value }: { value: Indexable }) {
  if (value === "yes")
    return (
      <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary/15 text-primary">
        <Check className="h-3 w-3" />
      </span>
    );
  if (value === "warn")
    return (
      <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-chart-3/15 text-chart-3">
        <AlertTriangle className="h-3 w-3" />
      </span>
    );
  return (
    <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-destructive/15 text-destructive">
      <X className="h-3 w-3" />
    </span>
  );
}

// --- Summary cell ----------------------------------------------------------

function SummaryCell({
  label,
  value,
  hint,
  tone = "neutral",
  onClick,
  active,
}: {
  label: string;
  value: string;
  hint: string;
  tone?: "neutral" | "primary" | "destructive" | "warn";
  onClick?: () => void;
  active?: boolean;
}) {
  const toneCls =
    tone === "primary"
      ? "text-primary"
      : tone === "destructive"
        ? "text-destructive"
        : tone === "warn"
          ? "text-chart-3"
          : "text-foreground";
  const Comp: any = onClick ? "button" : "div";
  return (
    <Comp
      onClick={onClick}
      className={`bg-card p-5 text-left transition-colors ${
        onClick ? "cursor-pointer hover:bg-surface/40" : ""
      } ${active ? "ring-1 ring-inset ring-primary/40" : ""}`}
    >
      <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      <p className={`mt-2 font-mono text-3xl font-bold tabular-nums ${toneCls}`}>{value}</p>
      <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
    </Comp>
  );
}

// --- Select menu (lightweight, no portal) ----------------------------------

function SelectMenu({
  icon,
  value,
  onChange,
  options,
  labelFor,
}: {
  icon: React.ReactNode;
  value: string;
  onChange: (v: string) => void;
  options: string[];
  labelFor: (v: string) => string;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="inline-flex h-8 items-center gap-1.5 rounded-md border border-border bg-surface/40 px-2.5 text-xs font-semibold text-foreground hover:bg-surface/70"
      >
        {icon}
        <span className="max-w-[150px] truncate">{labelFor(value)}</span>
        <ChevronDown className="h-3 w-3 text-muted-foreground" />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-20" onClick={() => setOpen(false)} />
          <div className="absolute right-0 z-30 mt-1 max-h-72 w-56 overflow-auto rounded-md border border-border bg-popover p-1 shadow-lg">
            {options.map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => {
                  onChange(opt);
                  setOpen(false);
                }}
                className={`flex w-full items-center justify-between rounded px-2 py-1.5 text-left text-xs hover:bg-surface ${
                  opt === value ? "text-primary" : "text-foreground"
                }`}
              >
                <span className="truncate">{labelFor(opt)}</span>
                {opt === value && <Check className="h-3 w-3" />}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function Legend() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <span className="inline-flex items-center gap-1.5">
        <span className="h-2 w-2 rounded-full bg-primary" /> Core
      </span>
      <span className="inline-flex items-center gap-1.5">
        <span className="h-2 w-2 rounded-full bg-chart-3" /> Supporting
      </span>
      <span className="inline-flex items-center gap-1.5">
        <span className="h-2 w-2 rounded-full bg-destructive" /> Off-topic
      </span>
      <span className="text-muted-foreground">·</span>
      <span className="inline-flex items-center gap-1.5">
        <AlertTriangle className="h-3 w-3 text-destructive" /> Anomaly
      </span>
    </div>
  );
}

// --- Helpers ---------------------------------------------------------------

function aggregate(rows: Row[]) {
  return rows.reduce(
    (acc, r) => ({
      revenue: acc.revenue + r.revenue,
      recoverable: acc.recoverable + r.recoverable,
      potential: acc.potential + r.potential,
      atRisk: acc.atRisk + (r.topicFit === "off" ? r.recoverable + r.revenue : 0),
      offCount: acc.offCount + (r.topicFit === "off" ? 1 : 0),
    }),
    { revenue: 0, recoverable: 0, potential: 0, atRisk: 0, offCount: 0 },
  );
}

function formatMoney(value: number) {
  if (value >= 1000) return `£${(value / 1000).toFixed(value >= 10000 ? 0 : 1)}K`;
  return `£${value}`;
}

function pct(part: number, whole: number) {
  if (!whole) return "0%";
  return `${Math.round((part / whole) * 100)}%`;
}
