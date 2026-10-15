import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/dashboard/ComingSoon";

export const Route = createFileRoute("/project/$projectId/dashboard/user-experience")({
  component: Page,
  head: () => ({
    meta: [
      { title: "User Experience — OrganicOS" },
      { name: "description", content: "Engagement, interaction and on-page behaviour signals scored against revenue impact." },
      { property: "og:title", content: "User Experience — OrganicOS" },
      { property: "og:description", content: "Engagement, interaction and on-page behaviour signals scored against revenue impact." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

function Page() {
  return <ComingSoon eyebrow="Growth driver" title="User Experience" description="Engagement, interaction and on-page behaviour signals scored against revenue impact." />;
}
