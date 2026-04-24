import { createFileRoute, Outlet } from "@tanstack/react-router";
import { CwvPageShell } from "@/components/technical/CwvPages";

export const Route = createFileRoute("/technical-health/cwv")({
  component: CwvLayoutRoute,
  head: () => ({
    meta: [
      { title: "CWV Impact Overview — OrganicOS" },
      {
        name: "description",
        content: "Prioritise Core Web Vitals engineering work by revenue at risk, ROI, and confidence.",
      },
      { property: "og:title", content: "CWV Impact Overview — OrganicOS" },
      {
        property: "og:description",
        content: "A revenue-first Core Web Vitals dashboard for deciding where engineering time creates the most upside.",
      },
    ],
  }),
});

function CwvLayoutRoute() {
  return (
    <CwvPageShell active="overview">
      <Outlet />
    </CwvPageShell>
  );
}
