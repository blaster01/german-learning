// Hand-authored curriculum content (not generated) — n-Deklination (weak masculine nouns), tier 1 (B1).
import type { ExerciseItem } from "@/lib/content/schema";

const FEEDBACK = {
  correct:
    "Right — weak masculine nouns (der Junge, der Mensch, der Name...) add -n/-en in every case except nominative singular.",
  common: {
    "mc:wrong":
      "n-Deklination nouns (mostly masculine nouns for people/animals ending in -e, plus a few irregulars like Name, Herr, Student) take -n or -en in accusative, dative, and genitive singular.",
    "cloze:in-context":
      "Check: is this the nominative subject (no ending) or any other role (add -n/-en)?",
  },
};

export const nDeklinationTier1: ExerciseItem[] = [
  {
    id: "nm-nde-t1-001",
    engine: "mc",
    prompt: "Choose the correct form (accusative):",
    stimulus: "Ich sehe den ____.",
    options: ["Jungen", "Junge", "Jung", "Junger"],
    answer: 0,
    feedback: FEEDBACK,
    metadata: {
      cefr: "B1",
      system: "nominal",
      module: "n-deklination",
      tier: 1,
      tags: ["grammar:gender", "mc"],
    },
  },
  {
    id: "nm-nde-t1-002",
    engine: "mc",
    prompt: "Choose the correct nominative form (subject):",
    stimulus: "Der ____ spielt Fußball.",
    options: ["Junge", "Jungen", "Jung", "Junger"],
    answer: 0,
    feedback: FEEDBACK,
    metadata: {
      cefr: "B1",
      system: "nominal",
      module: "n-deklination",
      tier: 1,
      tags: ["grammar:gender", "mc"],
    },
  },
  {
    id: "nm-nde-t1-003",
    engine: "mc",
    prompt: "Choose the correct form (dative):",
    stimulus: "Ich gebe dem ____ das Buch.",
    options: ["Studenten", "Student", "Studente", "Studentes"],
    answer: 0,
    feedback: FEEDBACK,
    metadata: {
      cefr: "B1",
      system: "nominal",
      module: "n-deklination",
      tier: 1,
      tags: ["grammar:gender", "mc"],
    },
  },
  {
    id: "nm-nde-t1-004",
    engine: "mc",
    prompt: "Choose the correct form (accusative):",
    stimulus: "Kennst du den ____ dort drüben?",
    options: ["Herrn", "Herr", "Herre", "Herres"],
    answer: 0,
    feedback: FEEDBACK,
    metadata: {
      cefr: "B1",
      system: "nominal",
      module: "n-deklination",
      tier: 1,
      tags: ["grammar:gender", "mc"],
    },
  },
  {
    id: "nm-nde-t1-005",
    engine: "mc",
    prompt: "Choose the correct nominative form (subject):",
    stimulus: "Der ____ hilft dem Patienten.",
    options: ["Kollege", "Kollegen", "Kolleg", "Kolleger"],
    answer: 0,
    feedback: FEEDBACK,
    metadata: {
      cefr: "B1",
      system: "nominal",
      module: "n-deklination",
      tier: 1,
      tags: ["grammar:gender", "mc"],
    },
  },
  {
    id: "nm-nde-t1-006",
    engine: "cloze",
    prompt: "Fill in the correct ending (accusative):",
    stimulus: "Sie fragt den Kolleg____ nach dem Weg.",
    answer: "en",
    feedback: FEEDBACK,
    metadata: {
      cefr: "B1",
      system: "nominal",
      module: "n-deklination",
      tier: 1,
      tags: ["grammar:gender", "cloze"],
    },
  },
  {
    id: "nm-nde-t1-007",
    engine: "cloze",
    prompt: "Fill in the correct form (dative):",
    stimulus: "Der Lehrer erklärt dem ____ die Aufgabe.",
    answer: "Studenten",
    feedback: FEEDBACK,
    metadata: {
      cefr: "B1",
      system: "nominal",
      module: "n-deklination",
      tier: 1,
      tags: ["grammar:gender", "cloze"],
    },
  },
];
