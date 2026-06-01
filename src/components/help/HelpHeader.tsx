import { Link, useLocation } from "@tanstack/react-router";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LifeBuoy, Search, Menu, X, ChevronDown } from "lucide-react";
import { useState } from "react";

type SubLink = {
  label: string;
  to: string;
  params?: Record<string, string>;
  hash?: string;
};

type Pillar = {
  label: string;
  to: string;
  params?: Record<string, string>;
  match: (pathname: string) => boolean;
  purpose: string;
  links: SubLink[];
};

const slugTo = (slug: string, hash?: string): SubLink => ({
  label: "",
  to: "/help/$slug",
  params: { slug },
  hash,
});

const PILLARS: Pillar[] = [
  {
    label: "Get Started",
    to: "/help/$slug",
    params: { slug: "getting-started" },
    match: (p) => p.startsWith("/help/getting-started"),
    purpose: "Setup, onboarding, and your first dashboard.",
    links: [
      { ...slugTo("getting-started", "create-project"), label: "Create your first project" },
      { ...slugTo("data-sources-integrations", "gsc"), label: "Connect Google Search Console" },
      { ...slugTo("getting-started", "business-model"), label: "Set business model, CVR and AOV" },
      { ...slugTo("brand-authority", "brand-terms"), label: "Add brand and category terms" },
      { ...slugTo("brand-authority", "competitors"), label: "Add competitors" },
      { ...slugTo("site-focus", "page-types"), label: "Define page types" },
      { ...slugTo("revenue-opportunities", "first-dashboard"), label: "Understand your first dashboard" },
    ],
  },
  {
    label: "Use OrganicOS",
    to: "/help/$slug",
    params: { slug: "revenue-opportunities" },
    match: (p) =>
      p.startsWith("/help/revenue-opportunities") ||
      p.startsWith("/help/brand-authority") ||
      p.startsWith("/help/site-focus") ||
      p.startsWith("/help/core-web-vitals") ||
      p.startsWith("/help/ai-visibility") ||
      p.startsWith("/help/methodology-scoring"),
    purpose: "Core product modules and business value.",
    links: [
      { ...slugTo("revenue-opportunities"), label: "Revenue & Opportunities" },
      { ...slugTo("revenue-opportunities", "metrics"), label: "Dashboard metrics" },
      { ...slugTo("brand-authority"), label: "Brand Authority" },
      { ...slugTo("site-focus"), label: "Site Focus" },
      { ...slugTo("core-web-vitals"), label: "Core Web Vitals" },
      { ...slugTo("ai-visibility"), label: "AI Visibility" },
      { ...slugTo("methodology-scoring"), label: "Methodology & Scoring" },
    ],
  },
  {
    label: "Technical Audits",
    to: "/help/$slug",
    params: { slug: "audit-runs-crawler" },
    match: (p) => p.startsWith("/help/audit-runs-crawler"),
    purpose: "Crawling, audit runs, technical health, issues.",
    links: [
      { ...slugTo("audit-runs-crawler"), label: "Audit Runs overview" },
      { ...slugTo("audit-runs-crawler", "revenue-vs-manual"), label: "Revenue Audit vs Manual Audit" },
      { label: "About the OrganicOS Crawler", to: "/crawler" },
      { ...slugTo("audit-runs-crawler", "crawler-config"), label: "Crawler configuration" },
      { ...slugTo("audit-runs-crawler", "technical-health"), label: "Technical Health Score" },
      { ...slugTo("audit-runs-crawler", "issues"), label: "Issue types" },
      { ...slugTo("audit-runs-crawler", "url-inventory"), label: "URL inventory" },
    ],
  },
  {
    label: "Data & Integrations",
    to: "/help/$slug",
    params: { slug: "data-sources-integrations" },
    match: (p) =>
      p.startsWith("/help/data-sources-integrations") ||
      p.startsWith("/help/api-developer-docs"),
    purpose: "Where data comes from and how to connect it.",
    links: [
      { ...slugTo("data-sources-integrations", "gsc"), label: "Google Search Console" },
      { ...slugTo("data-sources-integrations", "ga4"), label: "Google Analytics 4" },
      { ...slugTo("data-sources-integrations", "crux"), label: "Chrome UX Report" },
      { ...slugTo("data-sources-integrations", "rdap"), label: "RDAP and domain data" },
      { ...slugTo("data-sources-integrations", "wayback"), label: "Wayback Machine" },
      { ...slugTo("api-developer-docs"), label: "API & exports" },
      { ...slugTo("troubleshooting", "integrations"), label: "Integration troubleshooting" },
    ],
  },
  {
    label: "Trust & Support",
    to: "/help/$slug",
    params: { slug: "security-privacy-crawler-trust" },
    match: (p) =>
      p.startsWith("/help/security-privacy-crawler-trust") ||
      p.startsWith("/help/troubleshooting") ||
      p.startsWith("/help/account-workspace-access") ||
      p.startsWith("/crawler"),
    purpose: "For IT, security teams, and anyone needing help.",
    links: [
      { label: "Crawler identity", to: "/crawler" },
      { label: "Allowlist OrganicOS Crawler", to: "/crawler", hash: "allowlist" },
      { label: "Block OrganicOS Crawler", to: "/crawler", hash: "block" },
      { ...slugTo("account-workspace-access", "oauth"), label: "OAuth permissions" },
      { ...slugTo("security-privacy-crawler-trust", "data-access"), label: "Data access and privacy" },
      { ...slugTo("troubleshooting"), label: "Troubleshooting" },
      { ...slugTo("security-privacy-crawler-trust", "support"), label: "Contact support" },
    ],
  },
];

