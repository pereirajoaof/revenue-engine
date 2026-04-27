import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState, type ReactNode } from "react";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Bot,
  Camera,
  CalendarClock,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Circle,
  Clock3,
  Copy,
  FileCode2,
  Gauge,
  Globe2,
  Layers3,
  Link2,
  Map,
  MoreHorizontal,
  Play,
  Plus,
  Search,
  Settings2,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Target,
  Trash2,
  Upload,
  XCircle,
  Zap,
} from "lucide-react";
import { DashboardNav } from "@/components/dashboard/DashboardNav";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const Route = createFileRoute("/audit-runs")({
  component: AuditRunsPage,
  head: () => ({
    meta: [
      { title: "Audit Runs — OrganicOS" },
      {
        name: "description",
        content:
          "Manage revenue-driven website audit runs, technical health scores, schedules, and site diagnostics for OrganicOS.",
      },
      { property: "og:title", content: "Audit Runs — OrganicOS" },
      {
        property: "og:description",
        content:
          "The OrganicOS control center for audit configurations, health scores, automation, and future revenue impact analysis.",
      },
    ],
  }),
});

type AuditStatus = "Idle" | "Running" | "Completed" | "Failed";
type Frequency = "Manual" | "Weekly" | "Monthly" | "Always-on";
type DateRange = "Any" | "Last 7 days" | "Last 30 days" | "Next 7 days";
type UrlRange = "Any" | "Under 10k" | "10k–100k" | "100k+";
type HealthRange = "Any" | "80–100" | "50–79" | "0–49";

type AuditRun = {
  id: string;
  name: string;
  connectionState: "revenue-linked" | "standard" | "stopped";
  status: AuditStatus;
  healthScore: number;
  lastRun: string;
  nextRun: string;
  frequency: Frequency;
  urlsCrawled: number;
  revenueImpact: string;
  trend: number;
  alerts: number;
  scope: string;
};

const AUDIT_RUNS: AuditRun[] = [
  { id: "core-commerce", name: "Core Revenue Pages", connectionState: "revenue-linked", status: "Completed", healthScore: 91, lastRun: "Today · 08:42", nextRun: "Tomorrow · 08:00", frequency: "Always-on", urlsCrawled: 18432, revenueImpact: "£1.8M monitored", trend: 4, alerts: 2, scope: "Product, category, checkout support" },
  { id: "international", name: "International Expansion", connectionState: "standard", status: "Running", healthScore: 74, lastRun: "Running now", nextRun: "Continuous", frequency: "Always-on", urlsCrawled: 68240, revenueImpact: "£920K monitored", trend: -6, alerts: 11, scope: "UK, US, EU locale directories" },
  { id: "content-hubs", name: "Editorial Hubs", connectionState: "standard", status: "Completed", healthScore: 67, lastRun: "Yesterday · 21:16", nextRun: "Mon · 06:00", frequency: "Weekly", urlsCrawled: 12805, revenueImpact: "£410K monitored", trend: -3, alerts: 7, scope: "Guides, comparisons, intent hubs" },
  { id: "templates", name: "Template QA Sweep", connectionState: "standard", status: "Idle", healthScore: 83, lastRun: "Apr 24 · 04:12", nextRun: "Manual", frequency: "Manual", urlsCrawled: 4390, revenueImpact: "£260K monitored", trend: 1, alerts: 0, scope: "Route templates and indexable variants" },
  { id: "migration", name: "Post-Migration Guardrail", connectionState: "stopped", status: "Failed", healthScore: 38, lastRun: "Apr 23 · 01:04", nextRun: "Paused", frequency: "Weekly", urlsCrawled: 94512, revenueImpact: "£2.4M monitored", trend: -18, alerts: 29, scope: "Redirects, canonicals, indexability" },
  { id: "marketplace", name: "Marketplace Supply Pages", connectionState: "standard", status: "Completed", healthScore: 79, lastRun: "Apr 22 · 13:30", nextRun: "May 1 · 07:00", frequency: "Monthly", urlsCrawled: 27650, revenueImpact: "£740K monitored", trend: 8, alerts: 5, scope: "Location and provider landing pages" },
  { id: "brand", name: "Brand & Support Surface", connectionState: "standard", status: "Idle", healthScore: 88, lastRun: "Apr 18 · 10:00", nextRun: "May 18 · 10:00", frequency: "Monthly", urlsCrawled: 3240, revenueImpact: "£130K monitored", trend: 0, alerts: 1, scope: "Help, policies, branded search paths" },
];

