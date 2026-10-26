import { createFileRoute, notFound } from "@tanstack/react-router";
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { DOTS, LANDING, PAGE_TYPES, uxHead, weekLabel } from "@/components/ux/data";
import { useUx } from "@/components/ux/state";
import { CRUMB_DASH, CRUMB_UX, DataTable, DotPlot, MiniRange, Page, Section, StatusPill, TopBar, UX_ROOT } from "@/components/ux/ui";

export const Route = createFileRoute("/project/$projectId/dashboard/user-experience/conversion-efficiency/$pageType")({
  loader: ({ params }) => {
    const pt = PAGE_TYPES.find((p) => p.slug === params.pageType);
    if (!pt) throw notFound();
    return { pt };
  },
  component: PageTypeDetail,
  head: ({ loaderData }) =>
    uxHead(loaderData?.pt.name ?? "Page type", `Conversion trend, device split and pages for ${loaderData?.pt.name ?? "this page type"}.`),
});

function PageTypeDetail() {
  const { pt } = Route.useLoaderData();
  const { outcome } = useUx();
  const base = pt.rate;
  const series = Array.from({ length: 13 }, (_, i) => ({
    week: weekLabel(12 - i),
    rate: Math.round((base - 0.3 + i * 0.03 + Math.sin(i * 1.3) * 0.15) * 100) / 100,
    lastYear: Math.round((base - 0.7 + Math.cos(i * 0.9) * 0.15) * 100) / 100,
  }));
  const pages = LANDING.filter((l) => l.type === pt.name);

  return (
    <>
      <TopBar
        crumbs={[CRUMB_DASH, CRUMB_UX, { label: "Conversion Efficiency", to: `${UX_ROOT}/conversion-efficiency` }]}
        title={pt.name}
        meta={`${pt.sessions.toLocaleString("en-GB")} landing sessions · ${pt.eligible} pages eligible · last 4 complete weeks`}
      />
      <Page>
        {!pt.flags && (
          <div className="rounded-[4px] border border-dashed border-border bg-card p-4 text-sm">
            Pages in this type behave alike. We don't flag individual pages here; watch the type's trend instead.
          </div>
        )}
        <Section title={`${outcome.rate} · 13 weeks`} caption="Solid: this year · dashed: same weeks last year">
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={series} margin={{ left: -16, right: 8 }}>
                <CartesianGrid stroke="var(--border)" vertical={false} />
                <XAxis dataKey="week" tick={{ fontSize: 10, fill: "var(--muted-foreground)" }} tickLine={false} axisLine={false} />
                <YAxis tickFormatter={(v) => `${v}%`} tick={{ fontSize: 10, fill: "var(--muted-foreground)" }} tickLine={false} axisLine={false} domain={["auto", "auto"]} />
                <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", fontSize: 11 }} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Line name="This year" dataKey="rate" stroke="var(--primary)" strokeWidth={2} dot={false} />
                <Line name="Last year" dataKey="lastYear" stroke="var(--muted-foreground)" strokeDasharray="4 4" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Section>
        <div className="grid gap-5 xl:grid-cols-[1fr_1.4fr]">
          <Section title="Device split">
            <DataTable
              rows={[
                { d: "Mobile", share: "68%", rate: `${(base - 0.9).toFixed(1)}%`, peer: `${(base - 0.4).toFixed(1)}%` },
                { d: "Desktop", share: "27%", rate: `${(base + 1.6).toFixed(1)}%`, peer: `${(base + 1.9).toFixed(1)}%` },
                { d: "Tablet", share: "5%", rate: `${(base + 0.2).toFixed(1)}%`, peer: "—" },
              ]}
              rowKey={(r) => r.d}
              cols={[
                { key: "d", label: "Device", render: (r) => r.d },
                { key: "s", label: "Share of sessions", align: "right", render: (r) => r.share },
                { key: "r", label: outcome.rate, align: "right", render: (r) => r.rate },
                { key: "p", label: "Similar pages", align: "right", render: (r) => r.peer },
              ]}
            />
          </Section>
          <Section title="Pages in this type vs similar pages">
            {pt.flags ? <DotPlot points={DOTS.slice(0, 8)} /> : <p className="text-sm text-muted-foreground">Not shown — pages in this type behave alike.</p>}
          </Section>
        </div>
        <Section title="Pages">
          <DataTable
            rows={pages}
            rowKey={(r) => r.page}
            empty="No landing pages of this type in the window"
            cols={[
              { key: "p", label: "Page", render: (r) => <span className="font-mono text-xs">{r.page}</span> },
              { key: "s", label: "Sessions", align: "right", render: (r) => r.sessions?.toLocaleString("en-GB") ?? "—" },
              { key: "c", label: `${outcome.rate} vs peers`, render: (r) => (r.conv ? <MiniRange {...r.conv} /> : <span className="text-muted-foreground">—</span>) },
              { key: "st", label: "Status", render: (r) => <StatusPill status={pt.flags ? r.status : "Not flagged"} /> },
            ]}
          />
        </Section>
      </Page>
    </>
  );
}
