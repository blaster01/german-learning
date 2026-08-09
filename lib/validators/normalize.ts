/** Lowercase, trim, collapse internal whitespace for tolerant matching */
export function normalizeGermanText(s: string): string {
  return s
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ")
    .replace(/\u00a0/g, " ");
}

export function normalizeCaseInsensitive(s: string): string {
  return normalizeGermanText(s);
}

/**
 * Fold German umlauts and ß to their ASCII digraph equivalents
 * (ä→ae, ö→oe, ü→ue, ß→ss). Used as an extra equivalence tier so answers
 * typed without German keyboard support ("schoen" for "schön") or using
 * Swiss/post-1996-reform "ss" spelling ("dass"/"muss") aren't marked wrong.
 * Input is expected to already be lowercased.
 */
export function foldGermanAscii(s: string): string {
  return s
    .replace(/ä/g, "ae")
    .replace(/ö/g, "oe")
    .replace(/ü/g, "ue")
    .replace(/ß/g, "ss");
}

/**
 * Canonicalize the small set of obligatory/common preposition+article
 * contractions so "zu dem" and "zum" (etc.) compare equal. Always folds
 * toward the contracted form. Word-boundary safe; expects lowercased input.
 */
const CONTRACTION_PATTERNS: Array<[RegExp, string]> = [
  [/\ban dem\b/g, "am"],
  [/\ban das\b/g, "ans"],
  [/\bin dem\b/g, "im"],
  [/\bin das\b/g, "ins"],
  [/\bvon dem\b/g, "vom"],
  [/\bzu dem\b/g, "zum"],
  [/\bzu der\b/g, "zur"],
  [/\bbei dem\b/g, "beim"],
];

export function canonicalizeContractions(s: string): string {
  let out = s;
  for (const [pattern, replacement] of CONTRACTION_PATTERNS) {
    out = out.replace(pattern, replacement);
  }
  return out;
}
