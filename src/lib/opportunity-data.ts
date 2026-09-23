/**
 * Single source of truth for the revenue-gap model shown on the dashboard
 * ("Where the revenue gap lives") and on the per-page-type opportunity
 * breakdown. Both surfaces MUST read from here so the figures match to the
 * dollar.
 *
 * All revenue figures are ANNUAL and in the project currency.
 */

export const PROJECT_CURRENCY = "£";

export type Confidence = "High" | "Medium" | "Directional";
export type Effort = "Low" | "Medium" | "High";

export type GapCause = {
  id: string;
  label: string;
  /** Annual revenue attributable to this cause, in project currency units. */
  value: number;
  /** Plain-English, project-specific explanation. */
  explain: string;
  tone: "amber" | "primary" | "muted";
};

export type OpportunityAction = {
  id: string;
  title: string;
  why: string;
  value: number;
  effort: Effort;
  confidence: Confidence;
  pagesAffected: number;
};

export type PageRow = {
  url: string;
  clicks: number;
  position: number;
  ctr: number;
  expectedCtr: number;
  revenue: number;
  gap: number;
};

export type PageTypeOpportunity = {
  slug: string;
  name: string;
  path: string;
  current: number;
  potential: number;
  priority: number;
  effort: Effort;
  confidence: Confidence;
  weeksOfData: number;
  avgPosition: number;
  lastUpdated: string;
  estimated: boolean;
  causes: GapCause[];
  /** Used when causes haven't been computed yet. */
  fallbackMove: string;
  actions: OpportunityAction[];
  pages: PageRow[];
};

export function gapOf(o: Pick<PageTypeOpportunity, "current" | "potential">) {
  return Math.max(0, o.potential - o.current);
}

/** e.g. £798K/yr — rounded harder when the figure is only directional. */
export function money(value: number, opts: { directional?: boolean; suffix?: string } = {}) {
  const { directional = false, suffix = "" } = opts;
  const abs = Math.abs(value);
  let body: string;
  if (abs >= 1_000_000) {
    body = `${(value / 1_000_000).toFixed(directional ? 1 : 2)}M`;
  } else if (abs >= 1_000) {
    const k = value / 1_000;
    body = `${directional ? Math.round(k / 10) * 10 : Math.round(k)}K`;
  } else {
    body = `${Math.round(value)}`;
  }
  return `${PROJECT_CURRENCY}${body}${suffix}`;
}

export function moneyExact(value: number) {
  return `${PROJECT_CURRENCY}${Math.round(value).toLocaleString("en-GB")}`;
}

export function pct(n: number, digits = 0) {
  return `${(n * 100).toFixed(digits)}%`;
}

/** Deterministic weekly series — no Math.random (SSR-safe). */
export function weeklySeries(o: PageTypeOpportunity, metric: "Traffic" | "Conversions" | "Revenue") {
  const scale = metric === "Revenue" ? 1 : metric === "Conversions" ? 0.0009 : 0.42;
  return Array.from({ length: 12 }, (_, i) => {
    const wave = Math.sin((i + o.name.length) / 2.4);
    const drift = i * 0.012;
    const actual = (o.current / 52) * (1 + drift + wave * 0.07) * scale;
    const potential = (o.potential / 52) * (1 + drift * 0.6 + wave * 0.03) * scale;
    return {
      week: `W${i + 1}`,
      actual: Math.round(actual),
      potential: Math.round(potential),
    };
  });
}

