import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, CheckCircle2, CircleDot, Clock3, Info, Minus, ShieldCheck } from "lucide-react";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { DashboardNav } from "@/components/dashboard/DashboardNav";
import { ThemeToggle } from "@/components/ThemeToggle";

export const Route = createFileRoute("/brand-authority_/domain-age")({
  component: DomainAgePage,
  head: () => ({
    meta: [
      { title: "Domain Age — Brand Authority" },
      {
        name: "description",
        content: "Understand the Domain Age contribution to Brand Authority and why this score is already maximised.",
      },
      { property: "og:title", content: "Domain Age — Brand Authority" },
      {
        property: "og:description",
        content: "A contextual detail view showing domain age score, impact framing, history, and registration metadata.",
      },
    ],
  }),
});

const SCORE_HISTORY = [
  { month: "Oct", score: 100 },
  { month: "Nov", score: 100 },
  { month: "Dec", score: 100 },
  { month: "Jan", score: 100 },
  { month: "Feb", score: 100 },
  { month: "Mar", score: 100 },
];

const IMPACT_ROWS = [
  { label: "Impact on rankings", value: "Low", tone: "neutral" },
  { label: "Impact on trust signals", value: "High — already maximised", tone: "positive" },
  { label: "Impact on revenue opportunity", value: "None", tone: "neutral" },
] as const;

const BENCHMARKS = [
  { label: "You", value: "20 years", width: "100%", active: true },
  { label: "Competitor range", value: "8–15 years", width: "74%", active: false },
] as const;

