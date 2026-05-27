import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { z } from "zod";
import { fallback, zodValidator } from "@tanstack/zod-adapter";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip as ChartTooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Copy,
  Download,
  ExternalLink,
  FileText,
  Info,
  Loader2,
  Quote,
  RefreshCw,
  Sparkles,
  Star,
  X,
} from "lucide-react";

import { DashboardNav } from "@/components/dashboard/DashboardNav";
import { ThemeToggle } from "@/components/ThemeToggle";

// ── Route ────────────────────────────────────────────────────────────────────

const searchSchema = z.object({
  cluster: fallback(z.string(), "coach-booking").default("coach-booking"),
  receipts: fallback(z.boolean(), false).default(false),
  sample: fallback(z.number().int().min(0), 0).default(0),
});

export const Route = createFileRoute("/brand-authority_/ai-visibility")({
  validateSearch: zodValidator(searchSchema),
  component: AiVisibilityPage,
  head: () => ({
    meta: [
      { title: "AI Visibility — Brand Authority" },
      {
        name: "description",
        content:
          "How ChatGPT-with-search retrieves, recommends, and cites your brand. Discovery Intelligence V0.5.",
      },
      { property: "og:title", content: "AI Visibility — Brand Authority" },
      {
        property: "og:description",
        content:
          "Recommendation share, AI sessions, and receipts from your primary commercial cluster.",
      },
    ],
  }),
});

// ── Mock data (V0.5: ChatGPT-with-search only, primary cluster only) ────────

const RANGES = ["7d", "30d", "90d", "All"] as const;
type Range = (typeof RANGES)[number];

const PRIMARY_CLUSTER = {
  id: "coach-booking",
  label: "best coach booking apps in the UK",
};

const SPARK_REC = [12, 14, 13, 15, 16, 15, 17, 16, 18, 17, 19, 18];
const SPARK_SESS = [340, 360, 390, 420, 410, 450, 470, 490, 520, 540, 560, 580];
const SPARK_REV = [2100, 2300, 2400, 2600, 2900, 3000, 3200, 3400, 3600, 3800, 4000, 4200];

const REC_TREND = [
  { w: "W1", v: 12 }, { w: "W2", v: 13 }, { w: "W3", v: 14 }, { w: "W4", v: 15 },
  { w: "W5", v: 14 }, { w: "W6", v: 16 }, { w: "W7", v: 17 }, { w: "W8", v: 16 },
  { w: "W9", v: 18 }, { w: "W10", v: 19 }, { w: "W11", v: 18 }, { w: "W12", v: 20 },
];

const AI_SESSIONS = [
  { w: "W1", v: 340 }, { w: "W2", v: 360 }, { w: "W3", v: 390 }, { w: "W4", v: 420 },
  { w: "W5", v: 410 }, { w: "W6", v: 450 }, { w: "W7", v: 470 }, { w: "W8", v: 490 },
  { w: "W9", v: 520 }, { w: "W10", v: 540 }, { w: "W11", v: 560 }, { w: "W12", v: 580 },
];

const SOURCE_MIX = [
  { source: "ChatGPT", value: 412, color: "var(--chart-1)" },
  { source: "Perplexity", value: 98, color: "var(--chart-2)" },
  { source: "Claude", value: 41, color: "var(--chart-3)" },
  { source: "Gemini", value: 22, color: "var(--chart-4)" },
  { source: "Other AI", value: 7, color: "var(--muted-foreground)" },
];

const TOP_LANDING = [
  { path: "/uk/coach-booking", sessions: 142, cvr: 4.2, revenue: 1280 },
  { path: "/pricing", sessions: 96, cvr: 5.1, revenue: 1140 },
  { path: "/integrations/stripe", sessions: 71, cvr: 3.4, revenue: 620 },
  { path: "/compare/calendly", sessions: 58, cvr: 2.8, revenue: 410 },
  { path: "/features/scheduling", sessions: 49, cvr: 3.1, revenue: 380 },
  { path: "/blog/personal-trainer-booking", sessions: 38, cvr: 1.9, revenue: 180 },
  { path: "/guides/uk-coaches", sessions: 31, cvr: 2.1, revenue: 160 },
];

type Sig = "none" | "within" | "sig";

type Receipt = {
  id: string;
  prompt: string;
  promptInstance: string;
  week: string;
  verified: boolean;
  rank: number | null;
  snippet: string;
  citations: { domain: string; url: string }[];
  entities: { name: string; isBrand: boolean; position: number | null }[];
};

