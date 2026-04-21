import { Pencil, FileText } from "lucide-react";
import { StepShell } from "../StepShell";
import type { PageType } from "../types";

interface Props {
  pageTypes: PageType[];
  onChange: (next: PageType[]) => void;
  onBack: () => void;
  onNext: () => void;
}

export function Step7PageTypes({ pageTypes, onChange, onBack, onNext }: Props) {
  const updateLabel = (id: string, label: string) =>
    onChange(pageTypes.map((p) => (p.id === id ? { ...p, label } : p)));

  return (
    <StepShell
      eyebrow="Step 7 of 8 — Pages"
      title="Confirm your page types"
      description="We classified your pages from your sitemap. Edit any label that's off — we'll use these to group revenue and opportunities."
      onBack={onBack}
      onNext={onNext}
      nextLabel="Looks good"
    >
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="px-5 py-3 border-b border-border bg-surface flex items-center justify-between">
          <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
            {pageTypes.length} page types · {pageTypes.reduce((s, p) => s + p.pageCount, 0).toLocaleString()} pages total
          </span>
          <span className="text-xs font-mono uppercase tracking-wider text-primary">LLM classified</span>
        </div>

        <ul className="divide-y divide-border">
          {pageTypes.map((p) => (
            <li key={p.id} className="px-5 py-4 flex items-center gap-4 group">
              <div className="w-9 h-9 rounded-lg bg-surface flex items-center justify-center shrink-0">
                <FileText className="w-4 h-4 text-muted-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="relative">
                  <input
                    type="text"
                    value={p.label}
                    onChange={(e) => updateLabel(p.id, e.target.value)}
                    className="w-full bg-transparent text-sm font-semibold border-none p-0 focus:outline-none focus:ring-0 pr-6"
                  />
                  <Pencil className="absolute right-0 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground/0 group-hover:text-muted-foreground/60 transition-colors pointer-events-none" />
                </div>
                <div className="text-xs font-mono text-muted-foreground mt-0.5">{p.pattern}</div>
              </div>
              <div className="text-right shrink-0">
                <div className="text-sm font-mono font-semibold">{p.pageCount.toLocaleString()}</div>
                <div className="text-xs text-muted-foreground">pages</div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-4 rounded-lg border border-border bg-surface/50 px-4 py-3 text-xs text-muted-foreground">
        <strong className="text-foreground font-semibold">Note:</strong> All page types use your global CVR & AOV by default.
        You can override them per page type from Settings once you're inside the dashboard.
      </div>
    </StepShell>
  );
}
