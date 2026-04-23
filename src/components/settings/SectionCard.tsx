import { type ReactNode } from "react";

interface Props {
  id: string;
  icon: ReactNode;
  title: string;
  description?: string;
  children: ReactNode;
  accent?: "default" | "primary" | "danger";
}

export function SectionCard({ id, icon, title, description, children, accent = "default" }: Props) {
  const borderClass =
    accent === "danger"
      ? "border-destructive/30"
      : accent === "primary"
        ? "border-primary/30"
        : "border-border";

  const iconBg =
    accent === "danger"
      ? "bg-destructive/10 text-destructive"
      : accent === "primary"
        ? "bg-primary/10 text-primary"
        : "bg-surface text-muted-foreground";

  return (
    <section
      id={id}
      className={`rounded-xl border ${borderClass} bg-card scroll-mt-6`}
    >
      <header className="px-6 pt-5 pb-4 border-b border-border flex items-start gap-3">
        <div className={`w-8 h-8 rounded-md flex items-center justify-center shrink-0 ${iconBg}`}>
          {icon}
        </div>
        <div className="min-w-0">
          <h2 className="text-base font-semibold tracking-tight">{title}</h2>
          {description && (
            <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{description}</p>
          )}
        </div>
      </header>
      <div className="px-6 py-5">{children}</div>
    </section>
  );
}
