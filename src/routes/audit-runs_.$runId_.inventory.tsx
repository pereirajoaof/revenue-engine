import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ComposedChart,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  AlertTriangle,
  ArrowDownRight,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  ChevronRight,
  Download,
  ExternalLink,
  GitCompare,
  Info,
  Minus,
  Sparkles,
} from "lucide-react";
import { DashboardNav } from "@/components/dashboard/DashboardNav";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/audit-runs_/$runId_/inventory")({
  component: InventoryPage,
  head: () => ({
    meta: [
      { title: "Inventory Overview — OrganicOS" },
      {
        name: "description",
        content:
          "Monitor crawl inventory health, status distribution, and technical changes across crawls.",
      },
      { property: "og:title", content: "Inventory Overview — OrganicOS" },
      {
        property: "og:description",
        content:
          "Inventory health, HTTP status distribution, non-200 breakdown, and depth-level crawl analysis for an OrganicOS audit run.",
      },
    ],
  }),
});

// ---------- Mock data ----------

const SCORE_TREND = [
  { date: "Jan 04", score: 86, urls: 6_120_000 },
  { date: "Jan 18", score: 88, urls: 6_240_000 },
  { date: "Feb 01", score: 84, urls: 6_510_000 },
  { date: "Feb 15", score: 87, urls: 6_680_000 },
  { date: "Mar 01", score: 91, urls: 6_920_000 },
  { date: "Mar 15", score: 93, urls: 7_010_000 },
  { date: "Mar 29", score: 96, urls: 7_180_000 },
  { date: "Apr 12", score: 98, urls: 7_290_000 },
  { date: "Apr 26", score: 100, urls: 7_436_341 },
];

const ANNOTATIONS = [
  { date: "Feb 01", label: "Sitemap rewrite" },
  { date: "Mar 15", label: "Faceted nav rollout" },
  { date: "Apr 12", label: "410 cleanup" },
];

const SPARKLINE_URLS = SCORE_TREND.map((d) => ({ x: d.date, v: d.urls }));
const SPARKLINE_SCORE = SCORE_TREND.map((d) => ({ x: d.date, v: d.score }));
const SPARKLINE_NON200 = [
  { x: "1", v: 312 }, { x: "2", v: 298 }, { x: "3", v: 305 }, { x: "4", v: 287 },
  { x: "5", v: 264 }, { x: "6", v: 251 }, { x: "7", v: 240 }, { x: "8", v: 234 },
].map((d) => ({ ...d, v: d.v * 1000 }));
const DEPTH_HISTO = [
  { d: "0", c: 1 }, { d: "1", c: 32 }, { d: "2", c: 412 }, { d: "3", c: 1820 },
  { d: "4", c: 3210 }, { d: "5+", c: 1960 }, { d: "orph", c: 218 },
];

const STATUS_DISTRIBUTION = [
  { name: "200", value: 7_122_410, color: "var(--chart-1)" },
  { name: "301", value: 142_080, color: "var(--chart-3)" },
  { name: "302", value: 38_120, color: "var(--chart-2)" },
  { name: "404", value: 31_410, color: "var(--chart-5)" },
  { name: "410", value: 8_240, color: "var(--chart-4)" },
  { name: "500", value: 4_920, color: "var(--destructive)" },
  { name: "Blocked", value: 76_220, color: "var(--muted-foreground)" },
  { name: "Redirect chains", value: 12_941, color: "var(--chart-3)" },
];

const STATUS_EVOLUTION = [
  { d: "Jan 04", s200: 5_960_000, s3xx: 168_000, s4xx: 52_000, s5xx: 9_400 },
  { d: "Jan 18", s200: 6_070_000, s3xx: 162_000, s4xx: 48_000, s5xx: 8_900 },
  { d: "Feb 01", s200: 6_310_000, s3xx: 178_000, s4xx: 56_000, s5xx: 10_200 },
  { d: "Feb 15", s200: 6_470_000, s3xx: 172_000, s4xx: 50_000, s5xx: 8_400 },
  { d: "Mar 01", s200: 6_710_000, s3xx: 165_000, s4xx: 46_000, s5xx: 7_200 },
  { d: "Mar 15", s200: 6_810_000, s3xx: 158_000, s4xx: 42_000, s5xx: 6_500 },
  { d: "Mar 29", s200: 6_980_000, s3xx: 152_000, s4xx: 39_000, s5xx: 6_100 },
  { d: "Apr 12", s200: 7_080_000, s3xx: 148_000, s4xx: 36_000, s5xx: 5_400 },
  { d: "Apr 26", s200: 7_122_410, s3xx: 193_141, s4xx: 39_650, s5xx: 4_920 },
];

