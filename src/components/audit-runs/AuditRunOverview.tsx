import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Plus, Settings2 } from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { DashboardNav } from "@/components/dashboard/DashboardNav";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";

type AuditRun = {
  id: string;
  name: string;
  healthScore: number;
  lastRun: string;
  urlsCrawled: number;
};

const AUDIT_RUNS: AuditRun[] = [
  { id: "core-commerce", name: "Core Revenue Pages", healthScore: 91, lastRun: "Today · 08:42", urlsCrawled: 18432 },
  { id: "international", name: "International Expansion", healthScore: 74, lastRun: "Running now", urlsCrawled: 68240 },
  { id: "content-hubs", name: "Editorial Hubs", healthScore: 67, lastRun: "Yesterday · 21:16", urlsCrawled: 12805 },
  { id: "templates", name: "Template QA Sweep", healthScore: 83, lastRun: "Apr 24 · 04:12", urlsCrawled: 4390 },
  { id: "migration", name: "Post-Migration Guardrail", healthScore: 38, lastRun: "Apr 23 · 01:04", urlsCrawled: 94512 },
  { id: "marketplace", name: "Marketplace Supply Pages", healthScore: 79, lastRun: "Apr 22 · 13:30", urlsCrawled: 27650 },
  { id: "brand", name: "Brand & Support Surface", healthScore: 88, lastRun: "Apr 18 · 10:00", urlsCrawled: 3240 },
];

const HEALTH_TREND = [
  { crawl: "C-5", score: 78, inventory: 82, discovery: 74, indexability: 69, distribution: 71 },
  { crawl: "C-4", score: 81, inventory: 84, discovery: 77, indexability: 72, distribution: 73 },
  { crawl: "C-3", score: 79, inventory: 83, discovery: 76, indexability: 75, distribution: 74 },
  { crawl: "C-2", score: 86, inventory: 88, discovery: 81, indexability: 80, distribution: 79 },
  { crawl: "Latest", score: 91, inventory: 92, discovery: 86, indexability: 84, distribution: 82 },
];

export const MAIN_HEALTH_ISSUES = [
  { id: "broken-internal-links", name: "Broken internal links", latest: 18, impact: "£42k", data: [{ crawl: "C-5", value: 42 }, { crawl: "C-4", value: 36 }, { crawl: "C-3", value: 31 }, { crawl: "C-2", value: 24 }, { crawl: "Latest", value: 18 }] },
  { id: "canonical-conflicts", name: "Canonical conflicts", latest: 11, impact: "£31k", data: [{ crawl: "C-5", value: 23 }, { crawl: "C-4", value: 20 }, { crawl: "C-3", value: 19 }, { crawl: "C-2", value: 15 }, { crawl: "Latest", value: 11 }] },
  { id: "noindex-money-pages", name: "Noindex on money pages", latest: 7, impact: "£67k", data: [{ crawl: "C-5", value: 15 }, { crawl: "C-4", value: 13 }, { crawl: "C-3", value: 10 }, { crawl: "C-2", value: 9 }, { crawl: "Latest", value: 7 }] },
  { id: "redirect-chain-depth", name: "Redirect chain depth", latest: 6, impact: "£24k", data: [{ crawl: "C-5", value: 18 }, { crawl: "C-4", value: 16 }, { crawl: "C-3", value: 12 }, { crawl: "C-2", value: 9 }, { crawl: "Latest", value: 6 }] },
  { id: "missing-structured-data", name: "Missing structured data", latest: 24, impact: "£18k", data: [{ crawl: "C-5", value: 61 }, { crawl: "C-4", value: 54 }, { crawl: "C-3", value: 43 }, { crawl: "C-2", value: 35 }, { crawl: "Latest", value: 24 }] },
];

