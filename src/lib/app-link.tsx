import type { ComponentType } from "react";
import { Link, useNavigate, useParams } from "@tanstack/react-router";

export const DEFAULT_PROJECT_ID = "demo";

/** Paths that live inside a project workspace (/project/$projectId/...). */
const PROJECT_PREFIXES = [
  "/dashboard",
  "/audit-runs",
  "/planner",
  "/settings",
  "/keyword-demand",
  "/alerts",
  "/why-revenue-moved",
];

/** Growth-driver paths that moved underneath /dashboard. */
const DRIVER_PREFIXES = ["/brand-authority", "/technical-health", "/website-authority"];

export function toProjectPath(to: string): string {
  if (!to.startsWith("/") || to.startsWith("/project/")) return to;
  if (DRIVER_PREFIXES.some((p) => to === p || to.startsWith(`${p}/`))) {
    return `/project/$projectId/dashboard${to}`;
  }
  if (PROJECT_PREFIXES.some((p) => to === p || to.startsWith(`${p}/`))) {
    return `/project/$projectId${to}`;
  }
  return to;
}

export function useProjectId(): string {
  const params = useParams({ strict: false }) as { projectId?: string };
  return params.projectId ?? DEFAULT_PROJECT_ID;
}

type LinkLikeProps = Record<string, unknown> & {
  to: string;
  params?: Record<string, string>;
};

const RawLink = Link as unknown as ComponentType<Record<string, unknown>>;

/**
 * Drop-in replacement for TanStack's <Link> that keeps the current project in
 * the URL. Authoring stays short: `to="/dashboard"` resolves to
 * `/project/{id}/dashboard`.
 */
export function AppLink({ to, params, ...rest }: LinkLikeProps) {
  const projectId = useProjectId();
  const resolved = toProjectPath(to);
  return (
    <RawLink
      {...rest}
      to={resolved}
      params={resolved.includes("$") ? { projectId, ...(params ?? {}) } : undefined}
    />
  );
}

export function useAppNavigate() {
  const navigate = useNavigate();
  const projectId = useProjectId();
  return (opts: Record<string, unknown>) => {
    const to = opts.to as string | undefined;
    if (typeof to !== "string") {
      return (navigate as unknown as (o: Record<string, unknown>) => unknown)(opts);
    }
    const resolved = toProjectPath(to);
    return (navigate as unknown as (o: Record<string, unknown>) => unknown)({
      ...opts,
      to: resolved,
      params: resolved.includes("$")
        ? { projectId, ...((opts.params as Record<string, string>) ?? {}) }
        : opts.params,
    });
  };
}