export function HelpHeader() {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  const [openPillar, setOpenPillar] = useState<string | null>(null);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur">
      {/* Top row — brand + utility */}
      <div className="border-b border-border/60">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-3">
          <div className="flex min-w-0 items-center gap-3">
            <Link to="/early-access" className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary">
                <span className="text-sm font-bold text-primary-foreground">O</span>
              </div>
              <span className="text-lg font-bold tracking-tight">OrganicOS</span>
            </Link>
            <span className="h-5 w-px bg-border" />
            <Link
              to="/help"
              className="truncate text-sm font-semibold text-foreground hover:text-primary"
            >
              Knowledge Center
            </Link>
            <span className="ml-1 hidden rounded-md border border-border bg-surface/70 px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground sm:inline">
              v2026.06
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              className="hidden items-center gap-2 rounded-md border border-border bg-surface/60 px-3 py-1.5 text-xs text-muted-foreground hover:border-primary/40 hover:text-foreground md:inline-flex"
              onClick={() => {
                const el = document.querySelector<HTMLInputElement>("[data-help-search-input]");
                el?.focus();
              }}
            >
              <Search className="h-3.5 w-3.5" />
              Search docs
              <kbd className="rounded border border-border bg-background px-1 font-mono text-[10px] text-muted-foreground">
                /
              </kbd>
            </button>
            <ThemeToggle />
            <Link
              to="/dashboard"
              className="hidden rounded-lg px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground sm:inline-flex"
            >
              Sign in
            </Link>
            <Link
              to="/request-demo"
              className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface/70 px-3 py-1.5 text-sm font-semibold text-foreground transition-colors hover:bg-surface"
            >
              <LifeBuoy className="h-4 w-4" />
              <span className="hidden sm:inline">Get support</span>
            </Link>
            <button
              type="button"
              aria-label="Toggle navigation"
              className="ml-1 inline-flex h-9 w-9 items-center justify-center rounded-md border border-border text-muted-foreground hover:text-foreground lg:hidden"
              onClick={() => setOpen((o) => !o)}
            >
              {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* Bottom row — pillar nav with dropdowns */}
      <div className="hidden lg:block">
        <div
          className="mx-auto max-w-6xl px-6"
          onMouseLeave={() => setOpenPillar(null)}
        >
          <nav className="-mb-px flex items-center gap-1">
            {PILLARS.map((pillar) => {
              const active = pillar.match(pathname);
              const isOpen = openPillar === pillar.label;
              return (
                <div
                  key={pillar.label}
                  className="relative"
                  onMouseEnter={() => setOpenPillar(pillar.label)}
                  onFocus={() => setOpenPillar(pillar.label)}
                >
                  <Link
                    to={pillar.to}
                    params={pillar.params as never}
                    className={[
                      "relative inline-flex items-center gap-1 whitespace-nowrap px-3 py-3 text-sm font-medium transition-colors",
                      active
                        ? "text-foreground"
                        : "text-muted-foreground hover:text-foreground",
                    ].join(" ")}
                  >
                    {pillar.label}
                    <ChevronDown
                      className={[
                        "h-3.5 w-3.5 transition-transform",
                        isOpen ? "rotate-180" : "",
                      ].join(" ")}
                    />
                    <span
                      className={[
                        "pointer-events-none absolute inset-x-2 -bottom-px h-0.5 rounded-full transition-opacity",
                        active ? "bg-primary opacity-100" : "opacity-0",
                      ].join(" ")}
                    />
                  </Link>

                  {isOpen && (
                    <div
                      className="absolute left-0 top-full z-50 w-80 pt-2"
                    >
                      <div className="rounded-lg border border-border bg-background shadow-xl">
                        <div className="border-b border-border/60 px-4 py-3">
                          <div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                            {pillar.label}
                          </div>
                          <p className="mt-1 text-xs text-muted-foreground">
                            {pillar.purpose}
                          </p>
                        </div>
                        <ul className="p-2">
                          {pillar.links.map((link) => (
                            <li key={link.label}>
                              <Link
                                to={link.to}
                                params={link.params as never}
                                hash={link.hash}
                                onClick={() => setOpenPillar(null)}
                                className="block rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-surface hover:text-foreground"
                              >
                                {link.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Mobile nav drawer */}
      {open && (
        <div className="border-t border-border bg-background lg:hidden">
          <nav className="mx-auto max-w-6xl px-6 py-3">
            <ul className="space-y-4">
              {PILLARS.map((pillar) => {
                const active = pillar.match(pathname);
                return (
                  <li key={pillar.label}>
                    <Link
                      to={pillar.to}
                      params={pillar.params as never}
                      onClick={() => setOpen(false)}
                      className={[
                        "flex items-center justify-between rounded-md px-3 py-2 text-sm font-semibold",
                        active
                          ? "bg-primary/10 text-foreground"
                          : "text-foreground hover:bg-surface",
                      ].join(" ")}
                    >
                      {pillar.label}
                      {active && (
                        <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                      )}
                    </Link>
                    <ul className="mt-1 space-y-0.5 pl-3">
                      {pillar.links.map((link) => (
                        <li key={link.label}>
                          <Link
                            to={link.to}
                            params={link.params as never}
                            hash={link.hash}
                            onClick={() => setOpen(false)}
                            className="block rounded-md px-3 py-1.5 text-sm text-muted-foreground hover:bg-surface hover:text-foreground"
                          >
                            {link.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      )}
    </header>
  );
}
