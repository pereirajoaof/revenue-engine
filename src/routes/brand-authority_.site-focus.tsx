import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  ArrowDownRight,
  ArrowUpRight,
  ChevronDown,
  Download,
  Eye,
  MousePointer2,
  Orbit,
  RefreshCcw,
  Search,
  Target,
  TrendingUp,
  TriangleAlert,
  X,
} from "lucide-react";
import { DashboardNav } from "@/components/dashboard/DashboardNav";
import { ThemeToggle } from "@/components/ThemeToggle";

export const Route = createFileRoute("/brand-authority_/site-focus")({
  component: SiteFocusPage,
  head: () => ({
    meta: [
      { title: "Site Focus — Brand Authority" },
      { name: "description", content: "Visualise topical authority, revenue at risk, and page-level topical drift actions for OrganicOS." },
      { property: "og:title", content: "Site Focus — Brand Authority" },
      { property: "og:description", content: "A revenue-focused topical authority dashboard connecting embedding drift to prioritised SEO and product actions." },
    ],
  }),
});

type Segment = "Core Topic" | "Adjacent" | "Off-Topic";
type MapMode = "2d" | "3d";
type SortKey = "url" | "radiusScore" | "cluster" | "currentRevenue" | "potentialRevenue";

type PageEmbedding = {
  url: string;
  pageType: string;
  cluster: string;
  embedding: [number, number, number];
  currentRevenue: number;
  potentialRevenue: number;
  confidence: number;
  action: string;
};

type DerivedPage = PageEmbedding & {
  x: number;
  y: number;
  z: number;
  distance: number;
  radiusScore: number;
  segment: Segment;
  authorityLoss: number;
};

const pageEmbeddings: PageEmbedding[] = [
  { url: "/routes/london-to-manchester", pageType: "Route", cluster: "Intercity routes", embedding: [0.18, 0.12, 0.08], currentRevenue: 184000, potentialRevenue: 196000, confidence: 0.94, action: "Strengthen internal linking" },
  { url: "/routes/edinburgh-to-glasgow", pageType: "Route", cluster: "Intercity routes", embedding: [0.22, 0.06, 0.1], currentRevenue: 151000, potentialRevenue: 162000, confidence: 0.91, action: "Strengthen internal linking" },
  { url: "/routes/bristol-to-bath", pageType: "Route", cluster: "Regional routes", embedding: [0.1, 0.21, 0.12], currentRevenue: 79000, potentialRevenue: 89000, confidence: 0.88, action: "Reposition into core topic" },
  { url: "/routes/airport-transfers", pageType: "Route", cluster: "Airport travel", embedding: [0.3, 0.18, 0.09], currentRevenue: 132000, potentialRevenue: 148000, confidence: 0.86, action: "Strengthen internal linking" },
  { url: "/city/birmingham", pageType: "City", cluster: "City hubs", embedding: [-0.1, 0.25, 0.16], currentRevenue: 96000, potentialRevenue: 116000, confidence: 0.83, action: "Reposition into core topic" },
  { url: "/city/leeds", pageType: "City", cluster: "City hubs", embedding: [-0.18, 0.28, 0.2], currentRevenue: 64000, potentialRevenue: 88000, confidence: 0.78, action: "Improve internal linking" },
  { url: "/stops/victoria-coach-station", pageType: "Stop", cluster: "Transport nodes", embedding: [0.36, -0.16, 0.12], currentRevenue: 71000, potentialRevenue: 92000, confidence: 0.82, action: "Move to separate content hub" },
  { url: "/operator/national-express", pageType: "Operator", cluster: "Operator pages", embedding: [-0.34, -0.18, 0.21], currentRevenue: 118000, potentialRevenue: 157000, confidence: 0.8, action: "Reposition into core topic" },
  { url: "/blog/cheap-weekend-routes", pageType: "Blog", cluster: "Travel guides", embedding: [0.54, -0.42, 0.32], currentRevenue: 41000, potentialRevenue: 96000, confidence: 0.72, action: "Move to separate content hub" },
  { url: "/blog/best-days-out-uk", pageType: "Blog", cluster: "Travel guides", embedding: [0.62, -0.38, 0.36], currentRevenue: 35000, potentialRevenue: 87000, confidence: 0.68, action: "Move to separate content hub" },
  { url: "/poi/stonehenge-day-trip", pageType: "POI", cluster: "POI pages", embedding: [0.78, -0.52, 0.41], currentRevenue: 57000, potentialRevenue: 137000, confidence: 0.75, action: "Move to separate content hub" },
  { url: "/poi/harry-potter-studio-tour", pageType: "POI", cluster: "POI pages", embedding: [0.84, -0.48, 0.46], currentRevenue: 73000, potentialRevenue: 166000, confidence: 0.77, action: "Move to separate content hub" },
  { url: "/blog/old-timetable-guide", pageType: "Blog", cluster: "Legacy guides", embedding: [-0.66, -0.58, 0.37], currentRevenue: 24000, potentialRevenue: 71000, confidence: 0.64, action: "De-index / consolidate" },
  { url: "/help/luggage-rules", pageType: "Help", cluster: "Support content", embedding: [-0.52, -0.44, 0.25], currentRevenue: 18000, potentialRevenue: 42000, confidence: 0.7, action: "Consolidate into route templates" },
];

