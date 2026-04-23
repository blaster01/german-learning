import { describe, it, expect } from "vitest";
import { fuzzyMatch, matchAnyFuzzy, normalizeLoose } from "@/lib/validators/fuzzy";

describe("normalizeLoose", () => {
  it("strips punctuation and lowercases", () => {
    expect(normalizeLoose("Hallo!")).toBe("hallo");
    // commas become spaces, then collapsed to a single space
    expect(normalizeLoose("Nein, danke.")).toBe("nein danke");
  });
  it("collapses internal whitespace", () => {
    // multiple spaces collapse to one
    expect(normalizeLoose("  gut  morgen  ")).toBe("gut morgen");
  });
});

describe("fuzzyMatch", () => {
  // Case and punctuation tolerance
  it("accepts exact match", () => {
    expect(fuzzyMatch("der", "der")).toBe(true);
  });
  it("accepts case difference", () => {
    expect(fuzzyMatch("Der", "der")).toBe(true);
    expect(fuzzyMatch("Ich", "ich")).toBe(true);
  });
  it("accepts trailing punctuation difference", () => {
    expect(fuzzyMatch("Hallo.", "Hallo")).toBe(true);
    expect(fuzzyMatch("Gut!", "gut")).toBe(true);
  });
  it("accepts single missing character (insertion)", () => {
    expect(fuzzyMatch("danke", "dake")).toBe(true);   // 'd' dropped
  });
  it("accepts single extra character (deletion)", () => {
    expect(fuzzyMatch("habe", "habee")).toBe(true);
  });
  it("accepts single substitution", () => {
    expect(fuzzyMatch("nicht", "necht")).toBe(true);
  });
  it("accepts transposition of adjacent chars", () => {
    expect(fuzzyMatch("weil", "wiel")).toBe(true);
  });

  // Rejects double edits
  it("rejects two substitutions", () => {
    expect(fuzzyMatch("weil", "woel")).toBe(false);   // w→w, e→o, i→e: 2 subs
  });
  it("rejects completely wrong answer", () => {
    expect(fuzzyMatch("der", "die")).toBe(false);
    expect(fuzzyMatch("nicht", "kein")).toBe(false);
  });

  // German-specific
  it("accepts umlaut near-miss (single sub)", () => {
    expect(fuzzyMatch("müde", "mude")).toBe(true);   // ü→u = 1 substitution
  });
});

describe("matchAnyFuzzy", () => {
  it("succeeds when one acceptable answer fuzzy-matches", () => {
    const r = matchAnyFuzzy(["der", "Der"], "DER");
    expect(r.ok).toBe(true);
  });
  it("succeeds with near-miss", () => {
    const r = matchAnyFuzzy(["danke"], "danko");
    expect(r.ok).toBe(true);
  });
  it("fails when no match within tolerance", () => {
    // "xyz" is multiple edits away from all options
    const r = matchAnyFuzzy(["der", "die", "das"], "xyz");
    expect(r.ok).toBe(false);
  });
  it("accepts near-miss 'den' (1 edit from 'der')", () => {
    // This IS within tolerance — typo forgiveness is intentional
    const r = matchAnyFuzzy(["der"], "den");
    expect(r.ok).toBe(true);
  });
});
