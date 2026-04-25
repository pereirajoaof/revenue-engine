import { useState } from "react";
import { Link, useNavigate, useLocation } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Search,
  Bell,
  Settings,
  ChevronUp,
  ChevronDown,
  LogOut,
  UserCog,
  UserPlus,
  Check,
  Sparkles,
  MousePointer2,
  Globe,
  FileText,
  Activity,
  Gauge,
  Link2,
  MapPin,
  Clock,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";

const PROFILES = [
  { initials: "JS", name: "Jane Smith", domain: "acme.com" },
  { initials: "MR", name: "Marco Rossi", domain: "northwind.io" },
];

const GROWTH_DRIVERS = [
  { key: "brand-authority", label: "Brand Authority", icon: Sparkles },
  { key: "user-experience", label: "User Experience", icon: MousePointer2 },
  { key: "website-authority", label: "Website Authority", icon: Globe },
  { key: "content-quality", label: "Content Quality", icon: FileText },
  { key: "technical-health", label: "Technical Health", icon: Activity },
  { key: "links", label: "Links", icon: Link2 },
  { key: "geo-locale", label: "Geo / Locale", icon: MapPin },
];

export function DashboardNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const active = PROFILES[0];
  const path = location.pathname;
  const search = location.search as Record<string, string> | undefined;
  const isTechRoute = path.startsWith("/technical-health");
  const isBrandRoute = path.startsWith("/brand-authority");
  const isDomainAgeRoute = path === "/brand-authority/domain-age";
  const activeDriver = isTechRoute
    ? "technical-health"
    : isBrandRoute
      ? "brand-authority"
      : path === "/dashboard"
      ? search?.driver
      : undefined;
  const isRevenueParentActive = path === "/dashboard" || isTechRoute || isBrandRoute;
  const [driversOpen, setDriversOpen] = useState(true);

  const handleLogout = () => {
    navigate({ to: "/" });
  };
  return (
    <aside className="hidden lg:flex fixed left-0 top-0 h-screen w-56 border-r border-border bg-card/40 flex-col">
      <div className="px-5 py-5 flex items-center gap-2 border-b border-border">
        <div className="w-7 h-7 rounded-md bg-primary flex items-center justify-center">
          <span className="text-primary-foreground font-bold text-sm">O</span>
        </div>
        <span className="font-bold text-base tracking-tight">OrganicOS</span>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <p className="px-2 py-1 text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Workspace</p>

        <div>
          <div
            className={`w-full flex items-center gap-2.5 px-2 py-2 rounded-md text-sm transition-colors ${
              isRevenueParentActive && !activeDriver
                ? "bg-surface text-foreground border border-border"
                : "text-foreground hover:bg-surface/60"
            }`}
          >
            <Link
              to="/dashboard"
              className="flex items-center gap-2.5 flex-1 min-w-0 font-medium"
            >
              <LayoutDashboard className="w-4 h-4 shrink-0" />
              <span className="truncate">Revenue & Opportunities</span>
            </Link>
            <button
              type="button"
              onClick={() => setDriversOpen((v) => !v)}
              aria-label={driversOpen ? "Collapse growth drivers" : "Expand growth drivers"}
              aria-expanded={driversOpen}
              className="p-0.5 rounded text-muted-foreground hover:text-foreground hover:bg-surface focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform ${driversOpen ? "" : "-rotate-90"}`}
              />
            </button>
          </div>

          {driversOpen && (
            <div className="mt-1 ml-3 pl-3 border-l border-border space-y-0.5">
              <p className="px-2 pt-2 pb-1 text-[9px] font-mono uppercase tracking-wider text-muted-foreground/80">
                Growth drivers
              </p>
              {GROWTH_DRIVERS.map((d) => {
                const isActive = activeDriver === d.key;
                const Icon = d.icon;
                const className = `w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-[12.5px] transition-colors ${
                  isActive
                    ? "bg-primary/10 text-primary border border-primary/20"
                    : "text-muted-foreground hover:text-foreground hover:bg-surface/60"
                }`;
                if (d.key === "brand-authority") {
                  return (
                    <div key={d.key}>
                      <Link to="/brand-authority" className={className}>
                        <Icon className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate">{d.label}</span>
                      </Link>
                      {isActive && (
                        <Link
                          to="/brand-authority/domain-age"
                          className={`ml-5 mt-0.5 flex items-center gap-2 rounded-md px-2 py-1 text-[11px] transition-colors ${
                            isDomainAgeRoute
                              ? "bg-primary/10 text-primary border border-primary/20"
                              : "text-muted-foreground hover:text-foreground hover:bg-surface/60"
                          }`}
                        >
                          <Clock className="w-3 h-3 shrink-0" />
                          <span className="truncate">Domain Age</span>
                        </Link>
                      )}
                    </div>
                  );
                }
                if (d.key === "technical-health") {
                  return (
                    <div key={d.key}>
                      <Link to="/technical-health" className={className}>
                        <Icon className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate">{d.label}</span>
                      </Link>
                      {isActive && (
                        <Link
                          to="/technical-health/cwv"
                          className={`ml-5 mt-0.5 flex items-center gap-2 rounded-md px-2 py-1 text-[11px] transition-colors ${
                            path.startsWith("/technical-health/cwv")
                              ? "bg-primary/10 text-primary border border-primary/20"
                              : "text-muted-foreground hover:text-foreground hover:bg-surface/60"
                          }`}
                        >
                          <Gauge className="w-3 h-3 shrink-0" />
                          <span className="truncate">Core Web Vitals</span>
                        </Link>
                      )}
                    </div>
                  );
                }
                return (
                  <Link
                    key={d.key}
                    to="/dashboard"
                    search={{ driver: d.key }}
                    className={className}
                  >
                    <Icon className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{d.label}</span>
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        <NavItem icon={<Search className="w-4 h-4" />} label="Keyword Demand" />
        <NavItem icon={<Bell className="w-4 h-4" />} label="Alerts" />
        <NavItem
          to="/settings"
          icon={<Settings className="w-4 h-4" />}
          label="Settings"
          active={path === "/settings"}
        />
      </nav>

      <div className="px-3 py-3 border-t border-border">
        <DropdownMenu>
          <DropdownMenuTrigger className="w-full flex items-center gap-3 px-2 py-2 rounded-md hover:bg-surface/60 transition-colors group focus:outline-none focus:ring-2 focus:ring-ring">
            <div className="w-8 h-8 rounded-full bg-surface border border-border flex items-center justify-center text-xs font-mono shrink-0">
              {active.initials}
            </div>
            <div className="min-w-0 flex-1 text-left">
              <p className="text-xs font-medium truncate">{active.name}</p>
              <p className="text-[10px] text-muted-foreground font-mono truncate">{active.domain}</p>
            </div>
            <ChevronUp className="w-3.5 h-3.5 text-muted-foreground group-hover:text-foreground transition-colors shrink-0" />
          </DropdownMenuTrigger>
          <DropdownMenuContent side="top" align="start" className="w-52">
            <DropdownMenuLabel className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
              Switch profile
            </DropdownMenuLabel>
            <DropdownMenuGroup>
              {PROFILES.map((p) => (
                <DropdownMenuItem key={p.initials} className="gap-2">
                  <div className="w-6 h-6 rounded-full bg-surface border border-border flex items-center justify-center text-[10px] font-mono shrink-0">
                    {p.initials}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium truncate">{p.name}</p>
                    <p className="text-[10px] text-muted-foreground font-mono truncate">{p.domain}</p>
                  </div>
                  {p.initials === active.initials && <Check className="w-3.5 h-3.5 text-primary shrink-0" />}
                </DropdownMenuItem>
              ))}
              <DropdownMenuItem className="gap-2 text-muted-foreground">
                <UserPlus className="w-4 h-4" />
                <span className="text-xs">Add account</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="gap-2">
              <UserCog className="w-4 h-4" />
              <span className="text-xs">Account settings</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleLogout} className="gap-2 text-destructive focus:text-destructive">
              <LogOut className="w-4 h-4" />
              <span className="text-xs">Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Link to="/" className="px-5 py-3 text-[10px] font-mono uppercase tracking-wider text-muted-foreground hover:text-primary transition-colors border-t border-border">
        ← Back to site
      </Link>
    </aside>
  );
}

function NavItem({
  icon,
  label,
  active,
  to,
}: {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  to?: "/dashboard" | "/settings";
}) {
  const className = `w-full flex items-center gap-2.5 px-2 py-2 rounded-md text-sm transition-colors ${
    active
      ? "bg-surface text-foreground border border-border"
      : "text-muted-foreground hover:text-foreground hover:bg-surface/60"
  }`;

  if (to) {
    return (
      <Link to={to} className={className}>
        {icon}
        <span className="truncate">{label}</span>
      </Link>
    );
  }

  return (
    <button className={className}>
      {icon}
      <span className="truncate">{label}</span>
    </button>
  );
}
