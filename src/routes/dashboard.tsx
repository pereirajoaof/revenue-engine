import { createFileRoute } from "@tanstack/react-router";
import { DashboardNav } from "@/components/dashboard/DashboardNav";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { KpiRow } from "@/components/dashboard/KpiRow";
import { RevenueChart } from "@/components/dashboard/RevenueChart";
import { OpportunityTable } from "@/components/dashboard/OpportunityTable";
import { ImpactEffortMatrix } from "@/components/dashboard/ImpactEffortMatrix";
import { TopOpportunities } from "@/components/dashboard/TopOpportunities";
import { RevenueByPageType } from "@/components/dashboard/RevenueByPageType";

export const Route = createFileRoute("/dashboard")({
  component: DashboardPage,
  head: () => ({
    meta: [
      { title: "Revenue & Opportunities — OrganicOS" },
      {
        name: "description",
        content:
          "Track organic revenue performance, identify the biggest revenue opportunities, and decide what to fix next.",
      },
      { property: "og:title", content: "Revenue & Opportunities — OrganicOS" },
      {
        property: "og:description",
        content: "The decision dashboard for organic growth: revenue, potential, gap, and prioritised actions.",
      },
    ],
  }),
});

function DashboardPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <DashboardNav />

      <div className="lg:pl-56">
        <DashboardHeader />

        <main className="px-6 lg:px-8 py-6 space-y-6">
          <KpiRow />

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <div className="xl:col-span-2">
              <RevenueChart />
            </div>
            <TopOpportunities />
          </div>

          <OpportunityTable />

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <ImpactEffortMatrix />
            <RevenueByPageType />
          </div>
        </main>
      </div>
    </div>
  );
}
