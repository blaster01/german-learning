import { failure, success, type ValidationResult } from "./types";
import {
  canonicalizeContractions,
  foldGermanAscii,
  foldUmlautBase,
  normalizeGermanText,
} from "./normalize";

/**
 * Loose normalization: lowercase + strip leading/trailing punctuation +
 * collapse whitespace. Keeps German umlauts/ß intact so Damerau-Levenshtein
 * can still catch near-misses like "muß" vs "muss".
 */
export function normalizeLoose(s: string): string {
  return s
    .toLowerCase()
    .replace(/[.,!?;:"'„"„()[\]{}\-–—_]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * All the normalized forms worth comparing for a given string, from least
 * to most aggressively folded: loose punctuation/whitespace normalization,
 * then contracted prepositions (zu dem → zum), then ASCII-folded umlauts/ß
 * (schön → schoen, groß → gross). These three are all treated as equally
 * "exact" — they're just different valid spellings of the same word.
 */
function exactForms(s: string): string[] {
  const loose = normalizeLoose(s);
  const contracted = canonicalizeContractions(loose);
  const digraph = foldGermanAscii(contracted);
  return Array.from(new Set([loose, contracted, digraph]));
}

/**
 * The base-letter-folded form (ä/ö/ü/ß → a/o/u/ss), used both as an
 * equivalence tier of its own (dropped umlauts, e.g. "schon" for "schön")
 * and as the base string for edit-distance comparison. Unlike `exactForms`,
 * a match found only through this fold is a real spelling difference and
 * should be flagged to the learner rather than silently accepted.
 */
function umlautBaseForm(s: string): string {
  return foldUmlautBase(canonicalizeContractions(normalizeLoose(s)));
}

/**
 * Damerau–Levenshtein distance capped at 2 (early-exit).
 * Returns the distance or 2 if distance > 1.
 */
function damerauLevenshtein(a: string, b: string): number {
  if (a === b) return 0;
  const la = a.length;
  const lb = b.length;
  if (Math.abs(la - lb) > 1) return 2; // length diff alone exceeds cap

  // Full DP for short strings (most exercise answers are <= 30 chars)
  const dp: number[][] = Array.from({ length: la + 1 }, (_, i) =>
    Array.from({ length: lb + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0)),
  );

  for (let i = 1; i <= la; i++) {
    for (let j = 1; j <= lb; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i]![j] = Math.min(
        dp[i - 1]![j]! + 1, // deletion
        dp[i]![j - 1]! + 1, // insertion
        dp[i - 1]![j - 1]! + cost, // substitution
      );
      // transposition
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) {
        dp[i]![j] = Math.min(dp[i]![j]!, dp[i - 2]![j - 2]! + cost);
      }
    }
    // Full early-exit: if entire row min > 1 we know overall > 1
    const rowMin = Math.min(...dp[i]!);
    if (rowMin > 1) return 2;
  }

  return Math.min(dp[la]![lb]!, 2);
}

/**
 * Short closed-class words where a 1-character difference is usually a
 * *different, grammatically significant* word rather than a typo — e.g.
 * "der" vs "den" (nominative vs accusative), "mich" vs "dich" (person),
 * "mein" vs "dein" (possessor). These are exactly the case/agreement
 * distinctions the gender/pronoun/reflexive drills are testing, so for
 * these words we require an exact (post-normalization) match instead of
 * edit-distance tolerance. Ordinary vocabulary of the same length (e.g.
 * "danke", "habe") is unaffected and keeps typo forgiveness.
 */
const CONFUSABLE_SHORT_WORDS = new Set([
  "der",
  "die",
  "das",
  "den",
  "dem",
  "des",
  "ein",
  "eine",
  "einen",
  "einem",
  "einer",
  "eines",
  "kein",
  "keine",
  "keinen",
  "keinem",
  "keiner",
  "keines",
  "ich",
  "du",
  "er",
  "sie",
  "es",
  "wir",
  "ihr",
  "sich",
  "mich",
  "mir",
  "dich",
  "dir",
  "ihn",
  "ihm",
  "uns",
  "euch",
  "ihnen",
  "mein",
  "meine",
  "meinen",
  "meinem",
  "meiner",
  "dein",
  "deine",
  "deinen",
  "deinem",
  "deiner",
  "sein",
  "seine",
  "seinen",
  "seinem",
  "seiner",
  "unser",
  "unsere",
  "unseren",
  "unserem",
  "unserer",
  "euer",
  "eure",
  "euren",
  "eurem",
  "eurer",
]);

/** Which equivalence tier a match was found at, from strictest to loosest. */
type MatchKind = "exact" | "umlaut" | "fuzzy" | "none";

/**
 * Fuzzy match, from strictest to loosest:
 *   1. "exact" — normalizeGermanText matches, or any normalized form (loose /
 *      contraction-canonicalized / ASCII-digraph-folded) of one side equals
 *      any normalized form of the other. These are just alternate valid
 *      spellings, so no note is warranted.
 *   2. "umlaut" — the base-letter-folded forms (ä/ö/ü/ß → a/o/u/ss) match,
 *      but no exact form did. The learner dropped a diacritic instead of
 *      expanding it ("schon" for "schön"); this is accepted for full credit
 *      but is a real spelling difference worth flagging.
 *   3. "fuzzy" — Damerau-Levenshtein on the base-letter-folded forms is <= 1
 *      (covers a single missing/extra/swapped/transposed character) —
 *      unless either side is one of the CONFUSABLE_SHORT_WORDS, in which
 *      case an exact match is required so e.g. "den" is never accepted
 *      for "der".
 *
 * Intentionally NOT applied to MC or Builder engines
 * (those use tap/click, not typed input).
 */
function fuzzyMatchKind(expected: string, attempt: string): MatchKind {
  const expStd = normalizeGermanText(expected);
  const attStd = normalizeGermanText(attempt);
  if (expStd === attStd) return "exact";

  const expForms = exactForms(expected);
  const attForms = exactForms(attempt);
  for (const e of expForms) {
    for (const a of attForms) {
      if (e === a) return "exact";
    }
  }

  const expBase = umlautBaseForm(expected);
  const attBase = umlautBaseForm(attempt);
  if (expBase === attBase) return "umlaut";

  const isConfusable =
    CONFUSABLE_SHORT_WORDS.has(expBase) || CONFUSABLE_SHORT_WORDS.has(attBase);
  if (!isConfusable && expBase.length >= 2 && attBase.length >= 2) {
    if (damerauLevenshtein(expBase, attBase) <= 1) return "fuzzy";
  }

  return "none";
}

export function fuzzyMatch(expected: string, attempt: string): boolean {
  return fuzzyMatchKind(expected, attempt) !== "none";
}

/**
 * Returns success if `attempt` fuzzy-matches any entry in `acceptable`.
 * Prefers the strictest match found across all acceptable answers; if the
 * best match anywhere was only via the umlaut-base fold, the success carries
 * a note so the UI can tell the learner what happened.
 */
export function matchAnyFuzzy(
  acceptable: string[],
  attempt: string,
): ValidationResult {
  let best: MatchKind = "none";
  for (const e of acceptable) {
    const kind = fuzzyMatchKind(e, attempt);
    if (kind === "exact") return success();
    if (kind === "umlaut" && best === "none") best = "umlaut";
    if (kind === "fuzzy" && best === "none") best = "fuzzy";
  }
  if (best === "umlaut") {
    return success("Note the spelling — this word has an umlaut (ä/ö/ü) or ß.");
  }
  if (best === "fuzzy") return success();
  return failure(["match:any"], "Does not match any acceptable answer.");
}