export const MAIN_HEALTH_ISSUE_URLS = [
  { issueId: "broken-internal-links", url: "https://www.busbud.com/en/about/careers", status: "404", organicTraffic: 0, depth: 0, inlinks: 0, firstFound: "Latest" },
  { issueId: "broken-internal-links", url: "https://www.busbud.com/en/about/refund-policy", status: "404", organicTraffic: 0, depth: 0, inlinks: 0, firstFound: "Latest" },
  { issueId: "broken-internal-links", url: "https://www.busbud.com/en/routes/london-paris", status: "404", organicTraffic: 184, depth: 2, inlinks: 12, firstFound: "C-2" },
  { issueId: "canonical-conflicts", url: "https://www.busbud.com/en/bus-routes/madrid-barcelona", status: "200", organicTraffic: 920, depth: 2, inlinks: 43, firstFound: "C-3" },
  { issueId: "canonical-conflicts", url: "https://www.busbud.com/en/city/rome", status: "200", organicTraffic: 612, depth: 3, inlinks: 31, firstFound: "C-4" },
  { issueId: "noindex-money-pages", url: "https://www.busbud.com/en/bus-tickets/new-york-boston", status: "200", organicTraffic: 1480, depth: 2, inlinks: 58, firstFound: "C-2" },
  { issueId: "noindex-money-pages", url: "https://www.busbud.com/en/train/london-manchester", status: "200", organicTraffic: 870, depth: 2, inlinks: 49, firstFound: "Latest" },
  { issueId: "redirect-chain-depth", url: "https://www.busbud.com/en/operator/flixbus", status: "301 → 301 → 200", organicTraffic: 740, depth: 3, inlinks: 36, firstFound: "C-4" },
  { issueId: "redirect-chain-depth", url: "https://www.busbud.com/en/stops/victoria-coach-station", status: "302 → 301 → 200", organicTraffic: 388, depth: 4, inlinks: 18, firstFound: "Latest" },
  { issueId: "missing-structured-data", url: "https://www.busbud.com/en/bus-company/alsa", status: "200", organicTraffic: 520, depth: 3, inlinks: 24, firstFound: "C-2" },
  { issueId: "missing-structured-data", url: "https://www.busbud.com/en/blog/best-bus-routes-europe", status: "200", organicTraffic: 318, depth: 4, inlinks: 11, firstFound: "Latest" },
];

const FUNNEL_SEGMENTS = [
  { name: "Inventory", total: 18432, left: 1264 },
  { name: "Discovery", total: 17168, left: 902 },
  { name: "Indexability", total: 16266, left: 714 },
  { name: "Distribution", total: 15552, left: 438 },
];

const ISSUE_ROWS = [
  { issue: "Internal 404 links", crawled: 18432, changed: 128, added: 18, new: 7, removed: 22, missing: 4 },
  { issue: "Canonical mismatch", crawled: 18432, changed: 94, added: 11, new: 5, removed: 17, missing: 2 },
  { issue: "Duplicate title", crawled: 18432, changed: 221, added: 37, new: 14, removed: 45, missing: 8 },
  { issue: "Missing meta description", crawled: 18432, changed: 176, added: 29, new: 10, removed: 31, missing: 6 },
];

const STATUS_DISTRIBUTION = [{ code: "2xx", urls: 15120 }, { code: "3xx", urls: 2088 }, { code: "4xx", urls: 918 }, { code: "5xx", urls: 306 }];
const DEPTH_STATUS = [{ depth: "0", "2xx": 1, "3xx": 0, "4xx": 0, "5xx": 0 }, { depth: "1", "2xx": 286, "3xx": 31, "4xx": 12, "5xx": 4 }, { depth: "2", "2xx": 2480, "3xx": 304, "4xx": 88, "5xx": 19 }, { depth: "3", "2xx": 6210, "3xx": 902, "4xx": 281, "5xx": 84 }, { depth: "4+", "2xx": 6143, "3xx": 851, "4xx": 537, "5xx": 199 }];

