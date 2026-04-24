import { createFileRoute } from "@tanstack/react-router";
import { CwvSectionNav, DeepDive } from "./technical-health.cwv";

export const Route = createFileRoute("/technical-health/cwv/deep-dive")({
  component: CwvDeepDivePage,
  head: () => ({
    meta: [
      { title: "CWV Page Type Deep Dive — OrganicOS" },
      { name: "description", content: "Analyse Core Web Vitals by page type, status, URL sample, and revenue impact." },
      { property: "og:title", content: "CWV Page Type Deep Dive — OrganicOS" },
      { property: "og:description", content: "A technical SEO view of Core Web Vitals performance by page type and URL." },
    ],
  }),
});

function CwvDeepDivePage() {
  return (
    <main className="space-y-6 px-6 py-6 lg:px-8">
      <CwvSectionNav />
      <DeepDive />
    </main>
  );
}