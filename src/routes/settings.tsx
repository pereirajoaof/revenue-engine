import { createFileRoute } from "@tanstack/react-router";
import { DashboardNav } from "@/components/dashboard/DashboardNav";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { SettingsPage } from "@/components/settings/SettingsPage";

export const Route = createFileRoute("/settings")({
  component: SettingsRoute,
  head: () => ({
    meta: [
      { title: "Project settings — OrganicOS" },
      {
        name: "description",
        content:
          "Manage project identity, economics, page types, brand keywords, markets, and recalculate analysis.",
      },
      { property: "og:title", content: "Project settings — OrganicOS" },
      {
        property: "og:description",
        content: "Configure your OrganicOS project and recalculate revenue insights.",
      },
    ],
  }),
});

function SettingsRoute() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <DashboardNav />
      <div className="lg:pl-56">
        <DashboardHeader />
        <main className="px-6 lg:px-8 py-6">
          <SettingsPage />
        </main>
      </div>
    </div>
  );
}
