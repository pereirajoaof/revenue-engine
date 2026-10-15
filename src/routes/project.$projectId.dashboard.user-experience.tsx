import { createFileRoute, Outlet } from "@tanstack/react-router";
import { DashboardNav } from "@/components/dashboard/DashboardNav";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import { UxStateProvider, MockStateSwitcher, useUx } from "@/components/ux/state";
import { LogChangeDialog } from "@/components/ux/LogChangeDialog";
import { SmallButton } from "@/components/ux/ui";

export const Route = createFileRoute("/project/$projectId/dashboard/user-experience")({
  component: UxLayout,
});

function StaleBanner() {
  const { state } = useUx();
  if (state !== "stale") return null;
  return (
    <div className="flex flex-col gap-2 border-b border-chart-4/30 bg-chart-4/10 px-6 py-2.5 text-sm sm:flex-row sm:items-center sm:justify-between lg:px-8">
      <span>Google Analytics data up to 5 Oct — reconnect to refresh</span>
      <SmallButton to="/settings">Reconnect</SmallButton>
    </div>
  );
}

function UxLayout() {
  return (
    <UxStateProvider>
      <TooltipProvider>
        <div className="min-h-screen bg-background text-foreground">
          <DashboardNav />
          <div className="lg:pl-56">
            <StaleBanner />
            <Outlet />
            <footer className="px-6 pb-20 pt-2 font-mono text-[10px] uppercase tracking-wider text-muted-foreground lg:px-8">
              Illustrative data · Northwind Botanicals (GBP)
            </footer>
          </div>
          <MockStateSwitcher />
          <LogChangeDialog />
          <Toaster />
        </div>
      </TooltipProvider>
    </UxStateProvider>
  );
}