const segmentOrder: Segment[] = ["Core Topic", "Adjacent", "Off-Topic"];
const segmentMeta: Record<Segment, { label: string; tone: string; fill: string; loss: string }> = {
  "Core Topic": { label: "Core topic", tone: "text-primary", fill: "var(--primary)", loss: "Low" },
  Adjacent: { label: "Adjacent", tone: "text-chart-3", fill: "var(--chart-3)", loss: "Medium" },
  "Off-Topic": { label: "Off-topic", tone: "text-destructive", fill: "var(--destructive)", loss: "High" },
};

const ACTIONS = [
  { title: "Consolidate off-topic pages", detail: "120 pages sit outside the topical radius and dilute authority signals.", impact: 320000, effort: "High", confidence: 86 },
  { title: "Move POI pages into separate hub", detail: "POI URLs have revenue but are pulling the centroid away from transport intent.", impact: 180000, effort: "Medium", confidence: 78 },
  { title: "Improve internal linking in core cluster", detail: "Core route pages can recover authority faster with hub-to-spoke links.", impact: 95000, effort: "Low", confidence: 91 },
] as const;

function SiteFocusPage() {
  const [mapMode, setMapMode] = useState<MapMode>("2d");
  const [selectedUrl, setSelectedUrl] = useState(pageEmbeddings[10].url);
  const [sortKey, setSortKey] = useState<SortKey>("radiusScore");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [angle, setAngle] = useState({ x: 58, y: 34 });

  const model = useMemo(() => buildTopicalModel(pageEmbeddings), []);
  const selectedPage = model.pages.find((page) => page.url === selectedUrl) ?? model.pages[0];
  const outsideRadius = model.pages.filter((page) => page.segment !== "Core Topic");
  const sortedOutside = useMemo(() => sortPages(outsideRadius, sortKey, sortDir), [outsideRadius, sortKey, sortDir]);

  const handleSort = (key: SortKey) => {
    if (key === sortKey) {
      setSortDir((direction) => (direction === "asc" ? "desc" : "asc"));
      return;
    }
    setSortKey(key);
    setSortDir("desc");
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <DashboardNav />
      <div className="lg:pl-56">
        <header className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur">
          <div className="flex flex-col gap-4 px-6 py-5 lg:flex-row lg:items-center lg:justify-between lg:px-8">
            <div>
              <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Growth driver · Brand Authority</p>
              <h1 className="mt-1 text-2xl font-bold tracking-tight">Site Focus</h1>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button type="button" onClick={() => exportCsv(sortedOutside)} className="inline-flex items-center gap-2 rounded-md border border-border bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground transition-colors hover:bg-primary/90">
                <Download className="h-3.5 w-3.5" /> Export data
              </button>
              <ThemeToggle />
            </div>
          </div>
        </header>

        <main className="space-y-6 px-6 py-6 lg:px-8">
          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <KpiCard label="Revenue at Risk" value={formatMoney(model.revenueAtRisk)} detail="Topical Drift" trend="+8.4% WoW" trendType="down" />
            <KpiCard label="Recoverable Revenue" value={formatMoney(model.recoverableRevenue)} detail="If fixed" trend="+£41K WoW" trendType="up" />
            <KpiCard label="Site Focus Score" value={`${model.siteFocusScore}`} detail="Out of 100" trend="-3.2 WoW" trendType="down" neutral />
            <KpiCard label="Outside Radius" value={`${model.outsideRadiusPct}%`} detail="Pages drifting" trend="+5.6% WoW" trendType="down" neutral />
          </section>

          <section className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_380px]">
            <TopicalMapPanel
              pages={model.pages}
              centroid={model.centroid}
              selectedUrl={selectedPage.url}
              mapMode={mapMode}
              angle={angle}
              onAngleChange={setAngle}
              onSelect={setSelectedUrl}
              onMapMode={setMapMode}
            />
            <PageDetailPanel page={selectedPage} onClose={() => setSelectedUrl(model.pages[0].url)} />
          </section>

          <section className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_380px]">
            <LeakageBreakdown rows={model.breakdown} />
            <ActionLayer />
          </section>

          <ClusterBreakdown pages={model.pages} />

          <PagesOutsideRadius rows={sortedOutside} sortKey={sortKey} sortDir={sortDir} onSort={handleSort} onExport={() => exportCsv(sortedOutside)} />
        </main>
      </div>
    </div>
  );
}

