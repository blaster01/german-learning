"use client";

import { ProgressRing } from "@/components/ui/progress-ring";
import { SegmentedBar } from "@/components/ui/segmented-bar";
import { useModuleMastery } from "@/lib/hooks/use-module-mastery";

/**
 * Renders the progress ring + tier segmented bar for a lesson tile.
 * Takes only primitive props (slug + counts) so it never needs the full
 * content registry — mastery is computed client-side from IndexedDB.
 */
export function TileMastery({
  slug,
  title,
  description,
  tierTotals,
}: {
  slug: string;
  title: string;
  description: string;
  tierTotals: [number, number, number];
}) {
  const { overallPct, tierCorrect } = useModuleMastery(slug, tierTotals);

  const segments = ([0, 1, 2] as const).map((i) => ({
    label: `Tier ${i + 1}`,
    value: tierCorrect[i],
    max: tierTotals[i],
  }));
  const totalItems = tierTotals[0] + tierTotals[1] + tierTotals[2];

  return (
    <>
      <ProgressRing
        value={overallPct}
        size={52}
        strokeWidth={4}
        className="shrink-0 self-start sm:self-center"
      />
      <div className="min-w-0 flex-1 space-y-1.5">
        <p className="font-semibold leading-tight">{title}</p>
        <p className="truncate text-sm text-muted-foreground">{description}</p>
        <SegmentedBar segments={segments} className="mt-2" />
        <p className="text-xs text-muted-foreground">
          {totalItems} items across 3 tiers
        </p>
      </div>
    </>
  );
}
