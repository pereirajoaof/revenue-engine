import { motion } from "framer-motion";
import { Target, Clock, Coins, Users, Sparkles } from "lucide-react";

const pillars = [
  {
    number: "01",
    icon: Target,
    title: "Site focus & topical spread",
    problem:
      "Content capital misallocation. Pages outside your core strategy dilute authority and leak revenue.",
    solution:
      "We map up to 2,000 URLs into K-Means semantic clusters with precise centroids and cosine distances — so you see exactly which clusters build your identity and how much cash is trapped in misallocations.",
    details: [
      "K-Means semantic clustering",
      "Centroid & cosine distance maps",
      "Quantified revenue leakage",
    ],
  },
  {
    number: "02",
    icon: Clock,
    title: "Portfolio age distributions",
    problem:
      "Lifecycle imbalances. Growing too fast looks exploratory; legacy decay caps your baseline trust.",
    solution:
      "We pull chronological markers from GSC history, GA4 sessions, and Wayback archives to plot an impression-weighted maturity curve — surfacing the exact CTR outliers hiding inside your age cohorts.",
    details: [
      "3-tier chronological hierarchy",
      "Impression-weighted maturity curve",
      "Cross-cohort CTR outliers",
    ],
  },
  {
    number: "03",
    icon: Coins,
    title: "Integrated revenue linkage",
    problem:
      "Technical debt lists are an unprioritized mile long, sorted by abstract severity not impact.",
    solution:
      "OrganicOS maps Chrome UX Report (CrUX) real-user metrics and technical anomalies directly to systemic value curves — prioritizing your roadmap by absolute revenue impact.",
    details: [
      "CrUX real-user metric mapping",
      "Anomaly → revenue translation",
      "Roadmap sorted by £ impact",
    ],
  },
  {
    number: "04",
    icon: Users,
    title: "Brand & competitor analysis",
    problem:
      "SEO data is inherently self-referential. Measuring your topical authority or domain age in a vacuum hides aggressive competitor land grabs and masks critical baseline deficits.",
    solution:
      "OrganicOS overlays competitor domain age trends and imports competitor topical spreads into your project space. We cross-reference your unweighted mean CTR values against competitor benchmarks, making your self-referential scores fully contextual.",
    details: [
      "Competitor domain age benchmarking",
      "External topical spread comparisons",
      "Contextual CTR benchmark overlays",
    ],
  },
  {
    number: "05",
    icon: Sparkles,
    title: "AI search share of market",
    problem:
      "Traditional GSC impression data completely misses modern conversational search engines, leaving brands blind to how they are referenced as sources in LLM search layouts.",
    solution:
      "We pull semantic topic metrics and track brand term citations across conversational engines. By feeding these insights into our geometric mean scoring system, you see exactly where your content builds market share in AI answers — and where your visibility is decaying.",
    details: [
      "LLM citation & brand term tracking",
      "AI search visibility metrics",
      "Algorithmic share-of-market maps",
    ],
  },
];

export function Pillars() {
  return (
    <section className="px-6 py-32">
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="mb-16 max-w-2xl"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-sm font-mono text-primary uppercase tracking-wider mb-4">
            The core value proposition
          </p>
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight leading-[1.05]">
            A financial translation layer<br />for search marketing.
          </h2>
          <p className="mt-5 text-muted-foreground leading-relaxed">
            Not another crawler. Five pillars that turn every signal — semantic, temporal,
            technical, competitive, and algorithmic — into a number a CFO understands.
          </p>
        </motion.div>

        <div className="space-y-6">
          {pillars.map((pillar, i) => {
            const Icon = pillar.icon;
            return (
              <motion.div
                key={pillar.number}
                className="group relative rounded-2xl border border-border bg-card p-8 sm:p-10 hover:border-primary/30 transition-colors"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
              >
                <div className="flex flex-col lg:flex-row lg:items-start gap-8">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-sm font-mono text-primary">{pillar.number}</span>
                      <div className="h-px flex-1 max-w-12 bg-border" />
                      <Icon className="w-4 h-4 text-primary" />
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-bold mb-5">{pillar.title}</h3>
                    <div className="space-y-3 max-w-xl">
                      <div>
                        <p className="text-[10px] font-mono uppercase tracking-wider text-chart-5 mb-1">
                          Problem
                        </p>
                        <p className="text-sm text-muted-foreground leading-relaxed">{pillar.problem}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-mono uppercase tracking-wider text-primary mb-1">
                          Solution
                        </p>
                        <p className="text-sm text-foreground leading-relaxed">{pillar.solution}</p>
                      </div>
                    </div>
                  </div>

                  <div className="lg:w-72 shrink-0 lg:border-l lg:border-border lg:pl-8">
                    <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-4">
                      What ships
                    </p>
                    <div className="space-y-3">
                      {pillar.details.map((d) => (
                        <div key={d} className="flex items-start gap-3">
                          <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                          <span className="text-sm text-surface-foreground">{d}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
