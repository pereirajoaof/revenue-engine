// Illustrative sample data for the Website Authority section.
// Fictional account "northwindoutdoor.co.uk" (GBP). Not live data.

export const SITE = "northwindoutdoor.co.uk";
export const META_LINE = "Links: week of 12 Oct · Crawl: 12 Oct · 2,000 pages analysed";
export const HERO_TOOLTIP =
  "An OrganicOS measurement of observed external endorsement and internal link support. Not a Google metric.";

export const SCORE = 51;
export const EXTERNAL = 44;
export const INTERNAL = 63;
export const REFERRING_DOMAINS = 420;
export const PRIORITY_PAGES = 800;

export type Band = "Very strong" | "Strong" | "Moderate" | "Developing" | "Limited";
export function bandOf(n: number): Band {
  if (n >= 85) return "Very strong";
  if (n >= 70) return "Strong";
  if (n >= 50) return "Moderate";
  if (n >= 30) return "Developing";
  return "Limited";
}

export type Confidence = "High" | "Medium" | "Directional" | "Incomplete";
export type Momentum = "Improving" | "Stable" | "Declining" | "New" | "Not comparable";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const END = Date.UTC(2026, 9, 12);
export function weekLabel(weeksAgo: number) {
  const d = new Date(END - weeksAgo * 7 * 86400000);
  return `${d.getUTCDate()} ${MONTHS[d.getUTCMonth()]}`;
}

// 12 weekly points, 47 → 51. One missing week (null = gap, not zero).
const SCORES = [47, 47, 48, 48, null, 49, 49, 50, 50, 51, 51, 51];
const EXT = [40, 40, 41, 41, null, 42, 42, 42, 43, 42, 42, 44];
const INT = [58, 58, 59, 60, null, 61, 62, 64, 64, 66, 66, 63];
export const TRAJECTORY = SCORES.map((s, i) => ({
  week: weekLabel(11 - i),
  score: s,
  external: EXT[i],
  internal: INT[i],
}));
export const METHOD_PIN_WEEK = weekLabel(4);

export const REFERRING_MONTHLY = [
  ["Nov", 198], ["Dec", 205], ["Jan", 221], ["Feb", 236], ["Mar", 249], ["Apr", 262],
  ["May", 270], ["Jun", 281], ["Jul", 266], ["Aug", 274], ["Sep", 275], ["Oct", 420],
].map(([m, v]) => ({ month: m as string, domains: v as number }));

export type Finding = {
  id: string;
  title: string;
  observed: string;
  where: string;
  reliability: "High" | "Medium";
  coverage: string;
  why: string;
  investigate: string;
  exposure?: string;
  action?: "intentional";
};

const ASSOC = "This is an association, not a guaranteed effect.";