function KpiCard({ label, value, detail, trend, trendType, neutral }: { label: string; value: string; detail: string; trend: string; trendType: "up" | "down"; neutral?: boolean }) {
  const TrendIcon = trendType === "up" ? ArrowUpRight : ArrowDownRight;
  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className={`mt-3 font-mono text-3xl font-bold tabular-nums ${neutral ? "text-foreground" : "text-primary"}`}>{value}</p>
      <div className="mt-3 flex items-center justify-between gap-3">
        <span className="text-sm text-muted-foreground">{detail}</span>
        <span className={`inline-flex items-center gap-1 font-mono text-xs font-bold tabular-nums ${trendType === "up" ? "text-primary" : "text-destructive"}`}><TrendIcon className="h-3.5 w-3.5" />{trend}</span>
      </div>
    </div>
  );
}

function TopicalMapPanel({ pages, centroid, selectedUrl, mapMode, angle, onAngleChange, onSelect, onMapMode }: { pages: DerivedPage[]; centroid: [number, number, number]; selectedUrl: string; mapMode: MapMode; angle: { x: number; y: number }; onAngleChange: (angle: { x: number; y: number }) => void; onSelect: (url: string) => void; onMapMode: (mode: MapMode) => void }) {
  return (
    <section className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Topical map</p>
          <h2 className="mt-1 text-lg font-semibold">Where topical drift creates revenue risk</h2>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Legend />
          {mapMode === "2d" ? (
            <button type="button" onClick={() => onMapMode("3d")} className="inline-flex items-center gap-2 rounded-md border border-border bg-surface px-3 py-1.5 text-xs font-semibold hover:bg-card"><Orbit className="h-3.5 w-3.5" /> Switch to 3D View</button>
          ) : (
            <>
              <button type="button" onClick={() => onAngleChange({ x: 58, y: 34 })} className="inline-flex items-center gap-2 rounded-md border border-border bg-surface px-3 py-1.5 text-xs font-semibold hover:bg-card"><RefreshCcw className="h-3.5 w-3.5" /> Reset view</button>
              <button type="button" onClick={() => onMapMode("2d")} className="inline-flex items-center gap-2 rounded-md border border-border bg-surface px-3 py-1.5 text-xs font-semibold hover:bg-card"><Eye className="h-3.5 w-3.5" /> Back to 2D</button>
            </>
          )}
        </div>
      </div>
      <div className="relative h-[520px] overflow-hidden rounded-lg border border-border bg-background/45">
        {mapMode === "2d" ? <Scatter2D pages={pages} selectedUrl={selectedUrl} onSelect={onSelect} /> : <Scatter3D pages={pages} centroid={centroid} selectedUrl={selectedUrl} angle={angle} onAngleChange={onAngleChange} onSelect={onSelect} />}
      </div>
    </section>
  );
}

function Scatter2D({ pages, selectedUrl, onSelect }: { pages: DerivedPage[]; selectedUrl: string; onSelect: (url: string) => void }) {
  return (
    <svg viewBox="0 0 900 520" className="h-full w-full" role="img" aria-label="Topical authority scatter plot">
      <defs>
        <radialGradient id="siteRadius" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="var(--primary)" stopOpacity="0.08" /><stop offset="100%" stopColor="var(--primary)" stopOpacity="0" /></radialGradient>
      </defs>
      <rect x="0" y="0" width="900" height="520" fill="transparent" />
      <circle cx="450" cy="260" r="210" fill="url(#siteRadius)" stroke="var(--border)" strokeDasharray="7 7" />
      <circle cx="450" cy="260" r="8" fill="var(--primary)" />
      <text x="466" y="255" className="fill-muted-foreground text-[11px] font-mono">site centroid</text>
      {["Intercity routes", "City hubs", "POI pages", "Travel guides"].map((label, index) => (
        <text key={label} x={[512, 330, 705, 665][index]} y={[184, 170, 82, 392][index]} className="fill-muted-foreground text-[11px] font-mono">{label}</text>
      ))}
      {pages.map((page) => <ScatterPoint key={page.url} page={page} selected={page.url === selectedUrl} onSelect={onSelect} />)}
    </svg>
  );
}

