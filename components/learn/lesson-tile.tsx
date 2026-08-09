import type { ContentModule } from "@/lib/content/loader";
import { LessonTileActions } from "@/components/learn/lesson-tile-actions";
import { TileMastery } from "@/components/learn/tile-mastery";

/**
 * Server component: receives the full ContentModule (fine — this renders to
 * static HTML on the server and never ships item data to the client). Only
 * derives three small numbers (tierTotals) to hand to the client-side
 * TileMastery component, which is what actually reads real progress.
 */
export function LessonTile({ mod }: { mod: ContentModule }) {
  const tierTotals: [number, number, number] = [
    mod.tiers[1].length,
    mod.tiers[2].length,
    mod.tiers[3].length,
  ];

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-border/60 bg-card p-4 shadow-card transition sm:flex-row sm:items-center">
      <TileMastery
        slug={mod.slug}
        title={mod.title}
        description={mod.description}
        tierTotals={tierTotals}
      />
      <div className="shrink-0 self-end sm:self-center">
        <LessonTileActions slug={mod.slug} />
      </div>
    </div>
  );
}
