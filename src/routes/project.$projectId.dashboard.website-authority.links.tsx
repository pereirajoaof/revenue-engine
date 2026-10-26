import { createFileRoute } from "@tanstack/react-router";
import { AlertTriangle } from "lucide-react";
import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { EXTERNAL, EXTERNAL_PAGES, LANDING_BY_TYPE, META_LINE, REFERRING_DOMAINS, REFERRING_MONTHLY, RISK } from "@/components/wa/data";
import { CompetitorBar, label, PageHeader, Panel, Pill, StatusChip, waHead } from "@/components/wa/ui";

export const Route = createFileRoute("/project/$projectId/dashboard/website-authority/links")({
  component: LinksPage,
  head: () => waHead("External links", "Referring domains over time, where external links land, and link-quality diagnostics."),
});

const tick = { fontSize: 10, fill: "var(--muted-foreground)" };

function Kpi({ k, v, extra }: { k: string; v: React.ReactNode; extra?: React.ReactNode }) {
  return (
    <div className="rounded-[4px] border border-border bg-card p-4">
      <p className={label}>{k}</p>
      <div className="mt-1.5 text-2xl font-bold">{v}</div>
      {extra && <div className="mt-1">{extra}</div>}
    </div>
  );
}

function LinksPage() {
  return (
    <>
      <PageHeader crumb="Website Authority" title="External links" meta={META_LINE} />
      <main className="space-y-5 px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <Kpi k="Referring domains" v={REFERRING_DOMAINS} />
          <Kpi k="External links score" v={<>{EXTERNAL}<span className="text-sm text-muted-foreground">/100</span></>} />
          <Kpi k="Link-quality risk" v={<Pill tone="amber" icon={<AlertTriangle className="h-3 w-3" />}>Moderate</Pill>} extra={<span className="text-[11px] text-muted-foreground">Diagnostic</span>} />
          <Kpi k="Nofollow share" v="18%" extra={<span className="text-[11px] text-muted-foreground">Diagnostic</span>} />
        </div>

        <Panel title="Referring domains over time" sub="Last 12 months, monthly">
          <figure className="h-56">
            <figcaption className="sr-only">Referring domains rose from 198 in November to 420 in October.</figcaption>
            <ResponsiveContainer>
              <LineChart data={REFERRING_MONTHLY} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                <CartesianGrid stroke="var(--border)" vertical={false} />
                <XAxis dataKey="month" tick={tick} tickLine={false} axisLine={false} />
                <YAxis tick={tick} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", fontSize: 12 }} />
                <Line dataKey="domains" name="Referring domains" stroke="var(--primary)" strokeWidth={2} dot={{ r: 2.5 }} isAnimationActive={false} />
              </LineChart>
            </ResponsiveContainer>
          </figure>
        </Panel>

        <div className="grid gap-4 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
          <Panel title="Where external links land" sub="Measured in domain–page links">
            <figure className="h-56">
              <figcaption className="sr-only">Domain–page links by page type: Blog 1,320, Homepage 1,180, Category 520, Product 290, Other 120.</figcaption>
              <ResponsiveContainer>
                <BarChart data={LANDING_BY_TYPE} layout="vertical" margin={{ left: 8, right: 16 }}>
                  <XAxis type="number" tick={tick} tickLine={false} axisLine={false} />
                  <YAxis type="category" dataKey="type" tick={tick} tickLine={false} axisLine={false} width={72} />
                  <Tooltip cursor={{ fill: "var(--muted)" }} contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", fontSize: 12 }} />
                  <Bar dataKey="links" name="Domain–page links" fill="var(--chart-3)" radius={[0, 4, 4, 0]} isAnimationActive={false} />
                </BarChart>
              </ResponsiveContainer>
            </figure>
            <p className="mt-2 text-[11px] text-muted-foreground">
              Top 1,000 pages by linking sites. Pages beyond this were not collected. A site linking to three of your pages counts three times.
            </p>
          </Panel>

          <Panel title="Pages with external links" right={<Pill tone="red">12 pages returning errors have 38 domain–page links</Pill>}>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[520px] text-sm">
                <thead>
                  <tr className={`${label} text-left`}>
                    <th className="pb-2 font-normal">URL</th>
                    <th className="pb-2 font-normal">Page type</th>
                    <th className="pb-2 text-right font-normal">Domain–page links</th>
                    <th className="pb-2 pl-4 font-normal">Crawl status</th>
                  </tr>
                </thead>
                <tbody>
                  {EXTERNAL_PAGES.map((p) => (
                    <tr key={p.url} className="border-t border-border">
                      <td className="max-w-[240px] truncate py-2 font-mono text-xs" title={p.url}>{p.url}</td>
                      <td className="py-2 text-xs text-muted-foreground">{p.type}</td>
                      <td className="py-2 text-right font-mono text-xs">{p.links.toLocaleString("en-GB")}</td>
                      <td className="py-2 pl-4"><StatusChip s={p.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Panel>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <Panel title="Link-quality risk" sub="Diagnostic only. It never changes your score.">
            <ul className="divide-y divide-border">
              {RISK.map((r) => (
                <li key={r.label} className="flex items-center justify-between gap-3 py-2.5">
                  <div>
                    <p className="text-sm">{r.label}</p>
                    <p className="text-xs text-muted-foreground">{r.note}</p>
                  </div>
                  <span className="font-mono text-sm font-semibold">{r.value}</span>
                </li>
              ))}
            </ul>
          </Panel>
          <Panel title="Competitor context"><CompetitorBar large /></Panel>
        </div>
      </main>
    </>
  );
}
