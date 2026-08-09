export type ValidationResult =
  | { ok: true; errorTags?: never; hint?: never; note?: string }
  | { ok: false; errorTags: string[]; hint?: string };

/**
 * @param note Optional note surfaced alongside a correct result, e.g.
 * flagging that the match only succeeded after folding a dropped umlaut.
 */
export function success(note?: string): ValidationResult {
  return note ? { ok: true, note } : { ok: true };
}

export function failure(errorTags: string[], hint?: string): ValidationResult {
  return { ok: false, errorTags, hint };
}
