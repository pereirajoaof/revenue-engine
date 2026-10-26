import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { BROKEN_BY_TEMPLATE, DEPTH, FLOW, INTERNAL, META_LINE, NON_INDEXABLE, PAGE_TYPE_TABLE } from "@/components/wa/data";
import { label, PageHeader, Panel, Pill, waHead } from "@/components/wa/ui";
import { Switch } from "@/components/ui/switch";

export const Route = createFileRoute("/project/$projectId/dashboard/website-authority/distribution")({
  component: DistributionPage,
  head: () => waHead("Internal distribution", "How internal link support flows from the homepage to the pages that matter."),
});

const FLOW_STYLE: Record<string, string> = {
  Indexable: "bg-primary",
  "Non-indexable": "bg-chart-4",
  Broken: "bg-destructive",
  Unknown: "bg-muted-foreground",
};

function Kpi({ k, v, sub, tone }: { k: string; v: string; sub?: string; tone?: "red" | "amber" | "grey" }) {
  const c = tone === "red" ? "text-destructive" : tone === "amber" ? "text-chart-4" : tone === "grey" ? "text-muted-foreground" : "";
  return (
    <div className="rounded-[4px] border border-border bg-card p-4">
      <p className={label}>{k}</p>
      <p className={`mt-1.5 text-2xl font-bold ${c}`}>{v}</p>
      {sub && <p className="text-[11px] text-muted-foreground">{sub}</p>}
    </div>
  );
}

