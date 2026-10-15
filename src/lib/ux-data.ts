// Illustrative mock data for the User Experience section ("Northwind Botanicals", GBP).
// Not live measurements.

export type UxStatus =
  | "Below peers"
  | "Within peer range"
  | "Above peers"
  | "Insufficient evidence"
  | "Not enough comparable pages"
  | "Unmatched host";

export type Rate = { obs: number; peer: number; lo: number; hi: number };

export type CwvChip = { label: string; fallback: boolean };

export type LandingRow = {
  id: string;
  path: string;
  host?: string;
  type: string;
  sessions: number | null;
  purchase: Rate | null;
  engaged: Rate | null;
  revenue: { value: number | null; source: "GA4" | "Allocated" };
  clicks: number | null;
  ctr: "within" | "below" | "above" | null;
  cwv: CwvChip;
  status: UxStatus;
  engagedStatus?: UxStatus;
  device: "Mixed" | "Mobile-heavy" | "Desktop-heavy";
  exact: boolean;
  shortfall: number; // conservative shortfall in pts, for sorting
};

export const MAIN_HOST = "www.northwind.co.uk";

export const LANDING_ROWS: LandingRow[] = [
  { id: "oils", path: "/oils/", type: "Product Category", sessions: 1840, purchase: { obs: 3.1, peer: 5.6, lo: 2.5, hi: 3.9 }, engaged: { obs: 54, peer: 63, lo: 51, hi: 57 }, revenue: { value: 38100, source: "GA4" }, clicks: 2210, ctr: "within", cwv: { label: "This page · Needs improvement", fallback: false }, status: "Below peers", engagedStatus: "Below peers", device: "Mobile-heavy", exact: true, shortfall: 1.7 },
  { id: "kits-starter", path: "/kits/starter", type: "Product Category", sessions: 640, purchase: { obs: 1.4, peer: 4.2, lo: 0.8, hi: 2.3 }, engaged: { obs: 58, peer: 62, lo: 53, hi: 63 }, revenue: { value: 9400, source: "GA4" }, clicks: 810, ctr: "below", cwv: { label: "Homepage · Poor (INP)", fallback: true }, status: "Below peers", engagedStatus: "Within peer range", device: "Mixed", exact: true, shortfall: 1.9 },
  { id: "balms", path: "/balms/", type: "Product Category", sessions: 1120, purchase: { obs: 3.6, peer: 5.6, lo: 2.9, hi: 4.4 }, engaged: { obs: 60, peer: 63, lo: 57, hi: 63 }, revenue: { value: 21800, source: "GA4" }, clicks: 1390, ctr: "within", cwv: { label: "Parent path /", fallback: true }, status: "Below peers", engagedStatus: "Within peer range", device: "Mixed", exact: true, shortfall: 1.2 },
  { id: "p-lavender", path: "/p/lavender-oil-30ml", type: "Product", sessions: 880, purchase: { obs: 4.0, peer: 6.3, lo: 3.1, hi: 5.1 }, engaged: { obs: 66, peer: 68, lo: 62, hi: 70 }, revenue: { value: 14900, source: "GA4" }, clicks: 1020, ctr: "above", cwv: { label: "This page · Good", fallback: false }, status: "Below peers", engagedStatus: "Within peer range", device: "Mobile-heavy", exact: true, shortfall: 1.2 },
  { id: "bundles", path: "/bundles/", type: "Product Category", sessions: 520, purchase: { obs: 2.9, peer: 5.6, lo: 1.9, hi: 4.2 }, engaged: { obs: 49, peer: 63, lo: 45, hi: 53 }, revenue: { value: 8700, source: "GA4" }, clicks: 590, ctr: "below", cwv: { label: "No field data", fallback: true }, status: "Below peers", engagedStatus: "Below peers", device: "Desktop-heavy", exact: false, shortfall: 1.4 },
  { id: "p-sleep", path: "/p/sleep-drops", type: "Product", sessions: 410, purchase: { obs: 4.4, peer: 6.3, lo: 3.0, hi: 5.9 }, engaged: { obs: 64, peer: 68, lo: 59, hi: 69 }, revenue: { value: 6800, source: "GA4" }, clicks: 470, ctr: "within", cwv: { label: "Parent path /p/", fallback: true }, status: "Below peers", engagedStatus: "Within peer range", device: "Mixed", exact: true, shortfall: 0.4 },
  { id: "gummies", path: "/gummies/", type: "Product Category", sessions: 960, purchase: { obs: 5.9, peer: 5.4, lo: 4.9, hi: 7.0 }, engaged: { obs: 65, peer: 63, lo: 61, hi: 69 }, revenue: { value: 29600, source: "GA4" }, clicks: 1160, ctr: "within", cwv: { label: "This page · Good", fallback: false }, status: "Within peer range", engagedStatus: "Within peer range", device: "Mixed", exact: true, shortfall: 0 },
  { id: "p-calm", path: "/p/calm-tea", type: "Product", sessions: 730, purchase: { obs: 8.9, peer: 6.3, lo: 7.4, hi: 10.5 }, engaged: { obs: 74, peer: 68, lo: 70, hi: 78 }, revenue: { value: 22300, source: "GA4" }, clicks: 840, ctr: "above", cwv: { label: "This page · Good", fallback: false }, status: "Above peers", engagedStatus: "Above peers", device: "Mixed", exact: true, shortfall: 0 },
  { id: "blog-dose", path: "/blog/how-to-dose/", type: "Guides", sessions: 2380, purchase: null, engaged: { obs: 58, peer: 59, lo: 55, hi: 61 }, revenue: { value: 1100, source: "Allocated" }, clicks: 3120, ctr: "within", cwv: { label: "Parent path /blog/", fallback: true }, status: "Insufficient evidence", engagedStatus: "Within peer range", device: "Mobile-heavy", exact: true, shortfall: 0 },
  { id: "p-new", path: "/p/new-tincture", type: "Product", sessions: 42, purchase: null, engaged: null, revenue: { value: null, source: "GA4" }, clicks: 61, ctr: null, cwv: { label: "No field data", fallback: true }, status: "Insufficient evidence", device: "Mixed", exact: true, shortfall: 0 },
  { id: "about", path: "/about/our-farm", type: "Brand", sessions: 310, purchase: null, engaged: { obs: 71, peer: 70, lo: 64, hi: 77 }, revenue: { value: null, source: "Allocated" }, clicks: 380, ctr: "within", cwv: { label: "Homepage · Good", fallback: true }, status: "Not enough comparable pages", device: "Mixed", exact: true, shortfall: 0 },
  { id: "sale", path: "/sale", host: "shop.northwind.co.uk", type: "—", sessions: null, purchase: null, engaged: null, revenue: { value: null, source: "GA4" }, clicks: 290, ctr: null, cwv: { label: "No field data", fallback: true }, status: "Unmatched host", device: "Mixed", exact: false, shortfall: 0 },
];

