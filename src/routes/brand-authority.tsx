import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  ArrowUpRight,
  BadgeInfo,
  ChevronRight,
  CircleDot,
  ExternalLink,
  Info,
  Link2,
  MousePointerClick,
  ShieldCheck,
  Sparkles,
  Target,
} from "lucide-react";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { DashboardNav } from "@/components/dashboard/DashboardNav";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

export const Route = createFileRoute("/brand-authority")({
  component: BrandAuthorityPage,
  head: () => ({
    meta: [
      { title: "Authority Dashboard — OrganicOS" },
      {
        name: "description",
        content:
          "Analyze host-level brand authority and page-level structural authority across SEO growth signals.",
      },
      { property: "og:title", content: "Authority Dashboard — OrganicOS" },
      {
        property: "og:description",
        content:
          "HostPageRank and structural authority dashboards for prioritizing SEO authority opportunities.",
      },
    ],
  }),
});

type Quadrant = "Hidden Gems" | "Dead Ends" | "Powerhouses" | "The Rot";
type UrlStatus = "Under-linked" | "High Potential" | "Authority Leak" | "Stable";
type AuthorityUrl = {
  url: string;
  score: number;
  topicalRelevance: number;
  internalLinks: number;
  ctr: number;
  equity: number;
  quadrant: Quadrant;
  status: UrlStatus;
  topicMatch: number;
  sending: { page: string; value: number }[];
  receiving: { page: string; value: number }[];
};

const hostTrend = [
  { month: "Jul", score: 64 },
  { month: "Aug", score: 67 },
  { month: "Sep", score: 66 },
  { month: "Oct", score: 70 },
  { month: "Nov", score: 73 },
  { month: "Dec", score: 78 },
];

const benchmark = [
  { domain: "Your domain", score: 78 },
  { domain: "Competitor A", score: 84 },
  { domain: "Competitor B", score: 72 },
  { domain: "Competitor C", score: 69 },
];

