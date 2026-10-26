import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ChevronDown, Plus } from "lucide-react";
import { uxHead, type Change } from "@/components/ux/data";
import { useUx } from "@/components/ux/state";
import { CRUMB_DASH, CRUMB_UX, Page, Pill, TopBar } from "@/components/ux/ui";

export const Route = createFileRoute("/project/$projectId/dashboard/user-experience/changes")({
  component: Changes,
  head: () => uxHead("Changes", "Log site changes and compare changed pages with unchanged similar pages."),
});

function Bars({ r }: { r: NonNullable<Change["result"]> }) {
  const max = 7;
  const bar = (v: number, cls: string) => <div className={`h-2 rounded-sm ${cls}`} style={{ width: `${(v / max) * 100}%` }} />;
  return (
    <div className="grid gap-2 font-mono text-[10.5px] sm:grid-cols-2">
      {[
        { label: "Changed pages", b: r.changedBefore, a: r.changedAfter, cls: "bg-primary" },
        { label: "Unchanged peers", b: r.peerBefore, a: r.peerAfter, cls: "bg-chart-3" },
      ].map((g) => (
        <div key={g.label} className="space-y-1">
          <p className="text-muted-foreground">{g.label}</p>
          <div className="flex items-center gap-2"><span className="w-10">Before</span><div className="flex-1">{bar(g.b, "bg-muted-foreground/40")}</div><span>{g.b}%</span></div>
          <div className="flex items-center gap-2"><span className="w-10">After</span><div className="flex-1">{bar(g.a, g.cls)}</div><span>{g.a}%</span></div>
        </div>
      ))}
    </div>
  );
}

function Changes() {
  const { changes, openLog } = useUx();
  const [open, setOpen] = useState<string | null>("c1");
  return (
    <>
      <TopBar
        crumbs={[CRUMB_DASH, CRUMB_UX]}
        title="Changes"
        meta={`${changes.length} changes logged · ${changes.filter((c) => c.result).length} result ready`}
        controls={
          <button type="button" onClick={() => openLog()} className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground">
            <Plus className="h-3.5 w-3.5" /> Log a change
          </button>
        }
      />
      <Page>
        <p className="rounded-md border border-border bg-surface px-4 py-2.5 text-sm text-muted-foreground">Logged changes appear as pins on the score trajectory.</p>
        <div className="space-y-3">
          {changes.map((c) => {
            const isOpen = open === c.id;
            return (
              <article key={c.id} className="rounded-[4px] border border-border bg-card">
                <button type="button" onClick={() => setOpen(isOpen ? null : c.id)} className="flex w-full items-start justify-between gap-3 p-4 text-left" aria-expanded={isOpen}>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <Pill>{c.type}</Pill>
                      <span className="font-mono text-[11px] text-muted-foreground">Shipped {c.shipped}</span>
                      {c.result ? (
                        c.randomised ? (
                          <Pill className="border-chart-1/40 bg-chart-1/10 text-chart-1">Randomised — attributed to the change</Pill>
                        ) : (
                          <Pill className="border-chart-4/40 bg-chart-4/10 text-chart-4">Observational — other changes in the same period could explain it</Pill>
                        )
                      ) : (
                        <Pill dashed>Waiting for 4 complete weeks</Pill>
                      )}
                    </div>
                    <p className="mt-2 text-sm font-medium">{c.title}</p>
                    <p className="mt-1 font-mono text-[11px] text-muted-foreground">{c.pages.join(" · ")}</p>
                  </div>
                  <ChevronDown className={`mt-1 h-4 w-4 shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                </button>
                {isOpen && (
                  <div className="border-t border-border p-4">
                    {c.result ? (
                      <>
                        <p className="mb-3 font-mono text-xs">
                          Changed pages {c.result.changedBefore}% → {c.result.changedAfter}% · Unchanged peers {c.result.peerBefore}% → {c.result.peerAfter}% · Difference {c.result.diff} (90% range {c.result.range})
                        </p>
                        <Bars r={c.result} />
                      </>
                    ) : (
                      <p className="text-sm text-muted-foreground">Result appears once 4 complete weeks after the shipped date are in.</p>
                    )}
                  </div>
                )}
              </article>
            );
          })}
        </div>
      </Page>
    </>
  );
}
