import { useState } from "react";
import { ChevronDown, Plus, Calendar } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";

const RANGES = ["7d", "30d", "90d"] as const;
const FILTERS = [
  { label: "Page Type", value: "All page types" },
  { label: "Country", value: "All countries" },
  { label: "Device", value: "All devices" },
];

export function DashboardHeader() {
  const [range, setRange] = useState<(typeof RANGES)[number]>("30d");

  return (
    <header className="border-b border-border bg-background/80 backdrop-blur sticky top-0 z-20">
      <div className="px-6 lg:px-8 py-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Dashboard</p>
          <h1 className="text-2xl font-bold tracking-tight mt-0.5">Revenue & Opportunities</h1>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Date range */}
          <div className="flex items-center rounded-md border border-border bg-surface p-0.5">
            <Calendar className="w-3.5 h-3.5 text-muted-foreground ml-2" />
            {RANGES.map((r) => (
              <button
                key={r}
                onClick={() => setRange(r)}
                className={`px-3 py-1.5 text-xs font-mono rounded-sm transition-colors ${
                  range === r ? "bg-card text-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {r === "7d" ? "Last 7 days" : r === "30d" ? "Last 30 days" : "Last 90 days"}
              </button>
            ))}
          </div>

          {/* Filters */}
          {FILTERS.map((f) => (
            <button
              key={f.label}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md border border-border bg-surface text-xs hover:bg-card transition-colors"
            >
              <span className="text-muted-foreground font-mono">{f.label}:</span>
              <span className="text-foreground">{f.value}</span>
              <ChevronDown className="w-3 h-3 text-muted-foreground" />
            </button>
          ))}

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
