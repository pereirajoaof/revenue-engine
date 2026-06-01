import { createFileRoute, Link } from "@tanstack/react-router";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";

export const Route = createFileRoute("/crawler")({
  component: CrawlerPage,
  head: () => ({
    meta: [
      { title: "OrganicOS Crawler — Identity, Allowlisting, and Blocking" },
      {
        name: "description",
        content:
          "Technical information about the OrganicOS-Crawler: what it does, how to identify it, how to allowlist it on your CDN or WAF, and how to block it.",
      },
      { property: "og:title", content: "OrganicOS Crawler — Identity, Allowlisting, and Blocking" },
      {
        property: "og:description",
        content:
          "User-Agent, IP range, robots.txt behaviour, and CDN allowlist templates for the OrganicOS-Crawler.",
      },
    ],
  }),
});

function CrawlerPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Nav />
      <main className="px-6 py-16">
        <article className="mx-auto max-w-3xl">
          <header className="mb-10 border-b border-border pb-8">
            <p className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
              Crawler reference
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
              The OrganicOS Crawler
            </h1>
            <p className="mt-3 text-sm text-muted-foreground">
              Last updated: 2026-06-01
            </p>
          </header>

          <Prose>
            <p>
              OrganicOS operates a web crawler, <Code>OrganicOS-Crawler/1.0</Code>, that
              fetches pages on behalf of paying or authorised customers analysing their
              own sites. This page documents what the crawler does, how to identify it,
              and how to allowlist or block it.
            </p>

            <H2>What the crawler does</H2>
            <p>
              The crawler fetches HTML, response headers, and linked assets needed to
              compute technical-SEO and content-quality signals for the customer who
              authorised the crawl. We do not cache or republish your content. Pages are
              read, analysed, and stored only in the customer's private OrganicOS
              workspace.
            </p>

            <H2>Identifying the crawler</H2>
            <ul>
              <li>
                <Strong>User-Agent:</Strong> <Code>OrganicOS-Crawler/1.0</Code>
              </li>
              <li>
                <Strong>robots.txt:</Strong> respected by default
              </li>
              <li>
                <Strong>IP range:</Strong> fixed, published below
              </li>
            </ul>

            <H2>Allowing the crawler</H2>
            <p>
              Recommended for OrganicOS customers analysing their own site. If your CDN
              or WAF is blocking the crawler, allowlist it — this is the fastest fix.
            </p>

            <H3>Option 1 — User-Agent allowlist</H3>
            <p>
              Allow any request whose User-Agent matches{" "}
              <Code>OrganicOS-Crawler/1.0</Code>. Works on Cloudflare, Akamai, AWS WAF,
              Fastly, and most other CDNs.
            </p>

            <H3>Option 2 — IP allowlist</H3>
            <p>The crawler runs from a fixed range of IP addresses:</p>
            <Pre>[IP range to be published by OrganicOS engineering]</Pre>
            <p>
              Allowlist this range in your firewall, WAF, or origin protection layer.
            </p>

            <H3>Copy-paste rule templates</H3>
            <ul>
              <li>Cloudflare WAF: [template — to be linked once published]</li>
              <li>Akamai Bot Manager: [template — to be linked once published]</li>
              <li>AWS WAF: [template — to be linked once published]</li>
            </ul>
            <p>
              If your CDN isn't listed and you'd like help, contact us at the address
              below.
            </p>

            <H2>Blocking the crawler</H2>
            <p>If you do not want the OrganicOS Crawler on your site, you have three options:</p>
            <ol>
              <li>
                <Strong>robots.txt</Strong> — the crawler respects it. Add:
                <Pre>{`User-agent: OrganicOS-Crawler\nDisallow: /`}</Pre>
              </li>
              <li>
                <Strong>CDN / WAF block</Strong> — block any request whose User-Agent
                matches <Code>OrganicOS-Crawler/1.0</Code>, or block the IP range above.
              </li>
              <li>
                <Strong>Contact us</Strong> — if you believe the crawler should not be
                visiting your site, email the address below and we will investigate and
                stop the crawl from our side.
              </li>
            </ol>

            <H2>Contact</H2>
            <p>Questions, abuse reports, or requests to stop crawling:</p>
            <p>
              <a
                href="mailto:crawler@organicos.com"
                className="font-mono text-primary underline-offset-4 hover:underline"
              >
                crawler@organicos.com
              </a>
            </p>
            <p className="text-sm text-muted-foreground">
              We respond within one business day.
            </p>

            <H2>What we don't do</H2>
            <ul>
              <li>
                We do not crawl sites we have not been instructed to crawl by a paying
                or authorised customer.
              </li>
              <li>We do not republish, resell, or index your content publicly.</li>
              <li>
                We do not bypass robots.txt by default. Override requires explicit
                operator attestation and is recorded in our audit trail.
              </li>
              <li>
                We do not use residential-proxy networks or browser-fingerprint
                evasion. If our crawler is blocked by your CDN, we ask you to allowlist
                us — we do not work around the block.
              </li>
            </ul>

            <H2>Changes to this page</H2>
            <p>
              We update this page when crawler behaviour or IP ranges change. Material
              changes are reflected in the "Last updated" date at the top.
            </p>
          </Prose>

          <div className="mt-12 border-t border-border pt-6">
            <Link
              to="/early-access"
              className="font-mono text-xs uppercase tracking-wider text-muted-foreground hover:text-foreground"
            >
              ← Back to OrganicOS
            </Link>
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
}

function Prose({ children }: { children: React.ReactNode }) {
  return <div className="space-y-5 text-[15px] leading-relaxed text-foreground">{children}</div>;
}

function H2({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mt-10 border-b border-border pb-2 text-xl font-semibold tracking-tight">
      {children}
    </h2>
  );
}

function H3({ children }: { children: React.ReactNode }) {
  return <h3 className="mt-6 text-base font-semibold tracking-tight">{children}</h3>;
}

function Code({ children }: { children: React.ReactNode }) {
  return (
    <code className="rounded border border-border bg-surface/70 px-1.5 py-0.5 font-mono text-[13px]">
      {children}
    </code>
  );
}

function Pre({ children }: { children: React.ReactNode }) {
  return (
    <pre className="my-3 overflow-x-auto rounded-md border border-border bg-surface/70 px-4 py-3 font-mono text-[13px] leading-relaxed">
      {children}
    </pre>
  );
}

function Strong({ children }: { children: React.ReactNode }) {
  return <strong className="font-semibold text-foreground">{children}</strong>;
}
