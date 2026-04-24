import { useState } from "react";
import { ChevronDown, Calendar, Globe } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";

const RANGES = ["7d", "30d", "90d"] as const;
const PAGE_TYPES = ["All page types", "Routes", "Stops", "City", "Operator", "Blog"];
const MARKETS = ["All markets", "UK", "US", "DE", "FR", "ES"];

export function TechHeader() {
  const [range, setRange] = useState<(typeof RANGES)[number]>("30d");
  const [pageType, setPageType] = useState(PAGE_TYPES[0]);
  const [market, setMarket] = useState(MARKETS[0]);

  return (
    <header className="sticky top-0 z-30 backdrop-blur bg-background/80 border-b border-border">
      <div className="px-6 lg:px-8 py-4 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-1">
          <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
            Growth driver · Technical
          </p>
          <h1 className="text-2xl font-bold tracking-tight font-display">Technical Health</h1>
          <p className="text-sm text-muted-foreground">
            Revenue impact of crawlability, indexation, and performance.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1 p-1 rounded-md bg-surface border border-border">
            <Calendar className="w-3.5 h-3.5 text-muted-foreground ml-1.5" />
            {RANGES.map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRange(r)}
                className={`px-2.5 py-1 text-xs font-mono rounded transition-colors ${
                  range === r
                    ? "bg-background text-foreground border border-border"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {r === "7d" ? "Last 7d" : r === "30d" ? "Last 30d" : "Last 90d"}
              </button>
            ))}
          </div>

          <Pill icon={null} value={pageType} options={PAGE_TYPES} onChange={setPageType} />
          <Pill icon={<Globe className="w-3.5 h-3.5" />} value={market} options={MARKETS} onChange={setMarket} />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}

function Pill({
  icon,
  value,
  options,
  onChange,
}: {
  icon: React.ReactNode;
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
        className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs rounded-md bg-surface border border-border hover:bg-surface/70 transition-colors"
      >
        {icon}
        <span>{value}</span>
        <ChevronDown className="w-3 h-3 text-muted-foreground" />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 mt-1 z-20 min-w-[160px] rounded-md border border-border bg-popover shadow-lg p-1">
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
