import type { ReactNode } from "react";
import { AlertTriangle, ArrowRight, Check, Info, Minus, TrendingDown, TrendingUp, X } from "lucide-react";
import { CartesianGrid, Line, LineChart, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ThemeToggle } from "@/components/ThemeToggle";
import { AppLink as Link } from "@/lib/app-link";
import {
  bandOf, COMPETITORS, EXTERNAL, HERO_TOOLTIP, INTERNAL, METHOD_PIN_WEEK, REFERRING_DOMAINS, SCORE,
  TRAJECTORY, TRUST, TOPICS, type Confidence, type Momentum,
} from "./data";

export const label = "font-mono text-[10px] uppercase tracking-wider text-muted-foreground";

export function PageHeader({
  crumb, title, meta, controls,
}: { crumb: string; title: string; meta: string; controls?: ReactNode }) {
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/85 backdrop-blur">
      <div className="flex flex-col gap-3 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <div className="min-w-0">
          <p className={label}>{crumb}</p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight">{title}</h1>
          <p className="mt-0.5 text-xs text-muted-foreground">{meta}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {controls}
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}

export function Panel({ title, sub, children, className = "", right }: { title?: string; sub?: string; children: ReactNode; className?: string; right?: ReactNode }) {
  return (
    <section className={`min-w-0 rounded-[10px] border border-border bg-card p-5 ${className}`}>
      {(title || right) && (
        <div className="mb-4 flex flex-wrap items-start justify-between gap-2">
          <div>
            {title && <h2 className="text-sm font-semibold">{title}</h2>}
            {sub && <p className="mt-0.5 text-xs text-muted-foreground">{sub}</p>}
          </div>
          {right}
        </div>
      )}
      {children}
    </section>
  );
}

type Tone = "green" | "amber" | "red" | "grey";
const TONE: Record<Tone, string> = {
  green: "border-primary/30 bg-primary/10 text-primary",
  amber: "border-chart-4/40 bg-chart-4/10 text-chart-4",
  red: "border-destructive/40 bg-destructive/10 text-destructive",
  grey: "border-border bg-muted text-muted-foreground",
};
export function Pill({ tone = "grey", icon, children }: { tone?: Tone; icon?: ReactNode; children: ReactNode }) {
  return (
    <span className={`inline-flex items-center gap-1 whitespace-nowrap rounded-full border px-2 py-0.5 text-[11px] font-medium ${TONE[tone]}`}>
      {icon}
      {children}
    </span>
  );
}

export function ConfidencePill({ c }: { c: Confidence }) {
  const tone: Tone = c === "High" ? "green" : c === "Medium" ? "amber" : "grey";
  return <Pill tone={tone}><span className="font-mono text-[9px] uppercase opacity-70">Confidence</span> {c}</Pill>;
}

export function MomentumPill({ m }: { m: Momentum }) {
  const map: Record<Momentum, [Tone, ReactNode]> = {
    Improving: ["green", <TrendingUp key="i" className="h-3 w-3" />],
    Stable: ["grey", <Minus key="s" className="h-3 w-3" />],
    Declining: ["red", <TrendingDown key="d" className="h-3 w-3" />],
    New: ["grey", null],
    "Not comparable": ["grey", null],
  };
  const [tone, icon] = map[m];
  return <Pill tone={tone} icon={icon}><span className="font-mono text-[9px] uppercase opacity-70">Momentum</span> {m}</Pill>;
}

export function StatusChip({ s }: { s: "OK" | "Broken" | "Unknown" }) {
  if (s === "OK") return <Pill tone="green" icon={<Check className="h-3 w-3" />}>OK</Pill>;
  if (s === "Broken") return <Pill tone="red" icon={<X className="h-3 w-3" />}>Broken</Pill>;
  return <Pill tone="grey">Unknown</Pill>;
}

export function InfoTip({ text }: { text: string }) {
  return (
    <span className="group relative inline-flex">
      <button type="button" aria-label={text} className="rounded-full text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
        <Info className="h-4 w-4" />
      </button>
      <span role="tooltip" className="pointer-events-none absolute left-1/2 top-6 z-40 hidden w-64 -translate-x-1/2 rounded-md border border-border bg-popover p-2.5 text-xs text-popover-foreground shadow-md group-hover:block group-focus-within:block">
        {text}
      </span>
    </span>
  );
}

