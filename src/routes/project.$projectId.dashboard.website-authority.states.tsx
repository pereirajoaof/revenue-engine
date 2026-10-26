import { createFileRoute } from "@tanstack/react-router";
import { ComponentCards, HeroCard, label, PageHeader, waHead } from "@/components/wa/ui";

export const Route = createFileRoute("/project/$projectId/dashboard/website-authority/states")({
  component: States,
  head: () => waHead("States gallery", "Design review of every Website Authority hero and component-card state."),
});

function Block({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-3 border-t border-dashed border-border pt-6">
      <p className={label}>State {n} · {title}</p>
      {children}
    </section>
  );
}

function States() {
  return (
    <>
      <PageHeader crumb="Website Authority" title="States gallery" meta="Design review only · not product UI" />
      <main className="space-y-8 px-4 py-6 sm:px-6 lg:px-8">
        <Block n={1} title="Incomplete: coverage">
          <HeroCard v={{ kind: "incomplete", reason: "Internal distribution could not be measured reliably, so no score is shown." }} />
          <ComponentCards ext={{ value: 64 }} int={{ incomplete: "Incomplete: We observed 8% of your linked pages; a reliable reading needs 80%.", sample: true }} />
        </Block>
        <Block n={2} title="Incomplete: crawler access blocked">
          <HeroCard v={{ kind: "incomplete", reason: "We could not read your internal links in the latest crawl." }} />
          <ComponentCards ext={{ value: 64 }} int={{ blocked: true }} />
        </Block>
        <Block n={3} title="Link read stale">
          <HeroCard v={{ kind: "incomplete", reason: "The weekly link read is out of date, so no score is shown." }} />
          <ComponentCards ext="stale" />
        </Block>
        <Block n={4} title="Measured zero">
          <HeroCard v={{ kind: "zero" }} />
          <ComponentCards ext="zero" />
        </Block>
        <Block n={5} title="Latest refresh failed">
          <HeroCard v={{ kind: "normal", banner: "Latest refresh failed — showing week of 5 Oct." }} />
        </Block>
        <Block n={6} title="New project (first weeks)">
          <HeroCard v={{ kind: "normal", momentum: "New", note: "Trend appears after 8 comparable weeks." }} />
        </Block>
        <Block n={7} title="Method or configuration changed">
          <HeroCard v={{ kind: "normal", momentum: "Not comparable", pin: "Configuration changed (priority pages edited)" }} />
        </Block>
        <Block n={8} title="Empty (no data yet)">
          <div className="rounded-[4px] border border-dashed border-border bg-card p-10 text-center">
            <p className="text-lg font-semibold">No reading yet</p>
            <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
              Website Authority needs a completed site crawl and a weekly link read. Your first reading appears after the next weekly refresh.
            </p>
          </div>
        </Block>
      </main>
    </>
  );
}
