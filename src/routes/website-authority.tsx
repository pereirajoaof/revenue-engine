import { createFileRoute, redirect } from "@tanstack/react-router";
import { DEFAULT_PROJECT_ID } from "@/lib/app-link";

export const Route = createFileRoute("/website-authority")({
  beforeLoad: () => {
    throw redirect({ to: "/project/$projectId/dashboard/website-authority", params: { projectId: DEFAULT_PROJECT_ID } });
  },
});
