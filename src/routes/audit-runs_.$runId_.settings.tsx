import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState, type ReactNode } from "react";
import {
  AlertTriangle,
  ArrowLeft,
  CalendarClock,
  CheckCircle2,
  ExternalLink,
  FileCode2,
  Gauge,
  Globe2,
  History,
  Layers3,
  Plus,
  Save,
  Settings2,
  Trash2,
  X,
} from "lucide-react";
import { DashboardNav } from "@/components/dashboard/DashboardNav";
import { ThemeToggle } from "@/components/ThemeToggle";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const Route = createFileRoute("/audit-runs_/$runId_/settings")({
  component: AuditSettingsRoute,
  head: () => ({
    meta: [
      { title: "Audit Settings — OrganicOS" },
      { name: "description", content: "Configure audit crawl rules, rendering behaviour, scheduling, limits, and crawl history in OrganicOS." },
      { property: "og:title", content: "Audit Settings — OrganicOS" },
      { property: "og:description", content: "Manage individual audit configuration, crawl settings, and historical crawl runs." },
    ],
  }),
});

type Frequency = "Manual" | "Weekly" | "Monthly" | "Always-on";
type AuditType = "Revenue" | "Manual";

type AuditConfig = {
  id: string;
  name: string;
  type: AuditType;
  startUrl: string;
  createdDate: string;
  frequency: Frequency;
  includeRules: string[];
  excludeRules: string[];
  javascriptRendering: boolean;
  respectRobots: boolean;
  maxUrls: number;
  maxDepth: number;
  requestsPerSecond: number;
  concurrentThreads: number;
};

const AUDIT_CONFIGS: AuditConfig[] = [
  {
    id: "core-commerce",
    name: "Core Revenue Pages",
    type: "Revenue",
    startUrl: "https://www.busbud.com/en",
    createdDate: "Apr 12, 2026 · 09:24",
    frequency: "Always-on",
    includeRules: ["/en/bus-tickets/*", "/en/train/*", "/en/city/*", "/en/operator/*"],
    excludeRules: ["?sort=*", "?utm_*", "/account/*", "/checkout/*"],
    javascriptRendering: true,
    respectRobots: true,
    maxUrls: 50000,
    maxDepth: 5,
    requestsPerSecond: 8,
    concurrentThreads: 12,
  },
  {
    id: "templates",
    name: "Template QA Sweep",
    type: "Manual",
    startUrl: "https://www.busbud.com/en/sitemap.xml",
    createdDate: "Mar 28, 2026 · 14:10",
    frequency: "Manual",
    includeRules: ["/en/routes/*", "/en/stops/*"],
    excludeRules: ["?date=*", "?passengers=*"],
    javascriptRendering: false,
    respectRobots: true,
    maxUrls: 10000,
    maxDepth: 4,
    requestsPerSecond: 5,
    concurrentThreads: 6,
  },
];

const DEFAULT_CONFIG: AuditConfig = {
  id: "content-hubs",
  name: "Editorial Hubs",
  type: "Manual",
  startUrl: "https://www.busbud.com/blog",
  createdDate: "Apr 02, 2026 · 11:36",
  frequency: "Weekly",
  includeRules: ["/blog/*", "/en/guides/*", "/en/comparisons/*"],
  excludeRules: ["/blog/tag/*", "?preview=*"],
  javascriptRendering: true,
  respectRobots: true,
  maxUrls: 25000,
  maxDepth: 6,
  requestsPerSecond: 6,
  concurrentThreads: 8,
};

const CRAWL_RUNS = [
  { id: "crawl-2026-04-28", date: "Apr 28, 2026 · 08:42", status: "Completed", healthScore: 91, urlsCrawled: 18432 },
  { id: "crawl-2026-04-25", date: "Apr 25, 2026 · 08:01", status: "Completed", healthScore: 86, urlsCrawled: 18109 },
  { id: "crawl-2026-04-18", date: "Apr 18, 2026 · 08:03", status: "Completed", healthScore: 79, urlsCrawled: 17688 },
  { id: "crawl-2026-04-11", date: "Apr 11, 2026 · 08:05", status: "Completed", healthScore: 81, urlsCrawled: 17204 },
  { id: "crawl-2026-04-04", date: "Apr 04, 2026 · 08:00", status: "Failed", healthScore: 0, urlsCrawled: 1290 },
];

