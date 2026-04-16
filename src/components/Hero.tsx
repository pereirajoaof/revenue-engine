import { motion } from "framer-motion";

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-6">
      {/* Glow effect */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-glow blur-[120px] pointer-events-none" />

      <div className="relative max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-border bg-surface mb-8">
            <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            <span className="text-sm font-mono text-muted-foreground">The operating system for organic growth</span>
          </div>
        </motion.div>

        <motion.h1
          className="text-5xl sm:text-7xl lg:text-8xl font-bold tracking-tight leading-[0.95]"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
        >
          OrganicOS: From SEO
          <br />
          <span className="text-primary">to CEO</span>
        </motion.h1>

        <motion.p
          className="mt-8 text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
        >
          Most SEO tools stop at traffic. OrganicOS connects search demand directly to revenue
          and tells you where growth actually comes from.
        </motion.p>

        <motion.div
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <button className="px-8 py-3.5 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:brightness-110 transition-all shadow-[0_0_30px_var(--glow)]">
            Get early access
          </button>
          <button className="px-8 py-3.5 rounded-lg border border-border text-foreground font-semibold text-sm hover:bg-surface transition-colors">
            See how it works
          </button>
        </motion.div>

        {/* Revenue metric hint */}
        <motion.div
          className="mt-20 inline-flex items-center gap-6 px-6 py-4 rounded-xl border border-border bg-surface/50"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.55 }}
        >
          <div className="text-left">
            <p className="text-xs text-muted-foreground font-mono uppercase tracking-wider">Missed revenue opportunity</p>
            <p className="text-3xl font-bold font-mono text-primary mt-1">£2.4M</p>
          </div>
          <div className="w-px h-10 bg-border" />
          <div className="text-left">
            <p className="text-xs text-muted-foreground font-mono uppercase tracking-wider">Top action ROI</p>
            <p className="text-3xl font-bold font-mono text-foreground mt-1">14.2x</p>
          </div>
          <div className="w-px h-10 bg-border" />
          <div className="text-left">
            <p className="text-xs text-muted-foreground font-mono uppercase tracking-wider">Priority fixes</p>
            <p className="text-3xl font-bold font-mono text-foreground mt-1">12</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
