"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { BookOpen, Flame, Menu, Star, X } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { useProfile } from "@/lib/hooks/use-profile";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

const NAV_LINKS = [
  { href: "/", label: "Learn" },
  { href: "/profile", label: "Profile" },
  { href: "/settings", label: "Settings" },
];

export function SiteHeader() {
  const { profile } = useProfile();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  // Close the mobile menu whenever the route changes.
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-card/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 font-bold tracking-tight text-foreground"
        >
          <BookOpen className="h-5 w-5 text-primary" />
          <span>Sprachkurs</span>
        </Link>

        {/* Nav (desktop) */}
        <nav className="hidden items-center gap-1 sm:flex">
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              aria-current={pathname === href ? "page" : undefined}
              className={cn(
                "rounded-full px-4 py-2 text-sm font-medium transition hover:bg-muted hover:text-foreground",
                pathname === href
                  ? "bg-muted text-foreground"
                  : "text-muted-foreground",
              )}
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Right side — chips + CTA + theme */}
        <div className="flex items-center gap-2">
          {/* Streak chip */}
          <div
            className={cn(
              "hidden items-center gap-1 rounded-full border px-3 py-1 text-xs font-semibold sm:flex",
              profile.streak > 0
                ? "border-accent/30 bg-accent/10 text-accent-foreground"
                : "border-border bg-muted text-muted-foreground",
            )}
            title={`${profile.streak}-day streak`}
          >
            <Flame
              className={cn(
                "h-3.5 w-3.5",
                profile.streak > 0 ? "text-accent" : "text-muted-foreground",
              )}
            />
            <span>{profile.streak}</span>
          </div>

          {/* XP chip */}
          <div
            className="hidden items-center gap-1 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary sm:flex"
            title={`${profile.todayXp} XP today`}
          >
            <Star className="h-3.5 w-3.5" />
            <span>{profile.todayXp} XP</span>
          </div>

          {/* Continue CTA */}
          <Link
            href="/review/run"
            className={cn(
              buttonVariants({ variant: "primary", size: "sm" }),
              "hidden sm:inline-flex",
            )}
          >
            Continue
          </Link>

          <ThemeToggle />

          {/* Mobile menu toggle */}
          <button
            type="button"
            className={cn(
              buttonVariants({ variant: "outline", size: "sm" }),
              "h-9 w-9 justify-center px-0 sm:hidden",
            )}
            aria-expanded={menuOpen}
            aria-controls="mobile-nav-panel"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            onClick={() => setMenuOpen((v) => !v)}
          >
            {menuOpen ? (
              <X className="h-4 w-4" />
            ) : (
              <Menu className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu panel */}
      {menuOpen ? (
        <div
          id="mobile-nav-panel"
          className="animate-fade-up space-y-3 border-t border-border bg-card px-4 py-4 sm:hidden"
        >
          <nav className="flex flex-col gap-1">
            {NAV_LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                aria-current={pathname === href ? "page" : undefined}
                className={cn(
                  "rounded-xl px-4 py-3 text-base font-medium transition hover:bg-muted hover:text-foreground",
                  pathname === href
                    ? "bg-muted text-foreground"
                    : "text-muted-foreground",
                )}
              >
                {label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <div
              className={cn(
                "flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-semibold",
                profile.streak > 0
                  ? "border-accent/30 bg-accent/10 text-accent-foreground"
                  : "border-border bg-muted text-muted-foreground",
              )}
            >
              <Flame
                className={cn(
                  "h-3.5 w-3.5",
                  profile.streak > 0 ? "text-accent" : "text-muted-foreground",
                )}
              />
              <span>{profile.streak}-day streak</span>
            </div>
            <div className="flex items-center gap-1 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              <Star className="h-3.5 w-3.5" />
              <span>{profile.todayXp} XP today</span>
            </div>
          </div>

          <Link
            href="/review/run"
            className={cn(
              buttonVariants({ variant: "primary", size: "lg" }),
              "w-full justify-center",
            )}
          >
            Continue
          </Link>
        </div>
      ) : null}
    </header>
  );
}
