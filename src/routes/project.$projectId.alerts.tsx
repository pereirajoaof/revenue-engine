import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/dashboard/ComingSoon";

export const Route = createFileRoute("/project/$projectId/alerts")({
  component: Page,
  head: () => ({
    meta: [
      { title: "Alerts — OrganicOS" },
      { name: "description", content: "Threshold and anomaly alerts for revenue, crawl health and visibility." },
      { property: "og:title", content: "Alerts — OrganicOS" },
      { property: "og:description", content: "Threshold and anomaly alerts for revenue, crawl health and visibility." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

function Page() {
  return <ComingSoon eyebrow="Workspace" title="Alerts" description="Threshold and anomaly alerts for revenue, crawl health and visibility." />;
}
