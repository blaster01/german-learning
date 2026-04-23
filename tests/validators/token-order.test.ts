import { describe, expect, it } from "vitest";
import { validateTokenOrder } from "@/lib/validators/token-order";

describe("validateTokenOrder", () => {
  it("accepts correct order", () => {
    expect(validateTokenOrder(["Ich", "gehe"], ["ich", "gehe"]).ok).toBe(true);
  });
  it("rejects wrong length", () => {
    expect(validateTokenOrder(["a"], ["a", "b"]).ok).toBe(false);
  });
  it("rejects non-array", () => {
    expect(validateTokenOrder(["a"], "a").ok).toBe(false);
  });
});
