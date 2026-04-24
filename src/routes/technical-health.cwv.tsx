import { createFileRoute } from "@tanstack/react-router";
import { Activity, ArrowDownRight, ArrowUpRight, Download, Gauge, Layers3, Target, TrendingUp } from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  CartesianGrid,
  Cell,
  ComposedChart,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const Route = createFileRoute("/technical-health/cwv")({
  component: CwvDashboardPage,
  head: () => ({
    meta: [
      { title: "CWV Impact Overview — OrganicOS" },
      {
        name: "description",
        content: "Prioritise Core Web Vitals engineering work by revenue at risk, ROI, and confidence.",
      },
      { property: "og:title", content: "CWV Impact Overview — OrganicOS" },
      {
        property: "og:description",
        content: "A revenue-first Core Web Vitals dashboard for deciding where engineering time creates the most upside.",
      },
    ],
  }),
});

type Confidence = "HIGH" | "MEDIUM" | "DIRECTIONAL";
type Effort = "Low" | "Medium" | "High";
type VitalsStatus = "good" | "ni" | "poor";

type Opportunity = {
  pageType: string;
  issue: "LCP" | "INP" | "CLS";
  problem: string;
  revenue: number;
  confidence: Confidence;
  effort: Effort;
  roi: number;
};

const HERO_KPIS = [
  { label: "CWV Score", value: "68", context: "portfolio health", delta: -4.2, tone: "risk" },
  { label: "Good URLs", value: "61%", context: "eligible revenue pages", delta: 3.8, tone: "positive" },
  { label: "Revenue at Risk", value: "£412k", context: "annualised conversion loss", delta: 11.4, tone: "danger", hero: true },
  { label: "Weekly Delta", value: "+£18.6k", context: "risk added this week", delta: 6.7, tone: "danger" },
] as const;

const OPPORTUNITIES: Opportunity[] = [
  { pageType: "Bus Route", issue: "LCP", problem: "Hero render delay on fare modules", revenue: 184000, confidence: "HIGH", effort: "Medium", roi: 92 },
  { pageType: "Stop Pages", issue: "INP", problem: "Timetable controls block interaction", revenue: 126000, confidence: "MEDIUM", effort: "High", roi: 61 },
  { pageType: "City Pages", issue: "LCP", problem: "Route list payload delays first view", revenue: 98000, confidence: "HIGH", effort: "Low", roi: 88 },
  { pageType: "Operator", issue: "CLS", problem: "Late ad slot shifts fare links", revenue: 42000, confidence: "DIRECTIONAL", effort: "Low", roi: 54 },
];

const PERFORMANCE = [
  { pageType: "Routes", current: 620, potential: 804 },
  { pageType: "Stops", current: 410, potential: 536 },
  { pageType: "City", current: 350, potential: 448 },
  { pageType: "Operator", current: 230, potential: 272 },
  { pageType: "Blog", current: 155, potential: 171 },
];

const STATUS_WEEKLY = [
  { week: "Mar 23", good: 18.9, ni: 10.8, poor: null },
  { week: "Mar 30", good: 46.6, ni: 9.4, poor: 61.7 },
  { week: "Apr 6", good: 20.8, ni: 8.3, poor: 62.0 },
];

const STATUS_SUMMARY = [
  { status: "good", label: "Good", sample: 8, clicks: "5,053", impressions: "24,239", ctr: "20.8%", growth: "baseline" },
  { status: "ni", label: "Needs improvement", sample: 19, clicks: "11,711", impressions: "141,501", ctr: "8.3%", growth: "+£17,787/wk" },
  { status: "poor", label: "Poor", sample: 2, clicks: "3,798", impressions: "6,126", ctr: "62.0%", growth: "—" },
] as const;

const TREND = [
  { week: "W1", score: 74, risk: 340 },
  { week: "W2", score: 72, risk: 356 },
  { week: "W3", score: 71, risk: 366 },
  { week: "W4", score: 69, risk: 392, release: "Release" },
  { week: "W5", score: 68, risk: 412 },
  { week: "W6", score: 70, risk: 386, release: "Experiment" },
];

const URL_EXAMPLES = [
  { url: "/routes/london-to-bristol", status: "ni", clicks: "1,110", impressions: "40,412", ctr: "2.7%", position: "5.0", lcp: "1.41s", inp: "204ms", cls: "0.010" },
  { url: "/routes/manchester-to-leeds", status: "ni", clicks: "489", impressions: "30,724", ctr: "1.6%", position: "6.3", lcp: "1.12s", inp: "180ms", cls: "0.220" },
  { url: "/stops/victoria-coach-station", status: "ni", clicks: "679", impressions: "16,397", ctr: "4.1%", position: "10.7", lcp: "1.52s", inp: "215ms", cls: "0.010" },
  { url: "/routes/edinburgh-to-glasgow", status: "good", clicks: "1,340", impressions: "13,529", ctr: "9.9%", position: "2.0", lcp: "1.31s", inp: "180ms", cls: "0.000" },
  { url: "/city/birmingham", status: "ni", clicks: "2,631", impressions: "10,625", ctr: "24.8%", position: "1.8", lcp: "1.51s", inp: "221ms", cls: "0.120" },
] as const;

