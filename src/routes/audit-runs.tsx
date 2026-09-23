import { createFileRoute, redirect } from "@tanstack/react-router";
import { DEFAULT_PROJECT_ID } from "@/lib/app-link";

export const Route = createFileRoute("/audit-runs")({
  beforeLoad: () => {
    throw redirect({ to: "/project/$projectId/audit-runs", params: { projectId: DEFAULT_PROJECT_ID } });
  },
});
