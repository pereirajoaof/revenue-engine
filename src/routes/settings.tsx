import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { DashboardNav } from "@/components/dashboard/DashboardNav";
import { SettingsHeaderBar } from "@/components/settings/SettingsHeaderBar";
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
  const [dirty, setDirty] = useState<Set<string>>(new Set());

  const markDirty = (section: string) => {
    setDirty((prev) => {
      if (prev.has(section)) return prev;
      const next = new Set(prev);
      next.add(section);
      return next;
    });
  };

  const handleSaveAll = () => {
    setDirty(new Set());
    toast.success("Settings saved", {
      description: "Run analysis to apply changes to historical data.",
    });
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <DashboardNav />
      <div className="lg:pl-56">
        <SettingsHeaderBar dirtyCount={dirty.size} onSaveAll={handleSaveAll} />
        <main className="px-6 lg:px-8 py-6">
          <SettingsPage dirty={dirty} markDirty={markDirty} />
        </main>
      </div>
    </div>
  );
}
