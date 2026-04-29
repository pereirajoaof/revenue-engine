import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Activity,
  ArrowRight,
  BrainCircuit,
  CalendarClock,
  Compass,
  FileSearch,
  Gauge,
  GitBranch,
  Heading1,
  Link2,
  ListChecks,
  Map,
  Network,
  SearchCheck,
  Settings,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import {
  Line,
  LineChart,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  RadialBar,
  RadialBarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const Route = createFileRoute("/website-authority/")({
  component: WebsiteAuthorityPage,
  head: () => ({
    meta: [
      { title: "Website Authority Intelligence — OrganicOS" },
      {
        name: "description",
        content: "Page-level SEO authority intelligence across quality, PageRank, semantic retrieval, matching, and topical context.",
      },
      { property: "og:title", content: "Website Authority Intelligence — OrganicOS" },
      {
        property: "og:description",
        content: "A clean, data-dense dashboard for diagnosing page-level SEO authority and internal equity signals.",
      },
    ],
  }),
});

const HERO_METRICS = [
  { label: "Page Quality Score", value: 86, delta: "+4.8", icon: ShieldCheck, tone: "var(--chart-3)", note: "Template strength" },
  { label: "PageRank", value: 72, delta: "+2.1", icon: Network, tone: "var(--primary)", note: "Internal equity" },
  { label: "Origin Score", value: 64, delta: "-1.6", icon: Compass, tone: "var(--chart-4)", note: "Source authority" },
  { label: "NSR", value: 91, delta: "+7.3", icon: BrainCircuit, tone: "var(--chart-2)", note: "Semantic retrieval" },
];

const MATCH_METRICS = [
  { label: "Title Match Score", value: 88, icon: Heading1, copy: "H1 and meta title reinforce the same search intent.", status: "Strong" },
  { label: "Body Match Score", value: 76, icon: FileSearch, copy: "Content depth covers most expected entities and modifiers.", status: "Healthy" },
  { label: "Snippet Match Score", value: 69, icon: SearchCheck, copy: "SERP preview is relevant, but benefit language is thin.", status: "Watch" },
  { label: "Anchor Match Score", value: 58, icon: Link2, copy: "Inbound anchors under-describe this page’s core topic.", status: "Leak" },
];

const RADAR_DATA = [
  { niche: "Routes", score: 92 },
  { niche: "Operators", score: 81 },
  { niche: "Cities", score: 74 },
  { niche: "Stations", score: 68 },
  { niche: "Tickets", score: 83 },
  { niche: "Guides", score: 57 },
];

const LAB_DATA = [
  { week: "W1", score: 58 },
  { week: "W2", score: 61 },
  { week: "W3", score: 63 },
  { week: "W4", score: 67 },
  { week: "W5", score: 72 },
  { week: "W6", score: 78 },
  { week: "W7", score: 83 },
  { week: "W8", score: 87 },
];

const HISTORY = [
  { date: "Today 09:42", score: "86", label: "Full crawl" },
  { date: "Yesterday", score: "82", label: "Template deploy" },
  { date: "Apr 24", score: "79", label: "Internal links" },
  { date: "Apr 18", score: "74", label: "Content refresh" },
];

function WebsiteAuthorityPage() {
  return (
    <main className="grid gap-6 px-6 py-6 lg:grid-cols-[minmax(0,1fr)_280px] lg:px-8">
      <div className="min-w-0 space-y-6">
        <section className="flex flex-col gap-4 rounded-xl border border-border bg-card p-5 shadow-sm lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-md border border-primary/20 bg-primary/10 px-2.5 py-1 text-[10px] font-mono uppercase tracking-wider text-primary">
              <Sparkles className="h-3.5 w-3.5" /> Page-level analysis
            </div>
            <h2 className="mt-4 text-2xl font-bold tracking-tight md:text-3xl">Website Authority Intelligence</h2>
            <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
              Diagnose how well individual pages earn, retain, and convert authority across structural, semantic, and matching-engine signals.
            </p>
          </div>
          <Link to="/website-authority/internal-equity" className="inline-flex items-center justify-center gap-2 rounded-md border border-border bg-surface px-3 py-2 text-sm font-medium transition-colors hover:bg-card">
            Internal Equity <ArrowRight className="h-4 w-4" />
          </Link>
        </section>

        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {HERO_METRICS.map((metric) => (
            <HeroMetricCard key={metric.label} {...metric} />
          ))}
        </section>

        <Tabs defaultValue="matrix" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3 lg:w-[520px]">
            <TabsTrigger value="matrix">Match Matrix</TabsTrigger>
            <TabsTrigger value="context">Authority & Context</TabsTrigger>
            <TabsTrigger value="lab">Lab</TabsTrigger>
          </TabsList>

          <TabsContent value="matrix" className="mt-0">
            <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
              {MATCH_METRICS.map((metric) => (
                <MatchCard key={metric.label} {...metric} />
              ))}
            </section>
          </TabsContent>

          <TabsContent value="context" className="mt-0">
            <section className="grid grid-cols-1 gap-4 xl:grid-cols-3">
              <LocalPagerankCard />
              <TopicalAuthorityCard />
              <SemanticScoreCard />
            </section>
          </TabsContent>

          <TabsContent value="lab" className="mt-0">
            <LabCard />
          </TabsContent>
        </Tabs>
      </div>

      <aside className="space-y-4">
        <Card className="rounded-xl shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm"><CalendarClock className="h-4 w-4 text-primary" /> History of Checks</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {HISTORY.map((item) => (
              <button key={item.date} type="button" className="w-full rounded-lg border border-border bg-surface/35 p-3 text-left transition-colors hover:bg-surface">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-xs text-muted-foreground">{item.date}</span>
                  <span className="font-mono text-sm font-bold tabular-nums">{item.score}</span>
                </div>
                <p className="mt-1 text-sm font-medium">{item.label}</p>
              </button>
            ))}
          </CardContent>
        </Card>

        <Card className="rounded-xl shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm"><Settings className="h-4 w-4 text-primary" /> Project Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <SettingRow label="Primary market" value="United Kingdom" />
            <SettingRow label="Page type" value="Route pages" />
            <SettingRow label="Canonical topic" value="Coach routes" />
            <SettingRow label="Model" value="NSR v0.8" />
          </CardContent>
        </Card>
      </aside>
    </main>
  );
}

function HeroMetricCard({ label, value, delta, icon: Icon, tone, note }: (typeof HERO_METRICS)[number]) {
  return (
    <Card className="rounded-xl shadow-sm">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">{label}</p>
            <p className="mt-2 font-mono text-3xl font-bold tabular-nums">{value}<span className="text-sm text-muted-foreground">/100</span></p>
          </div>
          <Icon className="h-5 w-5 text-primary" />
        </div>
        <div className="mt-3 h-28">
          <ResponsiveContainer width="100%" height="100%">
            <RadialBarChart innerRadius="72%" outerRadius="100%" data={[{ value }]} startAngle={90} endAngle={90 - (value / 100) * 360}>
              <RadialBar dataKey="value" cornerRadius={8} fill={tone} background={{ fill: "var(--muted)" }} />
            </RadialBarChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-3 flex items-center justify-between gap-3 text-xs">
          <span className="text-muted-foreground">{note}</span>
          <Badge variant="outline" className={delta.startsWith("+") ? "border-primary/20 bg-primary/10 text-primary" : "border-chart-4/30 bg-chart-4/10 text-chart-4"}>{delta}%</Badge>
        </div>
      </CardContent>
    </Card>
  );
}

function MatchCard({ label, value, icon: Icon, copy, status }: (typeof MATCH_METRICS)[number]) {
  const tone = value >= 80 ? "text-primary" : value >= 65 ? "text-chart-3" : "text-chart-4";
  return (
    <Card className="rounded-xl shadow-sm">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          <Icon className="h-5 w-5 text-primary" />
          <Badge variant="outline" className="border-border bg-surface text-foreground">{status}</Badge>
        </div>
        <p className="mt-4 text-sm font-semibold">{label}</p>
        <div className="mt-3 flex items-center gap-3">
          <Progress value={value} className="h-2" />
          <span className={`font-mono text-sm font-bold tabular-nums ${tone}`}>{value}</span>
        </div>
        <p className="mt-3 text-xs leading-relaxed text-muted-foreground">{copy}</p>
      </CardContent>
    </Card>
  );
}

function LocalPagerankCard() {
  return (
    <Card className="rounded-xl shadow-sm">
      <CardHeader className="pb-3"><CardTitle className="flex items-center gap-2 text-sm"><Map className="h-4 w-4 text-primary" /> Local PageRank</CardTitle></CardHeader>
      <CardContent>
        <div className="grid grid-cols-5 gap-1.5">
          {Array.from({ length: 35 }).map((_, index) => {
            const intensity = ["bg-surface", "bg-primary/20", "bg-primary/35", "bg-chart-3/35", "bg-chart-4/35"][index % 5];
            return <div key={index} className={`aspect-square rounded ${intensity}`} />;
          })}
        </div>
        <p className="mt-4 text-xs text-muted-foreground">Cluster strength is concentrated around route and ticket hubs, with weaker support on station templates.</p>
      </CardContent>
    </Card>
  );
}

function TopicalAuthorityCard() {
  return (
    <Card className="rounded-xl shadow-sm">
      <CardHeader className="pb-3"><CardTitle className="flex items-center gap-2 text-sm"><GitBranch className="h-4 w-4 text-primary" /> Topical Authority</CardTitle></CardHeader>
      <CardContent>
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={RADAR_DATA} outerRadius="72%">
              <PolarGrid stroke="var(--border)" />
              <PolarAngleAxis dataKey="niche" tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} />
              <PolarRadiusAxis angle={90} domain={[0, 100]} tick={false} axisLine={false} />
              <Radar dataKey="score" stroke="var(--primary)" fill="var(--primary)" fillOpacity={0.22} strokeWidth={2} />
              <Tooltip content={<SimpleTooltip />} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

function SemanticScoreCard() {
  return (
    <Card className="rounded-xl shadow-sm">
      <CardHeader className="pb-3"><CardTitle className="flex items-center gap-2 text-sm"><BrainCircuit className="h-4 w-4 text-primary" /> Semantic Score</CardTitle></CardHeader>
      <CardContent>
        <div className="flex items-center justify-center py-2">
          <div className="relative h-44 w-44">
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart innerRadius="68%" outerRadius="98%" data={[{ value: 84 }]} startAngle={210} endAngle={-30}>
                <RadialBar dataKey="value" cornerRadius={8} fill="var(--chart-2)" background={{ fill: "var(--muted)" }} />
              </RadialBarChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="font-mono text-4xl font-bold tabular-nums">84</span>
              <span className="text-xs text-muted-foreground">NLP fit</span>
            </div>
          </div>
        </div>
        <p className="text-xs text-muted-foreground">Entity coverage is strong; LSI variation can improve around pricing, timetable, and operator modifiers.</p>
      </CardContent>
    </Card>
  );
}

function LabCard() {
  return (
    <Card className="rounded-xl shadow-sm">
      <CardHeader className="flex flex-row items-start justify-between gap-4 pb-3">
        <div>
          <CardTitle className="flex items-center gap-2 text-sm"><Activity className="h-4 w-4 text-primary" /> Experimental Quality Score</CardTitle>
          <p className="mt-1 text-xs text-muted-foreground">Projected lift if authority leaks and semantic gaps are resolved.</p>
        </div>
        <Badge variant="outline" className="border-primary/20 bg-primary/10 text-primary">Beta</Badge>
      </CardHeader>
      <CardContent>
        <div className="grid gap-5 lg:grid-cols-[220px_minmax(0,1fr)]">
          <div className="rounded-lg border border-border bg-surface/35 p-4">
            <ListChecks className="h-5 w-5 text-primary" />
            <p className="mt-4 font-mono text-5xl font-bold tabular-nums">87</p>
            <p className="mt-2 text-xs text-muted-foreground">Predicted quality score after next crawl</p>
          </div>
          <div className="h-64 rounded-lg border border-border bg-background/45 p-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={LAB_DATA} margin={{ top: 10, right: 12, bottom: 4, left: 0 }}>
                <XAxis dataKey="week" axisLine={false} tickLine={false} tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} />
                <YAxis domain={[40, 100]} axisLine={false} tickLine={false} tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} width={32} />
                <Tooltip content={<SimpleTooltip />} cursor={{ stroke: "var(--border)", strokeDasharray: "3 3" }} />
                <Line type="monotone" dataKey="score" stroke="var(--primary)" strokeWidth={3} dot={false} activeDot={{ r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function SettingRow({ label, value }: { label: string; value: string }) {
  return <div className="flex items-center justify-between gap-3 rounded-md border border-border bg-surface/35 px-3 py-2"><span className="text-muted-foreground">{label}</span><span className="font-mono text-xs font-semibold">{value}</span></div>;
}

function SimpleTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ value?: number; payload?: Record<string, string | number> }>; label?: string }) {
  if (!active || !payload?.length) return null;
  const name = label ?? payload[0].payload?.niche;
  return <div className="rounded-md border border-border bg-popover px-3 py-2 text-xs shadow-md"><p className="font-semibold text-foreground">{name}</p><p className="mt-1 font-mono text-muted-foreground">Score {payload[0].value}</p></div>;
}