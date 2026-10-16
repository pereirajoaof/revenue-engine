import { createFileRoute } from "@tanstack/react-router";
import { AppLink as Link } from "@/lib/app-link";
import { META_LINE } from "@/components/wa/data";
import { label, PageHeader, waHead } from "@/components/wa/ui";

export const Route = createFileRoute("/project/$projectId/dashboard/website-authority/methodology")({
  component: Method,
  head: () => waHead("How we measure", "What the Website Authority score claims, how it is calculated, and what it does not measure."),
});

const SECTIONS = [
  { id: "claims", title: "What the score claims (and what it doesn't)" },
  { id: "formula", title: "The formula" },
  { id: "external", title: "External links scale" },
  { id: "internal", title: "Internal distribution" },
  { id: "confidence", title: "Confidence" },
  { id: "not-measured", title: "What we don't measure" },
  { id: "not-search-engine", title: "Why this is not a search engine's authority score" },
  { id: "version", title: "Version" },
];

function Method() {
  return (
    <>
      <PageHeader crumb="Website Authority" title="How we measure Website Authority" meta={META_LINE} />
      <main className="grid gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[200px_minmax(0,680px)] lg:px-8">
        <nav aria-label="On this page" className="lg:sticky lg:top-32 lg:self-start">
          <p className={label}>On this page</p>
          <ul className="mt-2 space-y-1.5 text-sm">
            {SECTIONS.map((s) => (
              <li key={s.id}><a href={`#${s.id}`} className="text-muted-foreground hover:text-foreground">{s.title}</a></li>
            ))}
          </ul>
        </nav>
        <article className="space-y-8 text-[15px] leading-relaxed">
          <S id="claims" t={SECTIONS[0].title}>
            <p>Website Authority is an OrganicOS measurement. It describes two things we can observe: how many independent websites link to yours, and how much internal link support reaches the pages that matter to your business.</p>
            <p>It does not predict rankings or revenue. It tells you where to look.</p>
          </S>
          <S id="formula" t={SECTIONS[1].title}>
            <pre className="overflow-x-auto rounded-md border border-border bg-muted px-4 py-3 font-mono text-sm">Website Authority = External links^0.6 × Internal distribution^0.4</pre>
            <p>Both parts are required. If one part is missing, the score is shown as <strong>Incomplete</strong>. It is never calculated from one part alone, and a missing part never makes the score higher.</p>
          </S>
          <S id="external" t={SECTIONS[2].title}>
            <p>We count referring domains: independent websites that link to you. The scale is logarithmic:</p>
            <ul className="list-disc space-y-1 pl-5">
              <li>0 domains = 0</li>
              <li>1,000 domains = 50</li>
              <li>1,000,000 domains = 100</li>
            </ul>
            <p>Every 10× more domains adds about 17 points.</p>
          </S>
          <S id="internal" t={SECTIONS[3].title}>
            <p>Support flows from your homepage through your internal links. We measure how much of it reaches your priority pages.</p>
            <p>Only links to broken destinations lower the score. Links to non-indexable pages are shown for review but do not count against you.</p>
            <p>A reliable reading needs us to observe at least 80% of your linked pages.</p>
          </S>
          <S id="confidence" t={SECTIONS[4].title}>
            <p>Confidence describes how reliably we measured, not how good your links are.</p>
            <ul className="list-disc space-y-1 pl-5">
              <li><strong>High</strong>: full crawl and a fresh weekly link read.</li>
              <li><strong>Medium</strong>: most pages observed, or one source slightly out of date.</li>
              <li><strong>Directional</strong>: partial data. Read the trend, not the exact number.</li>
              <li><strong>Incomplete</strong>: a required part is missing, so no score is shown.</li>
            </ul>
          </S>
          <S id="not-measured" t={SECTIONS[5].title}>
            <ul className="list-disc space-y-1 pl-5">
              <li>Topical focus — see <Link to="/brand-authority/site-focus" className="text-primary hover:underline">Site Focus</Link>.</li>
              <li>Content quality.</li>
              <li>AI visibility.</li>
            </ul>
          </S>
          <S id="not-search-engine" t={SECTIONS[6].title}>
            <p>Search engines keep their own signals private. This score is built only from links we can observe and the pages we crawl, using a published formula. It can move in a different direction from any search engine's own view of your site, and should be read as an independent measurement, not a copy of one.</p>
          </S>
          <S id="version" t={SECTIONS[7].title}>
            <p className="rounded-md border border-dashed border-border bg-muted px-4 py-3 text-sm">Pilot method. Constants are provisional and may change; changes are marked on charts.</p>
          </S>
        </article>
      </main>
    </>
  );
}

function S({ id, t, children }: { id: string; t: string; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-32 space-y-3">
      <h2 className="text-lg font-semibold">{t}</h2>
      {children}
    </section>
  );
}
