/** Global 1-line hints keyed by error tag prefix or full tag */
const HINTS: Record<string, string> = {
  "match:exact": "Check spelling and word order.",
  "match:any": "Compare with a natural German equivalent.",
  "case:wrong": "Re-check which case the verb or preposition needs.",
  "case:unknown": "Use Nom, Akk, Dat, or Gen.",
  "order:token": "German word order (V2, verb-final, Mittelfeld) often differs from English.",
  "order:length": "Use every token once in the right order.",
  "order:invalid": "Arrange all tokens into one sentence.",
  "mc:wrong": "Try again — eliminate distractors.",
  "fixit:wrong": "One grammar fix is enough; look at endings or word order.",
  "transform:wrong": "Apply the rule from the prompt exactly.",
  "timed:wrong": "Short answer — focus on the requested form.",
};

export function hintForTags(errorTags: string[]): string | undefined {
  for (const tag of errorTags) {
    if (HINTS[tag]) return HINTS[tag];
    const prefix = tag.split(":")[0];
    const byPrefix = Object.entries(HINTS).find(([k]) => k.startsWith(prefix + ":"));
    if (byPrefix) return byPrefix[1];
  }
  return undefined;
}
