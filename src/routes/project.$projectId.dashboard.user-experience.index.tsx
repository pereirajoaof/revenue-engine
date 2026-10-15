import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppLink as Link } from "@/lib/app-link";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { LANDING_ROWS, PAGE_TYPES, type LandingRow } from "@/lib/ux-data";
import {
  AssumptionInfo,
  Card,
  EvidenceChip,
  IllustrativeNote,
  Label,
  OPPORTUNITY_ASSUMPTION,
  SectionTitle,
  Signed,
  SourceChip,
  UxTopBar,
  UxControls,
  useUx,
} from "@/components/ux/UxKit";
import { FindingDrawer, LandingTable } from "@/components/ux/LandingTable";
import { BuildingState, StaleBanner, StateNotices, UnmappedBanner } from "@/components/ux/StateBlocks";

export const Route = createFileRoute("/project/$projectId/dashboard/user-experience/")({
  component: Overview,
  head: () => ({
    meta: [
      { title: "User Experience — OrganicOS" },
      { name: "description", content: "Organic landing pages compared with similar pages on this site: engagement, outcomes and evidence to investigate." },
      { property: "og:title", content: "User Experience — OrganicOS" },
      { property: "og:description", content: "Organic landing pages compared with similar pages on this site." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
});

function Stat({ label, value, chip, sub, info }: { label: string; value: string; chip?: React.ReactNode; sub: string; info?: React.ReactNode }) {
  return (
    <Card className="p-4">
      <div className="flex items-center gap-1.5"><Label>{label}</Label>{info}</div>
      <div className="mt-2 flex items-baseline gap-2"><p className="font-mono text-xl font-semibold">{value}</p>{chip}</div>
      <p className="mt-1 text-[11px] text-muted-foreground">{sub}</p>
    </Card>
  );
}

function Overview() {
  const ux = useUx();
  const { state, hasGA4, hasOutcome, outcomeRate, showMoney } = ux;
  const [open, setOpen] = useState<LandingRow | null>(null);
  const meta = hasGA4
    ? `GA4 · Organic Search sessions · 15 Sep–12 Oct (Europe/London) · Search Console 15 Sep–12 Oct (Pacific time) · Core Web Vitals last measured 1 Jun (stale)`
    : `Search Console 15 Sep–12 Oct (Pacific time) · Core Web Vitals last measured 1 Jun (stale)`;
  const below = LANDING_ROWS.filter((r) => (hasOutcome ? r.status : r.engagedStatus) === "Below peers").slice(0, 5);

  return (
    <>
      <UxTopBar
        crumbs={[{ label: "Dashboard", to: "/dashboard" }]}
        title="User Experience"
        subtitle="Organic landing pages compared with similar pages on this site"
        meta={meta}
        controls={<UxControls />}
      />
      <main className="space-y-6 px-6 py-6 lg:px-8">
        {state === "new" ? (
          <BuildingState />
        ) : (
          <>
            <StaleBanner />
            <UnmappedBanner />
            <StateNotices />

            {/* a) Summary strip */}
            {state !== "small" && (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {hasOutcome ? (
                  <Stat label={`Below peers on ${outcomeRate.toLowerCase()}`} value="7 of 64 eligible pages" sub="18% of organic landing sessions · GA4 · last 4 weeks" />
                ) : hasGA4 ? (
                  <Stat label="Engaged share below peers" value="5 of 64 eligible pages" sub="12% of organic landing sessions · GA4 · last 4 weeks" />
                ) : (
                  <Stat label="Search clicks" value="48,210" sub="Search Console · 15 Sep–12 Oct" />
                )}
                {hasGA4 ? (
                  <Stat label="Revenue on these pages" value={showMoney ? "£41.2k/yr" : "—"} chip={<EvidenceChip kind="Exposure" />} sub="From organic sessions that started on these pages (GA4) — not lost, not recoverable" />
                ) : (
                  <Stat label="Estimated revenue (allocated by search clicks)" value="£212k/yr" chip={<EvidenceChip kind="Modelled" />} sub="Search Console clicks × page-type value · last 4 weeks" />
                )}
                {hasOutcome ? (
                  <Stat label="Estimated opportunity" value={showMoney ? "£6k–£14k/yr" : "—"} chip={<EvidenceChip kind="Modelled" />} info={<AssumptionInfo text={OPPORTUNITY_ASSUMPTION} />} sub="Modelled · GA4 · last 4 weeks · not additive with exposure" />
                ) : (
                  <Stat label="CWV coverage" value="1 of 412" sub="Product pages with field data · CrUX · last measured 1 Jun" />
                )}
                <Stat label="Evidence coverage" value="64 eligible · 212 insufficient · 31 unmatched" sub={hasGA4 ? "Matched GA4 sessions 71% · matched search clicks 83%" : "Matched search clicks 83%"} />
              </div>
            )}

            {/* b) Arrive · Engage · Complete */}
            <Card>
              <div className="grid grid-cols-1 divide-y divide-border sm:grid-cols-3 sm:divide-x sm:divide-y-0">
                {[
                  { step: "Arrive", v: "48,210", m: "search clicks", src: "Search Console", on: true },
                  { step: "Engage", v: hasGA4 ? "61%" : "Unavailable", m: "engaged sessions", src: "GA4", on: hasGA4 },
                  { step: "Complete", v: hasOutcome ? (state === "leadgen" ? "2.3%" : "4.8%") : "Unavailable", m: state === "leadgen" ? "submission rate" : "purchase rate", src: "GA4", on: hasOutcome },
                ].map((s) => (
                  <Link key={s.step} to="/dashboard/user-experience/landing-pages" className="block p-4 hover:bg-surface/50">
                    <Label>{s.step}</Label>
                    <p className={`mt-1 font-mono text-lg ${s.on ? "" : "text-muted-foreground"}`}>{s.v}</p>
                    <p className="text-xs text-muted-foreground">{s.m} <SourceChip>{s.src}</SourceChip></p>
                  </Link>
                ))}
              </div>
              <p className="border-t border-border px-4 py-2 font-mono text-[10.5px] text-muted-foreground">Different sources and definitions — don't divide one by another.</p>
            </Card>

            {/* c) Page types */}
            <Card>
              <SectionTitle title="Page types" sub="Type-level patterns, no verdicts" />
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border text-left font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                      <th className="px-4 py-2 font-normal">Page type</th>
                      {hasGA4 ? <th className="px-3 py-2 text-right font-normal">Landing sessions</th> : <th className="px-3 py-2 text-right font-normal">Search clicks</th>}
                      {hasOutcome && <th className="px-3 py-2 text-right font-normal">{outcomeRate}</th>}
                      {hasOutcome && <th className="px-3 py-2 font-normal">vs previous 4 weeks</th>}
                      {hasOutcome && <th className="px-3 py-2 font-normal">vs same 4 weeks last year</th>}
                      {hasGA4 && <th className="px-3 py-2 text-right font-normal">Engaged share</th>}
                      <th className="px-3 py-2 text-right font-normal">Eligible / total</th>
                      <th className="px-4 py-2 font-normal" />
                    </tr>
                  </thead>
                  <tbody>
                    {PAGE_TYPES.map((t) => (
                      <tr key={t.slug} className="border-b border-border last:border-0 hover:bg-surface/50">
                        <td className="px-4 py-2.5">
                          <Link to="/dashboard/user-experience/page-types/$type" params={{ type: t.slug }} className="font-medium hover:text-primary">{t.name}</Link>
                        </td>
                        <td className="px-3 py-2.5 text-right font-mono text-[12px]">{(hasGA4 ? t.sessions : t.clicks).toLocaleString("en-GB")}</td>
                        {hasOutcome && <td className="px-3 py-2.5 text-right font-mono text-[12px]">{t.purchaseRate}%</td>}
                        {hasOutcome && <td className="px-3 py-2.5"><Signed {...t.vsPrev} /></td>}
                        {hasOutcome && <td className="px-3 py-2.5"><Signed {...t.vsYoY} /></td>}
                        {hasGA4 && <td className="px-3 py-2.5 text-right font-mono text-[12px]">{t.engaged}%</td>}
                        <td className="px-3 py-2.5 text-right font-mono text-[12px]">{t.eligible} / {t.total}</td>
                        <td className="px-4 py-2.5">
                          {t.alike && hasGA4 && (
                            <Tooltip>
                              <TooltipTrigger className="rounded-full border border-dashed border-border px-2 py-0.5 font-mono text-[10px] text-muted-foreground">Pages behave alike — no page flags</TooltipTrigger>
                              <TooltipContent className="max-w-xs">Page-to-page differences in this type are within normal variation, so we don't flag individual pages.</TooltipContent>
                            </Tooltip>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>

            {/* d) Landing pages to investigate */}
            {hasGA4 && state !== "small" && (
              <Card>
                <SectionTitle
                  title="Landing pages to investigate"
                  sub={`Top 5 below peers · ${hasOutcome ? outcomeRate.toLowerCase() : "engaged share"} · GA4 · last 4 weeks`}
                  right={<Link to="/dashboard/user-experience/landing-pages" className="text-xs font-medium text-primary hover:underline">View all landing pages →</Link>}
                />
                <LandingTable rows={below} onOpen={setOpen} />
              </Card>
            )}
            {!hasGA4 && (
              <Card>
                <SectionTitle title="Landing pages" sub="Search context only · Search Console · last 4 weeks" right={<Link to="/dashboard/user-experience/landing-pages" className="text-xs font-medium text-primary hover:underline">View all landing pages →</Link>} />
                <LandingTable rows={LANDING_ROWS.slice(0, 5)} />
              </Card>
            )}
          </>
        )}
        <IllustrativeNote />
      </main>
      <FindingDrawer row={open} onClose={() => setOpen(null)} />
    </>
  );
}
