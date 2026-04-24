import { createFileRoute, Outlet, useLocation } from "@tanstack/react-router";
import { DashboardNav } from "@/components/dashboard/DashboardNav";
import { TechHeader } from "@/components/technical/TechHeader";

export const Route = createFileRoute("/technical-health")({
  component: TechnicalHealthLayout,
});

function TechnicalHealthLayout() {
  const location = useLocation();
  const isCwvRoute = location.pathname.startsWith("/technical-health/cwv");
  const title = location.pathname === "/technical-health/cwv/deep-dive"
    ? "Page Type Deep Dive"
    : location.pathname === "/technical-health/cwv/opportunities"
      ? "Opportunities Table"
      : location.pathname === "/technical-health/cwv"
        ? "CWV Impact Overview"
        : "Technical Health";
  const eyebrow = isCwvRoute ? "Growth driver · Technical · CWV" : "Growth driver · Technical";

  return (
    <div className="min-h-screen bg-background text-foreground">
      <DashboardNav />

      <div className="lg:pl-56">
        <TechHeader title={title} eyebrow={eyebrow} />
        <Outlet />
      </div>
    </div>
  );
}
