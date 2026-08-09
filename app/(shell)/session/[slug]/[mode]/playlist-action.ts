"use server";

import type { ExerciseItem } from "@/lib/content/schema";
import {
  buildModulePlaylist,
  type SessionMode,
  type SeenEntry,
} from "@/lib/session/module-playlist";

export type PlaylistPayload = {
  slug: string;
  mode: SessionMode;
  seenEntries: SeenEntry[];
  /** Remaining daily new-card budget; omit for unlimited. */
  newCardBudget?: number;
};

/**
 * Server action: build a playlist server-side so the large content registry
 * never ships to the client bundle.
 */
export async function buildPlaylistAction(
  payload: PlaylistPayload,
): Promise<ExerciseItem[]> {
  const { slug, mode, seenEntries, newCardBudget } = payload;

  const seenIds = new Map(
    seenEntries.map((e) => [
      e.itemId,
      { due: e.due, lastReview: e.lastReview },
    ]),
  );

  return buildModulePlaylist(slug, mode, seenIds, {
    newCardBudget,
    now: Date.now(),
  });
}
