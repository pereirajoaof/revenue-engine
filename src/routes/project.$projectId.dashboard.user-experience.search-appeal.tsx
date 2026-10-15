import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { APPEAL, PINS, trajectory, uxHead } from "@/components/ux/data";
import { CRUMB_DASH, CRUMB_UX, DataTable, KpiStrip, Page, ScoreHero, Section, Segmented, TopBar } from "@/components/ux/ui";

export const Route = createFileRoute("/project/$projectId/dashboard/user-experience/search-appeal")({
  component: SearchAppeal,
  head: () => uxHead("Search Appeal", "How many clicks search results earn compared with what is expected for their positions."),
});

type Row = (typeof APPEAL)["branded"]["above"][number];

function AppealTable({ rows }: { rows: Row[] }) {
  return (
    <DataTable
      rows={rows}
      rowKey={(r) => r.page}
      cols={[
        { key: "p", label: "Page", render: (r) => <span className="font-mono text-xs">{r.page}</span> },
        { key: "i", label: "Impressions", align: "right", render: (r) => r.impr.toLocaleString("en-GB"), sort: (r) => r.impr },
        { key: "po", label: "Position", align: "right", render: (r) => r.pos.toFixed(1) },
        { key: "c", label: "CTR", align: "right", render: (r) => `${r.ctr.toFixed(1)}%` },
        { key: "e", label: "Expected CTR", align: "right", render: (r) => `${r.exp.toFixed(1)}%` },
        {
          key: "g",
          label: "Gap",
          align: "right",
          sort: (r) => r.ctr - r.exp,
          render: (r) => {
            const g = r.ctr - r.exp;
            return <span className={g < 0 ? "text-chart-5" : "text-chart-1"}>{g > 0 ? "+" : "−"}{Math.abs(g).toFixed(1)} pts</span>;
          },
        },
      ]}
    />
  );
}

function SearchAppeal() {
  const [mode, setMode] = useState<"non-branded" | "branded">("non-branded");
  const data = APPEAL[mode];
  return (
    <>
      <TopBar
        crumbs={[CRUMB_DASH, CRUMB_UX]}
        title="Search Appeal"
        meta="Search Console: last 4 complete weeks"
        controls={
          <Segmented
            value={mode}
            onChange={setMode}
            options={[
              { value: "non-branded", label: "Non-branded" },
              { value: "branded", label: "Branded" },
            ]}
          />
        }
      />
      <Page>
        <ScoreHero
          score={62}
          description="Your results earn 94% of the clicks expected for their positions. This is the moment before the visit."
          confidence="High"
          momentum={{ label: "Stable", delta: "+1" }}
          coverage="Covers 77% of impressions"
          weightLine="Counts for 15% of the User Experience Score"
          series={trajectory(59, 62, 26, 9)}
          pins={PINS}
        />
        <KpiStrip
          items={[
            { label: "CTR vs expected", value: "94%", caption: "Search Console" },
            { label: "Impressions covered", value: "77%", caption: "of all impressions" },
            { label: "Fewer clicks than expected", value: "31 pages", caption: "for their position" },
            { label: "More clicks than expected", value: "18 pages", caption: "for their position" },
            { label: "Avg position", value: "6.4", caption: "covered queries" },
          ]}
        />
        <Section title="Fewer clicks than expected for position" caption={mode === "branded" ? "Branded queries" : "Non-branded queries"}>
          <AppealTable rows={data.below} />
        </Section>
        <Section title="More clicks than expected for position" caption={mode === "branded" ? "Branded queries" : "Non-branded queries"}>
          <AppealTable rows={data.above} />
        </Section>
      </Page>
    </>
  );
}
