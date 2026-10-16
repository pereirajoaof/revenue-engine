import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/project/$projectId/dashboard/website-authority/internal-equity")({
  beforeLoad: ({ params }) => {
    throw redirect({ to: "/project/$projectId/dashboard/website-authority/distribution", params });
  },
});
