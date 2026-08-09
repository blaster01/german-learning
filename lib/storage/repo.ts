import type { ExerciseItem } from "@/lib/content/schema";

export type ReviewQueueEntry = {
  itemId: string;
  due: Date;
};

export type TagMastery = {
  tag: string;
  correct: number;
  wrong: number;
};

export type Profile = {
  xp: number;
  streak: number;
  longestStreak: number;
  /** YYYY-MM-DD local — last day that had any review activity */
  lastReviewDate: string | null;
  /** YYYY-MM-DD local — the day todayXp was last accumulated on */
  todayDate: string | null;
  todayXp: number;
  dailyGoal: number;
  /** Count of brand-new items introduced today, for the daily new-card cap. */
  newCardsToday: number;
  /** YYYY-MM-DD local — the day newCardsToday was last accumulated on */
  newCardsDate: string | null;
};

export type ReviewSummary = {
  xpAwarded: number;
  streak: number;
  goalMet: boolean;
  profile: Profile;
};

export type SeenCard = {
  itemId: string;
  due: Date;
  lastReview: Date | null;
  /** ts-fsrs Card.state: 0=New 1=Learning 2=Review 3=Relearning. Review == "graduated". */
  state: number;
  lapses: number;
};

export type ReviewLogEntry = {
  id?: number;
  itemId: string;
  ts: number;
  ok: boolean;
  attempts: number;
  errorTags: string[];
  module: string;
  system: string;
};

export const DEFAULT_PROFILE: Profile = {
  xp: 0,
  streak: 0,
  longestStreak: 0,
  lastReviewDate: null,
  todayDate: null,
  todayXp: 0,
  dailyGoal: 50,
  newCardsToday: 0,
  newCardsDate: null,
};

export type ProgressRepo = {
  /**
   * Record the *final* outcome of an item within a session (after any
   * in-session retries) — `attempts` is the total number of submissions it
   * took to resolve the item, used to grade FSRS as good/hard/again.
   */
  recordReview(
    item: ExerciseItem,
    ok: boolean,
    attempts: number,
    errorTags?: string[],
  ): Promise<ReviewSummary>;
  getDueItems(limit: number, now?: Date): Promise<ReviewQueueEntry[]>;
  /** Return all cards the user has ever answered (used for new/review/mixed bucketing). */
  getSeenCards(): Promise<SeenCard[]>;
  getTagStats(): Promise<TagMastery[]>;
  getProfile(): Promise<Profile>;
  setDailyGoal(xp: number): Promise<void>;
  /** Most recent review-log entries, newest first (for analytics/history). */
  getRecentReviews(limit?: number): Promise<ReviewLogEntry[]>;
  /** How many brand-new items have been introduced today (for the daily new-card cap). */
  getNewCardsToday(): Promise<number>;
  /** Export the full local dataset as a plain object, suitable for JSON.stringify. */
  exportData(): Promise<unknown>;
  /** Replace the local dataset with a previously-exported object. */
  importData(data: unknown): Promise<void>;
};