export type PageTypeRow = {
  slug: string;
  name: string;
  sessions: number;
  purchaseRate: number;
  vsPrev: { d: number; lo: number; hi: number };
  vsYoY: { d: number; lo: number; hi: number };
  engaged: number;
  eligible: number;
  total: number;
  clicks: number;
  alike?: boolean;
};

export const PAGE_TYPES: PageTypeRow[] = [
  { slug: "product-category", name: "Product Category", sessions: 9840, purchaseRate: 5.1, vsPrev: { d: -0.3, lo: -0.9, hi: 0.3 }, vsYoY: { d: 0.8, lo: 0.2, hi: 1.4 }, engaged: 62, eligible: 7, total: 19, clicks: 11820 },
  { slug: "product", name: "Product", sessions: 14210, purchaseRate: 6.2, vsPrev: { d: 0.5, lo: 0.1, hi: 0.9 }, vsYoY: { d: -0.6, lo: -1.3, hi: 0.1 }, engaged: 67, eligible: 41, total: 412, clicks: 16340 },
  { slug: "guides", name: "Guides", sessions: 18630, purchaseRate: 1.1, vsPrev: { d: 0.1, lo: -0.2, hi: 0.4 }, vsYoY: { d: 0.3, lo: 0.0, hi: 0.6 }, engaged: 58, eligible: 14, total: 96, clicks: 17820, alike: true },
  { slug: "brand", name: "Brand", sessions: 1620, purchaseRate: 3.4, vsPrev: { d: -0.2, lo: -1.4, hi: 1.0 }, vsYoY: { d: 0.4, lo: -0.9, hi: 1.7 }, engaged: 70, eligible: 2, total: 9, clicks: 2230 },
];

