import { createFileRoute } from "@tanstack/react-router";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { AppLink as Link } from "@/lib/app-link";
import { BELOW_PEERS, DOTS, PAGE_TYPES, PINS, signalStatus, trajectory, uxHead } from "@/components/ux/data";
import { useUx } from "@/components/ux/state";
import { SignalGate } from "@/components/ux/SignalGate";
import {
  CRUMB_DASH,
  CRUMB_UX,
  DataTable,
  DotPlot,
  KpiStrip,
  MoneyChip,
  OpenLink,
  Page,
  Pill,
  ScoreHero,
  Section,
  TopBar,
  UX_ROOT,
} from "@/components/ux/ui";

export const Route = createFileRoute("/project/$projectId/dashboard/user-experience/conversion-efficiency/")({
  component: ConversionEfficiency,
  head: () => uxHead("Conversion Efficiency", "How organic landing pages convert compared with similar pages on the same site."),
});

type PT = (typeof PAGE_TYPES)[number];

export function PageTypesTable({ rateLabel }: { rateLabel: string }) {
  return (
    <DataTable<PT>
      rows={PAGE_TYPES}
      rowKey={(r) => r.slug}
      cols={[
        {
          key: "name",
          label: "Page type",
          render: (r) => (
            <Link
              to={`${UX_ROOT}/conversion-efficiency/$pageType`}
              params={{ pageType: r.slug }}
              className="font-medium hover:text-primary hover:underline"
            >
              {r.name}
            </Link>
          ),
        },
        { key: "s", label: "Landing sessions", align: "right", render: (r) => r.sessions.toLocaleString("en-GB"), sort: (r) => r.sessions },
        { key: "r", label: rateLabel, align: "right", render: (r) => `${r.rate}%`, sort: (r) => r.rate },
        { key: "p", label: "vs previous 4 weeks", align: "right", render: (r) => r.prev },
        { key: "y", label: "vs same weeks last year", align: "right", render: (r) => r.yoy },
        { key: "e", label: "Eligible / total pages", align: "right", render: (r) => r.eligible },
        {
          key: "b",
          label: "",
          render: (r) =>
            r.flags ? null : (
              <Tooltip>
                <TooltipTrigger asChild>
                  <span>
                    <Pill dashed>Pages behave alike — no page flags</Pill>
                  </span>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs text-xs">
                  Pages in this type convert at very similar rates, so comparing one page with its peers says little. Watch the type's trend instead.
                </TooltipContent>
              </Tooltip>
            ),
        },
      ]}
    />
  );
}

function ConversionEfficiency() {
  const { state, outcome } = useUx();
  const st = signalStatus(state, "conversion");
  return (
    <>
      <TopBar
        crumbs={[CRUMB_DASH, CRUMB_UX]}
        title="Conversion Efficiency"
        meta={`Outcome: ${outcome.outcome} · Google Analytics: last 4 complete weeks${state === "stale" ? " · data up to 5 Oct" : ""}`}
      />
      <Page>
        <SignalGate
          signal="conversion"
          keepWhenSmall={
            <Section title="Page types" caption="Page-type trends are still shown while individual pages are too small to compare.">
              <PageTypesTable rateLabel={outcome.rate} />
            </Section>
          }
        >
          <ScoreHero
            score={78}
            description={
              outcome.money
                ? "Organic landing pages achieve 91% of the purchase rate of similar pages on this site, after adjusting for device mix."
                : "Organic landing pages achieve 91% of the form submission rate of similar pages on this site, after adjusting for device mix."
            }
            confidence="High"
            momentum={state === "stale" ? { label: "Not comparable", delta: "signals changed" } : { label: "Stable", delta: "+1" }}
            coverage={`64 eligible pages · 72% of sessions${st.kind === "ok" && st.note ? ` · ${st.note}` : ""}`}
            weightLine="Counts for 45% of the User Experience Score"
            series={trajectory(70, 78, 26, 3)}
            pins={PINS}
          />
          <KpiStrip
            items={[
              { label: outcome.rate, value: outcome.money ? "4.8%" : "2.3%", caption: "Google Analytics · 4 wks" },
              { label: "Attainment vs peers", value: "91%", caption: "Device-mix adjusted" },
              { label: "Eligible pages", value: "64", caption: "72% of sessions" },
              ...(outcome.money
                ? [
                    { label: "Revenue on pages below peers", value: "£41.2k/yr", chip: <MoneyChip kind="Exposure" />, caption: "What these pages earn now" },
                    {
                      label: "Estimated opportunity",
                      value: "£6k–£14k/yr",
                      chip: <MoneyChip kind="Modelled" />,
                      caption: "Not a forecast",
                      info: "If these pages converted at the rate of similar pages on this site, with the same traffic and the page type's average order value. Not a forecast.",
                    },
                  ]
                : [{ label: "Pages below peers", value: "7", caption: "of 64 eligible" }]),
            ]}
          />
          <Section title="Page types" caption="Open a page type for its trend, device split and pages.">
            <PageTypesTable rateLabel={outcome.rate} />
          </Section>
          <div className="grid gap-5 xl:grid-cols-2">
            <Section title="Eligible pages vs similar pages" caption="Each dot is a page; the bar is its 90% range; the tick is the rate expected from similar pages.">
              <DotPlot points={DOTS} />
            </Section>
            <Section title="Pages below similar pages" caption="Top 5 by conservative shortfall" right={<OpenLink to={`${UX_ROOT}/landing-pages`}>View all in Landing pages</OpenLink>}>
              <DataTable
                rows={BELOW_PEERS}
                rowKey={(r) => r.page}
                cols={[
                  { key: "p", label: "Page", render: (r) => <span className="font-mono text-xs">{r.page}</span> },
                  { key: "t", label: "Type", render: (r) => <span className="text-xs text-muted-foreground">{r.type}</span> },
                  { key: "s", label: "Sessions", align: "right", render: (r) => r.sessions.toLocaleString("en-GB") },
                  { key: "r", label: "Rate vs peers", align: "right", render: (r) => `${r.obs}% vs ${r.peer}%` },
                  ...(outcome.money
                    ? [{ key: "e", label: "Revenue", align: "right" as const, render: (r: (typeof BELOW_PEERS)[number]) => <span className="inline-flex items-center gap-1.5">{r.exposure}/yr <MoneyChip kind="Exposure" /></span> }]
                    : []),
                ]}
              />
            </Section>
          </div>
        </SignalGate>
      </Page>
    </>
  );
}
