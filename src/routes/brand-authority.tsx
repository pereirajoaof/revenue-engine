import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ArrowDownRight, ArrowUpRight, Calendar, ChevronDown, CircleDot, ShieldCheck, Sparkles, TrendingUp } from "lucide-react";
import { Line, LineChart, ReferenceDot, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { DashboardNav } from "@/components/dashboard/DashboardNav";
import { ThemeToggle } from "@/components/ThemeToggle";

export const Route = createFileRoute("/brand-authority")({
  component: BrandAuthorityPage,
  head: () => ({
    meta: [
      { title: "Brand Authority — OrganicOS" },
      {
        name: "description",
        content: "Measure brand authority as an evolving growth asset across brand, domain, and content signals.",
      },
      { property: "og:title", content: "Brand Authority — OrganicOS" },
      {
        property: "og:description",
        content: "A financial intelligence layer for tracking whether brand strength is improving or weakening.",
      },
    ],
  }),
});

const RANGES = ["7d", "30d", "90d", "12m"] as const;
const PAGE_TYPES = ["All page types", "Routes", "Stops", "City", "Operator", "Blog"];
const MARKETS = ["All markets", "United Kingdom", "Ireland", "Germany"];

type Range = (typeof RANGES)[number];
type AuthorityMetric = {
  label: string;
  score: number;
  delta: number;
  status: "Strong" | "Moderate" | "Weak";
  trend: number[];
  driver: string;
};

const AUTHORITY_TREND = [
  { week: "W1", score: 62 },
  { week: "W2", score: 64 },
  { week: "W3", score: 63 },
  { week: "W4", score: 67, marker: "Brand demand shift" },
  { week: "W5", score: 69 },
  { week: "W6", score: 71 },
  { week: "W7", score: 70 },
  { week: "W8", score: 74, marker: "Indexation lift" },
  { week: "W9", score: 76 },
  { week: "W10", score: 78 },
  { week: "W11", score: 77 },
  { week: "W12", score: 79 },
];

const AUTHORITY_METRICS: AuthorityMetric[] = [
  { label: "Brand Love", score: 82, delta: 6.4, status: "Strong", trend: [69, 70, 72, 73, 75, 76, 78, 79, 80, 81, 80, 82], driver: "Repeat branded clicks and direct demand" },
  { label: "Brand Recognition", score: 76, delta: 4.8, status: "Strong", trend: [61, 62, 64, 65, 67, 69, 70, 72, 73, 74, 75, 76], driver: "Search recall and SERP selection" },
  { label: "Domain Age", score: 91, delta: 0.2, status: "Strong", trend: [90, 90, 90, 90, 91, 91, 91, 91, 91, 91, 91, 91], driver: "Long-lived domain trust" },
  { label: "Indexation", score: 68, delta: 8.1, status: "Moderate", trend: [52, 53, 55, 56, 58, 59, 61, 64, 65, 66, 67, 68], driver: "More strategic pages discovered" },
  { label: "Site Quality", score: 73, delta: 3.2, status: "Moderate", trend: [65, 66, 67, 68, 70, 69, 70, 71, 72, 73, 72, 73], driver: "Technical quality and trust consistency" },
  { label: "Site Focus", score: 64, delta: -2.6, status: "Moderate", trend: [72, 71, 70, 69, 68, 67, 67, 66, 65, 65, 64, 64], driver: "Topic concentration weakened" },
  { label: "Page Age", score: 58, delta: -4.1, status: "Weak", trend: [68, 67, 66, 65, 63, 62, 61, 60, 59, 59, 58, 58], driver: "Freshness decay on older templates" },
];

const RANGE_MULTIPLIER: Record<Range, number> = { "7d": 0.42, "30d": 0.7, "90d": 1, "12m": 1.18 };

function BrandAuthorityPage() {
  const [range, setRange] = useState<Range>("90d");
  const [pageType, setPageType] = useState(PAGE_TYPES[0]);
  const [market, setMarket] = useState(MARKETS[0]);

  const filtered = useMemo(() => buildAuthorityView(range, pageType, market), [range, pageType, market]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <DashboardNav />
      <div className="lg:pl-56">
        <BrandAuthorityHeader range={range} pageType={pageType} market={market} onRange={setRange} onPageType={setPageType} onMarket={setMarket} />
        <main className="px-6 lg:px-8 py-6 space-y-6">
          <AuthorityHero data={filtered.trend} score={filtered.score} delta={filtered.delta} confidence={filtered.confidence} />
          <AuthorityCards metrics={filtered.metrics} />
          <DriversOfChange drivers={filtered.drivers} />
        </main>
      </div>
    </div>
  );
}

function BrandAuthorityHeader({ range, pageType, market, onRange, onPageType, onMarket }: { range: Range; pageType: string; market: string; onRange: (range: Range) => void; onPageType: (pageType: string) => void; onMarket: (market: string) => void }) {
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur">
      <div className="px-6 lg:px-8 py-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Growth driver · Brand</p>
          <h1 className="mt-0.5 text-2xl font-bold tracking-tight">Brand Authority</h1>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center rounded-md border border-border bg-surface p-0.5">
            <Calendar className="w-3.5 h-3.5 text-muted-foreground ml-2" />
            {RANGES.map((item) => (
              <button key={item} type="button" onClick={() => onRange(item)} className={`px-3 py-1.5 text-xs font-mono rounded-sm transition-colors ${range === item ? "bg-card text-foreground" : "text-muted-foreground hover:text-foreground"}`}>
                {item === "7d" ? "Last 7d" : item === "30d" ? "Last 30d" : item === "90d" ? "Last 90d" : "Last 12m"}
              </button>
            ))}
          </div>
          <FilterMenu label="Page Type" value={pageType} options={PAGE_TYPES} onChange={onPageType} />
          <FilterMenu label="Market" value={market} options={MARKETS} onChange={onMarket} />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}

function FilterMenu({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (value: string) => void }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button type="button" onClick={() => setOpen((v) => !v)} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md border border-border bg-surface text-xs hover:bg-card transition-colors">
        <span className="text-muted-foreground font-mono">{label}:</span>
        <span>{value}</span>
        <ChevronDown className="w-3 h-3 text-muted-foreground" />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 z-20 mt-1 min-w-[190px] rounded-md border border-border bg-popover p-1 shadow-lg">
            {options.map((option) => (
              <button key={option} type="button" onClick={() => { onChange(option); setOpen(false); }} className={`w-full rounded px-2.5 py-1.5 text-left text-xs transition-colors ${option === value ? "bg-primary/10 text-primary" : "hover:bg-surface"}`}>
                {option}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function AuthorityHero({ data, score, delta, confidence }: { data: typeof AUTHORITY_TREND; score: number; delta: number; confidence: number }) {
  return (
    <section className="rounded-xl border border-border bg-card p-6 shadow-sm">
      <div className="grid gap-6 xl:grid-cols-[360px_minmax(0,1fr)]">
        <div className="flex flex-col justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 rounded-md border border-primary/20 bg-primary/10 px-2.5 py-1 text-[10px] font-mono uppercase tracking-wider text-primary">
              <Sparkles className="w-3.5 h-3.5" /> Authority index
            </div>
            <p className="mt-5 text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Brand Authority Score</p>
            <div className="mt-2 flex items-end gap-3">
              <span className="font-mono text-7xl font-bold leading-none tabular-nums">{score}</span>
              <span className="mb-2 font-mono text-xl text-muted-foreground">/100</span>
            </div>
            <p className="mt-4 max-w-sm text-sm text-muted-foreground">Composite authority strength across brand, domain, and content signals.</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-lg border border-border bg-surface/45 p-3">
              <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Vs previous</p>
              <p className="mt-1 flex items-center gap-1 font-mono text-lg font-bold text-primary tabular-nums"><ArrowUpRight className="w-4 h-4" />+{delta}%</p>
            </div>
            <div className="rounded-lg border border-border bg-surface/45 p-3">
              <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Confidence</p>
              <p className="mt-1 font-mono text-lg font-bold tabular-nums">{confidence}%</p>
            </div>
          </div>
        </div>
        <div className="min-h-[330px] rounded-lg border border-border bg-background/45 p-4">
          <div className="mb-3 flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold">Score evolution</p>
              <p className="text-xs text-muted-foreground">Weekly authority trajectory with inflection points.</p>
            </div>
            <TrendingUp className="w-4 h-4 text-primary" />
          </div>
          <ResponsiveContainer width="100%" height={270}>
            <LineChart data={data} margin={{ top: 18, right: 20, bottom: 4, left: 0 }}>
              <XAxis dataKey="week" axisLine={false} tickLine={false} tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} />
              <YAxis domain={[40, 100]} axisLine={false} tickLine={false} tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} width={34} />
              <Tooltip content={<AuthorityTooltip />} cursor={{ stroke: "var(--border)", strokeDasharray: "3 3" }} />
              <Line type="monotone" dataKey="score" stroke="var(--chart-1)" strokeWidth={3} dot={false} activeDot={{ r: 5, fill: "var(--primary)", stroke: "var(--background)", strokeWidth: 2 }} />
              {data.filter((point) => point.marker).map((point) => (
                <ReferenceDot key={point.week} x={point.week} y={point.score} r={4} fill="var(--chart-1)" stroke="var(--background)" strokeWidth={2} />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </section>
  );
}

function AuthorityCards({ metrics }: { metrics: AuthorityMetric[] }) {
  return (
    <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
      {metrics.map((metric) => (
        <button key={metric.label} type="button" aria-label={`Open ${metric.label} detail page`} className="group rounded-xl border border-border bg-card p-4 text-left shadow-sm transition-colors hover:border-primary/40 hover:bg-surface/40 focus:outline-none focus:ring-2 focus:ring-ring">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">{metric.label}</p>
              <p className="mt-2 font-mono text-3xl font-bold tabular-nums">{metric.score}<span className="text-sm text-muted-foreground">/100</span></p>
            </div>
            <StatusPill status={metric.status} />
          </div>
          <div className={`mt-3 inline-flex items-center gap-1 text-[11px] font-mono ${metric.delta >= 0 ? "text-primary" : "text-destructive"}`}>
            {metric.delta >= 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
            {metric.delta > 0 ? "+" : ""}{metric.delta}% vs previous
          </div>
          <div className="mt-4 h-16">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={metric.trend.map((value, index) => ({ index, value }))} margin={{ top: 4, right: 2, bottom: 4, left: 2 }}>
                <Tooltip content={<SparklineTooltip />} cursor={{ stroke: "var(--border)", strokeDasharray: "2 2" }} />
                <Line type="monotone" dataKey="value" stroke={metric.delta >= 0 ? "var(--chart-1)" : "var(--chart-5)"} strokeWidth={2} dot={false} activeDot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <p className="mt-3 line-clamp-2 text-xs text-muted-foreground">{metric.driver}</p>
        </button>
      ))}
    </section>
  );
}

function DriversOfChange({ drivers }: { drivers: readonly { label: string; value: string; direction: "up" | "down"; note: string }[] }) {
  return (
    <section className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Drivers of change</p>
          <h2 className="mt-1 text-lg font-semibold">What moved authority this period</h2>
        </div>
        <ShieldCheck className="w-5 h-5 text-primary" />
      </div>
      <div className="grid gap-3 md:grid-cols-3">
        {drivers.map((driver) => (
          <div key={driver.label} className="rounded-lg border border-border bg-surface/40 p-4">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-medium">{driver.label}</p>
              <span className={`inline-flex items-center gap-1 font-mono text-xs ${driver.direction === "up" ? "text-primary" : "text-destructive"}`}>
                {driver.direction === "up" ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {driver.value}
              </span>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">{driver.note}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function StatusPill({ status }: { status: AuthorityMetric["status"] }) {
  const className = status === "Strong" ? "border-primary/20 bg-primary/10 text-primary" : status === "Weak" ? "border-destructive/20 bg-destructive/10 text-destructive" : "border-border bg-surface text-muted-foreground";
  return <span className={`inline-flex items-center gap-1 rounded-md border px-2 py-1 text-[10px] font-mono uppercase tracking-wider ${className}`}><CircleDot className="w-3 h-3" />{status}</span>;
}

function AuthorityTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ value?: number; payload?: { marker?: string } }>; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-md border border-border bg-popover px-3 py-2 text-xs shadow-md">
      <p className="font-mono text-muted-foreground">{label}</p>
      <p className="mt-1 font-mono font-bold text-foreground">Authority {payload[0].value}/100</p>
      {payload[0].payload?.marker && <p className="mt-1 text-primary">{payload[0].payload.marker}</p>}
    </div>
  );
}

function SparklineTooltip({ active, payload }: { active?: boolean; payload?: Array<{ value?: number }> }) {
  if (!active || !payload?.length) return null;
  return <div className="rounded-md border border-border bg-popover px-2 py-1 font-mono text-xs shadow-md">{payload[0].value}/100</div>;
}

function buildAuthorityView(range: Range, pageType: string, market: string) {
  const pageShift = pageType === "All page types" ? 0 : (pageType.length % 5) - 2;
  const marketShift = market === "All markets" ? 0 : (market.length % 4) - 1;
  const multiplier = RANGE_MULTIPLIER[range];
  const scoreShift = Math.round((pageShift + marketShift) * 1.5);
  const score = clamp(79 + scoreShift, 0, 100);
  const delta = Number((7.8 * multiplier + pageShift * 0.4).toFixed(1));
  const confidence = clamp(Math.round(86 + marketShift * 2 - (range === "7d" ? 8 : 0)), 0, 99);
  const metrics = AUTHORITY_METRICS.map((metric, index) => {
    const adjustedScore = clamp(metric.score + pageShift + marketShift + (index % 2), 0, 100);
    const adjustedDelta = Number((metric.delta * multiplier + pageShift * 0.25).toFixed(1));
    return {
      ...metric,
      score: adjustedScore,
      delta: adjustedDelta,
      status: adjustedScore >= 75 ? "Strong" : adjustedScore < 60 ? "Weak" : "Moderate",
      trend: metric.trend.map((point, trendIndex) => clamp(Math.round(point + pageShift + marketShift + trendIndex * (multiplier - 1) * 0.45), 0, 100)),
    } satisfies AuthorityMetric;
  });
  return {
    score,
    delta,
    confidence,
    trend: AUTHORITY_TREND.map((point, index) => ({ ...point, score: clamp(Math.round(point.score + scoreShift + index * (multiplier - 1) * 0.7), 0, 100) })),
    metrics,
    drivers: [
      { label: "Brand searches", value: `+${Math.round(12 * multiplier)}%`, direction: "up", note: "Demand for named queries increased versus the previous comparable period." },
      { label: "Indexed pages", value: `+${Math.round(8 * multiplier)}%`, direction: "up", note: "More commercially relevant URLs are eligible to contribute authority." },
      { label: "Content freshness", value: `-${Math.max(2, Math.round(5 / multiplier))}%`, direction: "down", note: "Older page groups are losing contribution weight and need refresh priority." },
    ] as const,
  };
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}