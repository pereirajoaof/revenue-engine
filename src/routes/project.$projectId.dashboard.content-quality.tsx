import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/dashboard/ComingSoon";

export const Route = createFileRoute("/project/$projectId/dashboard/content-quality")({
  component: Page,
  head: () => ({
    meta: [
      { title: "Content Quality — OrganicOS" },
      { name: "description", content: "Depth, freshness and helpfulness scoring across your indexable content." },
      { property: "og:title", content: "Content Quality — OrganicOS" },
      { property: "og:description", content: "Depth, freshness and helpfulness scoring across your indexable content." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

function Page() {
  return <ComingSoon eyebrow="Growth driver" title="Content Quality" description="Depth, freshness and helpfulness scoring across your indexable content." />;
}
