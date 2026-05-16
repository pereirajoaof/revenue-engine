import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { z } from "zod";
import { ArrowRight, CheckCircle2, Lock, ShieldCheck, KeySquare, Database } from "lucide-react";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";

export const Route = createFileRoute("/request-demo")({
  component: RequestDemoPage,
  head: () => ({
    meta: [
      { title: "Request a Demo — OrganicOS" },
      {
        name: "description",
        content:
          "See how OrganicOS maps search visibility to revenue. Book a personalized platform demo connecting 1st-party performance data with 3rd-party market intelligence.",
      },
      { property: "og:title", content: "Request a Demo — OrganicOS" },
      {
        property: "og:description",
        content:
          "See how OrganicOS maps search visibility to revenue. Personalized platform demo for growth teams.",
      },
    ],
  }),
});

const FREE_DOMAINS = [
  "gmail.com",
  "yahoo.com",
  "hotmail.com",
  "outlook.com",
  "icloud.com",
  "aol.com",
  "proton.me",
  "protonmail.com",
  "live.com",
  "msn.com",
];

const schema = z.object({
  email: z
    .string()
    .trim()
    .email("Enter a valid business email.")
    .max(255)
    .refine(
      (v) => {
        const domain = v.split("@")[1]?.toLowerCase() ?? "";
        return !FREE_DOMAINS.includes(domain);
      },
      { message: "Please use your business email (free inbox providers are blocked)." },
    ),
  firstName: z.string().trim().min(1, "First name is required.").max(80),
  lastName: z.string().trim().min(1, "Last name is required.").max(80),
  company: z.string().trim().min(1, "Company name is required.").max(120),
  jobTitle: z.string().trim().min(1, "Job title is required.").max(120),
  analytics: z.enum(["ga4_gsc", "adobe_gsc", "custom", "none"], {
    errorMap: () => ({ message: "Select your current analytics stack." }),
  }),
  companySize: z.enum(["1-50", "51-150", "151-500", "501-1000", "1001+"], {
    errorMap: () => ({ message: "Select your company size." }),
  }),
});

type FormState = {
  email: string;
  firstName: string;
  lastName: string;
  company: string;
  jobTitle: string;
  analytics: string;
  companySize: string;
};

const VALUE_PROPS = [
  {
    title: "Organic Revenue Mapping",
    body: "Link GSC/GA4 data directly to financial outcomes.",
  },
  {
    title: "GEO & AI Search Readiness",
    body: "Optimize your brand entity for generative engines.",
  },
  {
    title: "Semantic Insight Engine",
    body: "Let privacy-compliant AI find high-intent intent gaps.",
  },
  {
    title: "1st & 3rd Party Data Reconciliation",
    body: "Cleanly match internal traffic with external search demand.",
  },
];

const TRUST_LOGOS = [
  "NORTHWIND",
  "AETHER&CO",
  "MERIDIAN",
  "HELIX RETAIL",
  "PARALLAX",
  "VOLT MEDIA",
];

const SECURITY = [
  {
    icon: Database,
    title: "Zero Data Retention of Raw End-Users",
    body: "We ingest only aggregated property data. We never track or store your end-website visitors' PII.",
  },
  {
    icon: KeySquare,
    title: "API Isolation Protection",
    body: "Your connected Google integrations utilize secure OAuth tokens and comply fully with Google's strict Limited Use Policy.",
  },
  {
    icon: ShieldCheck,
    title: "Full UK GDPR Architecture",
    body: "Data pipelines are encrypted at rest (AES-256) and in transit (TLS 1.3) utilizing our secure Supabase infrastructure.",
  },
];