const STATUS_OPTIONS: Array<"All" | AuditStatus> = ["All", "Idle", "Running", "Completed", "Failed"];
const FREQUENCY_OPTIONS: Array<"All" | Frequency> = ["All", "Manual", "Weekly", "Monthly", "Always-on"];
const HEALTH_OPTIONS: HealthRange[] = ["Any", "80–100", "50–79", "0–49"];
const DATE_OPTIONS: DateRange[] = ["Any", "Last 7 days", "Last 30 days", "Next 7 days"];
const URL_OPTIONS: UrlRange[] = ["Any", "Under 10k", "10k–100k", "100k+"];

function AuditRunsPage() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<(typeof STATUS_OPTIONS)[number]>("All");
  const [frequency, setFrequency] = useState<(typeof FREQUENCY_OPTIONS)[number]>("All");
  const [healthRange, setHealthRange] = useState<HealthRange>("Any");
  const [dateRange, setDateRange] = useState<DateRange>("Any");
  const [urlRange, setUrlRange] = useState<UrlRange>("Any");
  const [page, setPage] = useState(1);
  const [createAuditOpen, setCreateAuditOpen] = useState(false);
  const [createAuditStep, setCreateAuditStep] = useState(1);
  const pageSize = 5;

  const filteredRuns = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return AUDIT_RUNS.filter((run) => {
      const haystack = Object.values(run).join(" ").toLowerCase();
      const matchesSearch = !normalized || haystack.includes(normalized);
      const matchesStatus = status === "All" || run.status === status;
      const matchesFrequency = frequency === "All" || run.frequency === frequency;
      const matchesHealth = healthRange === "Any" || inHealthRange(run.healthScore, healthRange);
      const matchesUrls = urlRange === "Any" || inUrlRange(run.urlsCrawled, urlRange);
      const matchesDate = dateRange === "Any" || run.lastRun.includes("Today") || run.lastRun.includes("Yesterday") || run.nextRun.includes("May") || run.nextRun.includes("Tomorrow");
      return matchesSearch && matchesStatus && matchesFrequency && matchesHealth && matchesUrls && matchesDate;
    });
  }, [dateRange, frequency, healthRange, query, status, urlRange]);

  const pageCount = Math.max(1, Math.ceil(filteredRuns.length / pageSize));
  const visibleRuns = filteredRuns.slice((Math.min(page, pageCount) - 1) * pageSize, Math.min(page, pageCount) * pageSize);
  const activeRunning = AUDIT_RUNS.filter((run) => run.status === "Running").length;
  const averageHealth = Math.round(AUDIT_RUNS.reduce((sum, run) => sum + run.healthScore, 0) / AUDIT_RUNS.length);
  const monitoredUrls = AUDIT_RUNS.reduce((sum, run) => sum + run.urlsCrawled, 0);
  const criticalAlerts = AUDIT_RUNS.reduce((sum, run) => sum + run.alerts, 0);

  return (
    <div className="min-h-screen bg-background text-foreground">
        <DashboardNav />
        <div className="lg:pl-56">
          <header className="sticky top-0 z-30 border-b border-border bg-background/85 backdrop-blur">
            <div className="flex flex-col gap-4 px-6 py-5 lg:flex-row lg:items-center lg:justify-between lg:px-8">
              <div>
                <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Technical diagnostics · Revenue engine input</p>
                <h1 className="mt-1 text-2xl font-bold tracking-tight">Audit Runs</h1>
                <p className="mt-1 max-w-2xl text-sm text-muted-foreground">Control website snapshots that feed technical health, prioritisation, and revenue opportunity.</p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Dialog
                  open={createAuditOpen}
                  onOpenChange={(open) => {
                    setCreateAuditOpen(open);
                    if (!open) setCreateAuditStep(1);
                  }}
                >
                  <DialogTrigger asChild>
                    <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                      <Plus className="h-4 w-4" /> Create New Audit
                    </Button>
                  </DialogTrigger>
                  <CreateAuditDialog step={createAuditStep} onStepChange={setCreateAuditStep} />
                </Dialog>
                <ThemeToggle />
              </div>
            </div>
          </header>

          <main className="space-y-6 px-6 py-6 lg:px-8">
            <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <ControlKpi label="Active runs" value={String(activeRunning)} detail="System state" tone="primary" />
              <ControlKpi label="Avg health score" value={`${averageHealth}`} detail="Business risk proxy" tone={averageHealth >= 80 ? "primary" : "warning"} />
              <ControlKpi label="URLs audited" value={formatNumber(monitoredUrls)} detail="Scale monitored" tone="neutral" />
              <ControlKpi label="Critical alerts" value={String(criticalAlerts)} detail="Needs triage" tone="danger" />
            </section>

            <section className="rounded-xl border border-border bg-card shadow-sm">
              <div className="border-b border-border p-4 lg:p-5">
                <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                  <div>
                    <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Audit configurations</p>
                    <h2 className="mt-1 text-lg font-semibold">Site health control panel</h2>
                  </div>
                  <div className="relative w-full xl:w-[340px]">
                    <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input value={query} onChange={(event) => { setQuery(event.target.value); setPage(1); }} placeholder="Search audits, status, frequency…" className="pl-9" />
                  </div>
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
                  <FilterSelect label="Status" value={status} options={STATUS_OPTIONS} onChange={(value) => { setStatus(value as typeof status); setPage(1); }} />
                  <FilterSelect label="Health score" value={healthRange} options={HEALTH_OPTIONS} onChange={(value) => { setHealthRange(value as HealthRange); setPage(1); }} />
                  <FilterSelect label="Frequency" value={frequency} options={FREQUENCY_OPTIONS} onChange={(value) => { setFrequency(value as typeof frequency); setPage(1); }} />
                  <FilterSelect label="Date range" value={dateRange} options={DATE_OPTIONS} onChange={(value) => { setDateRange(value as DateRange); setPage(1); }} />
                  <FilterSelect label="URLs crawled" value={urlRange} options={URL_OPTIONS} onChange={(value) => { setUrlRange(value as UrlRange); setPage(1); }} />
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[1180px] border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-border bg-surface/40 text-left text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                      <th className="px-5 py-3 font-medium">Audit Name</th>
                      <th className="px-5 py-3 font-medium">Status</th>
                      <th className="px-5 py-3 font-medium">Health Score</th>
                      <th className="px-5 py-3 font-medium">Last Run</th>
                      <th className="px-5 py-3 font-medium">Next Run</th>
                      <th className="px-5 py-3 font-medium">Frequency</th>
                      <th className="px-5 py-3 text-right font-medium">URLs Crawled</th>
                      <th className="px-5 py-3 font-medium">Future signals</th>
                      <th className="px-5 py-3 text-right font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {visibleRuns.map((run) => (
                      <AuditRow key={run.id} run={run} />
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex flex-col gap-3 border-t border-border px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <SlidersHorizontal className="h-3.5 w-3.5" />
                  <span>{filteredRuns.length} configurations · details view reserved for audit history and issue drill-down</span>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => setPage((value) => Math.max(1, value - 1))} disabled={page <= 1}>
                    <ChevronLeft className="h-4 w-4" /> Previous
                  </Button>
                  <span className="font-mono text-xs tabular-nums text-muted-foreground">{Math.min(page, pageCount)} / {pageCount}</span>
                  <Button variant="outline" size="sm" onClick={() => setPage((value) => Math.min(pageCount, value + 1))} disabled={page >= pageCount}>
                    Next <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </section>
          </main>
        </div>
    </div>
  );
}

