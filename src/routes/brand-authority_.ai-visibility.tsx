import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  BarChart,
  Bar,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip as ChartTooltip,
  XAxis,
  YAxis,
  ZAxis,
  Area,
  AreaChart,
} from "recharts";
import {
  ArrowDownRight,
  ArrowUpRight,
  CheckCircle2,
  ChevronRight,
  Download,
  ExternalLink,
  FileText,
  Info,
  Quote,
  Sparkles,
  Star,
  TrendingUp,
  X,
  Zap,
} from "lucide-react";

import { DashboardNav } from "@/components/dashboard/DashboardNav";
import { ThemeToggle } from "@/components/ThemeToggle";

export const Route = createFileRoute("/brand-authority_/ai-visibility")({
  component: AiVisibilityPage,
  head: () => ({
    meta: [
      { title: "AI Visibility — Brand Authority" },
      {
        name: "description",
        content:
          "How generative systems retrieve, recommend, and cite your brand across LLM-driven search.",
      },
      { property: "og:title", content: "AI Visibility — Brand Authority" },
      {
        property: "og:description",
        content:
          "Discoverability, recommendation share, and citation footprint across ChatGPT, Perplexity, Claude, and Gemini.",
      },
    ],
  }),
});

// ── Mock data ────────────────────────────────────────────────────────────────

const RANGES = ["7d", "30d", "90d", "All"] as const;
type Range = (typeof RANGES)[number];

const CLUSTERS = [
  { id: "coach-booking", label: "best coach booking apps in the UK", primary: true },
  { id: "scheduling-software", label: "online scheduling software" },
  { id: "client-management", label: "client management for trainers" },
  { id: "fitness-saas", label: "fitness studio SaaS" },
  { id: "personal-trainer-tools", label: "personal trainer tools" },
];

const MODELS = [
  { id: "chatgpt", label: "ChatGPT", color: "var(--chart-1)" },
  { id: "perplexity", label: "Perplexity", color: "var(--chart-2)" },
  { id: "claude", label: "Claude", color: "var(--chart-3)" },
  { id: "gemini", label: "Gemini", color: "var(--chart-4)" },
] as const;

const SPARK_REC = [12, 14, 13, 15, 16, 15, 17, 16, 18, 17, 19, 18];
const SPARK_SESS = [340, 360, 390, 420, 410, 450, 470, 490, 520, 540, 560, 580];
const SPARK_REV = [2100, 2300, 2400, 2600, 2900, 3000, 3200, 3400, 3600, 3800, 4000, 4200];

const REC_TREND = [
  { w: "W1", chatgpt: 12, perplexity: 9, claude: 6, gemini: 4 },
  { w: "W2", chatgpt: 13, perplexity: 10, claude: 6, gemini: 5 },
  { w: "W3", chatgpt: 14, perplexity: 11, claude: 7, gemini: 5 },
  { w: "W4", chatgpt: 15, perplexity: 12, claude: 7, gemini: 6 },
  { w: "W5", chatgpt: 14, perplexity: 12, claude: 8, gemini: 6 },
  { w: "W6", chatgpt: 16, perplexity: 13, claude: 8, gemini: 7 },
  { w: "W7", chatgpt: 17, perplexity: 13, claude: 9, gemini: 7 },
  { w: "W8", chatgpt: 16, perplexity: 14, claude: 9, gemini: 8 },
  { w: "W9", chatgpt: 18, perplexity: 14, claude: 10, gemini: 8 },
  { w: "W10", chatgpt: 19, perplexity: 15, claude: 10, gemini: 9 },
  { w: "W11", chatgpt: 18, perplexity: 16, claude: 11, gemini: 9 },
  { w: "W12", chatgpt: 20, perplexity: 17, claude: 11, gemini: 10 },
];

type Sig = "none" | "within" | "sig";

const MODEL_METRICS: Array<{
  model: (typeof MODELS)[number];
  recShare: { v: number; d: number; sig: Sig };
  top3: { v: number; d: number; sig: Sig };
  firstMention: { v: number; d: number; sig: Sig };
}> = [
  {
    model: MODELS[0],
    recShare: { v: 20, d: 2.4, sig: "sig" },
    top3: { v: 34, d: 1.8, sig: "within" },
    firstMention: { v: 11, d: 0.4, sig: "none" },
  },
  {
    model: MODELS[1],
    recShare: { v: 17, d: 1.1, sig: "within" },
    top3: { v: 29, d: 3.6, sig: "sig" },
    firstMention: { v: 9, d: -0.2, sig: "none" },
  },
  {
    model: MODELS[2],
    recShare: { v: 11, d: -1.4, sig: "within" },
    top3: { v: 21, d: -0.9, sig: "none" },
    firstMention: { v: 6, d: 0.1, sig: "none" },
  },
  {
    model: MODELS[3],
    recShare: { v: 10, d: -3.1, sig: "sig" },
    top3: { v: 18, d: -0.4, sig: "none" },
    firstMention: { v: 5, d: -0.3, sig: "none" },
  },
];

