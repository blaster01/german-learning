// Hand-authored curriculum content (not generated) — Adjective Endings, tier 1 (B1, nominative/accusative, definite article).
import type { ExerciseItem } from "@/lib/content/schema";

const FEEDBACK = {
  correct:
    "Right — after a der-word, the adjective ending is weak (mostly -e or -en).",
  common: {
    "mc:wrong":
      "After der/die/das/den/dem (der-words), adjectives take weak endings: -e in most singular nominative/accusative slots, -en everywhere else.",
    "cloze:in-context":
      "The ending depends on gender, case, and the article type — after a der-word, it's usually -e or -en.",
  },
};

export const adjectiveEndingsTier1: ExerciseItem[] = [
  {
    id: "nm-adj-t1-001",
    engine: "mc",
    prompt: "Choose the correct adjective ending:",
    stimulus: "Der klein____ Hund schläft.",
    options: ["e", "en", "es", "er"],
    answer: 0,
    feedback: FEEDBACK,
    metadata: {
      cefr: "B1",
      system: "nominal",
      module: "adjective-endings",
      tier: 1,
      tags: ["grammar:adjective-ending", "mc"],
    },
  },
  {
    id: "nm-adj-t1-002",
    engine: "mc",
    prompt: "Choose the correct adjective ending:",
    stimulus: "Ich sehe die klein____ Katze.",
    options: ["e", "en", "es", "em"],
    answer: 0,
    feedback: FEEDBACK,
    metadata: {
      cefr: "B1",
      system: "nominal",
      module: "adjective-endings",
      tier: 1,
      tags: ["grammar:adjective-ending", "mc"],
    },
  },
  {
    id: "nm-adj-t1-003",
    engine: "mc",
    prompt: "Choose the correct adjective ending:",
    stimulus: "Das klein____ Kind spielt im Garten.",
    options: ["e", "en", "es", "er"],
    answer: 0,
    feedback: FEEDBACK,
    metadata: {
      cefr: "B1",
      system: "nominal",
      module: "adjective-endings",
      tier: 1,
      tags: ["grammar:adjective-ending", "mc"],
    },
  },
  {
    id: "nm-adj-t1-004",
    engine: "mc",
    prompt: "Choose the correct adjective ending:",
    stimulus: "Ich kaufe den rot____ Apfel.",
    options: ["en", "e", "es", "er"],
    answer: 0,
    feedback: FEEDBACK,
    metadata: {
      cefr: "B1",
      system: "nominal",
      module: "adjective-endings",
      tier: 1,
      tags: ["grammar:adjective-ending", "mc"],
    },
  },
  {
    id: "nm-adj-t1-005",
    engine: "mc",
    prompt: "Choose the correct adjective ending:",
    stimulus: "Die neu____ Studenten sitzen vorne.",
    options: ["en", "e", "es", "er"],
    answer: 0,
    feedback: FEEDBACK,
    metadata: {
      cefr: "B1",
      system: "nominal",
      module: "adjective-endings",
      tier: 1,
      tags: ["grammar:adjective-ending", "mc"],
    },
  },
  {
    id: "nm-adj-t1-006",
    engine: "cloze",
    prompt: "Fill in the correct adjective ending:",
    stimulus: "Der alt____ Mann liest die Zeitung.",
    answer: "e",
    feedback: FEEDBACK,
    metadata: {
      cefr: "B1",
      system: "nominal",
      module: "adjective-endings",
      tier: 1,
      tags: ["grammar:adjective-ending", "cloze"],
    },
  },
  {
    id: "nm-adj-t1-007",
    engine: "cloze",
    prompt: "Fill in the correct adjective ending:",
    stimulus: "Ich mag das groß____ Haus am See.",
    answer: "e",
    feedback: FEEDBACK,
    metadata: {
      cefr: "B1",
      system: "nominal",
      module: "adjective-endings",
      tier: 1,
      tags: ["grammar:adjective-ending", "cloze"],
    },
  },
  {
    id: "nm-adj-t1-008",
    engine: "cloze",
    prompt: "Fill in the correct adjective ending:",
    stimulus: "Wir besuchen die klein____ Stadt im Süden.",
    answer: "e",
    feedback: FEEDBACK,
    metadata: {
      cefr: "B1",
      system: "nominal",
      module: "adjective-endings",
      tier: 1,
      tags: ["grammar:adjective-ending", "cloze"],
    },
  },
];
