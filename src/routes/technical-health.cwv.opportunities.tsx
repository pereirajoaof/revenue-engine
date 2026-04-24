import { createFileRoute } from "@tanstack/react-router";
import { CwvPageShell, OpportunitiesTable } from "@/components/technical/CwvPages";

export const Route = createFileRoute("/technical-health/cwv/opportunities")({
  component: OpportunitiesRoute,
  head: () => ({
    meta: [
      { title: "CWV Opportunities Table — OrganicOS" },
      {
        name: "description",
        content: "Review Core Web Vitals opportunities by revenue uplift, effort, ROI, and confidence.",
      },
    ],
  }),
});

function OpportunitiesRoute() {
  return (
    <CwvPageShell active="opportunities">
      <OpportunitiesTable />
    </CwvPageShell>
  );
}
