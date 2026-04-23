import { useState } from "react";
import { Check, ExternalLink, RefreshCw } from "lucide-react";
import { Field } from "../Field";

interface Props {
  onDirty: () => void;
}

export function PropertyIdentitySection({ onDirty }: Props) {
  const [name, setName] = useState("Acme — UK store");
  const [ga4, setGa4] = useState("GA4 — acme.com (245791234)");

  return (
    <div className="space-y-6">
      <Field label="Project name" hint="Shown in the sidebar and reports.">
        <input
          type="text"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            onDirty();
          }}
          className="w-full max-w-md px-3 py-2 rounded-lg border border-border bg-background text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        />
      </Field>

      <Field
        label="Search Console property"
        hint="The GSC property is the source of truth for clicks, impressions, and queries. Changing it would invalidate all historical analysis — to use a different property, create a new project."
        locked
        lockedReason="Changing this breaks all historical data"
      >
        <div className="flex items-center gap-2 max-w-md">
          <div className="flex-1 px-3 py-2 rounded-lg border border-border bg-surface/40 text-sm font-mono text-muted-foreground flex items-center gap-2">
            <Check className="w-3.5 h-3.5 text-success shrink-0" />
            sc-domain:acme.com
          </div>
          <a
            href="https://search.google.com/search-console"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
          >
            Open <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </Field>

      <Field
        label="Google Analytics 4 property"
        hint="Used to pull conversion rate and order value. Switch if you've moved to a new GA4 property."
      >
        <div className="flex items-center gap-2 max-w-md flex-wrap">
          <select
            value={ga4}
            onChange={(e) => {
              setGa4(e.target.value);
              onDirty();
            }}
            className="flex-1 min-w-[240px] px-3 py-2 rounded-lg border border-border bg-background text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option>GA4 — acme.com (245791234)</option>
            <option>GA4 — shop.acme.com (314225001)</option>
            <option>GA4 — acme-blog.com (412009881)</option>
          </select>
          <button className="inline-flex items-center gap-1.5 text-xs px-3 py-2 rounded-lg border border-border hover:bg-surface text-muted-foreground hover:text-foreground transition-colors">
            <RefreshCw className="w-3 h-3" /> Re-auth
          </button>
        </div>
      </Field>
    </div>
  );
}
