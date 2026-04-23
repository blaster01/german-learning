import { failure, success, type ValidationResult } from "./types";
import { normalizeGermanText } from "./normalize";

export function exactMatch(expected: string, attempt: string): ValidationResult {
  if (normalizeGermanText(attempt) === normalizeGermanText(expected)) {
    return success();
  }
  return failure(["match:exact"], "Not an exact match.");
}

export function matchAny(acceptable: string[], attempt: string): ValidationResult {
  const a = normalizeGermanText(attempt);
  for (const e of acceptable) {
    if (a === normalizeGermanText(e)) return success();
  }
  return failure(["match:any"], "Does not match any acceptable answer.");
}
