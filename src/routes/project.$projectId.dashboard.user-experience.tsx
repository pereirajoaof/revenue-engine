import { createFileRoute, Outlet } from "@tanstack/react-router";
import { DashboardNav } from "@/components/dashboard/DashboardNav";
import { TooltipProvider } from "@/components/ui/tooltip";
import { MockStateSwitcher, UxStateProvider } from "@/components/ux/UxKit";

export const Route = createFileRoute("/project/$projectId/dashboard/user-experience")({
  component: UxLayout,
});

function UxLayout() {
  return (
    <UxStateProvider>
      <TooltipProvider delayDuration={150}>
        <div className="min-h-screen bg-background text-foreground">
          <DashboardNav />
          <div className="lg:pl-56">
            <Outlet />
          </div>
          <MockStateSwitcher />
        </div>
      </TooltipProvider>
    </UxStateProvider>
  );
}
