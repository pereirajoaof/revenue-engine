import { Globe, Folder } from "lucide-react";
import { StepShell } from "../StepShell";
import { MOCK_PROPERTIES } from "../types";

interface Props {
  selected: string | null;
  onSelect: (url: string) => void;
  onBack: () => void;
  onNext: () => void;
}

export function Step2Property({ selected, onSelect, onBack, onNext }: Props) {
  return (
    <StepShell
      eyebrow="Step 2 of 8 — Property"
      title="Which property is your main site?"
      description="Pick the property you want OrganicOS to model. You can add more sites later."
      onBack={onBack}
      onNext={onNext}
      nextDisabled={!selected}
    >
      <ul className="space-y-2">
        {MOCK_PROPERTIES.map((p) => {
          const isSelected = selected === p.url;
          const Icon = p.type === "domain" ? Globe : Folder;
          return (
            <li key={p.url}>
              <button
                type="button"
                onClick={() => onSelect(p.url)}
                className={[
                  "w-full text-left px-5 py-4 rounded-xl border flex items-center gap-4 transition-all",
                  isSelected
                    ? "border-primary bg-primary/5 shadow-[0_0_24px_var(--glow)]"
                    : "border-border bg-card hover:border-primary/30 hover:bg-surface",
                ].join(" ")}
              >
                <div
                  className={[
                    "w-10 h-10 rounded-lg flex items-center justify-center shrink-0",
                    isSelected ? "bg-primary text-primary-foreground" : "bg-surface text-muted-foreground",
                  ].join(" ")}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-mono text-sm font-medium truncate">{p.url}</div>
                  <div className="text-xs text-muted-foreground mt-0.5 capitalize">
                    {p.type === "domain" ? "Domain property" : "URL prefix"}
                  </div>
                </div>
                <div
                  className={[
                    "w-5 h-5 rounded-full border-2 shrink-0 flex items-center justify-center",
                    isSelected ? "border-primary bg-primary" : "border-border",
                  ].join(" ")}
                >
                  {isSelected && <div className="w-2 h-2 rounded-full bg-primary-foreground" />}
                </div>
              </button>
            </li>
          );
        })}
      </ul>
    </StepShell>
  );
}
