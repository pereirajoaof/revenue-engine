import {
  Building2,
  Coins,
  LayoutGrid,
  Tag,
  Globe2,
  RefreshCw,
  AlertTriangle,
} from "lucide-react";
import { useState } from "react";
import { SectionCard } from "./SectionCard";
import { PropertyIdentitySection } from "./sections/PropertyIdentitySection";
import { EconomicsSection } from "./sections/EconomicsSection";
import { PageTypesSection } from "./sections/PageTypesSection";
import { BrandKeywordsSection } from "./sections/BrandKeywordsSection";
import { MarketsSection } from "./sections/MarketsSection";
import { RecalculationSection } from "./sections/RecalculationSection";
import { DangerZoneSection } from "./sections/DangerZoneSection";

const NAV = [
  { id: "identity", label: "Property & Identity", icon: Building2 },
  { id: "economics", label: "Economics", icon: Coins },
  { id: "pageTypes", label: "Page Types", icon: LayoutGrid },
  { id: "brand", label: "Brand Keywords", icon: Tag },
  { id: "markets", label: "Markets", icon: Globe2 },
  { id: "recalc", label: "Recalculation", icon: RefreshCw },
  { id: "danger", label: "Danger Zone", icon: AlertTriangle },
] as const;

interface Props {
  dirty: Set<string>;
  markDirty: (section: string) => void;
}

export function SettingsPage({ dirty, markDirty }: Props) {
  const [active, setActive] = useState<string>("identity");

  const handleScrollTo = (id: string) => {
    setActive(id);
    const el = document.getElementById(`section-${id}`);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Intro */}
      <div className="mb-8 max-w-2xl">
        <p className="text-sm text-muted-foreground leading-relaxed">
          Configure how OrganicOS reads your data, calculates revenue, and prioritises opportunities.
          Most changes require a re-run to update historical numbers.
        </p>
      </div>

      {/* Layout: sticky sub-nav + sections */}
      <div className="grid grid-cols-1 lg:grid-cols-[200px_1fr] gap-8">
        {/* Sub-nav */}
        <aside className="hidden lg:block">
          <nav className="sticky top-20 space-y-1">
            <p className="px-2 py-1 text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-1">
              On this page
            </p>
            {NAV.map((item) => {
              const Icon = item.icon;
              const isActive = active === item.id;
              const isDirty = dirty.has(item.id);
              const isDanger = item.id === "danger";
              return (
                <button
                  key={item.id}
                  onClick={() => handleScrollTo(item.id)}
                  className={`w-full flex items-center gap-2.5 px-2 py-2 rounded-md text-sm transition-colors text-left ${
                    isActive
                      ? "bg-surface text-foreground border border-border"
                      : "text-muted-foreground hover:text-foreground hover:bg-surface/60"
                  } ${isDanger ? "text-destructive/80 hover:text-destructive" : ""}`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className="truncate flex-1">{item.label}</span>
                  {isDirty && <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />}
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Sections */}
        <div className="space-y-6 min-w-0">
          <SectionCard
            id="section-identity"
            icon={<Building2 className="w-4 h-4" />}
            title="Property & Identity"
            description="Where the data comes from and how this project is named."
          >
            <PropertyIdentitySection onDirty={() => markDirty("identity")} />
          </SectionCard>

          <SectionCard
            id="section-economics"
            icon={<Coins className="w-4 h-4" />}
            title="Economics"
            description="Conversion rate, order value, currency, and business model. Drives every revenue calculation."
          >
            <EconomicsSection onDirty={() => markDirty("economics")} />
          </SectionCard>

          <SectionCard
            id="section-pageTypes"
            icon={<LayoutGrid className="w-4 h-4" />}
            title="Page Types"
            description="Group URLs into types so each can have its own CVR and AOV."
          >
            <PageTypesSection onDirty={() => markDirty("pageTypes")} />
          </SectionCard>

          <SectionCard
            id="section-brand"
            icon={<Tag className="w-4 h-4" />}
            title="Brand Keywords"
            description="The branded vs non-branded split underpins every revenue calculation. Keep this accurate."
          >
            <BrandKeywordsSection onDirty={() => markDirty("brand")} />
          </SectionCard>

          <SectionCard
            id="section-markets"
            icon={<Globe2 className="w-4 h-4" />}
            title="Markets"
            description="Primary markets affect CTR benchmarks and demand calculations."
          >
            <MarketsSection onDirty={() => markDirty("markets")} />
          </SectionCard>

          <SectionCard
            id="section-recalc"
            icon={<RefreshCw className="w-4 h-4" />}
            title="Recalculation"
            description="Apply your settings changes to historical data."
            accent="primary"
          >
            <RecalculationSection hasUnsaved={dirty.size > 0} />
          </SectionCard>

          <SectionCard
            id="section-danger"
            icon={<AlertTriangle className="w-4 h-4" />}
            title="Danger Zone"
            description="Irreversible actions."
            accent="danger"
          >
            <DangerZoneSection />
          </SectionCard>
        </div>
      </div>
    </div>
  );
}