const authorityUrls: AuthorityUrl[] = [
  {
    url: "/routes/london-to-manchester",
    score: 86,
    topicalRelevance: 94,
    internalLinks: 128,
    ctr: 7.9,
    equity: 82,
    quadrant: "Powerhouses",
    status: "Stable",
    topicMatch: 91,
    sending: [
      { page: "/", value: 18 },
      { page: "/routes", value: 16 },
      { page: "/city/london", value: 14 },
      { page: "/city/manchester", value: 12 },
      { page: "/operators/national-express", value: 9 },
    ],
    receiving: [
      { page: "/stops/victoria-coach-station", value: 13 },
      { page: "/routes/london-to-birmingham", value: 11 },
      { page: "/routes/manchester-to-leeds", value: 10 },
      { page: "/tickets/coach", value: 7 },
      { page: "/help/tickets", value: 5 },
    ],
  },
  {
    url: "/city/leeds",
    score: 58,
    topicalRelevance: 88,
    internalLinks: 34,
    ctr: 6.4,
    equity: 38,
    quadrant: "Hidden Gems",
    status: "High Potential",
    topicMatch: 84,
    sending: [
      { page: "/routes/manchester-to-leeds", value: 10 },
      { page: "/routes/london-to-leeds", value: 9 },
      { page: "/city/manchester", value: 7 },
      { page: "/blog/cheap-north-routes", value: 5 },
      { page: "/operators/megabus", value: 4 },
    ],
    receiving: [
      { page: "/routes/leeds-to-york", value: 8 },
      { page: "/stops/leeds-bus-station", value: 7 },
      { page: "/routes/leeds-to-newcastle", value: 5 },
      { page: "/tickets/day-return", value: 4 },
      { page: "/help/luggage-rules", value: 3 },
    ],
  },
  {
    url: "/blog/old-timetable-guide",
    score: 72,
    topicalRelevance: 41,
    internalLinks: 96,
    ctr: 1.2,
    equity: 74,
    quadrant: "Dead Ends",
    status: "Authority Leak",
    topicMatch: 46,
    sending: [
      { page: "/blog", value: 13 },
      { page: "/guides", value: 11 },
      { page: "/help/timetables", value: 10 },
      { page: "/routes", value: 8 },
      { page: "/city/birmingham", value: 6 },
    ],
    receiving: [
      { page: "/help/timetables", value: 9 },
      { page: "/blog/best-days-out-uk", value: 7 },
      { page: "/blog/cheap-weekend-routes", value: 6 },
      { page: "/help/refunds", value: 4 },
      { page: "/support", value: 3 },
    ],
  },
  {
    url: "/help/luggage-rules",
    score: 24,
    topicalRelevance: 37,
    internalLinks: 18,
    ctr: 0.8,
    equity: 22,
    quadrant: "The Rot",
    status: "Under-linked",
    topicMatch: 39,
    sending: [
      { page: "/help", value: 8 },
      { page: "/support", value: 6 },
      { page: "/tickets/coach", value: 4 },
      { page: "/routes", value: 3 },
      { page: "/", value: 2 },
    ],
    receiving: [
      { page: "/help/coach-travel", value: 5 },
      { page: "/help/accessibility", value: 4 },
      { page: "/help/tickets", value: 3 },
      { page: "/support/contact", value: 2 },
      { page: "/terms", value: 1 },
    ],
  },
  {
    url: "/routes/airport-transfers",
    score: 63,
    topicalRelevance: 91,
    internalLinks: 46,
    ctr: 7.1,
    equity: 43,
    quadrant: "Hidden Gems",
    status: "High Potential",
    topicMatch: 87,
    sending: [
      { page: "/routes", value: 12 },
      { page: "/city/london", value: 10 },
      { page: "/stops/heathrow", value: 8 },
      { page: "/stops/gatwick", value: 7 },
      { page: "/operators/national-express", value: 5 },
    ],
    receiving: [
      { page: "/routes/london-to-heathrow", value: 10 },
      { page: "/routes/london-to-gatwick", value: 9 },
      { page: "/stops/airport", value: 7 },
      { page: "/tickets/airport", value: 4 },
      { page: "/help/airport-luggage", value: 3 },
    ],
  },
  {
    url: "/poi/stonehenge-day-trip",
    score: 31,
    topicalRelevance: 52,
    internalLinks: 22,
    ctr: 1.7,
    equity: 29,
    quadrant: "The Rot",
    status: "Under-linked",
    topicMatch: 44,
    sending: [
      { page: "/blog/best-days-out-uk", value: 10 },
      { page: "/poi", value: 7 },
      { page: "/city/salisbury", value: 5 },
      { page: "/blog/weekend-trips", value: 4 },
      { page: "/routes", value: 2 },
    ],
    receiving: [
      { page: "/blog/day-trips-by-coach", value: 6 },
      { page: "/routes/london-to-salisbury", value: 5 },
      { page: "/poi/bath-day-trip", value: 3 },
      { page: "/tickets/coach", value: 2 },
      { page: "/help/group-bookings", value: 1 },
    ],
  },
  {
    url: "/operator/national-express",
    score: 81,
    topicalRelevance: 78,
    internalLinks: 118,
    ctr: 3.2,
    equity: 79,
    quadrant: "Dead Ends",
    status: "Authority Leak",
    topicMatch: 73,
    sending: [
      { page: "/operators", value: 17 },
      { page: "/routes", value: 15 },
      { page: "/", value: 12 },
      { page: "/tickets/coach", value: 9 },
      { page: "/city/london", value: 8 },
    ],
    receiving: [
      { page: "/routes/london-to-manchester", value: 13 },
      { page: "/routes/london-to-birmingham", value: 11 },
      { page: "/stops/victoria-coach-station", value: 9 },
      { page: "/help/national-express", value: 5 },
      { page: "/operators/megabus", value: 4 },
    ],
  },
  {
    url: "/routes/edinburgh-to-glasgow",
    score: 79,
    topicalRelevance: 92,
    internalLinks: 91,
    ctr: 6.8,
    equity: 77,
    quadrant: "Powerhouses",
    status: "Stable",
    topicMatch: 89,
    sending: [
      { page: "/routes", value: 16 },
      { page: "/city/edinburgh", value: 13 },
      { page: "/city/glasgow", value: 12 },
      { page: "/operators/scottish-citylink", value: 9 },
      { page: "/tickets/coach", value: 6 },
    ],
    receiving: [
      { page: "/stops/edinburgh-bus-station", value: 11 },
      { page: "/stops/glasgow-buchanan", value: 10 },
      { page: "/routes/glasgow-to-aberdeen", value: 8 },
      { page: "/city/scotland", value: 6 },
      { page: "/help/timetables", value: 3 },
    ],
  },
];