export const FINDINGS: Finding[] = [
  {
    id: "f1",
    title: "212 of 640 product pages receive less than half the internal link support of a typical page.",
    observed: "212 product pages sit below half the median support index for the site.",
    where: "Product pages /p/…",
    reliability: "High",
    coverage: "All 640 product pages crawled",
    why: `Pages with little internal link support can be harder for search engines to discover and weigh. ${ASSOC}`,
    investigate: "Check whether category pages and related-product blocks link to these products.",
    exposure: "£48k/yr",
  },
  {
    id: "f2",
    title: "18 priority pages are not reachable from your homepage in the pages we crawled.",
    observed: "No path of internal links from the homepage reaches these 18 pages.",
    where: "Category pages",
    reliability: "High",
    coverage: "2,000 of 2,000 pages crawled",
    why: `Pages without a path from the homepage can be harder for search engines to discover. ${ASSOC}`,
    investigate: "Check whether these categories were removed from the main navigation or filters.",
    exposure: "£31k/yr",
  },
  {
    id: "f3",
    title: "4% of internal link flow goes to pages that return errors.",
    observed: "37 broken destinations receive links from many templates.",
    where: "Source: “Related products” block, 37 broken destinations",
    reliability: "High",
    coverage: "All linking pages crawled",
    why: `Links to error pages send support nowhere useful and can make crawling less efficient. ${ASSOC}`,
    investigate: "Check the Related products block for discontinued products still being linked.",
  },
  {
    id: "f4",
    title: "Links to non-indexable pages: /cart, /account, /search (9% of flow). Review in context.",
    observed: "9% of internal link flow points to pages marked not to be indexed.",
    where: "Header and footer templates",
    reliability: "Medium",
    coverage: "Patterns matched on 1,940 pages",
    why: `Some of this is normal for a shop. A large share can dilute support for pages that matter. ${ASSOC}`,
    investigate: "Confirm which of these links are needed for shoppers and mark them as intentional.",
    action: "intentional",
  },
  {
    id: "f5",
    title: "71% of domain–page links land on the homepage and blog.",
    observed: "Most domain–page links (top 1,000 pages collected) point at the homepage and blog posts.",
    where: "Homepage, Blog",
    reliability: "Medium",
    coverage: "Top 1,000 pages by linking sites",
    why: `External links concentrated on a few pages may pass less support to products unless internal links carry it on. ${ASSOC}`,
    investigate: "Check whether linked blog posts link onward to relevant category pages.",
  },
  {
    id: "f6",
    title: "Trust pages: 4 of 5 found. Missing: Contact.",
    observed: "We found About, Help, Privacy and Terms. We did not find a Contact page.",
    where: "Site-wide",
    reliability: "High",
    coverage: "2,000 of 2,000 pages crawled",
    why: `Clear trust pages can help visitors and search engines understand who runs a site. ${ASSOC}`,
    investigate: "Check whether a Contact page exists but is not linked, or needs to be created.",
  },
  {
    id: "f7",
    title: "Help pages link to 3 retired product guides.",
    observed: "3 help articles link to guides that redirect twice.",
    where: "Help pages /help/…",
    reliability: "Medium",
    coverage: "50 of 50 help pages crawled",
    why: `Redirect chains can slow discovery of the final page. ${ASSOC}`,
    investigate: "Check whether these links can point straight at the current guides.",
  },
  {
    id: "f8",
    title: "26 blog posts have no links to any category page.",
    observed: "26 of 300 posts only link to other posts or the homepage.",
    where: "Blog /journal/…",
    reliability: "High",
    coverage: "300 of 300 posts crawled",
    why: `Blog posts that earn external links pass less onward support if they never link to shop pages. ${ASSOC}`,
    investigate: "Check whether these posts have a natural link to a relevant category.",
  },
  {
    id: "f9",
    title: "Pagination pages 4+ on /tents/ are 5 or more clicks from the homepage.",
    observed: "Products listed only on later pagination pages are hard to reach.",
    where: "Category pagination /tents/?page=4…",
    reliability: "Medium",
    coverage: "110 category pages crawled",
    why: `Deep pages are reached less often when crawling. ${ASSOC}`,
    investigate: "Check whether these products appear in any subcategory or filter page.",
  },
];

export const TOPICS = [
  { topic: "Tents", pages: 22, support: 28, links: 18, impressions: 31 },
  { topic: "Sleeping bags", pages: 14, support: 12, links: 9, impressions: 17 },
  { topic: "Footwear", pages: 31, support: 24, links: 11, impressions: 26 },
  { topic: "Guides", pages: 18, support: 21, links: 54, impressions: 15 },
];

export const TRUST = [
  { name: "About", ok: true },
  { name: "Help", ok: true },
  { name: "Privacy", ok: true },
  { name: "Terms", ok: true },
  { name: "Contact", ok: false },
];

export const COMPETITORS = { you: 44, median: 51, leader: 66, count: 7 };

export const LANDING_BY_TYPE = [
  { type: "Homepage", links: 1180 },
  { type: "Blog", links: 1320 },
  { type: "Category", links: 520 },
  { type: "Product", links: 290 },
  { type: "Other", links: 120 },
];

export type CrawlStatus = "OK" | "Broken" | "Unknown";
export const EXTERNAL_PAGES: { url: string; type: string; links: number; status: CrawlStatus }[] = [
  { url: "/", type: "Homepage", links: 1180, status: "OK" },
  { url: "/journal/wild-camping-uk/", type: "Blog", links: 312, status: "OK" },
  { url: "/journal/three-peaks-kit-list/", type: "Blog", links: 241, status: "OK" },
  { url: "/journal/how-to-pitch-a-tent/", type: "Blog", links: 198, status: "OK" },
  { url: "/tents/", type: "Category", links: 164, status: "OK" },
  { url: "/journal/best-walks-lake-district/", type: "Blog", links: 152, status: "OK" },
  { url: "/sleeping-bags/", type: "Category", links: 96, status: "OK" },
  { url: "/p/ridgeline-2-tent", type: "Product", links: 71, status: "OK" },
  { url: "/p/summit-down-jacket-2023", type: "Product", links: 22, status: "Broken" },
  { url: "/offers/black-friday-2024/", type: "Other", links: 16, status: "Broken" },
  { url: "/journal/old-guides/", type: "Blog", links: 9, status: "Unknown" },
];

export const RISK = [
  { label: "Referring-IP diversity", value: "Moderate", note: "312 distinct networks across 420 domains" },
  { label: "Nofollow share", value: "18%", note: "Typical for retail sites" },
  { label: "Links per domain", value: "7.8 median", note: "A few domains link very heavily" },
];

export const FLOW = [
  { cls: "Indexable", share: 87 },
  { cls: "Non-indexable", share: 9 },
  { cls: "Broken", share: 4 },
  { cls: "Unknown", share: 0 },
];

