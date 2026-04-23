import { useState } from "react";
import { Plus, Trash2, RefreshCw, ChevronDown, ChevronRight } from "lucide-react";

type MatchType = "contains" | "not_contains" | "is" | "is_not" | "regex";

const MATCH_OPTIONS: { value: MatchType; label: string }[] = [
  { value: "contains", label: "Contains" },
  { value: "not_contains", label: "Doesn't contain" },
  { value: "is", label: "Is" },
  { value: "is_not", label: "Is not" },
  { value: "regex", label: "Regex" },
];

interface PageTypeRow {
  id: string;
  label: string;
  matchType: MatchType;
  pattern: string;
  pageCount: number;
  cvr: string;
  aov: string;
  useGlobal: boolean;
  ga4Synced: boolean;
}

const INITIAL: PageTypeRow[] = [
  { id: "pdp", label: "Product pages", matchType: "contains", pattern: "/product/", pageCount: 1247, cvr: "3.1", aov: "92", useGlobal: false, ga4Synced: true },
  { id: "plp", label: "Category pages", matchType: "contains", pattern: "/category/", pageCount: 84, cvr: "1.8", aov: "78", useGlobal: false, ga4Synced: true },
  { id: "blog", label: "Blog posts", matchType: "contains", pattern: "/blog/", pageCount: 312, cvr: "0.4", aov: "65", useGlobal: false, ga4Synced: true },
  { id: "guides", label: "Guides & resources", matchType: "contains", pattern: "/guides/", pageCount: 47, cvr: "", aov: "", useGlobal: true, ga4Synced: false },
  { id: "home", label: "Homepage", matchType: "is", pattern: "/", pageCount: 1, cvr: "2.4", aov: "84", useGlobal: false, ga4Synced: true },
];

interface Props {
  onDirty: () => void;
}

export function PageTypesSection({ onDirty }: Props) {
  const [rows, setRows] = useState<PageTypeRow[]>(INITIAL);
  const [expanded, setExpanded] = useState<string | null>(null);

  const update = (id: string, patch: Partial<PageTypeRow>) => {
    setRows((r) => r.map((row) => (row.id === id ? { ...row, ...patch } : row)));
    onDirty();
  };

  const remove = (id: string) => {
    setRows((r) => r.filter((row) => row.id !== id));
    onDirty();
  };

  const add = () => {
    const id = `pt-${Date.now()}`;
    setRows((r) => [
      ...r,
      { id, label: "New page type", matchType: "contains", pattern: "/path/", pageCount: 0, cvr: "", aov: "", useGlobal: true, ga4Synced: false },
    ]);
    setExpanded(id);
    onDirty();
  };

  return (
    <div className="space-y-3">
      <div className="rounded-lg border border-border overflow-hidden">
        <div className="grid grid-cols-[1fr_auto_auto] gap-4 px-4 py-2.5 bg-surface/40 border-b border-border text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
          <span>Page type</span>
          <span className="w-20 text-right">Pages</span>
          <span className="w-8" />
        </div>
        {rows.map((row) => (
          <div key={row.id} className="border-b border-border last:border-0">
            <button
              onClick={() => setExpanded(expanded === row.id ? null : row.id)}
              className="w-full grid grid-cols-[1fr_auto_auto] gap-4 px-4 py-3 items-center text-left hover:bg-surface/40 transition-colors"
            >
              <div className="flex items-center gap-2 min-w-0">
                {expanded === row.id ? (
                  <ChevronDown className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                ) : (
                  <ChevronRight className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                )}
                <div className="min-w-0">
                  <div className="text-sm font-medium truncate">{row.label}</div>
                  <div className="text-[11px] font-mono text-muted-foreground truncate">{row.pattern}</div>
                </div>
              </div>
              <span className="text-xs font-mono text-muted-foreground w-20 text-right">
                {row.pageCount.toLocaleString()}
              </span>
              <span
                onClick={(e) => {
                  e.stopPropagation();
                  remove(row.id);
                }}
                className="w-8 h-8 rounded-md flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </span>
            </button>

            {expanded === row.id && (
              <div className="px-4 pb-4 pt-1 bg-surface/20 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-medium text-muted-foreground mb-1">Label</label>
                    <input
                      type="text"
                      value={row.label}
                      onChange={(e) => update(row.id, { label: e.target.value })}
                      className="w-full px-3 py-1.5 rounded-md border border-border bg-background text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-muted-foreground mb-1">URL pattern</label>
                    <div className="flex gap-2">
                      <select
                        value={row.matchType}
                        onChange={(e) => update(row.id, { matchType: e.target.value as MatchType })}
                        className="px-2 py-1.5 rounded-md border border-border bg-background text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary shrink-0"
                      >
                        {MATCH_OPTIONS.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                      <input
                        type="text"
                        value={row.pattern}
                        onChange={(e) => update(row.id, { pattern: e.target.value })}
                        className="w-full px-3 py-1.5 rounded-md border border-border bg-background text-sm font-mono focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    id={`global-${row.id}`}
                    type="checkbox"
                    checked={row.useGlobal}
                    onChange={(e) => update(row.id, { useGlobal: e.target.checked })}
                    className="w-3.5 h-3.5 rounded border-border"
                  />
                  <label htmlFor={`global-${row.id}`} className="text-xs text-muted-foreground cursor-pointer">
                    Use global CVR & AOV
                  </label>
                </div>

                {!row.useGlobal && (
                  <div className="grid grid-cols-1 sm:grid-cols-[1fr_1fr_auto] gap-3 items-end">
                    <div>
                      <label className="block text-[11px] font-medium text-muted-foreground mb-1">
                        CVR override
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          step="0.1"
                          value={row.cvr}
                          onChange={(e) => update(row.id, { cvr: e.target.value })}
                          className="w-full pr-7 pl-3 py-1.5 rounded-md border border-border bg-background text-sm font-mono focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-muted-foreground font-mono">
                          %
                        </span>
                      </div>
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-muted-foreground mb-1">
                        AOV override
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground font-mono">
                          £
                        </span>
                        <input
                          type="number"
                          value={row.aov}
                          onChange={(e) => update(row.id, { aov: e.target.value })}
                          className="w-full pl-7 pr-3 py-1.5 rounded-md border border-border bg-background text-sm font-mono focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                        />
                      </div>
                    </div>
                    <button
                      onClick={() => update(row.id, { ga4Synced: true })}
                      className="inline-flex items-center gap-1.5 text-xs px-3 py-2 rounded-md border border-border hover:bg-surface text-muted-foreground hover:text-foreground transition-colors h-9"
                      title="Re-query GA4 for this URL pattern"
                    >
                      <RefreshCw className="w-3 h-3" /> From GA4
                    </button>
                  </div>
                )}

                {row.ga4Synced && !row.useGlobal && (
                  <p className="text-[11px] text-muted-foreground font-mono">
                    Last synced from GA4 — values are editable
                  </p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      <button
        onClick={add}
        className="inline-flex items-center gap-2 text-sm px-3 py-2 rounded-lg border border-dashed border-border hover:border-primary hover:bg-primary/5 hover:text-primary text-muted-foreground transition-colors"
      >
        <Plus className="w-4 h-4" /> Add page type
      </button>
    </div>
  );
}
