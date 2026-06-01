import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ChevronRight, ArrowRight } from "lucide-react";
import { Footer } from "@/components/Footer";
import { HelpHeader } from "@/components/help/HelpHeader";
import { HelpSearch } from "@/components/help/HelpSearch";
import { ArticleGroup, SupportCards } from "@/components/help/HelpPieces";
import { HELP_CATEGORIES } from "@/components/help/HelpData";

type Group = { title: string; items: string[]; showAll?: boolean };

const CATEGORY_CONTENT: Record<string, Group[]> = {
  "audit-runs-crawler": [
    {
      title: "Audit Runs",
      items: [
        "What is an Audit Run?",
        "Revenue Audit vs Manual Audit",
        "How to run a new audit",
        "Understanding audit statuses",
        "Understanding Health Score",
        "Understanding audit history",
        "Understanding issue movement",
        "Understanding URL inventory",
      ],
      showAll: true,
    },
    {
      title: "Crawler Basics",
      items: [
        "About the OrganicOS Crawler",
        "Why the OrganicOS Crawler is visiting your site",
        "OrganicOS Crawler User-Agent",
        "Crawl behaviour and crawl limits",
        "How OrganicOS respects robots.txt",
        "How OrganicOS discovers URLs",
        "How sitemaps are used",
        "How internal links are used",
        "What data OrganicOS captures per URL",
      ],
      showAll: true,
    },
    {
      title: "Crawler Configuration",
      items: [
        "Setting crawl depth",
        "Setting maximum URLs",
        "Setting crawl speed",
        "Choosing crawl entry points",
        "Using include and exclude rules",
        "JavaScript rendering",
        "Crawling subdomains",
        "Scheduling audits",
      ],
    },
    {
      title: "Crawler Access",
      items: [
        "Allowlisting the OrganicOS Crawler",
        "Blocking the OrganicOS Crawler",
        "Request IP addresses",
        "Cloudflare allowlist guide",
        "Akamai allowlist guide",
        "AWS WAF allowlist guide",
        "Fastly allowlist guide",
        "Troubleshooting blocked crawls",
      ],
      showAll: true,
    },
    {
      title: "Troubleshooting",
      items: [
        "How to fix a failed audit",
        "Why is my crawl taking so long?",
        "Why did my crawl stop before finishing?",
        "Why are fewer URLs crawled than expected?",
        "Why is my site blocking OrganicOS?",
        "How to fix 403 crawl errors",
        "How to fix 429 crawl errors",
        "How to fix robots.txt blocked audits",
      ],
      showAll: true,
    },
  ],
};

function placeholderGroups(title: string): Group[] {
  return [
    {
      title: `${title} — Overview`,
      items: [
        `Introduction to ${title}`,
        `Core concepts in ${title}`,
        `Common workflows`,
        `Best practices`,
      ],
    },
    {
      title: "Configuration & Setup",
      items: [
        "Getting started",
        "Connecting required data sources",
        "Configuring your workspace",
        "Permissions and access",
      ],
    },
    {
      title: "Troubleshooting",
      items: [
        "Common issues and fixes",
        "Why is data missing?",
        "Reading confidence levels",
        "Contacting support",
      ],
    },
  ];
}

export const Route = createFileRoute("/help/$slug")({
  beforeLoad: ({ params }) => {
    const category = HELP_CATEGORIES.find((c) => c.slug === params.slug);
    if (!category) throw notFound();
    return { category };
  },
  loader: ({ context }) => ({ category: context.category }),
  component: HelpCategory,
  head: ({ loaderData }) => {
    const c = loaderData?.category;
    if (!c) return { meta: [{ title: "Help Center — OrganicOS" }] };
    return {
      meta: [
        { title: `${c.title} — OrganicOS Knowledge Center` },
        { name: "description", content: c.description },
        { property: "og:title", content: `${c.title} — OrganicOS Knowledge Center` },
        { property: "og:description", content: c.description },
      ],
    };
  },
});

function HelpCategory() {
  const { category } = Route.useLoaderData();
  const groups = CATEGORY_CONTENT[category.slug] ?? placeholderGroups(category.title);
  const related = HELP_CATEGORIES.filter((c) => c.slug !== category.slug).slice(0, 6);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <HelpHeader />

      <div className="border-b border-border bg-surface/40">
        <div className="mx-auto max-w-6xl px-6 py-10">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
            <Link to="/help" className="hover:text-foreground">
              Help Center
            </Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-foreground">{category.title}</span>
          </nav>

          <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_320px] lg:items-end">
            <div>
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                {category.title}
              </h1>
              <p className="mt-3 max-w-2xl text-base text-muted-foreground">
                {category.description}
              </p>
              <p className="mt-3 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                {category.articleCount} articles · Updated regularly
              </p>
            </div>
            <div>
              <HelpSearch
                size="md"
                placeholder={`Search ${category.title}…`}
                scopeLabel={category.title}
              />
            </div>
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid gap-10 lg:grid-cols-[1fr_280px]">
          {/* Article groups */}
          <div className="space-y-6">
            {groups.map((g) => (
              <ArticleGroup key={g.title} title={g.title} items={g.items} showAll={g.showAll} />
            ))}

            {/* Bottom CTA */}
            <div className="rounded-xl border border-primary/30 bg-primary/5 p-6 text-center">
              <h3 className="text-base font-semibold tracking-tight">
                Can't find what you need?
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Our team responds within one business day.
              </p>
              <Link
                to="/request-demo"
                className="mt-4 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:brightness-110"
              >
                Contact support <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
              <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                Related categories
              </p>
              <ul className="mt-3 space-y-1">
                {related.map((r) => (
                  <li key={r.slug}>
                    <Link
                      to="/help/$slug"
                      params={{ slug: r.slug }}
                      className="group flex items-center justify-between rounded-md px-2 py-1.5 text-sm text-foreground hover:bg-surface"
                    >
                      <span className="truncate">{r.title}</span>
                      <ChevronRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground group-hover:text-foreground" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {category.slug === "audit-runs-crawler" && (
              <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
                <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                  Crawler trust
                </p>
                <p className="mt-2 text-sm text-foreground">
                  Public technical reference for IT and security teams.
                </p>
                <Link
                  to="/crawler"
                  className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                >
                  Crawler identity & allowlisting <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            )}
          </aside>
        </div>

        <div className="mt-16">
          <SupportCards />
        </div>
      </main>

      <Footer />
    </div>
  );
}
