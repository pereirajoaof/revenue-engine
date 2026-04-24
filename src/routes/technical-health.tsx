import { createFileRoute, Outlet, useLocation } from "@tanstack/react-router";
import { DashboardNav } from "@/components/dashboard/DashboardNav";
import { TechHeader } from "@/components/technical/TechHeader";

export const Route = createFileRoute("/technical-health")({
  component: TechnicalHealthLayout,
});

function TechnicalHealthLayout() {
  const location = useLocation();
  const title = location.pathname === "/technical-health/cwv" ? "CWV Impact Overview" : "Technical Health";

  return (
    <div className="min-h-screen bg-background text-foreground">
      <DashboardNav />

      <div className="lg:pl-56">
        <TechHeader title={title} />
        <Outlet />
      </div>
    </div>
  );
}
