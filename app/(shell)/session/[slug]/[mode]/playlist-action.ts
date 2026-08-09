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
};

/**
 * Server action: build a playlist server-side so the large content registry
 * never ships to the client bundle.
 */
export async function buildPlaylistAction(
  payload: PlaylistPayload,
): Promise<ExerciseItem[]> {
  const { slug, mode, seenEntries } = payload;

  const seenIds = new Map(
    seenEntries.map((e) => [
      e.itemId,
      { due: e.due, lastReview: e.lastReview },
    ]),
  );

  return buildModulePlaylist(slug, mode, seenIds, {
    now: Date.now(),
  });
}
