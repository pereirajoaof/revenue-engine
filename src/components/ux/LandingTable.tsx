import { useState } from "react";
import { AppLink as Link } from "@/lib/app-link";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { MAIN_HOST, type LandingRow } from "@/lib/ux-data";
import {
  AssumptionInfo,
  CwvEvidence,
  EvidenceChip,
  Label,
  OPPORTUNITY_ASSUMPTION,
  RangeDot,
  SourceChip,
  StatusPill,
  useUx,
} from "./UxKit";

const n = (v: number | null) => (v === null ? "—" : v.toLocaleString("en-GB"));

function CtrBand({ ctr }: { ctr: LandingRow["ctr"] }) {
  if (!ctr) return <span className="text-muted-foreground">CTR unavailable</span>;
  return (
    <Link to="/dashboard/brand-authority/query-signals" className="underline decoration-dotted underline-offset-2 hover:text-foreground">
      CTR {ctr} expected
    </Link>
  );
}

export function LandingTable({ rows, onOpen }: { rows: LandingRow[]; onOpen?: (r: LandingRow) => void }) {
  const { hasGA4, hasOutcome, outcomeRate, money } = useUx();
  return (
    <>
      {/* Desktop table */}
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
              <th className="px-4 py-2 font-normal">Page</th>
              <th className="px-3 py-2 font-normal">Page type</th>
              {hasGA4 && <th className="px-3 py-2 text-right font-normal">Landing sessions</th>}
              {hasOutcome && <th className="px-3 py-2 font-normal">{outcomeRate} vs peers</th>}
              {hasGA4 && <th className="px-3 py-2 font-normal">Engaged share vs peers</th>}
              <th className="px-3 py-2 text-right font-normal">{hasGA4 ? "Revenue/yr" : "Est. revenue/yr"}</th>
              <th className="px-3 py-2 font-normal">Search context</th>
              <th className="px-3 py-2 font-normal">CWV evidence</th>
              {hasGA4 && <th className="px-4 py-2 font-normal">Status</th>}
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => {
              const muted = r.status === "Unmatched host";
              const status = hasOutcome ? r.status : r.engagedStatus ?? r.status;
              return (
                <tr
                  key={r.id}
                  onClick={() => !muted && onOpen?.(r)}
                  className={`border-b border-border last:border-0 ${muted ? "opacity-55" : "cursor-pointer hover:bg-surface/60"}`}
                >
                  <td className="px-4 py-2.5">
                    <p className="font-mono text-[12px]">{r.path}</p>
                    {r.host && r.host !== MAIN_HOST && <p className="font-mono text-[10px] text-muted-foreground">{r.host}</p>}
                  </td>
                  <td className="px-3 py-2.5 text-xs text-muted-foreground">{r.type}</td>
                  {hasGA4 && <td className="px-3 py-2.5 text-right font-mono text-[12px]">{n(r.sessions)}</td>}
                  {hasOutcome && (
                    <td className="px-3 py-2.5">
                      {r.purchase ? <RangeDot rate={r.purchase} max={10} warn={r.status === "Below peers"} /> : <span className="font-mono text-[11px] text-muted-foreground">—</span>}
                    </td>
                  )}
                  {hasGA4 && (
                    <td className="px-3 py-2.5">
                      {r.engaged ? <RangeDot rate={r.engaged} max={100} warn={r.engagedStatus === "Below peers"} /> : <span className="font-mono text-[11px] text-muted-foreground">—</span>}
                    </td>
                  )}
                  <td className="px-3 py-2.5 text-right">
                    <span className="font-mono text-[12px]">{money(r.revenue.value)}</span>{" "}
                    {r.revenue.value !== null && <SourceChip>{hasGA4 ? r.revenue.source : "Allocated"}</SourceChip>}
                  </td>
                  <td className="px-3 py-2.5 font-mono text-[11px] text-muted-foreground">
                    {n(r.clicks)} clicks · <CtrBand ctr={r.ctr} />
                  </td>
                  <td className="px-3 py-2.5"><CwvEvidence cwv={r.cwv} /></td>
                  {hasGA4 && <td className="px-4 py-2.5"><StatusPill status={status} /></td>}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {/* Mobile cards */}
      <div className="divide-y divide-border md:hidden">
        {rows.map((r) => (
          <button key={r.id} onClick={() => r.status !== "Unmatched host" && onOpen?.(r)} className="block w-full space-y-2 px-4 py-3 text-left">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="font-mono text-[12px]">{r.path}</p>
                <p className="font-mono text-[10px] text-muted-foreground">{r.host ?? r.type}</p>
              </div>
              {hasGA4 && <StatusPill status={hasOutcome ? r.status : r.engagedStatus ?? r.status} />}
            </div>
            {hasOutcome && r.purchase && <RangeDot rate={r.purchase} max={10} warn={r.status === "Below peers"} />}
            <p className="font-mono text-[11px] text-muted-foreground">
              {hasGA4 && `${n(r.sessions)} sessions · `}
              {money(r.revenue.value)} · {n(r.clicks)} clicks
            </p>
            <CwvEvidence cwv={r.cwv} />
          </button>
        ))}
      </div>
    </>
  );
}

export function FindingDrawer({ row, onClose }: { row: LandingRow | null; onClose: () => void }) {
  const { hasOutcome, outcome, outcomeRate, money, showMoney } = useUx();
  const [fb, setFb] = useState<string | null>(null);
  const r = row;
  const purchases = r?.purchase && r.sessions ? Math.round((r.sessions * r.purchase.obs) / 100) : null;
  return (
    <Sheet open={!!r} onOpenChange={(o) => !o && onClose()}>
      <SheetContent className="w-full overflow-y-auto sm:max-w-lg">
        {r && (
          <>
            <SheetHeader>
              <Label>Finding · {r.type}</Label>
              <SheetTitle className="font-mono text-base">{r.path}</SheetTitle>
              <SheetDescription>{hasOutcome ? `${outcomeRate} ` : "Engaged share "}compared with similar pages on this site</SheetDescription>
            </SheetHeader>
            <div className="space-y-5 px-4 pb-6 text-sm">
              <section>
                <Label>What we see</Label>
                <p className="mt-1">
                  {r.sessions?.toLocaleString("en-GB") ?? "—"} organic landing sessions
                  {hasOutcome && r.purchase && (
                    <>
                      ; {r.purchase.obs}% completed a {outcome} ({purchases}). Similar {r.type} pages, adjusted for this page's device mix: {r.purchase.peer}%.
                    </>
                  )}
                  {(!hasOutcome || !r.purchase) && r.engaged && <>; {r.engaged.obs}% engaged vs {r.engaged.peer}% on similar pages.</>}
                </p>
              </section>
              <section>
                <Label>How sure</Label>
                <p className="mt-1 font-mono text-[12px] text-muted-foreground">
                  90% range {r.purchase ? `${r.purchase.lo}–${r.purchase.hi}%` : r.engaged ? `${r.engaged.lo}–${r.engaged.hi}%` : "—"} · last 4 complete weeks · {r.exact ? "exact URL match" : "normalised URL match"} · no GA4 quality warnings
                </p>
              </section>
              <section className="space-y-2">
                <div className="flex items-center gap-2"><Label>Evidence to investigate</Label><EvidenceChip kind="Observed" /></div>
                <table className="w-full font-mono text-[11px]">
                  <thead><tr className="text-left text-muted-foreground"><th className="py-1 font-normal">Device</th><th className="font-normal">This page</th><th className="font-normal">Peers</th></tr></thead>
                  <tbody>
                    <tr className="border-t border-border"><td className="py-1">Mobile</td><td className="text-chart-5">1.9%</td><td>4.9%</td></tr>
                    <tr className="border-t border-border"><td className="py-1">Desktop</td><td>6.8%</td><td>7.4%</td></tr>
                  </tbody>
                </table>
                <div className="flex flex-wrap items-center gap-2">
                  <Link to="/dashboard/technical-health/cwv"><CwvEvidence cwv={r.cwv} /></Link>
                  <span className="rounded border border-border px-1.5 py-0.5 font-mono text-[10px]">Search mix similar to peers</span>
                </div>
                <p className="font-mono text-[11px] text-muted-foreground">Crawl: status 200 · indexable · H1 present · 1.2s response</p>
                <p className="font-mono text-[11px] text-muted-foreground">Change vs previous 4 weeks: −0.4 pts (no clear change)</p>
              </section>
              <section>
                <Label>Hypotheses (unproven)</Label>
                <ul className="mt-1 list-disc space-y-1 pl-5">
                  <li>Mobile visitors convert well below peers — review the mobile layout and route to checkout</li>
                  {!r.cwv.fallback && <li>LCP needs improvement on this page — speed may contribute</li>}
                </ul>
                <p className="mt-2 text-xs text-muted-foreground">These are leads to investigate, not established causes.</p>
              </section>
              <section className="grid grid-cols-2 gap-3 rounded-md border border-border p-3">
                <div>
                  <div className="flex items-center gap-1.5"><Label>Exposure</Label><EvidenceChip kind="Exposure" /></div>
                  <p className="mt-1 font-mono text-lg">{money(r.revenue.value)}{showMoney && r.revenue.value !== null && "/yr"}</p>
                </div>
                <div>
                  <div className="flex items-center gap-1.5"><Label>Est. opportunity</Label><EvidenceChip kind="Modelled" /><AssumptionInfo text={OPPORTUNITY_ASSUMPTION} /></div>
                  <p className="mt-1 font-mono text-lg">{showMoney && hasOutcome ? "£19k–£29k/yr" : "—"}</p>
                </div>
                <p className="col-span-2 font-mono text-[11px] text-muted-foreground">Effort: Not estimated</p>
              </section>
              <section className="flex flex-wrap gap-2">
                {["Worth investigating", "Not useful", "Explained by something else"].map((l) => (
                  <Button key={l} size="sm" variant={fb === l ? "secondary" : "outline"} onClick={() => setFb(l)}>{l}</Button>
                ))}
              </section>
              <Button asChild className="w-full">
                <Link to="/dashboard/user-experience/changes">Log a change</Link>
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