function ScatterPoint({ page, selected, onSelect }: { page: DerivedPage; selected: boolean; onSelect: (url: string) => void }) {
  const cx = 450 + page.x * 300;
  const cy = 260 - page.y * 230;
  const size = 8 + Math.sqrt(page.currentRevenue) / 42;
  return (
    <g className="cursor-pointer" onClick={() => onSelect(page.url)}>
      <title>{`${page.url}\nRevenue: ${formatMoney(page.currentRevenue)}\nRadius score: ${page.radiusScore}\nPage type: ${page.pageType}`}</title>
      {selected && <circle cx={cx} cy={cy} r={size + 8} fill="none" stroke="var(--ring)" strokeWidth="2" />}
      <circle cx={cx} cy={cy} r={size} fill={segmentMeta[page.segment].fill} opacity={0.35 + page.confidence * 0.55} stroke="var(--background)" strokeWidth="2" />
    </g>
  );
}

function Scatter3D({ pages, selectedUrl, angle, onAngleChange, onSelect }: { pages: DerivedPage[]; centroid: [number, number, number]; selectedUrl: string; angle: { x: number; y: number }; onAngleChange: (angle: { x: number; y: number }) => void; onSelect: (url: string) => void }) {
  const [dragStart, setDragStart] = useState<{ x: number; y: number; ax: number; ay: number } | null>(null);
  const projected = pages.map((page) => ({ page, point: project3d(page.x, page.y, page.currentRevenue / 180000, angle) })).sort((a, b) => a.point.depth - b.point.depth);
  const riskPages = projected.filter(({ page }) => page.segment === "Off-Topic").sort((a, b) => b.page.currentRevenue - a.page.currentRevenue).slice(0, 3);
  return (
    <div
      className="relative h-full w-full cursor-grab overflow-hidden bg-[radial-gradient(circle_at_50%_18%,var(--primary)_0%,transparent_32%),linear-gradient(180deg,var(--card)_0%,var(--background)_100%)] active:cursor-grabbing"
      onPointerDown={(event) => setDragStart({ x: event.clientX, y: event.clientY, ax: angle.x, ay: angle.y })}
      onPointerMove={(event) => {
        if (!dragStart) return;
        onAngleChange({ x: Math.max(35, Math.min(75, dragStart.ax + (event.clientY - dragStart.y) * 0.2)), y: dragStart.ay + (event.clientX - dragStart.x) * 0.25 });
      }}
      onPointerUp={() => setDragStart(null)}
      onPointerLeave={() => setDragStart(null)}
    >
      <svg viewBox="0 0 900 520" className="h-full w-full" role="img" aria-label="3D topical map with revenue height">
        <defs>
          <filter id="premiumGlow" x="-80%" y="-80%" width="260%" height="260%"><feGaussianBlur stdDeviation="8" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
          <linearGradient id="revenuePillar" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="var(--primary)" stopOpacity="0.85" /><stop offset="100%" stopColor="var(--primary)" stopOpacity="0.08" /></linearGradient>
          <radialGradient id="floorGlow" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="var(--primary)" stopOpacity="0.18" /><stop offset="100%" stopColor="var(--primary)" stopOpacity="0" /></radialGradient>
        </defs>
        <ellipse cx="450" cy="392" rx="330" ry="86" fill="url(#floorGlow)" />
        {[0, 1, 2, 3, 4].map((row) => <path key={`row-${row}`} d={`M ${220 + row * 44} ${418 - row * 26} L ${708 - row * 34} ${418 - row * 26}`} stroke="var(--border)" strokeOpacity="0.45" />)}
        {[0, 1, 2, 3, 4, 5].map((col) => <path key={`col-${col}`} d={`M ${258 + col * 72} 430 L ${358 + col * 38} 246`} stroke="var(--border)" strokeOpacity="0.28" />)}
        <ellipse cx="450" cy="360" rx="185" ry="58" fill="none" stroke="var(--primary)" strokeOpacity="0.42" strokeDasharray="7 7" />
        <ellipse cx="450" cy="360" rx="292" ry="92" fill="none" stroke="var(--destructive)" strokeOpacity="0.28" strokeDasharray="10 8" />
        <line x1="450" y1="122" x2="450" y2="412" stroke="var(--primary)" strokeOpacity="0.45" strokeDasharray="6 6" />
        <text x="470" y="132" className="fill-primary text-[11px] font-mono">revenue altitude</text>
        <text x="642" y="308" className="fill-destructive text-[11px] font-mono">risk frontier</text>
        {projected.map(({ page, point }) => {
          const selected = page.url === selectedUrl;
          const radius = 8 + Math.sqrt(page.currentRevenue) / 58;
          const baseY = 404 - point.depth * 20;
          return (
            <g key={page.url} className="cursor-pointer" onClick={() => onSelect(page.url)}>
              <title>{`${page.url}\nRevenue: ${formatMoney(page.currentRevenue)}\nRadius score: ${page.radiusScore}\nPage type: ${page.pageType}`}</title>
              <ellipse cx={point.x} cy={baseY} rx={radius * 1.45} ry={radius * 0.45} fill={segmentMeta[page.segment].fill} opacity="0.16" />
              <line x1={point.x} y1={baseY} x2={point.x} y2={point.y} stroke={page.segment === "Core Topic" ? "url(#revenuePillar)" : segmentMeta[page.segment].fill} strokeWidth={Math.max(2, radius / 4)} strokeOpacity={page.segment === "Off-Topic" ? 0.7 : 0.42} />
              {page.segment === "Off-Topic" && <circle cx={point.x} cy={point.y} r={radius + 14} fill={segmentMeta[page.segment].fill} opacity="0.12" filter="url(#premiumGlow)" />}
              {selected && <circle cx={point.x} cy={point.y} r={radius + 10} fill="none" stroke="var(--ring)" strokeWidth="2.5" filter="url(#premiumGlow)" />}
              <circle cx={point.x} cy={point.y} r={radius} fill={segmentMeta[page.segment].fill} opacity={0.42 + page.confidence * 0.5} stroke="var(--background)" strokeWidth="2.5" filter={selected || page.segment === "Off-Topic" ? "url(#premiumGlow)" : undefined} />
            </g>
          );
        })}
        {riskPages.map(({ page, point }) => <g key={`label-${page.url}`} className="pointer-events-none"><path d={`M ${point.x + 12} ${point.y - 10} L ${point.x + 74} ${point.y - 34}`} stroke="var(--destructive)" strokeOpacity="0.55" /><rect x={point.x + 76} y={point.y - 50} width="128" height="34" rx="6" fill="var(--card)" stroke="var(--destructive)" strokeOpacity="0.35" /><text x={point.x + 86} y={point.y - 36} className="fill-destructive text-[10px] font-mono">{formatMoney(page.currentRevenue)} at risk</text><text x={point.x + 86} y={point.y - 24} className="fill-muted-foreground text-[9px]">radius {page.radiusScore}</text></g>)}
      </svg>
      <div className="absolute left-4 top-4 rounded-lg border border-border bg-card/90 px-4 py-3 shadow-xl backdrop-blur"><p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Advanced view</p><p className="mt-1 text-sm font-semibold">Revenue rises vertically; drift expands outward.</p></div>
      <div className="absolute bottom-4 left-4 inline-flex items-center gap-2 rounded-md border border-border bg-card/90 px-3 py-2 text-xs text-muted-foreground shadow-sm"><MousePointer2 className="h-3.5 w-3.5" /> Drag to orbit · no auto-rotation</div>
    </div>
  );
}