function CreateAuditDialog({ step, onStepChange }: { step: number; onStepChange: (step: number) => void }) {
  const steps = ["Basics", "Mode", "Entry points", "Scope rules", "Behaviour", "Limits", "Discovery", "Page types"];
  const isFinalStep = step === steps.length;

  return (
    <DialogContent className="max-h-[88vh] max-w-5xl overflow-y-auto border-border bg-background p-0 shadow-2xl">
      <div className="grid min-h-[720px] lg:grid-cols-[300px_1fr]">
        <aside className="border-b border-border bg-surface/55 p-6 lg:border-b-0 lg:border-r">
          <div className="inline-flex h-11 w-11 items-center justify-center rounded-md border border-primary/25 bg-primary/10 text-primary shadow-[0_0_24px_var(--glow)]">
            <Zap className="h-5 w-5" />
          </div>
          <DialogHeader className="mt-6 text-left">
            <DialogTitle className="text-2xl font-bold tracking-tight">Create New Audit</DialogTitle>
            <DialogDescription>
              Configure a technical crawl that can feed health scoring, prioritisation, and revenue opportunity.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-8 space-y-2">
            {steps.map((label, index) => {
              const itemStep = index + 1;
              const active = itemStep === step;
              const complete = itemStep < step;
              return (
                <button
                  key={label}
                  type="button"
                  onClick={() => onStepChange(itemStep)}
                  className={`flex w-full items-center gap-3 rounded-md border px-3 py-3 text-left transition-colors ${
                    active
                      ? "border-primary/30 bg-primary/10 text-foreground"
                      : complete
                        ? "border-border bg-background text-foreground"
                        : "border-transparent text-muted-foreground hover:bg-background"
                  }`}
                >
                  <span className={`flex h-7 w-7 items-center justify-center rounded-md border font-mono text-xs ${active || complete ? "border-primary/25 text-primary" : "border-border"}`}>
                    {complete ? <CheckCircle2 className="h-3.5 w-3.5" /> : itemStep}
                  </span>
                  <span className="text-sm font-medium">{label}</span>
                </button>
              );
            })}
          </div>
        </aside>

        <div className="flex flex-col">
          <div className="border-b border-border p-6">
            <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Step {step} of {steps.length}</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight">{steps[step - 1]}</h2>
          </div>
          <div className="flex-1 p-6">
            {step === 1 && <ProjectBasicsStep />}
            {step === 2 && <CrawlModeStep />}
            {step === 3 && <EntryPointsStep />}
            {step === 4 && <ScopeRulesStep />}
            {step === 5 && <BehaviourStep />}
            {step === 6 && <LimitsStep />}
            {step === 7 && <DiscoveryStep />}
            {step === 8 && <PageTypeMappingStep />}
          </div>
          <div className="flex items-center justify-between border-t border-border p-6">
            <Button variant="outline" disabled={step === 1} onClick={() => onStepChange(Math.max(1, step - 1))}>
              <ArrowLeft className="h-4 w-4" /> Back
            </Button>
            <Button onClick={() => onStepChange(isFinalStep ? 1 : Math.min(steps.length, step + 1))}>
              {isFinalStep ? "Create audit" : "Continue"} {!isFinalStep && <ArrowRight className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </div>
    </DialogContent>
  );
}

function ProjectBasicsStep() {
  return (
    <div className="grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
      <div className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <FieldBlock label="Project name"><Input defaultValue="Core Revenue Pages" /></FieldBlock>
          <FieldBlock label="Industry"><Input defaultValue="Retail ecommerce" /></FieldBlock>
        </div>
        <FieldBlock label="Root domain"><Input defaultValue="acme.com" /></FieldBlock>
        <div className="grid gap-3 sm:grid-cols-2">
          <ToggleRow label="Crawl subdomains" detail="Include shop, support, and locale hosts" checked />
          <ToggleRow label="Crawl HTTP + HTTPS" detail="Catch protocol conflicts and redirects" checked />
        </div>
      </div>
      <AuditPreview title="Project identity" items={["Benchmarking will use the selected industry", "Root domain controls host-level discovery", "Subdomain scope is explicit before crawl starts", "Protocol checks expose migration and redirect risk"]} />
    </div>
  );
}

function CrawlModeStep() {
  return (
    <div className="max-w-2xl space-y-3">
      <ChoiceCard icon={<Camera className="h-4 w-4" />} title="One-time snapshot" detail="Run once for migration checks, releases, or technical baselines" />
      <ChoiceCard active icon={<CalendarClock className="h-4 w-4" />} title="Scheduled audit" detail="Weekly or monthly diagnostics for stable sections" />
      <ChoiceCard icon={<Zap className="h-4 w-4" />} title="Always-on crawl" detail="Continuous low-frequency monitoring of revenue-critical surfaces" />
      <ToggleRow label="Prioritise high-value pages" detail="Revenue pages and top-traffic URLs crawl first" checked />
    </div>
  );
}

function EntryPointsStep() {
  return (
    <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="space-y-4">
        <FieldBlock label="Start URL"><Input defaultValue="https://www.acme.com/" /></FieldBlock>
        <FieldBlock label="Detected sitemaps">
          <div className="space-y-2">
            <CheckRow label="/sitemap.xml" detail="42,680 URLs" checked />
            <CheckRow label="/product-sitemap.xml" detail="12,400 URLs" checked />
            <CheckRow label="/blog-sitemap.xml" detail="860 URLs" />
          </div>
        </FieldBlock>
        <div className="grid gap-3 sm:grid-cols-2">
          <ChoiceCard active icon={<Bot className="h-4 w-4" />} title="Auto-detect" detail="Read robots.txt and sitemap index files" />
          <ChoiceCard icon={<Upload className="h-4 w-4" />} title="Upload sitemap" detail="XML, TXT, or GZIP source file" />
        </div>
        <FieldBlock label="Custom sitemap URL"><Input placeholder="https://www.acme.com/custom-sitemap.xml" /></FieldBlock>
      </div>
      <AuditPreview title="Entry strategy" items={["Start URL anchors HTML discovery", "Detected sitemaps can be selected or removed", "Custom sitemap supports special inventories", "New sitemap discovery stays enabled"]} />
    </div>
  );
}

function ScopeRulesStep() {
  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_0.9fr]">
      <div className="space-y-5">
        <RuleBuilder title="Include rules" rules={["Path contains /product/", "Path contains /category/", "Regex ^/routes/[a-z0-9-]+"]} />
        <RuleBuilder title="Exclude rules" rules={["Path contains /account/", "Exact match /cart", "Regex /search\\?.*"]} />
      </div>
      <AuditPreview title="Garbage prevention" items={["Rules support path contains, exact match, and regex", "Revenue templates stay inside scope", "Internal search and account areas are excluded", "Advanced rules remain visible but controlled"]} />
    </div>
  );
}

