// Hand-authored curriculum content (not generated) — Verb Valency / case government, tier 1 (B1, dative-only verbs).
import type { ExerciseItem } from "@/lib/content/schema";

const FEEDBACK = {
  correct:
    "Right — this verb always takes a dative object, even though English would use a direct object.",
  common: {
    "mc:wrong":
      "Some common verbs (helfen, danken, gratulieren, gehören, gefallen, glauben, folgen, antworten) always take dative, never accusative — regardless of English word order.",
    "cloze:in-context":
      "Check the verb first: is it one of the fixed-dative verbs (helfen, danken, gratulieren...)? Those never take accusative.",
  },
};

export const valencyTier1: ExerciseItem[] = [
  {
    id: "vb-val-t1-001",
    engine: "mc",
    prompt: "Choose the correct case (helfen + dative):",
    stimulus: "Kannst du ____ helfen?",
    options: ["mir", "mich", "ich", "meine"],
    answer: 0,
    feedback: FEEDBACK,
    metadata: {
      cefr: "B1",
      system: "verb",
      module: "valency",
      tier: 1,
      tags: ["grammar:pronoun", "mc"],
    },
  },
  {
    id: "vb-val-t1-002",
    engine: "mc",
    prompt: "Choose the correct case (danken + dative):",
    stimulus: "Ich danke ____ für die Hilfe.",
    options: ["dir", "dich", "du", "deine"],
    answer: 0,
    feedback: FEEDBACK,
    metadata: {
      cefr: "B1",
      system: "verb",
      module: "valency",
      tier: 1,
      tags: ["grammar:pronoun", "mc"],
    },
  },
  {
    id: "vb-val-t1-003",
    engine: "mc",
    prompt: "Choose the correct case (gehören + dative):",
    stimulus: "Das Buch gehört ____.",
    options: ["ihm", "ihn", "er", "es"],
    answer: 0,
    feedback: FEEDBACK,
    metadata: {
      cefr: "B1",
      system: "verb",
      module: "valency",
      tier: 1,
      tags: ["grammar:pronoun", "mc"],
    },
  },
  {
    id: "vb-val-t1-004",
    engine: "mc",
    prompt: "Choose the correct case (gefallen + dative):",
    stimulus: "Der Film gefällt ____ sehr gut.",
    options: ["ihr", "sie", "ihre", "sich"],
    answer: 0,
    feedback: FEEDBACK,
    metadata: {
      cefr: "B1",
      system: "verb",
      module: "valency",
      tier: 1,
      tags: ["grammar:pronoun", "mc"],
    },
  },
  {
    id: "vb-val-t1-005",
    engine: "mc",
    prompt: "Choose the correct case (gratulieren + dative):",
    stimulus: "Wir gratulieren ____ zum Geburtstag.",
    options: ["dir", "dich", "du", "deine"],
    answer: 0,
    feedback: FEEDBACK,
    metadata: {
      cefr: "B1",
      system: "verb",
      module: "valency",
      tier: 1,
      tags: ["grammar:pronoun", "mc"],
    },
  },
  {
    id: "vb-val-t1-006",
    engine: "cloze",
    prompt:
      "Fill in the correct dative pronoun referring to 'der Chef' (antworten + dative):",
    stimulus: "Ich antworte ____ sofort.",
    answer: "ihm",
    feedback: FEEDBACK,
    metadata: {
      cefr: "B1",
      system: "verb",
      module: "valency",
      tier: 1,
      tags: ["grammar:pronoun", "cloze"],
    },
  },
  {
    id: "vb-val-t1-007",
    engine: "cloze",
    prompt:
      "Fill in the correct dative pronoun referring to 'die Frau' (folgen + dative):",
    stimulus: "Der Hund folgt ____ überallhin.",
    answer: "ihr",
    feedback: FEEDBACK,
    metadata: {
      cefr: "B1",
      system: "verb",
      module: "valency",
      tier: 1,
      tags: ["grammar:pronoun", "cloze"],
    },
  },
];
