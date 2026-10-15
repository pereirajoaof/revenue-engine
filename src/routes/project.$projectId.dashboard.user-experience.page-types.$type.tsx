import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip as RTooltip, XAxis, YAxis } from "recharts";
import { DEVICE_SPLIT, LANDING_ROWS, PAGE_TYPES, TREND_13W, type LandingRow } from "@/lib/ux-data";
import { Card, IllustrativeNote, Label, SectionTitle, UxTopBar } from "@/components/ux/UxKit";
import { FindingDrawer, LandingTable } from "@/components/ux/LandingTable";
import { UxControls } from "./project.$projectId.dashboard.user-experience.index";

export const Route = createFileRoute("/project/$projectId/dashboard/user-experience/page-types/$type")({
  component: PageTypeDetail,
  head: ({ params }) => {
    const name = PAGE_TYPES.find((t) => t.slug === params.type)?.name ?? "Page type";
    return {
      meta: [
        { title: `${name} — User Experience — OrganicOS` },
        { name: "description", content: `How ${name} landing pages compare with each other on engagement and outcomes.` },
        { property: "og:title", content: `${name} — OrganicOS` },
        { property: "og:description", content: `Page-type trend, spread and device split for ${name}.` },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary" },
      ],
    };
  },
});

function DotPlot({ rows, peer }: { rows: LandingRow[]; peer: number }) {
  const W = 600, H = 180, max = 10;
  const y = (v: number) => H - 20 - (v / max) * (H - 40);
  const pts = rows.filter((r) => r.purchase);
  const step = (W - 80) / Math.max(1, pts.length - 1);
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-48 w-full">
      <rect x={40} y={y(peer + 0.6)} width={W - 50} height={y(peer - 0.6) - y(peer + 0.6)} className="fill-muted-foreground/15" />
      <text x={W - 12} y={y(peer) - 4} textAnchor="end" className="fill-muted-foreground font-mono text-[10px]">peer {peer}%</text>
      {[0, 5, 10].map((t) => (
        <text key={t} x={30} y={y(t) + 3} textAnchor="end" className="fill-muted-foreground font-mono text-[10px]">{t}%</text>
      ))}
      {pts.map((r, i) => {
        const x = 60 + i * step;
        const warn = r.status === "Below peers";
        return (
          <g key={r.id}>
            <line x1={x} x2={x} y1={y(r.purchase!.hi)} y2={y(r.purchase!.lo)} strokeWidth={3} strokeLinecap="round" className={warn ? "stroke-chart-5/40" : "stroke-muted-foreground/40"} />
            <circle cx={x} cy={y(r.purchase!.obs)} r={5} className={warn ? "fill-chart-5" : "fill-muted-foreground"}>
              <title>{`${r.path}: ${r.purchase!.obs}% (90% range ${r.purchase!.lo}–${r.purchase!.hi}%)`}</title>
            </circle>
            <text x={x} y={H - 4} textAnchor="middle" className="fill-muted-foreground font-mono text-[9px]">{r.path.slice(0, 12)}</text>
          </g>
        );
      })}
    </svg>
  );
}

