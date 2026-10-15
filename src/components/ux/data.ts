// Illustrative mock data for the User Experience growth driver.
// Fictional UK ecommerce account "Northwind Botanicals" (GBP). Not live data.

export type MockState =
  | "full"
  | "gsc-only"
  | "no-outcome"
  | "incomplete"
  | "stale"
  | "just-connected"
  | "small-site"
  | "lead-gen";

export const MOCK_STATES: { id: MockState; label: string }[] = [
  { id: "full", label: "1 · Full" },
  { id: "gsc-only", label: "2 · Search Console only" },
  { id: "no-outcome", label: "3 · GA4, no outcome chosen" },
  { id: "incomplete", label: "4 · Incomplete" },
  { id: "stale", label: "5 · Stale Google Analytics" },
  { id: "just-connected", label: "6 · Just connected" },
  { id: "small-site", label: "7 · Small site" },
  { id: "lead-gen", label: "8 · Lead-gen account" },
];

export type SignalKey = "conversion" | "engagement" | "page-experience" | "search-appeal";
export type Confidence = "High" | "Medium" | "Directional" | "Incomplete";

export type Signal = {
  key: SignalKey;
  name: string;
  path: string;
  score: number;
  confidence: Confidence;
  weight: number;
  finding: string;
  coverage: string;
  usesGa: boolean;
};

export const SIGNALS: Signal[] = [
  { key: "conversion", name: "Conversion Efficiency", path: "/dashboard/user-experience/conversion-efficiency", score: 78, confidence: "High", weight: 0.45, finding: "7 of 64 pages convert below similar pages", coverage: "Covers 72% of sessions", usesGa: true },
  { key: "engagement", name: "Engagement", path: "/dashboard/user-experience/engagement", score: 81, confidence: "High", weight: 0.2, finding: "4 pages below similar pages", coverage: "Covers 80% of sessions", usesGa: true },
  { key: "page-experience", name: "Page Experience", path: "/dashboard/user-experience/page-experience", score: 58, confidence: "Medium", weight: 0.2, finding: "22% of measured clicks land on pages that need improvement", coverage: "41% of clicks measured", usesGa: false },
  { key: "search-appeal", name: "Search Appeal", path: "/dashboard/user-experience/search-appeal", score: 62, confidence: "High", weight: 0.15, finding: "31 pages get fewer clicks than expected for their position", coverage: "Covers 77% of impressions", usesGa: false },
];

export type SignalStatus =
  | { kind: "ok"; note?: string }
  | { kind: "connect" }
  | { kind: "choose-outcome" }
  | { kind: "building" }
  | { kind: "small" }
  | { kind: "missing"; reason: string };

export function signalStatus(state: MockState, key: SignalKey): SignalStatus {
  const ga = key === "conversion" || key === "engagement";
  switch (state) {
    case "gsc-only":
      return ga ? { kind: "connect" } : { kind: "ok" };
    case "incomplete":
      if (ga) return { kind: "connect" };
      if (key === "page-experience") return { kind: "missing", reason: "No real-user speed data for this site yet" };
      return { kind: "ok" };
    case "no-outcome":
      return key === "conversion" ? { kind: "choose-outcome" } : { kind: "ok" };
    case "just-connected":
      return ga ? { kind: "building" } : { kind: "ok" };
    case "small-site":
      return key === "conversion" ? { kind: "small" } : { kind: "ok" };
    case "stale":
      return ga ? { kind: "ok", note: "Data up to 5 Oct" } : { kind: "ok" };
    default:
      return { kind: "ok" };
  }
}

export function hubFor(state: MockState) {
  const active = SIGNALS.filter((s) => signalStatus(state, s.key).kind === "ok");
  const wSum = active.reduce((a, s) => a + s.weight, 0);
  const contributions = active.map((s) => ({
    key: s.key,
    name: s.name,
    value: Math.round(((s.score * s.weight) / wSum) * 10) / 10,
  }));
  const raw = contributions.reduce((a, c) => a + c.value, 0);
  const score = active.length >= 2 ? Math.round(raw) : null;
  const confidence: Confidence =
    state === "full" || state === "lead-gen"
      ? "High"
      : state === "incomplete"
        ? "Incomplete"
        : state === "gsc-only" || state === "just-connected"
          ? "Directional"
          : "Medium";
  const momentum =
    state === "stale"
      ? { label: "Not comparable", delta: "signals changed" }
      : state === "just-connected"
        ? { label: "New", delta: "" }
        : state === "full" || state === "lead-gen"
          ? { label: "Stable", delta: "+1" }
          : { label: "Not comparable", delta: "signals changed" };
  return { score, confidence, momentum, active: active.length, contributions };
}

