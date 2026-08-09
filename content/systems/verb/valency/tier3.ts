// Hand-authored curriculum content (not generated) — Verb Valency, tier 3 (B2/C1, genitive verbs + transform).
import type { ExerciseItem } from "@/lib/content/schema";

const FEEDBACK = {
  correct:
    "Right — a small set of formal verbs (sich erinnern an +Akk, bedürfen +Gen, sich schämen +Gen/für) keep an unusual, fixed case.",
  common: {
    "mc:wrong":
      "These verbs don't follow the usual person=dative/thing=accusative pattern — their case is simply fixed and has to be memorized per verb.",
    "transform:wrong":
      "Keep the same fixed case/preposition when you restructure the sentence — valency doesn't change with word order.",
  },
};

export const valencyTier3: ExerciseItem[] = [
  {
    id: "vb-val-t3-001",
    engine: "mc",
    prompt: "Choose the correct case (sich erinnern an + accusative):",
    stimulus: "Ich erinnere mich gut an ____ Kindheit.",
    options: ["meine", "meiner", "meinen", "meines"],
    answer: 0,
    feedback: FEEDBACK,
    metadata: {
      cefr: "B2",
      system: "verb",
      module: "valency",
      tier: 3,
      tags: ["grammar:pronoun", "mc"],
    },
  },
  {
    id: "vb-val-t3-002",
    engine: "mc",
    prompt: "Choose the correct case (sich schämen + genitive, formal):",
    stimulus: "Er schämte sich sein____ Verhaltens.",
    options: ["es", "em", "en", "e"],
    answer: 0,
    feedback: FEEDBACK,
    metadata: {
      cefr: "C1",
      system: "verb",
      module: "valency",
      tier: 3,
      tags: ["grammar:pronoun", "mc"],
    },
  },
  {
    id: "vb-val-t3-003",
    engine: "mc",
    prompt: "Choose the correct case (bedürfen + genitive, formal):",
    stimulus: "Dieser Plan bedarf noch ein____ genauen Prüfung.",
    options: ["er", "e", "es", "em"],
    answer: 0,
    feedback: FEEDBACK,
    metadata: {
      cefr: "C1",
      system: "verb",
      module: "valency",
      tier: 3,
      tags: ["grammar:pronoun", "mc"],
    },
  },
  {
    id: "vb-val-t3-004",
    engine: "transform",
    prompt: "Rewrite as a single sentence, keeping the verb's fixed case:",
    stimulus: "Man muss auf die Kollegin warten. Sie kommt gleich.",
    answer: "Man muss auf die Kollegin warten, die gleich kommt.",
    feedback: FEEDBACK,
    metadata: {
      cefr: "C1",
      system: "verb",
      module: "valency",
      tier: 3,
      tags: ["grammar:pronoun", "transform"],
    },
  },
  {
    id: "vb-val-t3-005",
    engine: "cloze",
    prompt: "Fill in the correct case ending (sich erinnern an + accusative):",
    stimulus: "Erinnerst du dich noch an d____ Sommer 2010?",
    answer: "en",
    feedback: FEEDBACK,
    metadata: {
      cefr: "B2",
      system: "verb",
      module: "valency",
      tier: 3,
      tags: ["grammar:pronoun", "cloze"],
    },
  },
  {
    id: "vb-val-t3-006",
    engine: "cloze",
    prompt: "Fill in the correct dative pronoun (misstrauen + dative):",
    stimulus: "Sie misstraut ____ von Anfang an.",
    answer: "ihm",
    feedback: FEEDBACK,
    metadata: {
      cefr: "C1",
      system: "verb",
      module: "valency",
      tier: 3,
      tags: ["grammar:pronoun", "cloze"],
    },
  },
];
