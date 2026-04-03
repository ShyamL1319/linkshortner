"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AuthControls } from "@/components/auth-controls";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/dashboard", label: "Dashboard" },
];

export function SiteHeader() {
  const pathname = usePathname();

  const isActive = (href: string) =>
    pathname === href || (href !== "/" && pathname.startsWith(href));

  return (
    <header className="border-b border-border/70 bg-background/75 backdrop-blur-xl">
      <div className="container mx-auto flex flex-col gap-4 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <div className="flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20">
              LS
            </span>
            <div>
              <h1 className="text-lg font-semibold tracking-tight sm:text-xl">
                Link Shortener
              </h1>
              <p className="text-sm text-muted-foreground">
                Bright links, fast sharing.
              </p>
            </div>
          </Link>

          <div className="rounded-full border border-border/70 bg-card/75 px-3 py-2 shadow-sm backdrop-blur-sm lg:hidden">
            <AuthControls />
          </div>
        </div>

        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <nav className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {navItems.map((item) => {
              const active = isActive(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={[
                    "inline-flex items-center whitespace-nowrap rounded-full border px-4 py-2 text-sm font-medium transition-colors",
                    active
                      ? "border-primary/20 bg-primary/12 text-foreground shadow-sm shadow-primary/10"
                      : "border-border/70 bg-card/75 text-muted-foreground hover:border-primary/20 hover:bg-primary/10 hover:text-foreground",
                  ].join(" ")}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="hidden items-center gap-3 rounded-full border border-border/70 bg-card/75 px-3 py-2 shadow-sm backdrop-blur-sm lg:flex">
            <AuthControls />
          </div>
        </div>
      </div>
    </header>
  );
}
