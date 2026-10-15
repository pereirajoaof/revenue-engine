import { createFileRoute } from "@tanstack/react-router";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { SIGNALS, uxHead } from "@/components/ux/data";
import { useUx } from "@/components/ux/state";
import { CRUMB_DASH, CRUMB_UX, DataTable, Page, Pill, Section, StatusPill, TopBar } from "@/components/ux/ui";
import { AppLink as Link } from "@/lib/app-link";

export const Route = createFileRoute("/project/$projectId/dashboard/user-experience/method")({
  component: Method,
  head: () => uxHead("Data & method", "How the User Experience score is built, its sources, coverage and definitions."),
});

const FORMULA: Record<string, string> = {
  conversion: "Each page's completed-visit rate vs similar pages, adjusted for device mix, weighted by sessions.",
  engagement: "Each page's engaged-session share vs similar pages, weighted by sessions.",
  "page-experience": "Share of search clicks landing on pages with good real-user speed and stability.",
  "search-appeal": "Clicks earned vs clicks expected for each result's position, across covered impressions.",
};

function Method() {
  const { outcome, state } = useUx();
  return (
    <>
      <TopBar crumbs={[CRUMB_DASH, CRUMB_UX]} title="Data & method" meta="Timezone Europe/London · last refreshed 7 Oct 06:00" />
      <Page>
        <Section title="How the score is built">
          <DataTable
            rows={SIGNALS}
            rowKey={(r) => r.key}
            cols={[
              { key: "n", label: "Signal", render: (r) => <span className="font-medium">{r.name}</span> },
              { key: "w", label: "Weight", align: "right", render: (r) => `${Math.round(r.weight * 100)}%` },
              { key: "s", label: "Score", align: "right", render: (r) => r.score },
              { key: "c", label: "Coverage", render: (r) => <span className="text-xs text-muted-foreground">{r.coverage}</span> },
              { key: "f", label: "Formula", render: (r) => <span className="text-xs">{FORMULA[r.key]}</span> },
            ]}
          />
          <ul className="mt-4 space-y-1 text-xs text-muted-foreground">
            <li>· Signals that aren't available drop out and the remaining weights are re-scaled.</li>
            <li>· Weights are provisional.</li>
          </ul>
        </Section>
        <div className="rounded-[0.625rem] border border-chart-4/30 bg-chart-4/10 p-4 text-sm">
          <p className="mb-1 font-mono text-[10px] uppercase tracking-wider text-chart-4">Known limitation</p>
          Conversion Efficiency and Engagement compare pages within this site. A site whose pages are all equally weak can still score well on them — check Momentum and the trend vs last year.
        </div>
        <Section title="Sources">
          <DataTable
            rows={[
              { s: "Google Analytics", range: "8 Sep – 5 Oct", tz: "Europe/London", refreshed: state === "stale" ? "5 Oct 23:10" : "7 Oct 06:00", status: state === "stale" ? "Stale" : "Fresh" },
              { s: "Search Console", range: "8 Sep – 5 Oct", tz: "America/Los_Angeles", refreshed: "7 Oct 05:40", status: "Fresh" },
              { s: "Real-user speed data", range: "28 days to 29 Sep", tz: "UTC", refreshed: "29 Sep", status: "16 days old" },
            ]}
            rowKey={(r) => r.s}
            cols={[
              { key: "s", label: "Source", render: (r) => r.s },
              { key: "r", label: "Date range", render: (r) => <span className="font-mono text-xs">{r.range}</span> },
              { key: "t", label: "Timezone", render: (r) => <span className="font-mono text-xs">{r.tz}</span> },
              { key: "f", label: "Last refreshed", render: (r) => <span className="font-mono text-xs">{r.refreshed}</span> },
              { key: "st", label: "Status", render: (r) => <StatusPill status={r.status} /> },
            ]}
          />
        </Section>
        <section className="grid gap-px overflow-hidden rounded-[0.625rem] border border-border bg-border sm:grid-cols-2 xl:grid-cols-4">
          {[
            { l: "Matched URL share", v: "88%", c: "landing URLs found in the crawl" },
            { l: "Matched GA4 session share", v: "71%", c: "sessions on matched URLs" },
            { l: "Matched search click share", v: "83%", c: "clicks on matched URLs" },
            { l: "Sessions recorded per search click", v: "1.27", c: "Diagnostic — not tracking coverage" },
          ].map((k) => (
            <div key={k.l} className="bg-card p-4">
              <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">{k.l}</p>
              <p className="mt-1.5 font-mono text-xl font-semibold">{k.v}</p>
              <p className="mt-1 font-mono text-[10px] text-muted-foreground">{k.c}</p>
            </div>
          ))}
        </section>
        <Section title="Google Analytics quality flags per week">
          <DataTable
            rows={[
              { w: "15 Sep", f: [] as string[] },
              { w: "22 Sep", f: ["Consent banner change logged"] },
              { w: "29 Sep", f: [] },
              { w: "6 Oct", f: state === "stale" ? ["Data incomplete after 5 Oct"] : [] },
            ]}
            rowKey={(r) => r.w}
            cols={[
              { key: "w", label: "Week of", render: (r) => <span className="font-mono text-xs">{r.w}</span> },
              { key: "f", label: "Flags", render: (r) => (r.f.length ? r.f.map((f) => <Pill key={f} className="border-chart-4/40 bg-chart-4/10 text-chart-4">{f}</Pill>) : <span className="font-mono text-xs text-muted-foreground">None</span>) },
            ]}
          />
        </Section>
        <Section title="Definitions">
          <p className="mb-3 text-sm">
            What counts as a completed visit: <span className="font-mono">{state === "no-outcome" ? "Not chosen" : outcome.outcome}</span> ·{" "}
            <Link to="/settings" className="text-primary hover:underline">Change in Settings</Link>
          </p>
          <Accordion type="multiple">
            {[
              ["Similar pages (peers)", "Pages of the same type on this site, adjusted for device mix. We never compare with other sites."],
              ["90% range", "The range in which the page's true rate very likely sits, given how many sessions it had."],
              ["Conservative shortfall", "The gap between the top of a page's range and its peer-expected rate. Used for sorting so small pages don't jump the queue."],
              ["Exposure", "Revenue the page earns now. Not an amount at stake."],
              ["Modelled", "What the page might earn at its peers' rate, with the same traffic. Not a forecast; never added to Exposure."],
              ["Real-user speed data", "Field measurements of loading, responsiveness and stability from real visitors, grouped by URL."],
            ].map(([t, d]) => (
              <AccordionItem key={t} value={t}>
                <AccordionTrigger className="text-sm">{t}</AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground">{d}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Section>
      </Page>
    </>
  );
}
