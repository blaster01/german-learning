// Hand-authored curriculum content (not generated) — Relative Clauses, tier 2 (B1/B2, dative + prepositional).
import type { ExerciseItem } from "@/lib/content/schema";

const FEEDBACK = {
  correct:
    "Right — with a preposition, the relative pronoun's case is governed by that preposition, not by the main clause.",
  common: {
    "mc:wrong":
      "When a preposition precedes the relative pronoun, the preposition decides the case (mit → dative, für → accusative, etc.).",
    "grammar:relative-clause":
      "The relative pronoun's gender/number comes from the noun it refers to, but its case comes from its role inside the relative clause.",
  },
};

export const relativeClausesTier2: ExerciseItem[] = [
  {
    id: "sx-rel-t2-001",
    engine: "mc",
    prompt: "Choose the correct relative pronoun:",
    stimulus: "Der Kollege, ____ ich geholfen habe, hat sich bedankt.",
    options: ["dem", "den", "der", "die"],
    answer: 0,
    translation: "The colleague I helped said thank you.",
    feedback: FEEDBACK,
    metadata: {
      cefr: "B2",
      system: "syntax",
      module: "relative-clauses",
      tier: 2,
      tags: ["grammar:relative-clause", "mc"],
    },
  },
  {
    id: "sx-rel-t2-002",
    engine: "mc",
    prompt: "Choose the correct relative pronoun (with preposition):",
    stimulus: "Das ist der Freund, mit ____ ich verreist bin.",
    options: ["dem", "den", "der", "die"],
    answer: 0,
    translation: "That's the friend I traveled with.",
    feedback: FEEDBACK,
    metadata: {
      cefr: "B2",
      system: "syntax",
      module: "relative-clauses",
      tier: 2,
      tags: ["grammar:relative-clause", "mc"],
    },
  },
  {
    id: "sx-rel-t2-003",
    engine: "mc",
    prompt: "Choose the correct relative pronoun (with preposition):",
    stimulus: "Die Firma, für ____ ich arbeite, ist sehr bekannt.",
    options: ["die", "der", "den", "dem"],
    answer: 0,
    translation: "The company I work for is very well known.",
    feedback: FEEDBACK,
    metadata: {
      cefr: "B2",
      system: "syntax",
      module: "relative-clauses",
      tier: 2,
      tags: ["grammar:relative-clause", "mc"],
    },
  },
  {
    id: "sx-rel-t2-004",
    engine: "mc",
    prompt: "Choose the correct relative pronoun (plural dative):",
    stimulus: "Die Nachbarn, ____ wir oft helfen, sind sehr nett.",
    options: ["denen", "die", "der", "deren"],
    answer: 0,
    translation: "The neighbors we often help are very nice.",
    feedback: FEEDBACK,
    metadata: {
      cefr: "B2",
      system: "syntax",
      module: "relative-clauses",
      tier: 2,
      tags: ["grammar:relative-clause", "mc"],
    },
  },
  {
    id: "sx-rel-t2-005",
    engine: "mc",
    prompt: "Choose the correct relative pronoun (with preposition, plural):",
    stimulus: "Die Kollegen, mit ____ ich zusammenarbeite, sind kompetent.",
    options: ["denen", "die", "der", "das"],
    answer: 0,
    translation: "The colleagues I work with are competent.",
    feedback: FEEDBACK,
    metadata: {
      cefr: "B2",
      system: "syntax",
      module: "relative-clauses",
      tier: 2,
      tags: ["grammar:relative-clause", "mc"],
    },
  },
  {
    id: "sx-rel-t2-006",
    engine: "cloze",
    prompt: "Fill in the correct relative pronoun (with preposition):",
    stimulus: "Das Thema, über ____ wir gesprochen haben, war kompliziert.",
    answer: "das",
    translation: "The topic we talked about was complicated.",
    feedback: FEEDBACK,
    metadata: {
      cefr: "B2",
      system: "syntax",
      module: "relative-clauses",
      tier: 2,
      tags: ["grammar:relative-clause", "cloze"],
    },
  },
  {
    id: "sx-rel-t2-007",
    engine: "builder",
    prompt:
      "Build the sentence with a prepositional relative clause in the correct order:",
    tokens: ["Der", "Tisch,", "an", "dem", "wir", "sitzen,", "ist", "alt."],
    solution: ["Der", "Tisch,", "an", "dem", "wir", "sitzen,", "ist", "alt."],
    translation: "The table we're sitting at is old.",
    feedback: FEEDBACK,
    metadata: {
      cefr: "B2",
      system: "syntax",
      module: "relative-clauses",
      tier: 2,
      tags: ["grammar:relative-clause", "syntax:word-order", "builder"],
    },
  },
];
