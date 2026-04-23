"use client";

import { useEffect, useState } from "react";

export type ModuleAvailability = {
  hasReview: boolean;
  loading: boolean;
};

/**
 * Reads the user's seen cards from IndexedDB and checks whether
 * the given module has any items the user has already answered.
 */
export function useModuleAvailability(slug: string): ModuleAvailability {
  const [hasReview, setHasReview] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { getProgressRepo } = await import("@/lib/storage/index");
        const { getModuleBySlug } = await import("@/lib/content/loader");

        const repo = await getProgressRepo();
        const mod = getModuleBySlug(slug);
        if (!mod) {
          if (!cancelled) setLoading(false);
          return;
        }

        const seenCards = await repo.getSeenCards();
        const seenIds = new Set(seenCards.map((c) => c.itemId));

        const allIds = [
          ...mod.tiers[1],
          ...mod.tiers[2],
          ...mod.tiers[3],
        ].map((i) => i.id);

        if (!cancelled) {
          setHasReview(allIds.some((id) => seenIds.has(id)));
          setLoading(false);
        }
      } catch {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [slug]);

  return { hasReview, loading };
}
