import { type ReactNode } from "react";
import { Lock } from "lucide-react";

interface Props {
  label: string;
  hint?: string;
  locked?: boolean;
  lockedReason?: string;
  children: ReactNode;
  className?: string;
}

export function Field({ label, hint, locked, lockedReason, children, className }: Props) {
  return (
    <div className={className}>
      <div className="flex items-center gap-2 mb-1.5">
        <label className="block text-sm font-medium">{label}</label>
        {locked && (
          <span
            title={lockedReason}
            className="inline-flex items-center gap-1 text-[10px] font-mono uppercase tracking-wider text-muted-foreground bg-surface border border-border rounded px-1.5 py-0.5"
          >
            <Lock className="w-2.5 h-2.5" />
            Read-only
          </span>
        )}
      </div>
      {hint && <p className="text-xs text-muted-foreground mb-2.5 leading-relaxed">{hint}</p>}
      {children}
    </div>
  );
}
