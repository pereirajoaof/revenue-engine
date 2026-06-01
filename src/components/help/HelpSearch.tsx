import { useEffect, useRef, useState } from "react";
import { Search, FileText, ArrowRight, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { POPULAR_ARTICLES } from "./HelpData";

type Props = {
  placeholder?: string;
  size?: "lg" | "md";
  scopeLabel?: string;
};

export function HelpSearch({
  placeholder = "Search the knowledge center…",
  size = "lg",
  scopeLabel,
}: Props) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const query = value.trim().toLowerCase();
  const matches = query
    ? POPULAR_ARTICLES.filter((a) => a.title.toLowerCase().includes(query))
    : POPULAR_ARTICLES.slice(0, 5);
  const noResults = query.length > 0 && matches.length === 0;

  return (
    <div ref={wrapRef} className="relative w-full">
      <div
        className={cn(
          "group flex items-center gap-3 rounded-xl border bg-card transition-all",
          size === "lg" ? "px-5 py-4" : "px-4 py-3",
          open
            ? "border-primary/60 shadow-[0_0_0_4px_color-mix(in_oklab,var(--primary)_15%,transparent)]"
            : "border-border shadow-sm hover:border-foreground/20",
        )}
      >
        <Search
          className={cn(
            "shrink-0 text-muted-foreground",
            size === "lg" ? "h-5 w-5" : "h-4 w-4",
          )}
        />
        <input
          data-help-search-input
          type="search"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onFocus={() => setOpen(true)}
          placeholder={placeholder}
          className={cn(
            "flex-1 bg-transparent outline-none placeholder:text-muted-foreground",
            size === "lg" ? "text-base" : "text-sm",
          )}
        />
        {scopeLabel && (
          <span className="hidden rounded-md border border-border bg-surface/70 px-2 py-1 font-mono text-[10px] uppercase tracking-wider text-muted-foreground sm:inline">
            in {scopeLabel}
          </span>
        )}
        {value && (
          <button
            type="button"
            onClick={() => setValue("")}
            className="rounded p-1 text-muted-foreground hover:bg-surface hover:text-foreground"
            aria-label="Clear search"
          >
            <X className="h-4 w-4" />
          </button>
        )}
        <kbd className="hidden rounded border border-border bg-surface px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground sm:inline">
          /
        </kbd>
      </div>

      {open && (
        <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-20 overflow-hidden rounded-xl border border-border bg-card shadow-lg">
          <div className="flex items-center justify-between border-b border-border px-4 py-2">
            <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
              {noResults ? "No results" : query ? "Matches" : "Suggested"}
            </span>
            <span className="font-mono text-[10px] text-muted-foreground">
              {matches.length} {matches.length === 1 ? "article" : "articles"}
            </span>
          </div>

          {noResults ? (
            <div className="px-5 py-8 text-center">
              <p className="text-sm font-medium text-foreground">No articles found</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Try a different search term, or get in touch.
              </p>
              <a
                href="#get-in-touch"
                onClick={() => setOpen(false)}
                className="mt-4 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:brightness-110"
              >
                Contact support <ArrowRight className="h-3.5 w-3.5" />
              </a>
            </div>
          ) : (
            <ul className="max-h-80 overflow-y-auto py-1">
              {matches.map((m) => (
                <li key={m.title}>
                  <button
                    type="button"
                    className="flex w-full items-center gap-3 px-4 py-2.5 text-left hover:bg-surface"
                  >
                    <FileText className="h-4 w-4 shrink-0 text-muted-foreground" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-foreground">
                        {m.title}
                      </p>
                      <p className="truncate font-mono text-[11px] text-muted-foreground">
                        {m.category}
                      </p>
                    </div>
                    <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
