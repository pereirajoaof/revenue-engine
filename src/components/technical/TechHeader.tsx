import { useState } from "react";
import { ChevronDown, Calendar, Plus } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";

const RANGES = ["7d", "30d", "90d"] as const;
const PAGE_TYPES = ["All page types", "Routes", "Stops", "City", "Operator", "Blog"];

export function TechHeader({ title = "Technical Health" }: { title?: string }) {
  const [range, setRange] = useState<(typeof RANGES)[number]>("30d");
  const [pageType, setPageType] = useState(PAGE_TYPES[0]);

  return (
    <header className="border-b border-border bg-background/80 backdrop-blur sticky top-0 z-30">
      <div className="px-6 lg:px-8 py-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
            Growth driver · Technical
          </p>
          <h1 className="text-2xl font-bold tracking-tight mt-0.5">{title}</h1>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Date range */}
          <div className="flex items-center rounded-md border border-border bg-surface p-0.5">
            <Calendar className="w-3.5 h-3.5 text-muted-foreground ml-2" />
            {RANGES.map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRange(r)}
                className={`px-3 py-1.5 text-xs font-mono rounded-sm transition-colors ${
                  range === r ? "bg-card text-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {r === "7d" ? "Last 7 days" : r === "30d" ? "Last 30 days" : "Last 90 days"}
              </button>
            ))}
          </div>

          {/* Page Type filter */}
          <PageTypeFilter value={pageType} options={PAGE_TYPES} onChange={setPageType} />

          {/* Primary CTA */}
          <button className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md bg-primary text-primary-foreground text-xs font-semibold hover:brightness-110 transition-all shadow-[0_0_20px_var(--glow)]">
            <Plus className="w-3.5 h-3.5" />
            Create Action
          </button>

          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}

function PageTypeFilter({
  value,
  options,
  onChange,
}: {
  value: string;
  options: string[];
  onChange: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md border border-border bg-surface text-xs hover:bg-card transition-colors"
      >
        <span className="text-muted-foreground font-mono">Page Type:</span>
        <span className="text-foreground">{value}</span>
        <ChevronDown className="w-3 h-3 text-muted-foreground" />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 mt-1 z-20 min-w-[180px] rounded-md border border-border bg-popover shadow-lg p-1">
            {options.map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => {
                  onChange(opt);
                  setOpen(false);
                }}
                className={`w-full text-left px-2.5 py-1.5 text-xs rounded transition-colors ${
                  opt === value ? "bg-primary/10 text-primary" : "hover:bg-surface"
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
