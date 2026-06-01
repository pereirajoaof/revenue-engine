import { Link } from "@tanstack/react-router";
import { ArrowRight, ChevronRight, FileText, Mail, Shield, LifeBuoy, Briefcase } from "lucide-react";
import type { HelpCategory } from "./HelpData";

export function CategoryCard({ category }: { category: HelpCategory }) {
  return (
    <Link
      to="/help/$slug"
      params={{ slug: category.slug }}
      className="group relative flex flex-col rounded-xl border border-border bg-card p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md"
    >
      <div className="mb-3 flex items-center justify-between">
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary ring-1 ring-primary/20">
          <FileText className="h-4 w-4" />
        </span>
        <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
          {category.articleCount} articles
        </span>
      </div>
      <h3 className="text-base font-semibold tracking-tight text-foreground">
        {category.title}
      </h3>
      <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">
        {category.description}
      </p>
      <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
        Explore <ArrowRight className="h-3.5 w-3.5" />
      </span>
    </Link>
  );
}

export function ArticleListItem({
  title,
  meta,
}: {
  title: string;
  meta?: string;
}) {
  return (
    <button
      type="button"
      className="group flex w-full items-center justify-between gap-4 border-b border-border/70 py-3 text-left transition-colors last:border-b-0 hover:text-primary"
    >
      <div className="flex min-w-0 items-center gap-3">
        <FileText className="h-4 w-4 shrink-0 text-muted-foreground group-hover:text-primary" />
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-foreground group-hover:text-primary">
            {title}
          </p>
          {meta && (
            <p className="truncate font-mono text-[11px] text-muted-foreground">{meta}</p>
          )}
        </div>
      </div>
      <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground group-hover:text-primary" />
    </button>
  );
}

export function ArticleGroup({
  title,
  items,
  showAll = false,
}: {
  title: string;
  items: string[];
  showAll?: boolean;
}) {
  return (
    <section className="rounded-xl border border-border bg-card p-6 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-base font-semibold tracking-tight">{title}</h3>
        <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
          {items.length} articles
        </span>
      </div>
      <div className="-my-1 divide-y divide-border/70">
        {items.map((t) => (
          <ArticleListItem key={t} title={t} />
        ))}
      </div>
      {showAll && (
        <div className="mt-4 border-t border-border/70 pt-3">
          <a
            href="#"
            className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
          >
            See all articles <ArrowRight className="h-3.5 w-3.5" />
          </a>
        </div>
      )}
    </section>
  );
}

type SupportCard = {
  title: string;
  body: string;
  cta: string;
  href: string;
  icon: "mail" | "shield" | "support" | "sales";
};

const ICONS = {
  mail: Mail,
  shield: Shield,
  support: LifeBuoy,
  sales: Briefcase,
};

export function SupportCards() {
  const cards: SupportCard[] = [
    {
      title: "Message us",
      body: "Contact support and get help with your OrganicOS workspace.",
      cta: "Open a ticket",
      href: "/request-demo",
      icon: "mail",
    },
    {
      title: "Crawler questions",
      body: "For crawler identity, allowlisting, or blocking requests.",
      cta: "Read crawler docs",
      href: "/crawler",
      icon: "shield",
    },
    {
      title: "Technical support",
      body: "For data syncs, failed audits, integrations, or account access.",
      cta: "Get help",
      href: "/request-demo",
      icon: "support",
    },
    {
      title: "Sales",
      body: "For pricing, enterprise access, or onboarding support.",
      cta: "Talk to sales",
      href: "/request-demo",
      icon: "sales",
    },
  ];

  return (
    <section id="get-in-touch" className="scroll-mt-24">
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
            Get in touch
          </p>
          <h2 className="mt-1 text-2xl font-bold tracking-tight">
            Still need help?
          </h2>
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => {
          const Icon = ICONS[c.icon];
          return (
            <a
              key={c.title}
              href={c.href}
              className="group flex flex-col rounded-xl border border-border bg-card p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md"
            >
              <span className="mb-4 inline-flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary ring-1 ring-primary/20">
                <Icon className="h-4 w-4" />
              </span>
              <h3 className="text-base font-semibold tracking-tight">{c.title}</h3>
              <p className="mt-1 flex-1 text-sm text-muted-foreground">{c.body}</p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary">
                {c.cta} <ArrowRight className="h-3.5 w-3.5" />
              </span>
            </a>
          );
        })}
      </div>
    </section>
  );
}
