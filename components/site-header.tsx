"use client";

import Link from "next/link";
import { BookOpen, Flame, Star } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { useProfile } from "@/lib/hooks/use-profile";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export function SiteHeader() {
  const { profile } = useProfile();

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-card/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-bold tracking-tight text-foreground">
          <BookOpen className="h-5 w-5 text-primary" />
          <span>Sprachkurs</span>
        </Link>

        {/* Nav */}
        <nav className="hidden items-center gap-1 sm:flex">
          {[
            { href: "/", label: "Learn" },
            { href: "/review", label: "Review" },
            { href: "/profile", label: "Profile" },
          ].map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="rounded-full px-4 py-2 text-sm font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground"
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
            <Flame className={cn("h-3.5 w-3.5", profile.streak > 0 ? "text-accent" : "text-muted-foreground")} />
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
        </div>
      </div>
    </header>
  );
}
