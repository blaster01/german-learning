import { failure, success, type ValidationResult } from "./types";
import { normalizeGermanText } from "./normalize";

export function exactMatch(
  expected: string,
  attempt: string,
): ValidationResult {
  if (normalizeGermanText(attempt) === normalizeGermanText(expected)) {
    return success();
  }
  return failure(["match:exact"], "Not an exact match.");
}
