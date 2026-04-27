import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Bell,
  Building2,
  CheckCircle2,
  ChevronDown,
  CreditCard,
  KeyRound,
  Link2,
  LockKeyhole,
  Menu,
  MoreHorizontal,
  MonitorCheck,
  Plug,
  Plus,
  Save,
  Search,
  ShieldCheck,
  ShieldPlus,
  Smartphone,
  User,
  Users,
} from "lucide-react";
import { DashboardNav } from "@/components/dashboard/DashboardNav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/account-settings")({
  component: AccountSettingsRoute,
  head: () => ({
    meta: [
      { title: "Account settings — OrganicOS" },
      { name: "description", content: "Manage user profile, workspace access, integrations, API keys, and billing settings." },
      { property: "og:title", content: "Account settings — OrganicOS" },
      { property: "og:description", content: "Manage user-level and workspace-level account settings in OrganicOS." },
    ],
  }),
});

type SectionKey = "account" | "security" | "notifications" | "workspace" | "members" | "integrations" | "api" | "billing" | "apps";
type SettingsItem = { key: SectionKey; label: string; icon: typeof User };

const ME_ITEMS: SettingsItem[] = [
  { key: "account", label: "My account", icon: User },
  { key: "security", label: "Password & security", icon: LockKeyhole },
  { key: "notifications", label: "Notifications", icon: Bell },
];

const WORKSPACE_ITEMS: SettingsItem[] = [
  { key: "workspace", label: "Workspace settings", icon: Building2 },
  { key: "members", label: "Members", icon: Users },
  { key: "integrations", label: "Integrations", icon: Link2 },
  { key: "api", label: "API keys", icon: KeyRound },
  { key: "billing", label: "Billing", icon: CreditCard },
  { key: "apps", label: "Connected apps", icon: Plug },
];

function AccountSettingsRoute() {
  const [activeSection, setActiveSection] = useState<SectionKey>("account");
  const activeLabel = [...ME_ITEMS, ...WORKSPACE_ITEMS].find((item) => item.key === activeSection)?.label ?? "My account";

  return (
    <div className="min-h-screen bg-background text-foreground">
      <DashboardNav />
      <div className="lg:pl-56">
        <header className="sticky top-0 z-20 border-b border-border bg-background/90 backdrop-blur">
          <div className="flex items-center justify-between gap-4 px-6 py-5 lg:px-8">
            <div className="min-w-0">
              <p className="mb-1 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Account settings</p>
              <h1 className="truncate text-xl font-bold tracking-tight">{activeLabel}</h1>
            </div>
            <Button size="sm">
              <Save className="h-4 w-4" />
              Save changes
            </Button>
          </div>
        </header>

        <main className="grid min-h-[calc(100vh-73px)] grid-cols-1 lg:grid-cols-[260px_1fr]">
          <aside className="border-b border-border bg-surface/40 px-4 py-5 lg:border-b-0 lg:border-r lg:px-5">
            <div className="mb-6 rounded-lg border border-border bg-card p-4">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-border bg-surface font-mono text-sm font-semibold">JS</div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold">Jane Smith</p>
                  <p className="truncate text-xs text-muted-foreground">jane@acme.com</p>
                  <span className="mt-2 inline-flex rounded-sm bg-primary/10 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wide text-primary">Admin</span>
                </div>
              </div>
            </div>

            <SettingsGroup title="Me" items={ME_ITEMS} active={activeSection} onSelect={setActiveSection} />
            <SettingsGroup title="Workspace" items={WORKSPACE_ITEMS} active={activeSection} onSelect={setActiveSection} />
          </aside>

          {activeSection === "security" ? (
            <SecuritySettings />
          ) : activeSection === "notifications" ? (
            <NotificationsSettings />
          ) : activeSection === "members" ? (
            <MembersSettings />
          ) : (
            <AccountProfile />
          )}
        </main>
      </div>
    </div>
  );
}