function BehaviourStep() {
  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_0.9fr]">
      <div className="space-y-5">
        <FieldBlock label="JavaScript rendering">
          <div className="grid gap-3 sm:grid-cols-2"><ChoiceCard icon={<Zap className="h-4 w-4" />} title="Off" detail="Fast crawl for static HTML and known templates" /><ChoiceCard active icon={<Sparkles className="h-4 w-4" />} title="On" detail="Headless rendering for modern pages and parity checks" /></div>
        </FieldBlock>
        <FieldBlock label="User agent"><select className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm"><option>Googlebot Smartphone</option><option>Googlebot Desktop</option><option>Custom UA</option></select></FieldBlock>
        <div className="grid gap-3 sm:grid-cols-2"><ToggleRow label="Respect robots.txt" detail="Default safe crawler behaviour" checked /><ToggleRow label="Follow redirects" detail="Trace chains and final destinations" checked /><ToggleRow label="Follow pagination" detail="Discover paginated inventory" checked /><ToggleRow label="Follow hreflang" detail="Validate international alternates" checked /><ToggleRow label="Follow nofollow links" detail="Advanced discovery mode" /><ToggleRow label="Ignore robots.txt" detail="Advanced warning state" /></div>
      </div>
      <AuditPreview title="Crawler behaviour" items={["Googlebot Smartphone is the default identity", "Robots handling is safe by default", "Redirect, pagination, and hreflang discovery are enabled", "Nofollow discovery remains off unless explicitly enabled"]} />
    </div>
  );
}

