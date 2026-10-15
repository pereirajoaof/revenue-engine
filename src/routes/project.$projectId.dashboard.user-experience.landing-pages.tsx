import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { toast } from "sonner";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { LANDING, uxHead, type LandingRow, type LpStatus, type SpeedChip } from "@/components/ux/data";
import { useUx } from "@/components/ux/state";
import { CRUMB_DASH, CRUMB_UX, DataTable, InfoPop, MiniRange, MoneyChip, Page, Pill, Section, StatusPill, TopBar } from "@/components/ux/ui";

export const Route = createFileRoute("/project/$projectId/dashboard/user-experience/landing-pages")({
  component: LandingPages,
  head: () => uxHead("Landing pages", "Every organic landing page compared with similar pages on the same site, with evidence to investigate."),
});

const STATUSES: LpStatus[] = ["Below peers", "Within peer range", "Above peers", "Insufficient evidence", "Not enough comparable pages"];

function SpeedEvidence({ chip }: { chip: SpeedChip }) {
  if (chip.kind === "borrowed")
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <span>
            <Pill dashed>{chip.text}</Pill>
          </span>
        </TooltipTrigger>
        <TooltipContent className="text-xs">Measured on another URL — not evidence about this page</TooltipContent>
      </Tooltip>
    );
  return <Pill className={chip.kind === "none" ? "border-border text-muted-foreground" : ""}>{chip.text}</Pill>;
}

const sel = "rounded-md border border-border bg-surface px-2 py-1.5 text-xs";

