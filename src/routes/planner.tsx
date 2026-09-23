import { createFileRoute, redirect } from "@tanstack/react-router";
import { DEFAULT_PROJECT_ID } from "@/lib/app-link";

export const Route = createFileRoute("/planner")({
  beforeLoad: () => {
    throw redirect({ to: "/project/$projectId/planner", params: { projectId: DEFAULT_PROJECT_ID } });
  },
});
