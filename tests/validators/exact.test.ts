import { describe, expect, it } from "vitest";
import { exactMatch, matchAny } from "@/lib/validators/exact";

describe("exactMatch", () => {
  it("accepts case-insensitive trimmed match", () => {
    expect(exactMatch("Haus", "  haus ").ok).toBe(true);
  });
  it("rejects mismatch", () => {
    const r = exactMatch("Haus", "Haus!");
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.errorTags).toContain("match:exact");
  });
});

describe("matchAny", () => {
  it("matches first acceptable", () => {
    expect(matchAny(["gehe", "geh"], "Gehe").ok).toBe(true);
  });
  it("rejects when none match", () => {
    expect(matchAny(["a", "b"], "c").ok).toBe(false);
  });
});