const NON_200_DISTRIBUTION = [
  { name: "Redirects", value: 142_080, color: "var(--chart-3)" },
  { name: "Broken pages", value: 39_650, color: "var(--chart-5)" },
  { name: "Server errors", value: 4_920, color: "var(--destructive)" },
  { name: "Blocked pages", value: 76_220, color: "var(--muted-foreground)" },
  { name: "Timeout pages", value: 1_240, color: "var(--chart-4)" },
];

const NON_200_TREND = [
  { d: "Jan", redirects: 168_000, broken: 52_000, server: 9_400, timeout: 1_800 },
  { d: "Feb", redirects: 175_000, broken: 53_000, server: 9_300, timeout: 1_650 },
  { d: "Feb 15", redirects: 172_000, broken: 50_000, server: 8_400, timeout: 1_540 },
  { d: "Mar", redirects: 165_000, broken: 46_000, server: 7_200, timeout: 1_420, alert: true },
  { d: "Mar 15", redirects: 158_000, broken: 42_000, server: 6_500, timeout: 1_360 },
  { d: "Mar 29", redirects: 152_000, broken: 39_000, server: 6_100, timeout: 1_290 },
  { d: "Apr 12", redirects: 148_000, broken: 36_000, server: 5_400, timeout: 1_260 },
  { d: "Apr 26", redirects: 142_080, broken: 39_650, server: 4_920, timeout: 1_240 },
];

const DEPTH_STACK = [
  { depth: "Depth 0", s200: 1, s3xx: 0, s4xx: 0, s5xx: 0 },
  { depth: "Depth 1", s200: 312, s3xx: 12, s4xx: 4, s5xx: 0 },
  { depth: "Depth 2", s200: 12_840, s3xx: 482, s4xx: 96, s5xx: 12 },
  { depth: "Depth 3", s200: 412_310, s3xx: 18_402, s4xx: 4_120, s5xx: 412 },
  { depth: "Depth 4", s200: 2_310_440, s3xx: 62_310, s4xx: 12_180, s5xx: 1_240 },
  { depth: "Depth 5+", s200: 4_180_320, s3xx: 88_402, s4xx: 19_240, s5xx: 2_840 },
  { depth: "Orphaned", s200: 206_186, s3xx: 23_533, s4xx: 4_010, s5xx: 416 },
];

const ERRORS: Array<{
  severity: "critical" | "warning" | "notice";
  type: string;
  urls: number;
  pct: number;
  trend: number;
  impact: number;
}> = [
  { severity: "critical", type: "Excessive parameterized URLs", urls: 482_310, pct: 6.5, trend: 14, impact: 92 },
  { severity: "critical", type: "Infinite crawl spaces", urls: 128_402, pct: 1.7, trend: 22, impact: 88 },
  { severity: "warning", type: "Orphan pages", urls: 86_184, pct: 1.2, trend: -31, impact: 71 },
  { severity: "warning", type: "Duplicate URL patterns", urls: 142_088, pct: 1.9, trend: -22, impact: 76 },
  { severity: "warning", type: "Soft 404 inventory", urls: 24_410, pct: 0.3, trend: -8, impact: 64 },
  { severity: "notice", type: "Non-canonical duplicates", urls: 312_480, pct: 4.2, trend: 3, impact: 52 },
  { severity: "notice", type: "Crawl traps", urls: 18_402, pct: 0.2, trend: -12, impact: 48 },
];

const TOP_CHANGES = [
  { name: "404 URLs", current: 31_410, abs: 3_812, pct: 14, kind: "bad", spark: [22, 24, 23, 26, 28, 30, 29, 31] },
  { name: "Duplicate URLs", current: 142_088, abs: -39_812, pct: -22, kind: "good", spark: [200, 195, 188, 178, 170, 158, 150, 142] },
  { name: "Discovered URLs", current: 7_436_341, abs: 168_402, pct: 8, kind: "neutral", spark: [69, 70, 71, 72, 73, 74, 74, 74] },
  { name: "Orphan pages", current: 86_184, abs: -38_711, pct: -31, kind: "good", spark: [142, 138, 130, 120, 110, 100, 94, 86] },
  { name: "Redirect chains", current: 12_941, abs: 1_240, pct: 11, kind: "bad", spark: [10, 10, 11, 11, 12, 12, 12, 13] },
  { name: "Server errors", current: 4_920, abs: -480, pct: -9, kind: "good", spark: [7, 7, 6, 6, 6, 5, 5, 5] },
];

const RANGES = ["7d", "30d", "90d", "12m", "All"] as const;

// ---------- Helpers ----------

