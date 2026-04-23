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
};

export type ReviewSummary = {
  xpAwarded: number;
  streak: number;
  goalMet: boolean;
  profile: Profile;
};

export type ProgressRepo = {
  recordReview(item: ExerciseItem, ok: boolean, errorTags?: string[]): Promise<ReviewSummary>;
  getDueItems(limit: number, now?: Date): Promise<ReviewQueueEntry[]>;
  getTagStats(): Promise<TagMastery[]>;
  getProfile(): Promise<Profile>;
  setDailyGoal(xp: number): Promise<void>;
};
