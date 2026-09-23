import { createFileRoute, redirect } from "@tanstack/react-router";
import { DEFAULT_PROJECT_ID } from "@/lib/app-link";

export const Route = createFileRoute("/technical-health")({
  beforeLoad: () => {
    throw redirect({ to: "/project/$projectId/dashboard/technical-health", params: { projectId: DEFAULT_PROJECT_ID } });
  },
});