export function AuditRunOverview({ runId }: { runId: string }) {
  const run = AUDIT_RUNS.find((item) => item.id === runId) ?? AUDIT_RUNS[0];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <DashboardNav />
      <div className="lg:pl-56">
        <header className="sticky top-0 z-30 border-b border-border bg-background/85 backdrop-blur">
          <div className="space-y-5 px-6 py-5 lg:px-8">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
              <div className="flex items-start gap-3">
                <Button variant="ghost" size="icon" asChild aria-label="Back to audit runs"><Link to="/audit-runs"><ArrowLeft className="h-4 w-4" /></Link></Button>
                <div>
                  <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Project / Run</p>
                  <h1 className="mt-1 text-2xl font-bold tracking-tight">OrganicOS / {run.name}</h1>
                  <p className="mt-1 text-sm text-muted-foreground">{formatNumber(run.urlsCrawled)} URLs crawled · {run.lastRun}</p>
                </div>
              </div>
              <div className="flex flex-wrap items-end gap-2">
                <FilterSelect label="Crawl" value="Latest crawl" options={["Latest crawl", "Apr 25 crawl", "Apr 18 crawl", "Apr 11 crawl"]} />
                <FilterSelect label="Page type" value="All page types" options={["All page types", "Route pages", "Blog", "Category", "Product"]} />
                <Button><Plus className="h-4 w-4" /> New crawl</Button>
                <Button variant="outline" size="icon" asChild aria-label="Crawl settings">
                  <Link to="/audit-runs/$runId/settings" params={{ runId: run.id }}>
                    <Settings2 className="h-4 w-4" />
                  </Link>
                </Button>
                <ThemeToggle />
              </div>
            </div>
          </div>
        </header>

        <main className="space-y-6 px-6 py-6 lg:px-8">
          <section className="grid gap-4 xl:grid-cols-[1.25fr_0.75fr]">
            <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
              <div className="flex items-center justify-between gap-4">
                <div><p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Overview</p><h2 className="mt-1 text-lg font-semibold">Health score over time</h2></div>
                <HealthScore score={run.healthScore} />
              </div>
              <div className="mt-5 h-[280px]"><ResponsiveContainer width="100%" height="100%"><AreaChart data={HEALTH_TREND}><CartesianGrid stroke="var(--border)" vertical={false} /><XAxis dataKey="crawl" stroke="var(--muted-foreground)" fontSize={11} /><YAxis stroke="var(--muted-foreground)" fontSize={11} domain={[0, 100]} /><Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)" }} /><Area type="monotone" dataKey="score" stroke="var(--primary)" fill="var(--primary)" fillOpacity={0.12} strokeWidth={2} /></AreaChart></ResponsiveContainer></div>
            </div>
            <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
              <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Main health issues</p>
              <div className="mt-3 space-y-2">{MAIN_HEALTH_ISSUES.map((error) => <ErrorTrendCard key={error.name} runId={run.id} {...error} />)}</div>
            </div>
          </section>

          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <ScoreMiniCard title="Inventory score" value={92} change="+4.8%" dataKey="inventory" />
            <ScoreMiniCard title="Discovery score" value={86} change="+6.1%" dataKey="discovery" />
            <ScoreMiniCard title="Indexability score" value={84} change="+3.4%" dataKey="indexability" />
            <ScoreMiniCard title="Distribution score" value={82} change="+2.9%" dataKey="distribution" />
          </section>

          <section className="rounded-xl border border-border bg-card p-5 shadow-sm">
            <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">URL cascade</p>
            <h2 className="mt-1 text-lg font-semibold">Passed vs dropped URLs by segment</h2>
            <div className="mt-5 grid gap-3 lg:grid-cols-4">{FUNNEL_SEGMENTS.map((segment, index) => <FunnelSegment key={segment.name} segment={segment} index={index} />)}</div>
          </section>

          <section className="grid gap-4 xl:grid-cols-3">
            <IssueSummaryCard />
            <ChartCard title="Errors" subtitle="URLs with and without errors"><ResponsiveContainer width="100%" height={220}><BarChart data={[{ name: "With errors", urls: 2118 }, { name: "Without errors", urls: 16314 }]}><CartesianGrid stroke="var(--border)" vertical={false} /><XAxis dataKey="name" stroke="var(--muted-foreground)" fontSize={11} /><YAxis stroke="var(--muted-foreground)" fontSize={11} /><Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)" }} /><Bar dataKey="urls" fill="var(--primary)" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></ChartCard>
            <ChartCard title="HTTP status code" subtitle="Distribution of URLs by response class"><ResponsiveContainer width="100%" height={220}><BarChart data={STATUS_DISTRIBUTION}><CartesianGrid stroke="var(--border)" vertical={false} /><XAxis dataKey="code" stroke="var(--muted-foreground)" fontSize={11} /><YAxis stroke="var(--muted-foreground)" fontSize={11} /><Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)" }} /><Bar dataKey="urls" fill="var(--chart-3)" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></ChartCard>
          </section>

          <section className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
            <IssuesTable />
            <ChartCard title="HTTP status codes by depth level" subtitle="Response mix across crawl depth"><ResponsiveContainer width="100%" height={330}><BarChart data={DEPTH_STATUS}><CartesianGrid stroke="var(--border)" vertical={false} /><XAxis dataKey="depth" stroke="var(--muted-foreground)" fontSize={11} /><YAxis stroke="var(--muted-foreground)" fontSize={11} /><Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)" }} /><Bar dataKey="2xx" stackId="a" fill="var(--primary)" /><Bar dataKey="3xx" stackId="a" fill="var(--chart-3)" /><Bar dataKey="4xx" stackId="a" fill="var(--destructive)" opacity={0.75} /><Bar dataKey="5xx" stackId="a" fill="var(--destructive)" /></BarChart></ResponsiveContainer></ChartCard>
          </section>
        </main>
      </div>
    </div>
  );
}

