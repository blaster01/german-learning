import Dexie, { type Table } from "dexie";
import type { Card } from "ts-fsrs";
import type { ExerciseItem } from "@/lib/content/schema";
import { gradeCard, newCard, outcomeForAttempt } from "@/lib/srs/fsrs-helpers";
import {
  DEFAULT_PROFILE,
  type Profile,
  type ProgressRepo,
  type ReviewLogEntry,
  type ReviewQueueEntry,
  type ReviewSummary,
  type SeenCard,
  type TagMastery,
} from "@/lib/storage/repo";
import { daysBetween, todayKey } from "@/lib/date/day";
import { DAILY_NEW_CARD_LIMIT } from "@/lib/storage/constants";

/* ------------------------------------------------------------------ */
/*  Serialization helpers                                               */
/* ------------------------------------------------------------------ */

type SerializedCard = Omit<Card, "due" | "last_review"> & {
  due: number;
  last_review?: number | null;
};

function serializeCard(card: Card): SerializedCard {
  return {
    ...card,
    due: card.due.getTime(),
    last_review: card.last_review ? card.last_review.getTime() : null,
  };
}

function deserializeCard(row: SerializedCard): Card {
  return {
    ...row,
    due: new Date(row.due),
    last_review:
      row.last_review != null ? new Date(row.last_review) : undefined,
  };
}

/* ------------------------------------------------------------------ */
/*  Dexie schema                                                        */
/* ------------------------------------------------------------------ */

type ItemCardRow = { itemId: string; card: SerializedCard };
type TagStatRow = { tag: string; correct: number; wrong: number };
type ProfileRow = { id: "profile" } & Profile;
type ReviewLogRow = ReviewLogEntry;

/**
 * Schema version history:
 *  v1 — itemCards, tagStats
 *  v2 — + profile (XP / streak / daily goal)
 *  v3 — + reviewLog (full review history for analytics/export) and two new
 *       profile fields (newCardsToday / newCardsDate) for the daily new-card
 *       cap. Existing rows are left as-is; `getProfile()` fills in defaults
 *       for rows written before v3 (see `withProfileDefaults`).
 */
class GermanLearningDB extends Dexie {
  itemCards!: Table<ItemCardRow, string>;
  tagStats!: Table<TagStatRow, string>;
  profile!: Table<ProfileRow, string>;
  reviewLog!: Table<ReviewLogRow, number>;

  constructor() {
    super("german-learning-db");
    this.version(1).stores({
      itemCards: "itemId",
      tagStats: "tag",
    });
    this.version(2).stores({
      itemCards: "itemId",
      tagStats: "tag",
      profile: "id",
    });
    this.version(3)
      .stores({
        itemCards: "itemId",
        tagStats: "tag",
        profile: "id",
        reviewLog: "++id, itemId, ts",
      })
      .upgrade(async (tx) => {
        // Backfill new profile fields so old rows don't need optional-chaining
        // everywhere downstream.
        const table = tx.table<ProfileRow, string>("profile");
        const row = await table.get("profile");
        if (row) {
          await table.put({
            ...row,
            newCardsToday: row.newCardsToday ?? 0,
            newCardsDate: row.newCardsDate ?? null,
          });
        }
      });
  }
}

let dbInstance: GermanLearningDB | null = null;

function getDb(): GermanLearningDB {
  if (!dbInstance) dbInstance = new GermanLearningDB();
  return dbInstance;
}

/**
 * Test-only escape hatch: drop the cached Dexie connection so the next
 * `getDb()` call opens a fresh one. Used by tests (with fake-indexeddb) to
 * get an isolated database per test case after deleting the underlying
 * "german-learning-db". Not used anywhere in application code.
 */
export function __resetDbForTests(): void {
  dbInstance?.close();
  dbInstance = null;
}

/* ------------------------------------------------------------------ */
/*  Default profile                                                     */
/* ------------------------------------------------------------------ */

function defaultProfile(): ProfileRow {
  return { id: "profile", ...DEFAULT_PROFILE };
}

/** Roll `todayXp` / `newCardsToday` over to 0 if the stored day has passed, without mutating anything in the DB. */
function withRolledOverCounters(
  row: ProfileRow,
  today = todayKey(),
): ProfileRow {
  const next = { ...row };
  if (next.todayDate !== today) {
    next.todayXp = 0;
    next.todayDate = today;
  }
  if (next.newCardsDate !== today) {
    next.newCardsToday = 0;
    next.newCardsDate = today;
  }
  return next;
}

const XP_CORRECT = 10;
const XP_WRONG = 2;

/* ------------------------------------------------------------------ */
/*  Repository                                                          */
/* ------------------------------------------------------------------ */

export class LocalProgressRepo implements ProgressRepo {
  private db = getDb();

