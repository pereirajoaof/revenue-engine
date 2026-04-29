import { createFileRoute } from "@tanstack/react-router";
import { Info, ShieldCheck, TrendingUp } from "lucide-react";
import { Line, LineChart, ResponsiveContainer, Tooltip as ChartTooltip } from "recharts";
import { DashboardNav } from "@/components/dashboard/DashboardNav";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export const Route = createFileRoute("/brand-authority_/domain-authority")({
  component: DomainAuthorityPage,
  head: () => ({
    meta: [
      { title: "HostPageRank — Brand Authority" },
      { name: "description", content: "Track host-level domain authority, benchmark position, and movement drivers." },
      { property: "og:title", content: "HostPageRank — Brand Authority" },
      { property: "og:description", content: "A high-fidelity host authority view with score, movement signals, trend, and competitor benchmark." },
    ],
  }),
});

const score = 74;
const trend = [
  { month: "Oct", value: 61 },
  { month: "Nov", value: 64 },
  { month: "Dec", value: 66 },
  { month: "Jan", value: 69 },
  { month: "Feb", value: 72 },
  { month: "Mar", value: 74 },
];

const competitors = [
  { label: "Your Domain", value: 74, active: true },
  { label: "Competitor A", value: 82, active: false },
  { label: "Competitor B", value: 78, active: false },
  { label: "Competitor C", value: 71, active: false },
];

function DomainAuthorityPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <DashboardNav />
      <div className="lg:pl-56">
        <header className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur">
          <div className="flex flex-col gap-4 px-6 py-5 lg:flex-row lg:items-center lg:justify-between lg:px-8">
            <div>
              <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Growth driver · Brand Authority</p>
              <h1 className="mt-1 text-2xl font-bold tracking-tight">HostPageRank</h1>
            </div>
            <ThemeToggle />
          </div>
        </header>

        <main className="space-y-6 px-6 py-6 lg:px-8">
          <section className="grid gap-4 xl:grid-cols-[420px_minmax(0,1fr)]">
            <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Host-level score</p>
                  <h2 className="mt-1 text-lg font-semibold">Domain authority momentum</h2>
                </div>
                <WhyMovedTooltip />
              </div>
              <HeroGauge value={score} />
              <div className="mt-5 grid grid-cols-3 gap-3">
                <Signal label="External links" value="+2" tone="positive" />
                <Signal label="Spam risk" value="Low" tone="positive" />
                <Signal label="Domain age" value="Legacy" tone="neutral" />
              </div>
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">6 month trend</p>
                    <h2 className="mt-1 text-lg font-semibold">Steady authority gain</h2>
                  </div>
                  <TrendingUp className="h-5 w-5 text-chart-3" />
                </div>
                <div className="h-[220px] rounded-lg border border-border bg-background/45 p-3">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={trend} margin={{ top: 18, right: 12, bottom: 8, left: 12 }}>
                      <ChartTooltip content={<TrendTooltip />} cursor={{ stroke: "var(--border)", strokeDasharray: "3 3" }} />
                      <Line type="monotone" dataKey="value" stroke="var(--chart-3)" strokeWidth={3} dot={false} activeDot={{ r: 5, fill: "var(--chart-3)", stroke: "var(--background)", strokeWidth: 2 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
                <div className="mb-5 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Benchmarking</p>
                    <h2 className="mt-1 text-lg font-semibold">Your Domain vs. Top 3 Competitors</h2>
                  </div>
                  <ShieldCheck className="h-5 w-5 text-primary" />
                </div>
                <div className="space-y-4">
                  {competitors.map((item) => (
                    <div key={item.label}>
                      <div className="mb-1.5 flex items-center justify-between gap-3 text-xs">
                        <span className={item.active ? "font-semibold" : "text-muted-foreground"}>{item.label}</span>
                        <span className="font-mono font-bold tabular-nums">{item.value}/100</span>
                      </div>
                      <div className="h-2 rounded-full bg-surface">
                        <div className={item.active ? "h-2 rounded-full bg-chart-3" : "h-2 rounded-full bg-muted-foreground/35"} style={{ width: `${item.value}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

function HeroGauge({ value }: { value: number }) {
  const radius = 96;
  const circumference = 2 * Math.PI * radius;
  return (
    <div className="relative mx-auto mt-8 flex h-[260px] w-[260px] items-center justify-center">
      <svg viewBox="0 0 260 260" className="h-full w-full -rotate-90">
        <defs>
          <linearGradient id="host-rank-gradient" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="var(--chart-3)" />
            <stop offset="100%" stopColor="var(--primary)" />
          </linearGradient>
        </defs>
        <circle cx="130" cy="130" r={radius} fill="none" stroke="var(--surface)" strokeWidth="18" />
        <circle cx="130" cy="130" r={radius} fill="none" stroke="url(#host-rank-gradient)" strokeWidth="18" strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={circumference * (1 - value / 100)} />
      </svg>
      <div className="absolute text-center">
        <p className="font-mono text-6xl font-bold tabular-nums">{value}</p>
        <p className="mt-1 text-xs font-mono uppercase tracking-wider text-muted-foreground">/100 HostPageRank</p>
      </div>
    </div>
  );
}

function WhyMovedTooltip() {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger className="rounded-md border border-border bg-surface p-2 text-muted-foreground hover:text-foreground">
          <Info className="h-4 w-4" />
        </TooltipTrigger>
        <TooltipContent className="max-w-[240px] bg-popover text-popover-foreground">
          <p className="font-semibold">Signal breakdown</p>
          <p className="mt-1 text-xs text-muted-foreground">External Backlinks (+2), Spam Risk (Low), Domain Age (Legacy).</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

function Signal({ label, value, tone }: { label: string; value: string; tone: "positive" | "neutral" }) {
  return (
    <div className="rounded-lg border border-border bg-surface/40 p-3">
      <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className={tone === "positive" ? "mt-1 font-mono text-sm font-bold text-primary" : "mt-1 font-mono text-sm font-bold"}>{value}</p>
    </div>
  );
}

function TrendTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ value?: number }>; label?: string }) {
  if (!active || !payload?.length) return null;
  return <div className="rounded-md border border-border bg-popover px-3 py-2 text-xs shadow-md"><p className="font-mono text-muted-foreground">{label}</p><p className="mt-1 font-mono font-bold text-foreground">HostPageRank {payload[0].value}/100</p></div>;
}