function LimitsStep() {
  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_0.9fr]">
      <div className="grid gap-4 sm:grid-cols-2">
        <FieldBlock label="Max URLs"><Input defaultValue="50000" /></FieldBlock>
        <FieldBlock label="Max crawl depth"><Input defaultValue="6" /></FieldBlock>
        <FieldBlock label="Requests / second"><Input defaultValue="8" /></FieldBlock>
        <FieldBlock label="Concurrent threads"><Input defaultValue="4" /></FieldBlock>
        <ChoiceCard active icon={<Gauge className="h-4 w-4" />} title="Peak hours slow" detail="Reduce pressure during trading hours" />
        <ChoiceCard icon={<Zap className="h-4 w-4" />} title="Off-peak faster" detail="Increase throughput when demand is lower" />
      </div>
      <AuditPreview title="Performance control" items={["URL caps prevent runaway crawls", "Depth limits keep discovery commercially relevant", "Throttling protects production infrastructure", "Time-based rules are ready for enterprise scheduling"]} />
    </div>
  );
}

function DiscoveryStep() {
  return (
    <div className="grid gap-5 lg:grid-cols-[0.95fr_1.05fr]">
      <div className="grid gap-3"><CheckRow label="Start URL" detail="Crawl links from the configured entry page" checked /><CheckRow label="Sitemaps" detail="Use selected detected and custom sitemap sources" checked /><ToggleRow label="Discover new sitemaps automatically" detail="Keep sitemap inventory fresh between runs" checked /></div>
      <div className="grid gap-3 sm:grid-cols-2"><SignalCard label="Sources" value="2" detail="Start URL + sitemaps" /><SignalCard label="Expected URLs" value="50K" detail="Capped by limits" /><SignalCard label="New sitemap alerts" value="On" detail="Future alert slot" /><SignalCard label="Discovery bias" value="Value" detail="High-value pages first" /></div>
    </div>
  );
}

