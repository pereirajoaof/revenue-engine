import { createFileRoute, Outlet } from "@tanstack/react-router";
import { DashboardNav } from "@/components/dashboard/DashboardNav";

export const Route = createFileRoute("/project/$projectId/dashboard/website-authority")({
  component: WebsiteAuthorityLayout,
});

function WebsiteAuthorityLayout() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-background text-foreground">
      <DashboardNav />
      <div className="lg:pl-56">
        <Outlet />
      </div>
    </div>
  );
}
