import { failure, success, type ValidationResult } from "./types";
import {
  canonicalizeContractions,
  foldGermanAscii,
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
 * (schön → schoen, groß → gross). Order matters only for `candidateForms`'s
 * last entry, which is used as the base for edit-distance comparison.
 */
function candidateForms(s: string): string[] {
  const loose = normalizeLoose(s);
  const contracted = canonicalizeContractions(loose);
  const folded = foldGermanAscii(contracted);
  return Array.from(new Set([loose, contracted, folded]));
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

/**
 * Fuzzy match: accept if
 *   1. normalizeGermanText matches (case-insensitive, whitespace-collapsed), OR
 *   2. any normalized form (loose / contraction-canonicalized / ASCII-folded)
 *      of one side equals any normalized form of the other, OR
 *   3. Damerau-Levenshtein on the most-normalized forms is <= 1
 *      (covers a single missing/extra/swapped/transposed character) —
 *      unless either side is one of the CONFUSABLE_SHORT_WORDS, in which
 *      case an exact match is required so e.g. "den" is never accepted
 *      for "der".
 *
 * Intentionally NOT applied to MC or Builder engines
 * (those use tap/click, not typed input).
 */
export function fuzzyMatch(expected: string, attempt: string): boolean {
  const expStd = normalizeGermanText(expected);
  const attStd = normalizeGermanText(attempt);
  if (expStd === attStd) return true;

  const expForms = candidateForms(expected);
  const attForms = candidateForms(attempt);
  for (const e of expForms) {
    for (const a of attForms) {
      if (e === a) return true;
    }
  }

  const expBase = expForms[expForms.length - 1]!;
  const attBase = attForms[attForms.length - 1]!;
  const isConfusable =
    CONFUSABLE_SHORT_WORDS.has(expBase) || CONFUSABLE_SHORT_WORDS.has(attBase);
  if (!isConfusable && expBase.length >= 2 && attBase.length >= 2) {
    if (damerauLevenshtein(expBase, attBase) <= 1) return true;
  }

  return false;
}

/**
 * Returns success if `attempt` fuzzy-matches any entry in `acceptable`.
 */
export function matchAnyFuzzy(
  acceptable: string[],
  attempt: string,
): ValidationResult {
  for (const e of acceptable) {
    if (fuzzyMatch(e, attempt)) return success();
  }
  return failure(["match:any"], "Does not match any acceptable answer.");
}
