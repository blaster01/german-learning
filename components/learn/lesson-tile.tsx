import type { ContentModule, TierIndex } from "@/lib/content/loader";
import { ProgressRing } from "@/components/ui/progress-ring";
import { SegmentedBar } from "@/components/ui/segmented-bar";
import { LessonTileActions } from "@/components/learn/lesson-tile-actions";
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

  return (
    <div
      className={cn(
        "flex flex-col gap-4 rounded-2xl border p-4 transition sm:flex-row sm:items-center",
        isComplete
          ? "border-primary/30 bg-primary/5"
          : isStarted
            ? "border-border/80 bg-card shadow-card"
            : "border-border/60 bg-card shadow-card",
      )}
    >
      {/* progress ring */}
      <ProgressRing value={pct} size={52} strokeWidth={4} className="shrink-0 self-start sm:self-center" />

      {/* info */}
      <div className="min-w-0 flex-1 space-y-1.5">
        <p className="font-semibold leading-tight">{mod.title}</p>
        <p className="truncate text-sm text-muted-foreground">{mod.description}</p>
        <SegmentedBar segments={tiers} className="mt-2" />
        <p className="text-xs text-muted-foreground">{totalItems} items across 3 tiers</p>
      </div>

      {/* action buttons */}
      <div className="shrink-0 self-end sm:self-center">
        <LessonTileActions slug={mod.slug} />
      </div>
    </div>
  );
}
