"use client";

import { useEffect, useState } from "react";

export type ModuleAvailability = {
  hasReview: boolean;
  loading: boolean;
};

/**
 * Reads the user's seen cards from IndexedDB and checks whether the given
 * module has any items the user has already answered. Uses the id-prefix
 * map in lib/content/manifest.ts (metadata only) instead of loading the
 * full content registry.
 */
export function useModuleAvailability(slug: string): ModuleAvailability {
  const [hasReview, setHasReview] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { getProgressRepo } = await import("@/lib/storage/index");
        const { moduleSlugForItemId } = await import("@/lib/content/manifest");

        const repo = await getProgressRepo();
        const seenCards = await repo.getSeenCards();
        const hasAny = seenCards.some(
          (c) => moduleSlugForItemId(c.itemId) === slug,
        );

        if (!cancelled) {
          setHasReview(hasAny);
          setLoading(false);
        }
      } catch {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  return { hasReview, loading };
}