function PageDetailPanel({ page, onClose }: { page: DerivedPage; onClose: () => void }) {
  return (
    <aside className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Selected page</p>
          <h2 className="mt-1 break-all font-mono text-sm font-bold leading-relaxed">{page.url}</h2>
        </div>
        <button type="button" onClick={onClose} className="rounded-md border border-border bg-surface p-1.5 text-muted-foreground hover:text-foreground"><X className="h-3.5 w-3.5" /></button>
      </div>
      <div className="mt-5 grid grid-cols-2 gap-3">
        <Metric label="Revenue" value={formatMoney(page.currentRevenue)} tone="positive" />
        <Metric label="Potential" value={formatMoney(page.potentialRevenue)} tone="positive" />
        <Metric label="Radius" value={`${page.radiusScore}`} tone={page.segment === "Off-Topic" ? "risk" : "neutral"} />
        <Metric label="Confidence" value={`${Math.round(page.confidence * 100)}%`} />
      </div>
      <div className="mt-5 rounded-lg border border-border bg-surface/40 p-4">
        <p className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Diagnosis</p>
        <p className="mt-2 text-sm text-muted-foreground"><span className={`font-semibold ${segmentMeta[page.segment].tone}`}>{page.segment}</span> page in the <span className="text-foreground">{page.cluster}</span> cluster. It represents <span className="font-mono text-primary">{formatMoney(page.authorityLoss)}</span> of recoverable revenue impact.</p>
      </div>
      <div className="mt-4 rounded-lg border border-primary/20 bg-primary/10 p-4">
        <p className="text-xs font-mono uppercase tracking-wider text-primary">Recommended action</p>
        <p className="mt-2 text-sm font-semibold">{page.action}</p>
      </div>
    </aside>
  );
}

