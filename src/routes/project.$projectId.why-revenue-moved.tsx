import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/dashboard/ComingSoon";

export const Route = createFileRoute("/project/$projectId/why-revenue-moved")({
  component: Page,
  head: () => ({
    meta: [
      { title: "Why revenue moved — OrganicOS" },
      { name: "description", content: "Week-over-week explanation of revenue changes, linked from the Monday email." },
      { property: "og:title", content: "Why revenue moved — OrganicOS" },
      { property: "og:description", content: "Week-over-week explanation of revenue changes, linked from the Monday email." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

function Page() {
  return <ComingSoon eyebrow="Weekly digest" title="Why revenue moved" description="Week-over-week explanation of revenue changes, linked from the Monday email." />;
}
