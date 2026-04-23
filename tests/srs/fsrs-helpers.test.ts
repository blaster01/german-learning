import { describe, expect, it } from "vitest";
import { gradeCard, newCard } from "@/lib/srs/fsrs-helpers";

describe("fsrs-helpers", () => {
  it("grades a card without throwing", () => {
    const now = new Date();
    const c = newCard(now);
    const next = gradeCard(c, now, true);
    expect(next.due.getTime()).toBeGreaterThanOrEqual(now.getTime());
  });
});