export const OPPORTUNITIES: PageTypeOpportunity[] = [
  {
    slug: "routes",
    name: "Route pages",
    path: "/routes/",
    current: 412_000,
    potential: 1_210_000,
    priority: 94,
    effort: "Medium",
    confidence: "High",
    weeksOfData: 26,
    avgPosition: 8.4,
    lastUpdated: "2 days ago",
    estimated: false,
    fallbackMove: "Rewrite titles on the 240 route pages ranking 5–10 — they take the fewest clicks per impression on the site.",
    causes: [
      {
        id: "ctr",
        label: "Fewer clicks than the rankings deserve",
        value: 318_000,
        explain:
          "Route pages sit in positions 5–10 but win about half the clicks pages in those spots normally do. Titles repeat the same pattern across 240 pages.",
        tone: "amber",
      },
      {
        id: "position",
        label: "Ranking just below the fold",
        value: 264_000,
        explain: "186 route pages rank 11–20. Moving them into the top 10 is where most of the remaining money sits.",
        tone: "primary",
      },
      {
        id: "indexing",
        label: "Pages Google can't use",
        value: 141_000,
        explain: "94 route pages return errors or are blocked from indexing, so they earn nothing at all today.",
        tone: "amber",
      },
      {
        id: "missing",
        label: "Routes you don't have a page for",
        value: 75_000,
        explain: "312 searched routes have demand but no page on your site.",
        tone: "muted",
      },
    ],
    actions: [
      {
        id: "a1",
        title: "Rewrite titles on 240 route pages in positions 5–10",
        why: "These pages already rank. They just don't get clicked.",
        value: 214_000,
        effort: "Low",
        confidence: "High",
        pagesAffected: 240,
      },
      {
        id: "a2",
        title: "Fix the 94 route pages returning errors or blocked from indexing",
        why: "They earn nothing today and the fix is a deployment, not new content.",
        value: 141_000,
        effort: "Medium",
        confidence: "High",
        pagesAffected: 94,
      },
      {
        id: "a3",
        title: "Add internal links to the 186 routes ranking 11–20",
        why: "These pages get the least internal support on the site.",
        value: 96_000,
        effort: "Medium",
        confidence: "Medium",
        pagesAffected: 186,
      },
      {
        id: "a4",
        title: "Publish pages for the top 60 routes you don't cover",
        why: "Demand exists and competitors rank with thin pages.",
        value: 58_000,
        effort: "High",
        confidence: "Directional",
        pagesAffected: 60,
      },
    ],
    pages: [
      { url: "/routes/london-paris", clicks: 18_420, position: 6.1, ctr: 0.041, expectedCtr: 0.092, revenue: 61_200, gap: 74_800 },
      { url: "/routes/new-york-boston", clicks: 14_180, position: 7.4, ctr: 0.036, expectedCtr: 0.071, revenue: 48_900, gap: 52_300 },
      { url: "/routes/madrid-barcelona", clicks: 12_640, position: 5.2, ctr: 0.048, expectedCtr: 0.104, revenue: 44_100, gap: 49_700 },
      { url: "/routes/toronto-montreal", clicks: 9_310, position: 11.8, ctr: 0.021, expectedCtr: 0.033, revenue: 27_400, gap: 38_900 },
      { url: "/routes/lisbon-porto", clicks: 8_020, position: 9.3, ctr: 0.028, expectedCtr: 0.052, revenue: 22_800, gap: 31_600 },
      { url: "/routes/berlin-munich", clicks: 6_740, position: 12.6, ctr: 0.018, expectedCtr: 0.031, revenue: 18_300, gap: 29_400 },
      { url: "/routes/rome-florence", clicks: 5_910, position: 8.8, ctr: 0.031, expectedCtr: 0.058, revenue: 16_700, gap: 24_100 },
      { url: "/routes/chicago-detroit", clicks: 4_180, position: 14.2, ctr: 0.012, expectedCtr: 0.026, revenue: 11_200, gap: 21_800 },
    ],
  },
  {
    slug: "cities",
    name: "City pages",
    path: "/cities/",
    current: 308_000,
    potential: 842_000,
    priority: 88,
    effort: "Low",
    confidence: "High",
    weeksOfData: 26,
    avgPosition: 11.2,
    lastUpdated: "2 days ago",
    estimated: false,
    fallbackMove: "Expand the 120 thinnest city pages — they rank 11–20 with under 150 words of unique content.",
    causes: [
      {
        id: "position",
        label: "Ranking just below the fold",
        value: 286_000,
        explain: "Most city pages rank 11–20, one step away from the traffic that pays.",
        tone: "primary",
      },
      {
        id: "ctr",
        label: "Fewer clicks than the rankings deserve",
        value: 158_000,
        explain: "City titles don't mention price or departure times, which is what searchers compare on.",
        tone: "amber",
      },
      {
        id: "missing",
        label: "Cities you don't have a page for",
        value: 90_000,
        explain: "148 cities with real search demand have no page.",
        tone: "muted",
      },
    ],
    actions: [
      { id: "b1", title: "Expand the 120 thinnest city pages", why: "They rank 11–20 with under 150 unique words.", value: 186_000, effort: "Low", confidence: "High", pagesAffected: 120 },
      { id: "b2", title: "Add price and duration to city titles", why: "Both appear in the queries these pages already rank for.", value: 121_000, effort: "Low", confidence: "Medium", pagesAffected: 310 },
      { id: "b3", title: "Publish the 40 highest-demand missing cities", why: "Demand confirmed, no page exists.", value: 64_000, effort: "Medium", confidence: "Directional", pagesAffected: 40 },
    ],
    pages: [
      { url: "/cities/barcelona", clicks: 11_240, position: 10.4, ctr: 0.026, expectedCtr: 0.044, revenue: 34_100, gap: 46_800 },
      { url: "/cities/lisbon", clicks: 9_860, position: 12.1, ctr: 0.021, expectedCtr: 0.032, revenue: 28_600, gap: 41_200 },
      { url: "/cities/porto", clicks: 7_420, position: 13.7, ctr: 0.016, expectedCtr: 0.028, revenue: 19_800, gap: 33_400 },
      { url: "/cities/seville", clicks: 5_180, position: 15.2, ctr: 0.011, expectedCtr: 0.024, revenue: 12_900, gap: 26_700 },
      { url: "/cities/valencia", clicks: 4_260, position: 14.6, ctr: 0.013, expectedCtr: 0.026, revenue: 10_400, gap: 22_300 },
    ],
  },
  {
    slug: "blog",
    name: "Blog posts",
    path: "/blog/",
    current: 186_000,
    potential: 412_000,
    priority: 71,
    effort: "Low",
    confidence: "Medium",
    weeksOfData: 18,
    avgPosition: 14.8,
    lastUpdated: "3 days ago",
    estimated: true,
    fallbackMove: "Refresh the 38 posts that lost positions in the last quarter.",
    causes: [
      { id: "decay", label: "Posts losing ground over time", value: 132_000, explain: "38 posts dropped an average of 6 positions since January.", tone: "amber" },
      { id: "ctr", label: "Fewer clicks than the rankings deserve", value: 62_000, explain: "Older posts still show 2023 dates in search results.", tone: "amber" },
      { id: "position", label: "Ranking just below the fold", value: 32_000, explain: "64 posts sit in positions 11–20.", tone: "primary" },
    ],
    actions: [
      { id: "c1", title: "Refresh the 38 posts that lost positions", why: "They were earning last year and the content is now out of date.", value: 108_000, effort: "Low", confidence: "Medium", pagesAffected: 38 },
      { id: "c2", title: "Update publish dates and intros on evergreen posts", why: "Search results show stale dates against fresher competitors.", value: 47_000, effort: "Low", confidence: "Directional", pagesAffected: 92 },
    ],
    pages: [
      { url: "/blog/cheapest-way-to-travel-europe", clicks: 6_120, position: 12.8, ctr: 0.019, expectedCtr: 0.031, revenue: 14_200, gap: 24_600 },
      { url: "/blog/overnight-bus-tips", clicks: 4_480, position: 15.1, ctr: 0.012, expectedCtr: 0.025, revenue: 9_800, gap: 19_400 },
      { url: "/blog/train-vs-bus-europe", clicks: 3_260, position: 16.4, ctr: 0.010, expectedCtr: 0.022, revenue: 7_100, gap: 15_900 },
    ],
  },
  {
    slug: "category",
    name: "Category pages",
    path: "/category/",
    current: 524_000,
    potential: 790_000,
    priority: 64,
    effort: "High",
    confidence: "High",
    weeksOfData: 26,
    avgPosition: 6.9,
    lastUpdated: "2 days ago",
    estimated: false,
    fallbackMove: "Reduce template duplication across the 84 category pages competing with each other.",
    causes: [
      { id: "cannibal", label: "Pages competing with each other", value: 148_000, explain: "84 category pages target overlapping queries, so Google keeps swapping which one it shows.", tone: "amber" },
      { id: "position", label: "Ranking just below the fold", value: 78_000, explain: "31 category pages rank 11–20.", tone: "primary" },
      { id: "ctr", label: "Fewer clicks than the rankings deserve", value: 40_000, explain: "Category titles are near-identical, which hurts click rate.", tone: "amber" },
    ],
    actions: [
      { id: "d1", title: "Consolidate the 84 overlapping category pages", why: "Google alternates between them, so neither holds a stable position.", value: 148_000, effort: "High", confidence: "High", pagesAffected: 84 },
      { id: "d2", title: "Differentiate category titles and intros", why: "Templates repeat the same wording on every page.", value: 61_000, effort: "Medium", confidence: "Medium", pagesAffected: 84 },
    ],
    pages: [
      { url: "/category/bus-tickets", clicks: 21_400, position: 4.2, ctr: 0.062, expectedCtr: 0.118, revenue: 78_200, gap: 44_100 },
      { url: "/category/train-tickets", clicks: 16_900, position: 5.8, ctr: 0.051, expectedCtr: 0.094, revenue: 61_400, gap: 38_700 },
      { url: "/category/ferry-tickets", clicks: 7_260, position: 9.6, ctr: 0.024, expectedCtr: 0.049, revenue: 22_100, gap: 26_400 },
    ],
  },
  {
    slug: "comparison",
    name: "Comparison pages",
    path: "/compare/",
    current: 94_000,
    potential: 312_000,
    priority: 58,
    effort: "Medium",
    confidence: "Directional",
    weeksOfData: 6,
    avgPosition: 17.3,
    lastUpdated: "16 days ago",
    estimated: true,
    fallbackMove: "Build out the 24 comparison pages that currently redirect to category pages.",
    causes: [
      { id: "missing", label: "Comparisons you don't have a page for", value: 132_000, explain: "24 high-demand comparisons redirect to category pages instead of answering the question.", tone: "muted" },
      { id: "position", label: "Ranking well below the fold", value: 86_000, explain: "Most comparison pages sit past position 15.", tone: "primary" },
    ],
    actions: [
      { id: "e1", title: "Build the 24 missing comparison pages", why: "Searchers compare operators before booking and land on competitors.", value: 132_000, effort: "Medium", confidence: "Directional", pagesAffected: 24 },
      { id: "e2", title: "Add comparison tables to the 18 existing pages", why: "Pages answer in prose where searchers scan for a table.", value: 54_000, effort: "Low", confidence: "Directional", pagesAffected: 18 },
    ],
    pages: [
      { url: "/compare/flixbus-vs-blablacar", clicks: 2_140, position: 16.8, ctr: 0.009, expectedCtr: 0.021, revenue: 5_200, gap: 18_600 },
      { url: "/compare/bus-vs-train-spain", clicks: 1_620, position: 18.4, ctr: 0.007, expectedCtr: 0.018, revenue: 3_900, gap: 14_200 },
    ],
  },
  {
    slug: "glossary",
    name: "Glossary pages",
    path: "/glossary/",
    current: 128_000,
    potential: 128_000,
    priority: 41,
    effort: "Low",
    confidence: "Medium",
    weeksOfData: 22,
    avgPosition: 4.6,
    lastUpdated: "2 days ago",
    estimated: false,
    fallbackMove: "Protect the 12 glossary pages holding position 1–3; they carry most of this revenue.",
    causes: [],
    actions: [
      { id: "f1", title: "Monitor the 12 glossary pages in positions 1–3", why: "They hold most of this page type's revenue and two competitors are gaining.", value: 0, effort: "Low", confidence: "Medium", pagesAffected: 12 },
    ],
    pages: [
      { url: "/glossary/open-return", clicks: 3_420, position: 2.1, ctr: 0.211, expectedCtr: 0.198, revenue: 18_600, gap: 0 },
      { url: "/glossary/flexible-ticket", clicks: 2_860, position: 3.4, ctr: 0.148, expectedCtr: 0.142, revenue: 14_200, gap: 0 },
    ],
  },
];

export function getOpportunity(slug: string) {
  return OPPORTUNITIES.find((o) => o.slug === slug.toLowerCase());
}

export const TOTAL_SITE_GAP = OPPORTUNITIES.reduce((sum, o) => sum + gapOf(o), 0);

/** Share of unmapped clicks across the site — drives the amber banner. */
export const UNMAPPED_CLICK_SHARE = 0.14;
