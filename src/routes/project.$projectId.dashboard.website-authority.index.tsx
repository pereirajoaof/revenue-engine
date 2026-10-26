import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight, Check } from "lucide-react";
import { AppLink as Link } from "@/lib/app-link";
import { FINDINGS, META_LINE, type Finding } from "@/components/wa/data";
import { ComponentCards, CompetitorBar, Exposure, HeroCard, label, PageHeader, Panel, Pill, TopicTable, TrustList, waHead } from "@/components/wa/ui";

export const Route = createFileRoute("/project/$projectId/dashboard/website-authority/")({
  component: Hub,
  head: () => waHead("Overview", "How strong this website's authority is, where that strength sits, and what to investigate."),
});

function Hub() {
  const [all, setAll] = useState(false);
  const shown = all ? FINDINGS : FINDINGS.slice(0, 6);
  return (
    <>
      <PageHeader
        crumb="Growth driver"
        title="Website Authority"
        meta={META_LINE}
        controls={
          <Link to="/website-authority/methodology" className="rounded-md border border-border bg-card px-3 py-1.5 text-xs font-medium hover:bg-muted">
            How we measure
          </Link>
        }
      />
      <main className="space-y-5 px-4 py-6 sm:px-6 lg:px-8">
        <HeroCard />
        <ComponentCards />

        <Panel title="What changed this week">
          <ul className="space-y-1.5 text-sm">
            <li><span className="font-mono font-semibold text-primary">+1.5</span> from external links (+145 referring domains)</li>
            <li><span className="font-mono font-semibold text-destructive">−0.9</span> from internal distribution (24 priority pages lost support after a navigation change)</li>
          </ul>
          <p className="mt-2 text-xs text-muted-foreground">Rounded score unchanged at 51.</p>
          <div className="mt-4 rounded-md border border-dashed border-border bg-muted px-3 py-2 text-xs text-muted-foreground">
            <span className={label}>Measurement changes</span> · none this week
          </div>
        </Panel>

        <section>
          <div className="mb-3 flex items-end justify-between">
            <div>
              <p className={label}>Findings</p>
              <h2 className="text-lg font-semibold">What to investigate, ranked</h2>
            </div>
            <button type="button" onClick={() => setAll((a) => !a)} className="text-xs font-medium text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
              {all ? "Show top 6" : `View all ${FINDINGS.length}`}
            </button>
          </div>
          <ol className="space-y-3">
            {shown.map((f, i) => <FindingCard key={f.id} f={f} rank={i + 1} />)}
          </ol>
        </section>

        <div className="grid gap-4 lg:grid-cols-3">
          <Panel title="Topic evidence"><TopicTable /></Panel>
          <Panel title="Trust pages" sub="4 of 5 found"><TrustList /></Panel>
          <Panel title="Competitor position"><CompetitorBar /></Panel>
        </div>
      </main>
    </>
  );
}

function FindingCard({ f, rank }: { f: Finding; rank: number }) {
  const [intentional, setIntentional] = useState(false);
  const fields: [string, React.ReactNode][] = [
    ["What we observed", f.observed],
    ["Where", f.where],
    ["How reliable", <span key="r" className="flex flex-wrap items-center gap-2"><Pill tone={f.reliability === "High" ? "green" : "amber"}>{f.reliability}</Pill><span className="text-muted-foreground">{f.coverage}</span></span>],
    ["Why it might matter", f.why],
    ["What to investigate", f.investigate],
  ];
  return (
    <li className="rounded-[10px] border border-border bg-card p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <h3 className="flex gap-3 text-sm font-semibold">
          <span className="font-mono text-muted-foreground">{String(rank).padStart(2, "0")}</span>
          {f.title}
        </h3>
        {f.action === "intentional" && (
          <button
            type="button"
            onClick={() => setIntentional((v) => !v)}
            aria-pressed={intentional}
            className="inline-flex items-center gap-1 rounded-md border border-border px-2.5 py-1 text-xs font-medium hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {intentional && <Check className="h-3 w-3" />}
            {intentional ? "Marked as intentional" : "Mark as intentional"}
          </button>
        )}
      </div>
      <dl className="mt-3 grid gap-x-6 gap-y-2 text-sm md:grid-cols-[160px_1fr]">
        {fields.map(([k, v]) => (
          <div key={k} className="contents">
            <dt className={label + " pt-0.5"}>{k}</dt>
            <dd>{v}</dd>
          </div>
        ))}
      </dl>
      {f.exposure && <Exposure value={f.exposure} />}
      {f.id === "f1" && (
        <Link to="/website-authority/pages" className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline">
          See these pages <ArrowRight className="h-3 w-3" />
        </Link>
      )}
    </li>
  );
}
