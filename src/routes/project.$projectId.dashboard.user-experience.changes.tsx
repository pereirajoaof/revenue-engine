import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ChevronDown, Plus } from "lucide-react";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip as RTooltip } from "recharts";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CHANGES, LANDING_ROWS, type LoggedChange } from "@/lib/ux-data";
import { Card, IllustrativeNote, Label, UxTopBar } from "@/components/ux/UxKit";

export const Route = createFileRoute("/project/$projectId/dashboard/user-experience/changes")({
  component: Changes,
  head: () => ({
    meta: [
      { title: "Changes — User Experience — OrganicOS" },
      { name: "description", content: "Log page changes and compare changed pages with unchanged peers before and after." },
      { property: "og:title", content: "Changes — OrganicOS" },
      { property: "og:description", content: "Before/after comparisons of logged landing-page changes." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
});

const TYPES = ["Content", "Layout", "Speed", "Offer/pricing", "Tracking", "Other"];

function LogDialog({ open, onOpenChange, onSave }: { open: boolean; onOpenChange: (o: boolean) => void; onSave: (c: LoggedChange) => void }) {
  const [pages, setPages] = useState<string[]>([]);
  const [type, setType] = useState("Content");
  const [desc, setDesc] = useState("");
  const [date, setDate] = useState("2026-10-14");
  const [rand, setRand] = useState(false);
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader><DialogTitle>Log a change</DialogTitle></DialogHeader>
        <div className="space-y-4 text-sm">
          <div>
            <Label>Pages</Label>
            <div className="mt-1 flex max-h-32 flex-wrap gap-1.5 overflow-y-auto">
              {LANDING_ROWS.filter((r) => !r.host).map((r) => {
                const on = pages.includes(r.path);
                return (
                  <button key={r.id} type="button" onClick={() => setPages(on ? pages.filter((p) => p !== r.path) : [...pages, r.path])}
                    className={`rounded border px-2 py-0.5 font-mono text-[11px] ${on ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground"}`}>
                    {r.path}
                  </button>
                );
              })}
            </div>
          </div>
          <div>
            <Label>Change type</Label>
            <div className="mt-1 flex flex-wrap gap-1.5">
              {TYPES.map((t) => (
                <button key={t} type="button" onClick={() => setType(t)} className={`rounded border px-2 py-0.5 text-xs ${type === t ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground"}`}>{t}</button>
              ))}
            </div>
            {type === "Tracking" && <p className="mt-1 text-xs text-chart-4">Tag or consent changes move these numbers without any UX change.</p>}
          </div>
          <div><Label>Description</Label><Textarea className="mt-1" value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="What changed?" /></div>
          <div><Label>Shipped date</Label><Input type="date" className="mt-1" value={date} onChange={(e) => setDate(e.target.value)} /></div>
          <label className="flex items-center gap-2 text-xs"><Checkbox checked={rand} onCheckedChange={(v) => setRand(!!v)} /> Pages were randomly assigned to change vs control</label>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button disabled={!pages.length || !desc} onClick={() => {
            onSave({ id: `c${Date.now()}`, title: desc, type, pages, shipped: new Date(date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }), randomised: rand, result: null });
            onOpenChange(false); setPages([]); setDesc("");
          }}>Save change</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function ChangeItem({ c }: { c: LoggedChange }) {
  const [open, setOpen] = useState(c.id === "c1");
  const r = c.result;
  return (
    <Card>
      <button onClick={() => setOpen(!open)} className="flex w-full items-start justify-between gap-3 p-4 text-left">
        <div>
          <p className="text-sm font-medium">{c.title}</p>
          <p className="mt-0.5 font-mono text-[11px] text-muted-foreground">{c.type} · shipped {c.shipped} · {c.pages.join(", ")}</p>
        </div>
        <div className="flex items-center gap-2">
          {r ? (
            <span className={`rounded-full border px-2 py-0.5 font-mono text-[10px] ${c.randomised ? "border-primary/40 text-primary" : "border-dashed border-border text-muted-foreground"}`}>
              {c.randomised ? "Randomised — attributed to the change" : "Observational — other changes in the same period could explain it"}
            </span>
          ) : (
            <span className="rounded-full border border-dashed border-border px-2 py-0.5 font-mono text-[10px] text-muted-foreground">Waiting for 4 complete weeks of data</span>
          )}
          <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${open ? "" : "-rotate-90"}`} />
        </div>
      </button>
      {open && (
        <div className="border-t border-border p-4">
          {r ? (
            <div className="grid gap-4 md:grid-cols-2">
              <p className="font-mono text-[12px] leading-6">
                Changed pages {r.changedBefore}% → {r.changedAfter}%<br />
                Unchanged peers {r.peerBefore}% → {r.peerAfter}%<br />
                Difference {r.diff > 0 ? "+" : ""}{r.diff} pts <span className="text-muted-foreground">(90% range {r.lo} to +{r.hi})</span>
              </p>
              <div className="h-36">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={[{ g: "Changed", before: r.changedBefore, after: r.changedAfter }, { g: "Peers", before: r.peerBefore, after: r.peerAfter }]}>
                    <XAxis dataKey="g" tick={{ fontSize: 10, fill: "var(--muted-foreground)" }} />
                    <YAxis unit="%" tick={{ fontSize: 10, fill: "var(--muted-foreground)" }} width={36} />
                    <RTooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", fontSize: 11 }} />
                    <Bar dataKey="before" name="Before" fill="var(--chart-3)" />
                    <Bar dataKey="after" name="After" fill="var(--chart-1)" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">We compare 4 complete weeks after shipping with the 4 weeks before. Check back after the window closes.</p>
          )}
        </div>
      )}
    </Card>
  );
}

function Changes() {
  const [items, setItems] = useState(CHANGES);
  const [open, setOpen] = useState(false);
  return (
    <>
      <UxTopBar
        crumbs={[{ label: "Dashboard", to: "/dashboard" }, { label: "User Experience", to: "/dashboard/user-experience" }]}
        title="Changes"
        meta="Purchase rate · GA4 · 4 complete weeks before vs after each shipped date"
        controls={<Button size="sm" onClick={() => setOpen(true)}><Plus className="h-4 w-4" /> Log a change</Button>}
      />
      <main className="space-y-3 px-6 py-6 lg:px-8">
        {items.map((c) => <ChangeItem key={c.id} c={c} />)}
        <IllustrativeNote />
      </main>
      <LogDialog open={open} onOpenChange={setOpen} onSave={(c) => setItems([c, ...items])} />
    </>
  );
}
