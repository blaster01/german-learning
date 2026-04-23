export type ValidationResult =
  | { ok: true; errorTags?: never; hint?: never }
  | { ok: false; errorTags: string[]; hint?: string };

export function success(): ValidationResult {
  return { ok: true };
}

export function failure(errorTags: string[], hint?: string): ValidationResult {
  return { ok: false, errorTags, hint };
}
