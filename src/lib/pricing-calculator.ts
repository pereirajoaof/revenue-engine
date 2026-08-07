export type DeliverableCategory = "Content" | "SEO";

export interface Deliverable {
  ref: string;
  category: DeliverableCategory;
  name: string;
  unit: string;
  manualHrs: number;
  autoFactor: number;
}

export const DELIVERABLES: Deliverable[] = [
  { ref: "C01", category: "Content", name: "Product description — short (up to 150 words)", unit: "per page", manualHrs: 0.25, autoFactor: 0.18 },
  { ref: "C02", category: "Content", name: "Product description — detailed (150–350 words)", unit: "per page", manualHrs: 0.5, autoFactor: 0.18 },
  { ref: "C03", category: "Content", name: "Category page copy (300–600 words)", unit: "per page", manualHrs: 2.0, autoFactor: 0.2 },
  { ref: "C04", category: "Content", name: "Service page copy (600–1,000 words)", unit: "per page", manualHrs: 3.0, autoFactor: 0.35 },
  { ref: "C05", category: "Content", name: "Landing page copy (conversion-led)", unit: "per page", manualHrs: 3.5, autoFactor: 0.4 },
  { ref: "C06", category: "Content", name: "SEO blog / insight (800–1,200 words)", unit: "per article", manualHrs: 3.5, autoFactor: 0.3 },
  { ref: "C07", category: "Content", name: "SEO blog — long form (1,500–2,500 words)", unit: "per article", manualHrs: 5.0, autoFactor: 0.3 },
  { ref: "C08", category: "Content", name: "Content refresh / optimisation", unit: "per page", manualHrs: 1.5, autoFactor: 0.3 },
  { ref: "C09", category: "Content", name: "FAQ set (8–10 questions)", unit: "per set", manualHrs: 1.5, autoFactor: 0.2 },
  { ref: "C10", category: "Content", name: "Meta title + description pair", unit: "per pair", manualHrs: 0.25, autoFactor: 0.15 },
  { ref: "C11", category: "Content", name: "Image alt text (per 50 images)", unit: "per 50", manualHrs: 1.5, autoFactor: 0.15 },
  { ref: "S01", category: "SEO", name: "Keyword research & mapping — up to 100 keywords", unit: "per project", manualHrs: 6.0, autoFactor: 0.25 },
  { ref: "S02", category: "SEO", name: "Keyword research & mapping — 100–500 keywords", unit: "per project", manualHrs: 12.0, autoFactor: 0.25 },
  { ref: "S03", category: "SEO", name: "Technical SEO audit — up to 500 pages", unit: "per audit", manualHrs: 8.0, autoFactor: 0.2 },
  { ref: "S04", category: "SEO", name: "Technical SEO audit — 500–5,000 pages", unit: "per audit", manualHrs: 16.0, autoFactor: 0.2 },
  { ref: "S05", category: "SEO", name: "Internal linking audit & plan", unit: "per project", manualHrs: 8.0, autoFactor: 0.3 },
  { ref: "S06", category: "SEO", name: "Content gap analysis", unit: "per project", manualHrs: 6.0, autoFactor: 0.25 },
  { ref: "S07", category: "SEO", name: "Competitor SEO analysis (3 competitors)", unit: "per project", manualHrs: 9.0, autoFactor: 0.3 },
  { ref: "S08", category: "SEO", name: "Schema markup set (per template type)", unit: "per template", manualHrs: 2.0, autoFactor: 0.15 },
  { ref: "S09", category: "SEO", name: "Local SEO / GBP optimisation", unit: "per location", manualHrs: 3.0, autoFactor: 0.6 },
  { ref: "S10", category: "SEO", name: "Monthly SEO performance report", unit: "per report", manualHrs: 1.0, autoFactor: 0.35 },
  { ref: "S11", category: "SEO", name: "Topical authority map", unit: "per project", manualHrs: 12.0, autoFactor: 0.3 },
];

export const DELIVERABLE_BY_REF: Record<string, Deliverable> = Object.fromEntries(
  DELIVERABLES.map((d) => [d.ref, d]),
);

export type DataQuality = "clean" | "mixed" | "poor";
export type Complexity = "simple" | "standard" | "complex";

export const DATA_QUALITY: { id: DataQuality; label: string; mult: number }[] = [
  { id: "clean", label: "Clean", mult: 1.0 },
  { id: "mixed", label: "Mixed", mult: 1.25 },
  { id: "poor", label: "Poor", mult: 1.6 },
];

export const COMPLEXITY: { id: Complexity; label: string; mult: number }[] = [
  { id: "simple", label: "Simple", mult: 0.8 },
  { id: "standard", label: "Standard", mult: 1.0 },
  { id: "complex", label: "Complex", mult: 1.3 },
];

