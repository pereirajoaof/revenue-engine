import { useState } from "react";
import { AlertTriangle, Loader2, X } from "lucide-react";
import { AppLink as Link } from "@/lib/app-link";
import { Button } from "@/components/ui/button";
import { Card, useUx } from "./UxKit";

export function StaleBanner() {
  const { state } = useUx();
  if (state !== "stale") return null;
  return (
    <div className="flex items-center gap-2 rounded-md border border-chart-4/40 bg-chart-4/10 px-4 py-2.5 text-sm">
      <AlertTriangle className="h-4 w-4 text-chart-4" />
      Google Analytics data up to 5 Oct — <Link to="/settings" className="font-medium underline">reconnect to refresh</Link>
    </div>
  );
}

export function UnmappedBanner() {
  const [open, setOpen] = useState(true);
  if (!open) return null;
  return (
    <div className="flex items-center gap-2 rounded-md border border-chart-4/40 bg-chart-4/10 px-4 py-2.5 text-sm">
      <AlertTriangle className="h-4 w-4 shrink-0 text-chart-4" />
      <span className="flex-1">
        <b>Page types not set up</b> — 34% of sessions are on pages without a page type and can't be compared.{" "}
        <Link to="/settings" className="font-medium underline">Set up page types →</Link>
      </span>
      <button aria-label="Dismiss" onClick={() => setOpen(false)} className="text-muted-foreground hover:text-foreground"><X className="h-4 w-4" /></button>
    </div>
  );
}

export function StateNotices() {
  const { state } = useUx();
  if (state === "gsc")
    return (
      <Card className="flex flex-wrap items-center justify-between gap-3 p-4">
        <p className="text-sm">Connect Google Analytics to compare engagement and outcomes on your landing pages</p>
        <Button size="sm">Connect</Button>
      </Card>
    );
  if (state === "no-outcome")
    return (
      <Card className="flex flex-wrap items-center justify-between gap-3 p-4">
        <p className="text-sm">Choose what counts as a completed visit to compare outcomes. Engagement comparison is shown meanwhile.</p>
        <Button size="sm" asChild><Link to="/settings">Go to Settings</Link></Button>
      </Card>
    );
  if (state === "small")
    return (
      <Card className="p-4 text-sm">
        This site doesn't yet have enough organic sessions per page to compare pages. Page-type trends are shown below.
      </Card>
    );
  if (state === "currency")
    return (
      <Card className="p-4 text-sm text-muted-foreground">
        GA4 reports in EUR; this account uses GBP. Update the account currency to show revenue.
      </Card>
    );
  if (state === "leadgen")
    return (
      <Card className="p-4 text-sm text-muted-foreground">
        Outcome for this account: <b className="text-foreground">Form submissions</b>. No revenue is reported for lead-gen accounts. Effort: Not estimated.
      </Card>
    );
  return null;
}

export function BuildingState() {
  return (
    <Card className="mx-auto max-w-lg p-8 text-center">
      <Loader2 className="mx-auto h-6 w-6 animate-spin text-primary" />
      <p className="mt-3 text-sm font-semibold">Building your first comparison</p>
      <p className="mt-1 text-sm text-muted-foreground">Usually ready within a few hours.</p>
      <div className="mx-auto mt-4 h-1.5 w-48 overflow-hidden rounded-full bg-surface"><div className="h-full w-2/5 bg-primary" /></div>
    </Card>
  );
}
