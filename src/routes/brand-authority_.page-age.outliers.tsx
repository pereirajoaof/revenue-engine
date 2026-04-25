import { createFileRoute } from "@tanstack/react-router";
import { AlertTriangle, CheckCircle2, Download, Filter, Flag, Search, Target } from "lucide-react";
import { useMemo, useState } from "react";
import { DashboardNav } from "@/components/dashboard/DashboardNav";
import { ThemeToggle } from "@/components/ThemeToggle";

export const Route = createFileRoute("/brand-authority_/page-age/outliers")({
  component: PageAgeOutliersPage,
  head: () => ({
    meta: [
      { title: "Page Age Outliers — Brand Authority" },
      { name: "description", content: "Review page-age CTR outliers, red flags, green flags, and export URL-level data for SEO and product teams." },
      { property: "og:title", content: "Page Age Outliers — Brand Authority" },
      { property: "og:description", content: "A URL-level table for identifying page-age CTR outliers and prioritising lifecycle actions." },
    ],
  }),
});

const GROUPS = ["All groups", "New", "Recent", "Established", "Mature", "Legacy"] as const;
const FLAGS = ["All flags", "Green flag", "Red flag"] as const;

const OUTLIER_ROWS = [
  { group: "New", url: "/routes/london-to-manchester", flag: "Green flag", ctr: 6.8, avgCtr: 1.4, clicks: 1280, impressions: 18824, position: 4.2, owner: "SEO", opportunity: "Scale pattern", action: "Replicate title format and internal links across similar route pages", note: "Early traction from strong demand match" },
  { group: "New", url: "/blog/cheap-weekend-routes", flag: "Red flag", ctr: 0.3, avgCtr: 1.4, clicks: 45, impressions: 15000, position: 8.8, owner: "Content", opportunity: "Fix snippet", action: "Rewrite title/meta around sharper travel intent", note: "High impressions with weak SERP pull" },
  { group: "Recent", url: "/stops/victoria-coach-station", flag: "Green flag", ctr: 5.4, avgCtr: 2.1, clicks: 432, impressions: 8000, position: 5.1, owner: "SEO", opportunity: "Protect winner", action: "Add contextual links from London route hubs", note: "Brand-adjacent query is lifting clicks" },
  { group: "Recent", url: "/routes/bristol-to-bath", flag: "Red flag", ctr: 0.7, avgCtr: 2.1, clicks: 84, impressions: 12000, position: 9.4, owner: "PM", opportunity: "Improve intent fit", action: "Check route availability, pricing modules, and SERP title promise", note: "Ranking but not earning clicks yet" },
  { group: "Established", url: "/city/birmingham", flag: "Green flag", ctr: 8.1, avgCtr: 3.8, clicks: 1701, impressions: 21000, position: 3.9, owner: "SEO", opportunity: "Template learning", action: "Use this page as a city-page benchmark", note: "Snippet and intent alignment look strong" },
  { group: "Established", url: "/operator/national-express", flag: "Red flag", ctr: 1.5, avgCtr: 3.8, clicks: 510, impressions: 34000, position: 6.8, owner: "PM", opportunity: "SERP feature loss", action: "Review rich results, FAQs, and operator comparison modules", note: "Likely losing clicks to richer results" },
  { group: "Mature", url: "/routes/edinburgh-to-glasgow", flag: "Green flag", ctr: 10.6, avgCtr: 5.2, clicks: 3816, impressions: 36000, position: 2.7, owner: "SEO", opportunity: "Maintain authority", action: "Keep updated and defend internal-link prominence", note: "Compounding authority is converting well" },
  { group: "Mature", url: "/city/leeds", flag: "Red flag", ctr: 2.0, avgCtr: 5.2, clicks: 760, impressions: 38000, position: 7.2, owner: "Content", opportunity: "Refresh candidate", action: "Refresh intro, transport options, and above-the-fold CTA", note: "Refresh candidate despite mature age" },
  { group: "Legacy", url: "/routes/airport-transfers", flag: "Green flag", ctr: 7.2, avgCtr: 3.6, clicks: 2016, impressions: 28000, position: 4.4, owner: "SEO", opportunity: "Evergreen defence", action: "Monitor competitors and preserve URL history", note: "Evergreen page still outperforming" },
  { group: "Legacy", url: "/blog/old-timetable-guide", flag: "Red flag", ctr: 0.9, avgCtr: 3.6, clicks: 171, impressions: 19000, position: 10.1, owner: "Content", opportunity: "Decay risk", action: "Update, consolidate, or redirect if intent is outdated", note: "Potential decay or outdated intent" },
] as const;

