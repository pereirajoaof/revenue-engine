import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Filter, Search } from "lucide-react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { DashboardNav } from "@/components/dashboard/DashboardNav";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { MAIN_HEALTH_ISSUES, MAIN_HEALTH_ISSUE_URLS } from "@/components/audit-runs/AuditRunOverview";

export const Route = createFileRoute("/audit-runs_/$runId_/issues/$issueId")({
  component: AuditRunIssueRoute,
  head: () => ({
    meta: [
      { title: "Audit Issue Detail — OrganicOS" },
      { name: "description", content: "Inspect audit issue trends over time and the affected URL data for an OrganicOS crawl." },
      { property: "og:title", content: "Audit Issue Detail — OrganicOS" },
      { property: "og:description", content: "Issue trend chart and URL-level crawl data for an audit run." },
    ],
  }),
});

function AuditRunIssueRoute() {
  const { runId, issueId } = Route.useParams();
  const issue = MAIN_HEALTH_ISSUES.find((item) => item.id === issueId) ?? MAIN_HEALTH_ISSUES[0];
  const rows = MAIN_HEALTH_ISSUE_URLS.filter((row) => row.issueId === issue.id);

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
                <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Main health issue</p>
                <h1 className="mt-1 text-2xl font-bold tracking-tight">{issue.name}</h1>
                <p className="mt-1 text-sm text-muted-foreground">{issue.latest} affected URLs · {issue.impact} estimated revenue exposure</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline"><Filter className="h-4 w-4" /> Latest crawl</Button>
              <ThemeToggle />
            </div>
          </div>
        </header>

        <main className="space-y-6 px-6 py-6 lg:px-8">
          <section className="rounded-xl border border-border bg-card p-5 shadow-sm">
            <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Crawl history</p>
                <h2 className="mt-1 text-lg font-semibold">Affected URLs over time</h2>
              </div>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                <Metric label="Latest" value={issue.latest.toString()} tone="danger" />
                <Metric label="Recovered" value="22" tone="good" />
                <Metric label="New" value="7" tone="danger" />
              </div>
            </div>
            <div className="mt-6 h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={issue.data}>
                  <CartesianGrid stroke="var(--border)" vertical={false} />
                  <XAxis dataKey="crawl" stroke="var(--muted-foreground)" fontSize={11} />
                  <YAxis stroke="var(--muted-foreground)" fontSize={11} allowDecimals={false} />
                  <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)" }} />
                  <Area type="monotone" dataKey="value" name="Affected URLs" stroke="var(--destructive)" fill="var(--destructive)" fillOpacity={0.12} strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </section>

          <section className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
            <div className="flex flex-col gap-3 border-b border-border p-5 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">URL data</p>
                <h2 className="mt-1 text-lg font-semibold">Affected pages</h2>
              </div>
              <label className="flex h-9 min-w-[260px] items-center gap-2 rounded-md border border-input bg-background px-3 text-sm text-muted-foreground">
                <Search className="h-4 w-4" />
                <span>Word or phrase</span>
              </label>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[920px] text-sm">
                <thead>
                  <tr className="border-b border-border bg-surface/40 text-left text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                    <th className="px-4 py-3">URL</th>
                    <th className="px-4 py-3 text-right">Organic traffic</th>
                    <th className="px-4 py-3">HTTP status code</th>
                    <th className="px-4 py-3 text-right">Depth</th>
                    <th className="px-4 py-3 text-right">No. of inlinks</th>
                    <th className="px-4 py-3">First found at</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row) => (
                    <tr key={row.url} className="border-b border-border last:border-0">
                      <td className="max-w-[420px] px-4 py-4 font-medium text-primary"><span className="line-clamp-2 break-all">{row.url}</span></td>
                      <td className="px-4 py-4 text-right font-mono tabular-nums">{formatNumber(row.organicTraffic)}</td>
                      <td className="px-4 py-4"><span className="rounded-md bg-destructive/10 px-2 py-1 font-mono text-xs font-bold text-destructive">{row.status}</span></td>
                      <td className="px-4 py-4 text-right font-mono">{row.depth}</td>
                      <td className="px-4 py-4 text-right font-mono">{row.inlinks}</td>
                      <td className="px-4 py-4 font-mono text-muted-foreground">{row.firstFound}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

function Metric({ label, value, tone }: { label: string; value: string; tone: "good" | "danger" }) {
  return <div className="rounded-lg border border-border bg-surface/45 px-4 py-3"><p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">{label}</p><p className={`mt-1 font-mono text-xl font-bold ${tone === "good" ? "text-primary" : "text-destructive"}`}>{value}</p></div>;
}

function formatNumber(value: number) {
  return new Intl.NumberFormat("en-GB").format(value);
}