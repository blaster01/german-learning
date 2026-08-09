/** Global 1-line hints keyed by error tag prefix or full tag */
const HINTS: Record<string, string> = {
  "match:exact": "Check spelling and word order.",
  "match:any": "Compare with a natural German equivalent.",
  "case:wrong": "Re-check which case the verb or preposition needs.",
  "case:unknown": "Use Nom, Akk, Dat, or Gen.",
  "order:token":
    "German word order (V2, verb-final, Mittelfeld) often differs from English.",
  "order:length": "Use every token once in the right order.",
  "order:invalid": "Arrange all tokens into one sentence.",
  "mc:wrong": "Try again — eliminate distractors.",
  "fixit:wrong": "One grammar fix is enough; look at endings or word order.",
  "transform:wrong": "Apply the rule from the prompt exactly.",
  "timed:wrong": "Short answer — focus on the requested form.",
  // Grammar-topic tags (set in content metadata.tags, mined via errorTags fallback)
  "grammar:gender":
    "Noun gender (der/die/das) is arbitrary — memorize it with the noun.",
  "grammar:article": "Articles change by gender AND case — check both.",
  "grammar:pronoun":
    "Match the pronoun's case (who does what to whom) and the noun/person it replaces.",
  "grammar:reflexive":
    "Reflexive pronouns must agree with the subject: ich→mich, du→dich, er/sie/es/wir/sie(pl)→sich/uns, ihr→euch.",
  "syntax:word-order":
    "In a main clause the finite verb sits in position 2; in a subordinate clause it moves to the end.",
  "syntax:negation":
    '"kein" negates a bare noun; "nicht" negates verbs, adjectives, adverbs, or nouns with a definite article.',
  "connector:subordinate":
    "Subordinating connectors (weil, dass, wenn...) push the finite verb to the end of the clause.",
  "connector:main":
    "Coordinating/adverbial connectors (deshalb, trotzdem, denn...) don't send the verb to the end.",
  "meaning:de-en":
    "Watch out for false friends — words that look similar but mean something different.",
  "meaning:en-de":
    "Think of the word in a sentence, not in isolation, to narrow down the right option.",
  "cloze:in-context":
    "Use the rest of the sentence for grammatical gender/case/tense clues.",
  "mutator:pronoun-case":
    "The verb governs a specific case here — accusative and dative pronouns aren't interchangeable.",
  "mutator:v2-word-order":
    "When a sentence starts with an adverb or connector, the finite verb still needs to be in position 2, right after it.",
  // Hand-authored curriculum modules (Konjunktiv II, Passiv, adjective endings, two-way prepositions, relative clauses)
  "grammar:konjunktiv2":
    "Konjunktiv II uses its own stem forms (wäre, hätte, würde, könnte, müsste, wüsste...) — not the regular present or simple past.",
  "grammar:passiv":
    'Passive = a form of werden + Partizip II (Perfekt passive uses "worden", not "geworden"); the original object becomes the new subject.',
  "grammar:adjective-ending":
    "The ending depends on gender, case, and whether a der-word, ein-word, or no article comes before the adjective.",
  "grammar:preposition-case":
    "Wechselpräpositionen take accusative for motion/direction (wohin?) and dative for location (wo?) — some verbs always fix one case regardless.",
  "grammar:relative-clause":
    "The relative pronoun's gender/number comes from the noun it refers to, but its case comes from its role inside the relative clause.",
};

export function hintForTags(errorTags: string[]): string | undefined {
  for (const tag of errorTags) {
    if (HINTS[tag]) return HINTS[tag];
    const prefix = tag.split(":")[0];
    const byPrefix = Object.entries(HINTS).find(([k]) =>
      k.startsWith(prefix + ":"),
    );
    if (byPrefix) return byPrefix[1];
  }
  return undefined;
}
