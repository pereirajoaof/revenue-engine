import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState, type ReactNode } from "react";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  CalendarClock,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Circle,
  Clock3,
  Copy,
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
  XCircle,
  Zap,
} from "lucide-react";
import { DashboardNav } from "@/components/dashboard/DashboardNav";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

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
    <TooltipProvider>
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
    </TooltipProvider>
  );
}

function CreateAuditDialog({ step, onStepChange }: { step: number; onStepChange: (step: number) => void }) {
  const steps = ["Scope", "Revenue link", "Crawl rules", "Schedule"];
  const isFinalStep = step === steps.length;

  return (
    <DialogContent className="max-h-[88vh] max-w-5xl overflow-y-auto border-border bg-background p-0 shadow-2xl">
      <div className="grid min-h-[680px] lg:grid-cols-[280px_1fr]">
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
          <div className="mt-8 space-y-3">
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
            {step === 1 && <ScopeStep />}
            {step === 2 && <RevenueLinkStep />}
            {step === 3 && <CrawlRulesStep />}
            {step === 4 && <ScheduleStep />}
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

function ScopeStep() {
  return (
    <div className="grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
      <div className="space-y-4">
        <FieldBlock label="Audit name"><Input defaultValue="Core Revenue Pages" /></FieldBlock>
        <FieldBlock label="Primary domain"><Input defaultValue="https://www.acme.com" /></FieldBlock>
        <FieldBlock label="Crawl scope">
          <div className="grid gap-3 sm:grid-cols-2">
            <ChoiceCard active icon={<Target className="h-4 w-4" />} title="Revenue pages" detail="Product, category, lead-gen, checkout support" />
            <ChoiceCard icon={<Search className="h-4 w-4" />} title="Whole site" detail="All discoverable indexable URLs" />
          </div>
        </FieldBlock>
        <FieldBlock label="Include paths"><Input defaultValue="/product/*, /category/*, /guides/*" /></FieldBlock>
        <FieldBlock label="Exclude paths"><Input defaultValue="/account/*, /cart, /search*" /></FieldBlock>
      </div>
      <AuditPreview title="Scope estimate" items={["18.4K URLs expected", "Revenue templates prioritised", "Canonical and indexability checks enabled", "JavaScript rendering on key paths"]} />
    </div>
  );
}

function RevenueLinkStep() {
  return (
    <div className="grid gap-5 lg:grid-cols-[0.95fr_1.05fr]">
      <ChoiceCard active icon={<ShieldCheck className="h-4 w-4" />} title="Connect to Revenue & Opportunities" detail="This will become the green-ticket audit that feeds the commercial dashboard." />
      <div className="grid gap-3 sm:grid-cols-2">
        <SignalCard label="Mapped ORP" value="£1.8M" detail="Pages monitored" />
        <SignalCard label="Risk weighting" value="High" detail="Issues affect money pages first" />
        <SignalCard label="Priority model" value="Impact × severity" detail="Ready for scoring" />
        <SignalCard label="Future output" value="Revenue gap" detail="Reserved for audit impact" />
      </div>
    </div>
  );
}

function CrawlRulesStep() {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <ChoiceCard active icon={<CheckCircle2 className="h-4 w-4" />} title="Indexability" detail="Robots, canonicals, noindex, status codes" />
      <ChoiceCard active icon={<Sparkles className="h-4 w-4" />} title="Rendering" detail="JS-rendered content and template parity" />
      <ChoiceCard active icon={<AlertTriangle className="h-4 w-4" />} title="Technical risk" detail="Redirect chains, broken links, duplicate patterns" />
      <ChoiceCard icon={<SlidersHorizontal className="h-4 w-4" />} title="Advanced limits" detail="Depth, URL caps, parameters, crawl speed" />
    </div>
  );
}

function ScheduleStep() {
  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_0.9fr]">
      <div className="grid gap-3 sm:grid-cols-2">
        <ChoiceCard active icon={<Zap className="h-4 w-4" />} title="Always-on" detail="Continuously monitors revenue-critical templates" />
        <ChoiceCard icon={<CalendarClock className="h-4 w-4" />} title="Weekly" detail="Scheduled crawl every Monday" />
        <ChoiceCard icon={<Clock3 className="h-4 w-4" />} title="Monthly" detail="Useful for stable surfaces" />
        <ChoiceCard icon={<Play className="h-4 w-4" />} title="Manual" detail="Run only when requested" />
      </div>
      <AuditPreview title="Ready to create" items={["Green ticket will mark this as revenue-linked", "First crawl starts immediately", "Details page opens after setup", "Trend and alerts slots remain reserved"]} />
    </div>
  );
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

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-md border ${className}`} aria-label={label}>
          <Icon className="h-4 w-4" />
        </div>
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  );
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
    <Tooltip>
      <TooltipTrigger asChild>
        <div className="w-[120px]">
          <div className="flex items-baseline gap-2">
            <span className={`font-mono text-2xl font-bold tabular-nums ${tone}`}>{score}</span>
            <span className="font-mono text-[10px] text-muted-foreground">/100</span>
          </div>
          <div className="mt-1 h-1.5 rounded-full bg-surface">
            <div className={`h-full rounded-full ${bar}`} style={{ width: `${score}%` }} />
          </div>
        </div>
      </TooltipTrigger>
      <TooltipContent>Composite score based on crawlability, indexability, and technical signals</TooltipContent>
    </Tooltip>
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
