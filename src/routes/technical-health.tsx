import { createFileRoute, Outlet } from "@tanstack/react-router";
import { DashboardNav } from "@/components/dashboard/DashboardNav";
import { TechHeader } from "@/components/technical/TechHeader";

export const Route = createFileRoute("/technical-health")({
  component: TechnicalHealthLayout,
});

function TechnicalHealthLayout() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <DashboardNav />

      <div className="lg:pl-56">
        <TechHeader />
        <Outlet />
      </div>
    </div>
  );
}
