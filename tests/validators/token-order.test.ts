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

  it("rejects an alternate order when no alternates are given", () => {
    expect(
      validateTokenOrder(
        ["Ich", "gehe", "trotzdem"],
        ["trotzdem", "gehe", "Ich"],
      ).ok,
    ).toBe(false);
  });

  it("accepts a provided alternate order", () => {
    const expected = ["Ich", "gehe", "trotzdem"];
    const alt = ["Trotzdem", "gehe", "ich"];
    expect(validateTokenOrder(expected, alt, [alt]).ok).toBe(true);
  });

  it("rejects an order matching neither the solution nor any alternate", () => {
    const expected = ["Ich", "gehe", "trotzdem"];
    const alt = ["Trotzdem", "gehe", "ich"];
    expect(
      validateTokenOrder(expected, ["gehe", "Ich", "trotzdem"], [alt]).ok,
    ).toBe(false);
  });
});
