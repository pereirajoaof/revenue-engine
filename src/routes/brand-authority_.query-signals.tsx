import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  ChevronRight,
  ExternalLink,
  Eye,
  Globe,
  MessageSquare,
  Search,
  Shield,
  ShieldCheck,
  Sparkles,
  Star,
  Swords,
  Users,
  X,
  Youtube,
} from "lucide-react";
import { DashboardNav } from "@/components/dashboard/DashboardNav";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";

export const Route = createFileRoute("/brand-authority_/query-signals")({
  component: QuerySignalsPage,
  head: () => ({
    meta: [
      { title: "Brand Demand Intelligence — Brand Authority" },
      {
        name: "description",
        content:
          "See what people search about your brand, who controls the first page of results, and what to do next.",
      },
      { property: "og:title", content: "Brand Demand Intelligence — Brand Authority" },
      {
        property: "og:description",
        content:
          "Branded query demand, narrative control, and recommended operator actions across owned, social, community, review, and competitor surfaces.",
      },
    ],
  }),
});

// ── Types ───────────────────────────────────────────────────────────────────

type Direction = "Positive" | "Neutral" | "Negative";
type RiskTier = "Low" | "Medium" | "High" | "Critical";
type OppTier = "Low" | "Medium" | "High";
type SerpControl = "Strong" | "Shared" | "Weak" | "Lost";
type DomainType =
  | "Owned"
  | "Official social"
  | "Community"
  | "Review"
  | "Video"
  | "News / media"
  | "Marketplace"
  | "Competitor"
  | "Other";

type Category =
  | "Buying Intent"
  | "Product Demand"
  | "Local Demand"
  | "Brand Discovery"
  | "Platform Usage"
  | "Customer Friction"
  | "Brand Trust"
  | "Competitive Pressure";

type SerpResult = {
  position: number;
  domain: string;
  title: string;
  type: DomainType;
  ownership: "Owned" | "Official" | "External" | "Competitor";
  riskNote?: string;
};

type Query = {
  query: string;
  category: Category;
  direction: Direction;
  impressions: number;
  growth: number; // % change
  opportunity: OppTier;
  risk: RiskTier;
  operatorPresent: boolean;
  topExternal: string;
  control: SerpControl;
  action: string;
  serp: SerpResult[];
  narrative: string;
};

// ── Mock data ───────────────────────────────────────────────────────────────

const HERO = {
  totalQueries: 312,
  positiveShare: 71,
  negativeSignals: 18,
  narrativeControl: 64,
  externalDomains: 47,
};

const OWNERSHIP = [
  { key: "Owned website", pct: 34, count: 106, trend: 4, tone: "good" as const },
  { key: "Official profiles", pct: 18, count: 56, trend: 1, tone: "good" as const },
  { key: "Social platforms", pct: 14, count: 44, trend: 3, tone: "warn" as const },
  { key: "Forums / communities", pct: 10, count: 31, trend: 6, tone: "risk" as const },
  { key: "Review platforms", pct: 8, count: 25, trend: -2, tone: "warn" as const },
  { key: "Media / publishers", pct: 6, count: 19, trend: 0, tone: "neutral" as const },
  { key: "Competitors", pct: 6, count: 18, trend: 2, tone: "risk" as const },
  { key: "Other", pct: 4, count: 13, trend: 0, tone: "neutral" as const },
];

const PLATFORMS: {
  domain: string;
  type: DomainType;
  queries: number;
  avgPos: number;
  trend: number;
  risk: RiskTier;
  action: string;
  icon: typeof MessageSquare;
}[] = [
  { domain: "reddit.com", type: "Community", queries: 8, avgPos: 4.2, trend: 2, risk: "High", action: "Join or influence the discussion", icon: MessageSquare },
  { domain: "facebook.com", type: "Official social", queries: 6, avgPos: 3.1, trend: 0, risk: "Medium", action: "Keep page updated and aligned", icon: Users },
  { domain: "instagram.com", type: "Official social", queries: 5, avgPos: 5.4, trend: 1, risk: "Medium", action: "Improve brand / profile content", icon: Sparkles },
  { domain: "trustpilot.com", type: "Review", queries: 4, avgPos: 2.8, trend: 1, risk: "High", action: "Monitor review sentiment", icon: Star },
  { domain: "youtube.com", type: "Video", queries: 3, avgPos: 6.1, trend: 0, risk: "Low", action: "Publish or optimise video content", icon: Youtube },
  { domain: "competitor-a.com", type: "Competitor", queries: 3, avgPos: 5.9, trend: 1, risk: "High", action: "Create comparison page", icon: Swords },
  { domain: "quora.com", type: "Community", queries: 2, avgPos: 7.2, trend: 0, risk: "Medium", action: "Answer recurring questions", icon: MessageSquare },
  { domain: "techradar.com", type: "News / media", queries: 2, avgPos: 4.4, trend: -1, risk: "Low", action: "Build relationship for accurate coverage", icon: Globe },
];

