import { useState } from "react";
import { X, Plus, AlertTriangle } from "lucide-react";

const SUGGESTED = ["acme app", "acme login", "acme pricing"];

interface Props {
  onDirty: () => void;
}

export function BrandKeywordsSection({ onDirty }: Props) {
  const [keywords, setKeywords] = useState<string[]>(["acme", "acmecorp", "acme.com"]);
  const [draft, setDraft] = useState("");

  const add = (kw: string) => {
    const v = kw.trim().toLowerCase();
    if (!v || keywords.includes(v)) return;
    setKeywords([...keywords, v]);
    setDraft("");
    onDirty();
  };

  const remove = (kw: string) => {
    setKeywords(keywords.filter((k) => k !== kw));
    onDirty();
  };

  const handleKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      add(draft);
    }
  };

  const unsuggested = SUGGESTED.filter((s) => !keywords.includes(s));

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-warning/30 bg-warning/5 px-3 py-2.5 flex items-start gap-2.5">
        <AlertTriangle className="w-4 h-4 text-warning shrink-0 mt-0.5" />
        <p className="text-xs text-foreground/80 leading-relaxed">
          A wrong brand list inflates non-brand revenue and breaks every opportunity score. Re-run analysis after editing.
        </p>
      </div>

      <div>
        <label className="block text-xs font-medium text-muted-foreground mb-2">Branded keywords</label>
        <div className="flex flex-wrap gap-2 p-2 rounded-lg border border-border bg-background min-h-[44px]">
          {keywords.map((kw) => (
            <span
              key={kw}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-primary/10 text-primary text-xs font-mono"
            >
              {kw}
              <button
                onClick={() => remove(kw)}
                className="hover:bg-primary/20 rounded p-0.5 transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
          <input
            type="text"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={handleKey}
            onBlur={() => draft && add(draft)}
            placeholder={keywords.length === 0 ? "Type a keyword and press Enter…" : "Add another…"}
            className="flex-1 min-w-[140px] bg-transparent text-sm focus:outline-none px-1"
          />
        </div>
        <p className="text-[11px] text-muted-foreground mt-1.5">
          Press Enter or comma to add. Matched as substrings, case-insensitive.
        </p>
      </div>

      {unsuggested.length > 0 && (
        <div>
          <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-2">Suggested</p>
          <div className="flex flex-wrap gap-2">
            {unsuggested.map((s) => (
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
      )}
    </div>
  );
}
