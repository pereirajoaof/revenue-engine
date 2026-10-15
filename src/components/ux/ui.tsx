import { useState, type ReactNode } from "react";
import { ChevronLeft, Info, ArrowRight } from "lucide-react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip as RTooltip,
  XAxis,
  YAxis,
} from "recharts";
import { AppLink as Link } from "@/lib/app-link";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import type { Confidence, Pin } from "./data";

/* ---------------- bands & pills ---------------- */
export type Band = "Excellent" | "Strong" | "Mixed" | "Underperforming" | "Weak";
export function bandOf(s: number): Band {
  if (s >= 85) return "Excellent";
  if (s >= 70) return "Strong";
  if (s >= 50) return "Mixed";
  if (s >= 30) return "Underperforming";
  return "Weak";
}
export const BAND_TEXT: Record<Band, string> = {
  Excellent: "text-chart-1",
  Strong: "text-chart-2",
  Mixed: "text-chart-4",
  Underperforming: "text-chart-5",
  Weak: "text-chart-5/70",
};
const BAND_PILL: Record<Band, string> = {
  Excellent: "text-chart-1 border-chart-1/40 bg-chart-1/10",
  Strong: "text-chart-2 border-chart-2/40 bg-chart-2/10",
  Mixed: "text-chart-4 border-chart-4/40 bg-chart-4/10",
  Underperforming: "text-chart-5 border-chart-5/40 bg-chart-5/10",
  Weak: "text-chart-5/70 border-chart-5/25 bg-chart-5/5",
};