export const DEVICE_SPLIT = [
  { device: "Mobile", sessions: 6120, rate: 4.1, peer: 5.0, engaged: 58 },
  { device: "Desktop", sessions: 3410, rate: 6.8, peer: 6.6, engaged: 69 },
  { device: "Tablet", sessions: 310, rate: 4.9, peer: 5.2, engaged: 63 },
];

export const TREND_13W = Array.from({ length: 13 }, (_, i) => {
  const wk = new Date(Date.UTC(2026, 6, 20 + i * 7));
  const label = wk.toLocaleDateString("en-GB", { day: "numeric", month: "short", timeZone: "UTC" });
  const base = [5.0, 5.2, 4.9, 5.3, 5.1, 5.4, 5.2, 5.0, 5.3, 5.1, 4.9, 5.2, 5.1][i];
  const prev = [4.4, 4.6, 4.3, 4.5, 4.4, 4.7, 4.5, 4.2, 4.4, 4.3, 4.2, 4.5, 4.4][i];
  return { week: label, rate: base, prevYear: prev };
});

export type LoggedChange = {
  id: string;
  title: string;
  type: string;
  pages: string[];
  shipped: string;
  randomised: boolean;
  result:
    | { changedBefore: number; changedAfter: number; peerBefore: number; peerAfter: number; diff: number; lo: number; hi: number }
    | null;
};

export const CHANGES: LoggedChange[] = [
  { id: "c1", title: "Moved delivery info above the fold on oils listing", type: "Layout", pages: ["/oils/", "/balms/"], shipped: "7 Sep 2026", randomised: false, result: { changedBefore: 3.1, changedAfter: 4.4, peerBefore: 5.6, peerAfter: 5.7, diff: 1.2, lo: -0.1, hi: 2.5 } },
  { id: "c2", title: "Simplified mobile filter drawer (A/B split)", type: "Layout", pages: ["/oils/", "/gummies/", "/bundles/", "/balms/"], shipped: "18 Aug 2026", randomised: true, result: { changedBefore: 4.2, changedAfter: 5.0, peerBefore: 4.3, peerAfter: 4.4, diff: 0.7, lo: 0.2, hi: 1.2 } },
  { id: "c3", title: "Compressed hero images on starter kits", type: "Speed", pages: ["/kits/starter"], shipped: "2 Oct 2026", randomised: false, result: null },
];

export const SOURCES = [
  { source: "Google Analytics 4", range: "15 Sep – 12 Oct 2026", tz: "Europe/London", refreshed: "13 Oct 2026, 06:10", status: "Fresh" },
  { source: "Search Console", range: "15 Sep – 12 Oct 2026", tz: "Pacific time", refreshed: "14 Oct 2026, 09:00", status: "Fresh" },
  { source: "Chrome UX Report (CrUX)", range: "May 2026", tz: "—", refreshed: "1 Jun 2026", status: "Stale" },
  { source: "OrganicOS crawl", range: "Crawl of 9 Oct 2026", tz: "UTC", refreshed: "9 Oct 2026", status: "Fresh" },
];

export const GA4_FLAGS = [
  { week: "15–21 Sep", thresholding: "No", sampling: "No", other: "0.4%" },
  { week: "22–28 Sep", thresholding: "No", sampling: "No", other: "0.3%" },
  { week: "29 Sep–5 Oct", thresholding: "Yes · 2 pages", sampling: "No", other: "1.1%" },
  { week: "6–12 Oct", thresholding: "No", sampling: "No", other: "0.5%" },
];