function LeakageBreakdown({ rows }: { rows: ReturnType<typeof buildTopicalModel>["breakdown"] }) {
  return (
    <section className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <div className="mb-4 flex items-start justify-between gap-3"><div><p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Authority leakage breakdown</p><h2 className="mt-1 text-lg font-semibold">How lack of focus impacts revenue</h2></div><TriangleAlert className="h-5 w-5 text-destructive" /></div>
      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full min-w-[760px] border-collapse text-left text-sm">
          <thead className="bg-surface/70 text-[10px] font-mono uppercase tracking-wider text-muted-foreground"><tr><Th>Segment</Th><Th>Pages</Th><Th>Revenue</Th><Th>Authority Loss</Th><Th>Opportunity</Th></tr></thead>
          <tbody>{rows.map((row) => <tr key={row.segment} className="border-t border-border"><Td><span className={`font-semibold ${segmentMeta[row.segment].tone}`}>{row.segment}</span></Td><Td mono>{row.pages}</Td><Td mono>{formatMoney(row.revenue)}</Td><Td>{segmentMeta[row.segment].loss}</Td><Td mono className="font-bold text-primary">{row.opportunity > 0 ? formatMoney(row.opportunity) : "—"}</Td></tr>)}</tbody>
        </table>
      </div>
    </section>
  );
}

function ActionLayer() {
  return (
    <section className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Revenue-backed actions</p>
      <h2 className="mt-1 text-lg font-semibold">What to do next</h2>
      <div className="mt-4 space-y-3">{ACTIONS.map((action) => <div key={action.title} className="rounded-lg border border-border bg-surface/40 p-4"><div className="flex items-start justify-between gap-3"><div><p className="font-semibold">{action.title}</p><p className="mt-1 text-sm text-muted-foreground">{action.detail}</p></div><p className="font-mono text-lg font-bold text-primary">+{formatMoney(action.impact)}</p></div><div className="mt-3 flex flex-wrap gap-2 text-xs"><span className="rounded-md border border-border bg-card px-2 py-1">Effort: {action.effort}</span><span className="rounded-md border border-border bg-card px-2 py-1 font-mono">Confidence: {action.confidence}%</span></div></div>)}</div>
    </section>
  );
}

function RadiusDistribution({ pages }: { pages: DerivedPage[] }) {
  const buckets = [
    { bucket: "0–30", pages: pages.filter((p) => p.radiusScore <= 30).length },
    { bucket: "31–60", pages: pages.filter((p) => p.radiusScore > 30 && p.radiusScore <= 60).length },
    { bucket: "61–80", pages: pages.filter((p) => p.radiusScore > 60 && p.radiusScore <= 80).length },
    { bucket: "81–100", pages: pages.filter((p) => p.radiusScore > 80).length },
  ];
  return <section className="rounded-xl border border-border bg-card p-5 shadow-sm"><p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Radius distribution</p><h2 className="mt-1 text-lg font-semibold">How far pages drift from the centroid</h2><div className="mt-4 h-[260px]"><ResponsiveContainer width="100%" height="100%"><BarChart data={buckets}><CartesianGrid stroke="var(--border)" vertical={false} /><XAxis dataKey="bucket" tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} axisLine={false} tickLine={false} /><YAxis tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} axisLine={false} tickLine={false} /><Tooltip cursor={{ fill: "var(--surface)" }} content={<SimpleTooltip />} /><Bar dataKey="pages" fill="var(--primary)" radius={[6, 6, 0, 0]} /></BarChart></ResponsiveContainer></div></section>;
}

function ClusterBreakdown({ pages }: { pages: DerivedPage[] }) {
  const clusters = [...new Set(pages.map((page) => page.cluster))].map((cluster) => ({ cluster, pages: pages.filter((page) => page.cluster === cluster).length, revenue: pages.filter((page) => page.cluster === cluster).reduce((sum, page) => sum + page.currentRevenue, 0) })).sort((a, b) => b.revenue - a.revenue);
  return <section className="rounded-xl border border-border bg-card p-5 shadow-sm"><p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Cluster breakdown</p><h2 className="mt-1 text-lg font-semibold">Topic clusters by revenue</h2><div className="mt-4 space-y-3">{clusters.map((cluster) => <div key={cluster.cluster} className="rounded-lg border border-border bg-surface/40 p-3"><div className="flex items-center justify-between gap-3"><p className="text-sm font-semibold">{cluster.cluster}</p><p className="font-mono text-sm font-bold text-primary">{formatMoney(cluster.revenue)}</p></div><p className="mt-1 text-xs text-muted-foreground">{cluster.pages} pages · internal linking overlay ready</p></div>)}</div></section>;
}