export function Pill({ children, className = "", dashed }: { children: ReactNode; className?: string; dashed?: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-1 whitespace-nowrap rounded-sm border px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wider ${
        dashed ? "border-dashed" : ""
      } ${className || "border-border bg-surface text-muted-foreground"}`}
    >
      {children}
    </span>
  );
}
export function BandPill({ score }: { score: number }) {
  const b = bandOf(score);
  return <Pill className={BAND_PILL[b]}>{b}</Pill>;
}
export function ConfidencePill({ c }: { c: Confidence }) {
  return <Pill>Confidence · {c}</Pill>;
}
export function MomentumPill({ label, delta }: { label: string; delta?: string }) {
  return (
    <Pill>
      Momentum · {label}
      {delta ? ` ${delta}` : ""}
    </Pill>
  );
}
export function MoneyChip({ kind }: { kind: "Exposure" | "Modelled" | "Observed" }) {
  const cls =
    kind === "Exposure"
      ? "border-chart-3/40 bg-chart-3/10 text-chart-3"
      : kind === "Modelled"
        ? "border-primary/40 bg-primary/10 text-primary"
        : "border-chart-2/40 bg-chart-2/10 text-chart-2";
  return <Pill className={cls}>{kind}</Pill>;
}
export function StatusPill({ status }: { status: string }) {
  const cls =
    status === "Below peers" || status === "Poor"
      ? "border-chart-5/40 bg-chart-5/10 text-chart-5"
      : status === "Needs improvement"
        ? "border-chart-4/40 bg-chart-4/10 text-chart-4"
        : status === "Above peers" || status === "Good"
          ? "border-chart-1/40 bg-chart-1/10 text-chart-1"
          : status === "Within peer range"
            ? "border-chart-2/40 bg-chart-2/10 text-chart-2"
            : "";
  return <Pill className={cls}>{status}</Pill>;
}

export function InfoPop({ children, label = "How this is calculated" }: { children: ReactNode; label?: string }) {
  return (
    <Popover>
      <PopoverTrigger aria-label={label} className="inline-flex text-muted-foreground hover:text-foreground">
        <Info className="h-3.5 w-3.5" />
      </PopoverTrigger>
      <PopoverContent className="w-72 text-xs leading-relaxed">{children}</PopoverContent>
    </Popover>
  );
}

/* ---------------- top bar ---------------- */
export type Crumb = { label: string; to: string };
export function TopBar({
  crumbs,
  title,
  meta,
  controls,
}: {
  crumbs: Crumb[];
  title: string;
  meta?: ReactNode;
  controls?: ReactNode;
}) {
  const parent = crumbs[crumbs.length - 1];
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/90 backdrop-blur">
      <div className="flex flex-col gap-3 px-6 py-4 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <div className="min-w-0">
          <nav aria-label="Breadcrumb" className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
            <span className="hidden sm:inline">
              {crumbs.map((c, i) => (
                <span key={c.to}>
                  {i > 0 && <span className="mx-1.5 opacity-50">/</span>}
                  <Link to={c.to} className="hover:text-foreground">
                    {c.label}
                  </Link>
                </span>
              ))}
            </span>
            {parent && (
              <Link to={parent.to} className="inline-flex items-center hover:text-foreground sm:hidden">
                <ChevronLeft className="h-3 w-3" />
                {parent.label}
              </Link>
            )}
          </nav>
          <h1 className="mt-1 text-2xl font-bold tracking-tight">{title}</h1>
          {meta && <p className="mt-1 font-mono text-[10.5px] text-muted-foreground">{meta}</p>}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {controls}
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}

export function Segmented<T extends string>({
  value,
  options,
  onChange,
  label,
}: {
  value: T;
  options: { value: T; label: string }[];
  onChange: (v: T) => void;
  label?: string;
}) {
  return (
    <div className="flex items-center rounded-md border border-border bg-surface p-0.5" role="group" aria-label={label}>
      {label && <span className="px-2 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">{label}</span>}
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          onClick={() => onChange(o.value)}
          className={`rounded-sm px-2.5 py-1 font-mono text-[11px] transition-colors ${
            value === o.value ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

/* ---------------- score hero ---------------- */
export function Trajectory({ data, pins }: { data: { week: string; score: number }[]; pins: Pin[] }) {
  return (
    <div className="h-40 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 14, right: 8, left: -24, bottom: 0 }}>
          <CartesianGrid stroke="var(--border)" vertical={false} />
          <XAxis dataKey="week" tick={{ fontSize: 9, fontFamily: "ui-monospace", fill: "var(--muted-foreground)" }} interval={3} tickLine={false} axisLine={false} />
          <YAxis domain={[40, 100]} ticks={[50, 70, 85]} tick={{ fontSize: 9, fontFamily: "ui-monospace", fill: "var(--muted-foreground)" }} tickLine={false} axisLine={false} />
          {pins.map((p) => (
            <ReferenceLine
              key={p.week}
              x={p.week}
              stroke="var(--chart-4)"
              strokeDasharray="3 3"
              label={{ value: "◆", position: "top", fill: "var(--chart-4)", fontSize: 10 }}
            />
          ))}
          <RTooltip
            cursor={{ stroke: "var(--border)" }}
            content={({ active, payload, label }) => {
              if (!active || !payload?.length) return null;
              const pin = pins.find((p) => p.week === label);
              return (
                <div className="rounded-md border border-border bg-card px-2.5 py-1.5 font-mono text-[11px] shadow">
                  <p className="text-muted-foreground">Week of {label}</p>
                  <p>Score {payload[0].value}</p>
                  {pin && <p className="mt-1 text-chart-4">◆ {pin.label}</p>}
                </div>
              );
            }}
          />
          <Line type="monotone" dataKey="score" stroke="var(--primary)" strokeWidth={2} dot={false} activeDot={{ r: 3 }} isAnimationActive={false} />
        </LineChart>
      </ResponsiveContainer>
      {pins.length > 0 && (
        <div className="mt-1 flex flex-wrap gap-3 font-mono text-[10px] text-muted-foreground">
          {pins.map((p) => (
            <span key={p.label}>
              <span className="text-chart-4">◆</span> {p.label}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

export function ScoreHero({
  score,
  description,
  confidence,
  momentum,
  coverage,
  weightLine,
  series,
  pins,
  incomplete,
  banner,
}: {
  score: number | null;
  description: string;
  confidence: Confidence;
  momentum: { label: string; delta?: string };
  coverage: string;
  weightLine?: string;
  series?: { week: string; score: number }[];
  pins?: Pin[];
  incomplete?: ReactNode;
  banner?: ReactNode;
}) {
  return (
    <section className="rounded-[0.625rem] border border-border bg-card">
      {banner}
      <div className="grid gap-6 p-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)]">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Score</p>
          {score === null ? (
            <div className="mt-2">
              <p className="font-mono text-3xl font-semibold text-muted-foreground">Incomplete</p>
              <p className="mt-1 font-mono text-xs text-muted-foreground">{coverage}</p>
            </div>
          ) : (
            <div className="mt-1 flex items-baseline gap-2">
              <span className={`font-mono text-6xl font-semibold tabular-nums ${BAND_TEXT[bandOf(score)]}`}>{score}</span>
              <span className="font-mono text-lg text-muted-foreground">/100</span>
              <BandPill score={score} />
            </div>
          )}
          <p className="mt-3 max-w-prose text-sm leading-relaxed">{description}</p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            <ConfidencePill c={confidence} />
            <MomentumPill {...momentum} />
            {score !== null && <Pill>{coverage}</Pill>}
          </div>
          {weightLine && <p className="mt-3 font-mono text-[11px] text-muted-foreground">{weightLine}</p>}
          {incomplete}
        </div>
        <div>
          <p className="mb-1 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Trajectory · 26 weeks</p>
          {series && score !== null ? (
            <Trajectory data={series} pins={pins ?? []} />
          ) : (
            <div className="flex h-40 items-center justify-center rounded-md border border-dashed border-border font-mono text-[11px] text-muted-foreground">
              Unavailable — not enough signals to plot a score
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

/* ---------------- KPI strip ---------------- */
export type Kpi = { label: string; value: string; caption: string; chip?: ReactNode; info?: ReactNode };
export function KpiStrip({ items }: { items: Kpi[] }) {
  return (
    <section className="grid grid-cols-2 gap-px overflow-hidden rounded-[0.625rem] border border-border bg-border md:grid-cols-3 xl:grid-cols-5">
      {items.map((k) => (
        <div key={k.label} className="bg-card p-4">
          <div className="flex items-center gap-1.5">
            <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">{k.label}</p>
            {k.info && <InfoPop>{k.info}</InfoPop>}
          </div>
          <div className="mt-1.5 flex flex-wrap items-center gap-2">
            <span className="font-mono text-xl font-semibold tabular-nums">{k.value}</span>
            {k.chip}
          </div>
          <p className="mt-1 font-mono text-[10px] text-muted-foreground">{k.caption}</p>
        </div>
      ))}
    </section>
  );
}

/* ---------------- section ---------------- */
export function Section({
  title,
  caption,
  right,
  children,
}: {
  title: string;
  caption?: ReactNode;
  right?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="rounded-[0.625rem] border border-border bg-card">
      <div className="flex flex-col gap-2 border-b border-border px-5 py-3.5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-sm font-semibold">{title}</h2>
          {caption && <p className="mt-0.5 text-xs text-muted-foreground">{caption}</p>}
        </div>
        {right}
      </div>
      <div className="p-5">{children}</div>
    </section>
  );
}

export function Banner({ tone = "info", children, action }: { tone?: "info" | "amber"; children: ReactNode; action?: ReactNode }) {
  return (
    <div
      className={`flex flex-col gap-2 border-b px-5 py-3 text-sm sm:flex-row sm:items-center sm:justify-between ${
        tone === "amber" ? "border-chart-4/30 bg-chart-4/10 text-foreground" : "border-border bg-surface"
      }`}
    >
      <span>{children}</span>
      {action}
    </div>
  );
}

export function SmallButton({ children, onClick, to, primary }: { children: ReactNode; onClick?: () => void; to?: string; primary?: boolean }) {
  const cls = `inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
    primary ? "bg-primary text-primary-foreground hover:brightness-110" : "border border-border bg-surface hover:bg-card"
  }`;
  if (to)
    return (
      <Link to={to} className={cls}>
        {children}
      </Link>
    );
  return (
    <button type="button" onClick={onClick} className={cls}>
      {children}
    </button>
  );
}

export function OpenLink({ to, children = "Open" }: { to: string; children?: ReactNode }) {
  return (
    <Link to={to} className="inline-flex items-center gap-1 font-mono text-[11px] uppercase tracking-wider text-primary hover:underline">
      {children} <ArrowRight className="h-3 w-3" />
    </Link>
  );
}

/* ---------------- table -> cards ---------------- */
export type Col<T> = { key: string; label: string; render: (r: T) => ReactNode; align?: "right"; sort?: (r: T) => number | string };
export function DataTable<T>({
  rows,
  cols,
  rowKey,
  onRow,
  empty = "No rows",
}: {
  rows: T[];
  cols: Col<T>[];
  rowKey: (r: T) => string;
  onRow?: (r: T) => void;
  empty?: string;
}) {
  const [sort, setSort] = useState<{ key: string; dir: 1 | -1 } | null>(null);
  const col = cols.find((c) => c.key === sort?.key);
  const sorted =
    col?.sort && sort
      ? [...rows].sort((a, b) => {
          const x = col.sort!(a);
          const y = col.sort!(b);
          return (x < y ? -1 : x > y ? 1 : 0) * sort.dir;
        })
      : rows;
  if (!rows.length) return <p className="py-6 text-center font-mono text-xs text-muted-foreground">{empty}</p>;
  return (
    <>
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              {cols.map((c) => (
                <th
                  key={c.key}
                  className={`whitespace-nowrap px-3 py-2 font-mono text-[10px] font-normal uppercase tracking-wider text-muted-foreground ${
                    c.align === "right" ? "text-right" : "text-left"
                  }`}
                >
                  {c.sort ? (
                    <button
                      type="button"
                      className="hover:text-foreground"
                      onClick={() => setSort((s) => ({ key: c.key, dir: s?.key === c.key && s.dir === -1 ? 1 : -1 }))}
                    >
                      {c.label}
                      {sort?.key === c.key ? (sort.dir === -1 ? " ↓" : " ↑") : ""}
                    </button>
                  ) : (
                    c.label
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sorted.map((r) => (
              <tr
                key={rowKey(r)}
                onClick={onRow ? () => onRow(r) : undefined}
                className={`border-b border-border/60 last:border-0 ${onRow ? "cursor-pointer hover:bg-surface/60" : ""}`}
              >
                {cols.map((c) => (
                  <td key={c.key} className={`px-3 py-2.5 align-middle ${c.align === "right" ? "text-right font-mono tabular-nums" : ""}`}>
                    {c.render(r)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="space-y-2 md:hidden">
        {sorted.map((r) => (
          <div
            key={rowKey(r)}
            onClick={onRow ? () => onRow(r) : undefined}
            className={`rounded-md border border-border p-3 ${onRow ? "cursor-pointer" : ""}`}
          >
            <div className="mb-2 text-sm font-medium">{cols[0].render(r)}</div>
            <dl className="grid grid-cols-2 gap-x-3 gap-y-1.5">
              {cols.slice(1).map((c) => (
                <div key={c.key} className="min-w-0">
                  <dt className="font-mono text-[9px] uppercase tracking-wider text-muted-foreground">{c.label}</dt>
                  <dd className="text-xs">{c.render(r)}</dd>
                </div>
              ))}
            </dl>
          </div>
        ))}
      </div>
    </>
  );
}

/* ---------------- range charts ---------------- */
export function MiniRange({ obs, peer, lo, hi, max = 8, unit = "%" }: { obs: number; peer: number; lo: number; hi: number; max?: number; unit?: string }) {
  const x = (v: number) => `${Math.min(100, (v / max) * 100)}%`;
  const below = hi < peer;
  return (
    <div className="flex items-center gap-2">
      <div className="relative h-3 w-20 shrink-0" aria-hidden>
        <div className="absolute top-1/2 h-px w-full -translate-y-1/2 bg-border" />
        <div className="absolute top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-muted-foreground/30" style={{ left: x(lo), width: `calc(${x(hi)} - ${x(lo)})` }} />
        <div className="absolute top-0 h-3 w-px bg-foreground" style={{ left: x(peer) }} />
        <div className={`absolute top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full ${below ? "bg-chart-5" : "bg-chart-2"}`} style={{ left: x(obs) }} />
      </div>
      <span className="whitespace-nowrap font-mono text-[11px] tabular-nums">
        {obs}
        {unit} vs {peer}
        {unit}
      </span>
    </div>
  );
}

export function DotPlot({ points, max = 8 }: { points: { page: string; obs: number; lo: number; hi: number; peer: number; below: boolean }[]; max?: number }) {
  const x = (v: number) => `${(v / max) * 100}%`;
  return (
    <div>
      <div className="space-y-1.5">
        {points.map((p) => (
          <div key={p.page} className="grid grid-cols-[110px_1fr] items-center gap-3">
            <span className="truncate font-mono text-[11px] text-muted-foreground">{p.page}</span>
            <div className="relative h-4" title={`${p.page}: ${p.obs}% (90% range ${p.lo}–${p.hi}%) vs ${p.peer}% expected`}>
              <div className="absolute top-1/2 h-px w-full bg-border" />
              <div className="absolute top-1/2 h-1 -translate-y-1/2 rounded-full bg-muted-foreground/30" style={{ left: x(p.lo), width: `calc(${x(p.hi)} - ${x(p.lo)})` }} />
              <div className="absolute top-0 h-4 w-px bg-foreground/70" style={{ left: x(p.peer) }} />
              <div className={`absolute top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full ${p.below ? "bg-chart-5" : "bg-chart-2"}`} style={{ left: x(p.obs) }} />
            </div>
          </div>
        ))}
      </div>
      <div className="mt-3 grid grid-cols-[110px_1fr] gap-3 font-mono text-[9px] text-muted-foreground">
        <span />
        <div className="flex justify-between">
          {[0, 2, 4, 6, 8].map((t) => (
            <span key={t}>{t}%</span>
          ))}
        </div>
      </div>
      <p className="mt-3 flex flex-wrap gap-4 font-mono text-[10px] text-muted-foreground">
        <span><span className="mr-1 inline-block h-2 w-2 rounded-full bg-chart-5" />Below peers</span>
        <span><span className="mr-1 inline-block h-2 w-2 rounded-full bg-chart-2" />Within or above</span>
        <span><span className="mr-1 inline-block h-3 w-px bg-foreground align-middle" />Peer-expected rate</span>
        <span><span className="mr-1 inline-block h-1 w-4 rounded-full bg-muted-foreground/30 align-middle" />90% range</span>
      </p>
    </div>
  );
}

/** Wrapper used by every UX page for content spacing. */
export function Page({ children }: { children: ReactNode }) {
  return <main className="space-y-5 px-6 py-6 lg:px-8">{children}</main>;
}

export const UX_ROOT = "/dashboard/user-experience";
export const CRUMB_DASH: Crumb = { label: "Dashboard", to: "/dashboard" };
export const CRUMB_UX: Crumb = { label: "User Experience", to: UX_ROOT };
