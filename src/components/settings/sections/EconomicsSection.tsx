import { useState } from "react";
import { ShoppingBag, Cloud, Users, MoreHorizontal } from "lucide-react";
import { Field } from "../Field";

type BusinessModel = "ecommerce" | "saas" | "leadgen" | "other";
type Currency = "GBP" | "USD" | "EUR" | "OTHER";

const MODELS: { id: BusinessModel; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: "ecommerce", label: "Ecommerce", icon: ShoppingBag },
  { id: "saas", label: "SaaS", icon: Cloud },
  { id: "leadgen", label: "Lead generation", icon: Users },
  { id: "other", label: "Other", icon: MoreHorizontal },
];

const CURRENCIES: { id: Currency; symbol: string }[] = [
  { id: "GBP", symbol: "£" },
  { id: "USD", symbol: "$" },
  { id: "EUR", symbol: "€" },
  { id: "OTHER", symbol: "—" },
];

interface Props {
  onDirty: () => void;
}

export function EconomicsSection({ onDirty }: Props) {
  const [model, setModel] = useState<BusinessModel>("ecommerce");
  const [currency, setCurrency] = useState<Currency>("GBP");
  const [cvr, setCvr] = useState("2.4");
  const [aov, setAov] = useState("84");

  const aovLabel =
    model === "saas" ? "Average contract value" : model === "leadgen" ? "Value per lead" : "Average order value";

  const symbol = CURRENCIES.find((c) => c.id === currency)?.symbol ?? "£";

  const set = <T,>(setter: (v: T) => void, v: T) => {
    setter(v);
    onDirty();
  };

  return (
    <div className="space-y-6">
      <Field label="Business model" hint="Affects revenue labels and the formula used to weight opportunities.">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {MODELS.map((m) => {
            const isSel = model === m.id;
            const Icon = m.icon;
            return (
              <button
                key={m.id}
                onClick={() => set(setModel, m.id)}
                className={`px-3 py-3 rounded-lg border text-left transition-all flex items-center gap-2 ${
                  isSel ? "border-primary bg-primary/5" : "border-border bg-background hover:border-primary/30"
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isSel ? "text-primary" : "text-muted-foreground"}`} />
                <span className="text-xs font-medium">{m.label}</span>
              </button>
            );
          })}
        </div>
      </Field>

      <Field label="Currency">
        <div className="flex gap-2 flex-wrap">
          {CURRENCIES.map((c) => {
            const isSel = currency === c.id;
            return (
              <button
                key={c.id}
                onClick={() => set(setCurrency, c.id)}
                className={`px-3 py-2 rounded-lg border text-sm font-medium transition-all flex items-center gap-2 ${
                  isSel
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-background hover:border-primary/30"
                }`}
              >
                <span className="font-mono">{c.symbol}</span>
                {c.id}
              </button>
            );
          })}
        </div>
      </Field>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Field label="Global conversion rate" hint="Site-wide default. Page types can override.">
          <div className="relative max-w-[200px]">
            <input
              type="number"
              step="0.1"
              value={cvr}
              onChange={(e) => set(setCvr, e.target.value)}
              className="w-full pr-8 pl-3 py-2 rounded-lg border border-border bg-background text-sm font-mono focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground font-mono">
              %
            </span>
          </div>
        </Field>

        <Field label={aovLabel} hint="Site-wide default. Page types can override.">
          <div className="relative max-w-[200px]">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground font-mono">
              {symbol}
            </span>
            <input
              type="number"
              value={aov}
              onChange={(e) => set(setAov, e.target.value)}
              className="w-full pl-7 pr-3 py-2 rounded-lg border border-border bg-background text-sm font-mono focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
        </Field>
      </div>
    </div>
  );
}
