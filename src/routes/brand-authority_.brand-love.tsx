import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ReferenceDot,
  ResponsiveContainer,
  Tooltip as ChartTooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  ArrowDownRight,
  ArrowUpRight,
  Calendar,
  ChevronRight,
  Download,
  Heart,
  Megaphone,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";
import { DashboardNav } from "@/components/dashboard/DashboardNav";
import { ThemeToggle } from "@/components/ThemeToggle";

export const Route = createFileRoute("/brand-authority_/brand-love")({
  component: BrandLovePage,
  head: () => ({
    meta: [
      { title: "Brand Love — Brand Authority" },
      {
        name: "description",
        content:
          "Measure how your brand grows in awareness, recall, trust, and authority across the web.",
      },
      { property: "og:title", content: "Brand Love — Brand Authority" },
      {
        property: "og:description",
        content:
          "Executive-grade analytics for brand perception: demand, direct traffic, mentions, authority, and competitor benchmarks.",
      },
    ],
  }),
});

const RANGES = ["30d", "90d", "12m", "YTD"] as const;
type Range = (typeof RANGES)[number];

const COMPETITORS = ["Acme (You)", "Northwind", "Globex", "Initech"] as const;

const BRAND_LOVE_TREND = [
  { period: "Jul", score: 64 },
  { period: "Aug", score: 66 },
  { period: "Sep", score: 67, marker: "PR campaign" },
  { period: "Oct", score: 70 },
  { period: "Nov", score: 71 },
  { period: "Dec", score: 73 },
  { period: "Jan", score: 74 },
  { period: "Feb", score: 75, marker: "Reddit thread spike" },
  { period: "Mar", score: 76 },
  { period: "Apr", score: 77 },
  { period: "May", score: 78 },
];

const KPIS = [
  { label: "Brand Search Volume", value: "184.2K", delta: 12.4, suffix: "/mo" },
  { label: "Direct Traffic", value: "1.21M", delta: 8.6, suffix: "sess" },
  { label: "Referring Domains", value: "9,842", delta: 5.1, suffix: "" },
  { label: "Brand Mentions", value: "27,318", delta: 18.9, suffix: "" },
  { label: "Share of Search", value: "34.6%", delta: 4.2, suffix: "" },
  { label: "Brand Momentum", value: "B+", delta: 2.0, suffix: "" },
];

const DEMAND_TREND = [
  { m: "Jul", you: 142, c1: 188, c2: 121, c3: 96 },
  { m: "Aug", you: 148, c1: 190, c2: 119, c3: 98 },
  { m: "Sep", you: 156, c1: 192, c2: 122, c3: 101 },
  { m: "Oct", you: 162, c1: 195, c2: 120, c3: 104 },
  { m: "Nov", you: 168, c1: 197, c2: 124, c3: 102 },
  { m: "Dec", you: 172, c1: 199, c2: 126, c3: 105 },
  { m: "Jan", you: 176, c1: 201, c2: 128, c3: 107 },
  { m: "Feb", you: 178, c1: 202, c2: 129, c3: 108 },
  { m: "Mar", you: 181, c1: 204, c2: 131, c3: 110 },
  { m: "Apr", you: 183, c1: 205, c2: 132, c3: 111 },
  { m: "May", you: 184, c1: 206, c2: 133, c3: 112 },
];

const SHARE_OF_SEARCH = DEMAND_TREND.map((d) => ({
  m: d.m,
  You: Math.round((d.you / (d.you + d.c1 + d.c2 + d.c3)) * 100),
  Northwind: Math.round((d.c1 / (d.you + d.c1 + d.c2 + d.c3)) * 100),
  Globex: Math.round((d.c2 / (d.you + d.c1 + d.c2 + d.c3)) * 100),
  Initech: Math.round((d.c3 / (d.you + d.c1 + d.c2 + d.c3)) * 100),
}));

const FAST_QUERIES = [
  { q: "acme reviews", growth: 44, intent: "Evaluation", opp: "High" },
  { q: "acme alternatives", growth: 31, intent: "Consideration", opp: "Medium" },
  { q: "acme vs northwind", growth: 28, intent: "Comparison", opp: "High" },
  { q: "is acme worth it", growth: 22, intent: "Trust", opp: "High" },
  { q: "acme pricing", growth: 19, intent: "Commercial", opp: "Medium" },
  { q: "acme login", growth: 14, intent: "Branded", opp: "Low" },
];

