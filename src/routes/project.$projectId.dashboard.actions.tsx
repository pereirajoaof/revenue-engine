import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/dashboard/ComingSoon";

export const Route = createFileRoute("/project/$projectId/dashboard/actions")({
  component: Page,
  head: () => ({
    meta: [
      { title: "All actions — OrganicOS" },
      { name: "description", content: "The full prioritised action list behind the top actions on the home screen." },
      { property: "og:title", content: "All actions — OrganicOS" },
      { property: "og:description", content: "The full prioritised action list behind the top actions on the home screen." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

function Page() {
  return <ComingSoon eyebrow="Revenue & Opportunities" title="All actions" description="The full prioritised action list behind the top actions on the home screen." />;
}
