import type { ExerciseItem } from "@/lib/content/schema";
import { getModuleBySlug } from "@/lib/content/loader";

export type SessionMode = "new" | "mixed" | "review";

/** Serialisable card entry — dates are epoch-ms numbers, not Date objects. */
export type SeenEntry = {
  itemId: string;
  due: number;
  lastReview: number | null;
};

// ============================================================
// Deterministic daily-stable shuffle
// ============================================================

function hashStr(s: string): number {
  let h = 0x9e3779b9;
  for (let i = 0; i < s.length; i++) {
    h = Math.imul(h ^ s.charCodeAt(i), 0x9e3779b9);
  }
  return h >>> 0;
}

function mulberry32(seed: number): () => number {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let z = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    z ^= z + Math.imul(z ^ (z >>> 7), 61 | z);
    return ((z ^ (z >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffleWithSeed<T>(arr: T[], seed: string): T[] {
  const rng = mulberry32(hashStr(seed));
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    const tmp = out[i] as T;
    out[i] = out[j] as T;
    out[j] = tmp;
  }
  return out;
}

/** Stable seed that changes daily so variety rotates each day. */
function dailySeed(slug: string): string {
  const d = new Date();
  return `${slug}-${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
}

// ============================================================
// Group helpers
// ============================================================

type Group = {
  groupId: string;
  items: ExerciseItem[];
};

/** Bucket items by groupId (preserving intra-group order). */
function buildGroups(items: ExerciseItem[]): Group[] {
  const map = new Map<string, ExerciseItem[]>();
  for (const item of items) {
    const gid = item.metadata.groupId ?? item.id;
    if (!map.has(gid)) map.set(gid, []);
    map.get(gid)!.push(item);
  }
  const groups: Group[] = [];
  for (const [groupId, groupItems] of map) {
    groups.push({ groupId, items: groupItems });
  }
  return groups;
}

/** Flatten groups until we have at least `target` items (whole groups only). */
function takeGroups(groups: Group[], target: number): ExerciseItem[] {
  const out: ExerciseItem[] = [];
  for (const g of groups) {
    if (out.length >= target) break;
    out.push(...g.items);
  }
  return out;
}

// ============================================================
// Main builder — synchronous, injectable seenIds
// ============================================================

export type PlaylistOptions = {
  target?: number;
  /** Epoch ms "now", injectable for tests. */
  now?: number;
  /**
   * Remaining daily new-card budget (see DAILY_NEW_CARD_LIMIT in
   * lib/storage/local.ts). "new" items are capped at this count; undefined
   * means unlimited (used when the caller doesn't track a budget).
   */
  newCardBudget?: number;
};

/**
 * Build a session playlist for a module in new / mixed / review mode.
 *
 * `seenIds` is a map from itemId → { due, lastReview } where dates are
 * epoch-ms numbers so the map can be constructed from serialisable data
 * (server action payloads, JSON, etc.).
 *
 * Returns up to `target` items (usually 15), respecting group boundaries
 * so related exercises (same groupId) travel together.
 *
 * new    — groups where no item has a seen card, shuffled daily, capped by newCardBudget.
 * review — only items that are actually due (due <= now), sorted due-first, groups preserved.
 * mixed  — 70% new (capped) + 30% due review, interleaved, falling back if one side is empty.
 */
export function buildModulePlaylist(
  slug: string,
  mode: SessionMode,
  seenIds: ReadonlyMap<string, { due: number; lastReview: number | null }>,
  targetOrOptions: number | PlaylistOptions = 15,
): ExerciseItem[] {
  const opts: PlaylistOptions =
    typeof targetOrOptions === "number"
      ? { target: targetOrOptions }
      : targetOrOptions;
  const target = opts.target ?? 15;
  const now = opts.now ?? Date.now();

  const mod = getModuleBySlug(slug);
  if (!mod) return [];

  const allItems: ExerciseItem[] = [
    ...mod.tiers[1],
    ...mod.tiers[2],
    ...mod.tiers[3],
  ];

  const allGroups = buildGroups(allItems);

  const isDue = (itemId: string): boolean => {
    const entry = seenIds.get(itemId);
    return !!entry && entry.due <= now;
  };

  const minDue = (items: ExerciseItem[]): number =>
    Math.min(
      ...items
        .filter((i) => seenIds.has(i.id))
        .map((i) => seenIds.get(i.id)!.due),
    );

  if (mode === "new") {
    const newGroups = allGroups.filter((g) =>
      g.items.every((item) => !seenIds.has(item.id)),
    );
    const shuffled = shuffleWithSeed(newGroups, dailySeed(slug));
    const newTarget =
      opts.newCardBudget !== undefined
        ? Math.min(target, Math.max(0, opts.newCardBudget))
        : target;
    return takeGroups(shuffled, newTarget);
  }

  if (mode === "review") {
    // Only groups with at least one item actually due for review — matches
    // the "Due for review" recommendation widget on the home page, instead
    // of pulling in not-yet-due cards just because they've been seen before.
    const dueGroups = allGroups.filter((g) =>
      g.items.some((item) => isDue(item.id)),
    );
    dueGroups.sort((a, b) => minDue(a.items) - minDue(b.items));
    return takeGroups(dueGroups, target);
  }

  // mixed: 70% new (capped by newCardBudget), 30% due review
  const newTarget = Math.min(
    Math.ceil(target * 0.7),
    opts.newCardBudget !== undefined
      ? Math.max(0, opts.newCardBudget)
      : Infinity,
  );
  const reviewTarget = Math.floor(target * 0.3);

  const newGroups = shuffleWithSeed(
    allGroups.filter((g) => g.items.every((item) => !seenIds.has(item.id))),
    dailySeed(slug),
  );
  const dueGroups = allGroups
    .filter((g) => g.items.some((item) => isDue(item.id)))
    .sort((a, b) => minDue(a.items) - minDue(b.items));

  const newItems = takeGroups(newGroups, newTarget);
  const reviewItems = takeGroups(dueGroups, reviewTarget);

  if (newItems.length === 0) return reviewItems.slice(0, target);
  if (reviewItems.length === 0) return newItems.slice(0, target);

  // Interleave: 2 new, 1 review
  const interleaved: ExerciseItem[] = [];
  const ni = [...newItems];
  const ri = [...reviewItems];
  while (ni.length > 0 || ri.length > 0) {
    if (ni.length > 0) interleaved.push(ni.shift()!);
    if (ni.length > 0) interleaved.push(ni.shift()!);
    if (ri.length > 0) interleaved.push(ri.shift()!);
  }
  return interleaved.slice(0, target);
}

// ============================================================
// Mode availability check (still needs repo — kept async)
// ============================================================

import type { ProgressRepo } from "@/lib/storage/repo";

export async function isModeAvailable(
  slug: string,
  mode: SessionMode,
  repo: ProgressRepo,
): Promise<boolean> {
  if (mode === "new") return true;

  const mod = getModuleBySlug(slug);
  if (!mod) return false;

  const seenCards = await repo.getSeenCards();
  const seenSet = new Set(seenCards.map((c) => c.itemId));

  const allIds = [...mod.tiers[1], ...mod.tiers[2], ...mod.tiers[3]].map(
    (i) => i.id,
  );

  return allIds.some((id) => seenSet.has(id));
}
