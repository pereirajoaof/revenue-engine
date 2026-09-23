import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/dashboard/ComingSoon";

export const Route = createFileRoute("/project/$projectId/dashboard/links")({
  component: Page,
  head: () => ({
    meta: [
      { title: "Links — OrganicOS" },
      { name: "description", content: "External link acquisition, quality and decay tracking." },
      { property: "og:title", content: "Links — OrganicOS" },
      { property: "og:description", content: "External link acquisition, quality and decay tracking." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

function Page() {
  return <ComingSoon eyebrow="Growth driver" title="Links" description="External link acquisition, quality and decay tracking." />;
}
