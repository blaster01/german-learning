// Hand-authored curriculum content (not generated) — Verb Valency, tier 2 (B1/B2, two-object verbs + fixed prepositions).
import type { ExerciseItem } from "@/lib/content/schema";

const FEEDBACK = {
  correct:
    "Right — this verb takes a fixed preposition (or two objects) with a case that doesn't depend on meaning.",
  common: {
    "mc:wrong":
      "Two-object verbs (geben, zeigen, schicken, erklären...) put the person in dative and the thing in accusative. Fixed-preposition verbs (warten auf, sich interessieren für, sich freuen über) always keep the same case.",
    "cloze:in-context":
      "Identify person vs. thing: the person usually gets dative, the thing accusative, with verbs like geben/zeigen/schicken.",
  },
};

export const valencyTier2: ExerciseItem[] = [
  {
    id: "vb-val-t2-001",
    engine: "mc",
    prompt:
      "Choose the correct case for the person (geben: person=dative, thing=accusative):",
    stimulus: "Ich gebe ____ das Geschenk.",
    options: ["ihr", "sie", "ihre", "sich"],
    answer: 0,
    translation: "I'm giving her the present.",
    feedback: FEEDBACK,
    metadata: {
      cefr: "B1",
      system: "verb",
      module: "valency",
      tier: 2,
      tags: ["grammar:pronoun", "mc"],
    },
  },
  {
    id: "vb-val-t2-002",
    engine: "mc",
    prompt:
      "Choose the correct case for the person (zeigen: person=dative, thing=accusative):",
    stimulus: "Er zeigt ____ den Weg.",
    options: ["uns", "wir", "unser", "uns selbst"],
    answer: 0,
    translation: "He's showing us the way.",
    feedback: FEEDBACK,
    metadata: {
      cefr: "B1",
      system: "verb",
      module: "valency",
      tier: 2,
      tags: ["grammar:pronoun", "mc"],
    },
  },
  {
    id: "vb-val-t2-003",
    engine: "mc",
    prompt:
      "Choose the correct fixed preposition case (warten auf + accusative):",
    stimulus: "Wir warten auf ____.",
    options: ["ihn", "er", "ihm", "sein"],
    answer: 0,
    translation: "We're waiting for him.",
    feedback: FEEDBACK,
    metadata: {
      cefr: "B1",
      system: "verb",
      module: "valency",
      tier: 2,
      tags: ["grammar:pronoun", "mc"],
    },
  },
  {
    id: "vb-val-t2-004",
    engine: "mc",
    prompt:
      "Choose the correct fixed preposition case (sich freuen über + accusative):",
    stimulus: "Ich freue mich über ____ Erfolg.",
    options: ["deinen", "dein", "deinem", "deines"],
    answer: 0,
    translation: "I'm happy about your success.",
    feedback: FEEDBACK,
    metadata: {
      cefr: "B1",
      system: "verb",
      module: "valency",
      tier: 2,
      tags: ["grammar:pronoun", "mc"],
    },
  },
  {
    id: "vb-val-t2-005",
    engine: "mc",
    prompt:
      "Choose the correct fixed preposition case (sich interessieren für + accusative):",
    stimulus: "Er interessiert sich für ____ Musik.",
    options: ["klassische", "klassischer", "klassischen", "klassisches"],
    answer: 0,
    translation: "He's interested in classical music.",
    feedback: FEEDBACK,
    metadata: {
      cefr: "B1",
      system: "verb",
      module: "valency",
      tier: 2,
      tags: ["grammar:pronoun", "mc"],
    },
  },
  {
    id: "vb-val-t2-006",
    engine: "cloze",
    prompt:
      "Fill in the correct dative pronoun (erklären: person=dative, thing=accusative):",
    stimulus: "Der Lehrer erklärt ____ die Regel noch einmal.",
    answer: "uns",
    translation: "The teacher is explaining the rule to us again.",
    feedback: FEEDBACK,
    metadata: {
      cefr: "B1",
      system: "verb",
      module: "valency",
      tier: 2,
      tags: ["grammar:pronoun", "cloze"],
    },
  },
  {
    id: "vb-val-t2-007",
    engine: "cloze",
    prompt:
      "Fill in the correct fixed-preposition case (sich beschweren über + accusative):",
    stimulus: "Sie beschwert sich über d____ Lärm.",
    answer: "en",
    translation: "She's complaining about the noise.",
    feedback: FEEDBACK,
    metadata: {
      cefr: "B2",
      system: "verb",
      module: "valency",
      tier: 2,
      tags: ["grammar:pronoun", "cloze"],
    },
  },
];
