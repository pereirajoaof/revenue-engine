import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { hubFor, PINS, SIGNALS, signalStatus, trajectory, uxHead } from "@/components/ux/data";
import { useUx } from "@/components/ux/state";
import { statusMessage } from "@/components/ux/SignalGate";
import {
  Banner,
  BandPill,
  BAND_TEXT,
  bandOf,
  ConfidencePill,
  CRUMB_DASH,
  KpiStrip,
  OpenLink,
  Page,
  Pill,
  ScoreHero,
  Segmented,
  SmallButton,
  TopBar,
  UX_ROOT,
} from "@/components/ux/ui";

export const Route = createFileRoute("/project/$projectId/dashboard/user-experience/")({
  component: Hub,
  head: () => uxHead("Overview", "User Experience score for Northwind Botanicals: conversion, engagement, page experience and search appeal."),
});

const SEG_COLORS: Record<string, string> = {
  conversion: "bg-chart-1",
  engagement: "bg-chart-2",
  "page-experience": "bg-chart-3",
  "search-appeal": "bg-chart-4",
};

function Hub() {
  const { state, outcome } = useUx();
  const [win, setWin] = useState<"4" | "13">("4");
  const hub = hubFor(state);
  const gaOff = state === "gsc-only" || state === "incomplete" || state === "just-connected";
  const gaStale = state === "stale" ? " · data up to 5 Oct" : "";

  const banner =
    state === "gsc-only" ? (
      <Banner action={<SmallButton primary to="/settings">Connect</SmallButton>}>
        Connect Google Analytics to score conversion and engagement — together they make up 65% of this score.
      </Banner>
    ) : state === "just-connected" ? (
      <Banner>Google Analytics connected. Building your first comparison — usually ready within a few hours.</Banner>
    ) : undefined;

  const description =
    hub.score === null
      ? "Not enough signals to give a score yet. We need at least 2 of 4."
      : state === "gsc-only" || state === "just-connected"
        ? "58% of search clicks land on pages with good real-user speed, and results earn 94% of the clicks expected for their positions."
        : state === "lead-gen"
          ? "Landing pages turn visits into form submissions at 91% of the rate of similar pages on this site, and 58% of search clicks land on pages with good real-user speed."
          : "Landing pages convert at 91% of the rate of similar pages on this site, and 58% of search clicks land on pages with good real-user speed.";

  const total = hub.contributions.reduce((a, c) => a + c.value, 0);

  return (
    <>
      <TopBar
        crumbs={[CRUMB_DASH]}
        title="User Experience"
        meta="Week of 6 Oct · Google Analytics & Search Console: last 4 complete weeks · Real-user speed data: measured 29 Sep"
        controls={
          <Segmented
            label="Window"
            value={win}
            onChange={setWin}
            options={[
              { value: "4", label: "Last 4 complete weeks" },
              { value: "13", label: "Last 13 complete weeks" },
            ]}
          />
        }
      />
      <Page>
        <ScoreHero
          score={hub.score}
          description={description}
          confidence={hub.confidence}
          momentum={hub.momentum}
          coverage={hub.score === null ? `Incomplete — ${hub.active} of 4 signals` : `${hub.active} of 4 signals`}
          series={trajectory((hub.score ?? 72) - 8, hub.score ?? 72)}
          pins={PINS}
          banner={banner}
          incomplete={
            hub.score === null && (
              <ul className="mt-3 space-y-1 text-xs text-muted-foreground">
                <li>· Conversion Efficiency — connect Google Analytics</li>
                <li>· Engagement — connect Google Analytics</li>
                <li>· Page Experience — no real-user speed data for this site yet</li>
                <li className="text-foreground">· Search Appeal — available (62)</li>
              </ul>
            )
          }
        />

        <KpiStrip
          items={[
            { label: "Organic landing sessions", value: gaOff ? "—" : win === "4" ? "21,480" : "68,920", caption: `Google Analytics · ${win} wks${gaStale}` },
            {
              label: "Completed-visit rate",
              value: gaOff || state === "no-outcome" ? "—" : state === "lead-gen" ? "2.3%" : "4.8%",
              caption: state === "no-outcome" ? "Choose an outcome in Settings" : `${outcome.outcome.toLowerCase()} · Google Analytics${gaStale}`,
            },
            { label: "Engaged sessions", value: gaOff ? "—" : "61%", caption: `Google Analytics · ${win} wks${gaStale}` },
            { label: "Clicks on fast, stable pages", value: state === "incomplete" ? "—" : "58%", caption: "Search Console + real-user speed" },
            { label: "CTR vs expected", value: "94%", caption: `Search Console · ${win} wks` },
          ]}
        />

        <section>
          <h2 className="mb-3 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Signals · scored</h2>
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {SIGNALS.map((s) => {
              const st = signalStatus(state, s.key);
              const msg = statusMessage(st);
              return (
                <article key={s.key} className="flex flex-col rounded-[4px] border border-border bg-card p-4">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-sm font-semibold">{s.name}</h3>
                    <span className="font-mono text-[10px] text-muted-foreground">weight {Math.round(s.weight * 100)}%</span>
                  </div>
                  {msg ? (
                    <div className="mt-3 flex-1">
                      <p className="font-mono text-2xl text-muted-foreground">—</p>
                      <p className="mt-2 text-sm">{msg.text}</p>
                      {msg.action && <div className="mt-3">{msg.action}</div>}
                    </div>
                  ) : (
                    <div className="mt-2 flex-1">
                      <div className="flex items-baseline gap-2">
                        <span className={`font-mono text-3xl font-semibold ${BAND_TEXT[bandOf(s.score)]}`}>{s.score}</span>
                        <BandPill score={s.score} />
                      </div>
                      <div className="mt-2">
                        <ConfidencePill c={s.confidence} />
                      </div>
                      <p className="mt-3 text-sm">{s.finding}</p>
                      <p className="mt-1 font-mono text-[10.5px] text-muted-foreground">
                        {s.coverage}
                        {st.kind === "ok" && st.note ? ` · ${st.note}` : ""}
                      </p>
                    </div>
                  )}
                  <div className="mt-4 border-t border-border pt-3">
                    <OpenLink to={s.path} />
                  </div>
                </article>
              );
            })}
          </div>

          {hub.score !== null && (
            <div className="mt-3 rounded-[4px] border border-border bg-card p-4">
              <div className="mb-2 flex items-baseline justify-between">
                <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Contribution to score</p>
                <p className="font-mono text-[11px] text-muted-foreground">
                  {hub.contributions.map((c) => c.value.toFixed(1)).join(" + ")} = {hub.score}
                  {hub.active < 4 && " · weights re-scaled"}
                </p>
              </div>
              <div className="flex h-3 overflow-hidden rounded-full bg-surface">
                {hub.contributions.map((c) => (
                  <div key={c.key} className={SEG_COLORS[c.key]} style={{ width: `${(c.value / total) * (hub.score! / 100) * 100}%` }} title={`${c.name} ${c.value}`} />
                ))}
              </div>
              <div className="mt-2 flex flex-wrap gap-4 font-mono text-[10.5px] text-muted-foreground">
                {hub.contributions.map((c) => (
                  <span key={c.key}>
                    <span className={`mr-1.5 inline-block h-2 w-2 rounded-sm ${SEG_COLORS[c.key]}`} />
                    {c.name} {c.value.toFixed(1)}
                  </span>
                ))}
              </div>
            </div>
          )}
        </section>

        <section>
          <h2 className="mb-3 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Diagnostics</h2>
          <div className="grid gap-3 md:grid-cols-3">
            {[
              { title: "Landing pages", body: "7 pages below their peers · 18% of organic landing sessions", to: `${UX_ROOT}/landing-pages` },
              { title: "Changes", body: "3 changes logged · 1 result ready", to: `${UX_ROOT}/changes` },
              { title: "Data & method", body: "Matched sessions 71% · matched search clicks 83% · real-user speed data 16 days old", to: `${UX_ROOT}/method` },
            ].map((d) => (
              <article key={d.title} className="rounded-[4px] border border-border/70 bg-transparent p-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium">{d.title}</h3>
                  <Pill>Unscored</Pill>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{d.body}</p>
                <div className="mt-3">
                  <OpenLink to={d.to} />
                </div>
              </article>
            ))}
          </div>
        </section>
      </Page>
    </>
  );
}