const RECEIPTS: Receipt[] = [
  {
    id: "r1",
    prompt: "What are the best coach booking apps in the UK?",
    promptInstance:
      "I'm a personal trainer in London looking for booking software. What are the best coach booking apps in the UK in 2026? List the top options with pros and cons.",
    week: "W12",
    verified: true,
    rank: 2,
    snippet:
      "For UK-based coaches, Acme is one of the most-recommended booking platforms thanks to its lightweight scheduling, GoCardless integration, and strong reviews on Trustpilot. Other options worth considering include TidyCal and Acuity.",
    citations: [
      { domain: "trustpilot.com", url: "https://trustpilot.com/review/acme" },
      { domain: "acme.com", url: "https://acme.com/uk" },
    ],
    entities: [
      { name: "Acme", isBrand: true, position: 2 },
      { name: "TidyCal", isBrand: false, position: 3 },
      { name: "Acuity", isBrand: false, position: 4 },
      { name: "BookCoach", isBrand: false, position: 1 },
    ],
  },
  {
    id: "r2",
    prompt: "Recommend booking software for personal trainers in London.",
    promptInstance:
      "Recommend booking software for personal trainers in London. I have around 30 clients and need mobile + payments.",
    week: "W12",
    verified: true,
    rank: 1,
    snippet:
      "Acme leads the pack for UK-based personal trainers — easy mobile booking, Stripe payments, and an intuitive client portal. It's also affordable for solo coaches.",
    citations: [
      { domain: "acme.com", url: "https://acme.com" },
      { domain: "reddit.com", url: "https://reddit.com/r/personaltraining" },
      { domain: "g2.com", url: "https://g2.com/products/acme" },
    ],
    entities: [
      { name: "Acme", isBrand: true, position: 1 },
      { name: "TrainerSpace", isBrand: false, position: 2 },
    ],
  },
  {
    id: "r3",
    prompt: "Cheapest scheduling app for fitness coaches?",
    promptInstance:
      "Cheapest scheduling app for fitness coaches under £20/month?",
    week: "W11",
    verified: false,
    rank: null,
    snippet:
      "Several options exist including Acuity, Calendly and TidyCal. Acme is mentioned in some reviews but pricing details vary by region.",
    citations: [],
    entities: [
      { name: "Acuity", isBrand: false, position: 1 },
      { name: "Calendly", isBrand: false, position: 2 },
      { name: "TidyCal", isBrand: false, position: 3 },
      { name: "Acme", isBrand: true, position: null },
    ],
  },
];

// ── Page ─────────────────────────────────────────────────────────────────────

function AiVisibilityPage() {
  const search = Route.useSearch();
  const navigate = useNavigate({ from: Route.fullPath });
  const [range, setRange] = useState<Range>("90d");

  // System-state demo flags (in a real app these come from props/loader)
  const ga4Connected = true;
  const pipelineState: "ok" | "refreshing" | "failed" = "ok";

  const openReceipts = (sample = 0) =>
    navigate({ search: (p) => ({ ...p, receipts: true, sample }) });
  const closeReceipts = () =>
    navigate({ search: (p) => ({ ...p, receipts: false }) });
  const setSample = (sample: number) =>
    navigate({ search: (p) => ({ ...p, sample }) });

  return (
    <div className="min-h-screen bg-background text-foreground">
      <DashboardNav />
      <div className="lg:pl-56">
        <Header range={range} onRange={setRange} />
        <main className="mx-auto max-w-[1400px] space-y-8 px-6 py-8 lg:px-10">
          {pipelineState === "refreshing" && <RefreshingBanner />}
          {pipelineState === "failed" && (
            <PipelineFailedBanner lastUpdate="2026-05-20" />
          )}
          <BaselineBanner week={2} of={4} />

          <Section delay={0}>
            <ExecLine />
            <HeroTiles ga4Connected={ga4Connected} />
          </Section>

          <Section delay={0.05}>
            <SectionHeading
              eyebrow="01 — Recommendation Intelligence"
              title="Where AI is recommending you"
              caption={`ChatGPT-with-search recommendation share for your primary commercial cluster — "${PRIMARY_CLUSTER.label}".`}
            />
            <div className="grid gap-4 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
              <RecTrendCard />
              <PrimaryClusterDetailCard onOpenReceipts={() => openReceipts(0)} />
            </div>
          </Section>

          <Section delay={0.08}>
            <SectionHeading
              eyebrow="02 — AI Traffic"
              title="Sessions arriving from generative engines"
              caption="Weekly AI-attributed sessions, distribution across LLM source domains, and your top AI landing pages."
            />
            <div className="grid gap-4 lg:grid-cols-3">
              <WeeklyAiSessionsCard ga4Connected={ga4Connected} />
              <SourceDistributionCard ga4Connected={ga4Connected} />
              <TopLandingPagesCard ga4Connected={ga4Connected} />
            </div>
          </Section>

          <MethodologyFooter />
        </main>
      </div>

      <ReceiptsModal
        open={search.receipts}
        sampleIndex={search.sample}
        onClose={closeReceipts}
        onChangeSample={setSample}
      />

      <PrimaryClusterOnboarding />
    </div>
  );
}

