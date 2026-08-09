"use client";

import { useEffect, useState } from "react";

export type ModuleMastery = {
  /** 0-100 overall progress for this module */
  overallPct: number;
  /** "graduated" (FSRS state Review) items per tier */
  tierCorrect: [number, number, number];
};

const REVIEW_STATE = 2;

/**
 * Client-only progress for a single module, derived from IndexedDB seen
 * cards. Only `slug` and the (tiny) per-tier totals cross the network/RSC
 * boundary — never the exercise items themselves.
 */
export function useModuleMastery(
  slug: string,
  tierTotals: [number, number, number],
): ModuleMastery {
  const [tierCorrect, setTierCorrect] = useState<[number, number, number]>([
    0, 0, 0,
  ]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { getProgressRepo } = await import("@/lib/storage/index");
        const { moduleSlugAndTierForItemId } =
          await import("@/lib/content/manifest");
        const repo = await getProgressRepo();
        const seenCards = await repo.getSeenCards();
        const next: [number, number, number] = [0, 0, 0];
        for (const c of seenCards) {
          if (c.state !== REVIEW_STATE) continue;
          const parsed = moduleSlugAndTierForItemId(c.itemId);
          if (!parsed || parsed.slug !== slug) continue;
          next[parsed.tier - 1] += 1;
        }
        if (!cancelled) setTierCorrect(next);
      } catch {
        // ignore — tile just shows 0 progress
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  const totalItems = tierTotals[0] + tierTotals[1] + tierTotals[2];
  const totalCorrect = tierCorrect[0] + tierCorrect[1] + tierCorrect[2];
  const overallPct =
    totalItems > 0 ? Math.round((totalCorrect / totalItems) * 100) : 0;

  return { overallPct, tierCorrect };
}
