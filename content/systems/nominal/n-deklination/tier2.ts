// Hand-authored curriculum content (not generated) — n-Deklination, tier 2 (B1/B2, genitive + more nouns).
import type { ExerciseItem } from "@/lib/content/schema";

const FEEDBACK = {
  correct:
    "Right — weak masculine nouns take -n/-en in accusative, dative, and genitive singular, not just dative/accusative.",
  common: {
    "mc:wrong":
      "n-Deklination nouns add -n/-en in every case except nominative singular — including the genitive.",
    "cloze:in-context":
      "Check the noun's role: subject (nominative) keeps the bare form, everything else adds -n/-en.",
  },
};

export const nDeklinationTier2: ExerciseItem[] = [
  {
    id: "nm-nde-t2-001",
    engine: "mc",
    prompt: "Choose the correct form (genitive):",
    stimulus: "Das Büro des ____ ist im dritten Stock.",
    options: ["Chefs", "Chef", "Chefen", "Chefe"],
    answer: 0,
    translation: "The boss's office is on the third floor.",
    feedback: {
      correct:
        "Right — 'Chef' is a regular masculine noun (genitive -s), not an n-Deklination noun. Not every masculine noun is weak.",
      common: {
        "mc:wrong":
          "'Chef' takes the regular genitive -s ending; it's a strong masculine noun, unlike Junge/Kollege/Student.",
      },
    },
    metadata: {
      cefr: "B2",
      system: "nominal",
      module: "n-deklination",
      tier: 2,
      tags: ["grammar:gender", "mc"],
    },
  },
  {
    id: "nm-nde-t2-002",
    engine: "mc",
    prompt: "Choose the correct form (genitive, weak noun):",
    stimulus: "Das Auto des ____ wurde gestohlen.",
    options: ["Kollegen", "Kollege", "Kolleges", "Kolleg"],
    answer: 0,
    translation: "The colleague's car was stolen.",
    feedback: FEEDBACK,
    metadata: {
      cefr: "B2",
      system: "nominal",
      module: "n-deklination",
      tier: 2,
      tags: ["grammar:gender", "mc"],
    },
  },
  {
    id: "nm-nde-t2-003",
    engine: "mc",
    prompt: "Choose the correct form (accusative):",
    stimulus: "Wir besuchen den ____ im Krankenhaus.",
    options: ["Patienten", "Patient", "Patiente", "Patientes"],
    answer: 0,
    translation: "We're visiting the patient in the hospital.",
    feedback: FEEDBACK,
    metadata: {
      cefr: "B2",
      system: "nominal",
      module: "n-deklination",
      tier: 2,
      tags: ["grammar:gender", "mc"],
    },
  },
  {
    id: "nm-nde-t2-004",
    engine: "mc",
    prompt: "Choose the correct form (dative):",
    stimulus: "Sie erzählt dem ____ die ganze Geschichte.",
    options: ["Nachbarn", "Nachbar", "Nachbare", "Nachbares"],
    answer: 0,
    translation: "She's telling the neighbor the whole story.",
    feedback: FEEDBACK,
    metadata: {
      cefr: "B2",
      system: "nominal",
      module: "n-deklination",
      tier: 2,
      tags: ["grammar:gender", "mc"],
    },
  },
  {
    id: "nm-nde-t2-005",
    engine: "mc",
    prompt: "Choose the correct nominative form (subject):",
    stimulus: "Der ____ wohnt seit Jahren nebenan.",
    options: ["Nachbar", "Nachbarn", "Nachbare", "Nachbars"],
    answer: 0,
    translation: "The neighbor has lived next door for years.",
    feedback: FEEDBACK,
    metadata: {
      cefr: "B2",
      system: "nominal",
      module: "n-deklination",
      tier: 2,
      tags: ["grammar:gender", "mc"],
    },
  },
  {
    id: "nm-nde-t2-006",
    engine: "cloze",
    prompt: "Fill in the correct ending (genitive):",
    stimulus: "Das ist die Meinung des Expert____.",
    answer: "en",
    translation: "That is the expert's opinion.",
    feedback: FEEDBACK,
    metadata: {
      cefr: "B2",
      system: "nominal",
      module: "n-deklination",
      tier: 2,
      tags: ["grammar:gender", "cloze"],
    },
  },
  {
    id: "nm-nde-t2-007",
    engine: "cloze",
    prompt: "Fill in the correct form (accusative):",
    stimulus: "Ich habe den ____ noch nie gesehen.",
    answer: "Herrn",
    translation: "I've never seen that gentleman before.",
    feedback: FEEDBACK,
    metadata: {
      cefr: "B2",
      system: "nominal",
      module: "n-deklination",
      tier: 2,
      tags: ["grammar:gender", "cloze"],
    },
  },
];
