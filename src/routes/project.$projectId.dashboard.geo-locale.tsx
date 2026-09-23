import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/dashboard/ComingSoon";

export const Route = createFileRoute("/project/$projectId/dashboard/geo-locale")({
  component: Page,
  head: () => ({
    meta: [
      { title: "Geo / Locale — OrganicOS" },
      { name: "description", content: "Market, language and hreflang coverage against local demand." },
      { property: "og:title", content: "Geo / Locale — OrganicOS" },
      { property: "og:description", content: "Market, language and hreflang coverage against local demand." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

function Page() {
  return <ComingSoon eyebrow="Growth driver" title="Geo / Locale" description="Market, language and hreflang coverage against local demand." />;
}
