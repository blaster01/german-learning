import Dexie, { type Table } from "dexie";
import type { Card } from "ts-fsrs";
import type { ExerciseItem } from "@/lib/content/schema";
import { gradeCard, newCard } from "@/lib/srs/fsrs-helpers";
import type { Profile, ProgressRepo, ReviewQueueEntry, ReviewSummary, SeenCard, TagMastery } from "@/lib/storage/repo";
import { daysBetween, todayKey, yesterdayKey } from "@/lib/date/day";

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
    last_review: row.last_review != null ? new Date(row.last_review) : undefined,
  };
}

/* ------------------------------------------------------------------ */
/*  Dexie schema                                                        */
/* ------------------------------------------------------------------ */

type ItemCardRow = { itemId: string; card: SerializedCard };
type TagStatRow = { tag: string; correct: number; wrong: number };
type ProfileRow = { id: "profile" } & Profile;

class GermanLearningDB extends Dexie {
  itemCards!: Table<ItemCardRow, string>;
  tagStats!: Table<TagStatRow, string>;
  profile!: Table<ProfileRow, string>;

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
  }
}

let dbInstance: GermanLearningDB | null = null;

function getDb(): GermanLearningDB {
  if (!dbInstance) dbInstance = new GermanLearningDB();
  return dbInstance;
}

/* ------------------------------------------------------------------ */
/*  Default profile                                                     */
/* ------------------------------------------------------------------ */

function defaultProfile(): ProfileRow {
  return {
    id: "profile",
    xp: 0,
    streak: 0,
    longestStreak: 0,
    lastReviewDate: null,
    todayDate: null,
    todayXp: 0,
    dailyGoal: 50,
  };
}

const XP_CORRECT = 10;
const XP_WRONG = 2;

/* ------------------------------------------------------------------ */
/*  Repository                                                          */
/* ------------------------------------------------------------------ */

export class LocalProgressRepo implements ProgressRepo {
  private db = getDb();

  async recordReview(item: ExerciseItem, ok: boolean, _errorTags?: string[]): Promise<ReviewSummary> {
    /* 1. update FSRS card */
    const now = new Date();
    const row = await this.db.itemCards.get(item.id);
    const card = row ? deserializeCard(row.card) : newCard(now);
    const next = gradeCard(card, now, ok);
    await this.db.itemCards.put({ itemId: item.id, card: serializeCard(next) });

    /* 2. update tag stats */
    for (const tag of item.metadata.tags) {
      const cur = (await this.db.tagStats.get(tag)) ?? { tag, correct: 0, wrong: 0 };
      if (ok) cur.correct += 1;
      else cur.wrong += 1;
      await this.db.tagStats.put(cur);
    }

    /* 3. update profile / XP / streak */
    const prof = (await this.db.profile.get("profile")) ?? defaultProfile();
    const today = todayKey();
    const xpAwarded = ok ? XP_CORRECT : XP_WRONG;

    // rollover if we crossed midnight
    if (prof.todayDate !== null && prof.todayDate !== today) {
      // we lost yesterday's daily session — just reset todayXp; streak handled below
      prof.todayXp = 0;
    }
    prof.todayDate = today;
    prof.xp += xpAwarded;
    prof.todayXp += xpAwarded;

    // streak logic
    if (prof.lastReviewDate === null) {
      prof.streak = 1;
    } else if (prof.lastReviewDate === today) {
      // same day — no change to streak count
    } else {
      const gap = daysBetween(prof.lastReviewDate, today);
      if (gap === 1) {
        // consecutive day
        prof.streak += 1;
      } else if (gap > 1) {
        // broke the streak
        prof.streak = 1;
      }
    }

    prof.lastReviewDate = today;
    prof.longestStreak = Math.max(prof.longestStreak, prof.streak);

    const goalMet = prof.todayXp >= prof.dailyGoal;
    await this.db.profile.put(prof);

    return { xpAwarded, streak: prof.streak, goalMet, profile: { ...prof } };
  }

  async getDueItems(limit: number, now = new Date()): Promise<ReviewQueueEntry[]> {
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
      };
    });
  }

  async getTagStats(): Promise<TagMastery[]> {
    return this.db.tagStats.toArray();
  }

  async getProfile(): Promise<Profile> {
    const row = await this.db.profile.get("profile");
    return row ?? defaultProfile();
  }

  async setDailyGoal(xp: number): Promise<void> {
    const prof = (await this.db.profile.get("profile")) ?? defaultProfile();
    prof.dailyGoal = xp;
    await this.db.profile.put(prof);
  }
}

/* ------------------------------------------------------------------ */
/*  Seeding utility                                                     */
/* ------------------------------------------------------------------ */

/** Seed FSRS cards for items that have never been seen (optional onboarding). */
export async function ensureCardsForItems(itemIds: string[]): Promise<void> {
  const db = getDb();
  const now = new Date();
  for (const itemId of itemIds) {
    const exists = await db.itemCards.get(itemId);
    if (!exists) {
      const card = newCard(now);
      await db.itemCards.put({ itemId, card: serializeCard(card) });
    }
  }
}