function CwvDashboardPage() {
  return (
    <main className="px-6 lg:px-8 py-6 space-y-6">
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="bg-surface border border-border">
          <TabsTrigger value="overview">Impact overview</TabsTrigger>
          <TabsTrigger value="deep-dive">Page type deep dive</TabsTrigger>
          <TabsTrigger value="opportunities">Opportunities table</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <HeroKpis />
          <BiggestOpportunities />
          <PerformancePotentialChart />
        </TabsContent>

        <TabsContent value="deep-dive" className="space-y-6">
          <DeepDive />
        </TabsContent>

        <TabsContent value="opportunities" className="space-y-6">
          <OpportunitiesTable />
        </TabsContent>
      </Tabs>
    </main>
  );
}

function HeroKpis() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
      {HERO_KPIS.map((kpi) => {
        const isBad = kpi.tone === "danger" || kpi.tone === "risk";
        const isHero = "hero" in kpi;
        return (
          <div
            key={kpi.label}
            className={`relative overflow-hidden rounded-lg border bg-card p-5 ${
              isHero ? "border-destructive/40" : "border-border"
            }`}
          >
            {isHero && <div className="absolute inset-0 bg-destructive/10 blur-2xl" />}
            <div className="relative flex items-start justify-between gap-4">
              <div>
                <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">{kpi.label}</p>
                <p className={`mt-2 font-mono font-bold tabular-nums ${isHero ? "text-4xl text-destructive" : "text-3xl text-foreground"}`}>
                  {kpi.value}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">{kpi.context}</p>
              </div>
              <div className={`rounded-md border p-2 ${isBad ? "border-destructive/20 bg-destructive/10 text-destructive" : "border-primary/20 bg-primary/10 text-primary"}`}>
                {isHero ? <Target className="w-4 h-4" /> : <Gauge className="w-4 h-4" />}
              </div>
            </div>
            <div className={`relative mt-4 inline-flex items-center gap-1 text-[11px] font-mono ${isBad ? "text-destructive" : "text-primary"}`}>
              {kpi.delta >= 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
              {kpi.delta > 0 ? "+" : ""}{kpi.delta}% vs last week
            </div>
          </div>
        );
      })}
    </div>
  );
}