export function Exposure({ value }: { value: string }) {
  return (
    <p className="mt-3 rounded-md bg-muted px-3 py-2 text-xs text-muted-foreground">
      Estimated search revenue on affected pages: <span className="font-mono font-semibold text-foreground/80">{value}</span> (exposure, not revenue at risk)
    </p>
  );
}

export function Sparkline({ data, k }: { data: Record<string, unknown>[]; k: string }) {
  return (
    <div className="h-10 w-28" aria-hidden>
      <ResponsiveContainer>
        <LineChart data={data}>
          <Line dataKey={k} stroke="var(--primary)" strokeWidth={1.5} dot={false} connectNulls={false} isAnimationActive={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export function TrajectoryChart({ pin = "Method changed", pinWeek = METHOD_PIN_WEEK, data = TRAJECTORY }: { pin?: string; pinWeek?: string; data?: typeof TRAJECTORY }) {
  return (
    <figure className="h-52 w-full min-w-0">
      <figcaption className="sr-only">
        Weekly Website Authority score over 12 weeks, rising from 47 to 51. One week has no reading. A marker shows “{pin}” in the week of {pinWeek}.
      </figcaption>
      <ResponsiveContainer>
        <LineChart data={data} margin={{ top: 18, right: 8, left: -24, bottom: 0 }}>
          <CartesianGrid stroke="var(--border)" vertical={false} />
          <XAxis dataKey="week" tick={{ fontSize: 10, fill: "var(--muted-foreground)" }} tickLine={false} axisLine={false} interval={1} />
          <YAxis domain={[40, 60]} tick={{ fontSize: 10, fill: "var(--muted-foreground)" }} tickLine={false} axisLine={false} />
          <ReferenceLine x={pinWeek} stroke="var(--muted-foreground)" strokeDasharray="3 3" label={{ value: pin, position: "top", fontSize: 10, fill: "var(--muted-foreground)" }} />
          <Tooltip
            content={({ active, payload, label: wk }) => {
              if (!active || !payload?.length) return null;
              const p = payload[0].payload as (typeof TRAJECTORY)[number];
              return (
                <div className="rounded-md border border-border bg-popover p-2 text-xs shadow-md">
                  <p className="font-mono text-[10px] uppercase text-muted-foreground">Week of {wk}</p>
                  {p.score == null ? (
                    <p className="mt-1">No reading this week</p>
                  ) : (
                    <>
                      <p className="mt-1 font-semibold">Score {p.score}</p>
                      <p className="text-muted-foreground">External links {p.external} · Internal distribution {p.internal}</p>
                    </>
                  )}
                </div>
              );
            }}
          />
          <Line dataKey="score" stroke="var(--primary)" strokeWidth={2} dot={{ r: 2.5 }} connectNulls={false} isAnimationActive={false} />
        </LineChart>
      </ResponsiveContainer>
    </figure>
  );
}

export type HeroVariant =
  | { kind: "normal"; momentum?: Momentum; banner?: string; note?: string; pin?: string }
  | { kind: "incomplete"; reason: string }
  | { kind: "zero" };

export function HeroCard({ v = { kind: "normal" } }: { v?: HeroVariant }) {
  const incomplete = v.kind === "incomplete";
  const score = v.kind === "zero" ? 0 : SCORE;
  return (
    <section className="rounded-[10px] border border-border bg-card">
      {v.kind === "normal" && v.banner && (
        <div className="flex items-center gap-2 border-b border-chart-4/30 bg-chart-4/10 px-5 py-2 text-xs text-chart-4">
          <AlertTriangle className="h-3.5 w-3.5" /> {v.banner}
        </div>
      )}
      <div className="grid gap-6 p-5 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <p className={label}>Website Authority</p>
            <InfoTip text={HERO_TOOLTIP} />
          </div>
          {incomplete ? (
            <>
              <p className="mt-2 text-5xl font-bold tracking-tight text-muted-foreground">Incomplete</p>
              <p className="mt-2 text-sm text-muted-foreground">{v.reason}</p>
            </>
          ) : (
            <>
              <p className="mt-2 flex items-baseline gap-2">
                <span className="text-6xl font-bold tracking-tight">{score}</span>
                <span className="text-lg text-muted-foreground">/100</span>
                <span className="ml-2 text-sm font-semibold">{bandOf(score)}</span>
              </p>
              <p className="mt-2 text-sm">
                {v.kind === "zero"
                  ? "We found no referring domains in our link index. This doesn't prove none exist."
                  : "Solid external endorsement; support for priority pages is uneven."}
              </p>
            </>
          )}
          <div className="mt-3 flex flex-wrap gap-2">
            <ConfidencePill c={incomplete ? "Incomplete" : "High"} />
            {!incomplete && <MomentumPill m={v.kind === "normal" ? v.momentum ?? "Stable" : "Not comparable"} />}
          </div>
          {v.kind === "normal" && v.note && <p className="mt-2 text-xs text-muted-foreground">{v.note}</p>}
          <p className="mt-4 text-xs text-muted-foreground">
            <span className={label}>Assessed</span> · 2,000 of 2,000 pages · 100% of linked pages observed · links: site-level count + top 1,000 pages
          </p>
        </div>
        <div className="min-w-0">
          {incomplete ? (
            <div className="flex h-52 items-center justify-center rounded-md border border-dashed border-border text-xs text-muted-foreground">
              Trend hidden while the score is incomplete
            </div>
          ) : (
            <TrajectoryChart pin={v.kind === "normal" && v.pin ? v.pin : "Method changed"} />
          )}
        </div>
      </div>
    </section>
  );
}

export type ExtVariant = "normal" | "stale" | "zero" | { value: number };
export type IntVariant = "normal" | { incomplete: string; sample?: boolean } | { blocked: true };

export function ComponentCards({ ext = "normal", int = "normal" }: { ext?: ExtVariant; int?: IntVariant }) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <section className="min-w-0 rounded-[10px] border border-border bg-card p-5">
        <p className={label}>External links</p>
        {ext === "stale" ? (
          <>
            <p className="mt-2 text-3xl font-bold text-muted-foreground">Historical — week of 22 Sep: 64</p>
            <p className="mt-1 text-xs text-muted-foreground">The latest weekly link read is out of date, so this part is not used in the score.</p>
          </>
        ) : (
          <>
            <div className="mt-2 flex items-end justify-between gap-3">
              <p className="text-4xl font-bold">
                {ext === "zero" ? 0 : typeof ext === "object" ? ext.value : EXTERNAL}
                <span className="text-base text-muted-foreground">/100</span>
              </p>
              {ext === "normal" && <Sparkline data={TRAJECTORY} k="external" />}
            </div>
            <p className="mt-2 text-sm">{ext === "zero" ? "0 referring domains" : `${REFERRING_DOMAINS} referring domains`}</p>
            {ext === "normal" && (
              <>
                <p className="text-xs text-muted-foreground">≈29 of 51 pts (approximate share)</p>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <Pill tone="green" icon={<Check className="h-3 w-3" />}>Fresh · week of 12 Oct</Pill>
                  <Pill tone="green" icon={<TrendingUp className="h-3 w-3" />}>↑ +2</Pill>
                </div>
              </>
            )}
          </>
        )}
        <Link to="/website-authority/links" className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline">
          View external links <ArrowRight className="h-3 w-3" />
        </Link>
      </section>

      <section className="min-w-0 rounded-[10px] border border-border bg-card p-5">
        <p className={label}>{typeof int === "object" && "blocked" in int ? "Incomplete: crawler access blocked" : "Internal distribution"}</p>
        {typeof int === "object" && "blocked" in int ? (
          <>
            <p className="mt-2 text-sm">
              Your site refused the OrganicOS crawler on every page in the latest crawl, so we could not read your internal links. This is not a zero score. Allow the crawler in your CDN or firewall, then re-run the audit.
            </p>
            <a href="/crawler" className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline">
              How to allow the OrganicOS crawler <ArrowRight className="h-3 w-3" />
            </a>
            <p className="mt-2 font-mono text-[11px] text-muted-foreground">1,001 URLs requested · 0 analysed</p>
          </>
        ) : typeof int === "object" ? (
          <>
            <p className="mt-2 text-3xl font-bold text-muted-foreground">Incomplete</p>
            <p className="mt-1 text-sm text-muted-foreground">{int.incomplete}</p>
            {int.sample && (
              <div className="mt-3 rounded-md border border-dashed border-border p-3">
                <p className={label}>Sample-only findings (from the pages we crawled)</p>
                <ul className="mt-2 list-disc space-y-1 pl-4 text-xs">
                  <li>11 of 160 crawled product pages have fewer than 3 internal links.</li>
                  <li>2 crawled pages link to error pages.</li>
                </ul>
              </div>
            )}
          </>
        ) : (
          <>
            <div className="mt-2 flex items-end justify-between gap-3">
              <p className="text-4xl font-bold">{INTERNAL}<span className="text-base text-muted-foreground">/100</span></p>
              <Sparkline data={TRAJECTORY} k="internal" />
            </div>
            <p className="mt-2 text-sm">70% of priority pages supported · 98% reachable from homepage</p>
            <p className="text-xs text-muted-foreground">4% of link flow to broken pages · ≈21 of 51 pts</p>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <Pill tone="amber" icon={<AlertTriangle className="h-3 w-3" />}>9% to non-indexable pages (review)</Pill>
              <Pill tone="red" icon={<TrendingDown className="h-3 w-3" />}>↓ −3</Pill>
            </div>
          </>
        )}
        {!(typeof int === "object" && "blocked" in int) && (
          <Link to="/website-authority/distribution" className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline">
            View internal distribution <ArrowRight className="h-3 w-3" />
          </Link>
        )}
      </section>
    </div>
  );
}

export function CompetitorBar({ large = false }: { large?: boolean }) {
  const { you, median, leader, count } = COMPETITORS;
  const marks = [
    { v: you, name: "You", strong: true },
    { v: median, name: "Median" },
    { v: leader, name: "Leader" },
  ];
  return (
    <div>
      <p className="text-xs">Your external links score vs {count} tracked competitors</p>
      <div className={`relative mt-6 ${large ? "mb-8 h-3" : "mb-7 h-2"} rounded-full bg-muted`} role="img" aria-label={`You ${you}, median ${median}, leader ${leader}, out of 100`}>
        {marks.map((m) => (
          <div key={m.name} className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2" style={{ left: `${m.v}%` }}>
            <div className={`h-5 w-0.5 ${m.strong ? "bg-primary" : "bg-muted-foreground"}`} />
            <p className={`absolute left-1/2 top-6 -translate-x-1/2 whitespace-nowrap font-mono text-[10px] ${m.strong ? "font-semibold text-primary" : "text-muted-foreground"}`}>
              {m.name} {m.v}
            </p>
          </div>
        ))}
      </div>
      <p className={label}>Context only, not part of your score</p>
    </div>
  );
}

export function TopicTable() {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[360px] text-xs">
        <thead>
          <tr className={`${label} text-left`}>
            <th className="py-1 pr-2 font-normal">Topic</th>
            <th className="py-1 pr-2 text-right font-normal">Pages</th>
            <th className="py-1 pr-2 text-right font-normal">Internal</th>
            <th className="py-1 pr-2 text-right font-normal">Dom–page</th>
            <th className="py-1 text-right font-normal">Impr.</th>
          </tr>
        </thead>
        <tbody>
          {TOPICS.map((t) => (
            <tr key={t.topic} className="border-t border-border">
              <td className="py-1.5 pr-2">{t.topic}</td>
              <td className="py-1.5 pr-2 text-right font-mono">{t.pages}%</td>
              <td className="py-1.5 pr-2 text-right font-mono">{t.support}%</td>
              <td className="py-1.5 pr-2 text-right font-mono">{t.links}%</td>
              <td className="py-1.5 text-right font-mono">{t.impressions}%</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="mt-2 text-[11px] text-muted-foreground">Shares of page count, internal link support, domain–page links and search impressions. Never combined into a score.</p>
    </div>
  );
}

export function TrustList() {
  return (
    <ul className="space-y-1.5 text-sm">
      {TRUST.map((t) => (
        <li key={t.name} className="flex items-center gap-2">
          {t.ok ? <Check className="h-4 w-4 text-primary" aria-label="Found" /> : <X className="h-4 w-4 text-destructive" aria-label="Missing" />}
          {t.name}
          {!t.ok && <span className="text-xs text-muted-foreground">Not found</span>}
        </li>
      ))}
    </ul>
  );
}

export function waHead(title: string, description: string) {
  const t = `${title} — Website Authority · OrganicOS`;
  return {
    meta: [
      { title: t },
      { name: "description", content: description },
      { property: "og:title", content: t },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  };
}