function PagesOutsideRadius({ rows, sortKey, sortDir, onSort, onExport }: { rows: DerivedPage[]; sortKey: SortKey; sortDir: "asc" | "desc"; onSort: (key: SortKey) => void; onExport: () => void }) {
  return (
    <section className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between"><div><p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Pages outside radius</p><h2 className="mt-1 text-lg font-semibold">URL-level drift priorities</h2></div><button type="button" onClick={onExport} className="inline-flex items-center gap-2 rounded-md border border-border bg-surface px-3 py-1.5 text-xs font-semibold hover:bg-card"><Download className="h-3.5 w-3.5" /> Export all rows</button></div>
      <div className="overflow-x-auto rounded-lg border border-border"><table className="w-full min-w-[1080px] border-collapse text-left text-sm"><thead className="bg-surface/70 text-[10px] font-mono uppercase tracking-wider text-muted-foreground"><tr><SortTh label="URL" active={sortKey === "url"} dir={sortDir} onClick={() => onSort("url")} /><SortTh label="Radius score" active={sortKey === "radiusScore"} dir={sortDir} onClick={() => onSort("radiusScore")} /><SortTh label="Topic cluster" active={sortKey === "cluster"} dir={sortDir} onClick={() => onSort("cluster")} /><SortTh label="Current revenue" active={sortKey === "currentRevenue"} dir={sortDir} onClick={() => onSort("currentRevenue")} /><SortTh label="Potential revenue" active={sortKey === "potentialRevenue"} dir={sortDir} onClick={() => onSort("potentialRevenue")} /><Th>Recommended action</Th></tr></thead><tbody>{rows.map((row) => <tr key={row.url} className="border-t border-border align-top transition-colors hover:bg-surface/35"><Td><div className="flex items-center gap-2"><Search className="h-3.5 w-3.5 shrink-0 text-muted-foreground" /><span className="font-mono text-xs font-semibold">{row.url}</span></div><p className="mt-1 text-xs text-muted-foreground">{row.pageType} · {row.segment}</p></Td><Td mono className={row.segment === "Off-Topic" ? "font-bold text-destructive" : "font-bold"}>{row.radiusScore}</Td><Td>{row.cluster}</Td><Td mono>{formatMoney(row.currentRevenue)}</Td><Td mono className="font-bold text-primary">{formatMoney(row.potentialRevenue)}</Td><Td><span className="inline-flex items-center gap-1 rounded-md border border-border bg-surface/60 px-2 py-1 text-xs font-semibold"><Target className="h-3 w-3 text-primary" />{row.action}</span></Td></tr>)}</tbody></table></div>
    </section>
  );
}

function Legend() {
  return <div className="hidden items-center gap-3 text-xs text-muted-foreground lg:flex">{segmentOrder.map((segment) => <span key={segment} className="inline-flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: segmentMeta[segment].fill }} />{segmentMeta[segment].label}</span>)}</div>;
}

function Metric({ label, value, tone = "neutral" }: { label: string; value: string; tone?: "neutral" | "positive" | "risk" }) {
  return <div className="rounded-lg border border-border bg-surface/40 p-3"><p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">{label}</p><p className={`mt-1 font-mono text-sm font-bold tabular-nums ${tone === "positive" ? "text-primary" : tone === "risk" ? "text-destructive" : "text-foreground"}`}>{value}</p></div>;
}

function SortTh({ label, active, dir, onClick }: { label: string; active: boolean; dir: "asc" | "desc"; onClick: () => void }) {
  return <th className="px-3 py-3 font-medium"><button type="button" onClick={onClick} className={`inline-flex items-center gap-1 ${active ? "text-primary" : "hover:text-foreground"}`}>{label}<ChevronDown className={`h-3 w-3 transition-transform ${active && dir === "asc" ? "rotate-180" : ""}`} /></button></th>;
}

function Th({ children }: { children: React.ReactNode }) {
  return <th className="px-3 py-3 font-medium">{children}</th>;
}

function Td({ children, mono, className = "" }: { children: React.ReactNode; mono?: boolean; className?: string }) {
  return <td className={`px-3 py-3 ${mono ? "font-mono text-xs tabular-nums" : ""} ${className}`}>{children}</td>;
}

function SimpleTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number }>; label?: string }) {
  if (!active || !payload?.length) return null;
  return <div className="rounded-lg border border-border bg-card px-3 py-2 text-xs shadow-xl"><p className="font-mono font-bold">{label}</p><p className="text-muted-foreground">Pages: {payload[0].value}</p></div>;
}