export function outcomeFor(state: MockState) {
  return state === "lead-gen"
    ? { outcome: "Form submissions", rate: "Form submission rate", money: false }
    : { outcome: "Purchase", rate: "Purchase rate", money: true };
}

// ---------- Time ----------
const END = new Date(Date.UTC(2026, 9, 6));
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
export function weekLabel(weeksAgo: number) {
  const d = new Date(END.getTime() - weeksAgo * 7 * 86400000);
  return `${d.getUTCDate()} ${MONTHS[d.getUTCMonth()]}`;
}

export type Pin = { week: string; label: string };
export const PINS: Pin[] = [
  { week: weekLabel(8), label: "12 Aug · Layout change on Product pages" },
  { week: weekLabel(3), label: "9 Sep · Image compression on Kits" },
];

export function trajectory(from: number, to: number, n = 26, seed = 1) {
  return Array.from({ length: n }, (_, i) => {
    const t = i / (n - 1);
    const wobble = Math.sin((i + seed) * 1.7) * 1.4 + Math.cos((i + seed) * 0.9) * 0.8;
    return { week: weekLabel(n - 1 - i), score: Math.round(from + (to - from) * t + (i === n - 1 ? 0 : wobble)) };
  });
}

// ---------- Conversion Efficiency ----------
export const PAGE_TYPES = [
  { slug: "product-category", name: "Product Category", sessions: 9840, rate: 5.1, prev: "+0.2 pts", yoy: "+0.6 pts", eligible: "28 / 34", flags: true },
  { slug: "product", name: "Product", sessions: 6120, rate: 4.6, prev: "−0.1 pts", yoy: "+0.3 pts", eligible: "22 / 61", flags: true },
  { slug: "kits", name: "Kits & Bundles", sessions: 2310, rate: 6.2, prev: "+0.4 pts", yoy: "—", eligible: "9 / 12", flags: true },
  { slug: "guides", name: "Guides", sessions: 3210, rate: 1.1, prev: "0.0 pts", yoy: "−0.2 pts", eligible: "5 / 40", flags: false },
];

export const DOTS = [
  { page: "/oils/", obs: 3.1, lo: 2.5, hi: 3.9, peer: 5.6 },
  { page: "/kits/starter", obs: 4.2, lo: 3.4, hi: 5.0, peer: 6.1 },
  { page: "/balms/", obs: 3.8, lo: 3.0, hi: 4.6, peer: 5.4 },
  { page: "/capsules/", obs: 4.0, lo: 3.3, hi: 4.8, peer: 5.2 },
  { page: "/drops/", obs: 4.4, lo: 3.6, hi: 5.2, peer: 5.6 },
  { page: "/tea/", obs: 4.1, lo: 3.4, hi: 4.9, peer: 5.0 },
  { page: "/bath/", obs: 3.9, lo: 3.1, hi: 4.7, peer: 4.9 },
  { page: "/gummies/", obs: 5.4, lo: 4.7, hi: 6.1, peer: 5.6 },
  { page: "/skincare/", obs: 5.9, lo: 5.1, hi: 6.6, peer: 5.5 },
  { page: "/sleep/", obs: 6.4, lo: 5.5, hi: 7.2, peer: 5.6 },
  { page: "/pets/", obs: 5.2, lo: 4.2, hi: 6.3, peer: 5.3 },
  { page: "/gifts/", obs: 6.8, lo: 6.0, hi: 7.5, peer: 5.8 },
].map((d) => ({ ...d, below: d.hi < d.peer }));

export const BELOW_PEERS = [
  { page: "/oils/", type: "Product Category", sessions: 1840, obs: 3.1, peer: 5.6, exposure: "£38.1k" },
  { page: "/kits/starter", type: "Kits & Bundles", sessions: 960, obs: 4.2, peer: 6.1, exposure: "£22.4k" },
  { page: "/balms/", type: "Product Category", sessions: 720, obs: 3.8, peer: 5.4, exposure: "£11.9k" },
  { page: "/capsules/", type: "Product Category", sessions: 610, obs: 4.0, peer: 5.2, exposure: "£9.6k" },
  { page: "/bath/", type: "Product", sessions: 540, obs: 3.9, peer: 4.9, exposure: "£6.2k" },
];

