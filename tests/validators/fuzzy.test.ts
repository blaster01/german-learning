import { describe, it, expect } from "vitest";
import {
  fuzzyMatch,
  matchAnyFuzzy,
  normalizeLoose,
} from "@/lib/validators/fuzzy";
import {
  canonicalizeContractions,
  foldGermanAscii,
} from "@/lib/validators/normalize";

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
    expect(fuzzyMatch("danke", "dake")).toBe(true); // 'd' dropped
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
    expect(fuzzyMatch("weil", "woel")).toBe(false); // w→w, e→o, i→e: 2 subs
  });
  it("rejects completely wrong answer", () => {
    expect(fuzzyMatch("der", "die")).toBe(false);
    expect(fuzzyMatch("nicht", "kein")).toBe(false);
  });

  // German-specific
  it("accepts umlaut near-miss (single sub)", () => {
    expect(fuzzyMatch("müde", "mude")).toBe(true); // ü→u = 1 substitution
  });

  it("rejects a different short grammatical word one edit away", () => {
    // "den" is a real, different case form of "der" — not a typo — so it
    // must NOT be accepted as a near-miss for a case/article drill.
    expect(fuzzyMatch("der", "den")).toBe(false);
    expect(fuzzyMatch("mich", "dich")).toBe(false);
    expect(fuzzyMatch("mein", "dein")).toBe(false);
  });

  it("still forgives typos on ordinary vocabulary of similar length", () => {
    // Same edit distance as der/den, but "dose" isn't a grammatically
    // distinct answer in this drill — plain typo tolerance still applies.
    expect(fuzzyMatch("dose", "dosr")).toBe(true);
  });

  it("accepts ASCII umlaut digraphs (non-German keyboard input)", () => {
    expect(fuzzyMatch("schön", "schoen")).toBe(true);
    expect(fuzzyMatch("für", "fuer")).toBe(true);
    expect(fuzzyMatch("Mädchen", "Maedchen")).toBe(true);
  });

  it("accepts ß/ss spelling variants", () => {
    expect(fuzzyMatch("groß", "gross")).toBe(true);
    expect(fuzzyMatch("Straße", "Strasse")).toBe(true);
  });

  it("accepts common preposition contractions either way", () => {
    expect(
      fuzzyMatch("Ich gehe zum Bahnhof.", "Ich gehe zu dem Bahnhof."),
    ).toBe(true);
    expect(fuzzyMatch("Er wohnt im Zentrum.", "Er wohnt in dem Zentrum.")).toBe(
      true,
    );
    expect(
      fuzzyMatch("Sie kommt vom Bahnhof.", "Sie kommt von dem Bahnhof."),
    ).toBe(true);
  });
});

describe("normalize helpers", () => {
  it("foldGermanAscii expands umlauts and ß", () => {
    expect(foldGermanAscii("schön")).toBe("schoen");
    expect(foldGermanAscii("müde")).toBe("muede");
    expect(foldGermanAscii("groß")).toBe("gross");
  });

  it("canonicalizeContractions folds toward the contracted form", () => {
    expect(canonicalizeContractions("ich gehe zu dem bahnhof")).toBe(
      "ich gehe zum bahnhof",
    );
    expect(canonicalizeContractions("er wohnt in dem zentrum")).toBe(
      "er wohnt im zentrum",
    );
    expect(canonicalizeContractions("schon zum bahnhof")).toBe(
      "schon zum bahnhof",
    );
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
  it("rejects 'den' as a near-miss for 'der'", () => {
    // Case forms of confusable short words must match exactly, not fuzzily.
    const r = matchAnyFuzzy(["der"], "den");
    expect(r.ok).toBe(false);
  });
});