function BrandAuthorityPage() {
  const [selectedQuadrant, setSelectedQuadrant] = useState<Quadrant | "All">("All");
  const [selectedUrl, setSelectedUrl] = useState<AuthorityUrl | null>(null);
  const filteredUrls = useMemo(
    () =>
      authorityUrls.filter(
        (row) => selectedQuadrant === "All" || row.quadrant === selectedQuadrant,
      ),
    [selectedQuadrant],
  );

  return (
    <div className="dark min-h-screen bg-background text-foreground">
      <DashboardNav />
      <div className="lg:pl-56">
        <header className="sticky top-0 z-30 border-b border-border bg-background/85 backdrop-blur">
          <div className="flex flex-col gap-4 px-6 py-5 lg:flex-row lg:items-center lg:justify-between lg:px-8">
            <div>
              <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                SEO Authority Tool
              </p>
              <h1 className="mt-1 text-2xl font-bold tracking-tight">Authority Intelligence</h1>
            </div>
            <div className="flex items-center gap-2">
              <Badge
                variant="outline"
                className="border-primary/25 bg-primary/10 font-mono text-primary"
              >
                Live model
              </Badge>
              <ThemeToggle />
            </div>
          </div>
        </header>

        <main className="space-y-6 px-6 py-6 lg:px-8">
          <HostPageRankCard />
          <StructuralAuthorityDashboard
            rows={filteredUrls}
            selectedQuadrant={selectedQuadrant}
            onQuadrant={setSelectedQuadrant}
            onSelectUrl={setSelectedUrl}
          />
        </main>
      </div>
      <EquityDrawer url={selectedUrl} onOpenChange={(open) => !open && setSelectedUrl(null)} />
    </div>
  );
}

