import { Link, useLocation } from "@tanstack/react-router";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LifeBuoy, Search, Menu, X } from "lucide-react";
import { useState } from "react";

type NavItem = {
  label: string;
  to: string;
  params?: Record<string, string>;
  match: (pathname: string) => boolean;
};

const NAV: NavItem[] = [
  {
    label: "Overview",
    to: "/help",
    match: (p) => p === "/help" || p === "/help/",
  },
  {
    label: "Audit Runs & Crawler",
    to: "/help/$slug",
    params: { slug: "audit-runs-crawler" },
    match: (p) => p.startsWith("/help/audit-runs-crawler"),
  },
  {
    label: "Data & Integrations",
    to: "/help/$slug",
    params: { slug: "data-sources-integrations" },
    match: (p) => p.startsWith("/help/data-sources-integrations"),
  },
  {
    label: "Methodology",
    to: "/help/$slug",
    params: { slug: "methodology-scoring" },
    match: (p) => p.startsWith("/help/methodology-scoring"),
  },
  {
    label: "API & Developers",
    to: "/help/$slug",
    params: { slug: "api-developer-docs" },
    match: (p) => p.startsWith("/help/api-developer-docs"),
  },
  {
    label: "Crawler Trust",
    to: "/crawler",
    match: (p) => p.startsWith("/crawler"),
  },
  {
    label: "Release Notes",
    to: "/help/$slug",
    params: { slug: "release-notes" },
    match: (p) => p.startsWith("/help/release-notes"),
  },
];

export function HelpHeader() {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);

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

      {/* Bottom row — primary nav */}
      <div className="hidden lg:block">
        <div className="mx-auto max-w-6xl px-6">
          <nav className="-mb-px flex items-center gap-1">
            {NAV.map((item) => {
              const active = item.match(pathname);
              return (
                <Link
                  key={item.label}
                  to={item.to}
                  params={item.params as never}
                  className={[
                    "relative whitespace-nowrap px-3 py-3 text-sm font-medium transition-colors",
                    active
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground",
                  ].join(" ")}
                >
                  {item.label}
                  <span
                    className={[
                      "pointer-events-none absolute inset-x-2 -bottom-px h-0.5 rounded-full transition-opacity",
                      active ? "bg-primary opacity-100" : "opacity-0",
                    ].join(" ")}
                  />
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Mobile nav drawer */}
      {open && (
        <div className="border-t border-border bg-background lg:hidden">
          <nav className="mx-auto max-w-6xl px-6 py-3">
            <ul className="space-y-1">
              {NAV.map((item) => {
                const active = item.match(pathname);
                return (
                  <li key={item.label}>
                    <Link
                      to={item.to}
                      params={item.params as never}
                      onClick={() => setOpen(false)}
                      className={[
                        "flex items-center justify-between rounded-md px-3 py-2 text-sm font-medium",
                        active
                          ? "bg-primary/10 text-foreground"
                          : "text-muted-foreground hover:bg-surface hover:text-foreground",
                      ].join(" ")}
                    >
                      {item.label}
                      {active && (
                        <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                      )}
                    </Link>
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
