import { createFileRoute } from "@tanstack/react-router";
import { Bell, Building2, ChevronDown, CreditCard, KeyRound, Link2, LockKeyhole, Menu, Plug, Save, ShieldCheck, User, Users } from "lucide-react";
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

const ME_ITEMS = [
  { label: "My account", icon: User, active: true },
  { label: "Password & security", icon: LockKeyhole },
  { label: "Notifications", icon: Bell },
];

const WORKSPACE_ITEMS = [
  { label: "Workspace settings", icon: Building2 },
  { label: "Members", icon: Users },
  { label: "Integrations", icon: Link2 },
  { label: "API keys", icon: KeyRound },
  { label: "Billing", icon: CreditCard },
  { label: "Connected apps", icon: Plug },
];

function AccountSettingsRoute() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <DashboardNav />
      <div className="lg:pl-56">
        <header className="sticky top-0 z-20 border-b border-border bg-background/90 backdrop-blur">
          <div className="flex items-center justify-between gap-4 px-6 py-5 lg:px-8">
            <div className="min-w-0">
              <p className="mb-1 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Account settings</p>
              <h1 className="truncate text-xl font-bold tracking-tight">My account</h1>
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

            <SettingsGroup title="Me" items={ME_ITEMS} />
            <SettingsGroup title="Workspace" items={WORKSPACE_ITEMS} />
          </aside>

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
                  <Input value="jane@acme.com" readOnly />
                </Field>
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="First name">
                    <Input defaultValue="Jane" />
                  </Field>
                  <Field label="Last name">
                    <Input defaultValue="Smith" />
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
        </main>
      </div>
    </div>
  );
}

function SettingsGroup({ title, items }: { title: string; items: Array<{ label: string; icon: typeof User; active?: boolean }> }) {
  return (
    <div className="mb-6">
      <p className="mb-2 px-2 text-xs font-bold text-foreground">{title}</p>
      <div className="space-y-1">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.label}
              className={`flex w-full items-center gap-2.5 rounded-md px-2 py-2 text-left text-sm transition-colors ${
                item.active ? "border border-primary/20 bg-primary/10 text-primary" : "text-muted-foreground hover:bg-surface hover:text-foreground"
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