function AccountProfile() {
  return (
    <section className="px-6 py-8 lg:px-8">
      <div className="mb-7 flex items-center gap-3">
        <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open account settings menu">
          <Menu className="h-4 w-4" />
        </Button>
        <div>
          <h2 className="text-2xl font-bold tracking-tight">My account</h2>
          <p className="mt-1 text-sm text-muted-foreground">User profile details for your OrganicOS account.</p>
        </div>
      </div>

      <div className="max-w-3xl rounded-lg border border-border bg-card">
        <div className="border-b border-border px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary/10 text-primary">
              <ShieldCheck className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-base font-semibold">Profile information</h3>
              <p className="text-xs text-muted-foreground">Visible to people in this workspace.</p>
            </div>
          </div>
        </div>

        <div className="space-y-5 px-6 py-6">
          <Field label="Email">
            <Input value="jane@acme.com" readOnly autoComplete="email" data-lpignore="true" />
          </Field>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="First name">
              <Input defaultValue="Jane" autoComplete="given-name" data-lpignore="true" />
            </Field>
            <Field label="Last name">
              <Input defaultValue="Smith" autoComplete="family-name" data-lpignore="true" />
            </Field>
          </div>
          <Field label="Job function">
            <button className="flex h-9 w-full items-center justify-between rounded-md border border-input bg-background px-3 text-left text-sm shadow-sm transition-colors hover:bg-surface focus:outline-none focus:ring-1 focus:ring-ring">
              Marketing leadership
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </button>
          </Field>
        </div>

        <div className="flex flex-col-reverse gap-3 border-t border-border px-6 py-5 sm:flex-row sm:justify-end">
          <Button variant="secondary">Reset password</Button>
          <Button>
            <Save className="h-4 w-4" />
            Save settings
          </Button>
        </div>
      </div>
    </section>
  );
}

function SecuritySettings() {
  return (
    <section className="px-6 py-8 lg:px-8">
      <div className="mb-7 flex items-center gap-3">
        <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open account settings menu">
          <Menu className="h-4 w-4" />
        </Button>
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Password & security</h2>
          <p className="mt-1 text-sm text-muted-foreground">Control sign-in protection and review access to your account.</p>
        </div>
      </div>

      <div className="max-w-4xl space-y-5">
        <div className="rounded-lg border border-border bg-card">
          <div className="border-b border-border px-6 py-5">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary/10 text-primary">
                <LockKeyhole className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-base font-semibold">Change password</h3>
                <p className="text-xs text-muted-foreground">Use a unique password with at least 12 characters.</p>
              </div>
            </div>
          </div>
          <div className="grid gap-5 px-6 py-6 md:grid-cols-2">
            <Field label="Current password">
              <Input type="password" placeholder="••••••••••••" autoComplete="current-password" />
            </Field>
            <div className="hidden md:block" />
            <Field label="New password">
              <Input type="password" placeholder="••••••••••••" autoComplete="new-password" />
            </Field>
            <Field label="Confirm new password">
              <Input type="password" placeholder="••••••••••••" autoComplete="new-password" />
            </Field>
          </div>
          <div className="flex justify-end border-t border-border px-6 py-5">
            <Button>Update password</Button>
          </div>
        </div>

        <div className="grid gap-5 xl:grid-cols-[1fr_320px]">
          <div className="rounded-lg border border-border bg-card">
            <div className="border-b border-border px-6 py-5">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary/10 text-primary">
                  <ShieldPlus className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-base font-semibold">Two-factor authentication</h3>
                  <p className="text-xs text-muted-foreground">Add a second verification step when signing in.</p>
                </div>
              </div>
            </div>
            <div className="px-6 py-6">
              <div className="flex flex-col gap-4 rounded-md border border-border bg-surface/50 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-md border border-border bg-card text-muted-foreground">
                    <Smartphone className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">Authenticator app</p>
                    <p className="mt-1 text-xs text-muted-foreground">Not enabled</p>
                  </div>
                </div>
                <Button variant="secondary">Enable 2FA</Button>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-border bg-card p-5">
            <div className="flex items-center gap-2 text-primary">
              <CheckCircle2 className="h-4 w-4" />
              <p className="text-sm font-semibold">Security status</p>
            </div>
            <div className="mt-5 space-y-4">
              <StatusRow label="Email verified" status="Complete" />
              <StatusRow label="Strong password" status="Active" />
              <StatusRow label="Two-factor" status="Optional" muted />
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-border bg-card">
          <div className="border-b border-border px-6 py-5">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary/10 text-primary">
                <MonitorCheck className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-base font-semibold">Active sessions</h3>
                <p className="text-xs text-muted-foreground">Devices currently signed in to this account.</p>
              </div>
            </div>
          </div>
          <div className="divide-y divide-border">
            <SessionRow device="Chrome on macOS" location="Lisbon, Portugal" current />
            <SessionRow device="Safari on iPhone" location="Porto, Portugal" />
          </div>
        </div>
      </div>
    </section>
  );
}