function PageAgeOutliersPage() {
  const [group, setGroup] = useState<(typeof GROUPS)[number]>("All groups");
  const [flag, setFlag] = useState<(typeof FLAGS)[number]>("All flags");
  const filtered = useMemo(() => OUTLIER_ROWS.filter((row) => (group === "All groups" || row.group === group) && (flag === "All flags" || row.flag === flag)), [group, flag]);
  const biggestWinner = OUTLIER_ROWS.reduce((best, row) => (row.ctr - row.avgCtr > best.ctr - best.avgCtr ? row : best), OUTLIER_ROWS[0]);
  const biggestRisk = OUTLIER_ROWS.reduce((worst, row) => (row.ctr - row.avgCtr < worst.ctr - worst.avgCtr ? row : worst), OUTLIER_ROWS[0]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <DashboardNav />
      <div className="lg:pl-56">
        <header className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur">
          <div className="flex flex-col gap-4 px-6 py-5 lg:flex-row lg:items-center lg:justify-between lg:px-8">
            <div>
              <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Growth driver · Brand Authority</p>
              <h1 className="mt-1 text-2xl font-bold tracking-tight">Page Age Outliers</h1>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button type="button" onClick={() => exportCsv(filtered)} className="inline-flex items-center gap-2 rounded-md border border-border bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground transition-colors hover:bg-primary/90">
                <Download className="h-3.5 w-3.5" /> Export CSV
              </button>
              <ThemeToggle />
            </div>
          </div>
        </header>

        <main className="space-y-6 px-6 py-6 lg:px-8">
          <section className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_380px]">
            <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Page maturity intelligence</p>
                  <h2 className="mt-2 max-w-3xl text-2xl font-bold tracking-tight">URL-level CTR outliers for prioritising SEO and product work</h2>
                  <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground">Compare each URL against its age-group average to separate pages worth replicating from pages that need snippet, intent, or lifecycle intervention.</p>
                </div>
                <Target className="h-6 w-6 shrink-0 text-primary" />
              </div>
              <div className="mt-6 grid gap-3 md:grid-cols-3">
                <SummaryCard label="Tracked outliers" value={OUTLIER_ROWS.length.toString()} detail="Across all age groups" />
                <SummaryCard label="Green flags" value={OUTLIER_ROWS.filter((row) => row.flag === "Green flag").length.toString()} detail="Patterns to replicate" tone="positive" />
                <SummaryCard label="Red flags" value={OUTLIER_ROWS.filter((row) => row.flag === "Red flag").length.toString()} detail="Pages needing review" tone="risk" />
              </div>
            </div>

            <div className="grid gap-4">
              <SpotlightCard title="Biggest green flag" row={biggestWinner} icon={<CheckCircle2 className="h-5 w-5 text-primary" />} />
              <SpotlightCard title="Biggest red flag" row={biggestRisk} icon={<AlertTriangle className="h-5 w-5 text-destructive" />} />
            </div>
          </section>

          <section className="rounded-xl border border-border bg-card p-5 shadow-sm">
            <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">URL-level outlier table</p>
                <h2 className="mt-1 text-lg font-semibold">CTR winners and risks by page maturity</h2>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <FilterSelect value={group} options={GROUPS} onChange={setGroup} />
                <FilterSelect value={flag} options={FLAGS} onChange={setFlag} />
              </div>
            </div>
            <div className="mb-4 flex flex-wrap gap-2">
              {GROUPS.slice(1).map((item) => (
                <button key={item} type="button" onClick={() => setGroup(item)} className={`rounded-md border px-3 py-1.5 text-xs font-mono transition-colors ${group === item ? "border-primary bg-primary/10 text-primary" : "border-border bg-surface/45 text-muted-foreground hover:text-foreground"}`}>{item}</button>
              ))}
            </div>
            <div className="overflow-x-auto rounded-lg border border-border">
              <table className="w-full min-w-[1120px] border-collapse text-left text-sm">
                <thead className="bg-surface/70 text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                  <tr>
                    <Th>Age group</Th><Th>URL</Th><Th>Flag</Th><Th>CTR</Th><Th>Avg CTR</Th><Th>Delta</Th><Th>Clicks</Th><Th>Impr.</Th><Th>Pos.</Th><Th>Owner</Th><Th>Action</Th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((row) => <OutlierTableRow key={row.url} row={row} />)}
                </tbody>
              </table>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

function SummaryCard({ label, value, detail, tone = "neutral" }: { label: string; value: string; detail: string; tone?: "neutral" | "positive" | "risk" }) {
  return <div className="rounded-lg border border-border bg-surface/40 p-4"><p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">{label}</p><p className={`mt-2 font-mono text-3xl font-bold ${tone === "positive" ? "text-primary" : tone === "risk" ? "text-destructive" : "text-foreground"}`}>{value}</p><p className="mt-1 text-sm text-muted-foreground">{detail}</p></div>;
}