const DIRECT_TRAFFIC = [
  { m: "Jul", direct: 91, returning: 62, branded: 142 },
  { m: "Aug", direct: 95, returning: 65, branded: 148 },
  { m: "Sep", direct: 98, returning: 68, branded: 156 },
  { m: "Oct", direct: 104, returning: 72, branded: 162 },
  { m: "Nov", direct: 108, returning: 74, branded: 168 },
  { m: "Dec", direct: 112, returning: 78, branded: 172 },
  { m: "Jan", direct: 115, returning: 80, branded: 176 },
  { m: "Feb", direct: 118, returning: 82, branded: 178 },
  { m: "Mar", direct: 121, returning: 84, branded: 181 },
];

const REFERRING_TREND = [
  { m: "Jul", v: 8420 },
  { m: "Aug", v: 8590 },
  { m: "Sep", v: 8780 },
  { m: "Oct", v: 8960 },
  { m: "Nov", v: 9120 },
  { m: "Dec", v: 9320 },
  { m: "Jan", v: 9510 },
  { m: "Feb", v: 9640 },
  { m: "Mar", v: 9740 },
  { m: "Apr", v: 9810 },
  { m: "May", v: 9842 },
];

const MENTIONS_BY_SOURCE = [
  { source: "News", value: 6420 },
  { source: "Reddit", value: 5810 },
  { source: "YouTube", value: 4720 },
  { source: "Forums", value: 3940 },
  { source: "Social", value: 3360 },
  { source: "Blogs", value: 3068 },
];

const DR_BUCKETS = [
  { bucket: "DR 70+", value: 412, tone: "primary" },
  { bucket: "DR 50–69", value: 1840, tone: "primary" },
  { bucket: "DR 30–49", value: 3920, tone: "muted" },
  { bucket: "DR 0–29", value: 3670, tone: "muted" },
];

const RADAR = [
  { axis: "Awareness", you: 78, avg: 64, leader: 82 },
  { axis: "Trust", you: 72, avg: 60, leader: 80 },
  { axis: "Recall", you: 80, avg: 62, leader: 84 },
  { axis: "Authority", you: 74, avg: 65, leader: 86 },
  { axis: "Engagement", you: 70, avg: 58, leader: 76 },
  { axis: "Momentum", you: 82, avg: 60, leader: 78 },
];

const BENCH = [
  { metric: "Brand Search Volume", you: "184K", avg: "121K", leader: "206K" },
  { metric: "Share of Search", you: "34.6%", avg: "22.1%", leader: "38.4%" },
  { metric: "Referring Domains", you: "9,842", avg: "6,210", leader: "12,440" },
  { metric: "Direct Traffic Share", you: "41%", avg: "28%", leader: "47%" },
  { metric: "Branded CTR", you: "8.2%", avg: "6.1%", leader: "9.0%" },
  { metric: "Sentiment (NPS)", you: "+38", avg: "+18", leader: "+52" },
];

const INSIGHTS = [
  {
    title: "Brand demand grew 28% YoY in Germany",
    impact: "High",
    confidence: 92,
    priority: "P1",
    body: "DE-region branded searches outpaced global average by 14pts. Localized authority pages are converting above benchmark.",
  },
  {
    title: "Referring domain growth slowed for 3 consecutive months",
    impact: "Medium",
    confidence: 87,
    priority: "P2",
    body: "Net new RDs decelerated from +220/mo to +84/mo. Digital PR cadence dropped post Q1 launch.",
  },
  {
    title: "Searches containing ‘reviews’ increased 44%",
    impact: "High",
    confidence: 95,
    priority: "P1",
    body: "Trust-stage demand is rising. Trustpilot, G2 and Reddit visibility now drive 31% of branded SERPs.",
  },
  {
    title: "Northwind gained 12% share of search",
    impact: "High",
    confidence: 89,
    priority: "P1",
    body: "Competitor share gain coincides with their Q2 brand campaign and partnership announcements.",
  },
];

const ACTIONS = [
  { title: "Launch digital PR campaign", impact: "+6.4 BLS", effort: "Medium", confidence: 88 },
  { title: "Improve Trustpilot visibility", impact: "+3.1 BLS", effort: "Low", confidence: 92 },
  { title: "Increase branded video content", impact: "+4.8 BLS", effort: "High", confidence: 80 },
  { title: "Expand Reddit / community presence", impact: "+2.6 BLS", effort: "Low", confidence: 85 },
];

