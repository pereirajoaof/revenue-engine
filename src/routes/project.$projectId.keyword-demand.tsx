import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/dashboard/ComingSoon";

export const Route = createFileRoute("/project/$projectId/keyword-demand")({
  component: Page,
  head: () => ({
    meta: [
      { title: "Keyword Demand — OrganicOS" },
      { name: "description", content: "Demand curves and seasonality for the queries that drive your revenue." },
      { property: "og:title", content: "Keyword Demand — OrganicOS" },
      { property: "og:description", content: "Demand curves and seasonality for the queries that drive your revenue." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

function Page() {
  return <ComingSoon eyebrow="Workspace" title="Keyword Demand" description="Demand curves and seasonality for the queries that drive your revenue." />;
}
