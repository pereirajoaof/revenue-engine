import { Bug, Bot, FileSearch, Link as LinkIcon, ServerCrash, Gauge } from "lucide-react";
import type { Issue } from "./IssueCard";

const trend = (vals: number[]) =>
  vals.map((score, i) => ({ week: `W${i + 1}`, score }));

export const ISSUES: Issue[] = [
  {
    key: "crawlRate",
    name: "Crawl Rate",
    icon: <Bug className="w-4 h-4" />,
    status: "critical",
    score: 64,
    recoverable: "£320k",
    atRisk: "£480k",
    trend: trend([72, 70, 68, 67, 66, 65, 64, 64]),
    insight:
      "Low crawl frequency on high-value /routes/ pages limits indexation freshness and price visibility in search.",
    metrics: [
      { label: "Avg crawls / URL", value: "1.4 / wk" },
      { label: "High-value undercrawled", value: "38%" },
    ],
    action: {
      label: "Fix crawl prioritisation on /routes/ pages →",
      uplift: "+£120k/yr",
    },
  },
  {
    key: "crawlStatus",
    name: "Crawl Status",
    icon: <FileSearch className="w-4 h-4" />,
    status: "atRisk",
    score: 71,
    recoverable: "£185k",
    atRisk: "£260k",
    trend: trend([68, 69, 70, 70, 71, 71, 72, 71]),
    insight:
      "12% of revenue-critical URLs are 'discovered, currently not indexed'. Internal linking and quality signals are the bottleneck.",
    metrics: [
      { label: "% indexed", value: "78%" },
      { label: "% excluded", value: "10%" },
      { label: "Discovered not indexed", value: "12%" },
      { label: "Soft 404s", value: "1.2%" },
    ],
    action: {
      label: "Promote 240 high-value URLs in internal linking →",
      uplift: "+£75k/yr",
    },
  },
  {
    key: "robotsTxt",
    name: "Robots.txt",
    icon: <Bot className="w-4 h-4" />,
    status: "critical",
    score: 52,
    recoverable: "£95k",
    atRisk: "£140k",
    trend: trend([60, 58, 56, 55, 54, 53, 52, 52]),
    insight:
      "/search and /filter paths are blocked, preventing indexation of long-tail demand pages worth measurable revenue.",
    metrics: [
      { label: "Blocked URLs", value: "1,820" },
      { label: "Incorrectly blocked", value: "14%" },
    ],
    action: {
      label: "Unblock /search facets with parameter rules →",
      uplift: "+£60k/yr",
    },
  },
  {
    key: "canonical",
    name: "Canonicals",
    icon: <LinkIcon className="w-4 h-4" />,
    status: "atRisk",
    score: 76,
    recoverable: "£145k",
    atRisk: "£210k",
    trend: trend([74, 75, 75, 76, 76, 77, 77, 76]),
    insight:
      "Conflicting canonical signals on city pages dilute ranking authority across duplicates of the same intent.",
    metrics: [
      { label: "% correct canonical", value: "84%" },
      { label: "Conflicting signals", value: "11%" },
      { label: "Self-canonical", value: "82%" },
      { label: "Cross-domain", value: "0.4%" },
    ],
    action: {
      label: "Consolidate canonicals on 860 city pages →",
      uplift: "+£90k/yr",
    },
  },
  {
    key: "http",
    name: "HTTP Status",
    icon: <ServerCrash className="w-4 h-4" />,
    status: "atRisk",
    score: 81,
    recoverable: "£180k",
    atRisk: "£245k",
    trend: trend([78, 79, 80, 80, 81, 81, 82, 81]),
    insight:
      "Redirect chains on top 500 URLs leak crawl budget; 5xx spikes on operator detail pages erode trust signals.",
    metrics: [
      { label: "% 200", value: "92.4%" },
      { label: "% 3xx", value: "4.8%" },
      { label: "% 4xx", value: "2.1%" },
      { label: "% 5xx", value: "0.7%" },
    ],
    action: {
      label: "Resolve redirect chains on top 500 URLs →",
      uplift: "+£80k/yr",
    },
  },
  {
    key: "cwv",
    name: "Core Web Vitals",
    icon: <Gauge className="w-4 h-4" />,
    status: "atRisk",
    score: 68,
    recoverable: "£210k",
    atRisk: "£300k",
    trend: trend([72, 71, 70, 69, 68, 68, 67, 68]),
    insight:
      "LCP regressed on /stops/ templates after the latest deploy. INP is the second-largest converter for mobile.",
    metrics: [
      { label: "% Good URLs", value: "61%" },
      { label: "LCP good", value: "58%" },
      { label: "INP good", value: "67%" },
      { label: "CLS good", value: "92%" },
    ],
    action: {
      label: "Ship LCP optimisation on /stops/ templates →",
      uplift: "+£110k/yr",
    },
  },
];
