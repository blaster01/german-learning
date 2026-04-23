import { describe, expect, it } from "vitest";
import type { ExerciseItem } from "@/lib/content/schema";
import { validateItem } from "@/lib/engines/registry";

const mc: ExerciseItem = {
  id: "t-mc",
  engine: "mc",
  prompt: "q",
  options: ["a", "b"],
  answer: 1,
  metadata: { cefr: "B1", system: "nominal", module: "m", tier: 1, tags: [] },
};

describe("validateItem", () => {
  it("validates mc", () => {
    expect(validateItem(mc, 1).ok).toBe(true);
    expect(validateItem(mc, 0).ok).toBe(false);
  });
});
