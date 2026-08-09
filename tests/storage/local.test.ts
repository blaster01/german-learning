import "fake-indexeddb/auto";
import Dexie from "dexie";
import { beforeEach, describe, expect, it } from "vitest";
import type { ExerciseItem } from "@/lib/content/schema";
import { LocalProgressRepo, __resetDbForTests } from "@/lib/storage/local";
import { todayKey } from "@/lib/date/day";

function makeItem(
  id: string,
  tags: string[] = ["grammar:gender"],
): ExerciseItem {
  return {
    id,
    engine: "mc",
    prompt: "q",
    options: ["a", "b"],
    answer: 1,
    metadata: { cefr: "B1", system: "nominal", module: "m", tier: 1, tags },
  };
}

// Give every test a clean, empty IndexedDB so state never leaks between cases.
beforeEach(async () => {
  __resetDbForTests();
  await Dexie.delete("german-learning-db");
});

describe("LocalProgressRepo.recordReview", () => {
  it("awards XP and creates a new FSRS card on first review", async () => {
    const repo = new LocalProgressRepo();
    const summary = await repo.recordReview(makeItem("a"), true, 1, []);
    expect(summary.xpAwarded).toBe(10);
    expect(summary.streak).toBe(1);

    const seen = await repo.getSeenCards();
    expect(seen).toHaveLength(1);
    expect(seen[0]!.itemId).toBe("a");
  });

  it("awards fewer XP for a wrong (exhausted) answer", async () => {
    const repo = new LocalProgressRepo();
    const summary = await repo.recordReview(makeItem("a"), false, 3, [
      "mc:wrong",
    ]);
    expect(summary.xpAwarded).toBe(2);
  });

  it("accumulates todayXp and total xp across multiple reviews", async () => {
    const repo = new LocalProgressRepo();
    await repo.recordReview(makeItem("a"), true, 1);
    await repo.recordReview(makeItem("b"), true, 1);
    const profile = await repo.getProfile();
    expect(profile.xp).toBe(20);
    expect(profile.todayXp).toBe(20);
  });

  it("starts the streak at 1 on the first-ever review and keeps it on same-day reviews", async () => {
    const repo = new LocalProgressRepo();
    await repo.recordReview(makeItem("a"), true, 1);
    const summary = await repo.recordReview(makeItem("b"), true, 1);
    expect(summary.streak).toBe(1);
    expect(summary.profile.lastReviewDate).toBe(todayKey());
  });

  it("tracks tag stats across correct and wrong answers", async () => {
    const repo = new LocalProgressRepo();
    await repo.recordReview(makeItem("a", ["grammar:gender"]), true, 1);
    await repo.recordReview(makeItem("b", ["grammar:gender"]), false, 3);
    const stats = await repo.getTagStats();
    const genderStat = stats.find((s) => s.tag === "grammar:gender");
    expect(genderStat).toEqual({ tag: "grammar:gender", correct: 1, wrong: 1 });
  });

  it("increments newCardsToday only for items never seen before", async () => {
    const repo = new LocalProgressRepo();
    await repo.recordReview(makeItem("a"), true, 1);
    await repo.recordReview(makeItem("a"), true, 1); // same item again — not "new" this time
    expect(await repo.getNewCardsToday()).toBe(1);
  });

  it("appends every review to the review log, newest first", async () => {
    const repo = new LocalProgressRepo();
    await repo.recordReview(makeItem("a"), true, 1, []);
    await repo.recordReview(makeItem("b"), false, 2, ["mc:wrong"]);
    const log = await repo.getRecentReviews();
    expect(log).toHaveLength(2);
    expect(log[0]!.itemId).toBe("b");
    expect(log[1]!.itemId).toBe("a");
  });
});

describe("LocalProgressRepo.setDailyGoal / getProfile", () => {
  it("persists a custom daily goal", async () => {
    const repo = new LocalProgressRepo();
    await repo.setDailyGoal(100);
    const profile = await repo.getProfile();
    expect(profile.dailyGoal).toBe(100);
  });

  it("returns sensible defaults before any review is recorded", async () => {
    const repo = new LocalProgressRepo();
    const profile = await repo.getProfile();
    expect(profile.xp).toBe(0);
    expect(profile.streak).toBe(0);
    expect(profile.dailyGoal).toBe(50);
  });
});

describe("LocalProgressRepo export/import", () => {
  it("round-trips all data through exportData/importData", async () => {
    const repo = new LocalProgressRepo();
    await repo.recordReview(makeItem("a"), true, 1, []);
    await repo.setDailyGoal(80);

    const backup = await repo.exportData();

    __resetDbForTests();
    await Dexie.delete("german-learning-db");

    const repo2 = new LocalProgressRepo();
    await repo2.recordReview(makeItem("z"), false, 3, []); // pre-existing unrelated data
    await repo2.importData(backup);

    const seen = await repo2.getSeenCards();
    expect(seen.map((c) => c.itemId)).toEqual(["a"]);
    const profile = await repo2.getProfile();
    expect(profile.dailyGoal).toBe(80);
  });

  it("throws on a malformed backup", async () => {
    const repo = new LocalProgressRepo();
    await expect(repo.importData(null)).rejects.toThrow();
    await expect(repo.importData("not an object")).rejects.toThrow();
  });
});
