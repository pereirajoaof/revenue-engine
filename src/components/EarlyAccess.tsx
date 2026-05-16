import { motion } from "framer-motion";
import { useState } from "react";
import { z } from "zod";
import { ArrowRight, CheckCircle2 } from "lucide-react";

const HEADACHES = [
  {
    id: "roi",
    label: "I can't quantify the financial ROI of my technical SEO work to executives.",
  },
  {
    id: "drift",
    label: "Our content keeps drifting into non-converting semantic topics.",
  },
  {
    id: "prune",
    label: "We have massive content footprints and don't know what to prune or consolidate.",
  },
  {
    id: "ai",
    label: "We are completely blind to our visibility and citation share in AI search engines.",
  },
  {
    id: "competitor",
    label: "We are auditing our site in a vacuum without real competitor context or benchmarks.",
  },
];

const schema = z.object({
  email: z.string().trim().email("Enter a valid work email.").max(255),
  headache: z.enum(["roi", "drift", "prune", "ai", "competitor"], {
    errorMap: () => ({ message: "Pick the option closest to your reality." }),
  }),
});

export function EarlyAccess() {
  const [email, setEmail] = useState("");
  const [headache, setHeadache] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [audit, setAudit] = useState<"yes" | "no" | null>(null);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const result = schema.safeParse({ email, headache });
    if (!result.success) {
      setError(result.error.issues[0].message);
      return;
    }
    setError(null);
    setSubmitted(true);
  }

  return (
    <section id="early-access" className="px-6 py-32 border-t border-border scroll-mt-20">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="grid lg:grid-cols-[1fr_1.1fr] gap-12 lg:gap-16 items-start"
        >
          {/* Left: pitch */}
          <div>
            <p className="text-sm font-mono text-primary uppercase tracking-wider mb-4">
              Early access queue
            </p>
            <h2 className="text-4xl sm:text-5xl font-bold tracking-tight leading-[1.05]">
              Found the headache?<br />Skip the line.
            </h2>
            <p className="mt-5 text-muted-foreground leading-relaxed max-w-md">
              Founding members get priority onboarding, founding-tier pricing locked for life,
              and direct input into what ships next.
            </p>

            <div className="mt-10 space-y-4">
              {[
                "Founding-tier pricing, locked for life",
                "Direct roadmap input on every module",
                "Free structural topical drift audit (opt-in)",
              ].map((b) => (
                <div key={b} className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                  <p className="text-sm text-surface-foreground">{b}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right: form / confirmation */}
          <div className="relative">
            <div className="absolute inset-0 bg-glow opacity-40 blur-[80px] pointer-events-none" />
            <div className="relative rounded-2xl border border-border bg-card p-7 sm:p-9 shadow-[0_20px_60px_-30px_var(--glow)]">
              {!submitted ? (
                <form onSubmit={onSubmit} noValidate>
                  <div className="mb-6">
                    <label className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                      Work email
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      maxLength={255}
                      placeholder="you@company.com"
                      className="mt-2 w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    />
                  </div>

                  <div className="mb-6">
                    <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-3">
                      Primary optimization headache
                    </p>
                    <div className="space-y-2">
                      {HEADACHES.map((h) => {
                        const selected = headache === h.id;
                        return (
                          <label
                            key={h.id}
                            className={`flex items-start gap-3 p-3.5 rounded-lg border cursor-pointer transition-all ${
                              selected
                                ? "border-primary bg-primary/5"
                                : "border-border hover:border-primary/40 bg-background"
                            }`}
                          >
                            <input
                              type="radio"
                              name="headache"
                              value={h.id}
                              checked={selected}
                              onChange={() => setHeadache(h.id)}
                              className="sr-only"
                            />
                            <span
                              className={`mt-0.5 w-4 h-4 rounded-full border-2 shrink-0 grid place-items-center transition-colors ${
                                selected ? "border-primary" : "border-muted-foreground/40"
                              }`}
                            >
                              {selected && <span className="w-1.5 h-1.5 rounded-full bg-primary" />}
                            </span>
                            <span className="text-sm leading-snug text-foreground">{h.label}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>

                  {error && (
                    <p className="text-xs text-destructive font-medium mb-4" role="alert">
                      {error}
                    </p>
                  )}

                  <button
                    type="submit"
                    className="group w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:brightness-110 transition-all shadow-[0_0_30px_var(--glow)]"
                  >
                    Join the early access queue
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                  <p className="mt-3 text-[11px] text-muted-foreground text-center">
                    No spam. One launch update per milestone.
                  </p>
                </form>
              ) : (
                <ThankYou audit={audit} onAudit={setAudit} />
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function ThankYou({
  audit,
  onAudit,
}: {
  audit: "yes" | "no" | null;
  onAudit: (v: "yes" | "no") => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-[11px] font-mono uppercase tracking-wider mb-5">
        <CheckCircle2 className="w-3.5 h-3.5" />
        You're on the list
      </div>
      <h3 className="text-2xl font-bold tracking-tight leading-tight">
        One more thing — want a free audit?
      </h3>
      <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
        Link a read-only Google Search Console account and we'll run a structural
        topical drift audit on your site while we scale our workers. Founding members only.
      </p>

      <div className="mt-6 grid grid-cols-2 gap-3">
        <button
          onClick={() => onAudit("yes")}
          className={`px-4 py-3 rounded-lg border text-sm font-semibold transition-all ${
            audit === "yes"
              ? "border-primary bg-primary text-primary-foreground"
              : "border-border bg-background hover:border-primary/50"
          }`}
        >
          Yes, audit my site
        </button>
        <button
          onClick={() => onAudit("no")}
          className={`px-4 py-3 rounded-lg border text-sm font-medium transition-all ${
            audit === "no"
              ? "border-foreground/40 bg-surface text-foreground"
              : "border-border bg-background hover:border-foreground/30 text-muted-foreground"
          }`}
        >
          Maybe later
        </button>
      </div>

      {audit && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-5 text-xs font-mono text-muted-foreground"
        >
          {audit === "yes"
            ? "→ We'll email connection steps within 24 hours."
            : "→ No problem. We'll keep you posted as modules go live."}
        </motion.p>
      )}
    </motion.div>
  );
}