const CLUSTER_ROWS: Array<{
  id: string;
  label: string;
  primary?: boolean;
  recShare: { v: number; d: number; sig: Sig };
  top3: { v: number; d: number; sig: Sig };
  firstMention: { v: number; d: number; sig: Sig };
  volatility: number; // 1–5
}> = [
  {
    id: "coach-booking",
    label: "best coach booking apps in the UK",
    primary: true,
    recShare: { v: 18, d: 2.1, sig: "sig" },
    top3: { v: 31, d: 1.4, sig: "within" },
    firstMention: { v: 10, d: 0.3, sig: "none" },
    volatility: 2,
  },
  {
    id: "scheduling-software",
    label: "online scheduling software",
    recShare: { v: 9, d: -0.6, sig: "within" },
    top3: { v: 17, d: -2.2, sig: "sig" },
    firstMention: { v: 4, d: -0.4, sig: "none" },
    volatility: 4,
  },
  {
    id: "client-management",
    label: "client management for trainers",
    recShare: { v: 14, d: 0.8, sig: "within" },
    top3: { v: 24, d: 1.1, sig: "within" },
    firstMention: { v: 7, d: 0.2, sig: "none" },
    volatility: 2,
  },
  {
    id: "fitness-saas",
    label: "fitness studio SaaS",
    recShare: { v: 6, d: 0.2, sig: "none" },
    top3: { v: 11, d: 0.4, sig: "none" },
    firstMention: { v: 3, d: 0.1, sig: "none" },
    volatility: 1,
  },
  {
    id: "personal-trainer-tools",
    label: "personal trainer tools",
    recShare: { v: 12, d: 3.4, sig: "sig" },
    top3: { v: 22, d: 2.6, sig: "sig" },
    firstMention: { v: 6, d: 0.7, sig: "within" },
    volatility: 3,
  },
];

// AI Traffic — weekly sessions & traffic-vs-recommendations scatter
const AI_SESSIONS = [
  { w: "W1", chatgpt: 110, perplexity: 62, claude: 28, gemini: 18 },
  { w: "W2", chatgpt: 132, perplexity: 71, claude: 30, gemini: 22 },
  { w: "W3", chatgpt: 148, perplexity: 78, claude: 34, gemini: 24 },
  { w: "W4", chatgpt: 162, perplexity: 86, claude: 38, gemini: 28 },
  { w: "W5", chatgpt: 178, perplexity: 92, claude: 42, gemini: 31 },
  { w: "W6", chatgpt: 195, perplexity: 101, claude: 46, gemini: 34 },
  { w: "W7", chatgpt: 214, perplexity: 112, claude: 51, gemini: 38 },
  { w: "W8", chatgpt: 232, perplexity: 124, claude: 55, gemini: 42 },
  { w: "W9", chatgpt: 248, perplexity: 132, claude: 58, gemini: 45 },
  { w: "W10", chatgpt: 266, perplexity: 141, claude: 61, gemini: 48 },
  { w: "W11", chatgpt: 281, perplexity: 152, claude: 64, gemini: 51 },
  { w: "W12", chatgpt: 297, perplexity: 161, claude: 67, gemini: 55 },
];

const TRAFFIC_SCATTER = CLUSTER_ROWS.map((r, i) => ({
  cluster: r.label,
  rec: r.recShare.v,
  sessions: [142, 41, 96, 18, 72][i] ?? 50,
  primary: !!r.primary,
}));

// Citation Footprint — per-cluster density + source mix
const CITATION_DENSITY = CLUSTER_ROWS.map((r, i) => ({
  id: r.id,
  label: r.label,
  primary: !!r.primary,
  citations: [42, 18, 31, 9, 24][i] ?? 12,
  verified: [34, 11, 24, 6, 18][i] ?? 8,
}));

const CITATION_SOURCES = [
  { source: "Your domain", value: 38, tone: "primary" as const },
  { source: "Editorial / press", value: 22, tone: "neutral" as const },
  { source: "Reddit / forums", value: 18, tone: "neutral" as const },
  { source: "Review sites", value: 14, tone: "neutral" as const },
  { source: "Competitor pages", value: 8, tone: "warn" as const },
];

// Receipts — sample prompts per cluster
type Receipt = {
  id: string;
  prompt: string;
  model: (typeof MODELS)[number]["id"];
  week: string;
  verified: boolean;
  rank: number | null;
  snippet: string;
  citations: { domain: string; url: string }[];
};

