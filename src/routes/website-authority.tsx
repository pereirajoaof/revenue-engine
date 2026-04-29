import { createFileRoute, Outlet, useLocation } from "@tanstack/react-router";
import { DashboardNav } from "@/components/dashboard/DashboardNav";
import { ThemeToggle } from "@/components/ThemeToggle";

export const Route = createFileRoute("/website-authority")({
  component: WebsiteAuthorityLayout,
});

function WebsiteAuthorityLayout() {
  const location = useLocation();
  const title = location.pathname === "/website-authority/internal-equity" ? "Internal Equity" : "Website Authority";

  return (
    <div className="min-h-screen bg-background text-foreground">
      <DashboardNav />
      <div className="lg:pl-56">
        <header className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur">
          <div className="flex flex-col gap-4 px-6 py-5 lg:flex-row lg:items-center lg:justify-between lg:px-8">
            <div>
              <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Growth driver · Website Authority</p>
              <h1 className="mt-1 text-2xl font-bold tracking-tight">{title}</h1>
            </div>
            <ThemeToggle />
          </div>
        </header>
        <Outlet />
      </div>
    </div>
  );
}