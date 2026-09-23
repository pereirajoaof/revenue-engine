/** Illustrative report evidence for the demo Route pages project. Figures here are
 * scenarios or exposure, never a decomposition of the modelled revenue gap. */
export type EvidenceKind = "Observed" | "Estimated" | "On affected pages" | "No estimate";
export type Figure = { kind: EvidenceKind; text: string; assumption?: string };
export type Finding = {
  id: string; title: string; blocking?: boolean; small?: boolean; source: "crawl" | "search" | "cwv";
  coverage: string; figures: Figure[]; evidence: string; overlap?: string; related?: string;
  issue: string; stale?: boolean;
};
export type ReportAction = {
  id: string; title: string; urls: string[]; mechanism: string; owner: string;
  effort?: string; confidence?: string; figures: Figure[]; overlap?: string; related?: string;
  issue: string;
};
export type InvestigatePage = {
  url: string; clicks: number; position: number; ctr: number; typical: number;
  revenue: number; previous: number; latest: number; status: string; issues: string[];
  figures: { issue: string; figure: Figure }[];
};
export const REPORT_FINDINGS: Finding[] = [
  { id: "1", title: "A route page returns 404 but still appears in search", blocking: true, source: "crawl", coverage: "1 URL · 2.7% impressions · 3.2% est. revenue", figures: [{ kind: "On affected pages", text: "38k/yr" }, { kind: "Observed", text: "Down 820 clicks vs week of 8 Sep" }], evidence: "Crawl 15 Sep: 404 · Search, week of 15 Sep", issue: "404" },
  { id: "2", title: "Click-through is below typical for this position", source: "search", coverage: "1 URL · 7.6% impressions · 7.7% est. revenue", figures: [{ kind: "Estimated", text: "41k–82k/yr", assumption: "If CTR reached the typical 4.6% at position 3" }], evidence: "Search data, 25 Aug–21 Sep: CTR 1.9% vs typical 4.6% at position 3. Low CTR alone doesn't show why.", overlap: "Shares 1 URL with finding 3", related: "finding-3", issue: "Low CTR" },
  { id: "3", title: "Slow page experience (LCP)", source: "cwv", coverage: "1 URL · 7.6% impressions · 7.7% est. revenue", figures: [{ kind: "Estimated", text: "12k/yr", assumption: "If LCP met ‘good’" }], evidence: "Core Web Vitals, week of 15 Sep", overlap: "Shares 1 URL with finding 2", related: "finding-2", issue: "Slow LCP" },
  { id: "4", title: "A search URL wasn't seen in the latest crawl", small: true, source: "crawl", coverage: "1 URL · 0.4% impressions · 0.5% est. revenue", figures: [{ kind: "On affected pages", text: "6k/yr" }], evidence: "Crawl 15 Sep. Check internal links, sitemap, canonical or redirect; absence is not a known cause.", issue: "Not seen in crawl" },
];
export const REPORT_ACTIONS: ReportAction[] = [
  { id: "a1", title: "Restore /bus/new-york-boston, or 301 it to the closest live route", urls: ["/bus/new-york-boston"], mechanism: "Protect traffic to a page that still appears in search but returns 404.", owner: "Engineering", effort: "Low", confidence: "High", figures: [{ kind: "On affected pages", text: "38k/yr" }], issue: "404" },
  { id: "a2", title: "Investigate queries and result appearance for /bus/montreal-toronto, then test a title or description change if warranted", urls: ["/bus/montreal-toronto"], mechanism: "Test whether a more relevant search result earns the typical click-through rate.", owner: "SEO", effort: "Low", confidence: "Medium", figures: [{ kind: "Estimated", text: "41k–82k/yr", assumption: "If CTR reached the typical 4.6% at position 3" }], overlap: "Shares 1 URL with action 3; estimates cannot be added", related: "action-a3", issue: "Low CTR" },
  { id: "a3", title: "Improve LCP on /bus/montreal-toronto", urls: ["/bus/montreal-toronto"], mechanism: "Improve the measured loading experience on this route.", owner: "Engineering", effort: "High", confidence: "Medium", figures: [{ kind: "Estimated", text: "12k/yr", assumption: "If LCP met ‘good’" }], overlap: "Shares 1 URL with action 2; estimates cannot be added", related: "action-a2", issue: "Slow LCP" },
  { id: "a4", title: "Check why the crawl didn't see /bus/paris-lyon", urls: ["/bus/paris-lyon"], mechanism: "Check internal links, sitemap, canonical and redirects before treating this as a problem.", owner: "SEO", confidence: "Medium", figures: [{ kind: "No estimate", text: "No estimate" }, { kind: "On affected pages", text: "6k/yr" }], issue: "Not seen in crawl" },
];
export const REPORT_PAGES: InvestigatePage[] = [
  { url: "/bus/new-york-boston", clicks: 2830, position: 3.6, ctr: 4.4, typical: 4.3, revenue: 38000, latest: 90, previous: 910, status: "Crawled: 404", issues: ["404"], figures: [{ issue: "404", figure: { kind: "On affected pages", text: "38k/yr" } }] },
  { url: "/bus/montreal-toronto", clicks: 3420, position: 3.2, ctr: 1.9, typical: 4.6, revenue: 92000, latest: 830, previous: 890, status: "Crawled: 200", issues: ["Low CTR", "Slow LCP"], figures: [{ issue: "Low CTR", figure: { kind: "Estimated", text: "41k–82k/yr", assumption: "If CTR reached 4.6%" } }, { issue: "Slow LCP", figure: { kind: "Estimated", text: "12k/yr", assumption: "If LCP met ‘good’" } }] },
  { url: "/bus/paris-lyon", clicks: 140, position: 9.1, ctr: 1.5, typical: 1.4, revenue: 6000, latest: 38, previous: 33, status: "Not seen in latest crawl", issues: ["Not seen in crawl"], figures: [{ issue: "Not seen in crawl", figure: { kind: "On affected pages", text: "6k/yr" } }] },
];