const RECEIPTS: Record<string, Receipt[]> = {
  "coach-booking": [
    {
      id: "r1",
      prompt: "What are the best coach booking apps in the UK?",
      model: "chatgpt",
      week: "W12",
      verified: true,
      rank: 2,
      snippet:
        "For UK-based coaches, Acme is one of the most-recommended booking platforms thanks to its lightweight scheduling, GoCardless integration, and strong reviews on Trustpilot…",
      citations: [
        { domain: "trustpilot.com", url: "https://trustpilot.com/review/acme" },
        { domain: "acme.com", url: "https://acme.com/uk" },
      ],
    },
    {
      id: "r2",
      prompt: "Recommend booking software for personal trainers in London.",
      model: "perplexity",
      week: "W12",
      verified: true,
      rank: 1,
      snippet:
        "Acme leads the pack for UK-based personal trainers — easy mobile booking, Stripe payments, and an intuitive client portal…",
      citations: [
        { domain: "acme.com", url: "https://acme.com" },
        { domain: "reddit.com", url: "https://reddit.com/r/personaltraining" },
        { domain: "g2.com", url: "https://g2.com/products/acme" },
      ],
    },
    {
      id: "r3",
      prompt: "Cheapest scheduling app for fitness coaches?",
      model: "claude",
      week: "W11",
      verified: false,
      rank: null,
      snippet:
        "Several options exist including Acuity, Calendly and TidyCal. Acme is mentioned in some reviews but pricing details vary…",
      citations: [],
    },
  ],
};


// ── Page ─────────────────────────────────────────────────────────────────────

function AiVisibilityPage() {
  const [range, setRange] = useState<Range>("90d");
  const [clusterId, setClusterId] = useState(CLUSTERS[0].id);
  const [receiptsClusterId, setReceiptsClusterId] = useState<string | null>(null);
  const cluster = CLUSTERS.find((c) => c.id === clusterId) ?? CLUSTERS[0];
  const receiptsCluster =
    CLUSTER_ROWS.find((c) => c.id === receiptsClusterId) ?? null;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <DashboardNav />
      <div className="lg:pl-56">
        <Header
          range={range}
          onRange={setRange}
          clusterId={clusterId}
          onCluster={setClusterId}
        />
        <main className="mx-auto max-w-[1400px] space-y-8 px-6 py-8 lg:px-10">
          <BaselineBanner week={2} of={4} />

          <Section delay={0}>
            <ExecLine />
            <HeroTiles />
          </Section>

          <Section delay={0.05}>
            <SectionHeading
              eyebrow="01 — Recommendation Intelligence"
              title="Where AI is recommending you"
              caption={`Per-model recommendation share for your primary cluster — "${cluster.label}".`}
            />
            <div className="grid gap-4 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
              <RecTrendCard />
              <ModelComparisonTable />
            </div>
          </Section>

          <Section delay={0.08}>
            <SectionHeading
              eyebrow="02 — AI Traffic"
              title="Sessions arriving from generative engines"
              caption="Weekly AI-attributed sessions per model and the relationship between recommendation share and traffic per cluster."
            />
            <div className="grid gap-4 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
              <AiSessionsCard />
              <TrafficVsRecCard />
            </div>
          </Section>

          <Section delay={0.1}>
            <SectionHeading
              eyebrow="03 — Cluster Breakdown"
              title="How every intent cluster is performing"
              caption="Recommendation share, Top-3 inclusion, and first-mention rate across your tracked clusters. Click a row for receipts."
            />
            <ClusterTable
              rows={CLUSTER_ROWS}
              onOpenReceipts={(id) => setReceiptsClusterId(id)}
            />
          </Section>

          <Section delay={0.12}>
            <SectionHeading
              eyebrow="04 — Citation Footprint"
              title="What sources AI is citing about you"
              caption="Per-cluster citation density and the source mix powering those mentions."
            />
            <div className="grid gap-4 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
              <CitationDensityCard />
              <CitationSourcesCard />
            </div>
          </Section>

          <MethodologyFooter />
        </main>
      </div>

      <ReceiptsModal
        cluster={receiptsCluster}
        onClose={() => setReceiptsClusterId(null)}
      />
    </div>
  );
}


// ── Chrome ───────────────────────────────────────────────────────────────────

