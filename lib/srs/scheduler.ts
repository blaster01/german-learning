import { exerciseItemById } from "@/content/registry";
import type { ExerciseItem } from "@/lib/content/schema";
import type { ProgressRepo, TagMastery } from "@/lib/storage/repo";

const TROUBLE_THRESHOLD = 0.35;

export async function buildTodaysReview(repo: ProgressRepo, limit = 20): Promise<ExerciseItem[]> {
  const due = await repo.getDueItems(limit);
  return due.map((d) => exerciseItemById.get(d.itemId)).filter((x): x is ExerciseItem => Boolean(x));
}

export function buildTroublemakers(stats: TagMastery[], limit = 12): TagMastery[] {
  return stats
    .map((s) => ({
      ...s,
      rate: s.correct + s.wrong === 0 ? 0 : s.wrong / (s.correct + s.wrong),
    }))
    .filter((s) => s.correct + s.wrong >= 3 && s.rate >= TROUBLE_THRESHOLD)
    .sort((a, b) => b.rate - a.rate)
    .slice(0, limit);
}

export function buildWordOrderRehab(stats: TagMastery[]): TagMastery[] {
  return stats.filter((s) => s.tag.startsWith("syntax:") && s.wrong >= 2);
}

export function itemIdsMatchingTags(tags: Set<string>): string[] {
  const ids: string[] = [];
  for (const item of Array.from(exerciseItemById.values())) {
    if (item.metadata.tags.some((t) => tags.has(t))) ids.push(item.id);
  }
  return ids;
}
