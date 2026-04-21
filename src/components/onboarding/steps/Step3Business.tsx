import { ShoppingBag, Cloud, Users, MoreHorizontal } from "lucide-react";
import { StepShell } from "../StepShell";
import type { BusinessModel, Currency } from "../types";

interface Props {
  businessModel: BusinessModel | null;
  currency: Currency | null;
  customCurrency: string;
  primaryMarket: string;
  onChange: (patch: Partial<{
    businessModel: BusinessModel;
    currency: Currency;
    customCurrency: string;
    primaryMarket: string;
  }>) => void;
  onBack: () => void;
  onNext: () => void;
}

const MODELS: { id: BusinessModel; label: string; sub: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: "ecommerce", label: "Ecommerce", sub: "Sell physical or digital products", icon: ShoppingBag },
  { id: "saas", label: "SaaS", sub: "Recurring subscription revenue", icon: Cloud },
  { id: "leadgen", label: "Lead generation", sub: "Capture leads, close offline", icon: Users },
  { id: "other", label: "Other", sub: "Marketplace, media, hybrid…", icon: MoreHorizontal },
];

const CURRENCIES: { id: Currency; label: string; symbol: string }[] = [
  { id: "GBP", label: "GBP", symbol: "£" },
  { id: "USD", label: "USD", symbol: "$" },
  { id: "EUR", label: "EUR", symbol: "€" },
  { id: "OTHER", label: "Other", symbol: "—" },
];

export function Step3Business({ businessModel, currency, customCurrency, primaryMarket, onChange, onBack, onNext }: Props) {
  const ready = !!businessModel && !!currency && primaryMarket.trim().length > 0
    && (currency !== "OTHER" || customCurrency.trim().length > 0);

  return (
    <StepShell
      eyebrow="Step 3 of 8 — Business"
      title="Tell us about your business"
      description="This shapes how we label revenue, conversions, and benchmarks throughout the product."
      onBack={onBack}
      onNext={onNext}
      nextDisabled={!ready}
    >
      <div className="space-y-8">
        <Field label="What's your business model?">
          <div className="grid grid-cols-2 gap-3">
            {MODELS.map((m) => {
              const isSelected = businessModel === m.id;
              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => onChange({ businessModel: m.id })}
                  className={[
                    "text-left px-4 py-4 rounded-xl border transition-all flex items-start gap-3",
                    isSelected
                      ? "border-primary bg-primary/5"
                      : "border-border bg-card hover:border-primary/30",
                  ].join(" ")}
                >
                  <m.icon className={["w-5 h-5 mt-0.5 shrink-0", isSelected ? "text-primary" : "text-muted-foreground"].join(" ")} />
                  <div>
                    <div className="font-semibold text-sm">{m.label}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">{m.sub}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </Field>

        <Field label="What currency do you operate in?">
          <div className="flex gap-2 flex-wrap">
            {CURRENCIES.map((c) => {
              const isSelected = currency === c.id;
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => onChange({ currency: c.id })}
                  className={[
                    "px-4 py-2.5 rounded-lg border text-sm font-medium transition-all flex items-center gap-2",
                    isSelected
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-card hover:border-primary/30",
                  ].join(" ")}
                >
                  <span className="font-mono">{c.symbol}</span>
                  {c.label}
                </button>
              );
            })}
          </div>
          {currency === "OTHER" && (
            <input
              type="text"
              placeholder="e.g. AUD, CAD, JPY"
              value={customCurrency}
              onChange={(e) => onChange({ customCurrency: e.target.value })}
              className="mt-3 w-full max-w-xs px-4 py-2.5 rounded-lg border border-border bg-card text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          )}
        </Field>

        <Field label="What's your primary market?" hint="Country or region. Affects CTR benchmarks.">
          <input
            type="text"
            placeholder="e.g. United Kingdom, United States, Germany"
            value={primaryMarket}
            onChange={(e) => onChange({ primaryMarket: e.target.value })}
            className="w-full px-4 py-2.5 rounded-lg border border-border bg-card text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </Field>
      </div>
    </StepShell>
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