const TIMELINE = [
  { d: "2024-07", v: 64 },
  { d: "2024-08", v: 66, e: "PR — Series B" },
  { d: "2024-09", v: 67 },
  { d: "2024-10", v: 70, e: "Algorithm update" },
  { d: "2024-11", v: 71 },
  { d: "2024-12", v: 73, e: "Brand campaign" },
  { d: "2025-01", v: 74 },
  { d: "2025-02", v: 75, e: "Reddit AMA" },
  { d: "2025-03", v: 76 },
  { d: "2025-04", v: 77 },
  { d: "2025-05", v: 78, e: "Product launch" },
];

function BrandLovePage() {
  const [range, setRange] = useState<Range>("12m");
  const [demandGrain, setDemandGrain] = useState<"M" | "Q" | "Y">("M");

  return (
    <div className="min-h-screen bg-background text-foreground">
      <DashboardNav />
      <div className="lg:pl-56">
        <Header range={range} onRange={setRange} />
        <main className="mx-auto max-w-[1400px] space-y-10 px-6 py-8 lg:px-10">
          <Section delay={0}>
            <Hero />
            <KpiGrid />
          </Section>

          <Section delay={0.05}>
            <SectionHeading
              eyebrow="01 — Brand Demand"
              title="Search demand & share of voice"
              caption="How attention to your brand is changing relative to the market."
            />
            <div className="grid gap-4 lg:grid-cols-2">
              <DemandChart grain={demandGrain} onGrain={setDemandGrain} />
              <ShareChart />
            </div>
            <FastQueriesTable />
          </Section>

          <Section delay={0.1}>
            <SectionHeading
              eyebrow="02 — Direct Traffic Intelligence"
              title="Loyalty, recall and dark social"
              caption="Returning audiences and unattributed visits as proxies for brand strength."
            />
            <DirectTrafficCard />
          </Section>

          <Section delay={0.1}>
            <SectionHeading
              eyebrow="03 — Authority & Mentions"
              title="Earned distribution and link equity"
              caption="Quality and source mix of brand mentions across the open web."
            />
            <div className="grid gap-4 lg:grid-cols-2">
              <ReferringDomainsCard />
              <MentionsBySource />
            </div>
            <DrBuckets />
          </Section>

          <Section delay={0.1}>
            <SectionHeading
              eyebrow="04 — Competitive Benchmark"
              title="How you compare against the market"
              caption="Composite perception across awareness, trust, recall and momentum."
            />
            <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
              <RadarCard />
              <BenchTable />
            </div>
          </Section>

          <Section delay={0.1}>
            <SectionHeading
              eyebrow="05 — Insights Engine"
              title="What changed and why it matters"
              caption="Signals surfaced from demand, traffic, authority and sentiment streams."
            />
            <InsightsFeed />
          </Section>

          <Section delay={0.1}>
            <SectionHeading
              eyebrow="06 — Actions & Opportunities"
              title="Where to invest next quarter"
              caption="Prioritized initiatives ranked by expected lift on Brand Love."
            />
            <ActionsGrid />
          </Section>

          <Section delay={0.1}>
            <SectionHeading
              eyebrow="07 — Historical Evolution"
              title="Brand Love trajectory"
              caption="Score evolution annotated with campaigns, PR moments and algorithm updates."
            />
            <TimelineCard />
          </Section>
        </main>
      </div>
    </div>
  );
}

function Section({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
      className="space-y-4"
    >
      {children}
    </motion.section>
  );
}