const fmt = (n: number) => new Intl.NumberFormat("en-US").format(n);
const fmtCompact = (n: number) =>
  new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 1 }).format(n);

const tooltipStyle = {
  background: "var(--popover)",
  border: "1px solid var(--border)",
  borderRadius: 8,
  fontSize: 12,
  padding: "8px 10px",
  boxShadow: "0 8px 24px -8px rgb(0 0 0 / 0.25)",
};

// ---------- Page ----------

function InventoryPage() {
  const { runId } = Route.useParams();
  const [range, setRange] = useState<(typeof RANGES)[number]>("90d");
  const [statusToggles, setStatusToggles] = useState({ s200: true, s3xx: true, s4xx: true, s5xx: true });

  const totalNon200 = useMemo(
    () => NON_200_DISTRIBUTION.reduce((s, x) => s + x.value, 0),
    [],
  );
  const totalStatus = useMemo(
    () => STATUS_DISTRIBUTION.reduce((s, x) => s + x.value, 0),
    [],
  );

  return (
    <div className="min-h-screen bg-background text-foreground">
      <DashboardNav />
      <div className="lg:pl-56">
        {/* Sticky header */}
        <header className="sticky top-0 z-30 border-b border-border bg-background/85 backdrop-blur-xl">
          <div className="space-y-4 px-6 py-5 lg:px-8">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
              <div className="flex items-start gap-3">
                <Button variant="ghost" size="icon" asChild aria-label="Back to audit run">
                  <Link to="/audit-runs/$runId" params={{ runId }}>
                    <ArrowLeft className="h-4 w-4" />
                  </Link>
                </Button>
                <div>
                  <nav aria-label="breadcrumb" className="flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
                    <Link to="/audit-runs" className="hover:text-foreground transition-colors">Audit Runs</Link>
                    <ChevronRight className="h-3 w-3" />
                    <span className="text-foreground">Inventory</span>
                  </nav>
                  <h1 className="mt-1.5 text-2xl font-bold tracking-tight">Inventory Overview</h1>
                  <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
                    Monitor crawl inventory health, status distribution, and technical changes across crawls.
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap items-end gap-2">
                <HeaderSelect label="Crawl" defaultValue="Latest crawl · Apr 26" options={["Latest crawl · Apr 26", "Apr 12 crawl", "Mar 29 crawl", "Mar 15 crawl"]} />
                <HeaderSelect label="Date range" defaultValue="Last 90 days" options={["Last 7 days", "Last 30 days", "Last 90 days", "Last 12 months", "All time"]} />
                <Button variant="outline">
                  <Download className="h-4 w-4" /> Export
                </Button>
                <Button>
                  <GitCompare className="h-4 w-4" /> Compare crawls
                </Button>
                <ThemeToggle />
              </div>
            </div>
          </div>
        </header>

        <main className="space-y-6 px-6 py-6 lg:px-8">
          {/* KPI row */}
          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <KpiAllUrls />
            <KpiScore />
            <KpiNon200 />
            <KpiDepth />
          </section>

          {/* Main chart */}
          <section className="rounded-xl border border-border bg-card p-5 shadow-sm">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                  Trend
                </p>
                <h2 className="mt-1 text-lg font-semibold tracking-tight">Inventory Score Over Time</h2>
                <p className="mt-0.5 text-sm text-muted-foreground">
                  Inventory health evolution across historical crawls.
                </p>
              </div>
              <div className="flex rounded-md border border-border bg-surface/50 p-0.5 shadow-inner">
                {RANGES.map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRange(r)}
                    className={cn(
                      "rounded-sm px-2.5 py-1 font-mono text-[11px] uppercase tracking-wider transition-colors",
                      range === r
                        ? "bg-primary/15 text-primary"
                        : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>
            <div className="mt-5 h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={SCORE_TREND} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="scoreFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.35} />
                      <stop offset="100%" stopColor="var(--primary)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="var(--border)" vertical={false} strokeDasharray="3 3" />
                  <XAxis dataKey="date" stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis yAxisId="score" stroke="var(--muted-foreground)" fontSize={11} domain={[0, 100]} tickLine={false} axisLine={false} />
                  <YAxis yAxisId="urls" orientation="right" stroke="var(--muted-foreground)" fontSize={11} tickFormatter={fmtCompact} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={tooltipStyle} formatter={(value: number, name) => name === "URLs" ? fmt(value) : value} />
                  <Legend wrapperStyle={{ fontSize: 12, paddingTop: 8 }} iconType="circle" />
                  <Bar yAxisId="urls" dataKey="urls" name="URLs" fill="var(--chart-3)" fillOpacity={0.25} radius={[3, 3, 0, 0]} barSize={18} />
                  <Area yAxisId="score" type="monotone" dataKey="score" name="Inventory score" stroke="var(--primary)" strokeWidth={2.5} fill="url(#scoreFill)" />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
            {/* Annotation strip */}
            <div className="mt-3 flex flex-wrap items-center gap-3 border-t border-border pt-3">
              <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                Crawl annotations
              </span>
              {ANNOTATIONS.map((a) => (
                <span
                  key={a.label}
                  className="inline-flex items-center gap-1.5 rounded-md border border-border bg-surface/50 px-2 py-1 text-[11px]"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                  <span className="font-mono text-muted-foreground">{a.date}</span>
                  <span className="text-foreground">{a.label}</span>
                </span>
              ))}
            </div>
          </section>

          {/* Errors + Top changes */}
          <section className="grid gap-4 xl:grid-cols-[1.4fr_1fr]">
            <InventoryErrors />
            <TopChanges />
          </section>

          {/* Inventory breakdown row */}
          <section className="grid gap-4 xl:grid-cols-2">
            <InventoryBreakdown total={totalStatus} />
            <StatusEvolution toggles={statusToggles} setToggles={setStatusToggles} />
          </section>

          {/* Non-200 analysis */}
          <section className="grid gap-4 xl:grid-cols-2">
            <Non200Distribution total={totalNon200} />
            <Non200Trend />
          </section>

          {/* Depth analysis */}
          <DepthAnalysis />
        </main>
      </div>
    </div>
  );
}

// ---------- Sub components ----------

function HeaderSelect({ label, defaultValue, options }: { label: string; defaultValue: string; options: string[] }) {
  return (
    <label className="space-y-1.5">
      <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">{label}</span>
      <select
        defaultValue={defaultValue}
        className="h-9 w-full min-w-[180px] rounded-md border border-input bg-background px-3 text-sm shadow-sm outline-none transition-colors focus:ring-1 focus:ring-ring"
      >
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </label>
  );
}

function KpiCard({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn(
      "group relative overflow-hidden rounded-xl border border-border bg-card p-5 shadow-sm transition-all hover:border-primary/30 hover:shadow-md",
      className,
    )}>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/[0.04] via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
      <div className="relative">{children}</div>
    </div>
  );
}

