// Hand-authored curriculum content (not generated) — Adjective Endings, tier 2 (B1/B2, ein-words).
import type { ExerciseItem } from "@/lib/content/schema";

const FEEDBACK = {
  correct:
    "Right — after an ein-word, the adjective must carry the case/gender marker that the article itself lacks.",
  common: {
    "mc:wrong":
      "After ein/eine/einen/mein/dein/kein etc., the adjective takes a mixed ending — it supplies the gender/case marker the article doesn't show (e.g. masc. nom. ein → -er).",
    "cloze:in-context":
      "Ein-words don't always show gender/case, so the adjective ending fills the gap: masc. nom./neut. nom./acc. often need -er/-es; elsewhere -e or -en.",
  },
};

export const adjectiveEndingsTier2: ExerciseItem[] = [
  {
    id: "nm-adj-t2-001",
    engine: "mc",
    prompt: "Choose the correct adjective ending (masculine, nominative):",
    stimulus: "Das ist ein klein____ Garten.",
    options: ["er", "e", "en", "es"],
    answer: 0,
    feedback: FEEDBACK,
    metadata: {
      cefr: "B2",
      system: "nominal",
      module: "adjective-endings",
      tier: 2,
      tags: ["grammar:adjective-ending", "mc"],
    },
  },
  {
    id: "nm-adj-t2-002",
    engine: "mc",
    prompt: "Choose the correct adjective ending (neuter, nominative):",
    stimulus: "Das ist ein klein____ Zimmer.",
    options: ["es", "er", "en", "e"],
    answer: 0,
    feedback: FEEDBACK,
    metadata: {
      cefr: "B2",
      system: "nominal",
      module: "adjective-endings",
      tier: 2,
      tags: ["grammar:adjective-ending", "mc"],
    },
  },
  {
    id: "nm-adj-t2-003",
    engine: "mc",
    prompt: "Choose the correct adjective ending (feminine, nominative):",
    stimulus: "Das ist eine schön____ Wohnung.",
    options: ["e", "er", "en", "es"],
    answer: 0,
    feedback: FEEDBACK,
    metadata: {
      cefr: "B2",
      system: "nominal",
      module: "adjective-endings",
      tier: 2,
      tags: ["grammar:adjective-ending", "mc"],
    },
  },
  {
    id: "nm-adj-t2-004",
    engine: "mc",
    prompt: "Choose the correct adjective ending (masculine, accusative):",
    stimulus: "Ich habe einen neu____ Job gefunden.",
    options: ["en", "e", "er", "es"],
    answer: 0,
    feedback: FEEDBACK,
    metadata: {
      cefr: "B2",
      system: "nominal",
      module: "adjective-endings",
      tier: 2,
      tags: ["grammar:adjective-ending", "mc"],
    },
  },
  {
    id: "nm-adj-t2-005",
    engine: "mc",
    prompt: "Choose the correct adjective ending:",
    stimulus: "Mein alt____ Auto ist kaputt.",
    options: ["es", "er", "en", "e"],
    answer: 0,
    feedback: FEEDBACK,
    metadata: {
      cefr: "B2",
      system: "nominal",
      module: "adjective-endings",
      tier: 2,
      tags: ["grammar:adjective-ending", "mc"],
    },
  },
  {
    id: "nm-adj-t2-006",
    engine: "cloze",
    prompt: "Fill in the correct adjective ending:",
    stimulus: "Sie hat keine gut____ Ausrede.",
    answer: "e",
    feedback: FEEDBACK,
    metadata: {
      cefr: "B2",
      system: "nominal",
      module: "adjective-endings",
      tier: 2,
      tags: ["grammar:adjective-ending", "cloze"],
    },
  },
  {
    id: "nm-adj-t2-007",
    engine: "cloze",
    prompt: "Fill in the correct adjective ending:",
    stimulus: "Das war ein interessant____ Film.",
    answer: "er",
    feedback: FEEDBACK,
    metadata: {
      cefr: "B2",
      system: "nominal",
      module: "adjective-endings",
      tier: 2,
      tags: ["grammar:adjective-ending", "cloze"],
    },
  },
];