function PageTypeMappingStep() {
  return (
    <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="space-y-3">
        <MappingRow pattern="/routes/" pageType="Route pages" revenue="£520K ORP" />
        <MappingRow pattern="/product/" pageType="Product pages" revenue="£840K ORP" />
        <MappingRow pattern="/category/" pageType="Category pages" revenue="£390K ORP" />
        <MappingRow pattern="/blog/" pageType="Blog" revenue="£140K ORP" />
      </div>
      <AuditPreview title="OrganicOS integration" items={["URL patterns map technical issues to page types", "Page types connect crawl findings to the revenue model", "This audit can become the green-ticket dashboard source", "Future output: Technical Health → Revenue Opportunity"]} />
    </div>
  );
}

function ToggleRow({ label, detail, checked = false }: { label: string; detail: string; checked?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-border bg-card p-4">
      <span><span className="block text-sm font-semibold text-foreground">{label}</span><span className="mt-1 block text-xs leading-relaxed text-muted-foreground">{detail}</span></span>
      <Switch defaultChecked={checked} />
    </div>
  );
}

function CheckRow({ label, detail, checked = false }: { label: string; detail: string; checked?: boolean }) {
  return (
    <label className="flex items-center gap-3 rounded-xl border border-border bg-card p-4">
      <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border ${checked ? "border-primary bg-primary text-primary-foreground" : "border-border"}`}>{checked && <CheckCircle2 className="h-3.5 w-3.5" />}</span>
      <span><span className="block text-sm font-semibold text-foreground">{label}</span><span className="mt-1 block text-xs text-muted-foreground">{detail}</span></span>
    </label>
  );
}

function RuleBuilder({ title, rules }: { title: string; rules: string[] }) {
  return <div className="rounded-xl border border-border bg-card p-4"><p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">{title}</p><div className="mt-3 space-y-2">{rules.map((rule) => <div key={rule} className="flex items-center gap-2 rounded-md border border-border bg-surface/55 px-3 py-2 text-sm text-muted-foreground"><FileCode2 className="h-3.5 w-3.5 text-primary" />{rule}</div>)}</div><Button variant="outline" size="sm" className="mt-3"><Plus className="h-3.5 w-3.5" /> Add rule</Button></div>;
}

function MappingRow({ pattern, pageType, revenue }: { pattern: string; pageType: string; revenue: string }) {
  return <div className="grid gap-3 rounded-xl border border-border bg-card p-4 sm:grid-cols-[1fr_1fr_auto] sm:items-center"><span className="font-mono text-sm text-foreground">{pattern}</span><span className="inline-flex items-center gap-2 text-sm text-muted-foreground"><Layers3 className="h-4 w-4 text-primary" />{pageType}</span><span className="font-mono text-xs text-primary">{revenue}</span></div>;
}

function FieldBlock({ label, children }: { label: string; children: ReactNode }) {
  return <label className="block space-y-2"><span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">{label}</span>{children}</label>;
}

function ChoiceCard({ active = false, icon, title, detail }: { active?: boolean; icon: ReactNode; title: string; detail: string }) {
  return <button type="button" className={`min-h-[116px] rounded-xl border p-4 text-left transition-colors ${active ? "border-primary/35 bg-primary/10" : "border-border bg-card hover:bg-surface/60"}`}><span className={`inline-flex h-9 w-9 items-center justify-center rounded-md border ${active ? "border-primary/25 text-primary" : "border-border text-muted-foreground"}`}>{icon}</span><span className="mt-4 block font-semibold text-foreground">{title}</span><span className="mt-1 block text-sm leading-relaxed text-muted-foreground">{detail}</span></button>;
}

function SignalCard({ label, value, detail }: { label: string; value: string; detail: string }) {
  return <div className="rounded-xl border border-border bg-card p-5"><p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">{label}</p><p className="mt-3 font-mono text-3xl font-bold text-primary">{value}</p><p className="mt-2 text-sm text-muted-foreground">{detail}</p></div>;
}

function AuditPreview({ title, items }: { title: string; items: string[] }) {
  return <div className="rounded-xl border border-border bg-surface/55 p-5"><p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">{title}</p><div className="mt-5 space-y-3">{items.map((item) => <div key={item} className="flex items-start gap-3 text-sm"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" /><span className="text-muted-foreground">{item}</span></div>)}</div></div>;
}

function AuditRow({ run }: { run: AuditRun }) {
  return (
    <tr className="group cursor-pointer border-b border-border transition-colors hover:bg-surface/45" onClick={() => undefined}>
      <td className="px-5 py-4">
        <div className="flex items-start gap-3">
          <AuditConnectionMarker state={run.connectionState} />
          <div className="min-w-0">
            <p className="font-medium text-foreground">{run.name}</p>
            <p className="mt-1 max-w-[260px] truncate text-xs text-muted-foreground">{run.scope}</p>
          </div>
        </div>
      </td>
      <td className="px-5 py-4"><StatusBadge status={run.status} /></td>
      <td className="px-5 py-4"><HealthScore score={run.healthScore} /></td>
      <td className="px-5 py-4"><TimeCell value={run.lastRun} icon={<Clock3 className="h-3.5 w-3.5" />} /></td>
      <td className="px-5 py-4"><TimeCell value={run.nextRun} icon={<CalendarClock className="h-3.5 w-3.5" />} /></td>
      <td className="px-5 py-4"><FrequencyBadge frequency={run.frequency} /></td>
      <td className="px-5 py-4 text-right font-mono text-sm tabular-nums">{formatNumber(run.urlsCrawled)}</td>
      <td className="px-5 py-4">
        <div className="flex flex-col gap-1 text-xs">
          <span className="font-mono text-foreground">{run.revenueImpact}</span>
          <span className="text-muted-foreground">Trend {run.trend > 0 ? "+" : ""}{run.trend}% · {run.alerts} alerts</span>
        </div>
      </td>
      <td className="px-5 py-4 text-right" onClick={(event) => event.stopPropagation()}>
        <AuditActions />
      </td>
    </tr>
  );
}

function AuditConnectionMarker({ state }: { state: AuditRun["connectionState"] }) {
  const isRevenueLinked = state === "revenue-linked";
  const isStopped = state === "stopped";
  const label = isRevenueLinked
    ? "Connected to Revenue & Opportunities"
    : isStopped
      ? "Stopped and will not run again"
      : "Audit configuration";
  const className = isRevenueLinked
    ? "border-primary/25 bg-primary/10 text-primary shadow-[0_0_18px_var(--glow)]"
    : isStopped
      ? "border-destructive/25 bg-destructive/10 text-destructive"
      : "border-chart-3/25 bg-chart-3/10 text-chart-3";
  const Icon = isStopped ? XCircle : ShieldCheck;

  return <div className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-md border ${className}`} aria-label={label} title={label}><Icon className="h-4 w-4" /></div>;
}