const ACTIONS = [
  {
    id: "reddit",
    title: "Strengthen your Reddit narrative",
    why: "Reddit appears on page 1 for 5 branded trust and comparison queries. These pages shape how users evaluate your brand before they click.",
    evidence: ["5 branded queries affected", "Avg ranking position: 4.6", "12,400 monthly impressions", "Risk tier: High"],
    next: "Create or improve official responses, ensure common concerns are answered on your own site, and monitor recurring themes.",
    effort: "Medium",
    confidence: "High",
    impact: "Protect reputation",
    tone: "risk" as const,
  },
  {
    id: "instagram",
    title: "Improve official Instagram presence",
    why: "Instagram appears repeatedly for branded discovery searches. Users may use it to validate your brand before buying or contacting you.",
    evidence: ["4 branded discovery queries affected", "Avg ranking position: 5.1", "Positive demand category"],
    next: "Ensure the profile bio, link, highlights, and recent posts clearly explain the brand, product, proof points, and next step.",
    effort: "Low",
    confidence: "Medium",
    impact: "Control social narrative",
    tone: "warn" as const,
  },
  {
    id: "comparison",
    title: "Create owned content for comparison queries",
    why: "Users are searching for your brand against alternatives, but competitor and third-party domains control part of the SERP.",
    evidence: ["3 competitive pressure queries", "2 competitor domains visible", "Opportunity tier: High"],
    next: "Create comparison, alternatives, or decision-support content that helps users evaluate the brand on your own domain.",
    effort: "High",
    confidence: "High",
    impact: "Defend against competitors",
    tone: "risk" as const,
  },
];

const CATEGORIES: {
  key: Category;
  blurb: string;
  queries: number;
  impressions: number;
  growth: number;
  risk: number;
  action: string;
  direction: Direction;
}[] = [
  { key: "Buying Intent", blurb: "People are close to a purchase decision.", queries: 38, impressions: 24800, growth: 12, risk: 1, action: "Make sure pricing, plans, and CTAs are clear on owned pages.", direction: "Positive" },
  { key: "Product Demand", blurb: "Searches naming your product or features.", queries: 52, impressions: 41200, growth: 9, risk: 0, action: "Keep product pages aligned with what users describe.", direction: "Positive" },
  { key: "Local Demand", blurb: "Local intent around your brand.", queries: 21, impressions: 9800, growth: 4, risk: 0, action: "Verify maps profile and store / branch pages.", direction: "Neutral" },
  { key: "Brand Discovery", blurb: "Users learning who you are.", queries: 47, impressions: 33100, growth: 18, risk: 1, action: "Strengthen owned About, story, and proof content.", direction: "Positive" },
  { key: "Platform Usage", blurb: "Navigational queries from existing users.", queries: 29, impressions: 28900, growth: 2, risk: 0, action: "Ensure login, help, and account pages rank.", direction: "Neutral" },
  { key: "Customer Friction", blurb: "Users hitting a problem.", queries: 18, impressions: 14600, growth: 22, risk: 3, action: "Publish help articles answering recurring problems.", direction: "Negative" },
  { key: "Brand Trust", blurb: "Trust, safety and reputation questions.", queries: 14, impressions: 18200, growth: 32, risk: 3, action: "Review what third-party pages say and create owned trust content.", direction: "Negative" },
  { key: "Competitive Pressure", blurb: "Brand vs alternatives.", queries: 11, impressions: 7400, growth: 14, risk: 2, action: "Create comparison and alternatives pages on your domain.", direction: "Negative" },
];