// ---------- Landing pages ----------
export type LpStatus = "Below peers" | "Within peer range" | "Above peers" | "Insufficient evidence" | "Not enough comparable pages" | "Unmatched host";
export type SpeedChip = { kind: "this" | "borrowed" | "none"; text: string };
export type LandingRow = {
  page: string;
  type: string;
  device: "All" | "Mobile-heavy" | "Desktop-heavy";
  exact: boolean;
  sessions: number | null;
  conv: { obs: number; peer: number; lo: number; hi: number } | null;
  eng: { obs: number; peer: number; lo: number; hi: number } | null;
  revenue: { value: string; src: "GA4" | "Allocated" } | null;
  ctr: string;
  speed: SpeedChip;
  status: LpStatus;
  shortfall: number;
};

export const LANDING: LandingRow[] = [
  { page: "/oils/", type: "Product Category", device: "Mobile-heavy", exact: true, sessions: 1840, conv: { obs: 3.1, peer: 5.6, lo: 2.5, hi: 3.9 }, eng: { obs: 54, peer: 63, lo: 50, hi: 58 }, revenue: { value: "£38,100", src: "GA4" }, ctr: "Below expected", speed: { kind: "this", text: "This page · Needs improvement" }, status: "Below peers", shortfall: 1.7 },
  { page: "/kits/starter", type: "Kits & Bundles", device: "All", exact: true, sessions: 960, conv: { obs: 4.2, peer: 6.1, lo: 3.4, hi: 5.0 }, eng: { obs: 60, peer: 62, lo: 55, hi: 65 }, revenue: { value: "£22,400", src: "GA4" }, ctr: "In line", speed: { kind: "borrowed", text: "Homepage · Poor" }, status: "Below peers", shortfall: 1.1 },
  { page: "/balms/", type: "Product Category", device: "All", exact: true, sessions: 720, conv: { obs: 3.8, peer: 5.4, lo: 3.0, hi: 4.6 }, eng: { obs: 59, peer: 61, lo: 54, hi: 64 }, revenue: { value: "£11,900", src: "GA4" }, ctr: "In line", speed: { kind: "this", text: "This page · Good" }, status: "Below peers", shortfall: 0.8 },
  { page: "/gummies/", type: "Product Category", device: "All", exact: true, sessions: 2210, conv: { obs: 5.4, peer: 5.6, lo: 4.7, hi: 6.1 }, eng: { obs: 64, peer: 63, lo: 61, hi: 67 }, revenue: { value: "£61,800", src: "GA4" }, ctr: "Above expected", speed: { kind: "this", text: "This page · Good" }, status: "Within peer range", shortfall: 0 },
  { page: "/gifts/", type: "Product Category", device: "Desktop-heavy", exact: true, sessions: 1310, conv: { obs: 6.8, peer: 5.8, lo: 6.0, hi: 7.5 }, eng: { obs: 70, peer: 63, lo: 66, hi: 73 }, revenue: { value: "£44,200", src: "GA4" }, ctr: "In line", speed: { kind: "this", text: "This page · Good" }, status: "Above peers", shortfall: 0 },
  { page: "/blog/how-to-dose/", type: "Guides", device: "Mobile-heavy", exact: false, sessions: 2980, conv: { obs: 0.9, peer: 1.1, lo: 0.4, hi: 1.6 }, eng: { obs: 48, peer: 52, lo: 42, hi: 55 }, revenue: { value: "£4,300", src: "Allocated" }, ctr: "In line", speed: { kind: "borrowed", text: "Parent path /blog/" }, status: "Insufficient evidence", shortfall: 0 },
  { page: "/p/new-tincture", type: "Product", device: "All", exact: true, sessions: 42, conv: null, eng: null, revenue: { value: "£610", src: "GA4" }, ctr: "—", speed: { kind: "none", text: "No field data" }, status: "Insufficient evidence", shortfall: 0 },
  { page: "/wholesale/", type: "Other", device: "Desktop-heavy", exact: true, sessions: 180, conv: null, eng: null, revenue: null, ctr: "In line", speed: { kind: "none", text: "No field data" }, status: "Not enough comparable pages", shortfall: 0 },
  { page: "shop.northwind.co.uk/sale", type: "—", device: "All", exact: false, sessions: null, conv: null, eng: null, revenue: null, ctr: "—", speed: { kind: "none", text: "No field data" }, status: "Unmatched host", shortfall: -1 },
];