function AuditActions() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Open audit actions">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-52">
        <DropdownMenuItem><Play className="h-4 w-4" /> Run now</DropdownMenuItem>
        <DropdownMenuItem><Clock3 className="h-4 w-4" /> View run history</DropdownMenuItem>
        <DropdownMenuItem><CalendarClock className="h-4 w-4" /> Edit schedule</DropdownMenuItem>
        <DropdownMenuItem><XCircle className="h-4 w-4" /> Remove schedule</DropdownMenuItem>
        <DropdownMenuItem><Settings2 className="h-4 w-4" /> Edit settings</DropdownMenuItem>
        <DropdownMenuItem><Copy className="h-4 w-4" /> Clone configuration</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-destructive focus:text-destructive"><Trash2 className="h-4 w-4" /> Delete configuration</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function StatusBadge({ status }: { status: AuditStatus }) {
  const Icon = status === "Completed" ? CheckCircle2 : status === "Failed" ? AlertTriangle : status === "Running" ? Circle : Clock3;
  const className = status === "Completed"
    ? "border-primary/25 bg-primary/10 text-primary"
    : status === "Failed"
      ? "border-destructive/25 bg-destructive/10 text-destructive"
      : status === "Running"
        ? "border-primary/25 bg-primary/10 text-primary"
        : "border-border bg-surface text-muted-foreground";
  return (
    <span className={`inline-flex items-center gap-2 rounded-md border px-2.5 py-1 text-xs font-medium ${className}`}>
      {status === "Running" ? <span className="h-2 w-2 rounded-full bg-primary animate-pulse" /> : <Icon className="h-3.5 w-3.5" />}
      {status}
    </span>
  );
}