// ── Chrome ───────────────────────────────────────────────────────────────────

function Header({ range, onRange }: { range: Range; onRange: (r: Range) => void }) {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur">
      <div className="mx-auto flex max-w-[1400px] flex-col gap-3 px-6 py-4 lg:flex-row lg:items-start lg:justify-between lg:px-10">
        <div className="min-w-0">
          <div className="flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
            <Link to="/dashboard" className="hover:text-foreground">Dashboard</Link>
            <ChevronRight className="h-3 w-3" />
            <Link to="/brand-authority" className="hover:text-foreground">Brand Authority</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-foreground">AI Visibility</span>
          </div>
          <div className="mt-1 flex flex-wrap items-center gap-2">
            <h1 className="text-xl font-semibold tracking-tight">AI Visibility</h1>
            <StatusBadge variant="preview" />
            <StatusBadge variant="baseline" label="Building baseline · Week 2 of 4" />
          </div>
          <p className="mt-0.5 text-sm text-muted-foreground">
            How ChatGPT-with-search retrieves, recommends, and cites your brand.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
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

// ── System banners ───────────────────────────────────────────────────────────

function BaselineBanner({ week, of }: { week: number; of: number }) {
  return (
    <div className="flex items-start gap-3 rounded-lg border border-primary/25 bg-primary/5 px-4 py-3">
      <Info className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-foreground">
          Building your baseline (week {week} of {of}).
        </p>
        <p className="text-xs text-muted-foreground">
          Significance and volatility activate after week {of}. Numbers shown are provisional.
        </p>
      </div>
      <div className="hidden items-center gap-1 sm:flex">
        {Array.from({ length: of }).map((_, i) => (
          <span
            key={i}
            className={`h-1 w-6 rounded-full ${i < week ? "bg-primary" : "bg-primary/20"}`}
          />
        ))}
      </div>
    </div>
  );
}

function RefreshingBanner() {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-chart-4/30 bg-chart-4/5 px-4 py-3">
      <Loader2 className="h-4 w-4 shrink-0 animate-spin text-chart-4" />
      <p className="text-sm text-foreground">
        Refreshing this week's data — usually completes within 15 minutes.
      </p>
    </div>
  );
}

function PipelineFailedBanner({ lastUpdate }: { lastUpdate: string }) {
  return (
    <div className="flex items-start gap-3 rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3">
      <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-foreground">
          We couldn't refresh this week's data.
        </p>
        <p className="text-xs text-muted-foreground">
          Last update: {lastUpdate}. Engineering has been notified.
        </p>
      </div>
      <button
        type="button"
        className="inline-flex items-center gap-1.5 rounded-md border border-border bg-surface px-2 py-1 text-xs hover:bg-background"
      >
        <RefreshCw className="h-3 w-3" /> Retry
      </button>
    </div>
  );
}

// ── Hero ─────────────────────────────────────────────────────────────────────

function ExecLine() {
  return (
    <div className="flex items-start gap-2 text-sm leading-relaxed">
      <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
      <p className="text-foreground">
        You're recommended in <span className="font-semibold">18%</span> of ChatGPT-with-search
        responses for your primary cluster, driving an estimated{" "}
        <span className="font-semibold">580 AI sessions this week</span> and{" "}
        <span className="font-semibold">£4.2K</span> in AI-attributed revenue this quarter.
      </p>
    </div>
  );
}

function HeroTiles({ ga4Connected }: { ga4Connected: boolean }) {
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
        value={ga4Connected ? "580" : "—"}
        delta={3.6}
        deltaSuffix="%"
        sig="sig"
        spark={SPARK_SESS}
        caption={ga4Connected ? "This week" : "Connect GA4 to see live data"}
        badge={ga4Connected ? "ga4" : "preview"}
      />
      <HeroTile
        label="AI Revenue"
        value="£4.2K"
        delta={1.4}
        deltaSuffix="%"
        sig="within"
        spark={SPARK_REV}
        caption="Quarter to date"
        badge="estimated"
      />
    </div>
  );
}

