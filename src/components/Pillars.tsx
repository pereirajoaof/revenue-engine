import { motion } from "framer-motion";

const pillars = [
  {
    number: "01",
    title: "Quantify your real opportunity",
    description:
      "Map competitor visibility and keyword demand, translated into your revenue using your conversion rates and AOV.",
    insight: '"This page type is worth £X in revenue if you win."',
    details: [
      "Total Addressable Market (TAM) in revenue",
      "Competitor visibility mapping",
      "Revenue-weighted keyword scoring",
    ],
  },
  {
    number: "02",
    title: "Deconstruct ranking into levers",
    description:
      "Break SEO into clear ranking factor groups and see where you're underperforming and what improvement unlocks the most revenue.",
    insight: "Move from guessing → to prioritising with impact.",
    details: [
      "Authority, content, freshness, technical",
      "Gap analysis per factor group",
      "Revenue impact per improvement",
    ],
  },
  {
    number: "03",
    title: "Connect actions to outcomes",
    description:
      "Every recommendation is tied to expected traffic gain, revenue gain, and effort required.",
    insight: '"If we fix this, how much money do we make?"',
    details: [
      "Expected traffic & revenue gain",
      "Effort estimation per action",
      "Full ROI prioritisation",
    ],
  },
];

export function Pillars() {
  return (
    <section className="px-6 py-32">
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="mb-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-sm font-mono text-primary uppercase tracking-wider mb-4">How it works</p>
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight">
            Three layers of<br />growth intelligence
          </h2>
        </motion.div>

        <div className="space-y-6">
          {pillars.map((pillar, i) => (
            <motion.div
              key={pillar.number}
              className="group relative rounded-2xl border border-border bg-card p-8 sm:p-10 hover:border-primary/30 transition-colors"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <div className="flex flex-col lg:flex-row lg:items-start gap-8">
                <div className="flex-1">
                  <span className="text-sm font-mono text-primary">{pillar.number}</span>
                  <h3 className="text-2xl sm:text-3xl font-bold mt-2 mb-4">{pillar.title}</h3>
                  <p className="text-muted-foreground leading-relaxed max-w-xl">{pillar.description}</p>
                  <p className="mt-4 text-sm font-mono text-primary/80 italic">→ {pillar.insight}</p>
                </div>

                <div className="lg:w-72 shrink-0">
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
          ))}
        </div>
      </div>
    </section>
  );
}
