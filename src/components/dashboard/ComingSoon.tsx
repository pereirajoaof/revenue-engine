import { Construction } from "lucide-react";
import { DashboardNav } from "@/components/dashboard/DashboardNav";
import { ThemeToggle } from "@/components/ThemeToggle";

export function ComingSoon({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <DashboardNav />
      <div className="lg:pl-56">
        <header className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur">
          <div className="flex flex-col gap-4 px-6 py-5 lg:flex-row lg:items-center lg:justify-between lg:px-8">
            <div>
              <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                {eyebrow}
              </p>
              <h1 className="mt-1 text-2xl font-bold tracking-tight">{title}</h1>
            </div>
            <ThemeToggle />
          </div>
        </header>
        <main className="px-6 py-16 lg:px-8">
          <div className="mx-auto max-w-xl rounded-xl border border-dashed border-border bg-surface/40 p-10 text-center">
            <div className="mx-auto mb-4 flex h-11 w-11 items-center justify-center rounded-lg border border-border bg-background">
              <Construction className="h-5 w-5 text-muted-foreground" />
            </div>
            <p className="text-sm font-semibold">Coming soon</p>
            <p className="mt-2 text-sm text-muted-foreground">{description}</p>
          </div>
        </main>
      </div>
    </div>
  );
}