const QUERIES: Query[] = [
  {
    query: "brand reviews",
    category: "Brand Trust",
    direction: "Negative",
    impressions: 4200,
    growth: 28,
    opportunity: "High",
    risk: "High",
    operatorPresent: true,
    topExternal: "trustpilot.com",
    control: "Shared",
    action: "Improve review narrative",
    narrative: "Users are trying to validate whether they can trust the brand. Your site appears, but review and community platforms also rank prominently — the narrative is shared.",
    serp: [
      { position: 1, domain: "trustpilot.com", title: "Brand Reviews | Read Customer Reviews", type: "Review", ownership: "External", riskNote: "External review sentiment shapes verdict" },
      { position: 2, domain: "yourbrand.com", title: "Customer stories — Yourbrand", type: "Owned", ownership: "Owned" },
      { position: 3, domain: "reddit.com", title: "Has anyone used Yourbrand? : r/buying", type: "Community", ownership: "External", riskNote: "Unmoderated discussion" },
      { position: 4, domain: "g2.com", title: "Yourbrand Reviews 2026", type: "Review", ownership: "External" },
      { position: 5, domain: "youtube.com", title: "Yourbrand honest review", type: "Video", ownership: "External" },
    ],
  },
  {
    query: "brand reddit",
    category: "Brand Trust",
    direction: "Negative",
    impressions: 1800,
    growth: 41,
    opportunity: "Medium",
    risk: "High",
    operatorPresent: false,
    topExternal: "reddit.com",
    control: "Weak",
    action: "Monitor community discussion",
    narrative: "Users are deliberately looking for unfiltered opinions on Reddit. You do not appear on page 1 — the conversation is happening without you.",
    serp: [
      { position: 1, domain: "reddit.com", title: "Anyone else using Yourbrand? : r/saas", type: "Community", ownership: "External", riskNote: "Top result is community thread" },
      { position: 2, domain: "reddit.com", title: "Yourbrand vs Competitor : r/buying", type: "Community", ownership: "External" },
      { position: 3, domain: "reddit.com", title: "Yourbrand support experience", type: "Community", ownership: "External" },
    ],
  },
  {
    query: "brand alternatives",
    category: "Competitive Pressure",
    direction: "Negative",
    impressions: 1100,
    growth: 14,
    opportunity: "High",
    risk: "High",
    operatorPresent: false,
    topExternal: "competitor-a.com",
    control: "Weak",
    action: "Create comparison page",
    narrative: "Users are actively shopping for alternatives. Competitors and listicles own the page — you are absent from the consideration set.",
    serp: [
      { position: 1, domain: "competitor-a.com", title: "Why teams switch from Yourbrand", type: "Competitor", ownership: "Competitor", riskNote: "Competitor steering switch intent" },
      { position: 2, domain: "g2.com", title: "Best Yourbrand alternatives", type: "Review", ownership: "External" },
      { position: 3, domain: "competitor-b.com", title: "Yourbrand vs Competitor B", type: "Competitor", ownership: "Competitor" },
    ],
  },
  {
    query: "brand login",
    category: "Platform Usage",
    direction: "Neutral",
    impressions: 9800,
    growth: 3,
    opportunity: "Low",
    risk: "Low",
    operatorPresent: true,
    topExternal: "yourbrand.com",
    control: "Strong",
    action: "No action needed",
    narrative: "Healthy navigational demand. Your own domain owns the result and there are no high-risk external pages.",
    serp: [
      { position: 1, domain: "yourbrand.com", title: "Log in — Yourbrand", type: "Owned", ownership: "Owned" },
      { position: 2, domain: "yourbrand.com", title: "Forgot password — Yourbrand", type: "Owned", ownership: "Owned" },
    ],
  },
  {
    query: "brand pricing",
    category: "Buying Intent",
    direction: "Positive",
    impressions: 3400,
    growth: 11,
    opportunity: "Medium",
    risk: "Low",
    operatorPresent: true,
    topExternal: "g2.com",
    control: "Strong",
    action: "No action needed",
    narrative: "Owned pricing page ranks strongly. Maintain clarity and plan structure.",
    serp: [
      { position: 1, domain: "yourbrand.com", title: "Pricing — Yourbrand", type: "Owned", ownership: "Owned" },
      { position: 2, domain: "g2.com", title: "Yourbrand pricing — G2", type: "Review", ownership: "External" },
    ],
  },
  {
    query: "is brand legit",
    category: "Brand Trust",
    direction: "Negative",
    impressions: 740,
    growth: 56,
    opportunity: "High",
    risk: "Critical",
    operatorPresent: false,
    topExternal: "reddit.com",
    control: "Lost",
    action: "Create owned trust content",
    narrative: "High-risk trust query growing fast. You are not on page 1 — third-party verdicts are the only source of truth.",
    serp: [
      { position: 1, domain: "reddit.com", title: "Is Yourbrand legit? : r/scams", type: "Community", ownership: "External", riskNote: "Negative framing in title" },
      { position: 2, domain: "trustpilot.com", title: "Yourbrand reviews — Trustpilot", type: "Review", ownership: "External" },
      { position: 3, domain: "scamadviser.com", title: "Is yourbrand.com a scam?", type: "Other", ownership: "External", riskNote: "Trust-grading third party" },
    ],
  },
  {
    query: "brand instagram",
    category: "Brand Discovery",
    direction: "Positive",
    impressions: 2200,
    growth: 19,
    opportunity: "Medium",
    risk: "Medium",
    operatorPresent: true,
    topExternal: "instagram.com",
    control: "Shared",
    action: "Improve official Instagram",
    narrative: "Users validating the brand on social. Official Instagram appears — keep bio, link, and recent posts aligned.",
    serp: [
      { position: 1, domain: "instagram.com", title: "@yourbrand • Instagram", type: "Official social", ownership: "Official" },
      { position: 2, domain: "yourbrand.com", title: "Yourbrand — Home", type: "Owned", ownership: "Owned" },
    ],
  },
  {
    query: "brand support",
    category: "Customer Friction",
    direction: "Negative",
    impressions: 5100,
    growth: 24,
    opportunity: "High",
    risk: "Medium",
    operatorPresent: true,
    topExternal: "reddit.com",
    control: "Shared",
    action: "Publish help content",
    narrative: "Friction signal growing. Help center ranks, but community threads about support issues are also visible — answer recurring problems on owned pages.",
    serp: [
      { position: 1, domain: "yourbrand.com", title: "Help center — Yourbrand", type: "Owned", ownership: "Owned" },
      { position: 2, domain: "reddit.com", title: "Yourbrand support not responding", type: "Community", ownership: "External", riskNote: "Negative support thread" },
    ],
  },
];

