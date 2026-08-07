import { useCountUp } from "@/hooks/use-count-up";
import { formatMoney, type CurrencyCode } from "@/lib/pricing-calculator";

export function AnimatedMoney({
  value,
  currency,
  className,
}: {
  value: number;
  currency: CurrencyCode;
  className?: string;
}) {
  const v = useCountUp(value);
  return (
    <span className={className} aria-live="polite">
      {formatMoney(v, currency)}
    </span>
  );
}

export function AnimatedPercent({ value, className }: { value: number; className?: string }) {
  const v = useCountUp(value * 100);
  return <span className={className}>{Math.round(v)}%</span>;
}
