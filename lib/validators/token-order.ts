import { failure, success, type ValidationResult } from "./types";
import { normalizeGermanText } from "./normalize";

function ordersMatch(expected: string[], attempt: string[]): boolean {
  if (attempt.length !== expected.length) return false;
  for (let i = 0; i < expected.length; i++) {
    if (normalizeGermanText(attempt[i]!) !== normalizeGermanText(expected[i]!))
      return false;
  }
  return true;
}

/**
 * Compare an attempted token order against the canonical `expected` order,
 * plus any grammatically valid `alternates` (e.g. an alternate Vorfeld
 * topicalization) — German frequently permits more than one correct word
 * order for the same sentence.
 */
export function validateTokenOrder(
  expected: string[],
  attempt: unknown,
  alternates: string[][] = [],
): ValidationResult {
  if (!Array.isArray(attempt) || !attempt.every((t) => typeof t === "string")) {
    return failure(["order:invalid"], "Build a sentence from the tokens.");
  }
  if (attempt.length !== expected.length) {
    return failure(["order:length"], "Wrong number of tokens.");
  }
  if (ordersMatch(expected, attempt)) return success();
  for (const alt of alternates) {
    if (ordersMatch(alt, attempt)) return success();
  }
  return failure(["order:token"], "Token order or choice is wrong.");
}
