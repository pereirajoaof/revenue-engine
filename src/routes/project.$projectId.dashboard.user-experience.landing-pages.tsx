import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { LANDING_ROWS, PAGE_TYPES, type LandingRow, type UxStatus } from "@/lib/ux-data";
import { Card, IllustrativeNote, SectionTitle, SelectControl, UxTopBar, useUx , UxControls } from "@/components/ux/UxKit";
import { FindingDrawer, LandingTable } from "@/components/ux/LandingTable";
import { BuildingState, StaleBanner, StateNotices } from "@/components/ux/StateBlocks";

export const Route = createFileRoute("/project/$projectId/dashboard/user-experience/landing-pages")({
  component: LandingPages,
  head: () => ({
    meta: [
      { title: "Landing pages — User Experience — OrganicOS" },
      { name: "description", content: "Every organic landing page compared with similar pages on this site, with ranges and evidence." },
      { property: "og:title", content: "Landing pages — OrganicOS" },
      { property: "og:description", content: "Organic landing pages compared with similar pages on this site." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
});

const STATUSES: ("All" | UxStatus)[] = ["All", "Below peers", "Within peer range", "Above peers", "Insufficient evidence", "Not enough comparable pages"];

function LandingPages() {
  const { state, hasGA4 } = useUx();
  const [status, setStatus] = useState<string>("All");
  const [type, setType] = useState("All");
  const [device, setDevice] = useState("All");
  const [exact, setExact] = useState(false);
  const [q, setQ] = useState("");
  const [open, setOpen] = useState<LandingRow | null>(null);

  const rows = useMemo(
    () =>
      LANDING_ROWS.filter((r) => status === "All" || r.status === status)
        .filter((r) => type === "All" || r.type === type)
        .filter((r) => device === "All" || r.device === device)
        .filter((r) => !exact || r.exact)
        .filter((r) => !q || r.path.includes(q))
        .sort((a, b) => b.shortfall - a.shortfall),
    [status, type, device, exact, q],
  );

  return (
    <>
      <UxTopBar
        crumbs={[{ label: "Dashboard", to: "/dashboard" }, { label: "User Experience", to: "/dashboard/user-experience" }]}
        title="Landing pages"
        meta="GA4 · Organic Search sessions · 15 Sep–12 Oct (Europe/London) · Search Console 15 Sep–12 Oct (Pacific time)"
        controls={<UxControls />}
      />
      <main className="space-y-6 px-6 py-6 lg:px-8">
        {state === "new" ? (
          <BuildingState />
        ) : (
          <>
            <StaleBanner />
            <StateNotices />
            <Card>
              <SectionTitle title={`${rows.length} landing pages`} sub={hasGA4 ? "Sorted by conservative shortfall" : "Search context only"} />
              <div className="flex flex-wrap items-center gap-2 border-b border-border px-4 py-3">
                {hasGA4 && <SelectControl label="Status" value={status} onChange={setStatus} options={STATUSES} />}
                <SelectControl label="Page type" value={type} onChange={setType} options={["All", ...PAGE_TYPES.map((t) => t.name)]} />
                <SelectControl label="Device" value={device} onChange={setDevice} options={["All", "Mobile-heavy", "Desktop-heavy", "Mixed"]} />
                <label className="flex items-center gap-2 text-xs text-muted-foreground"><Switch checked={exact} onCheckedChange={setExact} /> Exact URL match only</label>
                <div className="ml-auto flex items-center gap-1.5 rounded-md border border-border bg-surface px-2 py-1.5">
                  <Search className="h-3.5 w-3.5 text-muted-foreground" />
                  <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search path" className="w-40 bg-transparent font-mono text-xs outline-none" />
                </div>
              </div>
              {state === "small" ? (
                <p className="p-6 text-sm text-muted-foreground">Not enough organic sessions per page to compare pages yet.</p>
              ) : rows.length ? (
                <LandingTable rows={rows} onOpen={hasGA4 ? setOpen : undefined} />
              ) : (
                <p className="p-6 text-sm text-muted-foreground">No pages match these filters.</p>
              )}
            </Card>
          </>
        )}
        <IllustrativeNote />
      </main>
      <FindingDrawer row={open} onClose={() => setOpen(null)} />
    </>
  );
}