function HeroTile({
  label, value, delta, deltaSuffix, sig, spark, caption, badge,
}: {
  label: string; value: string; delta: number; deltaSuffix: string;
  sig: Sig; spark: number[]; caption: string;
  badge?: "live" | "ga4" | "estimated" | "preview";
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="flex items-start justify-between gap-2">
        <p className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
          {label}
        </p>
        {badge && <StatusBadge variant={badge} />}
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

// ── Section 01 — Recommendation Intelligence ─────────────────────────────────

function RecTrendCard() {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="mb-3 flex items-start justify-between gap-2">
        <div>
          <p className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
            Recommendation share trend
          </p>
          <p className="mt-0.5 text-sm font-medium">Last 12 weeks · ChatGPT-with-search</p>
        </div>
        <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
          Perplexity, Claude, Gemini arriving in V1
        </span>
      </div>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={REC_TREND} margin={{ top: 8, right: 8, bottom: 0, left: -16 }}>
            <CartesianGrid stroke="var(--border)" strokeDasharray="2 4" vertical={false} />
            <XAxis dataKey="w" tick={{ fill: "var(--muted-foreground)", fontSize: 10 }} tickLine={false} axisLine={false} />
            <YAxis
              tick={{ fill: "var(--muted-foreground)", fontSize: 10 }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => `${v}%`}
            />
            <ChartTooltip
              contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }}
              formatter={(v: number) => `${v}%`}
            />
            <Line
              type="monotone"
              dataKey="v"
              stroke="var(--chart-1)"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4 }}
              name="ChatGPT"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <p className="mt-3 text-[10px] text-muted-foreground">
        Sampled weekly across ChatGPT's search-augmented (browse) mode. Recommendation share is
        the fraction of sampled responses where your brand appears in the recommended set.
      </p>
    </div>
  );
}

function PrimaryClusterDetailCard({ onOpenReceipts }: { onOpenReceipts: () => void }) {
  return (
    <div className="flex flex-col rounded-xl border border-border bg-card p-5">
      <div className="mb-3 flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
            Primary cluster detail
          </p>
          <div className="mt-0.5 flex items-center gap-1.5">
            <Star className="h-3 w-3 fill-primary text-primary" />
            <p className="truncate text-sm font-medium">{PRIMARY_CLUSTER.label}</p>
          </div>
        </div>
      </div>
      <dl className="grid flex-1 grid-cols-3 gap-4">
        <DetailMetric label="Rec Share" value="18%" delta={2.1} sig="sig" suffix="pp" />
        <DetailMetric label="Top-3 inclusion" value="31%" delta={1.4} sig="within" suffix="pp" />
        <DetailMetric label="First mention rate" value="10%" delta={0.3} sig="none" suffix="pp" />
      </dl>
      <div className="mt-5 flex items-center justify-between border-t border-border pt-4">
        <p className="text-[11px] text-muted-foreground">
          {RECEIPTS.length} sampled responses this week.
        </p>
        <button
          type="button"
          onClick={onOpenReceipts}
          className="inline-flex items-center gap-1.5 rounded-md border border-border bg-surface px-2.5 py-1.5 text-xs font-medium hover:border-primary/40 hover:text-primary"
        >
          <FileText className="h-3.5 w-3.5" />
          View receipts
        </button>
      </div>
      <p className="mt-3 text-[10px] text-muted-foreground">
        Multi-cluster breakdown and per-model comparison arrive in V1.
      </p>
    </div>
  );
}

function DetailMetric({
  label, value, delta, sig, suffix,
}: { label: string; value: string; delta: number; sig: Sig; suffix: string }) {
  return (
    <div>
      <dt className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
        {label}
      </dt>
      <dd className="mt-1 text-2xl font-semibold tracking-tight">{value}</dd>
      <div className="mt-1">
        <DeltaPill delta={delta} suffix={suffix} sig={sig} compact />
      </div>
    </div>
  );
}

// ── Section 02 — AI Traffic ──────────────────────────────────────────────────

