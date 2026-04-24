import { createFileRoute } from "@tanstack/react-router";
import { HeroKpis, BiggestOpportunities, PerformancePotentialChart } from "@/components/technical/CwvPages";

export const Route = createFileRoute("/technical-health/cwv/")({
  component: CwvOverviewIndexRoute,
});

function CwvOverviewIndexRoute() {
  return (
    <>
      <HeroKpis />
      <BiggestOpportunities />
      <PerformancePotentialChart />
    </>
  );
}
