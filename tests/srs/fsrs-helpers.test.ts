import { describe, expect, it } from "vitest";
import { gradeCard, newCard, outcomeForAttempt } from "@/lib/srs/fsrs-helpers";

describe("fsrs-helpers", () => {
  it("grades a card without throwing", () => {
    const now = new Date();
    const c = newCard(now);
    const next = gradeCard(c, now, "good");
    expect(next.due.getTime()).toBeGreaterThanOrEqual(now.getTime());
  });

  it("schedules a further-out due date for good than for again", () => {
    const now = new Date();
    const c = newCard(now);
    const again = gradeCard(c, now, "again");
    const good = gradeCard(c, now, "good");
    expect(good.due.getTime()).toBeGreaterThanOrEqual(again.due.getTime());
  });

  it("increments lapses on again but not on good/hard", () => {
    const now = new Date();
    const c = newCard(now);
    const again = gradeCard(c, now, "again");
    expect(again.lapses).toBeGreaterThanOrEqual(c.lapses);
  });

  describe("outcomeForAttempt", () => {
    it("maps a first-try correct answer to good", () => {
      expect(outcomeForAttempt(true, 1)).toBe("good");
    });

    it("maps a recovered correct answer to hard", () => {
      expect(outcomeForAttempt(true, 2)).toBe("hard");
      expect(outcomeForAttempt(true, 3)).toBe("hard");
    });

    it("maps an exhausted-attempts failure to again", () => {
      expect(outcomeForAttempt(false, 1)).toBe("again");
      expect(outcomeForAttempt(false, 3)).toBe("again");
    });
  });
});
