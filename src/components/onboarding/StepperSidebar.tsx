import { Check, Lock } from "lucide-react";
import { motion } from "framer-motion";

export type StepStatus = "complete" | "active" | "locked";

export interface StepDef {
  id: number;
  title: string;
  subtitle: string;
}

interface StepperSidebarProps {
  steps: StepDef[];
  currentStep: number;
  completedSteps: Set<number>;
  onStepClick: (stepId: number) => void;
}

export function StepperSidebar({ steps, currentStep, completedSteps, onStepClick }: StepperSidebarProps) {
  const getStatus = (id: number): StepStatus => {
    if (completedSteps.has(id)) return "complete";
    if (id === currentStep) return "active";
    return "locked";
  };

  return (
    <aside className="w-[300px] shrink-0 border-r border-border bg-sidebar h-screen sticky top-0 flex flex-col">
      <div className="px-6 py-6 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
            OrganicOS Setup
          </span>
        </div>
        <h2 className="mt-3 text-xl font-bold tracking-tight text-sidebar-foreground">
          Let's get you wired up
        </h2>
      </div>

      <nav className="flex-1 px-3 py-4 overflow-y-auto">
        <ol className="space-y-1">
          {steps.map((step) => {
            const status = getStatus(step.id);
            const clickable = status !== "locked";

            return (
              <li key={step.id}>
                <button
                  type="button"
                  disabled={!clickable}
                  onClick={() => clickable && onStepClick(step.id)}
                  className={[
                    "w-full text-left px-3 py-3 rounded-lg flex items-start gap-3 transition-colors group",
                    status === "active" && "bg-sidebar-accent",
                    status === "complete" && "hover:bg-sidebar-accent/50 cursor-pointer",
                    status === "locked" && "opacity-50 cursor-not-allowed",
                  ].filter(Boolean).join(" ")}
                >
                  <StepIndicator status={status} number={step.id} isActive={status === "active"} />
                  <div className="flex-1 min-w-0 pt-0.5">
                    <div
                      className={[
                        "text-sm font-semibold leading-tight",
                        status === "active" ? "text-sidebar-foreground" : "text-sidebar-foreground/80",
                      ].join(" ")}
                    >
                      {step.title}
                    </div>
                    <div className="text-xs text-muted-foreground mt-0.5 leading-snug">
                      {step.subtitle}
                    </div>
                  </div>
                </button>
              </li>
            );
          })}
        </ol>
      </nav>

      <div className="px-6 py-4 border-t border-border">
        <ProgressBar value={(completedSteps.size / steps.length) * 100} />
        <p className="mt-2 text-xs font-mono text-muted-foreground">
          {completedSteps.size} of {steps.length} complete
        </p>
      </div>
    </aside>
  );
}

function StepIndicator({ status, number, isActive }: { status: StepStatus; number: number; isActive: boolean }) {
  if (status === "complete") {
    return (
      <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center shrink-0">
        <Check className="w-4 h-4 text-primary-foreground" strokeWidth={3} />
      </div>
    );
  }

  if (status === "locked") {
    return (
      <div className="w-7 h-7 rounded-full border border-border bg-background flex items-center justify-center shrink-0">
        <Lock className="w-3 h-3 text-muted-foreground" />
      </div>
    );
  }

  return (
    <motion.div
      className="w-7 h-7 rounded-full border-2 border-primary bg-background flex items-center justify-center shrink-0 shadow-[0_0_20px_var(--glow)]"
      animate={isActive ? { scale: [1, 1.05, 1] } : {}}
      transition={{ duration: 2, repeat: Infinity }}
    >
      <span className="text-xs font-bold font-mono text-primary">{number}</span>
    </motion.div>
  );
}

function ProgressBar({ value }: { value: number }) {
  return (
    <div className="h-1 w-full rounded-full bg-border overflow-hidden">
      <motion.div
        className="h-full bg-primary"
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      />
    </div>
  );
}
