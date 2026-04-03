import Link from "next/link";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border/70 bg-card/70 backdrop-blur-xl">
      <div className="container mx-auto flex flex-col gap-6 px-4 py-8 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-md space-y-2">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20">
              LS
            </span>
            <div>
              <p className="text-sm font-semibold text-foreground">
                Link Shortener
              </p>
              <p className="text-sm text-muted-foreground">
                Short links, brighter journeys.
              </p>
            </div>
          </div>
          <p className="text-sm leading-6 text-muted-foreground">
            Create, manage, and share memorable links with a polished, colorful
            workspace.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm font-medium">
          <Link
            href="/"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            Home
          </Link>
          <Link
            href="/dashboard"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            Dashboard
          </Link>
          <a
            href="mailto:hello@linkshortner.app"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            Support
          </a>
        </div>

        <p className="text-sm text-muted-foreground">
          &copy; {year} Link Shortener. Built for fast sharing.
        </p>
      </div>
    </footer>
  );
}
