import { cn } from "@/lib/utils";

export type VolatilityLevel = 1 | 2 | 3 | 4 | 5;

const LABELS: Record<VolatilityLevel, string> = {
  1: "Very low volatility",
  2: "Low volatility",
  3: "Moderate volatility",
  4: "High volatility",
  5: "Very high volatility",
};

function dotClass(level: VolatilityLevel, index: number) {
  // Inactive dots beyond the level
  if (index >= level) return "bg-border";
  // Active dots tint by the overall level
  if (level <= 2) return "bg-muted-foreground/60";
  if (level === 3) return "bg-chart-4/80";
  return "bg-destructive/80";
}

interface VolatilityDotsProps {
  level: VolatilityLevel;
  label?: string;
  className?: string;
}

/**
 * VolatilityDots — 5-dot indicator for cluster / metric volatility.
 * Levels 1–2: muted. Level 3: chart-4 (warning). Levels 4–5: destructive.
 */
export function VolatilityDots({ level, label, className }: VolatilityDotsProps) {
  const tooltip = label ?? LABELS[level];
  return (
    <span
      title={tooltip}
      aria-label={tooltip}
      role="img"
      className={cn("inline-flex items-center gap-0.5 align-middle", className)}
    >
      {[0, 1, 2, 3, 4].map((i) => (
        <span
          key={i}
          className={cn("h-1.5 w-1.5 rounded-full", dotClass(level, i))}
        />
      ))}
    </span>
  );
}
