import { createContext, useContext, useState, type ReactNode } from "react";
import { Info, Settings2, X } from "lucide-react";
import { AppLink as Link } from "@/lib/app-link";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import type { CwvChip, Rate, UxStatus } from "@/lib/ux-data";

/* ---------- Mock account state ---------- */
export type MockState =
  | "full"
  | "gsc"
  | "no-outcome"
  | "small"
  | "stale"
  | "new"
  | "currency"
  | "leadgen";

export const MOCK_STATES: { id: MockState; label: string }[] = [
  { id: "full", label: "1 · Full (GA4 + outcome)" },
  { id: "gsc", label: "2 · Search Console only" },
  { id: "no-outcome", label: "3 · GA4, no outcome chosen" },
  { id: "small", label: "4 · Small site" },
  { id: "stale", label: "5 · Stale connection" },
  { id: "new", label: "6 · Just connected" },
  { id: "currency", label: "7 · Currency mismatch" },
  { id: "leadgen", label: "8 · Lead-gen account" },
];

type Ctx = {
  state: MockState;
  setState: (s: MockState) => void;
  hasGA4: boolean;
  hasOutcome: boolean;
  showMoney: boolean;
  outcome: string; // "purchase" | "form submission"
  outcomeRate: string; // "Purchase rate"
  money: (v: number | null) => string;
};

const UxCtx = createContext<Ctx | null>(null);

export function UxStateProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<MockState>("full");
  const hasGA4 = state !== "gsc" && state !== "new";
  const hasOutcome = hasGA4 && state !== "no-outcome";
  const showMoney = state !== "currency" && state !== "leadgen";
  const leadgen = state === "leadgen";
  const money = (v: number | null) => {
    if (!showMoney || v === null) return "—";
    if (v >= 1000) return `£${(v / 1000).toFixed(1).replace(/\.0$/, "")}k`;
    return `£${v.toLocaleString("en-GB")}`;
  };
  return (
    <UxCtx.Provider
      value={{
        state,
        setState,
        hasGA4,
        hasOutcome,
        showMoney,
        outcome: leadgen ? "form submission" : "purchase",
        outcomeRate: leadgen ? "Submission rate" : "Purchase rate",
        money,
      }}
    >
      {children}
    </UxCtx.Provider>
  );
}

export function useUx() {
  const c = useContext(UxCtx);
  if (!c) throw new Error("useUx outside provider");
  return c;
}

