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
