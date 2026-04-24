import { createFileRoute, Outlet, useLocation } from "@tanstack/react-router";
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
  const location = useLocation();
  const active = location.pathname.endsWith("/page-type-deep-dive")
    ? "deep-dive"
    : location.pathname.endsWith("/opportunities")
      ? "opportunities"
      : "overview";

  return (
    <CwvPageShell active={active}>
      <Outlet />
    </CwvPageShell>
  );
}
