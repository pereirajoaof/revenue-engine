import { createFileRoute } from "@tanstack/react-router";
import { CwvSectionNav, OpportunitiesTable } from "./technical-health.cwv";

export const Route = createFileRoute("/technical-health/cwv/opportunities")({
  component: CwvOpportunitiesPage,
  head: () => ({
    meta: [
      { title: "CWV Opportunities Table — OrganicOS" },
      { name: "description", content: "Prioritise Core Web Vitals fixes by revenue uplift, effort, ROI, and confidence." },
      { property: "og:title", content: "CWV Opportunities Table — OrganicOS" },
      { property: "og:description", content: "A prioritised Core Web Vitals opportunities table for product, SEO, and engineering teams." },
    ],
  }),
});

function CwvOpportunitiesPage() {
  return (
    <main className="space-y-6 px-6 py-6 lg:px-8">
      <CwvSectionNav />
      <OpportunitiesTable />
    </main>
  );
}