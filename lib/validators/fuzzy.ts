import { failure, success, type ValidationResult } from "./types";
import { normalizeGermanText } from "./normalize";

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
 * Damerau–Levenshtein distance capped at 2 (early-exit).
 * Returns the distance or 2 if distance > 1.
 */
function damerauLevenshtein(a: string, b: string): number {
  if (a === b) return 0;
  const la = a.length;
  const lb = b.length;
  if (Math.abs(la - lb) > 1) return 2;   // length diff alone exceeds cap

  // Full DP for short strings (most exercise answers are <= 30 chars)
  const dp: number[][] = Array.from({ length: la + 1 }, (_, i) =>
    Array.from({ length: lb + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0))
  );

  for (let i = 1; i <= la; i++) {
    for (let j = 1; j <= lb; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i]![j] = Math.min(
        dp[i - 1]![j]! + 1,        // deletion
        dp[i]![j - 1]! + 1,        // insertion
        dp[i - 1]![j - 1]! + cost  // substitution
      );
      // transposition
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) {
        dp[i]![j] = Math.min(dp[i]![j]!, dp[i - 2]![j - 2]! + cost);
      }
      // Early exit: if minimum possible is already > 1 we can stop this row
      if (dp[i]![j]! > 1) {
        // Check if the whole row is already > 1; if so skip rest of row
        // (simple optimisation: just continue, result still correct)
      }
    }
    // Full early-exit: if entire row min > 1 we know overall > 1
    const rowMin = Math.min(...(dp[i]!));
    if (rowMin > 1) return 2;
  }

  return Math.min(dp[la]![lb]!, 2);
}

/**
 * Fuzzy match: accept if
 *   1. normalizeGermanText matches (case-insensitive, whitespace-collapsed), OR
 *   2. normalizeLoose matches (also strips punctuation), OR
 *   3. Damerau-Levenshtein on loose-normalized forms is <= 1
 *      (covers a single missing/extra/swapped/transposed character).
 *
 * Intentionally NOT applied to MC or Builder engines
 * (those use tap/click, not typed input).
 */
export function fuzzyMatch(expected: string, attempt: string): boolean {
  const expStd = normalizeGermanText(expected);
  const attStd = normalizeGermanText(attempt);
  if (expStd === attStd) return true;

  const expLoose = normalizeLoose(expected);
  const attLoose = normalizeLoose(attempt);
  if (expLoose === attLoose) return true;

  // Only apply edit-distance for non-trivial answers (>= 2 chars)
  if (expLoose.length >= 2 && attLoose.length >= 2) {
    if (damerauLevenshtein(expLoose, attLoose) <= 1) return true;
  }

  return false;
}

/**
 * Returns success if `attempt` fuzzy-matches any entry in `acceptable`.
 */
export function matchAnyFuzzy(acceptable: string[], attempt: string): ValidationResult {
  for (const e of acceptable) {
    if (fuzzyMatch(e, attempt)) return success();
  }
  return failure(["match:any"], "Does not match any acceptable answer.");
}