function RequestDemoPage() {
  const [form, setForm] = useState<FormState>({
    email: "",
    firstName: "",
    lastName: "",
    company: "",
    jobTitle: "",
    analytics: "",
    companySize: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [submitted, setSubmitted] = useState(false);

  function update<K extends keyof FormState>(k: K, v: string) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const res = schema.safeParse(form);
    if (!res.success) {
      const next: Partial<Record<keyof FormState, string>> = {};
      for (const issue of res.error.issues) {
        const key = issue.path[0] as keyof FormState;
        if (!next[key]) next[key] = issue.message;
      }
      setErrors(next);
      return;
    }
    setErrors({});
    setSubmitted(true);
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Nav />

      {/* Hero + Form */}
      <section className="px-6 pt-32 pb-24">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-[1fr_1.05fr] gap-12 lg:gap-16 items-start">
          {/* Left: hero copy */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-sm font-mono text-primary uppercase tracking-wider mb-4">
              Request a demo
            </p>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight leading-[1.05]">
              See how OrganicOS maps search visibility to revenue.
            </h1>
            <p className="mt-5 text-muted-foreground leading-relaxed max-w-xl">
              Stop guessing which keywords drive actual unit economics. Get a personalized
              platform demo and see how to connect your 1st-party performance data with
              3rd-party market intelligence.
            </p>

            <ul className="mt-10 space-y-5">
              {VALUE_PROPS.map((v) => (
                <li key={v.title} className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-primary mt-1 shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-foreground">{v.title}</p>
                    <p className="text-sm text-muted-foreground">{v.body}</p>
                  </div>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Right: form */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-glow opacity-40 blur-[80px] pointer-events-none" />
            <div className="relative rounded-2xl border border-border bg-card p-7 sm:p-9 shadow-[0_20px_60px_-30px_var(--glow)]">
              {submitted ? (
                <Confirmation firstName={form.firstName} />
              ) : (
                <form onSubmit={onSubmit} noValidate>
                  <h2 className="text-lg font-semibold tracking-tight">
                    Book your personalized walkthrough
                  </h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    A specialist will reach out within one business day.
                  </p>

                  <div className="mt-6 space-y-4">
                    <Field
                      label="Business email"
                      required
                      error={errors.email}
                    >
                      <input
                        type="email"
                        value={form.email}
                        onChange={(e) => update("email", e.target.value)}
                        maxLength={255}
                        placeholder="you@company.com"
                        className="form-input"
                      />
                    </Field>

                    <div className="grid grid-cols-2 gap-4">
                      <Field label="First name" required error={errors.firstName}>
                        <input
                          type="text"
                          value={form.firstName}
                          onChange={(e) => update("firstName", e.target.value)}
                          maxLength={80}
                          className="form-input"
                        />
                      </Field>
                      <Field label="Last name" required error={errors.lastName}>
                        <input
                          type="text"
                          value={form.lastName}
                          onChange={(e) => update("lastName", e.target.value)}
                          maxLength={80}
                          className="form-input"
                        />
                      </Field>
                    </div>

                    <Field label="Company name" required error={errors.company}>
                      <input
                        type="text"
                        value={form.company}
                        onChange={(e) => update("company", e.target.value)}
                        maxLength={120}
                        className="form-input"
                      />
                    </Field>

                    <Field label="Job title" required error={errors.jobTitle}>
                      <input
                        type="text"
                        value={form.jobTitle}
                        onChange={(e) => update("jobTitle", e.target.value)}
                        maxLength={120}
                        className="form-input"
                      />
                    </Field>

                    <Field
                      label="Primary analytics connection"
                      required
                      error={errors.analytics}
                    >
                      <select
                        value={form.analytics}
                        onChange={(e) => update("analytics", e.target.value)}
                        className="form-input"
                      >
                        <option value="">Please select</option>
                        <option value="ga4_gsc">Google Analytics 4 (GA4) + Search Console</option>
                        <option value="adobe_gsc">Adobe Analytics + Search Console</option>
                        <option value="custom">Custom / In-house 1st-party stack</option>
                        <option value="none">None / Setting up soon</option>
                      </select>
                    </Field>

                    <Field label="Company size" required error={errors.companySize}>
                      <select
                        value={form.companySize}
                        onChange={(e) => update("companySize", e.target.value)}
                        className="form-input"
                      >
                        <option value="">Please select</option>
                        <option value="1-50">1–50 employees</option>
                        <option value="51-150">51–150 employees</option>
                        <option value="151-500">151–500 employees</option>
                        <option value="501-1000">501–1,000 employees</option>
                        <option value="1001+">1,001+ employees</option>
                      </select>
                    </Field>
                  </div>

                  <button
                    type="submit"
                    className="group mt-7 w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:brightness-110 transition-all shadow-[0_0_30px_var(--glow)]"
                  >
                    Request demo
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </button>

                  <p className="mt-4 text-[11px] text-muted-foreground leading-relaxed">
                    By clicking "Request Demo", you agree to our{" "}
                    <a href="#" className="underline hover:text-foreground">Terms of Use</a>{" "}
                    and acknowledge that your business contact information will be processed in
                    accordance with our{" "}
                    <a href="#" className="underline hover:text-foreground">Privacy Notice</a>.
                    You can opt out of our product update communications at any time.
                  </p>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Social proof */}
      <section className="px-6 py-24 border-t border-border bg-surface/40">
        <div className="max-w-6xl mx-auto">
          <p className="text-sm font-mono text-primary uppercase tracking-wider mb-3">
            Social proof
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Built for forward-thinking growth teams
          </h2>

          <div className="mt-10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {TRUST_LOGOS.map((logo) => (
              <div
                key={logo}
                className="h-14 rounded-lg border border-border bg-card flex items-center justify-center text-xs font-mono tracking-[0.18em] text-muted-foreground"
              >
                {logo}
              </div>
            ))}
          </div>

          <div className="mt-16 grid lg:grid-cols-[auto_1fr] gap-8 lg:gap-12 items-start">
            <p className="text-sm font-mono uppercase tracking-wider text-muted-foreground lg:max-w-[180px]">
              What growth leaders say
            </p>
            <figure className="rounded-2xl border border-border bg-card p-8 sm:p-10">
              <blockquote className="text-xl sm:text-2xl leading-snug font-medium tracking-tight">
                "OrganicOS completely transformed how we pitch SEO budgets to our board. We
                stopped talking about <span className="text-muted-foreground">'clicks'</span> and
                started talking about exact unit economics."
              </blockquote>
              <figcaption className="mt-6 text-sm text-muted-foreground">
                — Head of Growth Marketing, Enterprise Retail
              </figcaption>
            </figure>
          </div>
        </div>
      </section>

      {/* Security */}
      <section className="px-6 py-24 border-t border-border">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-2 mb-3">
            <Lock className="w-4 h-4 text-primary" />
            <p className="text-sm font-mono text-primary uppercase tracking-wider">
              Privacy &amp; data security
            </p>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight max-w-2xl">
            Enterprise-grade privacy by design
          </h2>
          <p className="mt-4 text-muted-foreground max-w-2xl">
            As a UK-based data processor, OrganicOS treats your search infrastructure with strict
            operational security.
          </p>

          <div className="mt-12 grid md:grid-cols-3 gap-5">
            {SECURITY.map((s) => (
              <div
                key={s.title}
                className="rounded-2xl border border-border bg-card p-6 hover:border-primary/40 transition-colors"
              >
                <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-4">
                  <s.icon className="w-4 h-4" />
                </div>
                <h3 className="text-base font-semibold tracking-tight">{s.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{s.body}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 flex flex-wrap gap-3">
            {["UK GDPR", "AES-256 at rest", "TLS 1.3 in transit", "Google Limited Use Policy"].map(
              (b) => (
                <span
                  key={b}
                  className="px-3 py-1.5 rounded-full border border-border bg-surface text-xs font-mono text-surface-foreground"
                >
                  {b}
                </span>
              ),
            )}
          </div>
        </div>
      </section>

      <Footer />

      <style>{`
        .form-input {
          width: 100%;
          padding: 0.65rem 0.85rem;
          border-radius: 0.5rem;
          border: 1px solid var(--border);
          background: var(--background);
          color: var(--foreground);
          font-size: 0.875rem;
          transition: border-color 0.15s, box-shadow 0.15s;
        }
        .form-input:focus {
          outline: none;
          border-color: transparent;
          box-shadow: 0 0 0 2px var(--ring);
        }
      `}</style>
    </div>
  );
}

function Field({
  label,
  required,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
        {label} {required && <span className="text-primary">*</span>}
      </label>
      <div className="mt-1.5">{children}</div>
      {error && (
        <p className="mt-1.5 text-[11px] text-destructive font-medium" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

function Confirmation({ firstName }: { firstName: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-[11px] font-mono uppercase tracking-wider mb-5">
        <CheckCircle2 className="w-3.5 h-3.5" />
        Request received
      </div>
      <h2 className="text-2xl font-bold tracking-tight leading-tight">
        Thanks{firstName ? `, ${firstName}` : ""} — we'll be in touch.
      </h2>
      <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
        A specialist will reach out within one business day with calendar options and a brief
        prep questionnaire so your demo runs on your real data shape.
      </p>
      <div className="mt-6">
        <Link
          to="/early-access"
          className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
        >
          Explore early access in the meantime
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </motion.div>
  );
}
