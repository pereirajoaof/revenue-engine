import { motion } from "framer-motion";
import { Check, Wrench, Map } from "lucide-react";

type Status = "shipped" | "building" | "planned";

const modules: {
  name: string;
  status: Status;
  unlocks: string;
}[] = [
  {
    name: "Site focus architecture",
    status: "shipped",
    unlocks:
      "2D polar mapping, automated Rewrite/Consolidate actions, continuous decay risk formulas.",
  },
  {
    name: "Page age pipeline",
    status: "shipped",
    unlocks:
      "5-bucket temporal classification, GA4 + Wayback chronologies, cross-cohort CTR outlier tables.",
  },
  {
    name: "Domain trust core",
    status: "shipped",
    unlocks:
      "RDAP proxy indexing, continuous linear trust scores, monetary domain-expiry warnings.",
  },
  {
    name: "Technical data engine",
    status: "building",
    unlocks:
      "Configuration schemas and sub-scoring models are live. A standalone parallel crawling worker is being built to scale headless executions.",
  },
  {
    name: "Always-on monitoring",
    status: "planned",
    unlocks:
      "Continuous low-frequency crawling around traffic-heavy priority clusters with real-time Slack / email alerts.",
  },
];

const statusMeta: Record<
  Status,
  { label: string; icon: typeof Check; className: string; dot: string }
> = {
  shipped: {
    label: "Completed & UI shipped",
    icon: Check,
    className: "bg-primary/10 text-primary border-primary/30",
    dot: "bg-primary",
  },
  building: {
    label: "Execution layer in build",
    icon: Wrench,
    className: "bg-chart-4/10 text-chart-4 border-chart-4/30",
    dot: "bg-chart-4",
  },
  planned: {
    label: "Planned blueprint",
    icon: Map,
    className: "bg-muted text-muted-foreground border-border",
    dot: "bg-muted-foreground/50",
  },
};

export function Roadmap() {
  return (
    <section className="px-6 py-32 border-t border-border">
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="mb-14 max-w-2xl"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-sm font-mono text-primary uppercase tracking-wider mb-4">
            Complete transparency
          </p>
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight leading-[1.05]">
            What's ready.<br />What's next.
          </h2>
          <p className="mt-5 text-muted-foreground leading-relaxed">
            We lay out the staging roadmap clearly so early access members can see the
            ground truth — and influence what we ship next.
          </p>
        </motion.div>

        <div className="rounded-2xl border border-border bg-card overflow-hidden">
          {/* Header row */}
          <div className="hidden md:grid grid-cols-[1.2fr_1fr_2fr] gap-6 px-8 py-4 border-b border-border bg-surface/50 text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
            <div>Module</div>
            <div>Status</div>
            <div>What it unlocks</div>
          </div>

          {modules.map((m, i) => {
            const meta = statusMeta[m.status];
            const Icon = meta.icon;
            return (
              <motion.div
                key={m.name}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="grid grid-cols-1 md:grid-cols-[1.2fr_1fr_2fr] gap-3 md:gap-6 px-6 md:px-8 py-6 border-b border-border last:border-b-0 hover:bg-surface/40 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className={`w-1.5 h-1.5 rounded-full ${meta.dot}`} />
                  <span className="font-semibold text-foreground">{m.name}</span>
                </div>
                <div>
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-[11px] font-mono ${meta.className}`}
                  >
                    <Icon className="w-3 h-3" />
                    {meta.label}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{m.unlocks}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
