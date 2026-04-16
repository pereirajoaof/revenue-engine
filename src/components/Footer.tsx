export function Footer() {
  return (
    <footer className="px-6 py-12 border-t border-border">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-xs">O</span>
          </div>
          <span className="font-semibold text-sm">OrganicOS</span>
        </div>
        <p className="text-sm text-muted-foreground">© 2026 OrganicOS. All rights reserved.</p>
      </div>
    </footer>
  );
}
