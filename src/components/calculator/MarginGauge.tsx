import { useCountUp } from "@/hooks/use-count-up";
import type { Verdict } from "@/lib/pricing-calculator";

interface Props {
  margin: number;
  verdict: Verdict;
}

const TONE: Record<Verdict, string> = {
  healthy: "var(--color-primary)",
  thin: "var(--color-chart-4)",
  "below-floor": "var(--color-destructive)",
};

/**
 * Semicircular gauge showing the current margin against a shaded 40–70%
 * "sweet spot" and a red below-floor zone.
 */
export function MarginGauge({ margin, verdict }: Props) {
  const clamped = Math.max(-0.2, Math.min(1, margin));
  const animated = useCountUp(clamped);
  const pct = Math.max(0, Math.min(1, animated));

  const R = 78;
  const CX = 100;
  const CY = 92;
  const angle = Math.PI * (1 - pct);
  const needleX = CX + R * Math.cos(angle);
  const needleY = CY - R * Math.sin(angle);

  const arc = (from: number, to: number) => {
    const a1 = Math.PI * (1 - from);
    const a2 = Math.PI * (1 - to);
    return `M ${CX + R * Math.cos(a1)} ${CY - R * Math.sin(a1)} A ${R} ${R} 0 0 1 ${CX + R * Math.cos(a2)} ${CY - R * Math.sin(a2)}`;
  };

  return (
    <div className="flex flex-col items-center">
      <svg
        viewBox="0 0 200 112"
        className="w-full max-w-[280px]"
        role="meter"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(Math.max(0, margin) * 100)}
        aria-label={`Profit margin ${Math.round(margin * 100)} percent`}
      >
        {/* track */}
        <path d={arc(0, 1)} fill="none" stroke="var(--color-border)" strokeWidth={13} strokeLinecap="round" />
        {/* danger zone */}
        <path d={arc(0, 0.2)} fill="none" stroke="var(--color-destructive)" strokeOpacity={0.35} strokeWidth={13} strokeLinecap="round" />
        {/* thin zone */}
        <path d={arc(0.2, 0.4)} fill="none" stroke="var(--color-chart-4)" strokeOpacity={0.35} strokeWidth={13} />
        {/* sweet spot */}
        <path d={arc(0.4, 0.7)} fill="none" stroke="var(--color-primary)" strokeOpacity={0.32} strokeWidth={13} />
        {/* value arc */}
        <path
          d={arc(0, Math.max(0.001, pct))}
          fill="none"
          stroke={TONE[verdict]}
          strokeWidth={5}
          strokeLinecap="round"
        />
        {/* needle */}
        <line x1={CX} y1={CY} x2={needleX} y2={needleY} stroke={TONE[verdict]} strokeWidth={2.5} strokeLinecap="round" />
        <circle cx={CX} cy={CY} r={5} fill={TONE[verdict]} />
        <text x="16" y="108" className="fill-muted-foreground" style={{ fontSize: 9 }}>
          0%
        </text>
        <text x="170" y="108" className="fill-muted-foreground" style={{ fontSize: 9 }}>
          100%
        </text>
      </svg>

      <div className="-mt-2 text-center">
        <div className="font-display text-3xl font-bold tabular-nums tracking-tight" style={{ color: TONE[verdict] }}>
          {Math.round(animated * 100)}%
        </div>
        <div className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
          Your margin
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 text-[11px] text-muted-foreground">
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-destructive/50" /> Below floor
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-chart-4/50" /> Thin
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-primary/50" /> Sweet spot 40–70%
        </span>
      </div>
    </div>
  );
}
