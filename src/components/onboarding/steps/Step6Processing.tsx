import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { StepShell } from "../StepShell";

interface Props {
  onComplete: () => void;
}

const TASKS = [
  { label: "Pulling 16 months of GSC query data", weight: 35 },
  { label: "Aggregating brand vs. non-brand totals", weight: 15 },
  { label: "Reading sitemaps & classifying pages", weight: 25 },
  { label: "Computing CTR curves at every position", weight: 15 },
  { label: "Building your revenue model", weight: 10 },
];

export function Step6Processing({ onComplete }: Props) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          return 100;
        }
        return Math.min(100, p + 1.2);
      });
    }, 60);
    return () => clearInterval(interval);
  }, []);

  let cumulative = 0;
  const taskStates = TASKS.map((t) => {
    const start = cumulative;
    cumulative += t.weight;
    const end = cumulative;
    const status = progress >= end ? "done" : progress >= start ? "active" : "pending";
    return { ...t, status };
  });

  return (
    <StepShell
      eyebrow="Step 6 of 8 — Crunching"
      title="Building your revenue engine"
      description="This usually takes about a minute. We're pulling everything we need so the rest of OrganicOS just works."
      hideFooter
    >
      <div className="space-y-8">
        {/* Big progress ring */}
        <div className="flex justify-center py-4">
          <ProgressRing progress={progress} />
        </div>

        {/* Task list */}
        <ul className="space-y-3">
          {taskStates.map((t, i) => (
            <li key={i} className="flex items-center gap-3">
              <TaskIcon status={t.status} />
              <span
                className={[
                  "text-sm transition-colors",
                  t.status === "done" && "text-foreground",
                  t.status === "active" && "text-foreground font-medium",
                  t.status === "pending" && "text-muted-foreground",
                ].filter(Boolean).join(" ")}
              >
                {t.label}
              </span>
            </li>
          ))}
        </ul>

        {progress >= 100 && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex justify-end">
            <button
              type="button"
              onClick={onComplete}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:brightness-110 transition-all shadow-[0_0_24px_var(--glow)]"
            >
              Continue →
            </button>
          </motion.div>
        )}
      </div>
    </StepShell>
  );
}

function ProgressRing({ progress }: { progress: number }) {
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative w-44 h-44">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 160 160">
        <circle cx="80" cy="80" r={radius} fill="none" stroke="var(--border)" strokeWidth="6" />
        <circle
          cx="80"
          cy="80"
          r={radius}
          fill="none"
          stroke="var(--primary)"
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 0.3s ease-out", filter: "drop-shadow(0 0 8px var(--glow))" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-4xl font-bold font-mono">{Math.floor(progress)}<span className="text-muted-foreground">%</span></span>
        <span className="text-xs font-mono text-muted-foreground uppercase tracking-wider mt-1">Processing</span>
      </div>
    </div>
  );
}

function TaskIcon({ status }: { status: string }) {
  if (status === "done") {
    return (
      <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center shrink-0">
        <Check className="w-3.5 h-3.5 text-primary-foreground" strokeWidth={3} />
      </div>
    );
  }
  if (status === "active") {
    return (
      <div className="w-6 h-6 rounded-full border-2 border-primary border-t-transparent animate-spin shrink-0" />
    );
  }
  return <div className="w-6 h-6 rounded-full border border-border shrink-0" />;
}
