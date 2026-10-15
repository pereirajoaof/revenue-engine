import { createFileRoute } from "@tanstack/react-router";
import { AppLink as Link } from "@/lib/app-link";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { GA4_FLAGS, SOURCES } from "@/lib/ux-data";
import { Card, IllustrativeNote, Label, SectionTitle, UxTopBar } from "@/components/ux/UxKit";

export const Route = createFileRoute("/project/$projectId/dashboard/user-experience/method")({
  component: Method,
  head: () => ({
    meta: [
      { title: "Data & method — User Experience — OrganicOS" },
      { name: "description", content: "Sources, coverage, GA4 quality flags and definitions behind the User Experience comparisons." },
      { property: "og:title", content: "Data & method — OrganicOS" },
      { property: "og:description", content: "How User Experience comparisons are built." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
});

const DEFS: [string, string][] = [
  ["Engaged session", "As defined in this GA4 property: a session lasting longer than 10 seconds, with a conversion event, or with 2+ page views."],
  ["Purchase rate", "Organic Search landing sessions that include a purchase, divided by all organic landing sessions on the page."],
  ["Peer-expected rate", "The rate of pages of the same page type, adjusted for this page's device mix, excluding the page itself."],
  ["Eligibility", "A page is compared when it has ≥100 sessions and ≥10 expected purchases in 4 weeks; otherwise we try 13 weeks."],
  ["Pages behave alike", "Differences between pages in a type are within what chance alone would produce, so no page is flagged individually."],
  ["About 3 flags expected by chance", "With 64 eligible pages and a 90% range, a few pages fall outside peer range even when nothing is different."],
  ["Evidence classes", "Observed: measured directly. Exposure: revenue currently on these pages — not lost, not recoverable. Modelled: an estimate under stated assumptions, never added to exposure."],
];

function Method() {
  return (
    <>
      <UxTopBar
        crumbs={[{ label: "Dashboard", to: "/dashboard" }, { label: "User Experience", to: "/dashboard/user-experience" }]}
        title="Data & method"
        meta="Last refreshed 14 Oct 2026"
      />
      <main className="space-y-6 px-6 py-6 lg:px-8">
        <Card>
          <SectionTitle title="Sources" />
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-border text-left font-mono text-[10px] uppercase tracking-wider text-muted-foreground">{["Source", "Date range", "Timezone", "Last refreshed", "Status"].map((h) => <th key={h} className="px-4 py-2 font-normal">{h}</th>)}</tr></thead>
              <tbody>
                {SOURCES.map((s) => (
                  <tr key={s.source} className="border-b border-border last:border-0 font-mono text-[12px]">
                    <td className="px-4 py-2.5 font-sans text-sm">{s.source}</td><td className="px-4">{s.range}</td><td className="px-4">{s.tz}</td><td className="px-4">{s.refreshed}</td>
                    <td className="px-4"><span className={`rounded-full border px-2 py-0.5 text-[10px] ${s.status === "Stale" ? "border-chart-4/50 text-chart-4" : "border-border text-muted-foreground"}`}>{s.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          {[["Matched URL share", "92%"], ["Matched GA4 session share", "71%"], ["Matched search click share", "83%"]].map(([l, v]) => (
            <Card key={l} className="p-4"><Label>{l}</Label><p className="mt-2 font-mono text-xl">{v}</p></Card>
          ))}
          <Card className="p-4">
            <Label>Sessions recorded per search click</Label>
            <p className="mt-2 font-mono text-xl">1.27</p>
            <p className="mt-1 text-[11px] text-muted-foreground">Differences come from definitions, consent, non-Google organic traffic and tracking. This is not tracking coverage.</p>
          </Card>
        </div>
        <p className="-mt-3 font-mono text-[11px] text-muted-foreground">A high URL match can still miss most traffic.</p>

        <Card>
          <SectionTitle title="GA4 quality flags" sub="Per week" />
          <table className="w-full font-mono text-[12px]">
            <thead><tr className="border-b border-border text-left text-[10px] uppercase tracking-wider text-muted-foreground">{["Week", "Thresholding", "Sampling", "'(other)' row"].map((h) => <th key={h} className="px-4 py-2 font-normal">{h}</th>)}</tr></thead>
            <tbody>{GA4_FLAGS.map((f) => (
              <tr key={f.week} className="border-b border-border last:border-0"><td className="px-4 py-2">{f.week}</td><td className={`px-4 ${f.thresholding !== "No" ? "text-chart-4" : ""}`}>{f.thresholding}</td><td className="px-4">{f.sampling}</td><td className="px-4">{f.other}</td></tr>
            ))}</tbody>
          </table>
        </Card>

        <Card>
          <SectionTitle title="Definitions" />
          <Accordion type="multiple" className="px-4">
            {DEFS.map(([k, v]) => (
              <AccordionItem key={k} value={k}><AccordionTrigger className="text-sm">{k}</AccordionTrigger><AccordionContent className="text-sm text-muted-foreground">{v}</AccordionContent></AccordionItem>
            ))}
          </Accordion>
        </Card>

        <Card className="flex flex-wrap items-center justify-between gap-2 p-4">
          <p className="text-sm">What counts as a completed visit: <b>Purchase</b></p>
          <Link to="/settings" className="text-xs font-medium text-primary hover:underline">Change in Settings</Link>
        </Card>
        <IllustrativeNote />
      </main>
    </>
  );
}