export const PAGE_TYPE_TABLE = [
  { type: "Product", pages: 640, reachable: 100, supported: 67, median: 0.62, ratio: 0.71, priority: true },
  { type: "Category", pages: 110, reachable: 84, supported: 76, median: 1.4, ratio: 1.9, priority: true },
  { type: "Blog", pages: 300, reachable: 100, supported: 91, median: 0.95, ratio: 1.1, priority: false },
  { type: "Help", pages: 50, reachable: 100, supported: 96, median: 1.2, ratio: 1.3, priority: true },
];

export const DEPTH = [
  { clicks: "1", pages: 42 },
  { clicks: "2", pages: 268 },
  { clicks: "3", pages: 341 },
  { clicks: "4", pages: 104 },
  { clicks: "5+", pages: 27 },
];

export const NON_INDEXABLE = [
  { pattern: "/cart", links: 1980, share: 3.6 },
  { pattern: "/account", links: 1960, share: 2.8 },
  { pattern: "/search", links: 1210, share: 1.9 },
  { pattern: "/checkout", links: 410, share: 0.7 },
];

export const BROKEN_BY_TEMPLATE = [
  { template: "Related products block", destinations: 37, links: 2140, share: 3.1 },
  { template: "Blog sidebar “Shop the look”", destinations: 9, links: 410, share: 0.6 },
  { template: "Footer", destinations: 2, links: 220, share: 0.3 },
];

export type PageRow = {
  url: string;
  type: "Product" | "Category" | "Blog" | "Help" | "Homepage";
  priority: boolean;
  reachable: boolean;
  support: number;
  supported: boolean;
  depth: number | null;
  linksIn: number;
  domainLinks: number;
  dest: "Indexable" | "Non-indexable" | "Broken";
  revenue: number;
};

const P = (
  url: string, type: PageRow["type"], reachable: boolean, support: number, depth: number | null,
  linksIn: number, domainLinks: number, revenue: number, dest: PageRow["dest"] = "Indexable",
): PageRow => ({
  url, type, priority: type === "Product" || type === "Category" || type === "Help",
  reachable, support, supported: support >= 0.5, depth, linksIn, domainLinks, dest, revenue,
});

export const PAGES: PageRow[] = [
  P("/", "Homepage", true, 9.8, 0, 1980, 1180, 0),
  P("/tents/", "Category", true, 3.2, 1, 1940, 164, 61200),
  P("/sleeping-bags/", "Category", true, 2.6, 1, 1910, 96, 38400),
  P("/footwear/walking-boots/", "Category", true, 1.9, 2, 640, 41, 44800),
  P("/tents/backpacking/", "Category", false, 0.21, null, 0, 6, 12900),
  P("/tents/family/", "Category", false, 0.18, null, 0, 3, 9800),
  P("/stoves-cooking/", "Category", true, 1.1, 2, 310, 12, 15600),
  P("/p/ridgeline-2-tent", "Product", true, 1.4, 2, 88, 71, 22400),
  P("/p/trailhead-40l-rucksack", "Product", true, 0.92, 3, 41, 8, 14100),
  P("/p/fellrunner-gtx-boot-mens", "Product", true, 0.71, 3, 29, 5, 18200),
  P("/p/fellrunner-gtx-boot-womens", "Product", true, 0.44, 3, 12, 2, 11700),
  P("/p/coldfront-3-season-sleeping-bag", "Product", true, 0.38, 4, 9, 1, 8300),
  P("/p/basecamp-6-family-tent-with-porch-and-blackout-bedrooms", "Product", true, 0.29, 4, 6, 0, 6900),
  P("/p/pocket-gas-stove", "Product", true, 0.66, 3, 22, 3, 4200),
  P("/p/merino-baselayer-long-sleeve", "Product", true, 0.31, 5, 4, 0, 3800),
  P("/p/insulated-mug-350ml", "Product", true, 0.12, 5, 0, 0, 900),
  P("/p/summit-down-jacket-2023", "Product", true, 0.05, 4, 37, 22, 0, "Broken"),
  P("/p/trekking-poles-carbon", "Product", true, 0.58, 3, 18, 1, 5100),
  P("/journal/wild-camping-uk/", "Blog", true, 1.3, 2, 44, 312, 2100),
  P("/journal/three-peaks-kit-list/", "Blog", true, 1.1, 2, 38, 241, 3400),
  P("/journal/how-to-pitch-a-tent/", "Blog", true, 0.96, 3, 31, 198, 1200),
  P("/journal/best-walks-lake-district/", "Blog", true, 0.81, 3, 22, 152, 800),
  P("/help/delivery/", "Help", true, 1.6, 1, 1960, 4, 0),
  P("/help/returns/", "Help", true, 1.5, 1, 1960, 2, 0),
  P("/help/size-guide-boots/", "Help", true, 0.47, 3, 14, 0, 0),
];
