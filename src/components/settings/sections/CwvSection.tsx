import { useState } from "react";
import { Monitor, MonitorSmartphone, Smartphone } from "lucide-react";
import { Field } from "../Field";

type FormFactor = "mobile" | "desktop" | "all";

const FORM_FACTORS: {
  id: FormFactor;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  {
    id: "mobile",
    label: "Mobile",
    description: "Recommended default for most tenants.",
    icon: Smartphone,
  },
  {
    id: "desktop",
    label: "Desktop",
    description: "Use desktop p75 values from CrUX.",
    icon: Monitor,
  },
  {
    id: "all",
    label: "All",
    description: "Fetch all device-level CrUX values.",
    icon: MonitorSmartphone,
  },
];

interface Props {
  onDirty: () => void;
}

export function CwvSection({ onDirty }: Props) {
  const [formFactor, setFormFactor] = useState<FormFactor>("mobile");

  const selectFormFactor = (value: FormFactor) => {
    setFormFactor(value);
    onDirty();
  };

  return (
    <div className="space-y-5">
      <Field
        label="Form Factor"
        hint="Configured per tenant. Controls which Chrome UX Report p75 device values are fetched."
      >
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {FORM_FACTORS.map((option) => {
            const isSelected = formFactor === option.id;
            const Icon = option.icon;

            return (
              <button
                key={option.id}
                type="button"
                onClick={() => selectFormFactor(option.id)}
                className={`px-3 py-3 rounded-lg border text-left transition-all flex gap-3 min-h-[92px] ${
                  isSelected ? "border-primary bg-primary/5" : "border-border bg-background hover:border-primary/30"
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 mt-0.5 ${isSelected ? "text-primary" : "text-muted-foreground"}`} />
                <span className="min-w-0">
                  <span className="block text-sm font-medium">{option.label}</span>
                  <span className="block text-xs text-muted-foreground leading-relaxed mt-1">
                    {option.description}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </Field>

      <p className="text-[11px] text-muted-foreground leading-relaxed">
        Mobile is the default because most organic traffic is mobile-led. Changes apply to future CWV fetches and
        recalculations.
      </p>
    </div>
  );
}