function DomainAgePage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <DashboardNav />
      <div className="lg:pl-56">
        <header className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur">
          <div className="px-6 py-5 lg:px-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <Link to="/brand-authority" className="inline-flex items-center gap-2 text-[10px] font-mono uppercase tracking-wider text-muted-foreground transition-colors hover:text-primary">
                <ArrowLeft className="h-3.5 w-3.5" /> Brand Authority
              </Link>
              <h1 className="mt-1 text-2xl font-bold tracking-tight">Domain Age</h1>
            </div>
            <ThemeToggle />
          </div>
        </header>

        <main className="space-y-6 px-6 py-6 lg:px-8">
          <BrandAuthoritySectionNav />
          <section className="grid gap-4 xl:grid-cols-[360px_minmax(0,1fr)]">
            <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
              <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Domain Age Score</p>
              <div className="mt-4 flex items-end gap-3">
                <span className="font-mono text-7xl font-bold leading-none tabular-nums">100</span>
                <span className="mb-2 font-mono text-xl text-muted-foreground">/100</span>
              </div>
              <div className="mt-4 flex items-center gap-2 font-mono text-sm text-muted-foreground tabular-nums">
                <Minus className="h-4 w-4" /> +0.0
              </div>
              <div className="mt-6 inline-flex items-center gap-2 rounded-md border border-primary/20 bg-primary/10 px-3 py-2 text-sm font-medium text-primary">
                <CheckCircle2 className="h-4 w-4" /> Strong — no action required
              </div>
            </div>

            <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Context</p>
                  <h2 className="mt-1 text-lg font-semibold">This signal is already maxed out</h2>
                </div>
                <ShieldCheck className="h-5 w-5 text-primary" />
              </div>
              <div className="mt-6 grid gap-3 md:grid-cols-3">
                <Insight text="Your domain is 20.2 years old" />
                <Insight text="Domains older than 10 years typically receive maximum trust weighting" />
                <Insight text="Additional age has diminishing impact on rankings" />
              </div>
              <div className="mt-5 rounded-lg border border-border bg-surface/45 p-4 text-sm text-muted-foreground">
                This metric contributes <span className="font-mono font-bold text-foreground">6%</span> to your Brand Authority Score.
              </div>
            </div>
          </section>

          <section className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
            <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Score history</p>
                  <h2 className="mt-1 text-lg font-semibold">Stable over time (expected)</h2>
                </div>
                <Clock3 className="h-5 w-5 text-muted-foreground" />
              </div>
              <div className="h-[260px] rounded-lg border border-border bg-background/45 p-4">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={SCORE_HISTORY} margin={{ top: 16, right: 18, bottom: 2, left: 0 }}>
                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} />
                    <YAxis domain={[92, 102]} axisLine={false} tickLine={false} tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} width={34} />
                    <Tooltip content={<HistoryTooltip />} cursor={{ stroke: "var(--border)", strokeDasharray: "3 3" }} />
                    <Line type="monotone" dataKey="score" stroke="var(--chart-1)" strokeWidth={3} dot={false} activeDot={{ r: 5, fill: "var(--primary)", stroke: "var(--background)", strokeWidth: 2 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
              <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Impact on Growth</p>
              <h2 className="mt-1 text-lg font-semibold">Not a current bottleneck</h2>
              <div className="mt-5 space-y-3">
                {IMPACT_ROWS.map((row) => (
                  <div key={row.label} className="rounded-lg border border-border bg-surface/40 p-3">
                    <p className="text-xs text-muted-foreground">{row.label}</p>
                    <p className={`mt-1 font-mono text-sm font-bold ${row.tone === "positive" ? "text-primary" : "text-foreground"}`}>{row.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="grid gap-4 xl:grid-cols-3">
            <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
              <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Domain Registration Details</p>
              <dl className="mt-5 space-y-3">
                <Detail label="Domain age" value="20.2 years" />
                <Detail label="Registered" value="Jan 25, 2006" />
                <Detail label="Expiry" value="Jan 25, 2027" />
                <Detail label="Years remaining" value="0.8 years" />
              </dl>
            </div>

            <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
              <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Benchmark</p>
              <h2 className="mt-1 text-lg font-semibold">Older than the comparison set</h2>
              <div className="mt-5 space-y-4">
                {BENCHMARKS.map((item) => (
                  <div key={item.label}>
                    <div className="mb-1.5 flex items-center justify-between gap-3 text-xs">
                      <span className={item.active ? "font-medium" : "text-muted-foreground"}>{item.label}</span>
                      <span className="font-mono text-muted-foreground">{item.value}</span>
                    </div>
                    <div className="h-2 rounded-full bg-surface">
                      <div className={`h-2 rounded-full ${item.active ? "bg-primary" : "bg-muted-foreground/35"}`} style={{ width: item.width }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
              <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">When this matters</p>
              <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                <ContextItem text="Launching a new domain" />
                <ContextItem text="Migrating domains" />
                <ContextItem text="Rebranding" />
              </ul>
              <div className="my-5 border-t border-border" />
              <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">If score is low</p>
              <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                <ContextItem text="Focus on authority: links and brand demand" />
                <ContextItem text="Build trust through consistency" />
                <ContextItem text="Expect slower ramp-up" />
              </ul>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

function BrandAuthoritySectionNav() {
  const linkClass = "inline-flex h-8 items-center justify-center whitespace-nowrap rounded-md px-3 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground";

  return (
    <nav className="inline-flex h-9 items-center justify-center rounded-lg border border-border bg-surface p-1">
      <Link to="/brand-authority/domain-age" activeOptions={{ exact: true }} className={linkClass} activeProps={{ className: `${linkClass} bg-background text-foreground shadow` }}>
        Domain Age
      </Link>
      <Link to="/brand-authority/page-age" className={linkClass} activeProps={{ className: `${linkClass} bg-background text-foreground shadow` }}>
        Page Age
      </Link>
    </nav>
  );
}

function Insight({ text }: { text: string }) {
  return (
    <div className="rounded-lg border border-border bg-surface/40 p-4">
      <Info className="mb-3 h-4 w-4 text-muted-foreground" />
      <p className="text-sm leading-relaxed">{text}</p>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-border pb-3 last:border-b-0 last:pb-0">
      <dt className="text-sm text-muted-foreground">{label}</dt>
      <dd className="font-mono text-sm font-bold tabular-nums">{value}</dd>
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

function HistoryTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ value?: number }>; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-md border border-border bg-popover px-3 py-2 text-xs shadow-md">
      <p className="font-mono text-muted-foreground">{label}</p>
      <p className="mt-1 font-mono font-bold text-foreground">Score {payload[0].value}/100</p>
      <p className="mt-1 text-muted-foreground">No meaningful change expected</p>
    </div>
  );
}