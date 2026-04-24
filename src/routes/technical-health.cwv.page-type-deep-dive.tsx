import { createFileRoute } from "@tanstack/react-router";
import { CwvPageShell, DeepDive } from "@/components/technical/CwvPages";

export const Route = createFileRoute("/technical-health/cwv/page-type-deep-dive")({
  component: PageTypeDeepDiveRoute,
  head: () => ({
    meta: [
      { title: "CWV Page Type Deep Dive — OrganicOS" },
      {
        name: "description",
        content: "Analyse Core Web Vitals performance by page type, URL, and revenue opportunity.",
      },
    ],
  }),
});

function PageTypeDeepDiveRoute() {
  return (
    <CwvPageShell active="deep-dive">
      <DeepDive />
    </CwvPageShell>
  );
}