function TrendPill({ value, suffix = "%", invert = false }: { value: number; suffix?: string; invert?: boolean }) {
  const positive = invert ? value < 0 : value > 0;
  const negative = invert ? value > 0 : value < 0;
  const tone = positive ? "text-primary border-primary/25 bg-primary/10"
    : negative ? "text-destructive border-destructive/25 bg-destructive/10"
    : "text-muted-foreground border-border bg-surface/60";
  const Icon = value > 0 ? ArrowUpRight : value < 0 ? ArrowDownRight : Minus;
  return (
    <span className={cn("inline-flex items-center gap-1 rounded-md border px-1.5 py-0.5 font-mono text-[11px]", tone)}>
      <Icon className="h-3 w-3" />
      {value > 0 ? "+" : ""}{value}{suffix}
    </span>
  );
}

function KpiAllUrls() {
  return (
    <KpiCard>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">All URLs</p>
          <p className="mt-2 font-mono text-[28px] font-bold leading-none tracking-tight">7,436,341</p>
          <p className="mt-1.5 text-xs text-muted-foreground">URLs discovered in latest crawl</p>
        </div>
        <TrendPill value={2.4} />
      </div>
      <div className="mt-4 h-12">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={SPARKLINE_URLS}>
            <Line type="monotone" dataKey="v" stroke="var(--primary)" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </KpiCard>
  );
}

function KpiScore() {
  const score = 100;
  const radius = 26;
  const circumference = 2 * Math.PI * radius;
  const dash = (score / 100) * circumference;
  return (
    <KpiCard>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Inventory Score</p>
          <p className="mt-2 font-mono text-[28px] font-bold leading-none tracking-tight">
            {score}<span className="text-base text-muted-foreground"> / 100</span>
          </p>
          <div className="mt-1.5 flex items-center gap-2">
            <TrendPill value={2} />
            <span className="inline-flex items-center gap-1 rounded-md border border-primary/25 bg-primary/10 px-1.5 py-0.5 text-[11px] text-primary">
              <Sparkles className="h-3 w-3" /> Excellent
            </span>
          </div>
        </div>
        <div className="relative h-16 w-16">
          <svg viewBox="0 0 64 64" className="h-full w-full -rotate-90">
            <circle cx="32" cy="32" r={radius} stroke="var(--border)" strokeWidth="6" fill="none" />
            <circle
              cx="32" cy="32" r={radius}
              stroke="var(--primary)" strokeWidth="6" fill="none"
              strokeLinecap="round"
              strokeDasharray={`${dash} ${circumference}`}
            />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center font-mono text-xs font-semibold">{score}</span>
        </div>
      </div>
      <p className="mt-4 text-xs text-muted-foreground">Weighted inventory health score</p>
    </KpiCard>
  );
}