// ── Page ────────────────────────────────────────────────────────────────────

function QuerySignalsPage() {
  const [openQuery, setOpenQuery] = useState<Query | null>(null);
  const [filterCategory, setFilterCategory] = useState<Category | "All">("All");
  const [filterControl, setFilterControl] = useState<SerpControl | "All">("All");
  const [filterRisk, setFilterRisk] = useState<RiskTier | "All">("All");
  const [search, setSearch] = useState("");

  const rows = useMemo(() => {
    return QUERIES.filter((q) => {
      if (filterCategory !== "All" && q.category !== filterCategory) return false;
      if (filterControl !== "All" && q.control !== filterControl) return false;
      if (filterRisk !== "All" && q.risk !== filterRisk) return false;
      if (search && !q.query.toLowerCase().includes(search.toLowerCase()) && !q.topExternal.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    }).sort((a, b) => {
      const riskOrder: Record<RiskTier, number> = { Critical: 0, High: 1, Medium: 2, Low: 3 };
      const ctrlOrder: Record<SerpControl, number> = { Lost: 0, Weak: 1, Shared: 2, Strong: 3 };
      if (riskOrder[a.risk] !== riskOrder[b.risk]) return riskOrder[a.risk] - riskOrder[b.risk];
      if (ctrlOrder[a.control] !== ctrlOrder[b.control]) return ctrlOrder[a.control] - ctrlOrder[b.control];
      return b.impressions - a.impressions;
    });
  }, [filterCategory, filterControl, filterRisk, search]);

  return (
    <div className="min-h-screen bg-background">
      <DashboardNav />
      <main className="lg:ml-56">
        <header className="border-b border-border bg-card/40">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4">
            <div>
              <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                Brand Authority
              </p>
              <h1 className="mt-0.5 text-xl font-semibold tracking-tight">
                Brand Demand Intelligence
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <Link
                to="/brand-authority"
                className="hidden rounded-md border border-border px-3 py-1.5 text-xs text-muted-foreground hover:bg-surface/60 hover:text-foreground md:inline-flex"
              >
                Back to Brand Authority
              </Link>
              <ThemeToggle />
            </div>
          </div>
        </header>

        <div className="mx-auto max-w-7xl space-y-6 px-6 py-6">
          {/* 1. Hero — Brand Demand Control */}
          <HeroCard />

          {/* 2. Action summary strip */}
          <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            <ActionCard
              tone="risk"
              icon={Shield}
              title="Protect reputation"
              body="3 trust-related queries are growing and Reddit appears on page 1 for 2 of them."
              cta="Review reputation actions"
            />
            <ActionCard
              tone="warn"
              icon={Sparkles}
              title="Strengthen owned results"
              body="Your site is missing from page 1 for 6 branded discovery queries."
              cta="Create owned content"
            />
            <ActionCard
              tone="warn"
              icon={Users}
              title="Control social narrative"
              body="Social and community platforms appear across 42% of your branded SERPs."
              cta="Review social platforms"
            />
            <ActionCard
              tone="risk"
              icon={Swords}
              title="Defend against competitors"
              body="Competitors appear on page 1 for 4 branded comparison queries."
              cta="Review competitor pressure"
            />
          </section>

          {/* 3. Brand SERP Ownership Map */}
          <OwnershipCard />

          {/* 4. External platforms */}
          <PlatformsCard />

          {/* 5. Recommended actions */}
          <section className="space-y-3">
            <div className="flex items-end justify-between">
              <div>
                <h2 className="text-lg font-semibold tracking-tight">Recommended actions</h2>
                <p className="text-sm text-muted-foreground">
                  Where your branded search results need an owner response.
                </p>
              </div>
            </div>
            <div className="grid gap-4 lg:grid-cols-3">
              {ACTIONS.map((a) => (
                <RecommendedAction key={a.id} {...a} />
              ))}
            </div>
          </section>

          {/* 6. Query category cards */}
          <section className="space-y-3">
            <div>
              <h2 className="text-lg font-semibold tracking-tight">Query categories</h2>
              <p className="text-sm text-muted-foreground">
                How branded demand splits across user intent.
              </p>
            </div>
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
              {CATEGORIES.map((c) => (
                <CategoryCard key={c.key} data={c} onClick={() => setFilterCategory(c.key)} />
              ))}
            </div>
          </section>

          {/* 7. Query detail table */}
          <section className="rounded-xl border border-border bg-card shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-5 py-4">
              <div>
                <h2 className="text-base font-semibold">Branded queries</h2>
                <p className="text-xs text-muted-foreground">
                  Sorted by risk, control weakness, then impressions.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <div className="relative">
                  <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search query or domain"
                    className="h-8 w-56 rounded-md border border-border bg-background pl-8 pr-2 text-xs outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
                <Select
                  value={filterCategory}
                  onChange={(v) => setFilterCategory(v as Category | "All")}
                  options={["All", ...CATEGORIES.map((c) => c.key)]}
                />
                <Select
                  value={filterControl}
                  onChange={(v) => setFilterControl(v as SerpControl | "All")}
                  options={["All", "Strong", "Shared", "Weak", "Lost"]}
                />
                <Select
                  value={filterRisk}
                  onChange={(v) => setFilterRisk(v as RiskTier | "All")}
                  options={["All", "Critical", "High", "Medium", "Low"]}
                />
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-surface/40 text-left text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                    <th className="px-4 py-2.5">Query</th>
                    <th className="px-3 py-2.5">Category</th>
                    <th className="px-3 py-2.5">Dir.</th>
                    <th className="px-3 py-2.5 text-right">Impr.</th>
                    <th className="px-3 py-2.5 text-right">Growth</th>
                    <th className="px-3 py-2.5">Risk</th>
                    <th className="px-3 py-2.5">You?</th>
                    <th className="px-3 py-2.5">Top external</th>
                    <th className="px-3 py-2.5">Control</th>
                    <th className="px-3 py-2.5">Action</th>
                    <th className="w-8 px-2 py-2.5" />
                  </tr>
                </thead>
                <tbody>
                  {rows.map((q) => (
                    <tr
                      key={q.query}
                      onClick={() => setOpenQuery(q)}
                      className="cursor-pointer border-b border-border/60 transition-colors hover:bg-surface/40"
                    >
                      <td className="px-4 py-3 font-medium">{q.query}</td>
                      <td className="px-3 py-3 text-xs text-muted-foreground">{q.category}</td>
                      <td className="px-3 py-3"><DirectionPill v={q.direction} /></td>
                      <td className="px-3 py-3 text-right font-mono tabular-nums">{q.impressions.toLocaleString()}</td>
                      <td className="px-3 py-3 text-right font-mono tabular-nums">
                        <span className={q.growth >= 0 ? "text-primary" : "text-destructive"}>
                          {q.growth >= 0 ? "+" : ""}{q.growth}%
                        </span>
                      </td>
                      <td className="px-3 py-3"><RiskPill v={q.risk} /></td>
                      <td className="px-3 py-3 text-xs">
                        {q.operatorPresent ? (
                          <span className="font-mono text-primary">Yes</span>
                        ) : (
                          <span className="font-mono text-destructive">No</span>
                        )}
                      </td>
                      <td className="px-3 py-3 font-mono text-xs text-muted-foreground">{q.topExternal}</td>
                      <td className="px-3 py-3"><ControlPill v={q.control} /></td>
                      <td className="px-3 py-3 text-xs text-foreground/90">{q.action}</td>
                      <td className="px-2 py-3 text-muted-foreground">
                        <ChevronRight className="h-4 w-4" />
                      </td>
                    </tr>
                  ))}
                  {rows.length === 0 && (
                    <tr>
                      <td colSpan={11} className="px-4 py-10 text-center text-sm text-muted-foreground">
                        No queries match these filters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </main>

      <QueryDrawer query={openQuery} onClose={() => setOpenQuery(null)} />
    </div>
  );
}

// ── Hero ────────────────────────────────────────────────────────────────────

function HeroCard() {
  return (
    <section className="rounded-xl border border-border bg-card p-6 shadow-sm">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-2xl">
          <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
            Brand Demand Control
          </p>
          <h2 className="mt-1 text-2xl font-semibold tracking-tight">
            See what people search about your brand, who appears, and where to act.
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            First-page search results shape how people decide on your brand. This view
            shows where you control the narrative, where others control it, and what
            to do next.
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-3 rounded-lg border border-primary/25 bg-primary/5 px-4 py-3">
          <ShieldCheck className="h-5 w-5 text-primary" />
          <div>
            <p className="text-[10px] font-mono uppercase tracking-wider text-primary">
              Narrative control score
            </p>
            <p className="font-mono text-3xl font-semibold leading-none tabular-nums text-primary">
              {HERO.narrativeControl}
              <span className="ml-1 text-sm text-muted-foreground">/100</span>
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-5">
        <HeroStat label="Branded queries analysed" value={HERO.totalQueries.toLocaleString()} />
        <HeroStat label="Positive demand share" value={`${HERO.positiveShare}%`} tone="good" delta="+4 pts" />
        <HeroStat label="Negative signals" value={String(HERO.negativeSignals)} tone="risk" delta="+3" />
        <HeroStat label="External domains competing" value={String(HERO.externalDomains)} delta="+6" />
        <HeroStat label="Owned page-1 share" value="52%" tone="good" delta="+2 pts" />
      </div>
    </section>
  );
}

function HeroStat({
  label,
  value,
  delta,
  tone = "neutral",
}: {
  label: string;
  value: string;
  delta?: string;
  tone?: "good" | "risk" | "neutral";
}) {
  const color = tone === "good" ? "text-primary" : tone === "risk" ? "text-destructive" : "text-muted-foreground";
  return (
    <div className="rounded-lg border border-border bg-surface/40 p-3">
      <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="mt-1 font-mono text-xl font-semibold tabular-nums">{value}</p>
      {delta && (
        <p className={`mt-0.5 font-mono text-[11px] ${color}`}>{delta}</p>
      )}
    </div>
  );
}

// ── Action strip ────────────────────────────────────────────────────────────

function ActionCard({
  tone,
  icon: Icon,
  title,
  body,
  cta,
}: {
  tone: "risk" | "warn" | "good";
  icon: typeof Shield;
  title: string;
  body: string;
  cta: string;
}) {
  const ring =
    tone === "risk"
      ? "border-destructive/30 bg-destructive/[0.04]"
      : tone === "warn"
        ? "border-border bg-surface/40"
        : "border-primary/25 bg-primary/[0.04]";
  const iconColor =
    tone === "risk" ? "text-destructive" : tone === "warn" ? "text-foreground" : "text-primary";
  return (
    <div className={`flex h-full flex-col rounded-xl border p-4 shadow-sm ${ring}`}>
      <div className="flex items-center gap-2">
        <Icon className={`h-4 w-4 ${iconColor}`} />
        <p className="text-sm font-semibold">{title}</p>
      </div>
      <p className="mt-2 flex-1 text-xs text-muted-foreground">{body}</p>
      <button className="mt-3 inline-flex items-center gap-1 self-start text-xs font-medium text-primary hover:underline">
        {cta}
        <ChevronRight className="h-3 w-3" />
      </button>
    </div>
  );
}

// ── Ownership map ───────────────────────────────────────────────────────────

function OwnershipCard() {
  const colorFor = (tone: (typeof OWNERSHIP)[number]["tone"]) =>
    tone === "good"
      ? "bg-primary"
      : tone === "risk"
        ? "bg-destructive/80"
        : tone === "warn"
          ? "bg-amber-500/80"
          : "bg-muted-foreground/60";
  return (
    <section className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
            SERP ownership map
          </p>
          <h2 className="text-base font-semibold">Who controls your branded search results?</h2>
        </div>
        <Eye className="h-4 w-4 text-muted-foreground" />
      </div>

      <div className="mt-5 h-3 w-full overflow-hidden rounded-md border border-border bg-surface">
        <div className="flex h-full w-full">
          {OWNERSHIP.map((s) => (
            <div
              key={s.key}
              className={`${colorFor(s.tone)} h-full`}
              style={{ width: `${s.pct}%` }}
              title={`${s.key}: ${s.pct}%`}
            />
          ))}
        </div>
      </div>

      <div className="mt-5 grid gap-2 md:grid-cols-2 xl:grid-cols-4">
        {OWNERSHIP.map((s) => (
          <div key={s.key} className="flex items-center justify-between rounded-lg border border-border bg-surface/40 px-3 py-2.5">
            <div className="flex items-center gap-2 min-w-0">
              <span className={`inline-block h-2.5 w-2.5 rounded-sm ${colorFor(s.tone)}`} />
              <div className="min-w-0">
                <p className="truncate text-xs font-medium">{s.key}</p>
                <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                  {s.count} results
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-mono text-sm font-semibold tabular-nums">{s.pct}%</p>
              <p className={`font-mono text-[10px] ${s.trend > 0 ? (s.tone === "risk" ? "text-destructive" : "text-primary") : s.trend < 0 ? "text-muted-foreground" : "text-muted-foreground"}`}>
                {s.trend > 0 ? `+${s.trend}` : s.trend} pts
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ── Platforms ───────────────────────────────────────────────────────────────

function PlatformsCard() {
  return (
    <section className="rounded-xl border border-border bg-card shadow-sm">
      <div className="flex items-start justify-between border-b border-border px-5 py-4">
        <div>
          <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
            Where your brand narrative lives
          </p>
          <h2 className="text-base font-semibold">External platforms appearing for your brand searches</h2>
        </div>
        <Globe className="h-4 w-4 text-muted-foreground" />
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-surface/40 text-left text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
              <th className="px-4 py-2.5">Platform / domain</th>
              <th className="px-3 py-2.5">Type</th>
              <th className="px-3 py-2.5 text-right">Queries</th>
              <th className="px-3 py-2.5 text-right">Avg pos.</th>
              <th className="px-3 py-2.5">Direction</th>
              <th className="px-3 py-2.5">Risk</th>
              <th className="px-3 py-2.5">Recommended action</th>
            </tr>
          </thead>
          <tbody>
            {PLATFORMS.map((p) => {
              const Icon = p.icon;
              return (
                <tr key={p.domain} className="border-b border-border/60 hover:bg-surface/40">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Icon className="h-3.5 w-3.5 text-muted-foreground" />
                      <span className="font-medium">{p.domain}</span>
                    </div>
                  </td>
                  <td className="px-3 py-3 text-xs text-muted-foreground">{p.type}</td>
                  <td className="px-3 py-3 text-right font-mono tabular-nums">{p.queries}</td>
                  <td className="px-3 py-3 text-right font-mono tabular-nums">{p.avgPos.toFixed(1)}</td>
                  <td className="px-3 py-3 text-xs">
                    {p.trend > 0 ? (
                      <span className="inline-flex items-center gap-1 text-destructive"><ArrowUpRight className="h-3 w-3" />+{p.trend}</span>
                    ) : p.trend < 0 ? (
                      <span className="inline-flex items-center gap-1 text-primary"><ArrowDownRight className="h-3 w-3" />{p.trend}</span>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </td>
                  <td className="px-3 py-3"><RiskPill v={p.risk} /></td>
                  <td className="px-3 py-3 text-xs text-foreground/90">{p.action}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}

// ── Recommended action ─────────────────────────────────────────────────────

function RecommendedAction({
  title,
  why,
  evidence,
  next,
  effort,
  confidence,
  impact,
  tone,
}: {
  title: string;
  why: string;
  evidence: string[];
  next: string;
  effort: string;
  confidence: string;
  impact: string;
  tone: "risk" | "warn" | "good";
}) {
  const accent =
    tone === "risk"
      ? "border-destructive/30"
      : tone === "warn"
        ? "border-border"
        : "border-primary/25";
  return (
    <div className={`flex h-full flex-col rounded-xl border bg-card p-5 shadow-sm ${accent}`}>
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-sm font-semibold">{title}</h3>
        <span className="rounded-md border border-border bg-surface/60 px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
          {impact}
        </span>
      </div>
      <p className="mt-2 text-xs text-muted-foreground">{why}</p>

      <div className="mt-3 rounded-lg border border-border bg-surface/40 p-3">
        <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Evidence</p>
        <ul className="mt-1.5 space-y-1 text-xs">
          {evidence.map((e) => (
            <li key={e} className="flex items-start gap-1.5">
              <span className="mt-1.5 inline-block h-1 w-1 rounded-full bg-muted-foreground/60" />
              <span>{e}</span>
            </li>
          ))}
        </ul>
      </div>

      <p className="mt-3 text-xs text-foreground/90"><span className="font-medium">Next step. </span>{next}</p>

      <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
        <div className="flex gap-3 text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
          <span>Effort: <span className="text-foreground">{effort}</span></span>
          <span>Conf: <span className="text-foreground">{confidence}</span></span>
        </div>
        <button className="inline-flex items-center gap-1 rounded-md bg-primary px-2.5 py-1 text-[11px] font-medium text-primary-foreground hover:opacity-90">
          Create action <ChevronRight className="h-3 w-3" />
        </button>
      </div>
    </div>
  );
}

// ── Category card ──────────────────────────────────────────────────────────

function CategoryCard(props: (typeof CATEGORIES)[number] & { onClick: () => void }) {
  const { key: title, blurb, queries, impressions, growth, risk, action, direction, onClick } = props;
  return (
    <button
      onClick={onClick}
      className="group flex h-full flex-col rounded-xl border border-border bg-card p-4 text-left shadow-sm transition-colors hover:border-primary/30"
    >
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-sm font-semibold">{title}</h3>
        <DirectionPill v={direction} />
      </div>
      <p className="mt-1 text-xs text-muted-foreground">{blurb}</p>
      <div className="mt-3 grid grid-cols-3 gap-2">
        <Mini label="Queries" v={queries.toString()} />
        <Mini label="Impressions" v={impressions.toLocaleString()} />
        <Mini label="Growth" v={`${growth > 0 ? "+" : ""}${growth}%`} tone={growth > 0 ? "good" : "neutral"} />
      </div>
      <p className="mt-3 text-[11px] text-muted-foreground">
        <span className="font-mono uppercase tracking-wider text-muted-foreground/80">High-risk domains</span>
        <span className="ml-1 font-mono tabular-nums text-foreground">{risk}</span>
      </p>
      <p className="mt-2 flex-1 text-xs text-foreground/90">{action}</p>
      <span className="mt-3 inline-flex items-center gap-1 text-[11px] font-medium text-primary">
        Open {title} queries
        <ChevronRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
      </span>
    </button>
  );
}

function Mini({ label, v, tone }: { label: string; v: string; tone?: "good" | "neutral" }) {
  return (
    <div className="rounded-md border border-border bg-surface/40 px-2 py-1.5">
      <p className="text-[9px] font-mono uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className={`font-mono text-xs font-semibold tabular-nums ${tone === "good" ? "text-primary" : ""}`}>{v}</p>
    </div>
  );
}

// ── Pills ──────────────────────────────────────────────────────────────────

function DirectionPill({ v }: { v: Direction }) {
  const cls =
    v === "Positive"
      ? "border-primary/25 bg-primary/10 text-primary"
      : v === "Negative"
        ? "border-destructive/30 bg-destructive/10 text-destructive"
        : "border-border bg-surface text-muted-foreground";
  return <span className={`inline-flex rounded-md border px-1.5 py-0.5 text-[10px] font-mono uppercase tracking-wider ${cls}`}>{v}</span>;
}

function RiskPill({ v }: { v: RiskTier }) {
  const cls =
    v === "Critical" || v === "High"
      ? "border-destructive/30 bg-destructive/10 text-destructive"
      : v === "Medium"
        ? "border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400"
        : "border-border bg-surface text-muted-foreground";
  return <span className={`inline-flex rounded-md border px-1.5 py-0.5 text-[10px] font-mono uppercase tracking-wider ${cls}`}>{v}</span>;
}

function ControlPill({ v }: { v: SerpControl }) {
  const cls =
    v === "Strong"
      ? "border-primary/25 bg-primary/10 text-primary"
      : v === "Shared"
        ? "border-border bg-surface text-foreground"
        : v === "Weak"
          ? "border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400"
          : "border-destructive/30 bg-destructive/10 text-destructive";
  return <span className={`inline-flex rounded-md border px-1.5 py-0.5 text-[10px] font-mono uppercase tracking-wider ${cls}`}>{v}</span>;
}

// ── Select ─────────────────────────────────────────────────────────────────

function Select({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="h-8 rounded-md border border-border bg-background px-2 text-xs outline-none focus:ring-2 focus:ring-ring"
    >
      {options.map((o) => (
        <option key={o} value={o}>{o}</option>
      ))}
    </select>
  );
}

// ── Drawer ─────────────────────────────────────────────────────────────────

function QueryDrawer({ query, onClose }: { query: Query | null; onClose: () => void }) {
  return (
    <Sheet open={!!query} onOpenChange={(open) => !open && onClose()}>
      <SheetContent side="right" className="w-full max-w-xl overflow-y-auto sm:max-w-xl">
        {query && (
          <>
            <SheetHeader>
              <div className="flex items-center justify-between">
                <SheetTitle className="text-base">{query.query}</SheetTitle>
                <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <span className="rounded-md border border-border bg-surface px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                  {query.category}
                </span>
                <DirectionPill v={query.direction} />
                <RiskPill v={query.risk} />
                <ControlPill v={query.control} />
              </div>
            </SheetHeader>

            <div className="mt-5 space-y-5">
              <div className="grid grid-cols-3 gap-2">
                <Mini label="Impressions" v={query.impressions.toLocaleString()} />
                <Mini label="Growth" v={`${query.growth > 0 ? "+" : ""}${query.growth}%`} tone={query.growth >= 0 ? "good" : "neutral"} />
                <Mini label="Opportunity" v={query.opportunity} />
              </div>

              <section>
                <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                  First-page search results
                </p>
                <ol className="mt-2 space-y-1.5">
                  {query.serp.map((r) => (
                    <li
                      key={`${r.position}-${r.domain}`}
                      className="flex items-start gap-3 rounded-lg border border-border bg-surface/40 p-3"
                    >
                      <span className="mt-0.5 font-mono text-xs font-semibold tabular-nums text-muted-foreground">
                        #{r.position}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="truncate text-sm font-medium">{r.domain}</span>
                          <OwnershipBadge v={r.ownership} />
                        </div>
                        <p className="truncate text-xs text-muted-foreground">{r.title}</p>
                        {r.riskNote && (
                          <p className="mt-1 inline-flex items-center gap-1 text-[11px] text-destructive">
                            <AlertTriangle className="h-3 w-3" /> {r.riskNote}
                          </p>
                        )}
                      </div>
                      <span className="rounded-md border border-border px-1.5 py-0.5 text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                        {r.type}
                      </span>
                    </li>
                  ))}
                </ol>
              </section>

              <section className="rounded-lg border border-border bg-surface/40 p-3">
                <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                  What this means
                </p>
                <p className="mt-1 text-sm text-foreground/90">{query.narrative}</p>
              </section>

              <section>
                <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                  Recommended actions
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {[
                    "Create owned content",
                    "Improve official social profile",
                    "Monitor community discussion",
                    "Review competitor pressure",
                    "Dismiss for now",
                  ].map((a, i) => (
                    <button
                      key={a}
                      className={`inline-flex items-center gap-1 rounded-md border px-2.5 py-1 text-xs ${
                        i === 0
                          ? "border-transparent bg-primary text-primary-foreground hover:opacity-90"
                          : "border-border bg-surface/40 text-foreground hover:bg-surface"
                      }`}
                    >
                      {a}
                      {i === 0 && <ChevronRight className="h-3 w-3" />}
                    </button>
                  ))}
                </div>
              </section>

              <p className="text-[11px] text-muted-foreground">
                <ExternalLink className="mr-1 inline h-3 w-3" />
                First-page search results shown for context only.
              </p>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}

function OwnershipBadge({ v }: { v: SerpResult["ownership"] }) {
  const cls =
    v === "Owned"
      ? "border-primary/25 bg-primary/10 text-primary"
      : v === "Official"
        ? "border-primary/20 bg-primary/5 text-primary"
        : v === "Competitor"
          ? "border-destructive/30 bg-destructive/10 text-destructive"
          : "border-border bg-surface text-muted-foreground";
  return <span className={`inline-flex rounded-md border px-1.5 py-0 text-[9px] font-mono uppercase tracking-wider ${cls}`}>{v}</span>;
}