function BiggestOpportunities() {
  return (
    <section className="space-y-3">
      <SectionHeading icon={<Target className="w-4 h-4" />} title="Biggest opportunities" subtitle="Top places to invest engineering time, sorted by annual revenue upside." />
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-4">
        {OPPORTUNITIES.map((item) => (
          <div key={`${item.pageType}-${item.issue}`} className="rounded-lg border border-l-4 border-l-destructive bg-card p-5 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold">{item.pageType}</p>
                <p className="mt-1 text-xs text-muted-foreground">{item.problem}</p>
              </div>
              <span className="rounded-md border border-destructive/20 bg-destructive/10 px-2 py-1 text-[10px] font-mono text-destructive">{item.issue}</span>
            </div>
            <p className="mt-5 text-2xl font-mono font-bold text-primary">£{Math.round(item.revenue / 1000)}k<span className="text-xs font-normal text-muted-foreground"> / yr</span></p>
            <div className="mt-4 flex items-center justify-between gap-2">
              <ConfidenceBadge confidence={item.confidence} />
              <span className="text-[11px] font-mono text-muted-foreground">Effort: <span className="text-foreground">{item.effort}</span></span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function PerformancePotentialChart() {
  return (
    <section className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <SectionHeading icon={<TrendingUp className="w-4 h-4" />} title="Performance vs Potential" subtitle="Current revenue compared with modelled revenue if CWV issues are fixed." />
      <div className="mt-4 h-[330px]">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={PERFORMANCE} margin={{ top: 10, right: 16, bottom: 0, left: 0 }}>
            <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="pageType" tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: "var(--muted-foreground)", fontSize: 11, fontFamily: "var(--font-mono)" }} tickFormatter={(v) => `£${v}k`} axisLine={false} tickLine={false} />
            <Tooltip content={<RevenueTooltip />} />
            <Bar dataKey="current" fill="var(--chart-1)" radius={[4, 4, 0, 0]} name="Current" />
            <Line type="monotone" dataKey="potential" stroke="var(--primary)" strokeWidth={2} dot={{ r: 3, fill: "var(--primary)" }} name="Potential" />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}

function DeepDive() {
  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
        <div className="flex flex-col gap-3 border-b border-border p-5 md:flex-row md:items-center md:justify-between">
          <SectionHeading icon={<Activity className="w-4 h-4" />} title="Bus Route page type" subtitle="CTR and revenue opportunity by CWV status, using controlled URL samples." />
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-md border border-primary/30 bg-primary/10 px-2.5 py-1 text-[11px] font-mono font-semibold text-primary">+£17,787/wk</span>
            <span className="rounded-md border border-border bg-surface px-2.5 py-1 text-[11px] font-mono text-muted-foreground">≈ £924,924/yr est.</span>
          </div>
        </div>
        <div className="p-5">
          <div className="rounded-lg bg-surface/45 p-4">
            <div className="mb-3 flex items-center justify-between gap-3">
              <h3 className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">CTR by CWV status — weekly</h3>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <LegendDot label="Good" className="bg-primary" />
                <LegendDot label="NI" className="bg-chart-4" />
                <LegendDot label="Poor" className="bg-destructive" />
              </div>
            </div>
            <div className="h-[210px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={STATUS_WEEKLY} margin={{ top: 8, right: 18, bottom: 0, left: 0 }}>
                  <CartesianGrid stroke="var(--border)" vertical={false} />
                  <XAxis dataKey="week" tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "var(--muted-foreground)", fontSize: 11, fontFamily: "var(--font-mono)" }} tickFormatter={(v) => `${v}%`} axisLine={false} tickLine={false} />
                  <Tooltip content={<StatusTrendTooltip />} />
                  <Line type="monotone" dataKey="good" stroke="var(--primary)" strokeWidth={2} dot={{ r: 3, fill: "var(--primary)" }} connectNulls />
                  <Line type="monotone" dataKey="ni" stroke="var(--chart-4)" strokeWidth={2} dot={{ r: 3, fill: "var(--chart-4)" }} connectNulls />
                  <Line type="monotone" dataKey="poor" stroke="var(--destructive)" strokeWidth={2} dot={{ r: 3, fill: "var(--destructive)" }} connectNulls />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
          <StatusSummary />
          <UrlExamplesTable />
        </div>
      </section>

      <section className="xl:col-span-3 rounded-xl border border-border bg-card p-5 shadow-sm">
        <SectionHeading icon={<TrendingUp className="w-4 h-4" />} title="Weekly CWV evolution" subtitle="Health score against revenue at risk, with release and experiment markers." />
        <div className="mt-4 h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={TREND} margin={{ top: 10, right: 18, bottom: 0, left: 0 }}>
              <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="week" tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis yAxisId="score" tick={{ fill: "var(--muted-foreground)", fontSize: 11, fontFamily: "var(--font-mono)" }} axisLine={false} tickLine={false} />
              <YAxis yAxisId="risk" orientation="right" tick={{ fill: "var(--muted-foreground)", fontSize: 11, fontFamily: "var(--font-mono)" }} tickFormatter={(v) => `£${v}k`} axisLine={false} tickLine={false} />
              <Tooltip content={<TrendTooltip />} />
              <Area yAxisId="risk" type="monotone" dataKey="risk" stroke="var(--destructive)" fill="var(--destructive)" fillOpacity={0.14} name="Risk" />
              <Line yAxisId="score" type="monotone" dataKey="score" stroke="var(--primary)" strokeWidth={2} name="Score" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </section>
    </div>
  );
}

function RevenueModel() {
  const rows = [
    ["Current CTR", "4.1%"],
    ["Target CTR", "4.8%"],
    ["CVR", "2.84%"],
    ["AOV", "£126"],
    ["Revenue uplift", "£184k / yr"],
  ];
  return (
    <div>
      <h3 className="text-sm font-semibold">Revenue impact model</h3>
      <div className="mt-3 rounded-lg border border-border bg-surface/50 p-4 space-y-3">
        {rows.map(([k, v]) => (
          <div key={k} className="flex items-center justify-between gap-4 border-b border-border/70 pb-2 last:border-0 last:pb-0">
            <span className="text-xs text-muted-foreground">{k}</span>
            <span className={`font-mono text-sm tabular-nums ${k === "Revenue uplift" ? "text-primary font-bold" : "text-foreground"}`}>{v}</span>
          </div>
        ))}
      </div>
      <p className="mt-3 text-xs leading-relaxed text-muted-foreground">Uses GOOD URL CTR targets, conversion rate, and average order value to translate CWV recovery into financial impact.</p>
    </div>
  );
}

function OpportunitiesTable() {
  return (
    <section className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
      <div className="flex flex-col gap-3 border-b border-border p-5 md:flex-row md:items-center md:justify-between">
        <SectionHeading icon={<Target className="w-4 h-4" />} title="Opportunities table" subtitle="Default sorted by annual revenue uplift." />
        <button className="inline-flex w-fit items-center gap-1.5 rounded-md border border-border bg-surface px-3 py-2 text-xs font-mono uppercase tracking-wider hover:bg-surface/70 transition-colors">
          <Download className="w-3.5 h-3.5" />
          Export CSV
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] text-sm">
          <thead className="bg-surface/60 text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="px-5 py-3 text-left font-medium">Page type</th>
              <th className="px-5 py-3 text-left font-medium">Issue</th>
              <th className="px-5 py-3 text-right font-medium">Revenue uplift</th>
              <th className="px-5 py-3 text-right font-medium">Effort score</th>
              <th className="px-5 py-3 text-right font-medium">ROI score</th>
              <th className="px-5 py-3 text-left font-medium">Confidence</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {OPPORTUNITIES.map((row) => (
              <tr key={`${row.pageType}-${row.issue}`} className="hover:bg-surface/40 transition-colors">
                <td className="px-5 py-4 font-medium">{row.pageType}</td>
                <td className="px-5 py-4"><span className="rounded-md border border-border bg-surface px-2 py-1 text-[11px] font-mono">{row.issue}</span></td>
                <td className="px-5 py-4 text-right font-mono text-primary">£{Math.round(row.revenue / 1000)}k</td>
                <td className="px-5 py-4 text-right font-mono">{row.effort}</td>
                <td className="px-5 py-4 text-right font-mono">{row.roi}</td>
                <td className="px-5 py-4"><ConfidenceBadge confidence={row.confidence} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function SectionHeading({ icon, title, subtitle }: { icon: React.ReactNode; title: string; subtitle: string }) {
  return (
    <div className="flex items-start gap-2.5">
      <div className="mt-0.5 rounded-md border border-border bg-surface p-1.5 text-muted-foreground">{icon}</div>
      <div>
        <h3 className="text-sm font-semibold">{title}</h3>
        <p className="text-xs text-muted-foreground">{subtitle}</p>
      </div>
    </div>
  );
}

function ConfidenceBadge({ confidence }: { confidence: Confidence }) {
  const classes: Record<Confidence, string> = {
    HIGH: "border-primary/20 bg-primary/10 text-primary",
    MEDIUM: "border-chart-4/40 bg-transparent text-chart-4",
    DIRECTIONAL: "border-border bg-muted text-muted-foreground",
  };
  return <span className={`inline-flex rounded-md border px-2 py-1 text-[10px] font-mono uppercase tracking-wider ${classes[confidence]}`}>{confidence}</span>;
}

function UrlList({ title, urls, status }: { title: string; urls: string[]; status: VitalsStatus }) {
  return (
    <div className="mt-4">
      <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">{title}</p>
      <div className="mt-2 space-y-2">
        {urls.map((url) => (
          <div key={url} className="flex items-center gap-2 rounded-md border border-border bg-surface/50 px-2.5 py-2">
            <span className={`h-2 w-2 rounded-full ${status === "good" ? "bg-primary" : "bg-destructive"}`} />
            <span className="truncate text-xs font-mono text-muted-foreground">{url}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function RevenueTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ dataKey: string; value: number }>; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-md border border-border bg-popover px-3 py-2 text-xs shadow-lg">
      <p className="font-medium mb-1.5">{label}</p>
      {payload.map((p) => (
        <div key={p.dataKey} className="flex justify-between gap-5 font-mono text-[11px]"><span className="text-muted-foreground">{p.dataKey}</span><span>£{p.value}k</span></div>
      ))}
    </div>
  );
}

function VitalsTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ dataKey: string; value: number }>; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-md border border-border bg-popover px-3 py-2 text-xs shadow-lg">
      <p className="font-medium mb-1.5">{label}</p>
      {payload.map((p) => (
        <div key={p.dataKey} className="flex justify-between gap-5 font-mono text-[11px]"><span className="text-muted-foreground">{p.dataKey}</span><span>{p.value}%</span></div>
      ))}
    </div>
  );
}

function TrendTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ dataKey: string; value: number; payload: { release?: string } }>; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-md border border-border bg-popover px-3 py-2 text-xs shadow-lg">
      <p className="font-medium mb-1.5">{label}</p>
      {payload.map((p) => (
        <div key={p.dataKey} className="flex justify-between gap-5 font-mono text-[11px]"><span className="text-muted-foreground">{p.dataKey}</span><span>{p.dataKey === "risk" ? `£${p.value}k` : p.value}</span></div>
      ))}
      {payload[0].payload.release && <p className="mt-1.5 text-[11px] text-primary">{payload[0].payload.release}</p>}
    </div>
  );
}