function Header({
  range,
  onRange,
}: {
  range: Range;
  onRange: (r: Range) => void;
}) {
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/85 backdrop-blur">
      <div className="mx-auto flex max-w-[1400px] flex-col gap-4 px-6 py-5 lg:flex-row lg:items-center lg:justify-between lg:px-10">
        <div className="space-y-1">
          <nav className="flex items-center gap-1 text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
            <Link to="/brand-authority" className="hover:text-foreground">
              Brand Authority
            </Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-foreground/80">Brand Love</span>
          </nav>
          <h1 className="text-2xl font-semibold tracking-tight">Brand Love</h1>
          <p className="max-w-xl text-sm text-muted-foreground">
            Measure how your brand grows in awareness, recall, trust, and authority across the web.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center rounded-md border border-border bg-card p-0.5">
            <Calendar className="ml-2 h-3.5 w-3.5 text-muted-foreground" />
            {RANGES.map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => onRange(r)}
                className={`rounded-sm px-2.5 py-1.5 font-mono text-[11px] transition-colors ${
                  range === r ? "bg-surface text-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {r}
              </button>
            ))}
          </div>
          <button
            type="button"
            className="inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-3 py-1.5 text-xs hover:bg-surface"
          >
            <Download className="h-3.5 w-3.5" /> Export
          </button>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}

function SectionHeading({
  eyebrow,
  title,
  caption,
}: {
  eyebrow: string;
  title: string;
  caption: string;
}) {
  return (
    <div className="flex flex-col gap-1">
      <p className="text-[10px] font-mono uppercase tracking-[0.18em] text-muted-foreground">{eyebrow}</p>
      <div className="flex items-baseline justify-between gap-4">
        <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
        <p className="hidden max-w-md text-xs text-muted-foreground md:block">{caption}</p>
      </div>
    </div>
  );
}

function Hero() {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-8 shadow-sm">
      <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[var(--glow)] blur-3xl" />
      <div className="relative grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.35fr)]">
        <div className="flex flex-col justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/8 px-2.5 py-1 text-[10px] font-mono uppercase tracking-wider text-primary">
              <Heart className="h-3 w-3" /> Brand Love Index
            </div>
            <div className="mt-6 flex items-end gap-3">
              <span className="font-mono text-7xl font-semibold leading-none tabular-nums">78</span>
              <span className="mb-2 font-mono text-lg text-muted-foreground">/100</span>
            </div>
            <div className="mt-3 inline-flex items-center gap-1.5 font-mono text-xs text-primary">
              <ArrowUpRight className="h-3.5 w-3.5" /> +12% YoY · vs Q4 baseline
            </div>
            <p className="mt-5 max-w-sm text-sm text-muted-foreground">
              Composite of branded demand, direct loyalty, mention quality and share of voice.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <MiniStat label="Confidence" value="92%" hint="High signal density" />
            <MiniStat label="Trajectory" value="Accelerating" hint="3-month slope +1.4/mo" />
          </div>
        </div>
        <div className="rounded-xl border border-border bg-background/60 p-4">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-sm font-medium">Score evolution</p>
            <TrendingUp className="h-4 w-4 text-primary" />
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={BRAND_LOVE_TREND} margin={{ top: 12, right: 16, bottom: 0, left: 0 }}>
              <defs>
                <linearGradient id="bls" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="var(--primary)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="var(--border)" strokeDasharray="2 4" vertical={false} />
              <XAxis dataKey="period" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} />
              <YAxis domain={[55, 85]} tickLine={false} axisLine={false} width={28} tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} />
              <ChartTooltip content={<MiniTooltip suffix="/100" />} />
              <Area type="monotone" dataKey="score" stroke="var(--primary)" strokeWidth={2.5} fill="url(#bls)" />
              {BRAND_LOVE_TREND.filter((p) => p.marker).map((p) => (
                <ReferenceDot key={p.period} x={p.period} y={p.score} r={4} fill="var(--primary)" stroke="var(--card)" strokeWidth={2} />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

function MiniStat({ label, value, hint }: { label: string; value: string; hint: string }) {
  return (
    <div className="rounded-lg border border-border bg-surface/40 p-3">
      <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="mt-1 font-mono text-lg font-semibold tabular-nums">{value}</p>
      <p className="mt-0.5 text-[11px] text-muted-foreground">{hint}</p>
    </div>
  );
}

function KpiGrid() {
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
      {KPIS.map((k) => (
        <div key={k.label} className="rounded-xl border border-border bg-card p-4 shadow-sm">
          <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">{k.label}</p>
          <p className="mt-2 font-mono text-2xl font-semibold tabular-nums">
            {k.value}
            {k.suffix && <span className="ml-1 text-[11px] text-muted-foreground">{k.suffix}</span>}
          </p>
          <div
            className={`mt-2 inline-flex items-center gap-1 font-mono text-[11px] ${
              k.delta >= 0 ? "text-primary" : "text-destructive"
            }`}
          >
            {k.delta >= 0 ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
            {k.delta > 0 ? "+" : ""}
            {k.delta}%
          </div>
        </div>
      ))}
    </div>
  );
}

function DemandChart({ grain, onGrain }: { grain: "M" | "Q" | "Y"; onGrain: (g: "M" | "Q" | "Y") => void }) {
  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Brand search demand</p>
          <p className="text-sm font-medium">You vs top 3 competitors</p>
        </div>
        <div className="flex items-center rounded-md border border-border bg-surface/50 p-0.5">
          {(["M", "Q", "Y"] as const).map((g) => (
            <button
              key={g}
              type="button"
              onClick={() => onGrain(g)}
              className={`rounded-sm px-2 py-1 font-mono text-[10px] transition-colors ${
                grain === g ? "bg-card text-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {g === "M" ? "Monthly" : g === "Q" ? "Quarterly" : "Yearly"}
            </button>
          ))}
        </div>
      </div>
      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={DEMAND_TREND} margin={{ top: 8, right: 16, bottom: 0, left: 0 }}>
          <CartesianGrid stroke="var(--border)" strokeDasharray="2 4" vertical={false} />
          <XAxis dataKey="m" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} />
          <YAxis tickLine={false} axisLine={false} width={28} tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} />
          <ChartTooltip content={<MiniTooltip suffix="K" />} />
          <Legend wrapperStyle={{ fontSize: 11 }} iconType="plainline" />
          <Line type="monotone" dataKey="you" name="Acme" stroke="var(--primary)" strokeWidth={2.5} dot={false} />
          <Line type="monotone" dataKey="c1" name="Northwind" stroke="var(--chart-3)" strokeWidth={1.5} dot={false} />
          <Line type="monotone" dataKey="c2" name="Globex" stroke="var(--chart-4)" strokeWidth={1.5} dot={false} />
          <Line type="monotone" dataKey="c3" name="Initech" stroke="var(--chart-5)" strokeWidth={1.5} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

