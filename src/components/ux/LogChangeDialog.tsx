import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { PAGE_OPTIONS } from "./data";
import { useUx } from "./state";

const TYPES = ["Content", "Layout", "Speed", "Offer or pricing", "Tracking", "Other"];

export function LogChangeDialog() {
  const { logOpen, setLogOpen, logPrefill, addChange } = useUx();
  const [pages, setPages] = useState<string[]>([]);
  const [type, setType] = useState("Layout");
  const [desc, setDesc] = useState("");
  const [date, setDate] = useState("2026-10-06");
  const [random, setRandom] = useState(false);

  useEffect(() => {
    if (logOpen) setPages(logPrefill);
  }, [logOpen, logPrefill]);

  const submit = () => {
    if (!pages.length || !desc.trim()) {
      toast.error("Pick at least one page and describe the change");
      return;
    }
    const d = new Date(date);
    addChange({
      id: `c-${Date.now()}`,
      title: desc.trim(),
      type,
      pages,
      shipped: d.toLocaleDateString("en-GB", { day: "numeric", month: "short", timeZone: "UTC" }),
      randomised: random,
      result: null,
    });
    toast.success("Change logged — it will appear as a pin on the score trajectory");
    setLogOpen(false);
    setDesc("");
  };

  const field = "w-full rounded-md border border-border bg-surface px-3 py-2 text-sm";
  return (
    <Dialog open={logOpen} onOpenChange={setLogOpen}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Log a change</DialogTitle>
          <DialogDescription>We compare changed pages with unchanged similar pages once 4 complete weeks are in.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <p className="mb-1.5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Pages</p>
            <div className="flex flex-wrap gap-1.5">
              {PAGE_OPTIONS.map((p) => {
                const on = pages.includes(p);
                return (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPages((s) => (on ? s.filter((x) => x !== p) : [...s, p]))}
                    className={`rounded-sm border px-2 py-1 font-mono text-[11px] ${
                      on ? "border-primary/50 bg-primary/10 text-primary" : "border-border text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {p}
                  </button>
                );
              })}
            </div>
          </div>
          <div>
            <p className="mb-1.5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Change type</p>
            <select value={type} onChange={(e) => setType(e.target.value)} className={field}>
              {TYPES.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
            {type === "Tracking" && (
              <p className="mt-1.5 text-xs text-chart-4">Tag or consent changes move these numbers without any UX change.</p>
            )}
          </div>
          <label className="block">
            <span className="mb-1.5 block font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Description</span>
            <textarea value={desc} onChange={(e) => setDesc(e.target.value)} rows={3} className={field} placeholder="What changed, in a sentence" />
          </label>
          <label className="block">
            <span className="mb-1.5 block font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Shipped date</span>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className={`${field} font-mono`} />
          </label>
          <label className="flex items-start gap-2 text-sm">
            <input type="checkbox" checked={random} onChange={(e) => setRandom(e.target.checked)} className="mt-1" />
            Pages were randomly assigned to change vs control
          </label>
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={() => setLogOpen(false)} className="rounded-md border border-border px-3 py-2 text-sm">
              Cancel
            </button>
            <button type="button" onClick={submit} className="rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground">
              Log change
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
