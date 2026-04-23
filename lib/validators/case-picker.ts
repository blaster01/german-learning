import { failure, success, type ValidationResult } from "./types";
import { normalizeGermanText } from "./normalize";

const CASES = ["nom", "akk", "dat", "gen"] as const;
export type GermanCase = (typeof CASES)[number];

export function isGermanCase(s: string): s is GermanCase {
  return CASES.includes(s.toLowerCase() as GermanCase);
}

/** attempt: short label like "akk", "dat" */
export function validateCaseSelection(expected: GermanCase, attempt: unknown): ValidationResult {
  if (typeof attempt !== "string") {
    return failure(["case:invalid-type"], "Pick a case.");
  }
  const got = attempt.toLowerCase().trim();
  if (!isGermanCase(got)) {
    return failure(["case:unknown"], "Unknown case value.");
  }
  if (got === expected.toLowerCase()) return success();
  return failure(["case:wrong"], `Expected ${expected.toUpperCase()}.`);
}