function ShareChart() {
  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Share of search</p>
          <p className="text-sm font-medium">Competitor mix over time</p>
        </div>
        <span className="font-mono text-[11px] text-primary">Acme 34.6%</span>
      </div>
      <ResponsiveContainer width="100%" height={280}>
        <AreaChart data={SHARE_OF_SEARCH} margin={{ top: 8, right: 16, bottom: 0, left: 0 }} stackOffset="expand">
          <CartesianGrid stroke="var(--border)" strokeDasharray="2 4" vertical={false} />
          <XAxis dataKey="m" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} />
          <YAxis tickFormatter={(v) => `${Math.round(v * 100)}%`} tickLine={false} axisLine={false} width={36} tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} />
          <ChartTooltip content={<MiniTooltip suffix="%" />} />
          <Legend wrapperStyle={{ fontSize: 11 }} />
          <Area type="monotone" dataKey="You" stackId="1" stroke="var(--primary)" fill="var(--primary)" fillOpacity={0.5} />
          <Area type="monotone" dataKey="Northwind" stackId="1" stroke="var(--chart-3)" fill="var(--chart-3)" fillOpacity={0.35} />
          <Area type="monotone" dataKey="Globex" stackId="1" stroke="var(--chart-4)" fill="var(--chart-4)" fillOpacity={0.3} />
          <Area type="monotone" dataKey="Initech" stackId="1" stroke="var(--chart-5)" fill="var(--chart-5)" fillOpacity={0.25} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

