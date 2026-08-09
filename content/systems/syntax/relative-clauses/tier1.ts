// Hand-authored curriculum content (not generated) — Relative Clauses, tier 1 (B1, nominative/accusative).
import type { ExerciseItem } from "@/lib/content/schema";

const FEEDBACK = {
  correct:
    "Right — the relative pronoun's gender/number matches the noun it refers to, and its case matches its role inside the clause.",
  common: {
    "mc:wrong":
      "Two questions: (1) what gender/number is the noun? (2) what role does the pronoun play inside the relative clause (subject=nominative, object=accusative)?",
    "grammar:relative-clause":
      "The relative pronoun's gender/number comes from the noun it refers to, but its case comes from its role inside the relative clause.",
  },
};

export const relativeClausesTier1: ExerciseItem[] = [
  {
    id: "sx-rel-t1-001",
    engine: "mc",
    prompt: "Choose the correct relative pronoun:",
    stimulus: "Der Mann, ____ dort steht, ist mein Onkel.",
    options: ["der", "den", "dem", "die"],
    answer: 0,
    translation: "The man who is standing there is my uncle.",
    feedback: FEEDBACK,
    metadata: {
      cefr: "B1",
      system: "syntax",
      module: "relative-clauses",
      tier: 1,
      tags: ["grammar:relative-clause", "mc"],
    },
  },
  {
    id: "sx-rel-t1-002",
    engine: "mc",
    prompt: "Choose the correct relative pronoun:",
    stimulus: "Die Frau, ____ ich gestern getroffen habe, ist Ärztin.",
    options: ["die", "der", "das", "den"],
    answer: 0,
    translation: "The woman I met yesterday is a doctor.",
    feedback: FEEDBACK,
    metadata: {
      cefr: "B1",
      system: "syntax",
      module: "relative-clauses",
      tier: 1,
      tags: ["grammar:relative-clause", "mc"],
    },
  },
  {
    id: "sx-rel-t1-003",
    engine: "mc",
    prompt: "Choose the correct relative pronoun:",
    stimulus: "Das Kind, ____ im Garten spielt, heißt Lisa.",
    options: ["das", "die", "der", "den"],
    answer: 0,
    translation: "The child playing in the garden is named Lisa.",
    feedback: FEEDBACK,
    metadata: {
      cefr: "B1",
      system: "syntax",
      module: "relative-clauses",
      tier: 1,
      tags: ["grammar:relative-clause", "mc"],
    },
  },
  {
    id: "sx-rel-t1-004",
    engine: "mc",
    prompt: "Choose the correct relative pronoun:",
    stimulus: "Der Film, ____ wir gestern gesehen haben, war spannend.",
    options: ["den", "der", "dem", "die"],
    answer: 0,
    translation: "The movie we watched yesterday was exciting.",
    feedback: FEEDBACK,
    metadata: {
      cefr: "B1",
      system: "syntax",
      module: "relative-clauses",
      tier: 1,
      tags: ["grammar:relative-clause", "mc"],
    },
  },
  {
    id: "sx-rel-t1-005",
    engine: "mc",
    prompt: "Choose the correct relative pronoun:",
    stimulus: "Die Bücher, ____ auf dem Tisch liegen, gehören mir.",
    options: ["die", "der", "denen", "das"],
    answer: 0,
    translation: "The books lying on the table belong to me.",
    feedback: FEEDBACK,
    metadata: {
      cefr: "B1",
      system: "syntax",
      module: "relative-clauses",
      tier: 1,
      tags: ["grammar:relative-clause", "mc"],
    },
  },
  {
    id: "sx-rel-t1-006",
    engine: "builder",
    prompt: "Build the sentence with a relative clause in the correct order:",
    tokens: ["Der", "Mann,", "der", "dort", "steht,", "ist", "mein", "Chef."],
    solution: ["Der", "Mann,", "der", "dort", "steht,", "ist", "mein", "Chef."],
    translation: "The man standing there is my boss.",
    feedback: FEEDBACK,
    metadata: {
      cefr: "B1",
      system: "syntax",
      module: "relative-clauses",
      tier: 1,
      tags: ["grammar:relative-clause", "syntax:word-order", "builder"],
    },
  },
  {
    id: "sx-rel-t1-007",
    engine: "cloze",
    prompt: "Fill in the correct relative pronoun:",
    stimulus: "Ich kenne den Mann, ____ das Auto gehört.",
    answer: "dem",
    translation: "I know the man the car belongs to.",
    feedback: FEEDBACK,
    metadata: {
      cefr: "B1",
      system: "syntax",
      module: "relative-clauses",
      tier: 1,
      tags: ["grammar:relative-clause", "cloze"],
    },
  },
];
