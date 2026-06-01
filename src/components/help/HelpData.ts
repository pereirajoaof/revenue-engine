export type HelpCategory = {
  slug: string;
  title: string;
  description: string;
  articleCount: number;
};

export const HELP_CATEGORIES: HelpCategory[] = [
  {
    slug: "getting-started",
    title: "Getting Started",
    description:
      "Set up your workspace, connect data sources, configure your project, and understand your first dashboard.",
    articleCount: 14,
  },
  {
    slug: "revenue-opportunities",
    title: "Revenue & Opportunities",
    description:
      "Understand organic revenue potential, revenue gaps, revenue at risk, and prioritised growth actions.",
    articleCount: 22,
  },
  {
    slug: "audit-runs-crawler",
    title: "Audit Runs & Crawler",
    description:
      "Learn how OrganicOS crawls websites, runs technical audits, identifies issues, and powers technical health monitoring.",
    articleCount: 41,
  },
  {
    slug: "brand-authority",
    title: "Brand Authority",
    description:
      "Understand authority signals such as Domain Age, Page Age, Share of Search, backlinks, AI mentions, and brand demand.",
    articleCount: 18,
  },
  {
    slug: "site-focus",
    title: "Site Focus",
    description:
      "Find the pages and site sections where your next hour of organic growth work has the highest return.",
    articleCount: 9,
  },
  {
    slug: "core-web-vitals",
    title: "Core Web Vitals",
    description:
      "Understand real-user performance data, CrUX signals, page type performance, and revenue impact from speed issues.",
    articleCount: 16,
  },
  {
    slug: "ai-visibility",
    title: "AI Visibility",
    description:
      "Track how your brand appears across AI answers, citations, competitor comparisons, and visibility trends.",
    articleCount: 12,
  },
  {
    slug: "data-sources-integrations",
    title: "Data Sources & Integrations",
    description:
      "Connect and troubleshoot Google Search Console, GA4, CrUX, RDAP, Wayback Machine, APIs, and exports.",
    articleCount: 24,
  },
  {
    slug: "account-workspace-access",
    title: "Account, Workspace & Access",
    description:
      "Manage users, projects, roles, account settings, workspace configuration, and billing.",
    articleCount: 17,
  },
  {
    slug: "troubleshooting",
    title: "Troubleshooting",
    description:
      "Fix failed crawls, missing data, disconnected integrations, blocked audits, and low-confidence metrics.",
    articleCount: 28,
  },
  {
    slug: "methodology-scoring",
    title: "Methodology & Scoring",
    description:
      "Learn how OrganicOS calculates scores, benchmarks, confidence levels, and revenue impact.",
    articleCount: 15,
  },
  {
    slug: "security-privacy-crawler-trust",
    title: "Security, Privacy & Crawler Trust",
    description:
      "Technical documentation for IT, security, compliance, and site operations teams.",
    articleCount: 11,
  },
  {
    slug: "api-developer-docs",
    title: "API & Developer Docs",
    description: "Build integrations, automate workflows, and export OrganicOS data.",
    articleCount: 19,
  },
  {
    slug: "release-notes",
    title: "Release Notes",
    description:
      "See the latest product improvements, fixes, methodology changes, and crawler updates.",
    articleCount: 36,
  },
];

export const POPULAR_ARTICLES = [
  { title: "About the OrganicOS Crawler", category: "Audit Runs & Crawler" },
  { title: "How to allowlist the OrganicOS Crawler", category: "Security, Privacy & Crawler Trust" },
  { title: "Why is my audit blocked?", category: "Troubleshooting" },
  { title: "Connect Google Search Console", category: "Data Sources & Integrations" },
  { title: "Understanding Revenue Gap", category: "Revenue & Opportunities" },
  { title: "Understanding Page Types", category: "Methodology & Scoring" },
  { title: "Understanding confidence levels", category: "Methodology & Scoring" },
  { title: "No Core Web Vitals data available", category: "Core Web Vitals" },
];

export const RECENT_ACTIVITY = [
  { title: "About the OrganicOS Crawler", action: "Article updated", when: "today" },
  { title: "How to allowlist the OrganicOS Crawler", action: "Article created", when: "today" },
  { title: "Why is my audit blocked?", action: "Article created", when: "today" },
  { title: "Understanding Revenue Gap", action: "Article updated", when: "this week" },
  { title: "Google Search Console disconnected", action: "Article updated", when: "this week" },
  { title: "Understanding Page Types", action: "Article updated", when: "this week" },
];