function KpiNon200() {
  const segs = [
    { label: "3xx", pct: 51, color: "var(--chart-3)" },
    { label: "4xx", pct: 35, color: "var(--chart-5)" },
    { label: "5xx", pct: 4, color: "var(--destructive)" },
    { label: "Blocked", pct: 10, color: "var(--muted-foreground)" },
  ];
  return (
    <KpiCard>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Non-200 URLs</p>
          <p className="mt-2 font-mono text-[28px] font-bold leading-none tracking-tight">234,112</p>
          <div className="mt-1.5 flex items-center gap-2">
            <TrendPill value={-12} invert />
            <span className="text-[11px] text-primary">Improving</span>
          </div>
        </div>
      </div>
      <p className="mt-3 text-xs text-muted-foreground">Pages returning redirects or errors</p>
      <div className="mt-3 flex h-2 overflow-hidden rounded-full">
        {segs.map((s) => (
          <div key={s.label} title={`${s.label} · ${s.pct}%`} style={{ width: `${s.pct}%`, background: s.color }} />
        ))}
      </div>
      <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1">
        {segs.map((s) => (
          <span key={s.label} className="inline-flex items-center gap-1.5 text-[10px] font-mono text-muted-foreground">
            <span className="h-1.5 w-1.5 rounded-full" style={{ background: s.color }} /> {s.label} {s.pct}%
          </span>
        ))}
      </div>
    </KpiCard>
  );
}

function KpiDepth() {
  return (
    <KpiCard>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Crawl Depth Health</p>
          <p className="mt-2 font-mono text-[28px] font-bold leading-none tracking-tight">4.1</p>
          <p className="mt-1.5 text-xs text-muted-foreground">Average click depth from homepage</p>
        </div>
        <TrendPill value={0.3} suffix="" />
      </div>
      <div className="mt-4 h-12">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={DEPTH_HISTO}>
            <Bar dataKey="c" fill="var(--primary)" radius={[2, 2, 0, 0]} />
            <XAxis dataKey="d" hide />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-1 flex justify-between font-mono text-[9px] text-muted-foreground">
        {DEPTH_HISTO.map((d) => <span key={d.d}>{d.d}</span>)}
      </div>
    </KpiCard>
  );
}

