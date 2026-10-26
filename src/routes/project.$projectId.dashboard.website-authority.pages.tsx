import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ArrowDown, ArrowUp, Check, Download } from "lucide-react";
import { META_LINE, PAGES, type PageRow } from "@/components/wa/data";
import { label, PageHeader, Pill, waHead } from "@/components/wa/ui";

export const Route = createFileRoute("/project/$projectId/dashboard/website-authority/pages")({
  component: PagesPage,
  head: () => waHead("Pages", "Every analysed page with its internal link support, reachability and external links."),
});

type Key = "url" | "type" | "support" | "depth" | "linksIn" | "domainLinks" | "revenue";
const COLS: { k: Key | null; label: string; num?: boolean }[] = [
  { k: "url", label: "URL" },
  { k: "type", label: "Page type" },
  { k: null, label: "Priority" },
  { k: null, label: "Reachable" },
  { k: "support", label: "Support index", num: true },
  { k: null, label: "Supported" },
  { k: "depth", label: "Clicks from homepage", num: true },
  { k: "linksIn", label: "Internal links in", num: true },
  { k: "domainLinks", label: "Domain–page links", num: true },
  { k: "revenue", label: "Revenue on page (exposure)", num: true },
];

const sel = "rounded-md border border-border bg-card px-2 py-1.5 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

function PagesPage() {
  const [type, setType] = useState("All");
  const [sup, setSup] = useState("All");
  const [reach, setReach] = useState("All");
  const [dest, setDest] = useState("All");
  const [prio, setPrio] = useState(false);
  const [sort, setSort] = useState<{ k: Key; asc: boolean }>({ k: "support", asc: true });

  const rows = useMemo(() => {
    const r = PAGES.filter(
      (p) =>
        (type === "All" || p.type === type) &&
        (sup === "All" || (sup === "Supported") === p.supported) &&
        (reach === "All" || (reach === "Reachable") === p.reachable) &&
        (dest === "All" || p.dest === dest) &&
        (!prio || p.priority),
    );
    return [...r].sort((a, b) => {
      const av = a[sort.k] ?? 999, bv = b[sort.k] ?? 999;
      const c = typeof av === "string" ? av.localeCompare(bv as string) : (av as number) - (bv as number);
      return sort.asc ? c : -c;
    });
  }, [type, sup, reach, dest, prio, sort]);

  const exportCsv = () => {
    const head = ["url", "page_type", "priority", "reachable", "support_index", "supported", "clicks_from_homepage", "internal_links_in", "domain_page_links", "revenue_on_page_exposure_gbp"];
    const body = rows.map((p) => [p.url, p.type, p.priority, p.reachable, p.support, p.supported, p.depth ?? "", p.linksIn, p.domainLinks, p.revenue].join(","));
    const blob = new Blob([[head.join(","), ...body].join("\n")], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "website-authority-pages.csv";
    a.click();
  };

  return (
    <>
      <PageHeader
        crumb="Website Authority"
        title="Pages"
        meta={META_LINE}
        controls={
          <button type="button" onClick={exportCsv} className="inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-3 py-1.5 text-xs font-medium hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
            <Download className="h-3.5 w-3.5" /> Export CSV
          </button>
        }
      />
      <main className="space-y-4 px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center gap-2">
          <select aria-label="Page type" className={sel} value={type} onChange={(e) => setType(e.target.value)}>
            {["All", "Homepage", "Category", "Product", "Blog", "Help"].map((o) => <option key={o} value={o}>{o === "All" ? "All page types" : o}</option>)}
          </select>
          <select aria-label="Support" className={sel} value={sup} onChange={(e) => setSup(e.target.value)}>
            {["All", "Supported", "Unsupported"].map((o) => <option key={o} value={o}>{o === "All" ? "Supported and unsupported" : o}</option>)}
          </select>
          <select aria-label="Reachable" className={sel} value={reach} onChange={(e) => setReach(e.target.value)}>
            {["All", "Reachable", "Not reachable"].map((o) => <option key={o} value={o}>{o === "All" ? "Any reachability" : o}</option>)}
          </select>
          <select aria-label="Destination class" className={sel} value={dest} onChange={(e) => setDest(e.target.value)}>
            {["All", "Indexable", "Non-indexable", "Broken"].map((o) => <option key={o} value={o}>{o === "All" ? "Any destination class" : o}</option>)}
          </select>
          <label className="flex items-center gap-2 text-xs">
            <input type="checkbox" checked={prio} onChange={(e) => setPrio(e.target.checked)} className="h-3.5 w-3.5 accent-[var(--primary)]" />
            Priority only
          </label>
          <span className="ml-auto font-mono text-[11px] text-muted-foreground">{rows.length} of {PAGES.length} pages shown</span>
        </div>

        <div className="overflow-x-auto rounded-[10px] border border-border bg-card">
          <table className="w-full min-w-[1100px] text-sm">
            <thead className="bg-muted/50">
              <tr>
                {COLS.map((c) => (
                  <th key={c.label} className={`px-3 py-2.5 ${label} font-normal ${c.num ? "text-right" : "text-left"}`}>
                    {c.k ? (
                      <button
                        type="button"
                        onClick={() => setSort((s) => ({ k: c.k!, asc: s.k === c.k ? !s.asc : true }))}
                        className="inline-flex items-center gap-1 uppercase hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      >
                        {c.label}
                        {sort.k === c.k && (sort.asc ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />)}
                      </button>
                    ) : c.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((p) => <Row key={p.url} p={p} />)}
            </tbody>
          </table>
        </div>
        <p className="text-[11px] text-muted-foreground">Revenue on page is estimated search revenue on that page — exposure, not revenue at risk.</p>
      </main>
    </>
  );
}

function Row({ p }: { p: PageRow }) {
  return (
    <tr className="border-t border-border hover:bg-muted/40">
      <td className="max-w-[260px] truncate px-3 py-2 font-mono text-xs" title={p.url}>{p.url}</td>
      <td className="px-3 py-2 text-xs">{p.type}</td>
      <td className="px-3 py-2">
        {p.priority ? (
          <span className="flex items-center gap-1.5 text-xs"><span className="h-2 w-2 rounded-full bg-primary" />Priority</span>
        ) : (
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground"><span className="h-2 w-2 rounded-full border border-muted-foreground" />No</span>
        )}
      </td>
      <td className="px-3 py-2 text-xs">
        {p.reachable ? <Check className="h-4 w-4 text-primary" aria-label="Reachable" /> : <span className="text-chart-4">Not reachable from homepage</span>}
      </td>
      <td className="px-3 py-2 text-right font-mono text-xs">{p.support.toFixed(2)}</td>
      <td className="px-3 py-2">{p.supported ? <Pill tone="green">Supported</Pill> : <Pill tone="amber">Unsupported</Pill>}</td>
      <td className="px-3 py-2 text-right font-mono text-xs">{p.depth ?? "—"}</td>
      <td className="px-3 py-2 text-right font-mono text-xs">
        {p.linksIn === 0 ? <span className="font-sans text-muted-foreground">No internal links found in crawled pages</span> : p.linksIn.toLocaleString("en-GB")}
      </td>
      <td className="px-3 py-2 text-right font-mono text-xs">{p.domainLinks.toLocaleString("en-GB")}</td>
      <td className="px-3 py-2 text-right font-mono text-xs text-muted-foreground">{p.revenue ? `£${p.revenue.toLocaleString("en-GB")}/yr` : "—"}</td>
    </tr>
  );
}
