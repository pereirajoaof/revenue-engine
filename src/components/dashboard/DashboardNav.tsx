import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "@tanstack/react-router";
import { AppLink as Link } from "@/lib/app-link";
import { useProjectId } from "@/lib/app-link";
import {
  LayoutDashboard,
  Search,
  Bell,
  Settings,
  Bot,
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
  Target,
  Boxes,
  Calculator,
  AlertTriangle,
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

type SubLink = { to: string; label: string; icon: typeof Gauge; badge?: string };

const GROWTH_DRIVERS: {
  key: string;
  label: string;
  icon: typeof Sparkles;
  to: string;
  soon?: boolean;
  children?: SubLink[];
}[] = [
  {
    key: "brand-authority",
    label: "Brand Authority",
    icon: Sparkles,
    to: "/brand-authority",
    children: [
      { to: "/brand-authority/domain-authority", label: "HostPageRank", icon: Gauge },
      { to: "/brand-authority/domain-age", label: "Domain Age", icon: Clock },
      { to: "/brand-authority/page-age", label: "Page Age", icon: FileText },
      { to: "/brand-authority/site-focus", label: "Site Focus", icon: Target },
      { to: "/brand-authority/brand-love", label: "Brand Love", icon: Sparkles },
      { to: "/brand-authority/ai-visibility", label: "AI Visibility", icon: Bot, badge: "Preview" },
    ],
  },
  { key: "user-experience", label: "User Experience", icon: MousePointer2, to: "/dashboard/user-experience", soon: true },
  {
    key: "website-authority",
    label: "Website Authority",
    icon: Globe,
    to: "/website-authority",
    children: [{ to: "/website-authority/internal-equity", label: "Internal Equity", icon: Link2 }],
  },
  { key: "content-quality", label: "Content Quality", icon: FileText, to: "/dashboard/content-quality", soon: true },
  {
    key: "technical-health",
    label: "Technical Health",
    icon: Activity,
    to: "/technical-health",
    children: [{ to: "/technical-health/cwv", label: "Core Web Vitals", icon: Gauge }],
  },
  { key: "links", label: "Links", icon: Link2, to: "/dashboard/links", soon: true },
  { key: "geo-locale", label: "Geo / Locale", icon: MapPin, to: "/dashboard/geo-locale", soon: true },
];

export function DashboardNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const projectId = useProjectId();
  const active = PROFILES[0];
  // Path relative to the project workspace, e.g. "/dashboard/brand-authority".
  const path = location.pathname.replace(/^\/project\/[^/]+/, "") || "/dashboard";
  const driverPath = path.replace(/^\/dashboard/, "") || "/";

  const isAuditRunsRoute = path.startsWith("/audit-runs");
  const isAuditRunDetailRoute = /^\/audit-runs\/[^/]+/.test(path);
  const auditRunId = isAuditRunDetailRoute ? path.split("/")[2] : "core-commerce";
  const runBase = `/audit-runs/${auditRunId}`;
  const isAuditSetupRoute = path === `${runBase}/settings`;
  const isAuditUrlsRoute = path === `${runBase}/urls`;
  const isAuditErrorsRoute = path === `${runBase}/errors`;
  const isAuditOverviewRoute = path === runBase;

  const activeDriver = GROWTH_DRIVERS.find(
    (d) =>
      driverPath === d.to ||
      driverPath.startsWith(`${d.to}/`) ||
      path === d.to ||
      path.startsWith(`${d.to}/`),
  )?.key;
  const isRevenueRoute = path === "/dashboard" || path.startsWith("/dashboard/");
  const [driversOpen, setDriversOpen] = useState(false);
  const [auditRunsOpen, setAuditRunsOpen] = useState(false);

  useEffect(() => {
    if (isAuditRunDetailRoute) {
      setDriversOpen(false);
      setAuditRunsOpen(true);
    } else if (activeDriver) {
      setDriversOpen(true);
    }
  }, [activeDriver, isAuditRunDetailRoute]);

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

      <div className="px-3 pt-3">
        <div className="flex items-center gap-2 rounded-md border border-border bg-surface/50 px-2 py-1.5">
          <Globe className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
          <div className="min-w-0 flex-1">
            <p className="text-[9px] font-mono uppercase tracking-wider text-muted-foreground">Project</p>
            <p className="truncate text-xs font-medium">{projectId}</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <p className="px-2 py-1 text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
          Workspace
        </p>

        <div>
          <div
            className={`w-full flex items-center gap-2.5 px-2 py-2 rounded-md text-sm transition-colors ${
              isRevenueRoute && !activeDriver
                ? "bg-surface text-foreground border border-border"
                : "text-foreground hover:bg-surface/60"
            }`}
          >
            <Link to="/dashboard" className="flex items-center gap-2.5 flex-1 min-w-0 font-medium">
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
                return (
                  <div key={d.key}>
                    <Link to={d.to} className={className}>
                      <Icon className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate flex-1">{d.label}</span>
                      {d.soon && (
                        <span className="rounded-sm border border-border bg-surface px-1 py-0 text-[8px] font-mono uppercase tracking-wider text-muted-foreground">
                          Soon
                        </span>
                      )}
                    </Link>
                    {isActive &&
                      d.children?.map((c) => {
                        const CIcon = c.icon;
                        const childActive = driverPath === c.to || path === c.to || path.startsWith(`${c.to}/`);
                        return (
                          <Link
                            key={c.to}
                            to={c.to}
                            className={`ml-5 mt-0.5 flex items-center gap-2 rounded-md px-2 py-1 text-[11px] transition-colors ${
                              childActive
                                ? "bg-primary/10 text-primary border border-primary/20"
                                : "text-muted-foreground hover:text-foreground hover:bg-surface/60"
                            }`}
                          >
                            <CIcon className="w-3 h-3 shrink-0" />
                            <span className="truncate flex-1">{c.label}</span>
                            {c.badge && (
                              <span className="rounded-sm border border-primary/30 bg-primary/10 px-1 py-0 text-[8px] font-mono uppercase tracking-wider text-primary">
                                {c.badge}
                              </span>
                            )}
                          </Link>
                        );
                      })}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div
          className={`w-full flex items-center gap-2.5 px-2 py-2 rounded-md text-sm transition-colors ${
            isAuditRunsRoute
              ? "bg-surface text-foreground border border-border"
              : "text-muted-foreground hover:text-foreground hover:bg-surface/60"
          }`}
        >
          <Link to="/audit-runs" className="flex min-w-0 flex-1 items-center gap-2.5 font-medium">
            <Bot className="w-4 h-4 shrink-0" />
            <span className="truncate">Audit Runs</span>
          </Link>
          <button
            type="button"
            onClick={() => setAuditRunsOpen((v) => !v)}
            aria-label={auditRunsOpen ? "Collapse audit runs" : "Expand audit runs"}
            aria-expanded={auditRunsOpen}
            className="p-0.5 rounded text-muted-foreground hover:text-foreground hover:bg-surface focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <ChevronDown
              className={`w-3.5 h-3.5 transition-transform ${auditRunsOpen ? "" : "-rotate-90"}`}
            />
          </button>
        </div>
        {auditRunsOpen && isAuditRunDetailRoute && (
          <div className="ml-3 border-l border-border pl-3 pt-1">
            <RunLink to="/audit-runs/$runId" runId={auditRunId} active={isAuditOverviewRoute} icon={Gauge} label="Overview" />
            <RunLink to="/audit-runs/$runId/errors" runId={auditRunId} active={isAuditErrorsRoute} icon={AlertTriangle} label="Errors" />
            <RunLink to="/audit-runs/$runId/urls" runId={auditRunId} active={isAuditUrlsRoute} icon={Boxes} label="URLs" />
            <RunLink to="/audit-runs/$runId/settings" runId={auditRunId} active={isAuditSetupRoute} icon={Settings} label="Setup" />
          </div>
        )}
        <NavItem
          to="/planner"
          icon={<Calculator className="w-4 h-4" />}
          label="Planner"
          active={path.startsWith("/planner")}
        />
        <NavItem
          to="/keyword-demand"
          icon={<Search className="w-4 h-4" />}
          label="Keyword Demand"
          active={path === "/keyword-demand"}
        />
        <NavItem
          to="/alerts"
          icon={<Bell className="w-4 h-4" />}
          label="Alerts"
          active={path === "/alerts"}
        />
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
              <p className="text-[10px] text-muted-foreground font-mono truncate">
                {active.domain}
              </p>
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
                    <p className="text-[10px] text-muted-foreground font-mono truncate">
                      {p.domain}
                    </p>
                  </div>
                  {p.initials === active.initials && (
                    <Check className="w-3.5 h-3.5 text-primary shrink-0" />
                  )}
                </DropdownMenuItem>
              ))}
              <DropdownMenuItem className="gap-2 text-muted-foreground">
                <UserPlus className="w-4 h-4" />
                <span className="text-xs">Add account</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild className="gap-2">
              <Link to="/account-settings">
                <UserCog className="w-4 h-4" />
                <span className="text-xs">Account settings</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={handleLogout}
              className="gap-2 text-destructive focus:text-destructive"
            >
              <LogOut className="w-4 h-4" />
              <span className="text-xs">Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Link
        to="/"
        className="px-5 py-3 text-[10px] font-mono uppercase tracking-wider text-muted-foreground hover:text-primary transition-colors border-t border-border"
      >
        ← Back to site
      </Link>
    </aside>
  );
}

function RunLink({
  to,
  runId,
  active,
  icon: Icon,
  label,
}: {
  to: string;
  runId: string;
  active: boolean;
  icon: typeof Gauge;
  label: string;
}) {
  return (
    <Link
      to={to}
      params={{ runId }}
      className={`mt-0.5 flex items-center gap-2 rounded-md px-2 py-1 text-[11px] transition-colors ${
        active
          ? "border border-primary/20 bg-primary/10 text-primary"
          : "text-muted-foreground hover:bg-surface/60 hover:text-foreground"
      }`}
    >
      <Icon className="h-3 w-3 shrink-0" />
      <span className="truncate">{label}</span>
    </Link>
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
  to: string;
}) {
  const className = `w-full flex items-center gap-2.5 px-2 py-2 rounded-md text-sm transition-colors ${
    active
      ? "bg-surface text-foreground border border-border"
      : "text-muted-foreground hover:text-foreground hover:bg-surface/60"
  }`;

  return (
    <Link to={to} className={className}>
      {icon}
      <span className="truncate">{label}</span>
    </Link>
  );
}
