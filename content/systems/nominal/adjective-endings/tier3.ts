// Hand-authored curriculum content (not generated) — Adjective Endings, tier 3 (B2/C1, dative/genitive + no article).
import type { ExerciseItem } from "@/lib/content/schema";

const FEEDBACK = {
  correct:
    "Right — in the dative/genitive, and with no article at all, the adjective often has to carry the full case marker.",
  common: {
    "mc:wrong":
      "Dative and genitive endings are almost always -en after an article; with no article, the adjective takes the strong (der-word-like) ending.",
    "transform:wrong":
      "Without an article, the adjective takes the ending the article would have had (strong declension).",
  },
};

export const adjectiveEndingsTier3: ExerciseItem[] = [
  {
    id: "nm-adj-t3-001",
    engine: "mc",
    prompt: "Choose the correct adjective ending (dative):",
    stimulus: "Ich spreche mit dem neu____ Kollegen.",
    options: ["en", "e", "er", "es"],
    answer: 0,
    translation: "I'm talking with the new colleague.",
    feedback: FEEDBACK,
    metadata: {
      cefr: "B2",
      system: "nominal",
      module: "adjective-endings",
      tier: 3,
      tags: ["grammar:adjective-ending", "mc"],
    },
  },
  {
    id: "nm-adj-t3-002",
    engine: "mc",
    prompt: "Choose the correct adjective ending (genitive):",
    stimulus: "Das Ende des lang____ Sommers naht.",
    options: ["en", "e", "er", "es"],
    answer: 0,
    translation: "The end of the long summer is approaching.",
    feedback: FEEDBACK,
    metadata: {
      cefr: "C1",
      system: "nominal",
      module: "adjective-endings",
      tier: 3,
      tags: ["grammar:adjective-ending", "mc"],
    },
  },
  {
    id: "nm-adj-t3-003",
    engine: "mc",
    prompt:
      "Choose the correct adjective ending (no article, nominative, masculine):",
    stimulus: "Frisch____ Brot schmeckt am besten.",
    options: ["es", "er", "en", "e"],
    answer: 0,
    translation: "Fresh bread tastes best.",
    feedback: FEEDBACK,
    metadata: {
      cefr: "C1",
      system: "nominal",
      module: "adjective-endings",
      tier: 3,
      tags: ["grammar:adjective-ending", "mc"],
    },
  },
  {
    id: "nm-adj-t3-004",
    engine: "mc",
    prompt:
      "Choose the correct adjective ending (no article, dative, masculine):",
    stimulus: "Mit gut____ Willen schafft man vieles.",
    options: ["em", "en", "er", "es"],
    answer: 0,
    translation: "With good will, one can accomplish a lot.",
    feedback: FEEDBACK,
    metadata: {
      cefr: "C1",
      system: "nominal",
      module: "adjective-endings",
      tier: 3,
      tags: ["grammar:adjective-ending", "mc"],
    },
  },
  {
    id: "nm-adj-t3-005",
    engine: "cloze",
    prompt: "Fill in the correct adjective ending (dative plural):",
    stimulus: "Er hilft den alt____ Leuten im Dorf.",
    answer: "en",
    translation: "He helps the old people in the village.",
    feedback: FEEDBACK,
    metadata: {
      cefr: "B2",
      system: "nominal",
      module: "adjective-endings",
      tier: 3,
      tags: ["grammar:adjective-ending", "cloze"],
    },
  },
  {
    id: "nm-adj-t3-006",
    engine: "cloze",
    prompt:
      "Fill in the correct adjective ending (no article, nominative, feminine):",
    stimulus: "Kalt____ Milch steht im Kühlschrank.",
    answer: "e",
    translation: "Cold milk is in the fridge.",
    feedback: FEEDBACK,
    metadata: {
      cefr: "C1",
      system: "nominal",
      module: "adjective-endings",
      tier: 3,
      tags: ["grammar:adjective-ending", "cloze"],
    },
  },
];
