import { Save } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";

interface Props {
  dirtyCount: number;
  onSaveAll: () => void;
}

export function SettingsHeaderBar({ dirtyCount, onSaveAll }: Props) {
  return (
    <header className="border-b border-border bg-background/80 backdrop-blur sticky top-0 z-20">
      <div className="px-6 lg:px-8 py-4 flex items-center justify-between gap-4">
        <div className="min-w-0">
          <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground leading-none mb-1">
            Workspace settings
          </p>
          <h1 className="text-lg font-bold tracking-tight leading-tight truncate">
            Project settings
          </h1>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {dirtyCount > 0 && (
            <>
              <span className="hidden sm:inline text-xs text-muted-foreground font-mono">
                {dirtyCount} unsaved {dirtyCount === 1 ? "change" : "changes"}
              </span>
              <button
                onClick={onSaveAll}
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
              >
                <Save className="w-4 h-4" />
                Save all
              </button>
            </>
          )}
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