function SpotlightCard({ title, row, icon }: { title: string; row: (typeof OUTLIER_ROWS)[number]; icon: React.ReactNode }) {
  const delta = row.ctr - row.avgCtr;
  return <div className="rounded-xl border border-border bg-card p-5 shadow-sm"><div className="flex items-start justify-between gap-3"><div><p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">{title}</p><h3 className="mt-1 break-all font-mono text-sm font-bold">{row.url}</h3></div>{icon}</div><div className="mt-4 grid grid-cols-3 gap-2 rounded-lg border border-border bg-surface/40 p-3"><Metric label="CTR" value={`${row.ctr}%`} /><Metric label="Avg" value={`${row.avgCtr}%`} /><Metric label="Delta" value={`${delta > 0 ? "+" : ""}${delta.toFixed(1)}pp`} tone={delta > 0 ? "positive" : "risk"} /></div><p className="mt-3 text-sm text-muted-foreground">{row.action}</p></div>;
}

function Metric({ label, value, tone = "neutral" }: { label: string; value: string; tone?: "neutral" | "positive" | "risk" }) {
  return <div><p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">{label}</p><p className={`mt-1 font-mono text-sm font-bold ${tone === "positive" ? "text-primary" : tone === "risk" ? "text-destructive" : "text-foreground"}`}>{value}</p></div>;
}

function FilterSelect<T extends string>({ value, options, onChange }: { value: T; options: readonly T[]; onChange: (value: T) => void }) {
  return <label className="inline-flex items-center gap-2 rounded-md border border-border bg-surface px-3 py-1.5 text-xs"><Filter className="h-3.5 w-3.5 text-muted-foreground" /><select value={value} onChange={(event) => onChange(event.target.value as T)} className="bg-transparent outline-none"><option className="bg-popover">{value}</option>{options.filter((option) => option !== value).map((option) => <option key={option} className="bg-popover">{option}</option>)}</select></label>;
}

function OutlierTableRow({ row }: { row: (typeof OUTLIER_ROWS)[number] }) {
  const delta = row.ctr - row.avgCtr;
  return <tr className="border-t border-border align-top transition-colors hover:bg-surface/35"><Td mono><span className="rounded-md bg-surface px-2 py-1">{row.group}</span></Td><Td><div className="flex items-center gap-2"><Search className="h-3.5 w-3.5 shrink-0 text-muted-foreground" /><span className="font-mono text-xs font-semibold">{row.url}</span></div><p className="mt-1 text-xs text-muted-foreground">{row.note}</p></Td><Td><span className={`inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-semibold ${row.flag === "Green flag" ? "bg-primary/10 text-primary" : "bg-destructive/10 text-destructive"}`}><Flag className="h-3 w-3" />{row.flag}</span></Td><Td mono>{row.ctr}%</Td><Td mono>{row.avgCtr}%</Td><Td mono className={delta > 0 ? "font-bold text-primary" : "font-bold text-destructive"}>{delta > 0 ? "+" : ""}{delta.toFixed(1)}pp</Td><Td mono>{row.clicks.toLocaleString()}</Td><Td mono>{row.impressions.toLocaleString()}</Td><Td mono>{row.position.toFixed(1)}</Td><Td><span className="rounded-md border border-border bg-surface/60 px-2 py-1 text-xs">{row.owner}</span></Td><Td><div className="max-w-[280px]"><p className="text-sm font-medium">{row.opportunity}</p><p className="mt-1 text-sm text-muted-foreground">{row.action}</p></div></Td></tr>;
}

function Th({ children }: { children: React.ReactNode }) {
  return <th className="px-3 py-3 font-medium">{children}</th>;
}

function Td({ children, mono, className = "" }: { children: React.ReactNode; mono?: boolean; className?: string }) {
  return <td className={`px-3 py-3 ${mono ? "font-mono text-xs tabular-nums" : ""} ${className}`}>{children}</td>;
}

function exportCsv(rows: readonly (typeof OUTLIER_ROWS)[number][]) {
  const headers = ["Age group", "URL", "Flag", "CTR", "Average CTR", "Delta pp", "Clicks", "Impressions", "Position", "Owner", "Opportunity", "Recommended action", "Note"];
  const body = rows.map((row) => [row.group, row.url, row.flag, row.ctr, row.avgCtr, (row.ctr - row.avgCtr).toFixed(1), row.clicks, row.impressions, row.position, row.owner, row.opportunity, row.action, row.note]);
  const csv = [headers, ...body].map((cells) => cells.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")).join("\n");
  const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8;" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = "page-age-outliers.csv";
  link.click();
  URL.revokeObjectURL(url);
}