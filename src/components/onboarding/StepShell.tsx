import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import type { ReactNode } from "react";

interface StepShellProps {
  eyebrow: string;
  title: string;
  description?: string;
  children: ReactNode;
  onBack?: () => void;
  onNext?: () => void;
  nextLabel?: string;
  nextDisabled?: boolean;
  backLabel?: string;
  hideFooter?: boolean;
  secondaryAction?: { label: string; onClick: () => void };
}

export function StepShell({
  eyebrow,
  title,
  description,
  children,
  onBack,
  onNext,
  nextLabel = "Continue",
  nextDisabled = false,
  backLabel = "Back",
  hideFooter = false,
  secondaryAction,
}: StepShellProps) {
  return (
    <motion.div
      key={title}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="max-w-2xl mx-auto w-full px-8 py-16"
    >
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-primary mb-3">
        {eyebrow}
      </p>
      <h1 className="text-4xl font-bold tracking-tight leading-tight">{title}</h1>
      {description && (
        <p className="mt-4 text-base text-muted-foreground leading-relaxed max-w-xl">
          {description}
        </p>
      )}

      <div className="mt-10">{children}</div>

      {!hideFooter && (
        <div className="mt-12 flex items-center justify-between border-t border-border pt-6">
          <div>
            {onBack && (
              <button
                type="button"
                onClick={onBack}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-surface transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                {backLabel}
              </button>
            )}
          </div>

          <div className="flex items-center gap-3">
            {secondaryAction && (
              <button
                type="button"
                onClick={secondaryAction.onClick}
                className="px-4 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                {secondaryAction.label}
              </button>
            )}
            {onNext && (
              <button
                type="button"
                onClick={onNext}
                disabled={nextDisabled}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:brightness-110 transition-all shadow-[0_0_24px_var(--glow)] disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none"
              >
                {nextLabel}
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}
    </motion.div>
  );
}
