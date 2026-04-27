import { createFileRoute } from "@tanstack/react-router";
import { AuditRunOverview } from "@/components/audit-runs/AuditRunOverview";

export const Route = createFileRoute("/audit-runs/")({
  component: AuditRunOverviewRoute,
  head: () => ({
    meta: [
      { title: "Audit Run Overview — OrganicOS" },
      { name: "description", content: "Review crawl health, issue movement, URL funnels, and HTTP status breakdowns for an OrganicOS audit run." },
      { property: "og:title", content: "Audit Run Overview — OrganicOS" },
      { property: "og:description", content: "Crawl overview with health trends, issue diagnostics, URL cascade, and status-code depth analysis." },
    ],
  }),
});

function AuditRunOverviewRoute() {
  const { runId } = Route.useParams();
  return <AuditRunOverview runId={runId} />;
}
