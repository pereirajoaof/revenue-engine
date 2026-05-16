import { createFileRoute } from "@tanstack/react-router";
import { Nav } from "@/components/Nav";
import { Hero } from "@/components/Hero";
import { Pillars } from "@/components/Pillars";
import { Roadmap } from "@/components/Roadmap";
import { EarlyAccess } from "@/components/EarlyAccess";
import { Footer } from "@/components/Footer";

export const Route = createFileRoute("/early-access")({
  component: EarlyAccessLanding,
  head: () => ({
    meta: [
      { title: "OrganicOS Early Access — Stop Auditing Pixels. Start Auditing Revenue." },
      {
        name: "description",
        content:
          "Join the OrganicOS early access queue. Founding-tier pricing and direct roadmap input on the SEO engine that translates technical health, brand equity, and AI search share into revenue.",
      },
      {
        property: "og:title",
        content: "OrganicOS Early Access — Stop Auditing Pixels. Start Auditing Revenue.",
      },
      {
        property: "og:description",
        content:
          "A financial translation layer for search marketing. Reserve founding-tier access.",
      },
    ],
  }),
});

function EarlyAccessLanding() {
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