function FastQueriesTable() {
  return (
    <div className="rounded-xl border border-border bg-card shadow-sm">
      <div className="flex items-center justify-between border-b border-border px-5 py-4">
        <div>
          <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Demand signals</p>
          <p className="text-sm font-medium">Fastest growing brand queries</p>
        </div>
        <span className="font-mono text-[11px] text-muted-foreground">Trailing 90d</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-surface/40 text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
              <th className="px-5 py-2.5 text-left font-medium">Query</th>
              <th className="px-5 py-2.5 text-right font-medium">Growth</th>
              <th className="px-5 py-2.5 text-left font-medium">Intent</th>
              <th className="px-5 py-2.5 text-left font-medium">Opportunity</th>
            </tr>
          </thead>
          <tbody>
            {FAST_QUERIES.map((q) => (
              <tr key={q.q} className="border-b border-border/60 last:border-0 hover:bg-surface/30">
                <td className="px-5 py-3 font-mono text-[13px]">{q.q}</td>
                <td className="px-5 py-3 text-right font-mono tabular-nums text-primary">+{q.growth}%</td>
                <td className="px-5 py-3 text-muted-foreground">{q.intent}</td>
                <td className="px-5 py-3">
                  <OppPill v={q.opp} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function OppPill({ v }: { v: string }) {
  const cls =
    v === "High"
      ? "border-primary/25 bg-primary/10 text-primary"
      : v === "Medium"
        ? "border-border bg-surface text-foreground"
        : "border-border bg-surface/40 text-muted-foreground";
  return <span className={`inline-flex rounded-md border px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider ${cls}`}>{v}</span>;
}

function DirectTrafficCard() {
  return (
    <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Loyalty signals</p>
          <p className="text-sm font-medium">Direct, returning and branded traffic</p>
        </div>
        <Users className="h-4 w-4 text-primary" />
      </div>
      <div className="mt-5 h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={DIRECT_TRAFFIC} margin={{ top: 8, right: 16, bottom: 0, left: 0 }}>
            <CartesianGrid stroke="var(--border)" strokeDasharray="2 4" vertical={false} />
            <XAxis dataKey="m" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} />
            <YAxis tickLine={false} axisLine={false} width={28} tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} />
            <ChartTooltip content={<MiniTooltip suffix="K" />} />
            <Legend wrapperStyle={{ fontSize: 11 }} iconType="plainline" />
            <Line type="monotone" dataKey="direct" name="Direct" stroke="var(--primary)" strokeWidth={2.5} dot={false} />
            <Line type="monotone" dataKey="returning" name="Returning" stroke="var(--chart-3)" strokeWidth={1.5} dot={false} />
            <Line type="monotone" dataKey="branded" name="Brand searches" stroke="var(--chart-4)" strokeWidth={1.5} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[
          { l: "Returning visitor rate", v: "47.2%", d: 3.4 },
          { l: "Revenue / direct session", v: "$4.18", d: 6.1 },
          { l: "Estimated dark social", v: "21.6%", d: 1.8 },
          { l: "Brand recall strength", v: "A−", d: 2.0 },
        ].map((s) => (
          <div key={s.l} className="rounded-lg border border-border bg-surface/40 p-3">
            <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">{s.l}</p>
            <p className="mt-1 font-mono text-lg font-semibold tabular-nums">{s.v}</p>
            <p className="mt-0.5 inline-flex items-center gap-1 font-mono text-[11px] text-primary">
              <ArrowUpRight className="h-3 w-3" />+{s.d}%
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

function ReferringDomainsCard() {
  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Authority graph</p>
          <p className="text-sm font-medium">Referring domains trend</p>
        </div>
        <ShieldCheck className="h-4 w-4 text-primary" />
      </div>
      <ResponsiveContainer width="100%" height={240}>
        <AreaChart data={REFERRING_TREND} margin={{ top: 8, right: 16, bottom: 0, left: 0 }}>
          <defs>
            <linearGradient id="rd" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.3} />
              <stop offset="100%" stopColor="var(--primary)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="var(--border)" strokeDasharray="2 4" vertical={false} />
          <XAxis dataKey="m" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} />
          <YAxis tickLine={false} axisLine={false} width={42} tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} />
          <ChartTooltip content={<MiniTooltip />} />
          <Area type="monotone" dataKey="v" stroke="var(--primary)" strokeWidth={2.5} fill="url(#rd)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

function MentionsBySource() {
  const total = MENTIONS_BY_SOURCE.reduce((a, b) => a + b.value, 0);
  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Mention mix</p>
          <p className="text-sm font-medium">Brand mentions by source</p>
        </div>
        <Megaphone className="h-4 w-4 text-primary" />
      </div>
      <div className="space-y-3">
        {MENTIONS_BY_SOURCE.map((s) => {
          const pct = (s.value / total) * 100;
          return (
            <div key={s.source}>
              <div className="mb-1 flex items-center justify-between text-xs">
                <span>{s.source}</span>
                <span className="font-mono tabular-nums text-muted-foreground">
                  {s.value.toLocaleString()} · {pct.toFixed(1)}%
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-surface">
                <div className="h-full rounded-full bg-primary/80" style={{ width: `${pct}%` }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function DrBuckets() {
  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Quality breakdown</p>
          <p className="text-sm font-medium">Authority of referring domains</p>
        </div>
        <span className="font-mono text-[11px] text-muted-foreground">9,842 RDs total</span>
      </div>
      <ResponsiveContainer width="100%" height={180}>
        <BarChart data={DR_BUCKETS} margin={{ top: 8, right: 16, bottom: 0, left: 0 }}>
          <CartesianGrid stroke="var(--border)" strokeDasharray="2 4" vertical={false} />
          <XAxis dataKey="bucket" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} />
          <YAxis tickLine={false} axisLine={false} width={42} tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} />
          <ChartTooltip content={<MiniTooltip />} />
          <Bar dataKey="value" radius={[6, 6, 0, 0]}>
            {DR_BUCKETS.map((b, i) => (
              <Cell key={i} fill={b.tone === "primary" ? "var(--primary)" : "var(--muted-foreground)"} fillOpacity={b.tone === "primary" ? 0.85 : 0.35} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

function RadarCard() {
  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <div className="mb-2">
        <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Perception radar</p>
        <p className="text-sm font-medium">You vs market average vs leader</p>
      </div>
      <ResponsiveContainer width="100%" height={340}>
        <RadarChart data={RADAR} outerRadius="78%">
          <PolarGrid stroke="var(--border)" />
          <PolarAngleAxis dataKey="axis" tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} />
          <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 9, fill: "var(--muted-foreground)" }} />
          <Radar name="You" dataKey="you" stroke="var(--primary)" fill="var(--primary)" fillOpacity={0.35} />
          <Radar name="Avg" dataKey="avg" stroke="var(--chart-3)" fill="var(--chart-3)" fillOpacity={0.15} />
          <Radar name="Leader" dataKey="leader" stroke="var(--chart-4)" fill="var(--chart-4)" fillOpacity={0.1} />
          <Legend wrapperStyle={{ fontSize: 11 }} />
          <ChartTooltip content={<MiniTooltip suffix="/100" />} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}

function BenchTable() {
  return (
    <div className="rounded-xl border border-border bg-card shadow-sm">
      <div className="border-b border-border px-5 py-4">
        <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Executive benchmark</p>
        <p className="text-sm font-medium">Where you lead, match or trail the market</p>
      </div>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-surface/40 text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
            <th className="px-5 py-2.5 text-left font-medium">Metric</th>
            <th className="px-5 py-2.5 text-right font-medium">You</th>
            <th className="px-5 py-2.5 text-right font-medium">Market avg</th>
            <th className="px-5 py-2.5 text-right font-medium">Leader</th>
            <th className="px-5 py-2.5 text-left font-medium">Status</th>
          </tr>
        </thead>
        <tbody>
          {BENCH.map((b) => {
            const status = benchStatus(b.you, b.avg, b.leader);
            return (
              <tr key={b.metric} className="border-b border-border/60 last:border-0 hover:bg-surface/30">
                <td className="px-5 py-3">{b.metric}</td>
                <td className="px-5 py-3 text-right font-mono tabular-nums">{b.you}</td>
                <td className="px-5 py-3 text-right font-mono tabular-nums text-muted-foreground">{b.avg}</td>
                <td className="px-5 py-3 text-right font-mono tabular-nums text-muted-foreground">{b.leader}</td>
                <td className="px-5 py-3">
                  <BenchPill status={status} />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function benchStatus(you: string, avg: string, leader: string): "Leading" | "Average" | "Behind" {
  const n = (s: string) => parseFloat(s.replace(/[^0-9.+-]/g, ""));
  const y = n(you);
  const a = n(avg);
  const l = n(leader);
  if (y >= l * 0.95) return "Leading";
  if (y >= a) return "Average";
  return "Behind";
}

function BenchPill({ status }: { status: "Leading" | "Average" | "Behind" }) {
  const cls =
    status === "Leading"
      ? "border-primary/25 bg-primary/10 text-primary"
      : status === "Behind"
        ? "border-destructive/25 bg-destructive/10 text-destructive"
        : "border-border bg-surface text-muted-foreground";
  return (
    <span className={`inline-flex rounded-md border px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider ${cls}`}>
      {status}
    </span>
  );
}

function InsightsFeed() {
  return (
    <div className="grid gap-3 lg:grid-cols-2">
      {INSIGHTS.map((i) => (
        <div key={i.title} className="group rounded-xl border border-border bg-card p-5 shadow-sm transition-colors hover:border-primary/30">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 rounded-md border border-border bg-surface/60 px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
              <Sparkles className="h-3 w-3 text-primary" /> {i.priority} · {i.impact} impact
            </span>
            <span className="font-mono text-[11px] text-muted-foreground">conf {i.confidence}%</span>
          </div>
          <p className="mt-3 text-sm font-medium leading-snug">{i.title}</p>
          <p className="mt-1.5 text-xs text-muted-foreground">{i.body}</p>
          <button
            type="button"
            className="mt-4 inline-flex items-center gap-1.5 rounded-md border border-border bg-surface/60 px-2.5 py-1 text-xs hover:border-primary/30 hover:text-primary"
          >
            Investigate <ChevronRight className="h-3 w-3" />
          </button>
        </div>
      ))}
    </div>
  );
}

function ActionsGrid() {
  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {ACTIONS.map((a) => (
        <div key={a.title} className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <Target className="h-4 w-4 text-primary" />
            <span className="font-mono text-[11px] text-muted-foreground">conf {a.confidence}%</span>
          </div>
          <p className="mt-3 text-sm font-medium leading-snug">{a.title}</p>
          <div className="mt-4 grid grid-cols-2 gap-2">
            <div className="rounded-md border border-border bg-surface/40 p-2">
              <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Impact</p>
              <p className="mt-0.5 font-mono text-sm text-primary">{a.impact}</p>
            </div>
            <div className="rounded-md border border-border bg-surface/40 p-2">
              <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Effort</p>
              <p className="mt-0.5 font-mono text-sm">{a.effort}</p>
            </div>
          </div>
          <button
            type="button"
            className="mt-4 inline-flex w-full items-center justify-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90"
          >
            <Zap className="h-3 w-3" /> Create task
          </button>
        </div>
      ))}
    </div>
  );
}

function TimelineCard() {
  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">12-month evolution</p>
          <p className="text-sm font-medium">Brand Love score with key moments</p>
        </div>
        <TrendingUp className="h-4 w-4 text-primary" />
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={TIMELINE} margin={{ top: 16, right: 24, bottom: 0, left: 0 }}>
          <defs>
            <linearGradient id="tl" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.35} />
              <stop offset="100%" stopColor="var(--primary)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="var(--border)" strokeDasharray="2 4" vertical={false} />
          <XAxis dataKey="d" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} />
          <YAxis domain={[55, 85]} tickLine={false} axisLine={false} width={28} tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} />
          <ChartTooltip content={<TimelineTooltip />} />
          <Area type="monotone" dataKey="v" stroke="var(--primary)" strokeWidth={2.5} fill="url(#tl)" />
          {TIMELINE.filter((t) => t.e).map((t) => (
            <ReferenceDot key={t.d} x={t.d} y={t.v} r={4} fill="var(--primary)" stroke="var(--card)" strokeWidth={2} />
          ))}
        </AreaChart>
      </ResponsiveContainer>
      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-muted-foreground">
        {TIMELINE.filter((t) => t.e).map((t) => (
          <span key={t.d} className="inline-flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            <span className="font-mono">{t.d}</span> {t.e}
          </span>
        ))}
      </div>
    </div>
  );
}

function MiniTooltip({
  active,
  payload,
  label,
  suffix = "",
}: {
  active?: boolean;
  payload?: Array<{ value?: number | string; name?: string; color?: string; dataKey?: string }>;
  label?: string | number;
  suffix?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-md border border-border bg-popover px-3 py-2 text-xs shadow-md">
      {label !== undefined && <p className="mb-1 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">{label}</p>}
      {payload.map((p) => (
        <div key={String(p.dataKey)} className="flex items-center gap-2">
          {p.color && <span className="h-1.5 w-1.5 rounded-full" style={{ background: p.color }} />}
          <span className="text-muted-foreground">{p.name ?? p.dataKey}</span>
          <span className="ml-auto font-mono tabular-nums">
            {p.value}
            {suffix}
          </span>
        </div>
      ))}
    </div>
  );
}

function TimelineTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ value?: number; payload?: { e?: string } }>;
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-md border border-border bg-popover px-3 py-2 text-xs shadow-md">
      <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="mt-1 font-mono">{payload[0].value}/100</p>
      {payload[0].payload?.e && <p className="mt-1 text-primary">{payload[0].payload.e}</p>}
    </div>
  );
}
