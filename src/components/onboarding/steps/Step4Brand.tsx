import { useState } from "react";
import { X, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { StepShell } from "../StepShell";

interface Props {
  brandedKeywords: string[];
  onChange: (kws: string[]) => void;
  onBack: () => void;
  onNext: () => void;
}

const SUGGESTED = ["acme", "acme.com", "acme login", "acme app", "acme pricing"];

export function Step4Brand({ brandedKeywords, onChange, onBack, onNext }: Props) {
  const [draft, setDraft] = useState("");

  const add = (kw: string) => {
    const clean = kw.trim().toLowerCase();
    if (!clean || brandedKeywords.includes(clean)) return;
    onChange([...brandedKeywords, clean]);
    setDraft("");
  };

  const remove = (kw: string) => onChange(brandedKeywords.filter((k) => k !== kw));

  const handleKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      add(draft);
    }
  };

  const unsuggested = SUGGESTED.filter((s) => !brandedKeywords.includes(s));

  return (
    <StepShell
      eyebrow="Step 4 of 8 — Brand"
      title="Define your branded keywords"
      description="We split brand vs. non-brand revenue. Brand traffic measures demand; non-brand measures SEO acquisition. Get this right and every chart gets sharper."
      onBack={onBack}
      onNext={onNext}
      nextDisabled={brandedKeywords.length === 0}
    >
      <div className="space-y-6">
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
              Suggested from your domain & GSC
            </span>
          </div>
          <div className="flex gap-2 flex-wrap">
            {unsuggested.length === 0 ? (
              <span className="text-xs text-muted-foreground italic">All suggestions added.</span>
            ) : (
              unsuggested.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => add(s)}
                  className="px-3 py-1.5 rounded-full border border-dashed border-border text-xs text-muted-foreground hover:border-primary hover:text-primary transition-colors"
                >
                  + {s}
                </button>
              ))
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-3">Your branded keywords</label>
          <div className="rounded-xl border border-border bg-card p-3 min-h-[80px] flex flex-wrap gap-2 items-start">
            <AnimatePresence>
              {brandedKeywords.map((kw) => (
                <motion.span
                  key={kw}
                  layout
                  initial={{ opacity: 0, scale: 0.7 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.7 }}
                  transition={{ duration: 0.15 }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/30 text-sm font-mono text-primary"
                >
                  {kw}
                  <button
                    type="button"
                    onClick={() => remove(kw)}
                    className="hover:bg-primary/20 rounded-full p-0.5 -mr-1"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </motion.span>
              ))}
            </AnimatePresence>
            <input
              type="text"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={handleKey}
              onBlur={() => draft && add(draft)}
              placeholder={brandedKeywords.length === 0 ? "Type a keyword and press Enter" : "Add another…"}
              className="flex-1 min-w-[200px] bg-transparent text-sm py-1.5 px-2 focus:outline-none placeholder:text-muted-foreground"
            />
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Press Enter or comma to add. Misspellings count too — we'll match variants automatically.
          </p>
        </div>
      </div>
    </StepShell>
  );
}
