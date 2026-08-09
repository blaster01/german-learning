"use client";

import Link from "next/link";
import { BookOpen, Shuffle, RefreshCw } from "lucide-react";
import { useModuleAvailability } from "@/lib/hooks/use-module-availability";
import { cn } from "@/lib/utils";

const modeConfig = [
  {
    mode: "new",
    label: "New",
    icon: BookOpen,
    alwaysEnabled: true,
    variant: "primary" as const,
  },
  {
    mode: "mixed",
    label: "Mixed",
    icon: Shuffle,
    alwaysEnabled: false,
    variant: "outline" as const,
  },
  {
    mode: "review",
    label: "Review",
    icon: RefreshCw,
    alwaysEnabled: false,
    variant: "outline" as const,
  },
] as const;

export function LessonTileActions({ slug }: { slug: string }) {
  const { hasReview, loading } = useModuleAvailability(slug);

  return (
    <div className="flex items-center gap-1.5">
      {modeConfig.map(({ mode, label, icon: Icon, alwaysEnabled, variant }) => {
        const enabled = alwaysEnabled || hasReview;
        const href = `/session/${slug}/${mode}`;

        const baseClass = cn(
          "inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-semibold transition",
          "border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          enabled
            ? variant === "primary"
              ? "border-primary bg-primary text-primary-foreground hover:bg-primary/90"
              : "border-border bg-card text-foreground hover:bg-muted"
            : "cursor-not-allowed border-border/40 bg-muted/40 text-muted-foreground opacity-50",
        );

        if (!enabled || loading) {
          return (
            <span
              key={mode}
              className={baseClass}
              aria-disabled="true"
              title={`No ${label.toLowerCase()} items yet`}
            >
              <Icon className="h-3 w-3" />
              {label}
            </span>
          );
        }

        return (
          <Link key={mode} href={href} className={baseClass}>
            <Icon className="h-3 w-3" />
            {label}
          </Link>
        );
      })}
    </div>
  );
}
