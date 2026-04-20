import { Link } from "@tanstack/react-router";
import { LayoutDashboard, Search, Bell, Settings } from "lucide-react";

export function DashboardNav() {
  return (
    <aside className="hidden lg:flex fixed left-0 top-0 h-screen w-56 border-r border-border bg-card/40 flex-col">
      <div className="px-5 py-5 flex items-center gap-2 border-b border-border">
        <div className="w-7 h-7 rounded-md bg-primary flex items-center justify-center">
          <span className="text-primary-foreground font-bold text-sm">O</span>
        </div>
        <span className="font-bold text-base tracking-tight">OrganicOS</span>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        <p className="px-2 py-1 text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Workspace</p>
        <NavItem icon={<LayoutDashboard className="w-4 h-4" />} label="Revenue & Opportunities" active />
        <NavItem icon={<Search className="w-4 h-4" />} label="Keyword Demand" />
        <NavItem icon={<Bell className="w-4 h-4" />} label="Alerts" />
        <NavItem icon={<Settings className="w-4 h-4" />} label="Settings" />
      </nav>

      <div className="px-3 py-4 border-t border-border">
        <div className="flex items-center gap-3 px-2">
          <div className="w-8 h-8 rounded-full bg-surface border border-border flex items-center justify-center text-xs font-mono">JS</div>
          <div className="min-w-0">
            <p className="text-xs font-medium truncate">Jane Smith</p>
            <p className="text-[10px] text-muted-foreground font-mono truncate">acme.com</p>
          </div>
        </div>
      </div>

      <Link to="/" className="px-5 py-3 text-[10px] font-mono uppercase tracking-wider text-muted-foreground hover:text-primary transition-colors border-t border-border">
        ← Back to site
      </Link>
    </aside>
  );
}

function NavItem({ icon, label, active }: { icon: React.ReactNode; label: string; active?: boolean }) {
  return (
    <button
      className={`w-full flex items-center gap-2.5 px-2 py-2 rounded-md text-sm transition-colors ${
        active
          ? "bg-surface text-foreground border border-border"
          : "text-muted-foreground hover:text-foreground hover:bg-surface/60"
      }`}
    >
      {icon}
      <span className="truncate">{label}</span>
    </button>
  );
}