function InventoryErrors() {
  const sevStyle = (s: "critical" | "warning" | "notice") =>
    s === "critical"
      ? "border-destructive/30 bg-destructive/10 text-destructive"
      : s === "warning"
        ? "border-chart-4/40 bg-chart-4/10 text-chart-4"
        : "border-chart-3/30 bg-chart-3/10 text-chart-3";

  return (
    <div className="rounded-xl border border-border bg-card shadow-sm">
      <div className="flex items-start justify-between gap-3 border-b border-border px-5 py-4">
        <div>
          <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Operational</p>
          <h2 className="mt-1 flex items-center gap-2 text-lg font-semibold tracking-tight">
            <AlertTriangle className="h-4 w-4 text-destructive" />
            Inventory Errors
          </h2>
        </div>
        <span className="rounded-md border border-border bg-surface/50 px-2 py-1 font-mono text-[11px] text-muted-foreground">
          {ERRORS.length} active
        </span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-surface/30 text-left text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
              <th className="px-4 py-2.5 font-medium">Severity</th>
              <th className="px-4 py-2.5 font-medium">Issue type</th>
              <th className="px-4 py-2.5 font-medium text-right">Affected URLs</th>
              <th className="px-4 py-2.5 font-medium text-right">% of inventory</th>
              <th className="px-4 py-2.5 font-medium text-right">Trend</th>
              <th className="px-4 py-2.5 font-medium text-right">Impact</th>
              <th className="px-4 py-2.5 font-medium" />
            </tr>
          </thead>
          <tbody>
            {ERRORS.map((e) => (
              <tr key={e.type} className="group border-b border-border last:border-0 transition-colors hover:bg-surface/40">
                <td className="px-4 py-3">
                  <span className={cn("inline-flex items-center rounded-md border px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wider", sevStyle(e.severity))}>
                    {e.severity}
                  </span>
                </td>
                <td className="px-4 py-3 font-medium text-foreground">{e.type}</td>
                <td className="px-4 py-3 text-right font-mono tabular-nums">{fmt(e.urls)}</td>
                <td className="px-4 py-3 text-right font-mono tabular-nums text-muted-foreground">{e.pct.toFixed(1)}%</td>
                <td className="px-4 py-3 text-right">
                  <TrendPill value={e.trend} invert />
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-2">
                    <div className="h-1.5 w-16 overflow-hidden rounded-full bg-surface">
                      <div className="h-full rounded-full bg-gradient-to-r from-primary to-chart-3" style={{ width: `${e.impact}%` }} />
                    </div>
                    <span className="font-mono text-xs tabular-nums text-muted-foreground">{e.impact}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex justify-end gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                    <Button variant="ghost" size="sm" className="h-7 px-2 text-[11px]">View URLs</Button>
                    <Button variant="ghost" size="sm" className="h-7 px-2 text-[11px]">
                      Details <ChevronRight className="h-3 w-3" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function TopChanges() {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
      <div className="flex items-start justify-between gap-3 border-b border-border px-5 py-4">
        <div>
          <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Crawl-over-crawl</p>
          <h2 className="mt-1 text-lg font-semibold tracking-tight">Top Inventory Changes</h2>
        </div>
      </div>
      <ul className="divide-y divide-border">
        {TOP_CHANGES.map((c) => {
          const positive = c.kind === "good";
          const negative = c.kind === "bad";
          const tone = positive ? "text-primary" : negative ? "text-destructive" : "text-muted-foreground";
          const stroke = positive ? "var(--primary)" : negative ? "var(--destructive)" : "var(--muted-foreground)";
          const Icon = c.abs > 0 ? ArrowUpRight : c.abs < 0 ? ArrowDownRight : Minus;
          return (
            <li key={c.name} className="group flex items-center gap-3 px-5 py-3 transition-colors hover:bg-surface/40">
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-foreground">{c.name}</p>
                <p className="mt-0.5 font-mono text-[11px] text-muted-foreground">Current · {fmt(c.current)}</p>
              </div>
              <div className="hidden h-8 w-20 shrink-0 sm:block">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={c.spark.map((v, i) => ({ i, v }))}>
                    <Line type="monotone" dataKey="v" stroke={stroke} strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="w-20 shrink-0 text-right">
                <p className={cn("font-mono text-sm font-semibold tabular-nums", tone)}>
                  {c.abs > 0 ? "+" : ""}{fmtCompact(c.abs)}
                </p>
                <p className={cn("inline-flex items-center justify-end gap-0.5 font-mono text-[11px]", tone)}>
                  <Icon className="h-3 w-3" />{c.pct > 0 ? "+" : ""}{c.pct}%
                </p>
              </div>
              <span className={cn(
                "hidden shrink-0 rounded-md border px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wider md:inline-block",
                positive ? "border-primary/25 bg-primary/10 text-primary"
                  : negative ? "border-destructive/25 bg-destructive/10 text-destructive"
                  : "border-border bg-surface/60 text-muted-foreground",
              )}>
                {positive ? "Improved" : negative ? "Degraded" : "Neutral"}
              </span>
            </li>
          );
        })}
      </ul>
      <div className="border-t border-border px-5 py-3">
        <Button variant="outline" size="sm" className="w-full">
          See all crawl-to-crawl changes <ArrowRight className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
}

function InventoryBreakdown({ total }: { total: number }) {
  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Breakdown</p>
      <h2 className="mt-1 text-lg font-semibold tracking-tight">Inventory Breakdown</h2>
      <p className="mt-0.5 text-sm text-muted-foreground">Distribution by HTTP status and block category.</p>
      <div className="mt-4 grid items-center gap-4 sm:grid-cols-[1fr_1fr]">
        <div className="relative h-[240px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={STATUS_DISTRIBUTION} dataKey="value" innerRadius={62} outerRadius={92} paddingAngle={2} stroke="var(--card)" strokeWidth={2}>
                {STATUS_DISTRIBUTION.map((s) => <Cell key={s.name} fill={s.color} />)}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => fmt(v)} />
            </PieChart>
          </ResponsiveContainer>
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Total</span>
            <span className="font-mono text-xl font-bold">{fmtCompact(total)}</span>
          </div>
        </div>
        <ul className="space-y-1.5">
          {STATUS_DISTRIBUTION.map((s) => {
            const pct = (s.value / total) * 100;
            return (
              <li key={s.name} className="group flex items-center gap-3 rounded-md px-2 py-1.5 transition-colors hover:bg-surface/40">
                <span className="h-2.5 w-2.5 rounded-sm" style={{ background: s.color }} />
                <span className="flex-1 text-sm">{s.name}</span>
                <span className="font-mono text-xs tabular-nums text-muted-foreground">{fmtCompact(s.value)}</span>
                <span className="w-12 text-right font-mono text-xs tabular-nums text-foreground">{pct.toFixed(1)}%</span>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

function StatusEvolution({
  toggles,
  setToggles,
}: {
  toggles: { s200: boolean; s3xx: boolean; s4xx: boolean; s5xx: boolean };
  setToggles: React.Dispatch<React.SetStateAction<{ s200: boolean; s3xx: boolean; s4xx: boolean; s5xx: boolean }>>;
}) {
  const series: Array<{ key: keyof typeof toggles; label: string; color: string }> = [
    { key: "s200", label: "200", color: "var(--primary)" },
    { key: "s3xx", label: "3xx", color: "var(--chart-3)" },
    { key: "s4xx", label: "4xx", color: "var(--chart-5)" },
    { key: "s5xx", label: "5xx", color: "var(--destructive)" },
  ];
  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Evolution</p>
          <h2 className="mt-1 text-lg font-semibold tracking-tight">Status Code Evolution</h2>
          <p className="mt-0.5 text-sm text-muted-foreground">Technical health trend across the last crawls.</p>
        </div>
        <div className="flex flex-wrap gap-1">
          {series.map((s) => (
            <button
              key={s.key}
              type="button"
              onClick={() => setToggles((t) => ({ ...t, [s.key]: !t[s.key] }))}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-md border px-2 py-1 font-mono text-[10px] uppercase tracking-wider transition-colors",
                toggles[s.key]
                  ? "border-border bg-surface/60 text-foreground"
                  : "border-border/60 bg-transparent text-muted-foreground/60 line-through",
              )}
            >
              <span className="h-1.5 w-1.5 rounded-full" style={{ background: s.color }} />
              {s.label}
            </button>
          ))}
        </div>
      </div>
      <div className="mt-4 h-[260px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={STATUS_EVOLUTION} margin={{ top: 10, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid stroke="var(--border)" vertical={false} strokeDasharray="3 3" />
            <XAxis dataKey="d" stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
            <YAxis stroke="var(--muted-foreground)" fontSize={11} tickFormatter={fmtCompact} tickLine={false} axisLine={false} />
            <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => fmt(v)} />
            {toggles.s200 && <Line type="monotone" dataKey="s200" name="200" stroke="var(--primary)" strokeWidth={2} dot={false} />}
            {toggles.s3xx && <Line type="monotone" dataKey="s3xx" name="3xx" stroke="var(--chart-3)" strokeWidth={2} dot={false} />}
            {toggles.s4xx && <Line type="monotone" dataKey="s4xx" name="4xx" stroke="var(--chart-5)" strokeWidth={2} dot={false} />}
            {toggles.s5xx && <Line type="monotone" dataKey="s5xx" name="5xx" stroke="var(--destructive)" strokeWidth={2} dot={false} />}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function Non200Distribution({ total }: { total: number }) {
  const largest = NON_200_DISTRIBUTION.reduce((a, b) => (b.value > a.value ? b : a));
  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Non-200</p>
      <h2 className="mt-1 text-lg font-semibold tracking-tight">Non-200 Pages Distribution</h2>
      <p className="mt-0.5 text-sm text-muted-foreground">Where problematic pages concentrate.</p>
      <div className="mt-4 grid items-center gap-4 sm:grid-cols-[1fr_1fr]">
        <div className="relative h-[220px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={NON_200_DISTRIBUTION} dataKey="value" innerRadius={56} outerRadius={86} paddingAngle={3} stroke="var(--card)" strokeWidth={2}>
                {NON_200_DISTRIBUTION.map((s) => <Cell key={s.name} fill={s.color} />)}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => fmt(v)} />
            </PieChart>
          </ResponsiveContainer>
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Affected</span>
            <span className="font-mono text-xl font-bold">{fmtCompact(total)}</span>
          </div>
        </div>
        <div className="space-y-3">
          <div className="rounded-lg border border-border bg-surface/40 p-3">
            <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Largest segment</p>
            <p className="mt-1 text-sm font-semibold">{largest.name}</p>
            <p className="mt-0.5 font-mono text-xs text-muted-foreground">{fmt(largest.value)} URLs · {((largest.value / total) * 100).toFixed(1)}%</p>
          </div>
          <div className="rounded-lg border border-border bg-surface/40 p-3">
            <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Trend vs previous</p>
            <div className="mt-1 flex items-center gap-2"><TrendPill value={-12} invert /><span className="text-xs text-muted-foreground">vs Apr 12 crawl</span></div>
          </div>
          <ul className="space-y-1">
            {NON_200_DISTRIBUTION.map((s) => (
              <li key={s.name} className="flex items-center gap-2 text-xs">
                <span className="h-2 w-2 rounded-sm" style={{ background: s.color }} />
                <span className="flex-1">{s.name}</span>
                <span className="font-mono tabular-nums text-muted-foreground">{fmtCompact(s.value)}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

function Non200Trend() {
  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Non-200 trend</p>
          <h2 className="mt-1 text-lg font-semibold tracking-tight">Non-200 Trend</h2>
          <p className="mt-0.5 text-sm text-muted-foreground">Evolution of problematic responses over time.</p>
        </div>
        <HeaderSelect label="Granularity" defaultValue="Weekly" options={["Daily", "Weekly", "Monthly"]} />
      </div>
      <div className="mt-4 h-[260px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={NON_200_TREND} margin={{ top: 10, right: 8, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="redirFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="var(--chart-3)" stopOpacity={0.35}/><stop offset="100%" stopColor="var(--chart-3)" stopOpacity={0}/></linearGradient>
              <linearGradient id="brokenFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="var(--chart-5)" stopOpacity={0.35}/><stop offset="100%" stopColor="var(--chart-5)" stopOpacity={0}/></linearGradient>
              <linearGradient id="serverFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="var(--destructive)" stopOpacity={0.35}/><stop offset="100%" stopColor="var(--destructive)" stopOpacity={0}/></linearGradient>
              <linearGradient id="timeoutFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="var(--chart-4)" stopOpacity={0.35}/><stop offset="100%" stopColor="var(--chart-4)" stopOpacity={0}/></linearGradient>
            </defs>
            <CartesianGrid stroke="var(--border)" vertical={false} strokeDasharray="3 3" />
            <XAxis dataKey="d" stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
            <YAxis stroke="var(--muted-foreground)" fontSize={11} tickFormatter={fmtCompact} tickLine={false} axisLine={false} />
            <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => fmt(v)} />
            <Legend wrapperStyle={{ fontSize: 12 }} iconType="circle" />
            <Area type="monotone" dataKey="redirects" name="Redirects" stroke="var(--chart-3)" fill="url(#redirFill)" strokeWidth={2} />
            <Area type="monotone" dataKey="broken" name="404 pages" stroke="var(--chart-5)" fill="url(#brokenFill)" strokeWidth={2} />
            <Area type="monotone" dataKey="server" name="5xx pages" stroke="var(--destructive)" fill="url(#serverFill)" strokeWidth={2} />
            <Area type="monotone" dataKey="timeout" name="Timeouts" stroke="var(--chart-4)" fill="url(#timeoutFill)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-2 flex items-center gap-2 rounded-md border border-chart-4/30 bg-chart-4/10 px-3 py-2 text-xs text-foreground">
        <Info className="h-3.5 w-3.5 text-chart-4" />
        Alert: redirect spike detected around Mar 1 — review faceted nav rollout.
      </div>
    </div>
  );
}

function DepthAnalysis() {
  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Depth analysis</p>
          <h2 className="mt-1 text-lg font-semibold tracking-tight">HTTP Status by Crawl Depth</h2>
          <p className="mt-0.5 text-sm text-muted-foreground">Identify where crawl problems concentrate in your site architecture.</p>
        </div>
        <div className="flex flex-wrap gap-3 text-[11px]">
          <LegendDot color="var(--primary)" label="200" />
          <LegendDot color="var(--chart-3)" label="3xx" />
          <LegendDot color="var(--chart-5)" label="4xx" />
          <LegendDot color="var(--destructive)" label="5xx" />
        </div>
      </div>
      <div className="mt-5 h-[360px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={DEPTH_STACK} layout="vertical" margin={{ top: 5, right: 24, left: 0, bottom: 0 }}>
            <CartesianGrid stroke="var(--border)" horizontal={false} strokeDasharray="3 3" />
            <XAxis type="number" stroke="var(--muted-foreground)" fontSize={11} tickFormatter={fmtCompact} tickLine={false} axisLine={false} />
            <YAxis type="category" dataKey="depth" stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} width={90} />
            <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => fmt(v)} />
            <Bar dataKey="s200" stackId="a" name="200" fill="var(--primary)" radius={[0, 0, 0, 0]} />
            <Bar dataKey="s3xx" stackId="a" name="3xx" fill="var(--chart-3)" />
            <Bar dataKey="s4xx" stackId="a" name="4xx" fill="var(--chart-5)" />
            <Bar dataKey="s5xx" stackId="a" name="5xx" fill="var(--destructive)" radius={[0, 3, 3, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 font-mono uppercase tracking-wider text-muted-foreground">
      <span className="h-2 w-2 rounded-sm" style={{ background: color }} />
      {label}
    </span>
  );
}
