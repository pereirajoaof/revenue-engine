import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Check,
  ChevronDown,
  Gauge,
  Info,
  Loader2,
  Mail,
  Plus,
  Sparkles,
  Trash2,
  TrendingDown,
  Zap,
} from "lucide-react";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { MarginGauge } from "@/components/calculator/MarginGauge";
import { AnimatedMoney, AnimatedPercent } from "@/components/calculator/AnimatedNumber";
import { supabase } from "@/integrations/supabase/client";
import {
  calculate,
  COMPLEXITY,
  CURRENCIES,
  DATA_QUALITY,
  DEFAULTS,
  DELIVERABLES,
  DELIVERABLE_BY_REF,
  formatHours,
  formatMoney,
  type Complexity,
  type CurrencyCode,
  type DataQuality,
  type JobLine,
  type Verdict,
} from "@/lib/pricing-calculator";

export const Route = createFileRoute("/planner")({
  component: PricingCalculatorPage,
  head: () => ({
    meta: [
      { title: "AI vs Manual: SEO & Content Pricing Calculator | OrganicOS" },
      {
        name: "description",
        content:
          "Free calculator for agencies and freelancers: see what SEO and content deliverables cost manually, what they cost you with AI, and the sweet-spot price to quote.",
      },
      { property: "og:title", content: "AI vs Manual: SEO & Content Pricing Calculator" },
      {
        property: "og:description",
        content:
          "Price AI-assisted SEO and content so the work stays profitable for you and competitive for your client. Free, no signup.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
});

let uid = 0;
const newId = () => `line-${++uid}-${Math.random().toString(36).slice(2, 7)}`;

const VERDICT_STYLE: Record<Verdict, string> = {
  healthy: "bg-primary/10 text-primary border-primary/30",
  thin: "bg-chart-4/10 text-chart-4 border-chart-4/30",
  "below-floor": "bg-destructive/10 text-destructive border-destructive/30",
};

function Segmented<T extends string>({
  value,
  onChange,
  options,
  label,
  hint,
}: {
  value: T;
  onChange: (v: T) => void;
  options: { id: T; label: string; mult: number }[];
  label: string;
  hint: string;
}) {
  return (
    <div>
      <div className="mb-1.5 flex items-center gap-1.5">
        <span className="text-sm font-medium">{label}</span>
        <span title={hint} className="text-muted-foreground">
          <Info className="h-3.5 w-3.5" aria-hidden />
          <span className="sr-only">{hint}</span>
        </span>
      </div>
      <div role="radiogroup" aria-label={label} className="grid grid-cols-3 gap-1 rounded-xl border border-border bg-surface p-1">
        {options.map((o) => {
          const sel = o.id === value;
          return (
            <button
              key={o.id}
              type="button"
              role="radio"
              aria-checked={sel}
              onClick={() => onChange(o.id)}
              className={`rounded-lg px-2 py-2 text-xs font-medium transition-all ${
                sel ? "bg-card text-foreground shadow-sm ring-1 ring-border" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {o.label}
              <span className="ml-1 font-mono text-[10px] text-muted-foreground">×{o.mult}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function PricingCalculatorPage() {
  const [rate, setRate] = useState<number>(DEFAULTS.rate);
  const [currency, setCurrency] = useState<CurrencyCode>(DEFAULTS.currency);
  const [dataQuality, setDataQuality] = useState<DataQuality>(DEFAULTS.dataQuality);
  const [complexity, setComplexity] = useState<Complexity>(DEFAULTS.complexity);
  const [clientDiscount, setClientDiscount] = useState<number>(DEFAULTS.clientDiscount);
  const [lines, setLines] = useState<JobLine[]>([
    { id: newId(), ref: "C06", qty: 8 },
    { id: newId(), ref: "S01", qty: 1 },
  ]);
  const [mobileOpen, setMobileOpen] = useState(false);

  const result = useMemo(
    () => calculate({ lines, rate, dataQuality, complexity, clientDiscount }),
    [lines, rate, dataQuality, complexity, clientDiscount],
  );

  const addLine = () => {
    const used = new Set(lines.map((l) => l.ref));
    const next = DELIVERABLES.find((d) => !used.has(d.ref)) ?? DELIVERABLES[0]!;
    setLines((p) => [...p, { id: newId(), ref: next.ref, qty: 1 }]);
  };
  const removeLine = (id: string) => setLines((p) => p.filter((l) => l.id !== id));
  const patchLine = (id: string, patch: Partial<JobLine>) =>
    setLines((p) => p.map((l) => (l.id === id ? { ...l, ...patch } : l)));

  const grouped = useMemo(
    () => ({
      Content: DELIVERABLES.filter((d) => d.category === "Content"),
      SEO: DELIVERABLES.filter((d) => d.category === "SEO"),
    }),
    [],
  );

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Nav />

      {/* Hero */}
      <header className="px-6 pb-10 pt-28">
        <div className="mx-auto max-w-6xl">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
            <Sparkles className="h-3 w-3 text-primary" /> Free tool
          </span>
          <h1 className="mt-4 max-w-3xl text-balance font-display text-4xl font-bold tracking-tight sm:text-5xl">
            Price your AI-assisted SEO &amp; content — profitably.
          </h1>
          <p className="mt-4 max-w-2xl text-balance text-base leading-relaxed text-muted-foreground sm:text-lg">
            See what each deliverable would cost manually, what it costs you with automation, and the sweet-spot price
            to charge.
          </p>
          <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
            Free. No signup to calculate.
          </p>
        </div>
      </header>

      <main className="px-6 pb-32 lg:pb-20">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_380px]">
          {/* ============ JOB BUILDER ============ */}
          <div className="space-y-6">
            {/* Global settings */}
            <section className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
              <h2 className="font-display text-lg font-semibold tracking-tight">Your settings</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                These drive the realism layer applied to your delivery time.
              </p>

              <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="rate" className="mb-1.5 block text-sm font-medium">
                    Your standard hourly rate
                  </label>
                  <div className="relative">
                    <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 font-mono text-sm text-muted-foreground">
                      {CURRENCIES.find((c) => c.id === currency)?.symbol}
                    </span>
                    <input
                      id="rate"
                      type="number"
                      min={0}
                      value={rate}
                      onChange={(e) => setRate(Math.max(0, Number(e.target.value) || 0))}
                      className="w-full rounded-xl border border-border bg-background py-2.5 pl-7 pr-3 font-mono text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                </div>

                <div>
                  <span className="mb-1.5 block text-sm font-medium">Currency</span>
                  <div role="radiogroup" aria-label="Currency" className="grid grid-cols-3 gap-1 rounded-xl border border-border bg-surface p-1">
                    {CURRENCIES.map((c) => {
                      const sel = c.id === currency;
                      return (
                        <button
                          key={c.id}
                          type="button"
                          role="radio"
                          aria-checked={sel}
                          onClick={() => setCurrency(c.id)}
                          className={`rounded-lg px-2 py-2 text-xs font-medium transition-all ${
                            sel ? "bg-card text-foreground shadow-sm ring-1 ring-border" : "text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          <span className="font-mono">{c.symbol}</span> {c.id}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <Segmented
                  label="Data quality"
                  hint="How usable is the client's source data? Messy data is the #1 cause of overrun."
                  value={dataQuality}
                  onChange={setDataQuality}
                  options={DATA_QUALITY}
                />

                <Segmented
                  label="Job complexity"
                  hint="Regulated sectors, strict brand rules, or multiple approvers push this up."
                  value={complexity}
                  onChange={setComplexity}
                  options={COMPLEXITY}
                />
              </div>

              {/* Discount slider */}
              <div className="mt-6 rounded-xl border border-border bg-surface p-4">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <label htmlFor="discount" className="text-sm font-medium">
                    How much cheaper than manual do you want to quote?
                  </label>
                  <span className="font-display text-xl font-bold tabular-nums text-primary">
                    {Math.round(clientDiscount * 100)}%
                  </span>
                </div>
                <input
                  id="discount"
                  type="range"
                  min={DEFAULTS.discountMin * 100}
                  max={DEFAULTS.discountMax * 100}
                  step={1}
                  value={Math.round(clientDiscount * 100)}
                  onChange={(e) => setClientDiscount(Number(e.target.value) / 100)}
                  aria-valuetext={`${Math.round(clientDiscount * 100)} percent cheaper than manual`}
                  className="mt-3 h-2 w-full cursor-pointer appearance-none rounded-full bg-border accent-primary"
                />
                <div className="mt-1.5 flex justify-between font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                  <span>20% · more profit</span>
                  <span>60% · more competitive</span>
                </div>
              </div>
            </section>

            {/* Deliverables */}
            <section className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="font-display text-lg font-semibold tracking-tight">Deliverables</h2>
                  <p className="mt-1 text-sm text-muted-foreground">Build the job line by line.</p>
                </div>
                <button
                  type="button"
                  onClick={addLine}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3.5 py-2 text-sm font-semibold text-primary-foreground transition-all hover:brightness-110"
                >
                  <Plus className="h-4 w-4" /> Add deliverable
                </button>
              </div>

              <div className="mt-5 space-y-3">
                {lines.length === 0 && (
                  <p className="rounded-xl border border-dashed border-border bg-surface px-4 py-10 text-center text-sm text-muted-foreground">
                    No deliverables yet — add your first line to see pricing.
                  </p>
                )}

                {lines.map((line) => {
                  const d = DELIVERABLE_BY_REF[line.ref];
                  const row = result.lines.find((r) => r.id === line.id);
                  return (
                    <div
                      key={line.id}
                      className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3 rounded-xl border border-border bg-background p-3 transition-colors hover:border-primary/30 sm:grid-cols-[minmax(0,1fr)_96px_120px_auto] sm:items-center"
                    >
                      <div className="min-w-0">
                        <label className="sr-only" htmlFor={`sel-${line.id}`}>
                          Deliverable
                        </label>
                        <div className="relative">
                          <select
                            id={`sel-${line.id}`}
                            value={line.ref}
                            onChange={(e) => patchLine(line.id, { ref: e.target.value })}
                            className="w-full appearance-none rounded-lg border border-border bg-card py-2 pl-3 pr-8 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                          >
                            {(["Content", "SEO"] as const).map((cat) => (
                              <optgroup key={cat} label={cat}>
                                {grouped[cat].map((opt) => (
                                  <option key={opt.ref} value={opt.ref}>
                                    {opt.ref} · {opt.name}
                                  </option>
                                ))}
                              </optgroup>
                            ))}
                          </select>
                          <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        </div>
                        <p className="mt-1.5 truncate font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                          {d?.unit} · {d?.manualHrs}h manual · ×{d?.autoFactor} with AI
                        </p>
                      </div>

                      <div className="sm:w-24">
                        <label className="sr-only" htmlFor={`qty-${line.id}`}>
                          Quantity
                        </label>
                        <input
                          id={`qty-${line.id}`}
                          type="number"
                          min={0}
                          value={line.qty}
                          onChange={(e) => patchLine(line.id, { qty: Math.max(0, Number(e.target.value) || 0) })}
                          className="w-full rounded-lg border border-border bg-card px-3 py-2 text-center font-mono text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                        />
                      </div>

                      <div className="col-span-2 flex items-center justify-between gap-3 border-t border-border pt-2 sm:col-span-1 sm:block sm:border-0 sm:pt-0 sm:text-right">
                        <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground sm:hidden">
                          Line price
                        </span>
                        <div>
                          <div className="font-mono text-sm font-semibold tabular-nums">
                            {formatMoney(row?.linePrice ?? 0, currency)}
                          </div>
                          <div className="font-mono text-[10px] text-muted-foreground">
                            {formatHours(row?.manualHours ?? 0)} manual
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeLine(line.id)}
                        aria-label={`Remove ${d?.name ?? "line"}`}
                        className="justify-self-end rounded-lg border border-border p-2 text-muted-foreground transition-colors hover:border-destructive/40 hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Breakdown table */}
            {result.lines.length > 0 && (
              <section className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
                <div className="border-b border-border px-5 py-4 sm:px-6">
                  <h2 className="font-display text-lg font-semibold tracking-tight">Line breakdown</h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[560px] text-sm">
                    <thead>
                      <tr className="border-b border-border text-left font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                        <th className="px-5 py-3 font-medium sm:px-6">Deliverable</th>
                        <th className="px-3 py-3 text-right font-medium">Qty</th>
                        <th className="px-3 py-3 text-right font-medium">Manual cost</th>
                        <th className="px-3 py-3 text-right font-medium">Your cost</th>
                        <th className="px-5 py-3 text-right font-medium sm:px-6">Line price</th>
                      </tr>
                    </thead>
                    <tbody>
                      {result.lines.map((r) => (
                        <tr key={r.id} className="border-b border-border/60 last:border-0 hover:bg-surface">
                          <td className="max-w-[280px] px-5 py-3 sm:px-6">
                            <div className="truncate font-medium">{r.name}</div>
                            <div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                              {r.ref} · {r.unit}
                            </div>
                          </td>
                          <td className="px-3 py-3 text-right font-mono tabular-nums">{r.qty}</td>
                          <td className="px-3 py-3 text-right font-mono tabular-nums text-muted-foreground">
                            {formatMoney(r.manualCost, currency)}
                          </td>
                          <td className="px-3 py-3 text-right font-mono tabular-nums text-muted-foreground">
                            {formatMoney(r.yourCost, currency)}
                          </td>
                          <td className="px-5 py-3 text-right font-mono font-semibold tabular-nums sm:px-6">
                            {formatMoney(r.linePrice, currency)}
                          </td>
                        </tr>
                      ))}
                      <tr className="bg-surface font-semibold">
                        <td className="px-5 py-3.5 sm:px-6">Totals</td>
                        <td className="px-3 py-3.5 text-right font-mono tabular-nums">—</td>
                        <td className="px-3 py-3.5 text-right font-mono tabular-nums">
                          {formatMoney(result.manualCost, currency)}
                        </td>
                        <td className="px-3 py-3.5 text-right font-mono tabular-nums">
                          {formatMoney(result.yourCost, currency)}
                        </td>
                        <td className="px-5 py-3.5 text-right font-mono tabular-nums text-primary sm:px-6">
                          {formatMoney(result.recommendedPrice, currency)}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </section>
            )}

            <LeadCapture
              currency={currency}
              recommendedPrice={result.recommendedPrice}
              job={{ rate, currency, dataQuality, complexity, clientDiscount, lines }}
            />
          </div>

          {/* ============ RESULTS PANEL ============ */}
          <aside className="hidden lg:block">
            <div className="sticky top-24">
              <ResultsPanel result={result} currency={currency} />
            </div>
          </aside>
        </div>

        {/* Footer CTA */}
        <div className="mx-auto mt-14 max-w-6xl">
          <div className="flex flex-col items-start justify-between gap-5 rounded-2xl border border-primary/25 bg-primary/5 p-6 sm:flex-row sm:items-center sm:p-8">
            <div>
              <h2 className="font-display text-xl font-semibold tracking-tight sm:text-2xl">
                Automate this whole workflow with OrganicOS
              </h2>
              <p className="mt-1.5 max-w-xl text-sm text-muted-foreground">
                Audits, content briefs, internal linking and reporting — priced, tracked, and tied back to revenue.
              </p>
            </div>
            <Link
              to="/request-demo"
              className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-[0_0_24px_var(--glow)] transition-all hover:brightness-110"
            >
              Automate this whole workflow <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </main>

      {/* Mobile sticky results bar */}
      <div className="fixed inset-x-0 bottom-0 z-40 lg:hidden">
        {mobileOpen && (
          <div className="max-h-[70vh] overflow-y-auto border-t border-border bg-card p-4 shadow-2xl">
            <ResultsPanel result={result} currency={currency} bare />
          </div>
        )}
        <button
          type="button"
          onClick={() => setMobileOpen((o) => !o)}
          aria-expanded={mobileOpen}
          className="flex w-full items-center justify-between gap-3 border-t border-border bg-background px-5 py-3.5 text-left"
        >
          <div className="min-w-0">
            <div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
              Recommended price
            </div>
            <div className="truncate font-display text-xl font-bold tabular-nums text-primary">
              {formatMoney(result.recommendedPrice, currency)}
            </div>
          </div>
          <span className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-xs font-medium">
            {mobileOpen ? "Hide" : "Details"}
            <ChevronDown className={`h-3.5 w-3.5 transition-transform ${mobileOpen ? "rotate-180" : ""}`} />
          </span>
        </button>
      </div>

      <Footer />
    </div>
  );
}

/* ---------------- Results panel ---------------- */

function ResultsPanel({
  result,
  currency,
  bare,
}: {
  result: ReturnType<typeof calculate>;
  currency: CurrencyCode;
  bare?: boolean;
}) {
  const body = (
    <div className="space-y-5">
      <div className="space-y-3">
        <div className="rounded-xl border border-border bg-surface px-4 py-3">
          <div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
            Manual cost (anchor)
          </div>
          <AnimatedMoney
            value={result.manualCost}
            currency={currency}
            className="font-display text-xl font-semibold tabular-nums text-muted-foreground"
          />
        </div>

        <div className="rounded-xl border border-primary/30 bg-primary/5 px-4 py-4">
          <div className="font-mono text-[10px] uppercase tracking-wider text-primary/80">
            Your recommended price
          </div>
          <AnimatedMoney
            value={result.recommendedPrice}
            currency={currency}
            className="font-display text-3xl font-bold tabular-nums text-foreground"
          />
          <div className="mt-1 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
            Floor {formatMoney(result.floorPrice, currency)} · never quote below
          </div>
        </div>

        <div className="rounded-xl border border-border bg-surface px-4 py-3">
          <div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Your profit</div>
          <AnimatedMoney
            value={result.profit}
            currency={currency}
            className={`font-display text-xl font-semibold tabular-nums ${
              result.profit >= 0 ? "text-primary" : "text-destructive"
            }`}
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1.5 text-xs">
          <TrendingDown className="h-3.5 w-3.5 text-primary" />
          Client pays <AnimatedPercent value={result.clientSaving} className="font-mono font-semibold" /> less than
          manual
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1.5 text-xs">
          <Zap className="h-3.5 w-3.5 text-primary" />
          <AnimatedPercent value={Math.max(0, result.hoursSavedPct)} className="font-mono font-semibold" /> fewer hours
          to deliver
        </span>
      </div>

      <div className="rounded-xl border border-border bg-background p-4">
        <MarginGauge margin={result.margin} verdict={result.verdict} />
      </div>

      <div
        role="status"
        className={`rounded-xl border px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider ${VERDICT_STYLE[result.verdict]}`}
      >
        {result.verdictLabel}
      </div>

      <dl className="grid grid-cols-2 gap-3 text-xs">
        <div className="rounded-lg border border-border bg-surface px-3 py-2.5">
          <dt className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Manual hours</dt>
          <dd className="mt-0.5 font-mono text-sm font-semibold tabular-nums">
            {formatHours(result.totalManualHours)}
          </dd>
        </div>
        <div className="rounded-lg border border-border bg-surface px-3 py-2.5">
          <dt className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Your hours</dt>
          <dd className="mt-0.5 font-mono text-sm font-semibold tabular-nums">{formatHours(result.adjAiHours)}</dd>
        </div>
      </dl>
    </div>
  );

  if (bare) return body;

  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      <div className="mb-4 flex items-center gap-2">
        <Gauge className="h-4 w-4 text-primary" />
        <h2 className="font-display text-base font-semibold tracking-tight">Your quote</h2>
      </div>
      {body}
    </div>
  );
}

/* ---------------- Lead capture ---------------- */

function LeadCapture({
  currency,
  recommendedPrice,
  job,
}: {
  currency: CurrencyCode;
  recommendedPrice: number;
  job: Record<string, unknown>;
}) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [error, setError] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const value = email.trim();
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(value) || value.length > 255) {
      setError("Enter a valid email address.");
      setState("error");
      return;
    }
    setState("loading");
    setError("");
    const { error: dbError } = await supabase.from("calculator_leads").insert({
      email: value,
      currency,
      job_json: job as never,
      recommended_price: Math.round(recommendedPrice * 100) / 100,
    });
    if (dbError) {
      setError("Something went wrong. Please try again.");
      setState("error");
      return;
    }
    setState("done");
  };

  return (
    <section className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
      {state === "done" ? (
        <div className="flex items-start gap-3">
          <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full bg-primary/10 text-primary">
            <Check className="h-4 w-4" />
          </span>
          <div>
            <h2 className="font-display text-lg font-semibold tracking-tight">You're on the list</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              We'll email your full breakdown (PDF + editable CSV) to <span className="font-medium">{email}</span>.
            </p>
          </div>
        </div>
      ) : (
        <>
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-primary" />
            <h2 className="font-display text-lg font-semibold tracking-tight">
              Email me the full breakdown (PDF + editable CSV)
            </h2>
          </div>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Your numbers stay on screen either way — this just sends you a shareable version.
          </p>
          <form onSubmit={submit} className="mt-4 flex flex-col gap-2 sm:flex-row">
            <label className="sr-only" htmlFor="lead-email">
              Email address
            </label>
            <input
              id="lead-email"
              type="email"
              required
              maxLength={255}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@agency.com"
              aria-invalid={state === "error"}
              className="min-w-0 flex-1 rounded-xl border border-border bg-background px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <button
              type="submit"
              disabled={state === "loading"}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-all hover:brightness-110 disabled:opacity-60"
            >
              {state === "loading" && <Loader2 className="h-4 w-4 animate-spin" />}
              Send it
            </button>
          </form>
          {state === "error" && (
            <p role="alert" className="mt-2 text-xs text-destructive">
              {error}
            </p>
          )}
        </>
      )}
    </section>
  );
}
