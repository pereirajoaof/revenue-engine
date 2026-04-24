import { Outlet, Link, createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";

import appCss from "../styles.css?url";
import { ThemeProvider } from "@/hooks/use-theme";
import { ThemeToggle } from "@/components/ThemeToggle";

function NotFoundComponent() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-6 py-16">
      {/* Theme toggle — top right */}
      <div className="absolute top-6 right-6 z-20">
        <ThemeToggle />
      </div>

      {/* Ambient organic glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full opacity-60 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, var(--glow) 0%, transparent 70%)",
        }}
      />
      {/* Subtle grid — the "OS" side */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(var(--foreground) 1px, transparent 1px), linear-gradient(90deg, var(--foreground) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <div className="relative z-10 mx-auto w-full max-w-2xl">
        {/* Brand chip */}
        <Link
          to="/"
          className="mx-auto mb-10 flex w-fit items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1.5 backdrop-blur transition-colors hover:bg-card"
        >
          <div className="flex h-5 w-5 items-center justify-center rounded-md bg-primary">
            <span className="text-[11px] font-bold text-primary-foreground">O</span>
          </div>
          <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
            OrganicOS
          </span>
        </Link>

        {/* Terminal-style status line */}
        <div className="mb-6 flex items-center justify-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
          <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-destructive" />
          <span>system / 404 / root_not_found</span>
        </div>

        {/* The number — display + mono detail */}
        <div className="relative text-center">
          <h1
            className="font-display text-[140px] font-bold leading-none tracking-[-0.06em] text-foreground sm:text-[180px]"
            style={{
              backgroundImage:
                "linear-gradient(180deg, var(--foreground) 0%, color-mix(in oklab, var(--primary) 55%, var(--foreground)) 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            404
          </h1>
        </div>

        {/* Headline — the dual meaning */}
        <div className="mt-6 text-center">
          <h2 className="text-balance font-display text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            This branch didn't take root.
          </h2>
          <p className="mx-auto mt-3 max-w-md text-balance text-sm leading-relaxed text-muted-foreground sm:text-base">
            The page you're looking for was pruned, moved, or never grew here in
            the first place. Let's get you back to fertile ground.
          </p>
        </div>

        {/* Actions */}
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            to="/"
            className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-primary px-5 text-sm font-medium text-primary-foreground shadow-sm transition-all hover:opacity-90 sm:w-auto"
          >
            <span>Return to homepage</span>
            <span aria-hidden>→</span>
          </Link>
          <Link
            to="/dashboard"
            className="inline-flex h-11 w-full items-center justify-center rounded-lg border border-border bg-card px-5 text-sm font-medium text-foreground transition-colors hover:bg-surface sm:w-auto"
          >
            Open dashboard
          </Link>
        </div>

        {/* Footer easter-egg — the bilingual play */}
        <div className="mt-14 flex items-center justify-center gap-3 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground/70">
          <span className="h-px w-8 bg-border" />
          <span>orgânicos · organic · os</span>
          <span className="h-px w-8 bg-border" />
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Lovable App" },
      { name: "description", content: "Lovable Generated Project" },
      { name: "author", content: "Lovable" },
      { property: "og:title", content: "Lovable App" },
      { property: "og:description", content: "Lovable Generated Project" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:site", content: "@Lovable" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  return (
    <ThemeProvider>
      <Outlet />
    </ThemeProvider>
  );
}
