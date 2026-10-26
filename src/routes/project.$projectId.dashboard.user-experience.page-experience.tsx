import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ChevronDown, Gauge } from "lucide-react";
import { MEASURED, NOT_MEASURED, PE_COVERAGE, PINS, trajectory, uxHead } from "@/components/ux/data";
import { SignalGate } from "@/components/ux/SignalGate";
import { CRUMB_DASH, CRUMB_UX, DataTable, KpiStrip, Page, Pill, ScoreHero, Section, SmallButton, StatusPill, TopBar } from "@/components/ux/ui";

export const Route = createFileRoute("/project/$projectId/dashboard/user-experience/page-experience")({
  component: PageExperience,
  head: () => uxHead("Page Experience", "Share of search clicks landing on pages with good real-user speed and stability."),
});

function PageExperience() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <TopBar
        crumbs={[CRUMB_DASH, CRUMB_UX]}
        title="Page Experience"
        meta="Real-user speed data: measured 29 Sep · Search Console: last 4 complete weeks"
        controls={<SmallButton to="/technical-health/cwv"><Gauge className="h-3.5 w-3.5" />Open Core Web Vitals in Technical Health</SmallButton>}
      />
      <Page>
        <SignalGate signal="page-experience">
          <ScoreHero
            score={58}
            description="58% of search clicks on measured pages land on pages with good real-user speed and stability."
            confidence="Medium"
            momentum={{ label: "Stable", delta: "0" }}
            coverage="41% of clicks measured"
            weightLine="Counts for 20% of the User Experience Score"
            series={trajectory(55, 58, 26, 7)}
            pins={PINS}
          />
          <KpiStrip
            items={[
              { label: "Clicks on good pages", value: "58%", caption: "of measured clicks" },
              { label: "Measured clicks", value: "17,780", caption: "Search Console" },
              { label: "Clicks measured", value: "41%", caption: "of all search clicks" },
              { label: "Pages measured", value: "38", caption: "own-URL real-user speed data" },
              { label: "Data age", value: "16 days", caption: "measured 29 Sep" },
            ]}
          />
          <Section title="Measured clicks by status">
            <div className="flex h-6 overflow-hidden rounded-md font-mono text-[10px]">
              <div className="flex items-center bg-chart-1/80 px-2 text-primary-foreground" style={{ width: "46%" }}>Good 46%</div>
              <div className="flex items-center bg-chart-4/80 px-2 text-primary-foreground" style={{ width: "33%" }}>Needs improvement 33%</div>
              <div className="flex items-center bg-chart-5/80 px-2 text-primary-foreground" style={{ width: "21%" }}>Poor 21%</div>
            </div>
          </Section>
          <Section title="Coverage by page type" caption="Measured pages hold 41% of clicks overall.">
            <div className="space-y-2">
              {PE_COVERAGE.map((c) => (
                <div key={c.type} className="grid grid-cols-[130px_1fr_40px] items-center gap-3 text-xs">
                  <span className="truncate">{c.type}</span>
                  <div className="h-2 rounded-full bg-surface">
                    <div className="h-2 rounded-full bg-chart-3" style={{ width: `${c.share}%` }} />
                  </div>
                  <span className="text-right font-mono">{c.share}%</span>
                </div>
              ))}
            </div>
          </Section>
          <Section title="Measured pages">
            <DataTable
              rows={MEASURED}
              rowKey={(r) => r.page}
              cols={[
                { key: "p", label: "Page", render: (r) => <span className="font-mono text-xs">{r.page}</span> },
                { key: "c", label: "Clicks", align: "right", render: (r) => r.clicks.toLocaleString("en-GB"), sort: (r) => r.clicks },
                { key: "l", label: "LCP", align: "right", render: (r) => r.lcp },
                { key: "i", label: "INP", align: "right", render: (r) => r.inp },
                { key: "cl", label: "CLS", align: "right", render: (r) => r.cls },
                { key: "s", label: "Status", render: (r) => <StatusPill status={r.status} /> },
              ]}
            />
          </Section>
          <section className="rounded-[4px] border border-border bg-card">
            <button type="button" onClick={() => setOpen((v) => !v)} className="flex w-full items-center justify-between px-5 py-3.5 text-left" aria-expanded={open}>
              <div>
                <h2 className="text-sm font-semibold">Not measured on its own URL · {NOT_MEASURED.length}</h2>
                <p className="mt-0.5 text-xs text-muted-foreground">Not counted in this score — measured on another URL.</p>
              </div>
              <ChevronDown className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`} />
            </button>
            {open && (
              <div className="border-t border-border p-5">
                <DataTable
                  rows={NOT_MEASURED}
                  rowKey={(r) => r.page}
                  cols={[
                    { key: "p", label: "Page", render: (r) => <span className="font-mono text-xs">{r.page}</span> },
                    { key: "c", label: "Clicks", align: "right", render: (r) => r.clicks.toLocaleString("en-GB") },
                    { key: "f", label: "Speed data from", render: (r) => <Pill dashed>{r.from}</Pill> },
                  ]}
                />
              </div>
            )}
          </section>
        </SignalGate>
      </Page>
    </>
  );
}
