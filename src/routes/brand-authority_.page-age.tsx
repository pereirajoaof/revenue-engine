import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ArrowUpRight, Calendar, ChevronDown, CircleDot, LineChart as LineChartIcon, TriangleAlert } from "lucide-react";
import { Area, AreaChart, Bar, BarChart, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { DashboardNav } from "@/components/dashboard/DashboardNav";
import { ThemeToggle } from "@/components/ThemeToggle";

export const Route = createFileRoute("/brand-authority_/page-age")({
  component: PageAgePage,
  head: () => ({
    meta: [
      { title: "Page Age — Brand Authority" },
      { name: "description", content: "Assess content lifecycle health by page age distribution, maturity, ranking stability, and revenue impact." },
      { property: "og:title", content: "Page Age — Brand Authority" },
      { property: "og:description", content: "A lifecycle intelligence dashboard showing whether content age is balanced enough to drive rankings and revenue." },
    ],
  }),
});

const RANGES = ["7d", "30d", "90d"] as const;
const PAGE_TYPES = ["All page types", "Routes", "Stops", "City", "Operator", "Blog"];
const FOLDERS = ["All folders", "/routes/", "/stops/", "/cities/", "/blog/"];

type Range = (typeof RANGES)[number];

const AGE_DISTRIBUTION = [
  { bucket: "New", range: "0–30d", percent: 60, count: 329, tone: "risk" },
  { bucket: "Recent", range: "31–90d", percent: 1, count: 5, tone: "neutral" },
  { bucket: "Established", range: "91–365d", percent: 8, count: 44, tone: "neutral" },
  { bucket: "Mature", range: "1–3y", percent: 22, count: 121, tone: "positive" },
  { bucket: "Legacy", range: "3y+", percent: 9, count: 50, tone: "neutral" },
] as const;

const TREND_DATA = [
  { month: "Oct", newPages: 38, maturePages: 41 },
  { month: "Nov", newPages: 43, maturePages: 38 },
  { month: "Dec", newPages: 49, maturePages: 35 },
  { month: "Jan", newPages: 54, maturePages: 33 },
  { month: "Feb", newPages: 58, maturePages: 32 },
  { month: "Mar", newPages: 60, maturePages: 31 },
];

const KPI_DETAILS: ReadonlyArray<{ label: string; value: string; note: string; warning?: boolean }> = [
  { label: "Avg page age", value: "1.2y", note: "Mean looks healthy" },
  { label: "Median page age", value: "12d", note: "Important contrast", warning: true },
  { label: "Total tracked pages", value: "549", note: "Across selected scope" },
] as const;

const IMPACT_ROWS = [
  { label: "Ranking stability", value: "Low", detail: "Too many URLs are still proving themselves", tone: "risk" },
  { label: "Authority accumulation", value: "Weak", detail: "Mature pages are underrepresented", tone: "risk" },
  { label: "Content decay risk", value: "Medium", detail: "Legacy set is small but needs refresh discipline", tone: "neutral" },
  { label: "Estimated revenue impact", value: "£42k", detail: "Opportunity tied to lifecycle imbalance", tone: "neutral" },
] as const;

function PageAgePage() {
  const [range, setRange] = useState<Range>("90d");
  const [pageType, setPageType] = useState(PAGE_TYPES[0]);
  const [folder, setFolder] = useState(FOLDERS[0]);
  const score = 72;
  const delta = 3.2;
  const dominantNew = AGE_DISTRIBUTION[0].percent;
  const matureShare = AGE_DISTRIBUTION[3].percent + AGE_DISTRIBUTION[4].percent;
  const diagnosis = dominantNew > 50 ? "Unbalanced — too many new pages" : matureShare >= 45 ? "Healthy distribution of content age" : "Content is aging — risk of decay";

  const scopedDistribution = useMemo(() => AGE_DISTRIBUTION, [range, pageType, folder]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <DashboardNav />
      <div className="lg:pl-56">
        <header className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur">
          <div className="flex flex-col gap-4 px-6 py-5 lg:flex-row lg:items-center lg:justify-between lg:px-8">
            <div>
              <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Growth driver · Brand Authority</p>
              <h1 className="mt-1 text-2xl font-bold tracking-tight">Page Age</h1>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <RangeFilter value={range} onChange={setRange} />
              <FilterMenu label="Page Type" value={pageType} options={PAGE_TYPES} onChange={setPageType} />
              <FilterMenu label="Folder" value={folder} options={FOLDERS} onChange={setFolder} />
              <ThemeToggle />
            </div>
          </div>
        </header>

        <main className="space-y-6 px-6 py-6 lg:px-8">
          <section className="grid gap-4 xl:grid-cols-[360px_minmax(0,1fr)]">
            <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
              <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Page Age Score</p>
              <div className="mt-4 flex items-end gap-3">
                <span className="font-mono text-7xl font-bold leading-none tabular-nums">{score}</span>
                <span className="mb-2 font-mono text-xl text-muted-foreground">/100</span>
              </div>
              <div className="mt-4 flex items-center gap-1 font-mono text-sm font-bold text-primary tabular-nums">
                <ArrowUpRight className="h-4 w-4" /> +{delta}
              </div>
              <div className="mt-6 inline-flex items-center gap-2 rounded-md border border-destructive/20 bg-destructive/10 px-3 py-2 text-sm font-medium text-destructive">
                <TriangleAlert className="h-4 w-4" /> {diagnosis}
              </div>
            </div>

            <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
              <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Lifecycle insight</p>
              <h2 className="mt-1 text-lg font-semibold">Publishing velocity is outpacing authority build-up</h2>
              <div className="mt-6 grid gap-3 md:grid-cols-3">
                <Insight text="60% of your pages are under 30 days old" />
                <Insight text="Median page age is 12 days — indicates aggressive publishing" />
                <Insight text="Mature content (1+ year) is underrepresented" />
              </div>
              <div className="mt-5 rounded-lg border border-border bg-surface/45 p-4 text-sm text-muted-foreground">
                This metric contributes <span className="font-mono font-bold text-foreground">11%</span> to your Brand Authority Score.
              </div>
            </div>
          </section>

          <section className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
            <AgeDistributionChart data={scopedDistribution} />
            <KpiGrid />
          </section>

          <section className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
            <TrendChart />
            <ImpactPanel />
          </section>

          <section className="grid gap-4 xl:grid-cols-3">
            <DiagnosisPanel />
            <BenchmarkPanel />
            <ActionsPanel />
          </section>
        </main>
      </div>
    </div>
  );
}

function RangeFilter({ value, onChange }: { value: Range; onChange: (value: Range) => void }) {
  return (
    <div className="flex items-center rounded-md border border-border bg-surface p-0.5">
      <Calendar className="ml-2 h-3.5 w-3.5 text-muted-foreground" />
      {RANGES.map((item) => (
        <button key={item} type="button" onClick={() => onChange(item)} className={`rounded-sm px-3 py-1.5 text-xs font-mono transition-colors ${value === item ? "bg-card text-foreground" : "text-muted-foreground hover:text-foreground"}`}>
          {item === "7d" ? "Last 7d" : item === "30d" ? "Last 30d" : "Last 90d"}
        </button>
      ))}
    </div>
  );
}

function FilterMenu({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (value: string) => void }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button type="button" onClick={() => setOpen((v) => !v)} className="inline-flex items-center gap-2 rounded-md border border-border bg-surface px-3 py-1.5 text-xs transition-colors hover:bg-card">
        <span className="font-mono text-muted-foreground">{label}:</span>
        <span>{value}</span>
        <ChevronDown className="h-3 w-3 text-muted-foreground" />
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

function AgeDistributionChart({ data }: { data: ReadonlyArray<(typeof AGE_DISTRIBUTION)[number]> }) {
  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Age distribution</p>
          <h2 className="mt-1 text-lg font-semibold">Most pages are too new to carry authority</h2>
        </div>
        <TriangleAlert className="h-5 w-5 text-destructive" />
      </div>
      <div className="h-[300px] rounded-lg border border-border bg-background/45 p-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={[...data]} margin={{ top: 16, right: 18, bottom: 4, left: 0 }}>
            <XAxis dataKey="bucket" axisLine={false} tickLine={false} tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} />
            <YAxis axisLine={false} tickLine={false} tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} width={34} tickFormatter={(value) => `${value}%`} />
            <Tooltip content={<DistributionTooltip />} cursor={{ fill: "var(--surface)" }} />
            <Bar dataKey="percent" radius={[6, 6, 0, 0]}>
              {data.map((entry) => (
                <Cell key={entry.bucket} fill={entry.tone === "risk" ? "var(--destructive)" : entry.tone === "positive" ? "var(--chart-1)" : "var(--chart-3)"} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function KpiGrid() {
  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Page age details</p>
      <div className="mt-5 grid gap-3">
        {KPI_DETAILS.map((item) => (
          <div key={item.label} className="rounded-lg border border-border bg-surface/40 p-3">
            <div className="flex items-center justify-between gap-4">
              <p className="text-sm text-muted-foreground">{item.label}</p>
              <p className={`font-mono text-lg font-bold tabular-nums ${item.warning ? "text-destructive" : "text-foreground"}`}>{item.value}</p>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">{item.note}</p>
          </div>
        ))}
      </div>
      <div className="mt-5 space-y-3">
        {AGE_DISTRIBUTION.map((item) => (
          <DistributionRow key={item.bucket} label={item.bucket} percent={item.percent} warning={item.percent >= 50} />
        ))}
      </div>
    </div>
  );
}

function DistributionRow({ label, percent, warning }: { label: string; percent: number; warning?: boolean }) {
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between gap-3 text-xs">
        <span className="text-muted-foreground">{label}</span>
        <span className={`font-mono font-bold ${warning ? "text-destructive" : "text-foreground"}`}>{percent}%</span>
      </div>
      <div className="h-2 rounded-full bg-surface">
        <div className={`h-2 rounded-full ${warning ? "bg-destructive" : "bg-primary"}`} style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}

function TrendChart() {
  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Lifecycle trend</p>
          <h2 className="mt-1 text-lg font-semibold">The site is constantly resetting</h2>
        </div>
        <LineChartIcon className="h-5 w-5 text-primary" />
      </div>
      <div className="h-[280px] rounded-lg border border-border bg-background/45 p-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={TREND_DATA} margin={{ top: 16, right: 18, bottom: 4, left: 0 }}>
            <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} />
            <YAxis axisLine={false} tickLine={false} tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} width={34} tickFormatter={(value) => `${value}%`} />
            <Tooltip content={<TrendTooltip />} cursor={{ stroke: "var(--border)", strokeDasharray: "3 3" }} />
            <Area type="monotone" dataKey="newPages" name="New pages" stroke="var(--chart-5)" fill="var(--chart-5)" fillOpacity={0.18} strokeWidth={2} />
            <Area type="monotone" dataKey="maturePages" name="Mature pages" stroke="var(--chart-1)" fill="var(--chart-1)" fillOpacity={0.14} strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function ImpactPanel() {
  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Impact on Rankings & Revenue</p>
      <h2 className="mt-1 text-lg font-semibold">Imbalance is limiting upside</h2>
      <div className="mt-5 space-y-3">
        {IMPACT_ROWS.map((row) => (
          <div key={row.label} className="rounded-lg border border-border bg-surface/40 p-3">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm text-muted-foreground">{row.label}</p>
                <p className="mt-1 text-xs text-muted-foreground">{row.detail}</p>
              </div>
              <p className={`font-mono text-sm font-bold ${row.tone === "risk" ? "text-destructive" : "text-foreground"}`}>{row.value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function DiagnosisPanel() {
  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">What’s happening</p>
      <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
        <ContextItem text="Your site is heavily skewed toward newly published content" />
        <ContextItem text="Low proportion of mature pages limits authority accumulation" />
        <ContextItem text="Median age suggests most pages don’t survive long enough to rank" />
      </ul>
    </div>
  );
}

function BenchmarkPanel() {
  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Benchmark vs similar sites</p>
      <h2 className="mt-1 text-lg font-semibold">Mature content gap</h2>
      <div className="mt-5 space-y-4">
        <BenchmarkBar label="Your mature pages" value="31%" width="31%" active />
        <BenchmarkBar label="Top competitors" value="55–70%" width="70%" />
      </div>
    </div>
  );
}

function ActionsPanel() {
  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Content strategy actions</p>
      <ActionGroup title="If too many new pages" items={["Slow down low-quality publishing", "Prioritise updating existing pages", "Ensure internal linking to new pages"]} />
      <ActionGroup title="If not enough mature pages" items={["Keep content alive longer", "Refresh instead of replacing URLs", "Consolidate overlapping content"]} />
      <ActionGroup title="If too many old pages" items={["Prune or merge outdated content", "Refresh high-potential legacy pages", "Improve internal linking to revive them"]} />
    </div>
  );
}

function ActionGroup({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="mt-4 border-t border-border pt-4 first:border-t-0 first:pt-0">
      <h3 className="text-sm font-semibold">{title}</h3>
      <ul className="mt-2 space-y-1.5 text-sm text-muted-foreground">
        {items.map((item) => <ContextItem key={item} text={item} />)}
      </ul>
    </div>
  );
}

function Insight({ text }: { text: string }) {
  return (
    <div className="rounded-lg border border-border bg-surface/40 p-4">
      <p className="text-sm leading-relaxed">{text}</p>
    </div>
  );
}

function ContextItem({ text }: { text: string }) {
  return (
    <li className="flex gap-2">
      <CircleDot className="mt-1 h-3.5 w-3.5 shrink-0 text-muted-foreground" />
      <span>{text}</span>
    </li>
  );
}

function BenchmarkBar({ label, value, width, active }: { label: string; value: string; width: string; active?: boolean }) {
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between gap-3 text-xs">
        <span className={active ? "font-medium" : "text-muted-foreground"}>{label}</span>
        <span className="font-mono text-muted-foreground">{value}</span>
      </div>
      <div className="h-2 rounded-full bg-surface">
        <div className={`h-2 rounded-full ${active ? "bg-destructive" : "bg-primary"}`} style={{ width }} />
      </div>
    </div>
  );
}

function DistributionTooltip({ active, payload }: { active?: boolean; payload?: Array<{ payload?: { bucket: string; range: string; percent: number; count: number } }> }) {
  if (!active || !payload?.length || !payload[0].payload) return null;
  const item = payload[0].payload;
  return (
    <div className="rounded-md border border-border bg-popover px-3 py-2 text-xs shadow-md">
      <p className="font-mono font-bold text-foreground">{item.bucket} · {item.range}</p>
      <p className="mt-1 text-muted-foreground">{item.percent}% of pages</p>
      <p className="font-mono text-muted-foreground">{item.count.toLocaleString()} pages</p>
    </div>
  );
}

function TrendTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ name?: string; value?: number }>; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-md border border-border bg-popover px-3 py-2 text-xs shadow-md">
      <p className="font-mono font-bold text-foreground">{label}</p>
      {payload.map((item) => (
        <p key={item.name} className="mt-1 text-muted-foreground">{item.name}: <span className="font-mono text-foreground">{item.value}%</span></p>
      ))}
    </div>
  );
}