function FilterSelect({ label, value, options }: { label: string; value: string; options: readonly string[] }) {
  return (
    <label className="space-y-1.5">
      <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">{label}</span>
      <select defaultValue={value} className="h-9 w-full min-w-[150px] rounded-md border border-input bg-background px-3 text-sm shadow-sm outline-none transition-colors focus:ring-1 focus:ring-ring">
        {options.map((option) => <option key={option} value={option}>{option}</option>)}
      </select>
    </label>
  );
}

function ErrorTrendCard({ id, runId, name, latest, data }: { id: string; runId: string; name: string; latest: number; data: Array<{ crawl: string; value: number }> }) {
  return <Link to="/audit-runs/$runId/issues/$issueId" params={{ runId, issueId: id }} className="block rounded-lg border border-border bg-surface/45 px-3 py-2 transition-colors hover:border-primary/30 hover:bg-surface focus:outline-none focus:ring-2 focus:ring-ring"><div className="flex items-center justify-between gap-3"><span className="text-xs font-medium text-foreground">{name}</span><span className="font-mono text-xs font-bold text-destructive">{latest}</span></div><div className="mt-2 h-9"><ResponsiveContainer width="100%" height="100%"><LineChart data={data}><Line type="monotone" dataKey="value" stroke="var(--destructive)" strokeWidth={2} dot={false} /></LineChart></ResponsiveContainer></div></Link>;
}

function ScoreMiniCard({ title, value, change, dataKey }: { title: string; value: number; change: string; dataKey: "inventory" | "discovery" | "indexability" | "distribution" }) {
  return <div className="rounded-xl border border-border bg-card p-5 shadow-sm"><div className="flex items-start justify-between gap-3"><div><p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">{title}</p><p className="mt-2 font-mono text-3xl font-bold text-foreground">{value}<span className="ml-1 text-sm text-muted-foreground">/100</span></p></div><span className="rounded-md border border-primary/25 bg-primary/10 px-2 py-1 font-mono text-xs text-primary">{change}</span></div><div className="mt-4 h-20"><ResponsiveContainer width="100%" height="100%"><LineChart data={HEALTH_TREND}><Line type="monotone" dataKey={dataKey} stroke="var(--primary)" strokeWidth={2} dot={false} /></LineChart></ResponsiveContainer></div></div>;
}

function FunnelSegment({ segment, index }: { segment: { name: string; total: number; left: number }; index: number }) {
  const retained = Math.round(((segment.total - segment.left) / segment.total) * 100);
  const passed = segment.total - segment.left;
  return <div className="relative overflow-hidden rounded-xl border border-border bg-surface/45 p-4">{index < FUNNEL_SEGMENTS.length - 1 && <ArrowRight className="absolute -right-5 top-1/2 z-10 hidden h-5 w-5 -translate-y-1/2 text-muted-foreground lg:block" />}<div className="flex items-start justify-between gap-3"><div><p className="font-semibold text-foreground">{segment.name}</p><p className="mt-1 text-xs text-muted-foreground">{retained}% continue</p></div><span className="rounded-md border border-primary/20 bg-primary/10 px-2 py-1 font-mono text-xs text-primary">{formatNumber(segment.total)}</span></div><div className="mt-4 grid overflow-hidden rounded-lg border border-border bg-background" style={{ gridTemplateColumns: `minmax(88px, ${Math.max(retained, 42)}fr) minmax(86px, ${Math.max(100 - retained, 28)}fr)` }}><div className="bg-primary/15 px-3 py-3"><p className="text-[10px] font-mono uppercase tracking-wider text-primary">Passed</p><p className="mt-1 font-mono text-lg font-bold text-primary">{formatNumber(passed)}</p></div><div className="border-l border-border bg-destructive/10 px-3 py-3 text-right"><p className="text-[10px] font-mono uppercase tracking-wider text-destructive">Dropped</p><p className="mt-1 font-mono text-lg font-bold text-destructive">{formatNumber(segment.left)}</p></div></div></div>;
}

