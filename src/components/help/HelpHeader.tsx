import { Link } from "@tanstack/react-router";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LifeBuoy } from "lucide-react";

export function HelpHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-6">
          <Link to="/early-access" className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary">
              <span className="text-sm font-bold text-primary-foreground">O</span>
            </div>
            <span className="text-lg font-bold tracking-tight">OrganicOS</span>
          </Link>
          <span className="hidden h-5 w-px bg-border sm:block" />
          <Link
            to="/help"
            className="hidden font-mono text-[11px] uppercase tracking-wider text-muted-foreground hover:text-foreground sm:inline"
          >
            Knowledge Center
          </Link>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link
            to="/dashboard"
            className="hidden rounded-lg px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground sm:inline-flex"
          >
            Sign in
          </Link>
          <Link
            to="/request-demo"
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface/70 px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-surface"
          >
            <LifeBuoy className="h-4 w-4" />
            Get support
          </Link>
        </div>
      </div>
    </header>
  );
}