function buildTopicalModel(pages: PageEmbedding[]) {
  const centroid = averageEmbedding(pages);
  const distances = pages.map((page) => distance(page.embedding, centroid));
  const maxDistance = Math.max(...distances);
  const derived = pages.map((page, index) => {
    const radiusScore = Math.round((distances[index] / maxDistance) * 100);
    const segment: Segment = radiusScore <= 34 ? "Core Topic" : radiusScore <= 68 ? "Adjacent" : "Off-Topic";
    return { ...page, x: page.embedding[0] - centroid[0], y: page.embedding[1] - centroid[1], z: page.embedding[2] - centroid[2], distance: distances[index], radiusScore, segment, authorityLoss: Math.max(0, page.potentialRevenue - page.currentRevenue) };
  });
  const variance = distances.reduce((sum, current) => sum + Math.pow(current - distances.reduce((a, b) => a + b, 0) / distances.length, 2), 0) / distances.length;
  const siteFocusScore = Math.max(0, Math.round(100 - variance * 420));
  const outside = derived.filter((page) => page.segment !== "Core Topic");
  const breakdown = segmentOrder.map((segment) => {
    const segmentPages = derived.filter((page) => page.segment === segment);
    return { segment, pages: segmentPages.length, revenue: segmentPages.reduce((sum, page) => sum + page.currentRevenue, 0), opportunity: segmentPages.reduce((sum, page) => sum + page.authorityLoss, 0) };
  });
  return { pages: derived, centroid, siteFocusScore, outsideRadiusPct: Math.round((outside.length / derived.length) * 100), revenueAtRisk: outside.reduce((sum, page) => sum + page.currentRevenue, 0), recoverableRevenue: outside.reduce((sum, page) => sum + page.authorityLoss, 0), breakdown };
}

function averageEmbedding(pages: PageEmbedding[]): [number, number, number] {
  const totals = pages.reduce<[number, number, number]>((sum, page) => [sum[0] + page.embedding[0], sum[1] + page.embedding[1], sum[2] + page.embedding[2]], [0, 0, 0]);
  return [totals[0] / pages.length, totals[1] / pages.length, totals[2] / pages.length];
}

function distance(a: [number, number, number], b: [number, number, number]) {
  return Math.sqrt(Math.pow(a[0] - b[0], 2) + Math.pow(a[1] - b[1], 2) + Math.pow(a[2] - b[2], 2));
}

function project3d(x: number, y: number, z: number, angle: { x: number; y: number }) {
  const yaw = (angle.y * Math.PI) / 180;
  const pitch = (angle.x * Math.PI) / 180;
  const rx = x * Math.cos(yaw) - y * Math.sin(yaw);
  const ry = x * Math.sin(yaw) + y * Math.cos(yaw);
  const rz = z * Math.cos(pitch) - ry * Math.sin(pitch);
  return { x: 450 + rx * 260, y: 380 - rz * 130, depth: ry };
}

function sortPages(rows: DerivedPage[], key: SortKey, dir: "asc" | "desc") {
  return [...rows].sort((a, b) => {
    const av = a[key];
    const bv = b[key];
    const result = typeof av === "number" && typeof bv === "number" ? av - bv : String(av).localeCompare(String(bv));
    return dir === "asc" ? result : -result;
  });
}

function formatMoney(value: number) {
  return `£${Math.round(value / 1000)}K`;
}

function exportCsv(rows: readonly DerivedPage[]) {
  const headers = ["URL", "Radius score", "Topic cluster", "Segment", "Current revenue", "Potential revenue", "Revenue opportunity", "Confidence", "Recommended action"];
  const body = rows.map((row) => [row.url, row.radiusScore, row.cluster, row.segment, row.currentRevenue, row.potentialRevenue, row.authorityLoss, `${Math.round(row.confidence * 100)}%`, row.action]);
  const csv = [headers, ...body].map((cells) => cells.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")).join("\n");
  const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8;" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = "site-focus-pages-outside-radius.csv";
  link.click();
  URL.revokeObjectURL(url);
}
