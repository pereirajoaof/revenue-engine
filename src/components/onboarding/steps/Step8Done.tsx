import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { Sparkles, ArrowRight } from "lucide-react";
import { StepShell } from "../StepShell";

export function Step8Done({ currencySymbol }: { currencySymbol: string }) {
  return (
    <StepShell
      eyebrow="Step 8 of 8 — Ready"
      title="Your revenue engine is live."
      description="We've modeled every URL in your GSC against your economics. Here's what's waiting inside."
      hideFooter
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/10 via-card to-card p-8 relative overflow-hidden"
      >
        <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-primary/20 blur-[80px] pointer-events-none" />

        <div className="relative">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/15 mb-4">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            <span className="text-xs font-mono uppercase tracking-wider text-primary">First insight</span>
          </div>

          <p className="text-sm text-muted-foreground mb-1">We found</p>
          <p className="text-5xl font-bold font-mono text-primary">{currencySymbol}2.4M</p>
          <p className="text-sm text-muted-foreground mt-2">in missed revenue across 1,247 URLs.</p>

          <div className="mt-6 grid grid-cols-3 gap-4 pt-6 border-t border-border">
            <Stat label="Top opportunity ROI" value="14.2x" />
            <Stat label="Priority fixes" value="12" />
            <Stat label="Tracked queries" value="48,310" />
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="mt-8 flex justify-end"
      >
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:brightness-110 transition-all shadow-[0_0_30px_var(--glow)]"
        >
          Go to dashboard
          <ArrowRight className="w-4 h-4" />
        </Link>
      </motion.div>
    </StepShell>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-mono uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="text-xl font-bold font-mono mt-1">{value}</p>
    </div>
  );
}
