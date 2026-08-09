// Hand-authored curriculum content (not generated) — Two-Way Prepositions, tier 3 (B2/C1, contractions + transform).
import type { ExerciseItem } from "@/lib/content/schema";

const FEEDBACK = {
  correct:
    "Right — contracted forms (am, im, ans, ins, aufs, beim) are standard in everyday German and still encode the case.",
  common: {
    "transform:wrong":
      "Preposition + dative article often contracts: an dem→am, in dem→im, bei dem→beim; preposition + accusative: an das→ans, in das→ins, auf das→aufs.",
    "mc:wrong":
      "Contracted prepositions still follow the same wohin?/wo? case rule — am/im/beim are always dative, ans/ins/aufs are always accusative.",
  },
};

export const twoWayPrepositionsTier3: ExerciseItem[] = [
  {
    id: "nm-2wp-t3-001",
    engine: "transform",
    prompt: "Rewrite using the contracted preposition form:",
    stimulus: "Wir treffen uns in dem Café.",
    answer: "Wir treffen uns im Café.",
    translation: "We're meeting at the café.",
    feedback: FEEDBACK,
    metadata: {
      cefr: "B2",
      system: "nominal",
      module: "two-way-prepositions",
      tier: 3,
      tags: ["grammar:preposition-case", "transform"],
    },
  },
  {
    id: "nm-2wp-t3-002",
    engine: "transform",
    prompt: "Rewrite using the contracted preposition form:",
    stimulus: "Er geht an das Fenster.",
    answer: "Er geht ans Fenster.",
    translation: "He's walking over to the window.",
    feedback: FEEDBACK,
    metadata: {
      cefr: "B2",
      system: "nominal",
      module: "two-way-prepositions",
      tier: 3,
      tags: ["grammar:preposition-case", "transform"],
    },
  },
  {
    id: "nm-2wp-t3-003",
    engine: "transform",
    prompt: "Rewrite using the contracted preposition form:",
    stimulus: "Das Poster hängt an dem Schrank.",
    answer: "Das Poster hängt am Schrank.",
    translation: "The poster is hanging on the cabinet.",
    feedback: FEEDBACK,
    metadata: {
      cefr: "B2",
      system: "nominal",
      module: "two-way-prepositions",
      tier: 3,
      tags: ["grammar:preposition-case", "transform"],
    },
  },
  {
    id: "nm-2wp-t3-004",
    engine: "transform",
    prompt: "Rewrite using the contracted preposition form:",
    stimulus: "Sie legt das Handy auf das Regal.",
    answer: "Sie legt das Handy aufs Regal.",
    translation: "She's putting the phone on the shelf.",
    feedback: FEEDBACK,
    metadata: {
      cefr: "B2",
      system: "nominal",
      module: "two-way-prepositions",
      tier: 3,
      tags: ["grammar:preposition-case", "transform"],
    },
  },
  {
    id: "nm-2wp-t3-005",
    engine: "mc",
    prompt: "Choose the correctly contracted, grammatical sentence:",
    options: [
      "Ich bin beim Arzt.",
      "Ich bin beim Arzt gegangen dem.",
      "Ich bin bei das Arzt.",
      "Ich bin beim Arzt das.",
    ],
    answer: 0,
    translation: "I'm at the doctor's.",
    feedback: FEEDBACK,
    metadata: {
      cefr: "B2",
      system: "nominal",
      module: "two-way-prepositions",
      tier: 3,
      tags: ["grammar:preposition-case", "mc"],
    },
  },
  {
    id: "nm-2wp-t3-006",
    engine: "mc",
    prompt:
      "Choose the correct temporal preposition + case (C1 nuance: 'in' with months/years):",
    stimulus: "Wir fahren im Sommer an d____ See.",
    options: ["en", "em", "er", "es"],
    answer: 0,
    translation: "In the summer we go to the lake.",
    feedback: FEEDBACK,
    metadata: {
      cefr: "C1",
      system: "nominal",
      module: "two-way-prepositions",
      tier: 3,
      tags: ["grammar:preposition-case", "mc"],
    },
  },
];
