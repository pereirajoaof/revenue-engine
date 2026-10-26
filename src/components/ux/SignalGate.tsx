import type { ReactNode } from "react";
import { signalStatus, type SignalKey, type SignalStatus } from "./data";
import { useUx } from "./state";
import { SmallButton } from "./ui";

export function statusMessage(s: SignalStatus): { text: string; action?: ReactNode } | null {
  switch (s.kind) {
    case "connect":
      return { text: "Connect Google Analytics to score this signal", action: <SmallButton primary to="/settings">Connect</SmallButton> };
    case "choose-outcome":
      return { text: "Choose what counts as a completed visit", action: <SmallButton primary to="/settings">Settings</SmallButton> };
    case "building":
      return { text: "Building your first comparison — usually ready within a few hours" };
    case "small":
      return { text: "Not enough sessions per page to compare pages yet" };
    case "missing":
      return { text: s.reason };
    default:
      return null;
  }
}

/** Replaces a scored sub-page body when its signal can't be scored in the current mock state. */
export function SignalGate({ signal, children, keepWhenSmall }: { signal: SignalKey; children: ReactNode; keepWhenSmall?: ReactNode }) {
  const { state } = useUx();
  const s = signalStatus(state, signal);
  const msg = statusMessage(s);
  if (!msg) return <>{children}</>;
  return (
    <>
      <section className="rounded-[0.625rem] border border-dashed border-border bg-card p-8 text-center">
        <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Score unavailable · not zero</p>
        <p className="mx-auto mt-2 max-w-md text-base">{msg.text}</p>
        {msg.action && <div className="mt-4 flex justify-center">{msg.action}</div>}
      </section>
      {s.kind === "small" && keepWhenSmall}
    </>
  );
}
