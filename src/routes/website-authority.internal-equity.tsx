import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ArrowDownRight, ArrowUpRight, ExternalLink, Link2 } from "lucide-react";
import { CartesianGrid, ReferenceLine, Scatter, ScatterChart, Tooltip as ChartTooltip, XAxis, YAxis, ZAxis } from "recharts";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";

export const Route = createFileRoute("/website-authority/internal-equity")({
  component: InternalEquityPage,
  head: () => ({
    meta: [
      { title: "Internal Equity — Website Authority" },
      { name: "description", content: "Prioritise page-level authority opportunities using internal equity, CTR, and topical relevance." },
      { property: "og:title", content: "Internal Equity — Website Authority" },
      { property: "og:description", content: "A structural authority dashboard with opportunity matrix, URL analysis, and equity flow drawer." },
    ],
  }),
});

type Quadrant = "Hidden Gems" | "Dead Ends" | "Powerhouses" | "The Rot";
type UrlRow = {
  url: string;
  authority: number;
  topical: number;
  internalLinks: number;
  ctr: number;
  status: "Under-linked" | "High Potential" | "Authority Leak" | "Strong";
  sending: string[];
  receiving: string[];
  topicalMatch: number;
};

const urls: UrlRow[] = [
  { url: "/routes/london-to-manchester", authority: 78, topical: 91, internalLinks: 84, ctr: 6.8, status: "Strong", sending: ["/", "/routes", "/city/london", "/city/manchester", "/blog/uk-coach-guide"], receiving: ["/stops/victoria-coach-station", "/operator/national-express", "/routes/london-to-birmingham", "/tickets", "/help/luggage-rules"], topicalMatch: 88 },
  { url: "/city/leeds", authority: 42, topical: 86, internalLinks: 21, ctr: 5.9, status: "High Potential", sending: ["/city", "/routes/manchester-to-leeds", "/blog/northern-cities", "/routes", "/"], receiving: ["/routes/leeds-to-london", "/stops/leeds-bus-station", "/tickets", "/operators", "/blog/weekend-leeds"], topicalMatch: 82 },
  { url: "/blog/old-timetable-guide", authority: 69, topical: 39, internalLinks: 74, ctr: 1.1, status: "Authority Leak", sending: ["/blog", "/help/timetables", "/routes", "/", "/city/birmingham"], receiving: ["/help", "/blog/cheap-travel", "/routes/archive", "/support", "/operator/archive"], topicalMatch: 44 },
  { url: "/stops/victoria-coach-station", authority: 36, topical: 78, internalLinks: 18, ctr: 1.9, status: "Under-linked", sending: ["/city/london", "/routes/london-to-manchester", "/routes/london-to-bristol", "/stops", "/"], receiving: ["/help/luggage-rules", "/routes/airport-transfers", "/operators", "/tickets", "/city/london"], topicalMatch: 74 },
  { url: "/operator/national-express", authority: 81, topical: 84, internalLinks: 96, ctr: 4.6, status: "Strong", sending: ["/operators", "/routes", "/", "/blog/coach-companies", "/tickets"], receiving: ["/routes/london-to-cardiff", "/routes/bristol-to-bath", "/help/changes", "/stops", "/city/leeds"], topicalMatch: 81 },
  { url: "/poi/stonehenge-day-trip", authority: 33, topical: 52, internalLinks: 15, ctr: 4.9, status: "High Potential", sending: ["/blog/day-trips", "/city/salisbury", "/routes", "/blog/uk-attractions", "/"], receiving: ["/routes/london-to-salisbury", "/tickets", "/blog/weekend-routes", "/city/london", "/poi"], topicalMatch: 57 },
  { url: "/help/luggage-rules", authority: 61, topical: 49, internalLinks: 65, ctr: 0.8, status: "Authority Leak", sending: ["/help", "/routes", "/tickets", "/", "/operator/national-express"], receiving: ["/support", "/help/changes", "/blog/travel-tips", "/routes/london-to-manchester", "/stops/victoria-coach-station"], topicalMatch: 48 },
  { url: "/routes/bristol-to-bath", authority: 48, topical: 89, internalLinks: 28, ctr: 2.3, status: "Under-linked", sending: ["/routes", "/city/bristol", "/city/bath", "/operator/national-express", "/blog/south-west"], receiving: ["/tickets", "/stops/bristol", "/stops/bath", "/routes/bath-to-london", "/city/bath"], topicalMatch: 85 },
];