function HostPageRankCard() {
  const score = 78;
  return (
    <section className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
            View 1 · Brand Authority
          </p>
          <h2 className="mt-1 text-xl font-semibold">HostPageRank</h2>
        </div>
        <WhyItMovedTooltip />
      </div>

      <div className="grid gap-5 xl:grid-cols-[360px_minmax(0,1fr)_360px]">
        <div className="flex items-center justify-center rounded-lg border border-border bg-background/45 p-5">
          <RadialGauge score={score} />
        </div>

        <div className="rounded-lg border border-border bg-background/45 p-5">
          <div className="mb-3 flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold">6-month movement</p>
              <p className="text-xs text-muted-foreground">Host-level authority trend</p>
            </div>
            <span className="inline-flex items-center gap-1 rounded-md border border-primary/20 bg-primary/10 px-2 py-1 font-mono text-xs text-primary">
              <ArrowUpRight className="h-3.5 w-3.5" /> +14 pts
            </span>
          </div>
          <ResponsiveContainer width="100%" height={230}>
            <LineChart data={hostTrend} margin={{ top: 12, right: 12, bottom: 4, left: 0 }}>
              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
              />
              <YAxis
                domain={[50, 90]}
                axisLine={false}
                tickLine={false}
                tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
                width={30}
              />
              <Tooltip
                content={<MiniTooltip />}
                cursor={{ stroke: "var(--border)", strokeDasharray: "3 3" }}
              />
              <Line
                type="monotone"
                dataKey="score"
                stroke="var(--chart-3)"
                strokeWidth={3}
                dot={{ r: 3, fill: "var(--chart-3)" }}
                activeDot={{ r: 6, stroke: "var(--background)", strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-lg border border-border bg-background/45 p-5">
          <p className="text-sm font-semibold">Benchmarking</p>
          <p className="mt-1 text-xs text-muted-foreground">Your Domain vs. Top 3 Competitors</p>
          <div className="mt-5 space-y-4">
            {benchmark.map((item) => (
              <div key={item.domain}>
                <div className="mb-1.5 flex items-center justify-between gap-3 text-xs">
                  <span
                    className={
                      item.domain === "Your domain"
                        ? "font-semibold text-foreground"
                        : "text-muted-foreground"
                    }
                  >
                    {item.domain}
                  </span>
                  <span className="font-mono tabular-nums">{item.score}</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-surface">
                  <div
                    className="h-full rounded-full bg-primary"
                    style={{
                      width: `${item.score}%`,
                      background:
                        item.domain === "Your domain"
                          ? "linear-gradient(90deg, var(--chart-3), var(--primary))"
                          : "var(--muted-foreground)",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function RadialGauge({ score }: { score: number }) {
  const radius = 96;
  const circumference = 2 * Math.PI * radius;
  const dash = (score / 100) * circumference;
  return (
    <div className="relative grid h-[300px] w-[300px] place-items-center">
      <svg
        viewBox="0 0 260 260"
        className="h-full w-full -rotate-90"
        role="img"
        aria-label={`HostPageRank ${score} out of 100`}
      >
        <defs>
          <linearGradient id="hostGauge" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--chart-3)" />
            <stop offset="100%" stopColor="var(--primary)" />
          </linearGradient>
        </defs>
        <circle cx="130" cy="130" r={radius} fill="none" stroke="var(--surface)" strokeWidth="18" />
        <circle
          cx="130"
          cy="130"
          r={radius}
          fill="none"
          stroke="url(#hostGauge)"
          strokeWidth="18"
          strokeLinecap="round"
          strokeDasharray={`${dash} ${circumference - dash}`}
        />
      </svg>
      <div className="absolute text-center">
        <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
          HostPageRank
        </p>
        <p className="mt-2 font-mono text-6xl font-bold tabular-nums">{score}</p>
        <p className="mt-2 text-sm text-muted-foreground">Strong host authority</p>
      </div>
    </div>
  );
}

function WhyItMovedTooltip() {
  return (
    <div className="group relative inline-flex w-fit">
      <button
        type="button"
        className="inline-flex items-center gap-2 rounded-md border border-border bg-surface px-3 py-2 text-xs font-semibold transition-colors hover:bg-card"
      >
        <Info className="h-4 w-4 text-primary" /> Why it moved
      </button>
      <div className="pointer-events-none absolute right-0 top-11 z-20 w-72 rounded-lg border border-border bg-popover p-4 text-sm opacity-0 shadow-xl transition-opacity group-hover:opacity-100">
        <p className="font-semibold">Signal breakdown</p>
        <div className="mt-3 space-y-2 text-xs">
          <SignalRow label="External Backlinks" value="+2" tone="text-primary" />
          <SignalRow label="Spam Risk" value="Low" tone="text-primary" />
          <SignalRow label="Domain Age" value="Legacy" tone="text-chart-3" />
        </div>
      </div>
    </div>
  );
}

function StructuralAuthorityDashboard({
  rows,
  selectedQuadrant,
  onQuadrant,
  onSelectUrl,
}: {
  rows: AuthorityUrl[];
  selectedQuadrant: Quadrant | "All";
  onQuadrant: (quadrant: Quadrant | "All") => void;
  onSelectUrl: (url: AuthorityUrl) => void;
}) {
  return (
    <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(540px,0.9fr)]">
      <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
        <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
              View 2 · Website Authority
            </p>
            <h2 className="mt-1 text-xl font-semibold">Structural Authority</h2>
          </div>
          <button
            type="button"
            onClick={() => onQuadrant("All")}
            className={`rounded-md border px-3 py-1.5 text-xs font-semibold transition-colors ${selectedQuadrant === "All" ? "border-primary/25 bg-primary/10 text-primary" : "border-border bg-surface text-muted-foreground hover:text-foreground"}`}
          >
            All URLs
          </button>
        </div>
        <OpportunityMatrix
          rows={authorityUrls}
          selectedQuadrant={selectedQuadrant}
          onQuadrant={onQuadrant}
        />
      </div>

      <UrlAnalysisTable rows={rows} selectedQuadrant={selectedQuadrant} onSelectUrl={onSelectUrl} />
    </section>
  );
}

function OpportunityMatrix({
  rows,
  selectedQuadrant,
  onQuadrant,
}: {
  rows: AuthorityUrl[];
  selectedQuadrant: Quadrant | "All";
  onQuadrant: (quadrant: Quadrant) => void;
}) {
  const quadrants: { name: Quadrant; x: number; y: number; align: string }[] = [
    { name: "Hidden Gems", x: 170, y: 72, align: "start" },
    { name: "Powerhouses", x: 650, y: 72, align: "end" },
    { name: "The Rot", x: 170, y: 390, align: "start" },
    { name: "Dead Ends", x: 650, y: 390, align: "end" },
  ];
  return (
    <svg
      viewBox="0 0 820 500"
      className="h-[520px] w-full rounded-lg border border-border bg-background/45"
      role="img"
      aria-label="Opportunity matrix scatter plot"
    >
      <rect x="70" y="40" width="680" height="400" rx="8" fill="var(--card)" opacity="0.32" />
      <line x1="410" y1="40" x2="410" y2="440" stroke="var(--border)" strokeDasharray="6 6" />
      <line x1="70" y1="240" x2="750" y2="240" stroke="var(--border)" strokeDasharray="6 6" />
      {quadrants.map((quadrant) => (
        <g key={quadrant.name} onClick={() => onQuadrant(quadrant.name)} className="cursor-pointer">
          <rect
            x={quadrant.x < 410 ? 70 : 410}
            y={quadrant.y < 240 ? 40 : 240}
            width="340"
            height="200"
            fill={selectedQuadrant === quadrant.name ? "var(--primary)" : "transparent"}
            opacity="0.08"
          />
          <text
            x={quadrant.x}
            y={quadrant.y}
            textAnchor={quadrant.align === "end" ? "end" : "start"}
            className="fill-foreground text-[15px] font-semibold"
          >
            {quadrant.name}
          </text>
        </g>
      ))}
      <text
        x="410"
        y="486"
        textAnchor="middle"
        className="fill-muted-foreground text-[12px] font-mono"
      >
        Internal Equity Score
      </text>
      <text
        x="22"
        y="240"
        transform="rotate(-90 22 240)"
        textAnchor="middle"
        className="fill-muted-foreground text-[12px] font-mono"
      >
        CTR
      </text>
      <text x="70" y="462" className="fill-muted-foreground text-[10px] font-mono">
        Low
      </text>
      <text x="730" y="462" className="fill-muted-foreground text-[10px] font-mono">
        High
      </text>
      <text x="42" y="438" className="fill-muted-foreground text-[10px] font-mono">
        Low
      </text>
      <text x="40" y="48" className="fill-muted-foreground text-[10px] font-mono">
        High
      </text>
      {rows.map((row) => {
        const cx = 70 + (row.equity / 100) * 680;
        const cy = 440 - (row.ctr / 9) * 400;
        return (
          <g key={row.url} className="cursor-pointer" onClick={() => onQuadrant(row.quadrant)}>
            <title>{`${row.url}\nEquity: ${row.equity}\nCTR: ${row.ctr}%\n${row.quadrant}`}</title>
            <circle
              cx={cx}
              cy={cy}
              r={7 + row.score / 22}
              fill={statusColor(row.status)}
              opacity="0.82"
              stroke="var(--background)"
              strokeWidth="2"
            />
          </g>
        );
      })}
    </svg>
  );
}

function UrlAnalysisTable({
  rows,
  selectedQuadrant,
  onSelectUrl,
}: {
  rows: AuthorityUrl[];
  selectedQuadrant: Quadrant | "All";
  onSelectUrl: (url: AuthorityUrl) => void;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold">URL Analysis Table</p>
          <p className="text-xs text-muted-foreground">
            {selectedQuadrant === "All" ? "All quadrants" : selectedQuadrant} · {rows.length} URLs
          </p>
        </div>
        <MousePointerClick className="h-4 w-4 text-primary" />
      </div>
      <div className="overflow-hidden rounded-lg border border-border">
        <table className="w-full text-sm">
          <thead className="bg-surface/60 text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="px-3 py-3 text-left font-medium">URL</th>
              <th className="px-3 py-3 text-right font-medium">Authority</th>
              <th className="px-3 py-3 text-right font-medium">Topical</th>
              <th className="px-3 py-3 text-right font-medium">Links</th>
              <th className="px-3 py-3 text-right font-medium">CTR</th>
              <th className="px-3 py-3 text-left font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr
                key={row.url}
                onClick={() => onSelectUrl(row)}
                className="cursor-pointer border-t border-border transition-colors hover:bg-surface/45"
              >
                <td className="max-w-[210px] truncate px-3 py-3 font-mono text-xs">{row.url}</td>
                <td className="px-3 py-3 text-right font-mono font-bold tabular-nums">
                  {row.score}
                </td>
                <td className="px-3 py-3 text-right font-mono tabular-nums">
                  {row.topicalRelevance}%
                </td>
                <td className="px-3 py-3 text-right font-mono tabular-nums">{row.internalLinks}</td>
                <td className="px-3 py-3 text-right font-mono text-primary tabular-nums">
                  {row.ctr}%
                </td>
                <td className="px-3 py-3">
                  <StatusBadge status={row.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function EquityDrawer({
  url,
  onOpenChange,
}: {
  url: AuthorityUrl | null;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Sheet open={Boolean(url)} onOpenChange={onOpenChange}>
      <SheetContent className="w-full overflow-y-auto border-border bg-card sm:max-w-xl">
        {url && (
          <>
            <SheetHeader className="pr-8">
              <SheetTitle className="font-mono text-base">{url.url}</SheetTitle>
              <SheetDescription>Equity Flow and topical match diagnostics</SheetDescription>
            </SheetHeader>
            <div className="mt-6 space-y-5">
              <div className="rounded-lg border border-border bg-background/45 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold">Topical Match</p>
                    <p className="text-xs text-muted-foreground">
                      Relevance of links to the page core topic
                    </p>
                  </div>
                  <span className="font-mono text-2xl font-bold text-primary">
                    {url.topicMatch}%
                  </span>
                </div>
                <div className="mt-4 h-2 overflow-hidden rounded-full bg-surface">
                  <div
                    className="h-full rounded-full bg-primary"
                    style={{ width: `${url.topicMatch}%` }}
                  />
                </div>
              </div>
              <FlowList
                title="Top 5 pages sending equity"
                icon={<ExternalLink className="h-4 w-4" />}
                items={url.sending}
              />
              <FlowList
                title="Top 5 pages receiving equity"
                icon={<Link2 className="h-4 w-4" />}
                items={url.receiving}
              />
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}

function FlowList({
  title,
  icon,
  items,
}: {
  title: string;
  icon: React.ReactNode;
  items: { page: string; value: number }[];
}) {
  return (
    <div className="rounded-lg border border-border bg-background/45 p-4">
      <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground">
        {icon}
        {title}
      </div>
      <div className="space-y-2">
        {items.map((item) => (
          <div
            key={item.page}
            className="flex items-center justify-between gap-3 rounded-md bg-surface/50 px-3 py-2"
          >
            <span className="truncate font-mono text-xs text-muted-foreground">{item.page}</span>
            <span className="font-mono text-xs font-bold text-primary">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: UrlStatus }) {
  const classes: Record<UrlStatus, string> = {
    "Under-linked": "border-border bg-surface text-muted-foreground",
    "High Potential": "border-primary/20 bg-primary/10 text-primary",
    "Authority Leak": "border-chart-4/30 bg-chart-4/10 text-chart-4",
    Stable: "border-chart-3/25 bg-chart-3/10 text-chart-3",
  };
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-md border px-2 py-1 text-[10px] font-mono uppercase tracking-wider ${classes[status]}`}
    >
      <CircleDot className="h-3 w-3" />
      {status}
    </span>
  );
}

function SignalRow({ label, value, tone }: { label: string; value: string; tone: string }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-md bg-surface/50 px-3 py-2">
      <span className="text-muted-foreground">{label}</span>
      <span className={`font-mono font-bold ${tone}`}>{value}</span>
    </div>
  );
}

function MiniTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ value?: number }>;
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-md border border-border bg-popover px-3 py-2 text-xs shadow-md">
      <p className="font-mono text-muted-foreground">{label}</p>
      <p className="mt-1 font-mono font-bold text-foreground">HostPageRank {payload[0].value}</p>
    </div>
  );
}

function statusColor(status: UrlStatus) {
  if (status === "High Potential") return "var(--primary)";
  if (status === "Authority Leak") return "var(--chart-4)";
  if (status === "Stable") return "var(--chart-3)";
  return "var(--muted-foreground)";
}