  async recordReview(
    item: ExerciseItem,
    ok: boolean,
    attempts: number,
    errorTags: string[] = [],
  ): Promise<ReviewSummary> {
    const now = new Date();
    const today = todayKey();

    return this.db.transaction(
      "rw",
      this.db.itemCards,
      this.db.tagStats,
      this.db.profile,
      this.db.reviewLog,
      async () => {
        /* 1. update FSRS card (graded on the *final* in-session outcome) */
        const row = await this.db.itemCards.get(item.id);
        const isNewCard = !row;
        const card = row ? deserializeCard(row.card) : newCard(now);
        const outcome = outcomeForAttempt(ok, attempts);
        const next = gradeCard(card, now, outcome);
        await this.db.itemCards.put({
          itemId: item.id,
          card: serializeCard(next),
        });

        /* 2. update tag stats */
        for (const tag of item.metadata.tags) {
          const cur = (await this.db.tagStats.get(tag)) ?? {
            tag,
            correct: 0,
            wrong: 0,
          };
          if (ok) cur.correct += 1;
          else cur.wrong += 1;
          await this.db.tagStats.put(cur);
        }

        /* 3. append to the review log (kept for analytics + data export) */
        await this.db.reviewLog.add({
          itemId: item.id,
          ts: now.getTime(),
          ok,
          attempts,
          errorTags,
          module: item.metadata.module,
          system: item.metadata.system,
        });

        /* 4. update profile / XP / streak / new-card budget */
        const raw = (await this.db.profile.get("profile")) ?? defaultProfile();
        const prof = withRolledOverCounters(raw, today);
        const xpAwarded = ok ? XP_CORRECT : XP_WRONG;

        prof.xp += xpAwarded;
        prof.todayXp += xpAwarded;
        if (isNewCard) prof.newCardsToday += 1;

        // streak logic
        if (prof.lastReviewDate === null) {
          prof.streak = 1;
        } else if (prof.lastReviewDate === today) {
          // same day — no change to streak count
        } else {
          const gap = daysBetween(prof.lastReviewDate, today);
          if (gap === 1) {
            prof.streak += 1;
          } else if (gap > 1) {
            prof.streak = 1;
          }
        }

        prof.lastReviewDate = today;
        prof.longestStreak = Math.max(prof.longestStreak, prof.streak);

        const goalMet = prof.todayXp >= prof.dailyGoal;
        await this.db.profile.put(prof);

        return {
          xpAwarded,
          streak: prof.streak,
          goalMet,
          profile: { ...prof },
        };
      },
    );
  }

  async getDueItems(
    limit: number,
    now = new Date(),
  ): Promise<ReviewQueueEntry[]> {
    const rows = await this.db.itemCards.toArray();
    const ts = now.getTime();
    const due = rows
      .map((r) => ({ itemId: r.itemId, due: deserializeCard(r.card).due }))
      .filter((r) => r.due.getTime() <= ts)
      .sort((a, b) => a.due.getTime() - b.due.getTime());
    return due.slice(0, limit).map((r) => ({ itemId: r.itemId, due: r.due }));
  }

  async getSeenCards(): Promise<SeenCard[]> {
    const rows = await this.db.itemCards.toArray();
    return rows.map((r) => {
      const card = deserializeCard(r.card);
      return {
        itemId: r.itemId,
        due: card.due,
        lastReview: card.last_review ?? null,
        state: card.state,
        lapses: card.lapses,
      };
    });
  }

  async getTagStats(): Promise<TagMastery[]> {
    return this.db.tagStats.toArray();
  }

  async getProfile(): Promise<Profile> {
    const row = await this.db.profile.get("profile");
    // Roll today's counters over on read too, so the header/profile never
    // shows yesterday's XP labeled "Today" before the first review of a new day.
    return withRolledOverCounters(row ?? defaultProfile());
  }

  async getNewCardsToday(): Promise<number> {
    const prof = await this.getProfile();
    return prof.newCardsToday;
  }

  async setDailyGoal(xp: number): Promise<void> {
    const prof = (await this.db.profile.get("profile")) ?? defaultProfile();
    prof.dailyGoal = xp;
    await this.db.profile.put(prof);
  }

  async getRecentReviews(limit = 100): Promise<ReviewLogEntry[]> {
    const all = await this.db.reviewLog
      .orderBy("ts")
      .reverse()
      .limit(limit)
      .toArray();
    return all;
  }

  async exportData(): Promise<unknown> {
    const [itemCards, tagStats, profile, reviewLog] = await Promise.all([
      this.db.itemCards.toArray(),
      this.db.tagStats.toArray(),
      this.db.profile.toArray(),
      this.db.reviewLog.toArray(),
    ]);
    return {
      exportedAt: new Date().toISOString(),
      version: 1,
      itemCards,
      tagStats,
      profile,
      reviewLog,
    };
  }

  async importData(data: unknown): Promise<void> {
    if (!data || typeof data !== "object")
      throw new Error("Invalid backup file.");
    const payload = data as {
      itemCards?: ItemCardRow[];
      tagStats?: TagStatRow[];
      profile?: ProfileRow[];
      reviewLog?: ReviewLogRow[];
    };

    await this.db.transaction(
      "rw",
      this.db.itemCards,
      this.db.tagStats,
      this.db.profile,
      this.db.reviewLog,
      async () => {
        await Promise.all([
          this.db.itemCards.clear(),
          this.db.tagStats.clear(),
          this.db.profile.clear(),
          this.db.reviewLog.clear(),
        ]);
        if (payload.itemCards?.length)
          await this.db.itemCards.bulkPut(payload.itemCards);
        if (payload.tagStats?.length)
          await this.db.tagStats.bulkPut(payload.tagStats);
        if (payload.profile?.length)
          await this.db.profile.bulkPut(payload.profile);
        if (payload.reviewLog?.length) {
          // Let Dexie re-assign auto-increment ids to avoid key collisions.
          await this.db.reviewLog.bulkAdd(
            payload.reviewLog.map(({ id: _id, ...rest }) => rest),
          );
        }
      },
    );
  }
}
