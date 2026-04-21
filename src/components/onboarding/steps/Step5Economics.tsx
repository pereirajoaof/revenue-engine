import { BarChart3, PencilLine, Check } from "lucide-react";
import { StepShell } from "../StepShell";
import type { EconomicsMode, BusinessModel } from "../types";

interface Props {
  mode: EconomicsMode;
  ga4Connected: boolean;
  globalCvr: string;
  globalAov: string;
  businessModel: BusinessModel | null;
  currencySymbol: string;
  onModeChange: (mode: EconomicsMode) => void;
  onGa4Connect: () => void;
  onChange: (patch: Partial<{ globalCvr: string; globalAov: string }>) => void;
  onBack: () => void;
  onNext: () => void;
}

export function Step5Economics({
  mode,
  ga4Connected,
  globalCvr,
  globalAov,
  businessModel,
  currencySymbol,
  onModeChange,
  onGa4Connect,
  onChange,
  onBack,
  onNext,
}: Props) {
  const aovLabel =
    businessModel === "saas" ? "Average MRR per customer"
    : businessModel === "leadgen" ? "Average deal size"
    : "Average order value";

  const manualReady = globalCvr.trim() !== "" && globalAov.trim() !== "";
  const ready = (mode === "ga4" && ga4Connected) || (mode === "manual" && manualReady);

  return (
    <StepShell
      eyebrow="Step 5 of 8 — Economics"
      title="How should we calculate revenue?"
      description="OrganicOS needs conversion rate and order value to translate clicks into revenue. Pull from GA4 automatically, or enter the numbers yourself."
      onBack={onBack}
      onNext={onNext}
      nextDisabled={!ready}
      secondaryAction={
        mode === "ga4" && !ga4Connected
          ? { label: "Skip — I'll enter manually", onClick: () => onModeChange("manual") }
          : undefined
      }
    >
      <div className="grid grid-cols-2 gap-3 mb-8">
        <ModeCard
          active={mode === "ga4"}
          icon={<BarChart3 className="w-5 h-5" />}
          title="Connect GA4"
          subtitle="Auto-pull CVR & AOV"
          tag="Recommended"
          onClick={() => onModeChange("ga4")}
        />
        <ModeCard
          active={mode === "manual"}
          icon={<PencilLine className="w-5 h-5" />}
          title="Enter manually"
          subtitle="Quick & no extra OAuth"
          onClick={() => onModeChange("manual")}
        />
      </div>

      {mode === "ga4" && (
        <div className="rounded-xl border border-border bg-card p-6">
          {!ga4Connected ? (
            <>
              <p className="text-sm text-muted-foreground mb-4">
                Connect your GA4 property and we'll calculate site-wide conversion rate
                and order value from the last 90 days.
              </p>
              <button
                type="button"
                onClick={onGa4Connect}
                className="w-full flex items-center justify-center gap-3 px-6 py-3 rounded-lg border border-border bg-background hover:border-primary/40 hover:bg-surface transition-all"
              >
                <span className="text-sm font-semibold">Connect Google Analytics 4</span>
              </button>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center shrink-0">
                <Check className="w-5 h-5 text-primary-foreground" strokeWidth={3} />
              </div>
              <div className="text-sm">
                <div className="font-semibold">GA4 connected</div>
                <div className="text-muted-foreground">
                  Detected CVR: <span className="font-mono text-foreground">2.4%</span>
                  {"  ·  "}
                  AOV: <span className="font-mono text-foreground">{currencySymbol}87.30</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {mode === "manual" && (
        <div className="space-y-5">
          <Field label="Global average conversion rate" hint="Sitewide CVR across all traffic.">
            <div className="relative max-w-xs">
              <input
                type="text"
                inputMode="decimal"
                value={globalCvr}
                onChange={(e) => onChange({ globalCvr: e.target.value })}
                placeholder="2.4"
                className="w-full px-4 py-2.5 pr-10 rounded-lg border border-border bg-card text-sm font-mono focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-mono text-muted-foreground">%</span>
            </div>
          </Field>
          <Field label={aovLabel}>
            <div className="relative max-w-xs">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-mono text-muted-foreground">{currencySymbol}</span>
              <input
                type="text"
                inputMode="decimal"
                value={globalAov}
                onChange={(e) => onChange({ globalAov: e.target.value })}
                placeholder="87.30"
                className="w-full pl-8 pr-4 py-2.5 rounded-lg border border-border bg-card text-sm font-mono focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </Field>
        </div>
      )}

      {mode === null && (
        <p className="text-sm text-muted-foreground italic">Pick an option above to continue.</p>
      )}
    </StepShell>
  );
}

function ModeCard({
  active,
  icon,
  title,
  subtitle,
  tag,
  onClick,
}: {
  active: boolean;
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  tag?: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "relative text-left px-5 py-5 rounded-xl border transition-all",
        active ? "border-primary bg-primary/5 shadow-[0_0_24px_var(--glow)]" : "border-border bg-card hover:border-primary/30",
      ].join(" ")}
    >
      {tag && (
        <span className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-primary/15 text-[10px] font-mono uppercase tracking-wider text-primary">
          {tag}
        </span>
      )}
      <div className={["w-9 h-9 rounded-lg flex items-center justify-center mb-3", active ? "bg-primary text-primary-foreground" : "bg-surface text-muted-foreground"].join(" ")}>
        {icon}
      </div>
      <div className="font-semibold text-sm">{title}</div>
      <div className="text-xs text-muted-foreground mt-0.5">{subtitle}</div>
    </button>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-semibold mb-1">{label}</label>
      {hint && <p className="text-xs text-muted-foreground mb-3">{hint}</p>}
      {!hint && <div className="mb-3" />}
      {children}
    </div>
  );
}
