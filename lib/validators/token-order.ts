import { failure, success, type ValidationResult } from "./types";
import { normalizeGermanText } from "./normalize";

/** Compare two ordered token lists (same length) */
export function validateTokenOrder(expected: string[], attempt: unknown): ValidationResult {
  if (!Array.isArray(attempt) || !attempt.every((t) => typeof t === "string")) {
    return failure(["order:invalid"], "Build a sentence from the tokens.");
  }
  if (attempt.length !== expected.length) {
    return failure(["order:length"], "Wrong number of tokens.");
  }
  for (let i = 0; i < expected.length; i++) {
    if (normalizeGermanText(attempt[i]!) !== normalizeGermanText(expected[i]!)) {
      return failure(["order:token"], "Token order or choice is wrong.");
    }
  }
  return success();
}
