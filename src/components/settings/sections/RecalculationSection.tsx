import { useState } from "react";
import { RefreshCw, Clock, CheckCircle2, AlertCircle } from "lucide-react";
import { toast } from "sonner";

interface Props {
  hasUnsaved: boolean;
}

export function RecalculationSection({ hasUnsaved }: Props) {
  const [running, setRunning] = useState(false);
  const [lastRun, setLastRun] = useState("2 hours ago");

  const run = () => {
    if (hasUnsaved) {
      toast.error("Save your changes first", {
        description: "Recalculation uses saved settings.",
      });
      return;
    }
    setRunning(true);
    toast.info("Re-running analysis", {
      description: "This usually takes 3–5 minutes. We'll notify you when done.",
    });
    setTimeout(() => {
      setRunning(false);
      setLastRun("just now");
      toast.success("Analysis complete", {
        description: "Dashboard now reflects your latest settings.",
      });
    }, 3000);
  };

  return (
    <div className="space-y-4">
      <div className="rounded-lg bg-surface/40 border border-border px-4 py-3 grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
        <div>
          <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-1">Last run</p>
          <p className="font-medium flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-muted-foreground" />
            {lastRun}
          </p>
        </div>
        <div>
          <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-1">Pages analysed</p>
          <p className="font-mono">1,691</p>
        </div>
        <div>
          <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-1">Status</p>
          <p className="font-medium flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-success" />
            Up to date
          </p>
        </div>
      </div>

      <div>
        <p className="text-sm leading-relaxed mb-3">
          A re-run pulls fresh GSC + GA4 data, applies your current page-type rules, brand keywords, and economics
          settings, and recalculates revenue, potential, and gap for every URL.
        </p>
        <ul className="text-xs text-muted-foreground space-y-1 mb-4 ml-4 list-disc">
          <li>Typical duration: <span className="font-mono text-foreground">3–5 minutes</span></li>
          <li>Historical data is replaced — previous calculations are not preserved</li>
          <li>You can keep using the dashboard while it runs</li>
        </ul>
      </div>

      {hasUnsaved && (
        <div className="rounded-lg border border-warning/30 bg-warning/5 px-3 py-2.5 flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 text-warning shrink-0 mt-0.5" />
          <p className="text-xs text-foreground/80 leading-relaxed">
            You have unsaved changes. Save them before running analysis, or they won't be applied.
          </p>
        </div>
      )}

      <button
        onClick={run}
        disabled={running}
        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-60 disabled:cursor-not-allowed"
      >
        <RefreshCw className={`w-4 h-4 ${running ? "animate-spin" : ""}`} />
        {running ? "Running analysis…" : "Save & Re-run analysis"}
      </button>
    </div>
  );
}