function PageTypeDetail() {
  const { type } = Route.useParams();
  const t = PAGE_TYPES.find((p) => p.slug === type) ?? PAGE_TYPES[0];
  const rows = LANDING_ROWS.filter((r) => r.type === t.name);
  const [open, setOpen] = useState<LandingRow | null>(null);

  return (
    <>
      <UxTopBar
        crumbs={[{ label: "Dashboard", to: "/dashboard" }, { label: "User Experience", to: "/dashboard/user-experience" }]}
        title={t.name}
        meta="GA4 · Organic Search sessions · last 13 complete weeks (Europe/London)"
        controls={<UxControls />}
      />
      <main className="space-y-6 px-6 py-6 lg:px-8">
        <div className="grid grid-cols-2 gap-4 xl:grid-cols-5">
          {[
            ["Landing sessions", t.sessions.toLocaleString("en-GB"), "GA4 · 4 weeks"],
            ["Purchase rate", `${t.purchaseRate}%`, "GA4 · 4 weeks"],
            ["Engaged share", `${t.engaged}%`, "GA4 · 4 weeks"],
            ["Eligible pages", `${t.eligible} of ${t.total}`, "≥100 sessions & ≥10 expected purchases"],
            ["Variation", t.alike ? "Pages behave alike" : "Pages differ more than chance", t.alike ? "No page flags" : "Page flags shown"],
          ].map(([l, v, s]) => (
            <Card key={l} className="p-4">
              <Label>{l}</Label>
              <p className="mt-2 font-mono text-lg font-semibold">{v}</p>
              <p className="text-[11px] text-muted-foreground">{s}</p>
            </Card>
          ))}
        </div>

        {t.alike && (
          <Card className="p-4 text-sm">Pages in this type behave alike. We don't flag individual pages here; watch the type's trend instead.</Card>
        )}

        <Card>
          <SectionTitle title="Purchase rate · last 13 weeks" sub="Weekly, % of organic landing sessions · dashed = same week last year" />
          <div className="h-64 p-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={TREND_13W} margin={{ left: 8, right: 8, top: 8, bottom: 8 }}>
                <CartesianGrid stroke="var(--border)" vertical={false} />
                <XAxis dataKey="week" tick={{ fontSize: 10, fontFamily: "monospace", fill: "var(--muted-foreground)" }} />
                <YAxis domain={[3, 6.5]} unit="%" tick={{ fontSize: 10, fontFamily: "monospace", fill: "var(--muted-foreground)" }} label={{ value: "Purchase rate", angle: -90, position: "insideLeft", fontSize: 10, fill: "var(--muted-foreground)" }} />
                <RTooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", fontSize: 11, fontFamily: "monospace" }} formatter={(v: number) => `${v}%`} />
                <Line dataKey="rate" name="This year" stroke="var(--chart-1)" strokeWidth={2} dot={false} />
                <Line dataKey="prevYear" name="Previous year" stroke="var(--chart-2)" strokeDasharray="4 4" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          <Card className="xl:col-span-2">
            <SectionTitle title="Eligible pages vs peer rate" sub="Dot = observed · bar = 90% range · band = peer rate · orange = below peers" />
            <div className="p-4">{rows.some((r) => r.purchase) ? <DotPlot rows={rows} peer={5.6} /> : <p className="text-sm text-muted-foreground">No eligible pages with an outcome comparison.</p>}</div>
          </Card>
          <Card>
            <SectionTitle title="Device split" sub="GA4 · 4 weeks" />
            <table className="w-full font-mono text-[12px]">
              <thead><tr className="text-left text-[10px] uppercase tracking-wider text-muted-foreground"><th className="px-4 py-2 font-normal">Device</th><th className="font-normal">Sessions</th><th className="font-normal">Rate</th><th className="pr-4 font-normal">Peer</th></tr></thead>
              <tbody>
                {DEVICE_SPLIT.map((d) => (
                  <tr key={d.device} className="border-t border-border"><td className="px-4 py-2">{d.device}</td><td>{d.sessions.toLocaleString("en-GB")}</td><td>{d.rate}%</td><td className="pr-4 text-muted-foreground">{d.peer}%</td></tr>
                ))}
              </tbody>
            </table>
          </Card>
        </div>

        <Card>
          <SectionTitle title={`Pages in ${t.name}`} />
          {rows.length ? <LandingTable rows={rows} onOpen={setOpen} /> : <p className="p-6 text-sm text-muted-foreground">No landing pages in this mock for this type.</p>}
        </Card>
        <IllustrativeNote />
      </main>
      <FindingDrawer row={open} onClose={() => setOpen(null)} />
    </>
  );
}
