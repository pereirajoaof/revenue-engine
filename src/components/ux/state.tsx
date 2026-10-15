import { createContext, useContext, useState, type ReactNode } from "react";
import { MOCK_STATES, outcomeFor, type MockState, CHANGES, type Change } from "./data";

type Ctx = {
  state: MockState;
  setState: (s: MockState) => void;
  outcome: ReturnType<typeof outcomeFor>;
  changes: Change[];
  addChange: (c: Change) => void;
  logOpen: boolean;
  setLogOpen: (v: boolean) => void;
  logPrefill: string[];
  openLog: (pages?: string[]) => void;
};

const UxCtx = createContext<Ctx | null>(null);

export function UxStateProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<MockState>("full");
  const [changes, setChanges] = useState<Change[]>(CHANGES);
  const [logOpen, setLogOpen] = useState(false);
  const [logPrefill, setPrefill] = useState<string[]>([]);
  return (
    <UxCtx.Provider
      value={{
        state,
        setState,
        outcome: outcomeFor(state),
        changes,
        addChange: (c) => setChanges((p) => [c, ...p]),
        logOpen,
        setLogOpen,
        logPrefill,
        openLog: (pages = []) => {
          setPrefill(pages);
          setLogOpen(true);
        },
      }}
    >
      {children}
    </UxCtx.Provider>
  );
}

export function useUx() {
  const c = useContext(UxCtx);
  if (!c) throw new Error("useUx outside provider");
  return c;
}

export function MockStateSwitcher() {
  const { state, setState } = useUx();
  return (
    <div className="fixed bottom-4 right-4 z-50 rounded-lg border border-dashed border-chart-4/60 bg-card/95 p-3 shadow-lg backdrop-blur">
      <p className="mb-1.5 font-mono text-[9px] uppercase tracking-wider text-chart-4">Mockup control · not product UI</p>
      <label className="flex items-center gap-2 font-mono text-[11px]">
        <span className="text-muted-foreground">Mock state</span>
        <select
          value={state}
          onChange={(e) => setState(e.target.value as MockState)}
          className="rounded-md border border-border bg-surface px-2 py-1 text-[11px] text-foreground"
        >
          {MOCK_STATES.map((s) => (
            <option key={s.id} value={s.id}>
              {s.label}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}
