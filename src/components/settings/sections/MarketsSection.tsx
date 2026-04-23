import { useState } from "react";
import { X, Plus } from "lucide-react";

interface Props {
  onDirty: () => void;
}

export function MarketsSection({ onDirty }: Props) {
  const [markets, setMarkets] = useState<string[]>(["United Kingdom", "Ireland"]);
  const [draft, setDraft] = useState("");

  const add = (m: string) => {
    const v = m.trim();
    if (!v || markets.includes(v)) return;
    setMarkets([...markets, v]);
    setDraft("");
    onDirty();
  };

  const remove = (m: string) => {
    setMarkets(markets.filter((x) => x !== m));
    onDirty();
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-medium text-muted-foreground mb-2">Primary markets</label>
        <div className="flex flex-wrap gap-2 p-2 rounded-lg border border-border bg-background min-h-[44px]">
          {markets.map((m) => (
            <span
              key={m}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-surface border border-border text-xs"
            >
              {m}
              <button
                onClick={() => remove(m)}
                className="hover:bg-destructive/20 hover:text-destructive rounded p-0.5 transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
          <input
            type="text"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                add(draft);
              }
            }}
            onBlur={() => draft && add(draft)}
            placeholder={markets.length === 0 ? "e.g. United Kingdom" : "Add another…"}
            className="flex-1 min-w-[180px] bg-transparent text-sm focus:outline-none px-1"
          />
        </div>
        <p className="text-[11px] text-muted-foreground mt-1.5">
          Affects CTR benchmarks and SERP feature presence per query.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {["United States", "Germany", "France", "Spain", "Italy"]
          .filter((s) => !markets.includes(s))
          .map((s) => (
            <button
              key={s}
              onClick={() => add(s)}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md border border-dashed border-border hover:border-primary hover:bg-primary/5 hover:text-primary text-xs text-muted-foreground transition-colors"
            >
              <Plus className="w-3 h-3" />
              {s}
            </button>
          ))}
      </div>
    </div>
  );
}