// ---------- Page Experience ----------
export const MEASURED = [
  { page: "/", clicks: 8420, lcp: "2.1 s", inp: "140 ms", cls: "0.04", status: "Good" },
  { page: "/oils/", clicks: 3110, lcp: "3.4 s", inp: "260 ms", cls: "0.08", status: "Needs improvement" },
  { page: "/gummies/", clicks: 2870, lcp: "2.3 s", inp: "150 ms", cls: "0.05", status: "Good" },
  { page: "/balms/", clicks: 1240, lcp: "2.4 s", inp: "180 ms", cls: "0.06", status: "Good" },
  { page: "/kits/", clicks: 1180, lcp: "4.6 s", inp: "520 ms", cls: "0.31", status: "Poor" },
  { page: "/capsules/", clicks: 960, lcp: "3.1 s", inp: "210 ms", cls: "0.12", status: "Needs improvement" },
];
export const NOT_MEASURED = [
  { page: "/kits/starter", from: "Homepage", clicks: 940 },
  { page: "/blog/how-to-dose/", from: "Parent path /blog/", clicks: 2410 },
  { page: "/blog/sleep-routine/", from: "Parent path /blog/", clicks: 1320 },
  { page: "/p/new-tincture", from: "Homepage", clicks: 38 },
];
export const PE_COVERAGE = [
  { type: "Product Category", share: 64 },
  { type: "Product", share: 38 },
  { type: "Kits & Bundles", share: 22 },
  { type: "Guides", share: 9 },
];

// ---------- Search Appeal ----------
export const APPEAL = {
  branded: {
    above: [
      { page: "/", impr: 48200, pos: 1.2, ctr: 41.0, exp: 34.0 },
      { page: "/gifts/", impr: 6100, pos: 2.1, ctr: 19.4, exp: 15.6 },
    ],
    below: [
      { page: "/about/", impr: 5400, pos: 1.4, ctr: 18.2, exp: 30.1 },
      { page: "/wholesale/", impr: 2100, pos: 1.8, ctr: 12.3, exp: 22.0 },
    ],
  },
  "non-branded": {
    above: [
      { page: "/gummies/", impr: 61200, pos: 4.3, ctr: 7.9, exp: 6.1 },
      { page: "/sleep/", impr: 18400, pos: 5.1, ctr: 6.0, exp: 4.9 },
      { page: "/blog/sleep-routine/", impr: 22600, pos: 6.4, ctr: 4.1, exp: 3.6 },
    ],
    below: [
      { page: "/oils/", impr: 74100, pos: 3.8, ctr: 4.2, exp: 7.4 },
      { page: "/blog/how-to-dose/", impr: 51800, pos: 2.9, ctr: 6.8, exp: 10.2 },
      { page: "/capsules/", impr: 19700, pos: 4.9, ctr: 3.6, exp: 5.3 },
      { page: "/balms/", impr: 14300, pos: 6.2, ctr: 2.4, exp: 3.8 },
    ],
  },
};

// ---------- Changes ----------
export type Change = {
  id: string;
  title: string;
  type: string;
  pages: string[];
  shipped: string;
  randomised: boolean;
  result: null | { changedBefore: number; changedAfter: number; peerBefore: number; peerAfter: number; diff: string; range: string };
};
export const CHANGES: Change[] = [
  { id: "c1", title: "New hero layout with delivery promise above the fold", type: "Layout", pages: ["/oils/", "/balms/", "/capsules/"], shipped: "12 Aug", randomised: false, result: { changedBefore: 3.1, changedAfter: 4.4, peerBefore: 5.6, peerAfter: 5.7, diff: "+1.2 pts", range: "−0.1 to +2.5" } },
  { id: "c2", title: "Compressed product imagery on Kits", type: "Speed", pages: ["/kits/", "/kits/starter"], shipped: "9 Sep", randomised: false, result: null },
  { id: "c3", title: "Consent banner moved to footer", type: "Tracking", pages: ["/", "/gummies/"], shipped: "22 Sep", randomised: false, result: null },
];

export const PAGE_OPTIONS = ["/oils/", "/gummies/", "/balms/", "/capsules/", "/kits/", "/kits/starter", "/blog/how-to-dose/", "/gifts/"];

export function uxHead(title: string, description: string) {
  const t = `${title} — User Experience · OrganicOS`;
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
