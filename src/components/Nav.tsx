import { Link } from "@tanstack/react-router";

export function Nav() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-md bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">O</span>
          </div>
          <span className="font-bold text-lg tracking-tight">OrganicOS</span>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/dashboard"
            className="hidden sm:inline-flex px-4 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            View dashboard
          </Link>
          <button className="px-5 py-2 rounded-lg bg-surface border border-border text-sm font-medium text-foreground hover:bg-primary hover:text-primary-foreground transition-colors">
            Get early access
          </button>
        </div>
      </div>
    </nav>
  );
}