function Header({
  range,
  onRange,
  clusterId,
  onCluster,
}: {
  range: Range;
  onRange: (r: Range) => void;
  clusterId: string;
  onCluster: (id: string) => void;
}) {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur">
      <div className="mx-auto flex max-w-[1400px] flex-col gap-3 px-6 py-4 lg:flex-row lg:items-center lg:justify-between lg:px-10">
        <div className="min-w-0">
          <div className="flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
            <Link to="/dashboard" className="hover:text-foreground">
              Dashboard
            </Link>
            <ChevronRight className="h-3 w-3" />
            <Link to="/brand-authority" className="hover:text-foreground">
              Brand Authority
            </Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-foreground">AI Visibility</span>
          </div>
          <div className="mt-1 flex items-center gap-2">
            <h1 className="text-xl font-semibold tracking-tight">AI Visibility</h1>
            <span className="inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-1.5 py-0.5 text-[9px] font-mono uppercase tracking-wider text-primary">
              Beta
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-chart-4" />
              Building baseline · Week 2 of 4
            </span>
          </div>
          <p className="mt-0.5 text-sm text-muted-foreground">
            How generative systems retrieve, recommend, and cite your brand.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={clusterId}
            onChange={(e) => onCluster(e.target.value)}
            className="h-8 rounded-md border border-border bg-surface px-2 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          >
            {CLUSTERS.map((c) => (
              <option key={c.id} value={c.id}>
                {c.primary ? "★ " : ""}
                {c.label}
              </option>
            ))}
          </select>
          <div className="inline-flex rounded-md border border-border bg-surface p-0.5">
            {RANGES.map((r) => (
              <button
                key={r}
                onClick={() => onRange(r)}
                className={`px-2.5 py-1 text-[11px] font-mono uppercase tracking-wider rounded transition-colors ${
                  r === range
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {r}
              </button>
            ))}
          </div>
          <button
            type="button"
            className="inline-flex h-8 items-center gap-1.5 rounded-md border border-border bg-surface px-2.5 text-xs text-muted-foreground opacity-60"
            disabled
            title="Export — coming soon"
          >
            <Download className="h-3.5 w-3.5" />
            Export
          </button>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}

function BaselineBanner({ week, of }: { week: number; of: number }) {
  return (
    <div className="flex items-start gap-3 rounded-lg border border-primary/25 bg-primary/5 px-4 py-3">
      <Info className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-foreground">
          Building your baseline (week {week} of {of}).
        </p>
        <p className="text-xs text-muted-foreground">
          Trend analysis and significance flags activate after week {of}. Numbers shown are
          provisional and will stabilise as we collect more samples.
        </p>
      </div>
      <div className="hidden items-center gap-1 sm:flex">
        {Array.from({ length: of }).map((_, i) => (
          <span
            key={i}
            className={`h-1 w-6 rounded-full ${
              i < week ? "bg-primary" : "bg-primary/20"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

// ── Hero ─────────────────────────────────────────────────────────────────────

function ExecLine() {
  return (
    <div className="flex items-start gap-2 text-sm leading-relaxed">
      <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
      <p className="text-foreground">
        You're recommended in{" "}
        <span className="font-semibold">18%</span> of category-level AI searches,
        driving an estimated{" "}
        <span className="font-semibold">580 AI sessions this week</span> and{" "}
        <span className="font-semibold">£4.2K</span> in AI-attributed revenue this
        quarter.
      </p>
    </div>
  );
}

function HeroTiles() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <HeroTile
        label="Recommendation Share"
        value="18%"
        delta={2.1}
        deltaSuffix="pp"
        sig="sig"
        spark={SPARK_REC}
        caption="Primary cluster · last 12w"
      />
      <HeroTile
        label="AI Sessions"
        value="580"
        delta={3.6}
        deltaSuffix="%"
        sig="sig"
        spark={SPARK_SESS}
        caption="This week · GA4-validated"
        badge="Live"
      />
      <HeroTile
        label="AI Revenue"
        value="£4.2K"
        delta={1.4}
        deltaSuffix="%"
        sig="within"
        spark={SPARK_REV}
        caption="Quarter to date"
        badge="Estimated"
      />
    </div>
  );
}

function HeroTile({
  label,
  value,
  delta,
  deltaSuffix,
  sig,
  spark,
  caption,
  badge,
}: {
  label: string;
  value: string;
  delta: number;
  deltaSuffix: string;
  sig: Sig;
  spark: number[];
  caption: string;
  badge?: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="flex items-start justify-between">
        <p className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
          {label}
        </p>
        {badge && (
          <span className="rounded-full border border-border bg-surface px-1.5 py-0.5 text-[9px] font-mono uppercase tracking-wider text-muted-foreground">
            {badge}
          </span>
        )}
      </div>
      <div className="mt-3 flex items-baseline gap-3">
        <p className="text-3xl font-semibold tracking-tight">{value}</p>
        <DeltaPill delta={delta} suffix={deltaSuffix} sig={sig} />
      </div>
      <div className="mt-3 h-10">
        <Sparkline data={spark} positive={delta >= 0} />
      </div>
      <p className="mt-2 text-[11px] text-muted-foreground">{caption}</p>
    </div>
  );
}

// ── Recommendation Intelligence ──────────────────────────────────────────────

function RecTrendCard() {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="mb-3 flex items-start justify-between">
        <div>
          <p className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
            Recommendation share trend
          </p>
          <p className="mt-0.5 text-sm font-medium">Last 12 weeks · per model</p>
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          {MODELS.map((m) => (
            <div key={m.id} className="flex items-center gap-1.5">
              <span
                className="h-2 w-2 rounded-full"
                style={{ background: m.color }}
              />
              <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                {m.label}
              </span>
            </div>
          ))}
        </div>
      </div>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={REC_TREND} margin={{ top: 8, right: 8, bottom: 0, left: -16 }}>
            <CartesianGrid stroke="var(--border)" strokeDasharray="2 4" vertical={false} />
            <XAxis
              dataKey="w"
              tick={{ fill: "var(--muted-foreground)", fontSize: 10 }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              tick={{ fill: "var(--muted-foreground)", fontSize: 10 }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => `${v}%`}
            />
            <ChartTooltip
              contentStyle={{
                background: "var(--card)",
                border: "1px solid var(--border)",
                borderRadius: 8,
                fontSize: 12,
              }}
              formatter={(v: number) => `${v}%`}
            />
            {MODELS.map((m) => (
              <Line
                key={m.id}
                type="monotone"
                dataKey={m.id}
                stroke={m.color}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
      <p className="mt-3 text-[10px] text-muted-foreground">
        Sampled weekly across each model's search-augmented mode. ChatGPT uses
        browse, Perplexity uses default Sonar, Claude and Gemini use their
        native retrieval.
      </p>
    </div>
  );
}

function ModelComparisonTable() {
  return (
    <div className="rounded-xl border border-border bg-card">
      <div className="border-b border-border p-5 pb-3">
        <p className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
          Per-model comparison
        </p>
        <p className="mt-0.5 text-sm font-medium">
          Recommendation share · Top-3 · First mention
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
              <th className="px-4 py-2 text-left font-medium">Model</th>
              <th className="px-3 py-2 text-right font-medium">Rec Share</th>
              <th className="px-3 py-2 text-right font-medium">Top-3</th>
              <th className="px-4 py-2 text-right font-medium">First Mention</th>
            </tr>
          </thead>
          <tbody>
            {MODEL_METRICS.map((row) => (
              <tr
                key={row.model.id}
                className="border-b border-border last:border-0"
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span
                      className="h-2 w-2 rounded-full"
                      style={{ background: row.model.color }}
                    />
                    <span className="font-medium">{row.model.label}</span>
                  </div>
                </td>
                <MetricCell metric={row.recShare} suffix="%" />
                <MetricCell metric={row.top3} suffix="%" />
                <MetricCell metric={row.firstMention} suffix="%" />
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function MetricCell({
  metric,
  suffix,
}: {
  metric: { v: number; d: number; sig: Sig };
  suffix: string;
}) {
  return (
    <td className="px-3 py-3 text-right">
      <div className="flex flex-col items-end gap-0.5">
        <span className="font-mono tabular-nums text-sm">
          {metric.v}
          {suffix}
        </span>
        <DeltaPill delta={metric.d} suffix={suffix === "%" ? "pp" : suffix} sig={metric.sig} compact />
      </div>
    </td>
  );
}

// ── Cluster Breakdown ────────────────────────────────────────────────────────

function ClusterTable({
  rows,
  onOpenReceipts,
}: {
  rows: typeof CLUSTER_ROWS;
  onOpenReceipts: (id: string) => void;
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
              <th className="px-4 py-2.5 text-left font-medium">Intent Cluster</th>
              <th className="px-3 py-2.5 text-right font-medium">Rec Share</th>
              <th className="px-3 py-2.5 text-right font-medium">Top-3</th>
              <th className="px-3 py-2.5 text-right font-medium">First Mention</th>
              <th className="px-3 py-2.5 text-center font-medium">Volatility</th>
              <th className="w-10 px-2 py-2.5" aria-label="Receipts" />
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const hasReceipts = !!RECEIPTS[row.id]?.length;
              return (
                <tr
                  key={row.id}
                  className="group border-b border-border last:border-0 hover:bg-surface/40"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="truncate font-medium">{row.label}</span>
                      {row.primary && (
                        <span className="inline-flex items-center gap-1 rounded-full border border-primary/30 bg-primary/10 px-1.5 py-0.5 text-[9px] font-mono uppercase tracking-wider text-primary">
                          <Star className="h-2.5 w-2.5 fill-current" />
                          Primary
                        </span>
                      )}
                    </div>
                  </td>
                  <MetricCell metric={row.recShare} suffix="%" />
                  <MetricCell metric={row.top3} suffix="%" />
                  <MetricCell metric={row.firstMention} suffix="%" />
                  <td className="px-3 py-3">
                    <VolatilityDots level={row.volatility} />
                  </td>
                  <td className="px-2 py-3 text-right">
                    <button
                      type="button"
                      onClick={() => onOpenReceipts(row.id)}
                      title={
                        hasReceipts
                          ? "View receipts"
                          : "No sampled prompts yet"
                      }
                      className="inline-flex items-center gap-1 rounded-md border border-transparent px-1.5 py-1 text-muted-foreground transition-colors hover:border-border hover:bg-surface hover:text-foreground"
                    >
                      <FileText className="h-3.5 w-3.5" />
                      <span className="text-[10px] font-mono uppercase tracking-wider">
                        Receipts
                      </span>
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── AI Traffic ───────────────────────────────────────────────────────────────

function AiSessionsCard() {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="mb-3 flex items-start justify-between">
        <div>
          <p className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
            AI sessions per week
          </p>
          <p className="mt-0.5 text-sm font-medium">Stacked by source model</p>
        </div>
        <span className="rounded-full border border-border bg-surface px-1.5 py-0.5 text-[9px] font-mono uppercase tracking-wider text-muted-foreground">
          GA4-validated
        </span>
      </div>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={AI_SESSIONS} margin={{ top: 8, right: 8, bottom: 0, left: -16 }}>
            <CartesianGrid stroke="var(--border)" strokeDasharray="2 4" vertical={false} />
            <XAxis dataKey="w" tick={{ fill: "var(--muted-foreground)", fontSize: 10 }} tickLine={false} axisLine={false} />
            <YAxis tick={{ fill: "var(--muted-foreground)", fontSize: 10 }} tickLine={false} axisLine={false} />
            <ChartTooltip
              contentStyle={{
                background: "var(--card)",
                border: "1px solid var(--border)",
                borderRadius: 8,
                fontSize: 12,
              }}
            />
            {MODELS.map((m, i) => (
              <Bar
                key={m.id}
                dataKey={m.id}
                stackId="a"
                fill={m.color}
                radius={i === MODELS.length - 1 ? [4, 4, 0, 0] : 0}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function TrafficVsRecCard() {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="mb-3 flex items-start justify-between">
        <div>
          <p className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
            Traffic vs Recommendations
          </p>
          <p className="mt-0.5 text-sm font-medium">
            Sessions this week × recommendation share
          </p>
        </div>
      </div>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 8, right: 16, bottom: 8, left: -8 }}>
            <CartesianGrid stroke="var(--border)" strokeDasharray="2 4" />
            <XAxis
              type="number"
              dataKey="rec"
              name="Rec share"
              tick={{ fill: "var(--muted-foreground)", fontSize: 10 }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => `${v}%`}
              label={{
                value: "Rec share",
                position: "insideBottom",
                offset: -4,
                fill: "var(--muted-foreground)",
                fontSize: 10,
              }}
            />
            <YAxis
              type="number"
              dataKey="sessions"
              name="Sessions"
              tick={{ fill: "var(--muted-foreground)", fontSize: 10 }}
              tickLine={false}
              axisLine={false}
            />
            <ZAxis range={[80, 220]} />
            <ChartTooltip
              cursor={{ strokeDasharray: "3 3", stroke: "var(--border)" }}
              contentStyle={{
                background: "var(--card)",
                border: "1px solid var(--border)",
                borderRadius: 8,
                fontSize: 12,
              }}
              formatter={(value: number, name: string) =>
                name === "rec" ? `${value}%` : value
              }
              labelFormatter={() => ""}
            />
            <Scatter data={TRAFFIC_SCATTER}>
              {TRAFFIC_SCATTER.map((d, i) => (
                <Cell
                  key={i}
                  fill={d.primary ? "var(--primary)" : "var(--chart-2)"}
                  fillOpacity={d.primary ? 0.95 : 0.55}
                  stroke="var(--card)"
                  strokeWidth={1}
                />
              ))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
      </div>
      <p className="mt-2 text-[10px] text-muted-foreground">
        Clusters above the diagonal are converting recommendation share into
        traffic. Primary cluster highlighted.
      </p>
    </div>
  );
}

// ── Citation Footprint ───────────────────────────────────────────────────────

function CitationDensityCard() {
  const max = Math.max(...CITATION_DENSITY.map((d) => d.citations));
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="mb-4">
        <p className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
          Citation density
        </p>
        <p className="mt-0.5 text-sm font-medium">
          Verified vs total citations per cluster · last 12w
        </p>
      </div>
      <div className="space-y-3">
        {CITATION_DENSITY.map((d) => {
          const totalPct = (d.citations / max) * 100;
          const verifiedPct = (d.verified / max) * 100;
          return (
            <div key={d.id}>
              <div className="mb-1 flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 truncate">
                  {d.primary && (
                    <Star className="h-2.5 w-2.5 fill-primary text-primary" />
                  )}
                  <span className="truncate">{d.label}</span>
                </span>
                <span className="font-mono tabular-nums text-muted-foreground">
                  {d.verified}
                  <span className="opacity-50"> / {d.citations}</span>
                </span>
              </div>
              <div className="relative h-2 overflow-hidden rounded-full bg-surface">
                <div
                  className="absolute inset-y-0 left-0 rounded-full bg-primary/25"
                  style={{ width: `${totalPct}%` }}
                />
                <div
                  className="absolute inset-y-0 left-0 rounded-full bg-primary"
                  style={{ width: `${verifiedPct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-4 flex items-center gap-3 text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-primary" /> Verified
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-primary/25" /> Unverified
        </span>
      </div>
    </div>
  );
}

function CitationSourcesCard() {
  const total = CITATION_SOURCES.reduce((a, b) => a + b.value, 0);
  const toneClass = (t: "primary" | "neutral" | "warn") =>
    t === "primary"
      ? "bg-primary"
      : t === "warn"
        ? "bg-destructive/70"
        : "bg-muted-foreground/50";
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="mb-4">
        <p className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
          Source mix
        </p>
        <p className="mt-0.5 text-sm font-medium">
          Where AI is pulling citations from
        </p>
      </div>
      <div className="mb-4 flex h-3 w-full overflow-hidden rounded-full bg-surface">
        {CITATION_SOURCES.map((s) => (
          <div
            key={s.source}
            className={toneClass(s.tone)}
            style={{ width: `${(s.value / total) * 100}%` }}
            title={`${s.source} · ${s.value}%`}
          />
        ))}
      </div>
      <ul className="space-y-2">
        {CITATION_SOURCES.map((s) => (
          <li
            key={s.source}
            className="flex items-center justify-between text-xs"
          >
            <span className="flex items-center gap-2">
              <span className={`h-2 w-2 rounded-full ${toneClass(s.tone)}`} />
              {s.source}
            </span>
            <span className="font-mono tabular-nums text-muted-foreground">
              {s.value}%
            </span>
          </li>
        ))}
      </ul>
      <p className="mt-4 text-[10px] text-muted-foreground">
        A healthy footprint leans on your own domain plus diverse third-party
        endorsements — not just competitor pages.
      </p>
    </div>
  );
}

// ── Receipts Modal ───────────────────────────────────────────────────────────

function ReceiptsModal({
  cluster,
  onClose,
}: {
  cluster: (typeof CLUSTER_ROWS)[number] | null;
  onClose: () => void;
}) {
  if (!cluster) return null;
  const receipts = RECEIPTS[cluster.id] ?? [];

  return (
    <div
      className="fixed inset-0 z-50 flex items-stretch justify-center bg-background/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        onClick={(e) => e.stopPropagation()}
        className="m-4 flex max-h-[calc(100vh-2rem)] w-full max-w-6xl flex-col overflow-hidden rounded-xl border border-border bg-card shadow-2xl"
      >
        <div className="flex items-start justify-between gap-4 border-b border-border p-5">
          <div className="min-w-0">
            <p className="text-[10px] font-mono uppercase tracking-[0.15em] text-muted-foreground">
              Receipts · sampled prompts
            </p>
            <h2 className="mt-1 truncate text-lg font-semibold tracking-tight">
              {cluster.label}
            </h2>
            <div className="mt-1.5 flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground">
              <span className="font-mono tabular-nums">
                Rec share {cluster.recShare.v}%
              </span>
              <span>·</span>
              <span className="font-mono tabular-nums">
                Top-3 {cluster.top3.v}%
              </span>
              <span>·</span>
              <span>{receipts.length} sampled prompts</span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-border bg-surface p-1.5 text-muted-foreground hover:bg-background hover:text-foreground"
            aria-label="Close receipts"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="grid flex-1 grid-cols-1 overflow-hidden lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="overflow-y-auto p-5">
            {receipts.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center gap-2 text-center text-sm text-muted-foreground">
                <FileText className="h-6 w-6" />
                <p>No sampled prompts yet for this cluster.</p>
                <p className="text-xs">
                  Sampling runs weekly — check back after the next cycle.
                </p>
              </div>
            ) : (
              <ul className="space-y-4">
                {receipts.map((r) => {
                  const model = MODELS.find((m) => m.id === r.model);
                  return (
                    <li
                      key={r.id}
                      className="rounded-lg border border-border bg-surface/40 p-4"
                    >
                      <div className="flex flex-wrap items-center gap-2">
                        {model && (
                          <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider">
                            <span
                              className="h-1.5 w-1.5 rounded-full"
                              style={{ background: model.color }}
                            />
                            {model.label}
                          </span>
                        )}
                        <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                          {r.week}
                        </span>
                        {r.verified ? (
                          <span className="inline-flex items-center gap-1 rounded-full border border-primary/25 bg-primary/10 px-1.5 py-0.5 text-[10px] font-mono uppercase tracking-wider text-primary">
                            <CheckCircle2 className="h-2.5 w-2.5" />
                            Verified
                          </span>
                        ) : (
                          <span className="rounded-full border border-border bg-surface px-1.5 py-0.5 text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                            Unverified
                          </span>
                        )}
                        {r.rank ? (
                          <span className="ml-auto font-mono text-[11px] tabular-nums text-muted-foreground">
                            Rank #{r.rank}
                          </span>
                        ) : (
                          <span className="ml-auto font-mono text-[11px] tabular-nums text-muted-foreground">
                            Not recommended
                          </span>
                        )}
                      </div>
                      <p className="mt-3 text-sm font-medium">{r.prompt}</p>
                      <div className="mt-2 flex gap-2 text-sm text-muted-foreground">
                        <Quote className="mt-1 h-3.5 w-3.5 shrink-0 opacity-60" />
                        <p className="leading-relaxed">{r.snippet}</p>
                      </div>
                      {r.citations.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-1.5">
                          {r.citations.map((c) => (
                            <a
                              key={c.url}
                              href={c.url}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 rounded-md border border-border bg-card px-2 py-0.5 text-[11px] text-muted-foreground hover:text-foreground"
                            >
                              {c.domain}
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          ))}
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          <aside className="border-t border-border bg-surface/30 p-5 lg:border-l lg:border-t-0">
            <p className="text-[10px] font-mono uppercase tracking-[0.15em] text-muted-foreground">
              How to fix
            </p>
            <h3 className="mt-1 text-sm font-semibold">
              Lift recommendation share
            </h3>
            <ol className="mt-3 space-y-3 text-sm text-muted-foreground">
              <li className="flex gap-2">
                <span className="font-mono text-primary">01</span>
                <span>
                  Publish a comparison landing page targeting "{cluster.label}"
                  with structured pros/cons.
                </span>
              </li>
              <li className="flex gap-2">
                <span className="font-mono text-primary">02</span>
                <span>
                  Seed third-party reviews on Trustpilot, G2, and category-specific
                  Reddit threads.
                </span>
              </li>
              <li className="flex gap-2">
                <span className="font-mono text-primary">03</span>
                <span>
                  Add FAQ schema with the exact phrasing of the sampled prompts.
                </span>
              </li>
            </ol>
            <div className="mt-5 rounded-md border border-border bg-card p-3 text-[11px] text-muted-foreground">
              Actions are heuristic for V0.5. The Insights Engine will rank
              these by expected lift once we have 4 weeks of baseline.
            </div>
          </aside>
        </div>
      </motion.div>
    </div>
  );
}



// ── Primitives ───────────────────────────────────────────────────────────────

function DeltaPill({
  delta,
  suffix,
  sig,
  compact,
}: {
  delta: number;
  suffix: string;
  sig: Sig;
  compact?: boolean;
}) {
  if (delta === 0 || sig === "none") {
    return (
      <span
        className={`inline-flex items-center gap-0.5 font-mono tabular-nums text-muted-foreground ${
          compact ? "text-[10px]" : "text-xs"
        }`}
      >
        — {Math.abs(delta).toFixed(1)}
        {suffix}
      </span>
    );
  }
  const positive = delta > 0;
  const Icon = positive ? ArrowUpRight : ArrowDownRight;
  const tone = positive ? "text-primary" : "text-destructive";
  return (
    <span
      className={`inline-flex items-center gap-1 font-mono tabular-nums ${tone} ${
        compact ? "text-[10px]" : "text-xs"
      }`}
    >
      <Icon className={compact ? "h-2.5 w-2.5" : "h-3 w-3"} />
      {positive ? "+" : "−"}
      {Math.abs(delta).toFixed(1)}
      {suffix}
      {sig === "sig" && (
        <span
          className={`ml-1 rounded-sm px-1 py-0 text-[9px] font-mono uppercase tracking-wider ${
            positive
              ? "bg-primary/15 text-primary"
              : "bg-destructive/15 text-destructive"
          }`}
        >
          Sig
        </span>
      )}
    </span>
  );
}

function VolatilityDots({ level }: { level: number }) {
  const labels = ["Very stable", "Mostly stable", "Moderate", "Volatile", "Unpredictable"];
  return (
    <div
      className="flex items-center justify-center gap-1"
      title={labels[Math.min(Math.max(level - 1, 0), 4)]}
    >
      {Array.from({ length: 5 }).map((_, i) => {
        const active = i < level;
        return (
          <span
            key={i}
            className={`h-1.5 w-1.5 rounded-full ${
              active
                ? level <= 2
                  ? "bg-muted-foreground/60"
                  : level === 3
                    ? "bg-chart-4/80"
                    : "bg-destructive/80"
                : "bg-border"
            }`}
          />
        );
      })}
    </div>
  );
}

function Sparkline({ data, positive }: { data: number[]; positive: boolean }) {
  const points = data.map((v, i) => ({ i, v }));
  const stroke = positive ? "var(--primary)" : "var(--destructive)";
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={points} margin={{ top: 2, right: 0, bottom: 0, left: 0 }}>
        <defs>
          <linearGradient id={`spark-${positive ? "p" : "n"}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={stroke} stopOpacity={0.25} />
            <stop offset="100%" stopColor={stroke} stopOpacity={0} />
          </linearGradient>
        </defs>
        <Area
          type="monotone"
          dataKey="v"
          stroke={stroke}
          strokeWidth={1.5}
          fill={`url(#spark-${positive ? "p" : "n"})`}
        />
      </AreaChart>
    </ResponsiveContainer>
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
    <div className="mb-4">
      <p className="text-[10px] font-mono uppercase tracking-[0.15em] text-muted-foreground">
        {eyebrow}
      </p>
      <h2 className="mt-1 text-lg font-semibold tracking-tight">{title}</h2>
      <p className="mt-0.5 text-sm text-muted-foreground">{caption}</p>
    </div>
  );
}

function Section({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: "easeOut" }}
      className="space-y-4"
    >
      {children}
    </motion.section>
  );
}

function MethodologyFooter() {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-lg border border-border bg-surface/40 px-4 py-3 text-xs text-muted-foreground">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center gap-2 text-left font-mono uppercase tracking-wider text-[10px]"
      >
        <Info className="h-3 w-3" />
        Methodology
        <ChevronRight
          className={`h-3 w-3 transition-transform ${open ? "rotate-90" : ""}`}
        />
      </button>
      {open && (
        <div className="mt-2 space-y-1 leading-relaxed">
          <p>
            We sample 24 prompts × 4 models × 3 samples per cluster per week.
            WoW changes within ±1.5pp are considered within normal variance and
            shown without a significance badge.
          </p>
          <p>
            ChatGPT responses use the search-augmented (browse) mode. Perplexity
            uses default Sonar. Claude and Gemini use their native retrieval
            paths. Recommendation share is computed as the share of sampled
            responses where the brand appears in the recommended set.
          </p>
        </div>
      )}
    </div>
  );
}
