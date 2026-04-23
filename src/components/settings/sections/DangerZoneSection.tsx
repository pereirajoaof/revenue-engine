import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const CONFIRM_PHRASE = "delete acme — uk store";

export function DangerZoneSection() {
  const navigate = useNavigate();
  const [confirm, setConfirm] = useState("");
  const [open, setOpen] = useState(false);

  const handleDelete = () => {
    setOpen(false);
    setConfirm("");
    toast.success("Project deleted", {
      description: "All data has been permanently removed.",
    });
    navigate({ to: "/" });
  };

  const canDelete = confirm.trim().toLowerCase() === CONFIRM_PHRASE;

  return (
    <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-4 flex items-start justify-between gap-4 flex-wrap">
      <div className="min-w-0 flex-1">
        <h3 className="text-sm font-semibold text-foreground mb-1">Delete project</h3>
        <p className="text-xs text-muted-foreground leading-relaxed max-w-md">
          Permanently delete this project and all associated data: page types, opportunities, historical analyses,
          and connections. This cannot be undone.
        </p>
      </div>

      <AlertDialog
        open={open}
        onOpenChange={(v) => {
          setOpen(v);
          if (!v) setConfirm("");
        }}
      >
        <AlertDialogTrigger asChild>
          <button className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-destructive/40 bg-background text-destructive text-sm font-medium hover:bg-destructive hover:text-destructive-foreground transition-colors">
            <Trash2 className="w-4 h-4" />
            Delete project
          </button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this project permanently?</AlertDialogTitle>
            <AlertDialogDescription className="space-y-2">
              <span className="block">
                This removes all page-type rules, brand keywords, historical analyses, and disconnects GSC and GA4.
                Data cannot be recovered.
              </span>
              <span className="block">
                Type <span className="font-mono text-foreground bg-surface px-1 py-0.5 rounded">{CONFIRM_PHRASE}</span> to confirm.
              </span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <input
            type="text"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            placeholder={CONFIRM_PHRASE}
            className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm font-mono focus:border-destructive focus:outline-none focus:ring-1 focus:ring-destructive"
          />
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              disabled={!canDelete}
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Delete project
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
