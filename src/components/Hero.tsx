import { motion } from "framer-motion";
import { ArrowDown, TrendingDown, Sparkles } from "lucide-react";

function scrollToEarlyAccess() {
  if (typeof document === "undefined") return;
  document.getElementById("early-access")?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-6 pt-28 pb-20">
      {/* Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-glow blur-[160px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto grid lg:grid-cols-[1.05fr_1fr] gap-14 items-center">
        {/* Left: copy */}
        <div className="text-left">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-border bg-surface mb-7"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            <span className="text-xs font-mono text-muted-foreground uppercase tracking-wider">
              In active development · Founding access open
            </span>
          </motion.div>

          <motion.h1
            className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[0.98]"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05 }}
          >
            Stop auditing pixels.
            <br />
            <span className="text-primary">Start auditing revenue.</span>
          </motion.h1>

          <motion.p
            className="mt-7 text-lg text-muted-foreground max-w-xl leading-relaxed"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.18 }}
          >
            OrganicOS is the first data-driven SEO engine that translates technical health,
            domain authority, and content lifecycle spreads into clear, quantifiable revenue.
          </motion.p>

          <motion.div
            className="mt-9 flex flex-col sm:flex-row items-start sm:items-center gap-4"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <button
              onClick={scrollToEarlyAccess}
              className="group inline-flex items-center gap-2 px-7 py-3.5 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:brightness-110 transition-all shadow-[0_0_30px_var(--glow)]"
            >
              Get early access
              <ArrowDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
            </button>
            <p className="text-xs text-muted-foreground max-w-xs leading-relaxed">
              Founding-tier pricing & direct product-roadmap input for early members.
            </p>
          </motion.div>
        </div>

        {/* Right: dashboard mockup */}
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="relative"
        >
          <DashboardMockup />
        </motion.div>
      </div>
    </section>
  );
}

function DashboardMockup() {
  // Page clusters (radial scatter)
  const points = [
    { x: 0, y: 0, r: 14, label: "core", primary: true },
    { x: -36, y: -22, r: 9 },
    { x: 28, y: -30, r: 10 },
    { x: 44, y: 10, r: 7 },
    { x: -50, y: 18, r: 8 },
    { x: 10, y: 36, r: 11 },
    { x: -22, y: 44, r: 6 },
    { x: 60, y: -8, r: 5 },
    { x: -68, y: -10, r: 4 },
    { x: 36, y: 48, r: 5 },
    { x: -42, y: -48, r: 6 },
    { x: 70, y: 32, r: 4, drift: true },
    { x: -74, y: 42, r: 5, drift: true },
    { x: 78, y: -42, r: 4, drift: true },
  ];

  return (
    <div className="relative rounded-2xl border border-border bg-card shadow-[0_20px_60px_-20px_var(--glow)] overflow-hidden">
      {/* Chrome */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-surface/60">
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-muted-foreground/30" />
          <div className="w-2.5 h-2.5 rounded-full bg-muted-foreground/30" />
          <div className="w-2.5 h-2.5 rounded-full bg-muted-foreground/30" />
        </div>
        <div className="ml-3 text-[11px] font-mono text-muted-foreground">
          organicos · site-focus / topical-spread
        </div>
        <div className="ml-auto text-[10px] font-mono text-muted-foreground">live</div>
      </div>

      <div className="grid grid-cols-5 gap-4 p-5">
        {/* Radial scatter */}
        <div className="col-span-3 rounded-xl border border-border bg-background/60 p-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                Topical spread · 30d
              </p>
              <p className="text-sm font-semibold">Cluster centroid drift</p>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-primary/10 text-primary">
              K-Means
            </span>
          </div>
          <div className="relative aspect-square w-full">
            <svg viewBox="-100 -100 200 200" className="w-full h-full">
              {/* Rings */}
              {[30, 55, 80].map((r) => (
                <circle
                  key={r}
                  cx="0"
                  cy="0"
                  r={r}
                  fill="none"
                  stroke="currentColor"
                  className="text-border"
                  strokeDasharray="2 3"
                />
              ))}
              {/* Axes */}
              <line x1="-90" y1="0" x2="90" y2="0" stroke="currentColor" className="text-border" strokeWidth="0.5" />
              <line x1="0" y1="-90" x2="0" y2="90" stroke="currentColor" className="text-border" strokeWidth="0.5" />
              {/* Points */}
              {points.map((p, i) => (
                <g key={i}>
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r={p.r}
                    className={
                      p.primary
                        ? "fill-primary"
                        : p.drift
                          ? "fill-chart-5/60"
                          : "fill-primary/30"
                    }
                  />
                  {p.primary && (
                    <circle
                      cx={p.x}
                      cy={p.y}
                      r={p.r + 6}
                      fill="none"
                      stroke="currentColor"
                      className="text-primary"
                      strokeWidth="0.8"
                    >
                      <animate attributeName="r" values={`${p.r + 4};${p.r + 12};${p.r + 4}`} dur="3s" repeatCount="indefinite" />
                      <animate attributeName="opacity" values="0.8;0;0.8" dur="3s" repeatCount="indefinite" />
                    </circle>
                  )}
                </g>
              ))}
              {/* Centroid label */}
              <text x="0" y="-22" textAnchor="middle" className="fill-muted-foreground" fontSize="6" fontFamily="monospace">
                centroid
              </text>
            </svg>
          </div>
          <div className="flex items-center gap-4 text-[10px] font-mono text-muted-foreground mt-1">
            <span className="inline-flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-primary" /> core
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-primary/30" /> aligned
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-chart-5/60" /> drift
            </span>
          </div>
        </div>

        {/* KPI Block */}
        <div className="col-span-2 flex flex-col gap-4">
          <div className="rounded-xl border border-chart-5/40 bg-chart-5/5 p-4 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-chart-5/10 to-transparent pointer-events-none" />
            <div className="relative">
              <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider text-chart-5">
                <TrendingDown className="w-3 h-3" />
                Revenue at risk
              </div>
              <p className="mt-2 text-2xl font-bold font-mono text-foreground tabular-nums">
                £14,200
              </p>
              <p className="text-[10px] text-muted-foreground mt-1">from topical drift · 14 URLs</p>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-background/60 p-4">
            <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
              Site focus score
            </p>
            <div className="flex items-baseline gap-2 mt-1.5">
              <p className="text-2xl font-bold font-mono text-foreground tabular-nums">0.71</p>
              <span className="text-[10px] font-mono text-primary">+0.04</span>
            </div>
            <div className="mt-2 h-1.5 rounded-full bg-muted overflow-hidden">
              <div className="h-full bg-primary rounded-full" style={{ width: "71%" }} />
            </div>
          </div>

          <div className="rounded-xl border border-border bg-background/60 p-4">
            <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
              <Sparkles className="w-3 h-3 text-primary" />
              Top action
            </div>
            <p className="mt-1.5 text-xs font-semibold leading-snug">
              Consolidate 6 drifted URLs into <span className="text-primary">/guides</span>
            </p>
            <p className="text-[10px] font-mono text-muted-foreground mt-1">recover · £8,400 / mo</p>
          </div>
        </div>
      </div>
    </div>
  );
}