function DistributionPage() {
  const [marked, setMarked] = useState<string[]>([]);
  const open = NON_INDEXABLE.filter((n) => !marked.includes(n.pattern));
  const done = NON_INDEXABLE.filter((n) => marked.includes(n.pattern));
  const toggle = (p: string) => setMarked((m) => (m.includes(p) ? m.filter((x) => x !== p) : [...m, p]));

  return (
    <>
      <PageHeader crumb="Website Authority" title="Internal distribution" meta={META_LINE} />
      <main className="space-y-5 px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
          <Kpi k="Internal distribution" v={`${INTERNAL}`} sub="out of 100" />
          <Kpi k="Priority pages supported" v="70%" sub="560 of 800" />
          <Kpi k="Reachable from homepage" v="98%" sub="782 of 800" />
          <Kpi k="Broken flow" v="4%" sub="Lowers the score" tone="red" />
          <Kpi k="Non-indexable" v="9%" sub="Review" tone="amber" />
          <Kpi k="Unknown" v="0%" tone="grey" />
        </div>

        <Panel title="Where internal link flow goes" sub="Only broken destinations lower the score.">
          <div className="flex h-6 w-full overflow-hidden rounded-md" role="img" aria-label="Indexable 87%, non-indexable 9%, broken 4%, unknown 0%">
            {FLOW.filter((f) => f.share > 0).map((f) => (
              <div key={f.cls} className={FLOW_STYLE[f.cls]} style={{ width: `${f.share}%` }} />
            ))}
          </div>
          <ul className="mt-3 flex flex-wrap gap-4 text-xs">
            {FLOW.map((f) => (
              <li key={f.cls} className="flex items-center gap-1.5">
                <span className={`h-2.5 w-2.5 rounded-sm ${FLOW_STYLE[f.cls]}`} />
                {f.cls} <span className="font-mono font-semibold">{f.share}%</span>
              </li>
            ))}
          </ul>
        </Panel>

        <Panel title="By page type" sub="Priority = Product, Category and Help (800 pages). Blog is not priority.">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-sm">
              <thead>
                <tr className={`${label} text-left`}>
                  <th className="pb-2 font-normal">Page type</th>
                  <th className="pb-2 text-right font-normal">Pages</th>
                  <th className="pb-2 text-right font-normal">% reachable</th>
                  <th className="pb-2 text-right font-normal">% supported</th>
                  <th className="pb-2 text-right font-normal">Median support index</th>
                  <th className="pb-2 text-right font-normal">Support share ÷ page share</th>
                </tr>
              </thead>
              <tbody>
                {PAGE_TYPE_TABLE.map((r) => (
                  <tr key={r.type} className="border-t border-border">
                    <td className="py-2.5">
                      <span className="flex items-center gap-2">
                        {r.type}
                        {r.priority ? <Pill tone="green">Priority</Pill> : <Pill>Not priority</Pill>}
                      </span>
                    </td>
                    <td className="py-2.5 text-right font-mono">{r.pages}</td>
                    <td className={`py-2.5 text-right font-mono ${r.reachable < 100 ? "text-chart-4" : ""}`}>{r.reachable}%</td>
                    <td className="py-2.5 text-right font-mono">{r.supported}%</td>
                    <td className="py-2.5 text-right font-mono">{r.median}</td>
                    <td className={`py-2.5 text-right font-mono ${r.ratio < 1 ? "text-chart-4" : ""}`}>{r.ratio}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>

        <div className="grid gap-4 lg:grid-cols-2">
          <Panel title="Distance from homepage" sub="Priority pages by clicks from the homepage (782 reachable)">
            <figure className="h-52">
              <figcaption className="sr-only">1 click: 42 pages, 2: 268, 3: 341, 4: 104, 5 or more: 27.</figcaption>
              <ResponsiveContainer>
                <BarChart data={DEPTH} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
                  <CartesianGrid stroke="var(--border)" vertical={false} />
                  <XAxis dataKey="clicks" tick={{ fontSize: 10, fill: "var(--muted-foreground)" }} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: "var(--muted-foreground)" }} tickLine={false} axisLine={false} />
                  <Tooltip cursor={{ fill: "var(--muted)" }} contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", fontSize: 12 }} />
                  <Bar dataKey="pages" name="Priority pages" fill="var(--chart-2)" radius={[4, 4, 0, 0]} isAnimationActive={false} />
                </BarChart>
              </ResponsiveContainer>
            </figure>
          </Panel>

          <Panel title="Non-indexable destinations" sub="Grouped by pattern. Many are normal for a shop.">
            <ul className="divide-y divide-border">
              {open.map((n) => (
                <li key={n.pattern} className="flex items-center justify-between gap-3 py-2.5">
                  <div>
                    <p className="font-mono text-sm">{n.pattern}</p>
                    <p className="text-xs text-muted-foreground">{n.links.toLocaleString("en-GB")} links · {n.share}% of flow</p>
                  </div>
                  <label className="flex items-center gap-2 text-xs">
                    Mark as intentional
                    <Switch checked={false} onCheckedChange={() => toggle(n.pattern)} />
                  </label>
                </li>
              ))}
            </ul>
            {done.length > 0 && (
              <details className="mt-2 rounded-md bg-muted px-3 py-2 text-xs text-muted-foreground">
                <summary className="cursor-pointer">{done.length} pattern{done.length > 1 ? "s" : ""} marked intentional</summary>
                <ul className="mt-2 space-y-1.5">
                  {done.map((n) => (
                    <li key={n.pattern} className="flex items-center justify-between">
                      <span className="font-mono">{n.pattern}</span>
                      <button type="button" onClick={() => toggle(n.pattern)} className="text-primary hover:underline">Undo</button>
                    </li>
                  ))}
                </ul>
              </details>
            )}
          </Panel>
        </div>

        <Panel title="Broken destinations" sub="Grouped by the template that links to them">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[480px] text-sm">
              <thead>
                <tr className={`${label} text-left`}>
                  <th className="pb-2 font-normal">Source template</th>
                  <th className="pb-2 text-right font-normal">Broken destinations</th>
                  <th className="pb-2 text-right font-normal">Links</th>
                  <th className="pb-2 text-right font-normal">Share of flow</th>
                </tr>
              </thead>
              <tbody>
                {BROKEN_BY_TEMPLATE.map((b) => (
                  <tr key={b.template} className="border-t border-border">
                    <td className="py-2.5">{b.template}</td>
                    <td className="py-2.5 text-right font-mono">{b.destinations}</td>
                    <td className="py-2.5 text-right font-mono">{b.links.toLocaleString("en-GB")}</td>
                    <td className="py-2.5 text-right font-mono text-destructive">{b.share}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>
      </main>
    </>
  );
}
