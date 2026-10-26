import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "OrganicOS — Organic Growth Intelligence" },
      { name: "description", content: "Discover OrganicOS early access for revenue-led organic growth intelligence." },
      { property: "og:title", content: "OrganicOS — Organic Growth Intelligence" },
      { property: "og:description", content: "Discover OrganicOS early access for revenue-led organic growth intelligence." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  beforeLoad: () => {
    throw redirect({ to: "/early-access" });
  },
});
