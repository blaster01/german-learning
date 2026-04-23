import Link from "next/link";
import type { ContentModule, TierIndex } from "@/lib/content/loader";
import { ProgressRing } from "@/components/ui/progress-ring";
import { SegmentedBar } from "@/components/ui/segmented-bar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export type TileMastery = {
  /** 0-100 overall progress for this module */
  overallPct: number;
  /** correct answers per tier */
  tierCorrect: [number, number, number];
};

export function LessonTile({
  mod,
  mastery,
}: {
  mod: ContentModule;
  mastery?: TileMastery;
}) {
  const pct = mastery?.overallPct ?? 0;
  const isStarted = pct > 0;
  const isComplete = pct >= 100;

  const tiers: { label: string; value: number; max: number }[] = ([1, 2, 3] as TierIndex[]).map(
    (t, i) => ({
      label: `Tier ${t}`,
      value: mastery?.tierCorrect[i] ?? 0,
      max: mod.tiers[t].length,
    }),
  );

  const totalItems = tiers.reduce((s, t) => s + t.max, 0);
  const firstTierHref = `/systems/${mod.systemId}/${mod.slug}`;

  return (
    <Link
      href={firstTierHref}
      className={cn(
        "group flex items-center gap-4 rounded-2xl border p-4 transition",
        isComplete
          ? "border-primary/30 bg-primary/5 hover:bg-primary/10"
          : isStarted
            ? "border-border/80 bg-card shadow-card hover:shadow-card-lg"
            : "border-border/60 bg-card shadow-card hover:shadow-card-lg",
      )}
    >
      {/* progress ring */}
      <ProgressRing value={pct} size={52} strokeWidth={4} className="shrink-0" />

      {/* info */}
      <div className="min-w-0 flex-1 space-y-1.5">
        <div className="flex items-start justify-between gap-2">
          <p className="font-semibold leading-tight">{mod.title}</p>
          <Badge variant={isComplete ? "success" : isStarted ? "default" : "muted"} className="shrink-0">
            {isComplete ? "Done" : isStarted ? "Active" : "Start"}
          </Badge>
        </div>
        <p className="truncate text-sm text-muted-foreground">{mod.description}</p>
        <SegmentedBar segments={tiers} className="mt-2" />
        <p className="text-xs text-muted-foreground">{totalItems} items across 3 tiers</p>
      </div>
    </Link>
  );
}