export type CurrencyCode = "GBP" | "USD" | "EUR";

export const CURRENCIES: { id: CurrencyCode; symbol: string; locale: string }[] = [
  { id: "GBP", symbol: "£", locale: "en-GB" },
  { id: "USD", symbol: "$", locale: "en-US" },
  { id: "EUR", symbol: "€", locale: "de-DE" },
];

export const DEFAULTS = {
  rate: 95,
  currency: "GBP" as CurrencyCode,
  dataQuality: "mixed" as DataQuality,
  complexity: "standard" as Complexity,
  clientDiscount: 0.45,
  discountMin: 0.2,
  discountMax: 0.6,
};

export interface JobLine {
  id: string;
  ref: string;
  qty: number;
}

export interface LineResult {
  id: string;
  ref: string;
  name: string;
  unit: string;
  qty: number;
  manualHours: number;
  aiHours: number;
  manualCost: number;
  yourCost: number;
  linePrice: number;
}

export interface CalcInput {
  lines: JobLine[];
  rate: number;
  dataQuality: DataQuality;
  complexity: Complexity;
  clientDiscount: number;
}

export type Verdict = "healthy" | "thin" | "below-floor";

export interface CalcResult {
  lines: LineResult[];
  totalManualHours: number;
  totalAiHoursRaw: number;
  adjAiHours: number;
  manualCost: number;
  yourCost: number;
  recommendedPrice: number;
  floorPrice: number;
  margin: number;
  profit: number;
  clientSaving: number;
  hoursSavedPct: number;
  verdict: Verdict;
  verdictLabel: string;
}

export function calculate({ lines, rate, dataQuality, complexity, clientDiscount }: CalcInput): CalcResult {
  const dq = DATA_QUALITY.find((d) => d.id === dataQuality)?.mult ?? 1;
  const cx = COMPLEXITY.find((c) => c.id === complexity)?.mult ?? 1;
  const realism = dq * cx;

  const rows = lines
    .map((l) => ({ l, d: DELIVERABLE_BY_REF[l.ref] }))
    .filter((r): r is { l: JobLine; d: Deliverable } => Boolean(r.d));

  const totalManualHours = rows.reduce((s, r) => s + r.l.qty * r.d.manualHrs, 0);
  const totalAiHoursRaw = rows.reduce((s, r) => s + r.l.qty * r.d.manualHrs * r.d.autoFactor, 0);
  const adjAiHours = totalAiHoursRaw * realism;

  const manualCost = totalManualHours * rate;
  const yourCost = adjAiHours * rate;
  const recommendedPrice = manualCost * (1 - clientDiscount);
  const floorPrice = adjAiHours * rate;
  const margin = recommendedPrice > 0 ? (recommendedPrice - yourCost) / recommendedPrice : 0;
  const profit = recommendedPrice - yourCost;
  const hoursSavedPct = totalManualHours > 0 ? 1 - adjAiHours / totalManualHours : 0;

  const lineResults: LineResult[] = rows.map(({ l, d }) => {
    const manualHours = l.qty * d.manualHrs;
    const aiHours = manualHours * d.autoFactor;
    const lineManualCost = manualHours * rate;
    return {
      id: l.id,
      ref: d.ref,
      name: d.name,
      unit: d.unit,
      qty: l.qty,
      manualHours,
      aiHours,
      manualCost: lineManualCost,
      yourCost: aiHours * realism * rate,
      linePrice: lineManualCost * (1 - clientDiscount),
    };
  });

  let verdict: Verdict = "healthy";
  let verdictLabel = "HEALTHY — profitable and competitive";
  if (recommendedPrice < floorPrice) {
    verdict = "below-floor";
    verdictLabel = "BELOW FLOOR — raise your price or reduce discount";
  } else if (margin < 0.4) {
    verdict = "thin";
    verdictLabel = "THIN MARGIN — profitable but tight";
  }

  return {
    lines: lineResults,
    totalManualHours,
    totalAiHoursRaw,
    adjAiHours,
    manualCost,
    yourCost,
    recommendedPrice,
    floorPrice,
    margin,
    profit,
    clientSaving: clientDiscount,
    hoursSavedPct,
    verdict,
    verdictLabel,
  };
}

export function formatMoney(value: number, currency: CurrencyCode): string {
  const c = CURRENCIES.find((x) => x.id === currency) ?? CURRENCIES[0]!;
  return new Intl.NumberFormat(c.locale, {
    style: "currency",
    currency: c.id,
    maximumFractionDigits: 0,
  }).format(Number.isFinite(value) ? value : 0);
}

export function formatHours(value: number): string {
  return `${Math.round(value * 10) / 10}h`;
}
