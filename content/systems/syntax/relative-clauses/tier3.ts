// Hand-authored curriculum content (not generated) — Relative Clauses, tier 3 (B2/C1, genitive + was/wo).
import type { ExerciseItem } from "@/lib/content/schema";

const FEEDBACK = {
  correct:
    "Right — dessen/deren show possession and agree with the possessor's gender, and 'was' refers back to indefinites, superlatives, or whole clauses.",
  common: {
    "mc:wrong":
      "dessen (masc./neut. possessor) and deren (fem./plural possessor) work like a genitive 'his/her/their' inside the clause; 'was' is used after alles/etwas/nichts or when referring to a whole prior clause.",
    "grammar:relative-clause":
      "The relative pronoun's gender/number comes from the noun it refers to, but its case comes from its role inside the relative clause.",
  },
};

export const relativeClausesTier3: ExerciseItem[] = [
  {
    id: "sx-rel-t3-001",
    engine: "mc",
    prompt: "Choose the correct genitive relative pronoun:",
    stimulus: "Der Mann, ____ Auto gestohlen wurde, hat Anzeige erstattet.",
    options: ["dessen", "deren", "dem", "den"],
    answer: 0,
    feedback: FEEDBACK,
    metadata: {
      cefr: "C1",
      system: "syntax",
      module: "relative-clauses",
      tier: 3,
      tags: ["grammar:relative-clause", "mc"],
    },
  },
  {
    id: "sx-rel-t3-002",
    engine: "mc",
    prompt: "Choose the correct genitive relative pronoun:",
    stimulus: "Die Frau, ____ Sohn Arzt ist, wohnt nebenan.",
    options: ["deren", "dessen", "der", "die"],
    answer: 0,
    feedback: FEEDBACK,
    metadata: {
      cefr: "C1",
      system: "syntax",
      module: "relative-clauses",
      tier: 3,
      tags: ["grammar:relative-clause", "mc"],
    },
  },
  {
    id: "sx-rel-t3-003",
    engine: "mc",
    prompt: "Choose the correct pronoun (referring to an indefinite):",
    stimulus: "Das ist alles, ____ ich weiß.",
    options: ["was", "das", "die", "der"],
    answer: 0,
    feedback: FEEDBACK,
    metadata: {
      cefr: "C1",
      system: "syntax",
      module: "relative-clauses",
      tier: 3,
      tags: ["grammar:relative-clause", "mc"],
    },
  },
  {
    id: "sx-rel-t3-004",
    engine: "mc",
    prompt:
      "Choose the correct pronoun (referring to a whole preceding clause):",
    stimulus: "Sie hat die Prüfung bestanden, ____ mich sehr gefreut hat.",
    options: ["was", "das", "die", "wer"],
    answer: 0,
    feedback: FEEDBACK,
    metadata: {
      cefr: "C1",
      system: "syntax",
      module: "relative-clauses",
      tier: 3,
      tags: ["grammar:relative-clause", "mc"],
    },
  },
  {
    id: "sx-rel-t3-005",
    engine: "mc",
    prompt: "Choose the correct relative adverb (place):",
    stimulus: "Die Stadt, ____ ich geboren bin, liegt am Rhein.",
    options: ["wo", "was", "die", "der"],
    answer: 0,
    feedback: FEEDBACK,
    metadata: {
      cefr: "C1",
      system: "syntax",
      module: "relative-clauses",
      tier: 3,
      tags: ["grammar:relative-clause", "mc"],
    },
  },
  {
    id: "sx-rel-t3-006",
    engine: "transform",
    prompt: "Combine into one sentence using a relative clause:",
    stimulus: "Ich kenne den Autor. Sein Buch wurde verfilmt.",
    answer: "Ich kenne den Autor, dessen Buch verfilmt wurde.",
    feedback: FEEDBACK,
    metadata: {
      cefr: "C1",
      system: "syntax",
      module: "relative-clauses",
      tier: 3,
      tags: ["grammar:relative-clause", "transform"],
    },
  },
  {
    id: "sx-rel-t3-007",
    engine: "transform",
    prompt: "Combine into one sentence using a relative clause:",
    stimulus: "Das ist die Kollegin. Ihr Vortrag war ausgezeichnet.",
    answer: "Das ist die Kollegin, deren Vortrag ausgezeichnet war.",
    feedback: FEEDBACK,
    metadata: {
      cefr: "C1",
      system: "syntax",
      module: "relative-clauses",
      tier: 3,
      tags: ["grammar:relative-clause", "transform"],
    },
  },
];