function LandingPages() {
  const { outcome, openLog } = useUx();
  const [status, setStatus] = useState("all");
  const [type, setType] = useState("all");
  const [device, setDevice] = useState("all");
  const [exact, setExact] = useState(false);
  const [q, setQ] = useState("");
  const [open, setOpen] = useState<LandingRow | null>(null);

  const types = Array.from(new Set(LANDING.map((l) => l.type).filter((t) => t !== "—")));
  const rows = useMemo(
    () =>
      LANDING.filter(
        (l) =>
          (status === "all" || l.status === status) &&
          (type === "all" || l.type === type) &&
          (device === "all" || l.device === device) &&
          (!exact || l.exact) &&
          l.page.toLowerCase().includes(q.toLowerCase()),
      ).sort((a, b) => b.shortfall - a.shortfall),
    [status, type, device, exact, q],
  );

  return (
    <>
      <TopBar crumbs={[CRUMB_DASH, CRUMB_UX]} title="Landing pages" meta="Google Analytics & Search Console: last 4 complete weeks · sorted by conservative shortfall" />
      <Page>
        <Section
          title={`${rows.length} landing pages`}
          caption="Click a row for what we see, how sure we are and what to investigate."
          right={
            <div className="flex flex-wrap items-center gap-2">
              <label className="relative">
                <Search className="absolute left-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search pages" className={`${sel} w-40 pl-7`} />
              </label>
              <select aria-label="Status" value={status} onChange={(e) => setStatus(e.target.value)} className={sel}>
                <option value="all">All statuses</option>
                {STATUSES.map((s) => <option key={s}>{s}</option>)}
              </select>
              <select aria-label="Page type" value={type} onChange={(e) => setType(e.target.value)} className={sel}>
                <option value="all">All page types</option>
                {types.map((t) => <option key={t}>{t}</option>)}
              </select>
              <select aria-label="Device" value={device} onChange={(e) => setDevice(e.target.value)} className={sel}>
                <option value="all">All devices</option>
                <option>Mobile-heavy</option>
                <option>Desktop-heavy</option>
              </select>
              <label className="flex items-center gap-1.5 text-xs">
                <input type="checkbox" checked={exact} onChange={(e) => setExact(e.target.checked)} />
                Exact URL match only
              </label>
            </div>
          }
        >
          <DataTable
            rows={rows}
            rowKey={(r) => r.page}
            onRow={(r) => r.status !== "Unmatched host" && setOpen(r)}
            empty="No pages match these filters"
            cols={[
              { key: "p", label: "Page", render: (r) => <span className={`font-mono text-xs ${r.status === "Unmatched host" ? "text-muted-foreground" : ""}`}>{r.page}</span> },
              { key: "t", label: "Page type", render: (r) => <span className="text-xs text-muted-foreground">{r.type}</span> },
              { key: "s", label: "Landing sessions", align: "right", render: (r) => r.sessions?.toLocaleString("en-GB") ?? "—" },
              { key: "c", label: `${outcome.rate} vs peers`, render: (r) => (r.conv ? <MiniRange {...r.conv} /> : <span className="text-muted-foreground">—</span>) },
              { key: "e", label: "Engaged share vs peers", render: (r) => (r.eng ? <MiniRange {...r.eng} max={100} /> : <span className="text-muted-foreground">—</span>) },
              ...(outcome.money
                ? [
                    {
                      key: "rv",
                      label: "Revenue/yr",
                      align: "right" as const,
                      render: (r: LandingRow) =>
                        r.revenue ? (
                          <span className="inline-flex items-center gap-1.5">
                            {r.revenue.value} <Pill className={r.revenue.src === "Allocated" ? "border-dashed" : ""}>{r.revenue.src}</Pill>
                          </span>
                        ) : (
                          "—"
                        ),
                    },
                  ]
                : []),
              { key: "ctr", label: "Search context", render: (r) => <span className="text-xs">{r.ctr === "—" ? "—" : `CTR ${r.ctr.toLowerCase()}`}</span> },
              { key: "sp", label: "Speed evidence", render: (r) => <SpeedEvidence chip={r.speed} /> },
              { key: "st", label: "Status", render: (r) => <StatusPill status={r.status} /> },
            ]}
          />
        </Section>
      </Page>

      <Sheet open={!!open} onOpenChange={(v) => !v && setOpen(null)}>
        <SheetContent className="w-full overflow-y-auto sm:max-w-lg">
          {open && (
            <>
              <SheetHeader>
                <SheetTitle className="font-mono text-base">{open.page}</SheetTitle>
                <SheetDescription>
                  {open.type} · <StatusPill status={open.status} />
                </SheetDescription>
              </SheetHeader>
              <div className="mt-5 space-y-5 text-sm">
                <DrawerBlock n={1} title="What we see">
                  {open.conv && open.sessions ? (
                    <p>
                      {open.sessions.toLocaleString("en-GB")} organic landing sessions; {open.conv.obs}% completed a {outcome.outcome.toLowerCase().replace(/s$/, "")} (
                      {Math.round((open.sessions * open.conv.obs) / 100)}). Similar {open.type} pages, adjusted for this page's device mix: {open.conv.peer}%.
                    </p>
                  ) : (
                    <p className="text-muted-foreground">{open.sessions ?? "—"} sessions — too few to compare with similar pages.</p>
                  )}
                </DrawerBlock>
                <DrawerBlock n={2} title="How sure">
                  <p className="font-mono text-xs">
                    {open.conv ? `90% range ${open.conv.lo}–${open.conv.hi}%` : "Range unavailable"} · last 4 complete weeks · {open.exact ? "exact URL match" : "matched by normalised URL"}
                  </p>
                </DrawerBlock>
                <DrawerBlock n={3} title="Evidence to investigate (observed)">
                  <ul className="space-y-2">
                    <li>
                      Device split: <span className="font-mono text-xs">Mobile 1.9% vs 4.9% · Desktop 6.8% vs 7.4%</span>
                    </li>
                    <li className="flex items-center gap-2">Speed: <SpeedEvidence chip={open.speed} /></li>
                    <li>Crawl facts: <span className="font-mono text-xs">status 200 · indexable · response time 1.2s</span></li>
                    <li>vs previous 4 weeks: <span className="font-mono text-xs">−0.4 pts (no clear change)</span></li>
                    <li>Search mix similar to peers</li>
                  </ul>
                </DrawerBlock>
                <DrawerBlock n={4} title="Hypotheses (unproven)">
                  <ul className="list-disc space-y-1 pl-4 text-muted-foreground">
                    <li>The mobile gap is larger than desktop — the mobile product grid may be harder to use.</li>
                    <li>Slower loading on this page than its peers may delay the first add-to-basket.</li>
                    <li>Visitors may arrive from queries looking for information rather than to buy.</li>
                  </ul>
                  <p className="mt-2 text-xs italic text-muted-foreground">These are leads to investigate, not established causes.</p>
                </DrawerBlock>
                <DrawerBlock n={5} title="Money">
                  {outcome.money && open.revenue ? (
                    <div className="space-y-2">
                      <p className="flex items-center gap-2">Exposure <span className="font-mono">£38.1k/yr</span> <MoneyChip kind="Exposure" /></p>
                      <p className="flex items-center gap-2">
                        Modelled <span className="font-mono">£19k–£29k/yr</span> <MoneyChip kind="Modelled" />
                        <InfoPop>If this page converted at the rate of similar pages on this site, with the same traffic and the page type's average order value. Not a forecast. Shown separately from Exposure — never added together.</InfoPop>
                      </p>
                    </div>
                  ) : (
                    <p className="text-muted-foreground">No money figures for this account.</p>
                  )}
                  <p className="mt-2 font-mono text-xs text-muted-foreground">Effort: Not estimated</p>
                </DrawerBlock>
                <div className="flex flex-wrap gap-2 border-t border-border pt-4">
                  {["Worth investigating", "Not useful", "Explained by something else"].map((f) => (
                    <button key={f} type="button" onClick={() => toast.success(`Feedback saved: ${f}`)} className="rounded-md border border-border px-2.5 py-1.5 text-xs hover:bg-surface">
                      {f}
                    </button>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const p = open.page;
                    setOpen(null);
                    openLog([p]);
                  }}
                  className="w-full rounded-md bg-primary py-2.5 text-sm font-medium text-primary-foreground hover:brightness-110"
                >
                  Log a change
                </button>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </>
  );
}

function DrawerBlock({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-1.5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
        {n} · {title}
      </p>
      {children}
    </div>
  );
}