function NotificationsSettings() {
  return (
    <section className="px-6 py-8 lg:px-8">
      <div className="mb-7 flex items-center gap-3">
        <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open account settings menu">
          <Menu className="h-4 w-4" />
        </Button>
        <div>
          <h2 className="text-2xl font-bold tracking-tight">My notifications</h2>
          <p className="mt-1 text-sm text-muted-foreground">Choose which email updates you want from OrganicOS.</p>
        </div>
      </div>

      <div className="max-w-4xl rounded-lg border border-border bg-card">
        <div className="border-b border-border px-6 py-5">
          <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
            Choose which email updates you want from us: product updates, weekly SEO content, and workspace activity alerts.
          </p>
        </div>
        <div className="divide-y divide-border px-6">
          <NotificationRow label="Product updates" description="Feature releases, improvements, and platform announcements." enabled />
          <NotificationRow label="Weekly newsletter" description="SEO strategy notes, benchmarks, and OrganicOS product news." />
          <NotificationRow label="Audit run alerts" description="Crawl completions, failed runs, and critical technical-health changes." enabled />
        </div>
      </div>
    </section>
  );
}

function SettingsGroup({ title, items, active, onSelect }: { title: string; items: SettingsItem[]; active: SectionKey; onSelect: (section: SectionKey) => void }) {
  return (
    <div className="mb-6">
      <p className="mb-2 px-2 text-xs font-bold text-foreground">{title}</p>
      <div className="space-y-1">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.key}
              onClick={() => onSelect(item.key)}
              className={`flex w-full items-center gap-2.5 rounded-md px-2 py-2 text-left text-sm transition-colors ${
                active === item.key ? "border border-primary/20 bg-primary/10 text-primary" : "text-muted-foreground hover:bg-surface hover:text-foreground"
              }`}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span className="truncate">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block space-y-2">
      <span className="text-sm font-medium text-foreground">{label}</span>
      {children}
    </label>
  );
}

function StatusRow({ label, status, muted = false }: { label: string; status: string; muted?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-3 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className={muted ? "text-xs font-medium text-muted-foreground" : "text-xs font-medium text-primary"}>{status}</span>
    </div>
  );
}

function SessionRow({ device, location, current = false }: { device: string; location: string; current?: boolean }) {
  return (
    <div className="flex flex-col gap-3 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-start gap-3">
        <div className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-md border border-border bg-surface text-muted-foreground">
          <MonitorCheck className="h-4 w-4" />
        </div>
        <div>
          <p className="text-sm font-semibold">{device}</p>
          <p className="mt-1 text-xs text-muted-foreground">{location} · Last active today</p>
        </div>
      </div>
      {current ? <span className="text-xs font-medium text-primary">Current session</span> : <Button variant="ghost" size="sm">Sign out</Button>}
    </div>
  );
}

function NotificationRow({ label, description, enabled = false }: { label: string; description: string; enabled?: boolean }) {
  return (
    <div className="flex flex-col gap-3 py-5 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <p className="text-sm font-semibold">{label}</p>
        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{description}</p>
      </div>
      <button
        type="button"
        aria-pressed={enabled}
        className={`relative h-7 w-12 shrink-0 rounded-full border transition-colors ${
          enabled ? "border-primary bg-primary" : "border-border bg-muted"
        }`}
      >
        <span
          className={`absolute top-1 h-5 w-5 rounded-full bg-card shadow-sm transition-transform ${enabled ? "left-6" : "left-1"}`}
        />
      </button>
    </div>
  );
}