export function MockStateSwitcher() {
  const { state, setState } = useUx();
  const [open, setOpen] = useState(false);
  return (
    <div className="fixed bottom-4 right-4 z-50">
      {open ? (
        <div className="w-64 rounded-lg border border-dashed border-chart-4/60 bg-card p-3 shadow-lg">
          <div className="mb-2 flex items-center justify-between">
            <p className="font-mono text-[10px] uppercase tracking-wider text-chart-4">Mockup control · account state</p>
            <button onClick={() => setOpen(false)} aria-label="Close" className="text-muted-foreground hover:text-foreground">
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
          <div className="space-y-0.5">
            {MOCK_STATES.map((s) => (
              <button
                key={s.id}
                onClick={() => setState(s.id)}
                className={`w-full rounded px-2 py-1 text-left font-mono text-[11px] ${
                  state === s.id ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-surface hover:text-foreground"
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <button
          onClick={() => setOpen(true)}
          className="flex items-center gap-2 rounded-full border border-dashed border-chart-4/60 bg-card px-3 py-2 font-mono text-[10px] uppercase tracking-wider text-chart-4 shadow-lg"
        >
          <Settings2 className="h-3.5 w-3.5" /> Mock state: {MOCK_STATES.find((s) => s.id === state)?.label.split(" · ")[1]}
        </button>
      )}
    </div>
  );
}

/* ---------- Top bar ---------- */
export function UxTopBar({
  crumbs,
  title,
  subtitle,
  meta,
  controls,
}: {
  crumbs: { label: string; to: string }[];
  title: string;
  subtitle?: string;
  meta?: string;
  controls?: ReactNode;
}) {
  const parent = crumbs[crumbs.length - 1];
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/90 backdrop-blur">
      <div className="flex flex-col gap-3 px-6 py-4 lg:flex-row lg:items-start lg:justify-between lg:px-8">
        <div className="min-w-0">
          <nav aria-label="Breadcrumb" className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
            <span className="hidden sm:inline">
              {crumbs.map((c, i) => (
                <span key={c.to}>
                  {i > 0 && <span className="mx-1.5 opacity-50">/</span>}
                  <Link to={c.to} className="hover:text-foreground">{c.label}</Link>
                </span>
              ))}
            </span>
            <Link to={parent.to} className="sm:hidden hover:text-foreground">‹ {parent.label}</Link>
          </nav>
          <h1 className="mt-1 text-2xl font-bold tracking-tight">{title}</h1>
          {subtitle && <p className="mt-0.5 text-sm text-muted-foreground">{subtitle}</p>}
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

export function SelectControl({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (v: string) => void }) {
  return (
    <label className="flex items-center gap-1.5 rounded-md border border-border bg-surface px-2 py-1.5">
      <span className="font-mono text-[9.5px] uppercase tracking-wider text-muted-foreground">{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)} className="bg-transparent text-xs outline-none">
        {options.map((o) => (
          <option key={o} value={o} className="bg-card">{o}</option>
        ))}
      </select>
    </label>
  );
}

/* ---------- Chips & pills ---------- */
export function EvidenceChip({ kind }: { kind: "Exposure" | "Modelled" | "Observed" }) {
  const cls =
    kind === "Exposure"
      ? "border-chart-3/50 text-chart-3"
      : kind === "Modelled"
        ? "border-primary/50 text-primary border-dashed"
        : "border-foreground/30 text-foreground";
  return <span className={`inline-flex items-center rounded border px-1.5 py-px font-mono text-[9px] uppercase tracking-wider ${cls}`}>{kind}</span>;
}

export function SourceChip({ children }: { children: ReactNode }) {
  return <span className="inline-flex rounded bg-surface px-1.5 py-px font-mono text-[9px] uppercase tracking-wider text-muted-foreground">{children}</span>;
}

export function StatusPill({ status }: { status: UxStatus }) {
  const cls =
    status === "Below peers"
      ? "bg-chart-5/12 text-chart-5 border-chart-5/30"
      : status === "Above peers"
        ? "bg-primary/12 text-primary border-primary/30"
        : status === "Within peer range"
          ? "bg-muted text-muted-foreground border-border"
          : "border-dashed border-border text-muted-foreground";
  return <span className={`inline-flex whitespace-nowrap rounded-full border px-2 py-0.5 font-mono text-[10px] ${cls}`}>{status}</span>;
}

export function CwvEvidence({ cwv }: { cwv: CwvChip }) {
  const chip = (
    <span
      className={`inline-flex whitespace-nowrap rounded border px-1.5 py-0.5 font-mono text-[10px] ${
        cwv.fallback ? "border-dashed border-border text-muted-foreground/80" : "border-border text-foreground"
      }`}
    >
      {cwv.label}
    </span>
  );
  if (!cwv.fallback || cwv.label === "No field data") return chip;
  return (
    <Tooltip>
      <TooltipTrigger asChild>{chip}</TooltipTrigger>
      <TooltipContent>Measured on another URL — not evidence about this page</TooltipContent>
    </Tooltip>
  );
}

export function AssumptionInfo({ text }: { text: string }) {
  return (
    <Popover>
      <PopoverTrigger aria-label="How this is estimated" className="text-muted-foreground hover:text-foreground">
        <Info className="h-3.5 w-3.5" />
      </PopoverTrigger>
      <PopoverContent className="w-72 text-xs">{text}</PopoverContent>
    </Popover>
  );
}

export const OPPORTUNITY_ASSUMPTION =
  "If these pages converted at the rate of similar pages on this site, with the same traffic and the page type's average order value. Not a forecast.";

/* ---------- Dot-and-range mini chart ---------- */
export function RangeDot({ rate, max, unit = "%", warn }: { rate: Rate; max: number; unit?: string; warn?: boolean }) {
  const W = 96;
  const x = (v: number) => Math.max(2, Math.min(W - 2, (v / max) * W));
  return (
    <div className="flex items-center gap-2">
      <svg width={W} height={14} className="shrink-0" aria-hidden>
        <line x1={0} x2={W} y1={7} y2={7} className="stroke-border" strokeWidth={1} />
        <rect x={x(rate.lo)} y={4} width={Math.max(2, x(rate.hi) - x(rate.lo))} height={6} rx={3} className={warn ? "fill-chart-5/30" : "fill-muted-foreground/25"} />
        <line x1={x(rate.peer)} x2={x(rate.peer)} y1={1} y2={13} className="stroke-foreground" strokeWidth={1.5} />
        <circle cx={x(rate.obs)} cy={7} r={3.5} className={warn ? "fill-chart-5" : "fill-muted-foreground"} />
      </svg>
      <span className="whitespace-nowrap font-mono text-[11px]">
        {rate.obs}
        {unit} <span className="text-muted-foreground">vs {rate.peer}{unit}</span>
      </span>
    </div>
  );
}

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <section className={`rounded-[0.625rem] border border-border bg-card ${className}`}>{children}</section>;
}

export function SectionTitle({ title, sub, right }: { title: string; sub?: string; right?: ReactNode }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-2 border-b border-border px-4 py-3">
      <div>
        <h2 className="text-sm font-semibold">{title}</h2>
        {sub && <p className="text-xs text-muted-foreground">{sub}</p>}
      </div>
      {right}
    </div>
  );
}

export function Label({ children }: { children: ReactNode }) {
  return <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">{children}</p>;
}

export function Signed({ d, lo, hi, unit = " pts" }: { d: number; lo: number; hi: number; unit?: string }) {
  const crosses = lo < 0 && hi > 0;
  const s = `${d > 0 ? "+" : d < 0 ? "−" : ""}${Math.abs(d).toFixed(1)}${unit}`;
  if (crosses)
    return (
      <span className="font-mono text-[11px] text-muted-foreground">
        {s} <span className="text-[10px]">· no clear change</span>
      </span>
    );
  return <span className="font-mono text-[11px]">{s}</span>;
}

export function IllustrativeNote() {
  return (
    <p className="pt-4 font-mono text-[10px] text-muted-foreground">
      All figures are illustrative mock data for Northwind Botanicals (GBP) — not live measurements.
    </p>
  );
}

export function UxControls() {
  const [w, setW] = useState("Last 4 complete weeks");
  const [d, setD] = useState("All");
  return (
    <>
      <SelectControl label="Window" value={w} onChange={setW} options={["Last 4 complete weeks", "Last 13 complete weeks"]} />
      <SelectControl label="Device" value={d} onChange={setD} options={["All", "Mobile", "Desktop"]} />
    </>
  );
}