function AuditSettingsRoute() {
  const { runId } = Route.useParams();
  const seedConfig = useMemo(() => AUDIT_CONFIGS.find((item) => item.id === runId) ?? { ...DEFAULT_CONFIG, id: runId }, [runId]);
  const [config, setConfig] = useState(seedConfig);
  const [includeDraft, setIncludeDraft] = useState("");
  const [excludeDraft, setExcludeDraft] = useState("");
  const isRevenueAudit = config.type === "Revenue";

  const updateConfig = <K extends keyof AuditConfig>(key: K, value: AuditConfig[K]) => {
    setConfig((current) => ({ ...current, [key]: value }));
  };

  const addRule = (kind: "includeRules" | "excludeRules", value: string) => {
    const rule = value.trim();
    if (!rule) return;
    updateConfig(kind, [...config[kind], rule]);
    if (kind === "includeRules") setIncludeDraft("");
    if (kind === "excludeRules") setExcludeDraft("");
  };

  const removeRule = (kind: "includeRules" | "excludeRules", rule: string) => {
    updateConfig(kind, config[kind].filter((item) => item !== rule));
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <DashboardNav />
      <div className="lg:pl-56">
        <header className="sticky top-0 z-30 border-b border-border bg-background/85 backdrop-blur">
          <div className="flex flex-col gap-4 px-6 py-5 lg:flex-row lg:items-center lg:justify-between lg:px-8">
            <div className="flex items-start gap-3">
              <Button variant="ghost" size="icon" asChild aria-label="Back to audit overview">
                <Link to="/audit-runs/$runId" params={{ runId }}>
                  <ArrowLeft className="h-4 w-4" />
                </Link>
              </Button>
              <div>
                <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Audit configuration</p>
                <div className="mt-1 flex flex-wrap items-center gap-3">
                  <h1 className="text-2xl font-bold tracking-tight">{config.name}</h1>
                  <AuditTypeBadge type={config.type} />
                </div>
                <p className="mt-1 text-sm text-muted-foreground">Created {config.createdDate} · {config.frequency} crawl cadence</p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Button variant="outline"><Save className="h-4 w-4" /> Save changes</Button>
              <ThemeToggle />
            </div>
          </div>
        </header>

        <main className="px-6 py-6 lg:px-8">
          <Tabs defaultValue="general" className="space-y-6">
            <TabsList className="h-auto flex-wrap justify-start bg-surface/70 p-1">
              <TabsTrigger value="general"><Settings2 className="mr-2 h-4 w-4" /> General</TabsTrigger>
              <TabsTrigger value="scope"><Globe2 className="mr-2 h-4 w-4" /> Scope rules</TabsTrigger>
              <TabsTrigger value="crawl"><Gauge className="mr-2 h-4 w-4" /> Crawl limits</TabsTrigger>
              <TabsTrigger value="history"><History className="mr-2 h-4 w-4" /> Crawl history</TabsTrigger>
              <TabsTrigger value="danger"><Trash2 className="mr-2 h-4 w-4" /> Danger zone</TabsTrigger>
            </TabsList>

            <TabsContent value="general" className="mt-0">
              <section className="grid gap-4 xl:grid-cols-[1fr_0.8fr]">
                <SettingsPanel eyebrow="Identity" title="Audit details" icon={<FileCode2 className="h-4 w-4" />}>
                  <div className="grid gap-4 md:grid-cols-2">
                    <Field label="Audit name">
                      <Input value={config.name} onChange={(event) => updateConfig("name", event.target.value)} />
                    </Field>
                    <ReadonlyField label="Audit type"><AuditTypeBadge type={config.type} /></ReadonlyField>
                    <Field label="Start URL">
                      <Input value={config.startUrl} onChange={(event) => updateConfig("startUrl", event.target.value)} readOnly={isRevenueAudit} className={isRevenueAudit ? "bg-surface/70 text-muted-foreground" : undefined} />
                    </Field>
                    <ReadonlyField label="Created date"><span className="font-mono text-sm">{config.createdDate}</span></ReadonlyField>
                  </div>
                  {isRevenueAudit && (
                    <div className="mt-4 rounded-lg border border-primary/20 bg-primary/10 px-4 py-3 text-sm text-primary">
                      Revenue audit start URLs are controlled by OrganicOS so dashboard calculations remain consistent.
                    </div>
                  )}
                </SettingsPanel>

                <SettingsPanel eyebrow="Scheduling" title="Automation" icon={<CalendarClock className="h-4 w-4" />}>
                  <Field label="Frequency">
                    <Select value={config.frequency} onValueChange={(value) => updateConfig("frequency", value as Frequency)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {(["Manual", "Weekly", "Monthly", "Always-on"] as Frequency[]).map((option) => <SelectItem key={option} value={option}>{option}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </Field>
                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <ToggleRow label="JavaScript rendering" checked={config.javascriptRendering} onCheckedChange={(checked) => updateConfig("javascriptRendering", checked)} />
                    <ToggleRow label="Respect robots.txt" checked={config.respectRobots} onCheckedChange={(checked) => updateConfig("respectRobots", checked)} />
                  </div>
                </SettingsPanel>
              </section>
            </TabsContent>

            <TabsContent value="scope" className="mt-0">
              <section className="grid gap-4 xl:grid-cols-2">
                <RulePanel title="Include rules" tone="include" rules={config.includeRules} draft={includeDraft} onDraftChange={setIncludeDraft} onAdd={() => addRule("includeRules", includeDraft)} onRemove={(rule) => removeRule("includeRules", rule)} />
                <RulePanel title="Exclude rules" tone="exclude" rules={config.excludeRules} draft={excludeDraft} onDraftChange={setExcludeDraft} onAdd={() => addRule("excludeRules", excludeDraft)} onRemove={(rule) => removeRule("excludeRules", rule)} />
              </section>
            </TabsContent>

            <TabsContent value="crawl" className="mt-0">
              <SettingsPanel eyebrow="Crawler behaviour" title="Limits and speed" icon={<Layers3 className="h-4 w-4" />}>
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                  <NumberField label="Max URLs" value={config.maxUrls} onChange={(value) => updateConfig("maxUrls", value)} />
                  <NumberField label="Max depth" value={config.maxDepth} onChange={(value) => updateConfig("maxDepth", value)} />
                  <NumberField label="Requests per second" value={config.requestsPerSecond} onChange={(value) => updateConfig("requestsPerSecond", value)} />
                  <NumberField label="Concurrent threads" value={config.concurrentThreads} onChange={(value) => updateConfig("concurrentThreads", value)} />
                </div>
              </SettingsPanel>
            </TabsContent>

            <TabsContent value="history" className="mt-0">
              <CrawlHistory runId={runId} />
            </TabsContent>

            <TabsContent value="danger" className="mt-0">
              <DeleteAuditPanel name={config.name} />
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
}

function SettingsPanel({ eyebrow, title, icon, children }: { eyebrow: string; title: string; icon: ReactNode; children: ReactNode }) {
  return (
    <section className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <div className="mb-5 flex items-center gap-3">
        <span className="flex h-9 w-9 items-center justify-center rounded-md border border-primary/20 bg-primary/10 text-primary">{icon}</span>
        <div>
          <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">{eyebrow}</p>
          <h2 className="mt-1 text-lg font-semibold">{title}</h2>
        </div>
      </div>
      {children}
    </section>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return <div className="space-y-2"><Label>{label}</Label>{children}</div>;
}

function ReadonlyField({ label, children }: { label: string; children: ReactNode }) {
  return <div className="space-y-2"><Label>{label}</Label><div className="flex h-9 items-center rounded-md border border-border bg-surface/70 px-3">{children}</div></div>;
}

function AuditTypeBadge({ type }: { type: AuditType }) {
  return <span className={`inline-flex items-center rounded-md border px-2.5 py-1 font-mono text-xs ${type === "Revenue" ? "border-primary/25 bg-primary/10 text-primary" : "border-border bg-surface text-muted-foreground"}`}>{type}</span>;
}

function ToggleRow({ label, checked, onCheckedChange }: { label: string; checked: boolean; onCheckedChange: (checked: boolean) => void }) {
  return <div className="flex items-center justify-between gap-4 rounded-lg border border-border bg-surface/45 px-4 py-3"><Label>{label}</Label><Switch checked={checked} onCheckedChange={onCheckedChange} /></div>;
}

function NumberField({ label, value, onChange }: { label: string; value: number; onChange: (value: number) => void }) {
  return <Field label={label}><Input type="number" min={0} value={value} onChange={(event) => onChange(Number(event.target.value))} /></Field>;
}

function RulePanel({ title, tone, rules, draft, onDraftChange, onAdd, onRemove }: { title: string; tone: "include" | "exclude"; rules: string[]; draft: string; onDraftChange: (value: string) => void; onAdd: () => void; onRemove: (rule: string) => void }) {
  return (
    <SettingsPanel eyebrow="URL patterns" title={title} icon={tone === "include" ? <CheckCircle2 className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />}>
      <div className="flex gap-2">
        <Input value={draft} onChange={(event) => onDraftChange(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") onAdd(); }} placeholder={tone === "include" ? "/category/*" : "?utm_*"} />
        <Button type="button" onClick={onAdd}><Plus className="h-4 w-4" /> Add</Button>
      </div>
      <div className="mt-4 space-y-2">
        {rules.map((rule) => (
          <div key={rule} className="flex items-center justify-between gap-3 rounded-lg border border-border bg-surface/45 px-3 py-2">
            <code className="break-all font-mono text-sm text-foreground">{rule}</code>
            <Button variant="ghost" size="icon" onClick={() => onRemove(rule)} aria-label={`Remove ${rule}`}><X className="h-4 w-4" /></Button>
          </div>
        ))}
      </div>
    </SettingsPanel>
  );
}

function CrawlHistory({ runId }: { runId: string }) {
  return (
    <section className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
      <div className="border-b border-border p-5">
        <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Past crawl_runs</p>
        <h2 className="mt-1 text-lg font-semibold">Run history for this config</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] text-sm">
          <thead><tr className="border-b border-border bg-surface/40 text-left text-[10px] font-mono uppercase tracking-wider text-muted-foreground"><th className="px-5 py-3">Date</th><th className="px-5 py-3">Status</th><th className="px-5 py-3 text-right">Health score</th><th className="px-5 py-3 text-right">URLs crawled</th><th className="px-5 py-3 text-right">Results</th></tr></thead>
          <tbody>
            {CRAWL_RUNS.map((crawl) => (
              <tr key={crawl.id} className="border-b border-border last:border-0">
                <td className="px-5 py-4 font-medium">{crawl.date}</td>
                <td className="px-5 py-4"><StatusBadge status={crawl.status} /></td>
                <td className="px-5 py-4 text-right font-mono">{crawl.healthScore ? `${crawl.healthScore}/100` : "—"}</td>
                <td className="px-5 py-4 text-right font-mono">{crawl.urlsCrawled.toLocaleString()}</td>
                <td className="px-5 py-4 text-right"><Button variant="outline" size="sm" asChild><Link to="/audit-runs/$runId" params={{ runId }}>Open <ExternalLink className="h-3.5 w-3.5" /></Link></Button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function StatusBadge({ status }: { status: string }) {
  return <span className={`inline-flex rounded-md border px-2 py-1 font-mono text-xs ${status === "Completed" ? "border-primary/25 bg-primary/10 text-primary" : "border-destructive/25 bg-destructive/10 text-destructive"}`}>{status}</span>;
}

function DeleteAuditPanel({ name }: { name: string }) {
  return (
    <section className="rounded-xl border border-destructive/30 bg-card p-5 shadow-sm">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-[10px] font-mono uppercase tracking-wider text-destructive">Danger zone</p>
          <h2 className="mt-1 text-lg font-semibold">Delete this audit config</h2>
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">This removes the audit configuration and stops future scheduled crawls. Historical run results are retained for reporting.</p>
        </div>
        <AlertDialog>
          <AlertDialogTrigger asChild><Button variant="destructive"><Trash2 className="h-4 w-4" /> Delete audit</Button></AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete {name}?</AlertDialogTitle>
              <AlertDialogDescription>This action cannot be undone for the audit configuration. Scheduled crawls for this audit will stop immediately.</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete audit config</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </section>
  );
}
