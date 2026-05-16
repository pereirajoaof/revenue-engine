import { createFileRoute } from "@tanstack/react-router";
import { Nav } from "@/components/Nav";
import { Hero } from "@/components/Hero";
import { Pillars } from "@/components/Pillars";
import { Roadmap } from "@/components/Roadmap";
import { EarlyAccess } from "@/components/EarlyAccess";
import { Footer } from "@/components/Footer";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "OrganicOS — Stop Auditing Pixels. Start Auditing Revenue." },
      {
        name: "description",
        content:
          "The first data-driven SEO engine that translates technical health, domain authority, and content lifecycle into quantifiable revenue. Get founding-tier early access.",
      },
      { property: "og:title", content: "OrganicOS — Stop Auditing Pixels. Start Auditing Revenue." },
      {
        property: "og:description",
        content:
          "A financial translation layer for search marketing. Map topical drift, portfolio age, and technical debt to absolute revenue impact.",
      },
    ],
  }),
});

function Index() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Nav />
      <Hero />
      <Pillars />
      <Roadmap />
      <EarlyAccess />
      <Footer />
    </div>
  );
}
