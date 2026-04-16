import { createFileRoute } from "@tanstack/react-router";
import { Nav } from "@/components/Nav";
import { Hero } from "@/components/Hero";
import { Pillars } from "@/components/Pillars";
import { CtaSection } from "@/components/CtaSection";
import { Footer } from "@/components/Footer";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "OrganicOS — Turn SEO Into a Revenue Engine" },
      { name: "description", content: "OrganicOS connects search demand directly to revenue. Quantify opportunity, deconstruct rankings, and connect every SEO action to business outcomes." },
      { property: "og:title", content: "OrganicOS — Turn SEO Into a Revenue Engine" },
      { property: "og:description", content: "The operating system for organic growth. Stop guessing, start growing revenue." },
    ],
  }),
});

function Index() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Nav />
      <Hero />
      <Pillars />
      <CtaSection />
      <Footer />
    </div>
  );
}
