import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/dashboard/ComingSoon";

export const Route = createFileRoute("/project/$projectId/dashboard/opportunity/$pageType")({
  component: Page,
  head: () => ({
    meta: [
      { title: "Opportunity breakdown — OrganicOS" },
      { name: "description", content: "Revenue gap detail for a single page type." },
      { property: "og:title", content: "Opportunity breakdown — OrganicOS" },
      { property: "og:description", content: "Revenue gap detail for a single page type." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

function Page() {
  return <ComingSoon eyebrow="Revenue & Opportunities" title="Opportunity breakdown" description="Revenue gap detail for a single page type." />;
}
