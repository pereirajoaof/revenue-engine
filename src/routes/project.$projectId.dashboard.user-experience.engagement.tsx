import { createFileRoute } from "@tanstack/react-router";
import { LANDING, PINS, trajectory, uxHead } from "@/components/ux/data";
import { useUx } from "@/components/ux/state";
import { SignalGate } from "@/components/ux/SignalGate";
import { CRUMB_DASH, CRUMB_UX, DataTable, DotPlot, KpiStrip, MiniRange, OpenLink, Page, ScoreHero, Section, StatusPill, TopBar, UX_ROOT } from "@/components/ux/ui";

export const Route = createFileRoute("/project/$projectId/dashboard/user-experience/engagement")({
  component: Engagement,
  head: () => uxHead("Engagement", "Engaged-session share on organic landing pages compared with similar pages on the same site."),
});

const TYPES = [
  { type: "Product Category", sessions: 9840, share: "63%", prev: "+1 pt", yoy: "+2 pts", eligible: "28 / 34" },
  { type: "Product", sessions: 6120, share: "59%", prev: "0 pts", yoy: "+1 pt", eligible: "22 / 61" },
  { type: "Kits & Bundles", sessions: 2310, share: "62%", prev: "−1 pt", yoy: "—", eligible: "9 / 12" },
  { type: "Guides", sessions: 3210, share: "52%", prev: "+2 pts", yoy: "+4 pts", eligible: "18 / 40" },
];

const DOTS = [
  { page: "/oils/", obs: 54, lo: 50, hi: 58, peer: 63 },
  { page: "/blog/how-to-dose/", obs: 41, lo: 37, hi: 45, peer: 52 },
  { page: "/kits/", obs: 55, lo: 51, hi: 59, peer: 62 },
  { page: "/capsules/", obs: 56, lo: 52, hi: 60, peer: 63 },
  { page: "/gummies/", obs: 64, lo: 61, hi: 67, peer: 63 },
  { page: "/gifts/", obs: 70, lo: 66, hi: 73, peer: 63 },
  { page: "/sleep/", obs: 66, lo: 62, hi: 70, peer: 63 },
  { page: "/balms/", obs: 59, lo: 54, hi: 64, peer: 61 },
].map((d) => ({ ...d, obs: d.obs / 10, lo: d.lo / 10, hi: d.hi / 10, peer: d.peer / 10, below: d.hi < d.peer }));

function Engagement() {
  const { state } = useUx();
  return (
    <>
      <TopBar crumbs={[CRUMB_DASH, CRUMB_UX]} title="Engagement" meta={`Google Analytics: last 4 complete weeks${state === "stale" ? " · data up to 5 Oct" : ""}`} />
      <Page>
        <SignalGate signal="engagement">
          <ScoreHero
            score={81}
            description="61% of organic landing sessions are engaged, at 97% of the share seen on similar pages on this site."
            confidence="High"
            momentum={state === "stale" ? { label: "Not comparable", delta: "signals changed" } : { label: "Rising", delta: "+3" }}
            coverage="Covers 80% of sessions"
            weightLine="Counts for 20% of the User Experience Score"
            series={trajectory(74, 81, 26, 5)}
            pins={PINS}
          />
          <p className="rounded-md border border-border bg-surface px-4 py-2.5 text-sm text-muted-foreground">
            A short visit can still be a successful one — engagement is only judged against similar pages.
          </p>
          <KpiStrip
            items={[
              { label: "Engaged sessions", value: "61%", caption: "Google Analytics · 4 wks" },
              { label: "Attainment vs peers", value: "97%", caption: "Device-mix adjusted" },
              { label: "Eligible pages", value: "77", caption: "80% of sessions" },
              { label: "Pages below peers", value: "4", caption: "of 77 eligible" },
              { label: "Avg engagement time", value: "1m 12s", caption: "Google Analytics" },
            ]}
          />
          <Section title="Page types">
            <DataTable
              rows={TYPES}
              rowKey={(r) => r.type}
              cols={[
                { key: "t", label: "Page type", render: (r) => <span className="font-medium">{r.type}</span> },
                { key: "s", label: "Landing sessions", align: "right", render: (r) => r.sessions.toLocaleString("en-GB") },
                { key: "e", label: "Engaged share", align: "right", render: (r) => r.share },
                { key: "p", label: "vs previous 4 weeks", align: "right", render: (r) => r.prev },
                { key: "y", label: "vs same weeks last year", align: "right", render: (r) => r.yoy },
                { key: "el", label: "Eligible / total pages", align: "right", render: (r) => r.eligible },
              ]}
            />
          </Section>
          <div className="grid gap-5 xl:grid-cols-2">
            <Section title="Eligible pages vs similar pages" caption="Engaged share, scaled ×10 on the axis (e.g. 6 = 60%).">
              <DotPlot points={DOTS} />
            </Section>
            <Section title="Pages below similar pages" right={<OpenLink to={`${UX_ROOT}/landing-pages`}>View all in Landing pages</OpenLink>}>
              <DataTable
                rows={LANDING.filter((l) => l.eng && l.eng.hi < l.eng.peer)}
                rowKey={(r) => r.page}
                cols={[
                  { key: "p", label: "Page", render: (r) => <span className="font-mono text-xs">{r.page}</span> },
                  { key: "e", label: "Engaged vs peers", render: (r) => <MiniRange {...r.eng!} max={100} /> },
                  { key: "s", label: "Status", render: () => <StatusPill status="Below peers" /> },
                ]}
              />
            </Section>
          </div>
        </SignalGate>
      </Page>
    </>
  );
}