function WeeklyAiSessionsCard({ ga4Connected }: { ga4Connected: boolean }) {
  if (!ga4Connected) return <Ga4EmptyCard title="AI sessions per week" />;
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="mb-3 flex items-start justify-between gap-2">
        <div>
          <p className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
            AI sessions per week
          </p>
          <p className="mt-0.5 text-sm font-medium">Last 12 weeks</p>
        </div>
        <StatusBadge variant="ga4" />
      </div>
      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={AI_SESSIONS} margin={{ top: 8, right: 8, bottom: 0, left: -16 }}>
            <CartesianGrid stroke="var(--border)" strokeDasharray="2 4" vertical={false} />
            <XAxis dataKey="w" tick={{ fill: "var(--muted-foreground)", fontSize: 10 }} tickLine={false} axisLine={false} />
            <YAxis tick={{ fill: "var(--muted-foreground)", fontSize: 10 }} tickLine={false} axisLine={false} />
            <ChartTooltip
              contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }}
            />
            <Line type="monotone" dataKey="v" stroke="var(--primary)" strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <p className="mt-2 text-[10px] text-muted-foreground">
        Per-LLM segmentation arrives in V1.
      </p>
    </div>
  );
}

function SourceDistributionCard({ ga4Connected }: { ga4Connected: boolean }) {
  if (!ga4Connected) return <Ga4EmptyCard title="Source distribution" />;
  const total = SOURCE_MIX.reduce((a, b) => a + b.value, 0);
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="mb-3">
        <p className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
          Source distribution
        </p>
        <p className="mt-0.5 text-sm font-medium">Share of AI sessions by domain</p>
      </div>
      <div className="flex items-center gap-4">
        <div className="relative h-32 w-32 shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={SOURCE_MIX}
                dataKey="value"
                nameKey="source"
                innerRadius={36}
                outerRadius={56}
                paddingAngle={2}
                stroke="var(--card)"
              >
                {SOURCE_MIX.map((s) => (
                  <Cell key={s.source} fill={s.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-mono text-lg font-semibold tabular-nums">{total}</span>
            <span className="text-[9px] font-mono uppercase tracking-wider text-muted-foreground">
              this wk
            </span>
          </div>
        </div>
        <ul className="flex-1 space-y-1.5 text-xs">
          {SOURCE_MIX.map((s) => (
            <li key={s.source} className="flex items-center justify-between gap-2">
              <span className="flex items-center gap-2 truncate">
                <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: s.color }} />
                <span className="truncate">{s.source}</span>
              </span>
              <span className="font-mono tabular-nums text-muted-foreground">
                {Math.round((s.value / total) * 100)}%
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function TopLandingPagesCard({ ga4Connected }: { ga4Connected: boolean }) {
  if (!ga4Connected) return <Ga4EmptyCard title="Top AI landing pages" />;
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="mb-3">
        <p className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
          Top AI landing pages
        </p>
        <p className="mt-0.5 text-sm font-medium">This week · top 10</p>
      </div>
      <div className="-mx-2 overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
              <th className="px-2 py-1.5 text-left font-medium">Path</th>
              <th className="px-2 py-1.5 text-right font-medium">Sess.</th>
              <th className="px-2 py-1.5 text-right font-medium">CVR</th>
              <th className="px-2 py-1.5 text-right font-medium">Rev.</th>
            </tr>
          </thead>
          <tbody>
            {TOP_LANDING.map((r) => (
              <tr key={r.path} className="border-t border-border">
                <td className="max-w-[160px] truncate px-2 py-1.5 font-mono text-[11px]">{r.path}</td>
                <td className="px-2 py-1.5 text-right font-mono tabular-nums">{r.sessions}</td>
                <td className="px-2 py-1.5 text-right font-mono tabular-nums text-muted-foreground">{r.cvr}%</td>
                <td className="px-2 py-1.5 text-right font-mono tabular-nums">£{r.revenue}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Ga4EmptyCard({ title }: { title: string }) {
  return (
    <div className="flex flex-col rounded-xl border border-dashed border-border bg-card/50 p-5">
      <p className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
        {title}
      </p>
      <div className="flex flex-1 flex-col items-start justify-center gap-3 py-8">
        <p className="text-sm text-foreground">
          Connect GA4 to see real AI-driven sessions.
        </p>
        <Link
          to="/settings"
          className="inline-flex items-center gap-1.5 rounded-md border border-primary/40 bg-primary/10 px-2.5 py-1.5 text-xs font-medium text-primary hover:bg-primary/15"
        >
          Connect GA4
          <ChevronRight className="h-3 w-3" />
        </Link>
      </div>
    </div>
  );
}

// ── Receipts Modal ───────────────────────────────────────────────────────────

function ReceiptsModal({
  open, sampleIndex, onClose, onChangeSample,
}: {
  open: boolean;
  sampleIndex: number;
  onClose: () => void;
  onChangeSample: (i: number) => void;
}) {
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onChangeSample(Math.min(sampleIndex + 1, RECEIPTS.length - 1));
      if (e.key === "ArrowLeft") onChangeSample(Math.max(sampleIndex - 1, 0));
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, sampleIndex, onClose, onChangeSample]);

  if (!open) return null;
  const safeIndex = Math.max(0, Math.min(sampleIndex, RECEIPTS.length - 1));
  const r = RECEIPTS[safeIndex];

  return (
    <div
      className="fixed inset-0 z-50 flex items-stretch justify-center bg-background/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        onClick={(e) => e.stopPropagation()}
        className="m-0 flex h-screen w-full flex-col overflow-hidden bg-card sm:m-4 sm:h-[calc(100vh-2rem)] sm:max-w-6xl sm:rounded-xl sm:border sm:border-border sm:shadow-2xl"
      >
        <ReceiptsHeader cluster={PRIMARY_CLUSTER} count={RECEIPTS.length} onClose={onClose} />

        {!r ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-2 text-center text-sm text-muted-foreground">
            <FileText className="h-6 w-6" />
            <p>No responses sampled for this cluster + model this week.</p>
          </div>
        ) : (
          <div className="grid flex-1 grid-cols-1 overflow-hidden lg:grid-cols-[minmax(0,1fr)_320px]">
            <div className="overflow-y-auto p-5">
              <ReceiptCard receipt={r} />
              <ReceiptInfoPanels receipt={r} />
            </div>
            <ReceiptsSidebar />
          </div>
        )}

        <ReceiptsFooter
          index={safeIndex}
          total={RECEIPTS.length}
          onPrev={() => onChangeSample(Math.max(safeIndex - 1, 0))}
          onNext={() => onChangeSample(Math.min(safeIndex + 1, RECEIPTS.length - 1))}
        />
      </motion.div>
    </div>
  );
}

function ReceiptsHeader({
  cluster, count, onClose,
}: { cluster: typeof PRIMARY_CLUSTER; count: number; onClose: () => void }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-border p-5">
      <div className="min-w-0">
        <p className="text-[10px] font-mono uppercase tracking-[0.15em] text-muted-foreground">
          Receipts · sampled prompts
        </p>
        <h2 className="mt-1 flex items-center gap-2 truncate text-lg font-semibold tracking-tight">
          <Star className="h-4 w-4 fill-primary text-primary" />
          {cluster.label}
        </h2>
        <div className="mt-1.5 flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground">
          <span className="font-mono tabular-nums">Rec share 18%</span>
          <span>·</span>
          <span className="font-mono tabular-nums">Top-3 31%</span>
          <span>·</span>
          <span>{count} sampled responses</span>
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
  );
}

function ReceiptCard({ receipt: r }: { receipt: Receipt }) {
  return (
    <div className="rounded-lg border border-border bg-surface/40 p-4">
      <div className="flex flex-wrap items-center gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider">
          <span className="h-1.5 w-1.5 rounded-full" style={{ background: "var(--chart-1)" }} />
          ChatGPT
        </span>
        <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
          {r.week}
        </span>
        {r.verified ? (
          <span className="inline-flex items-center gap-1 rounded-full border border-primary/25 bg-primary/10 px-1.5 py-0.5 text-[10px] font-mono uppercase tracking-wider text-primary">
            <CheckCircle2 className="h-2.5 w-2.5" /> Verified
          </span>
        ) : (
          <span className="rounded-full border border-border bg-surface px-1.5 py-0.5 text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
            Unverified
          </span>
        )}
        <span
          className={`ml-auto rounded-md border px-2 py-0.5 font-mono text-[11px] tabular-nums ${
            r.rank
              ? "border-primary/30 bg-primary/10 text-primary"
              : "border-border bg-surface text-muted-foreground"
          }`}
        >
          {r.rank ? `Rank #${r.rank}` : "Not recommended"}
        </span>
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
    </div>
  );
}

function ReceiptInfoPanels({ receipt: r }: { receipt: Receipt }) {
  return (
    <div className="mt-4 space-y-3">
      {/* Panel 1 — Prompt instance */}
      <div className="rounded-lg border border-border bg-card p-4">
        <div className="mb-2 flex items-center justify-between">
          <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
            Prompt instance
          </p>
          <button
            type="button"
            onClick={() => navigator.clipboard?.writeText(r.promptInstance)}
            className="inline-flex items-center gap-1 rounded-md border border-border bg-surface px-1.5 py-0.5 text-[10px] text-muted-foreground hover:text-foreground"
          >
            <Copy className="h-3 w-3" /> Copy
          </button>
        </div>
        <p className="text-xs leading-relaxed text-muted-foreground/90 italic">
          {r.promptInstance}
        </p>
      </div>

      {/* Panel 2 — Extracted entities */}
      <div className="rounded-lg border border-border bg-card p-4">
        <p className="mb-2 text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
          Extracted entities
        </p>
        <ul className="space-y-1.5">
          {r.entities.map((e) => (
            <li key={e.name} className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-2">
                {e.isBrand && <Star className="h-3 w-3 fill-primary text-primary" />}
                <span className={e.isBrand ? "font-semibold text-foreground" : "text-muted-foreground"}>
                  {e.name}
                </span>
                {e.isBrand && (
                  <span className="rounded-sm bg-primary/10 px-1 py-0 text-[9px] font-mono uppercase text-primary">
                    Brand
                  </span>
                )}
              </span>
              <span className="font-mono tabular-nums text-muted-foreground">
                {e.position ? `Rec #${e.position}` : "Not recommended"}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* Panel 3 — Citations */}
      <div className="rounded-lg border border-border bg-card p-4">
        <p className="mb-2 text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
          Citations
        </p>
        {r.citations.length === 0 ? (
          <p className="text-xs text-muted-foreground">No citations in this response.</p>
        ) : (
          <ul className="space-y-1.5">
            {r.citations.map((c) => (
              <li key={c.url}>
                <a
                  href={c.url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between text-xs hover:text-foreground"
                >
                  <span className="font-mono text-foreground">{c.domain}</span>
                  <ExternalLink className="h-3 w-3 text-muted-foreground" />
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function ReceiptsSidebar() {
  return (
    <aside className="border-t border-border bg-surface/30 p-5 lg:border-l lg:border-t-0">
      <p className="text-[10px] font-mono uppercase tracking-[0.15em] text-muted-foreground">
        Insights
      </p>
      <h3 className="mt-1 text-sm font-semibold">Insights coming in V1.</h3>
      <p className="mt-3 text-xs text-muted-foreground leading-relaxed">
        For now, inspect the sampled responses on the left. Once the baseline period closes, the
        Insights Engine will rank actions by expected lift on recommendation share.
      </p>
      <div className="mt-5 space-y-2">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-12 rounded-md border border-dashed border-border bg-card/40" />
        ))}
      </div>
    </aside>
  );
}

function ReceiptsFooter({
  index, total, onPrev, onNext,
}: { index: number; total: number; onPrev: () => void; onNext: () => void }) {
  return (
    <div className="flex items-center justify-between border-t border-border bg-surface/40 px-5 py-3 text-xs">
      <span className="font-mono tabular-nums text-muted-foreground">
        Sample {index + 1} of {total}
      </span>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onPrev}
          disabled={index === 0}
          className="inline-flex items-center gap-1 rounded-md border border-border bg-card px-2 py-1 text-xs disabled:opacity-40"
        >
          <ChevronLeft className="h-3 w-3" /> Prev
        </button>
        <button
          type="button"
          onClick={onNext}
          disabled={index >= total - 1}
          className="inline-flex items-center gap-1 rounded-md border border-border bg-card px-2 py-1 text-xs disabled:opacity-40"
        >
          Next <ChevronRight className="h-3 w-3" />
        </button>
      </div>
    </div>
  );
}

// ── Onboarding Addendum ──────────────────────────────────────────────────────

function PrimaryClusterOnboarding() {
  const STORAGE_KEY = "ai-visibility:primary-cluster";
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(PRIMARY_CLUSTER.id);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const set = window.localStorage.getItem(STORAGE_KEY);
    if (!set) setOpen(true);
  }, []);

  if (!open) return null;

  const options = [
    { id: "coach-booking", label: "best coach booking apps in the UK", impressions: 14200 },
    { id: "scheduling-software", label: "online scheduling software", impressions: 9800 },
    { id: "client-management", label: "client management for trainers", impressions: 6400 },
    { id: "fitness-saas", label: "fitness studio SaaS", impressions: 3100 },
    { id: "personal-trainer-tools", label: "personal trainer tools", impressions: 2700 },
  ];

  const save = () => {
    window.localStorage.setItem(STORAGE_KEY, selected);
    setOpen(false);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-background/70 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="mx-4 w-full max-w-md overflow-hidden rounded-xl border border-border bg-card shadow-2xl"
      >
        <div className="border-b border-border p-5">
          <div className="flex items-center gap-2">
            <Star className="h-4 w-4 fill-primary text-primary" />
            <p className="text-[10px] font-mono uppercase tracking-[0.15em] text-muted-foreground">
              First-run setup
            </p>
          </div>
          <h2 className="mt-2 text-lg font-semibold tracking-tight">
            Pick your primary commercial category
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            AI Visibility tracks recommendations across every category cluster you've configured,
            but one is your primary commercial bet. Which is it?
          </p>
        </div>
        <fieldset className="max-h-72 overflow-y-auto p-5">
          <legend className="sr-only">Primary commercial category</legend>
          <ul className="space-y-1">
            {options.map((o) => (
              <li key={o.id}>
                <label
                  className={`flex cursor-pointer items-center justify-between gap-3 rounded-md border px-3 py-2 text-sm transition-colors ${
                    selected === o.id
                      ? "border-primary/40 bg-primary/5"
                      : "border-border hover:bg-surface/60"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="primary-cluster"
                      value={o.id}
                      checked={selected === o.id}
                      onChange={() => setSelected(o.id)}
                      className="h-3.5 w-3.5 accent-primary"
                    />
                    <span className="truncate">{o.label}</span>
                  </span>
                  <span className="shrink-0 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                    {o.impressions.toLocaleString()} imp/mo
                  </span>
                </label>
              </li>
            ))}
          </ul>
        </fieldset>
        <div className="flex items-center justify-between border-t border-border bg-surface/40 px-5 py-3">
          <p className="text-[11px] text-muted-foreground">
            Default = top by GSC impressions
          </p>
          <button
            type="button"
            onClick={save}
            className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:opacity-90"
          >
            Save primary
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// ── Primitives ───────────────────────────────────────────────────────────────

function StatusBadge({
  variant, label,
}: {
  variant: "live" | "ga4" | "estimated" | "preview" | "baseline";
  label?: string;
}) {
  const map = {
    live: {
      cls: "border-primary/30 bg-primary/10 text-primary",
      dot: <span className="h-1.5 w-1.5 rounded-full bg-primary" />,
      text: label ?? "Live",
    },
    ga4: {
      cls: "border-primary/30 bg-primary/10 text-primary",
      dot: <CheckCircle2 className="h-2.5 w-2.5" />,
      text: label ?? "GA4-validated",
    },
    estimated: {
      cls: "border-border bg-surface text-muted-foreground",
      dot: null as React.ReactNode,
      text: label ?? "Estimated",
    },
    preview: {
      cls: "border-chart-4/30 bg-chart-4/10 text-chart-4",
      dot: null,
      text: label ?? "Preview",
    },
    baseline: {
      cls: "border-border bg-surface text-muted-foreground",
      dot: <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-chart-4" />,
      text: label ?? "Building baseline",
    },
  } as const;
  const v = map[variant];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider ${v.cls}`}
    >
      {v.dot}
      {v.text}
    </span>
  );
}

function DeltaPill({
  delta, suffix, sig, compact,
}: {
  delta: number; suffix: string; sig: Sig; compact?: boolean;
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
            positive ? "bg-primary/15 text-primary" : "bg-destructive/15 text-destructive"
          }`}
        >
          Sig
        </span>
      )}
    </span>
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
  eyebrow, title, caption,
}: { eyebrow: string; title: string; caption: string }) {
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
  children, delay = 0,
}: { children: React.ReactNode; delay?: number }) {
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
  return (
    <div className="rounded-lg border border-border bg-surface/40 px-5 py-4 text-xs text-muted-foreground">
      <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-wider text-foreground/80">
        <Info className="h-3 w-3" /> Methodology
      </div>
      <div className="mt-2 grid gap-3 leading-relaxed lg:grid-cols-2">
        <p>
          <span className="font-medium text-foreground">Sampling cadence.</span> We sample 24
          prompts × 3 responses per cluster per week through ChatGPT's search-augmented (browse)
          mode. Recommendation share is the fraction of sampled responses in which your brand
          appears in the recommended set.
        </p>
        <p>
          <span className="font-medium text-foreground">Known limitations (V0.5).</span> Coverage
          is ChatGPT-only and limited to your primary commercial cluster. Perplexity, Claude, and
          Gemini coverage, multi-cluster breakdown, and the full citation footprint arrive in V1.
          AI session attribution depends on GA4 referrer parsing and may undercount cloaked
          referrers.
        </p>
      </div>
    </div>
  );
}