function quadrantFor(row: UrlRow): Quadrant {
  const highEquity = row.authority >= 55;
  const highCtr = row.ctr >= 3.5;
  if (!highEquity && highCtr) return "Hidden Gems";
  if (!highEquity && !highCtr) return "Dead Ends";
  if (highEquity && highCtr) return "Powerhouses";
  return "The Rot";
}

function InternalEquityPage() {
  const [activeQuadrant, setActiveQuadrant] = useState<Quadrant | "All">("All");
  const [selectedUrl, setSelectedUrl] = useState<UrlRow | null>(null);
  const filtered = useMemo(() => urls.filter((row) => activeQuadrant === "All" || quadrantFor(row) === activeQuadrant), [activeQuadrant]);

  return (
    <main className="space-y-6 px-6 py-6 lg:px-8">
      <section className="rounded-xl border border-border bg-card p-5 shadow-sm">
        <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Opportunity Matrix</p>
            <h2 className="mt-1 text-lg font-semibold">Structural authority vs. CTR</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {(["All", "Hidden Gems", "Dead Ends", "Powerhouses", "The Rot"] as const).map((item) => (
              <button key={item} type="button" onClick={() => setActiveQuadrant(item)} className={`rounded-md border px-3 py-1.5 text-xs font-mono transition-colors ${activeQuadrant === item ? "border-primary/30 bg-primary/10 text-primary" : "border-border bg-surface text-muted-foreground hover:text-foreground"}`}>
                {item}
              </button>
            ))}
          </div>
        </div>
        <div className="relative h-[430px] rounded-lg border border-border bg-background/45 p-4">
          <div className="absolute left-[7%] top-5 text-xs font-semibold text-primary">Hidden Gems</div>
          <div className="absolute right-8 top-5 text-xs font-semibold text-chart-3">Powerhouses</div>
          <div className="absolute bottom-6 left-[7%] text-xs font-semibold text-muted-foreground">Dead Ends</div>
          <div className="absolute bottom-6 right-8 text-xs font-semibold text-destructive">The Rot</div>
          <ScatterChart width={1100} height={395} margin={{ top: 18, right: 24, bottom: 28, left: 12 }} className="max-w-full">
            <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" />
            <XAxis dataKey="authority" type="number" domain={[0, 100]} name="Internal Equity Score" tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} />
            <YAxis dataKey="ctr" type="number" domain={[0, 8]} name="CTR" tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} width={34} />
            <ZAxis range={[90, 180]} />
            <ReferenceLine x={55} stroke="var(--border)" strokeWidth={2} />
            <ReferenceLine y={3.5} stroke="var(--border)" strokeWidth={2} />
            <ChartTooltip content={<MatrixTooltip />} cursor={{ stroke: "var(--primary)", strokeDasharray: "3 3" }} />
            <Scatter data={filtered} fill="var(--chart-3)" onClick={(point) => setSelectedUrl(point as UrlRow)} />
          </ScatterChart>
        </div>
      </section>

      <section className="rounded-xl border border-border bg-card p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">URL Analysis</p>
            <h2 className="mt-1 text-lg font-semibold">{activeQuadrant === "All" ? "All URLs" : activeQuadrant}</h2>
          </div>
          <Link2 className="h-5 w-5 text-primary" />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[860px] text-sm">
            <thead className="border-b border-border text-xs text-muted-foreground">
              <tr><th className="px-3 py-2 text-left font-medium">URL</th><th className="px-3 py-2 text-right font-medium">Structural Authority</th><th className="px-3 py-2 text-right font-medium">Topical Relevance</th><th className="px-3 py-2 text-right font-medium">Internal Links</th><th className="px-3 py-2 text-right font-medium">CTR</th><th className="px-3 py-2 text-left font-medium">Status</th></tr>
            </thead>
            <tbody>
              {filtered.map((row) => (
                <tr key={row.url} onClick={() => setSelectedUrl(row)} className="cursor-pointer border-b border-border/60 transition-colors hover:bg-surface/45">
                  <td className="px-3 py-3 font-mono text-xs"><span className="inline-flex items-center gap-2"><ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />{row.url}</span></td>
                  <td className="px-3 py-3 text-right font-mono font-bold tabular-nums">{row.authority}</td>
                  <td className="px-3 py-3 text-right font-mono tabular-nums">{row.topical}%</td>
                  <td className="px-3 py-3 text-right font-mono tabular-nums">{row.internalLinks}</td>
                  <td className="px-3 py-3 text-right font-mono tabular-nums">{row.ctr}%</td>
                  <td className="px-3 py-3"><StatusBadge status={row.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <EquityDrawer row={selectedUrl} onOpenChange={(open) => !open && setSelectedUrl(null)} />
    </main>
  );
}

function StatusBadge({ status }: { status: UrlRow["status"] }) {
  const tone = status === "High Potential" ? "border-primary/20 bg-primary/10 text-primary" : status === "Authority Leak" ? "border-chart-4/30 bg-chart-4/10 text-chart-4" : status === "Under-linked" ? "border-chart-3/30 bg-chart-3/10 text-chart-3" : "border-border bg-surface text-foreground";
  return <Badge variant="outline" className={tone}>{status}</Badge>;
}

function EquityDrawer({ row, onOpenChange }: { row: UrlRow | null; onOpenChange: (open: boolean) => void }) {
  return (
    <Sheet open={!!row} onOpenChange={onOpenChange}>
      <SheetContent className="w-full overflow-y-auto sm:max-w-xl">
        {row && (
          <>
            <SheetHeader>
              <SheetTitle>Equity Flow</SheetTitle>
              <SheetDescription className="font-mono text-xs">{row.url}</SheetDescription>
            </SheetHeader>
            <div className="mt-6 space-y-5">
              <div className="rounded-lg border border-border bg-surface/40 p-4">
                <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Topical Match</p>
                <div className="mt-3 flex items-center gap-3"><div className="h-2 flex-1 rounded-full bg-background"><div className="h-2 rounded-full bg-primary" style={{ width: `${row.topicalMatch}%` }} /></div><span className="font-mono text-sm font-bold">{row.topicalMatch}%</span></div>
              </div>
              <FlowList title="Top 5 pages sending equity" urls={row.sending} direction="in" />
              <FlowList title="Top 5 pages receiving equity" urls={row.receiving} direction="out" />
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}

function FlowList({ title, urls: items, direction }: { title: string; urls: string[]; direction: "in" | "out" }) {
  return <div className="rounded-lg border border-border bg-card p-4"><p className="mb-3 text-sm font-semibold">{title}</p><div className="space-y-2">{items.map((item) => <div key={item} className="flex items-center gap-2 rounded-md border border-border bg-surface/40 px-3 py-2 text-xs font-mono"><span className={direction === "in" ? "text-primary" : "text-chart-3"}>{direction === "in" ? <ArrowDownRight className="h-3.5 w-3.5" /> : <ArrowUpRight className="h-3.5 w-3.5" />}</span>{item}</div>)}</div></div>;
}

function MatrixTooltip({ active, payload }: { active?: boolean; payload?: Array<{ payload?: UrlRow }> }) {
  if (!active || !payload?.length || !payload[0].payload) return null;
  const row = payload[0].payload;
  return <div className="rounded-md border border-border bg-popover px-3 py-2 text-xs shadow-md"><p className="font-mono font-bold text-foreground">{row.url}</p><p className="mt-1 text-muted-foreground">{quadrantFor(row)} · Authority {row.authority} · CTR {row.ctr}%</p></div>;
}