function HealthScore({ score }: { score: number }) {
  const tone = score >= 80 ? "text-primary" : score >= 50 ? "text-chart-3" : "text-destructive";
  const bar = score >= 80 ? "bg-primary" : score >= 50 ? "bg-chart-3" : "bg-destructive";
  return (
    <div className="w-[120px]" title="Composite score based on crawlability, indexability, and technical signals">
      <div className="flex items-baseline gap-2">
        <span className={`font-mono text-2xl font-bold tabular-nums ${tone}`}>{score}</span>
        <span className="font-mono text-[10px] text-muted-foreground">/100</span>
      </div>
      <div className="mt-1 h-1.5 rounded-full bg-surface">
        <div className={`h-full rounded-full ${bar}`} style={{ width: `${score}%` }} />
      </div>
    </div>
  );
}

function TimeCell({ value, icon }: { value: string; icon: React.ReactNode }) {
  return <span className="inline-flex items-center gap-2 whitespace-nowrap text-xs text-muted-foreground">{icon}<span>{value}</span></span>;
}

function FrequencyBadge({ frequency }: { frequency: Frequency }) {
  const highlighted = frequency === "Always-on";
  return <span className={`inline-flex whitespace-nowrap rounded-md border px-2.5 py-1 text-xs font-medium ${highlighted ? "border-primary/25 bg-primary/10 text-primary" : "border-border bg-surface text-muted-foreground"}`}>{frequency}</span>;
}

function ControlKpi({ label, value, detail, tone }: { label: string; value: string; detail: string; tone: "primary" | "warning" | "danger" | "neutral" }) {
  const toneClass = tone === "primary" ? "text-primary" : tone === "warning" ? "text-chart-3" : tone === "danger" ? "text-destructive" : "text-foreground";
  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className={`mt-3 font-mono text-3xl font-bold tabular-nums ${toneClass}`}>{value}</p>
      <p className="mt-2 text-sm text-muted-foreground">{detail}</p>
    </div>
  );
}

function FilterSelect({ label, value, options, onChange }: { label: string; value: string; options: readonly string[]; onChange: (value: string) => void }) {
  return (
    <label className="space-y-1.5">
      <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">{label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value)} className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm shadow-sm outline-none transition-colors focus:ring-1 focus:ring-ring">
        {options.map((option) => <option key={option} value={option}>{option}</option>)}
      </select>
    </label>
  );
}

function inHealthRange(score: number, range: HealthRange) {
  if (range === "80–100") return score >= 80;
  if (range === "50–79") return score >= 50 && score < 80;
  if (range === "0–49") return score < 50;
  return true;
}

function inUrlRange(urls: number, range: UrlRange) {
  if (range === "Under 10k") return urls < 10000;
  if (range === "10k–100k") return urls >= 10000 && urls < 100000;
  if (range === "100k+") return urls >= 100000;
  return true;
}

function formatNumber(value: number) {
  return new Intl.NumberFormat("en-GB").format(value);
}