function IssueSummaryCard() {
  return <div className="rounded-xl border border-border bg-card p-5 shadow-sm"><p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Issues</p><h2 className="mt-1 text-lg font-semibold">Issue totals</h2><div className="mt-5 grid gap-3"><IssueCount label="Errors" value="214" tone="danger" /><IssueCount label="Warnings" value="1,482" tone="warning" /><IssueCount label="Notices" value="3,906" tone="neutral" /></div></div>;
}

function IssueCount({ label, value, tone }: { label: string; value: string; tone: "danger" | "warning" | "neutral" }) {
  const toneClass = tone === "danger" ? "text-destructive" : tone === "warning" ? "text-chart-3" : "text-muted-foreground";
  return <div className="flex items-center justify-between rounded-lg border border-border bg-surface/45 px-4 py-3"><span className="text-sm text-muted-foreground">{label}</span><span className={`font-mono text-2xl font-bold ${toneClass}`}>{value}</span></div>;
}

function ChartCard({ title, subtitle, children }: { title: string; subtitle: string; children: ReactNode }) {
  return <div className="rounded-xl border border-border bg-card p-5 shadow-sm"><p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">{title}</p><h2 className="mt-1 text-lg font-semibold">{subtitle}</h2><div className="mt-4">{children}</div></div>;
}

function IssuesTable() {
  return <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm"><div className="border-b border-border p-5"><p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Issue movement</p><h2 className="mt-1 text-lg font-semibold">Issues by crawl change</h2></div><div className="overflow-x-auto"><table className="w-full min-w-[760px] text-sm"><thead><tr className="border-b border-border bg-surface/40 text-left text-[10px] font-mono uppercase tracking-wider text-muted-foreground"><th className="px-4 py-3">Issues</th><th className="px-4 py-3 text-right">Crawled</th><th className="px-4 py-3 text-right">Changed</th><th className="px-4 py-3 text-right">Added</th><th className="px-4 py-3 text-right">New</th><th className="px-4 py-3 text-right">Removed</th><th className="px-4 py-3 text-right">Missing</th></tr></thead><tbody>{ISSUE_ROWS.map((row) => <tr key={row.issue} className="border-b border-border last:border-0"><td className="px-4 py-3 font-medium text-foreground">{row.issue}</td><td className="px-4 py-3 text-right font-mono">{formatNumber(row.crawled)}</td><td className="px-4 py-3 text-right font-mono">{row.changed}</td><td className="px-4 py-3 text-right font-mono">{row.added}</td><td className="px-4 py-3 text-right font-mono text-destructive">{row.new}</td><td className="px-4 py-3 text-right font-mono text-primary">{row.removed}</td><td className="px-4 py-3 text-right font-mono">{row.missing}</td></tr>)}</tbody></table></div></div>;
}

function HealthScore({ score }: { score: number }) {
  const tone = score >= 80 ? "text-primary" : score >= 50 ? "text-chart-3" : "text-destructive";
  const bar = score >= 80 ? "bg-primary" : score >= 50 ? "bg-chart-3" : "bg-destructive";
  return <div className="w-[120px]"><div className="flex items-baseline gap-2"><span className={`font-mono text-2xl font-bold tabular-nums ${tone}`}>{score}</span><span className="font-mono text-[10px] text-muted-foreground">/100</span></div><div className="mt-1 h-1.5 rounded-full bg-surface"><div className={`h-full rounded-full ${bar}`} style={{ width: `${score}%` }} /></div></div>;
}

function formatNumber(value: number) {
  return new Intl.NumberFormat("en-GB").format(value);
}
