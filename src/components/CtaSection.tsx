import { motion } from "framer-motion";

export function CtaSection() {
  return (
    <section className="px-6 py-32">
      <motion.div
        className="max-w-4xl mx-auto text-center"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className="rounded-2xl border border-border bg-card p-12 sm:p-16 relative overflow-hidden">
          <div className="absolute inset-0 bg-glow opacity-30 blur-[80px] pointer-events-none" />
          <div className="relative">
            <p className="text-sm font-mono text-primary uppercase tracking-wider mb-6">In one sentence</p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-tight">
              A decision engine that turns SEO from a visibility game
              into a <span className="text-primary">revenue growth system</span>.
            </h2>
            <div className="mt-10">
              <button className="px-8 py-3.5 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:brightness-110 transition-all shadow-[0_0_30px_var(--glow)]">
                Get early access
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
