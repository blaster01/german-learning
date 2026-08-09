// Hand-authored curriculum content (not generated) — Two-Way Prepositions, tier 2 (B1/B2, mixed + fixed-case verb idioms).
import type { ExerciseItem } from "@/lib/content/schema";

const FEEDBACK = {
  correct:
    "Right — some verb + preposition combinations always fix one case, regardless of literal motion or location.",
  common: {
    "mc:wrong":
      "Ask wohin?/wo? for literal placement, but note some idiomatic verb+preposition pairs (warten auf, sich freuen auf, denken an) always take accusative.",
    "cloze:in-context":
      "Fixed idioms like 'warten auf' (+Akk) and 'sich interessieren für' don't follow the literal motion/location rule — memorize them as a unit.",
  },
};

export const twoWayPrepositionsTier2: ExerciseItem[] = [
  {
    id: "nm-2wp-t2-001",
    engine: "mc",
    prompt: "Choose the correct case ending (idiom: warten auf + Akk):",
    stimulus: "Ich warte auf d____ Bus.",
    options: ["en", "em", "er", "es"],
    answer: 0,
    feedback: FEEDBACK,
    metadata: {
      cefr: "B1",
      system: "nominal",
      module: "two-way-prepositions",
      tier: 2,
      tags: ["grammar:preposition-case", "mc"],
    },
  },
  {
    id: "nm-2wp-t2-002",
    engine: "mc",
    prompt: "Choose the correct case ending (idiom: denken an + Akk):",
    stimulus: "Ich denke oft an mein____ Familie.",
    options: ["e", "en", "er", "es"],
    answer: 0,
    feedback: FEEDBACK,
    metadata: {
      cefr: "B1",
      system: "nominal",
      module: "two-way-prepositions",
      tier: 2,
      tags: ["grammar:preposition-case", "mc"],
    },
  },
  {
    id: "nm-2wp-t2-003",
    engine: "mc",
    prompt: "Choose the correct article (location, 'zwischen'):",
    stimulus: "Der Schlüssel liegt zwischen d____ Büchern.",
    options: ["en", "em", "er", "es"],
    answer: 0,
    feedback: FEEDBACK,
    metadata: {
      cefr: "B1",
      system: "nominal",
      module: "two-way-prepositions",
      tier: 2,
      tags: ["grammar:preposition-case", "mc"],
    },
  },
  {
    id: "nm-2wp-t2-004",
    engine: "mc",
    prompt: "Choose the correct article (motion, 'zwischen'):",
    stimulus: "Er stellt den Stuhl zwischen d____ Tisch und die Wand.",
    options: ["en", "em", "er", "es"],
    answer: 0,
    feedback: FEEDBACK,
    metadata: {
      cefr: "B1",
      system: "nominal",
      module: "two-way-prepositions",
      tier: 2,
      tags: ["grammar:preposition-case", "mc"],
    },
  },
  {
    id: "nm-2wp-t2-005",
    engine: "mc",
    prompt: "Choose the correct case ending (idiom: sich freuen auf + Akk):",
    stimulus: "Ich freue mich auf d____ Wochenende.",
    options: ["as", "em", "en", "er"],
    answer: 0,
    feedback: FEEDBACK,
    metadata: {
      cefr: "B1",
      system: "nominal",
      module: "two-way-prepositions",
      tier: 2,
      tags: ["grammar:preposition-case", "mc"],
    },
  },
  {
    id: "nm-2wp-t2-006",
    engine: "mc",
    prompt: "Choose the correct article (location, 'vor'):",
    stimulus: "Das Auto steht vor d____ Haus.",
    options: ["em", "en", "er", "es"],
    answer: 0,
    feedback: FEEDBACK,
    metadata: {
      cefr: "B1",
      system: "nominal",
      module: "two-way-prepositions",
      tier: 2,
      tags: ["grammar:preposition-case", "mc"],
    },
  },
  {
    id: "nm-2wp-t2-007",
    engine: "cloze",
    prompt: "Fill in the correct article ending (motion, 'über'):",
    stimulus: "Die Katze springt über d____ Zaun.",
    answer: "en",
    feedback: FEEDBACK,
    metadata: {
      cefr: "B1",
      system: "nominal",
      module: "two-way-prepositions",
      tier: 2,
      tags: ["grammar:preposition-case", "cloze"],
    },
  },
  {
    id: "nm-2wp-t2-008",
    engine: "cloze",
    prompt:
      "Fill in the correct article ending (idiom: sich interessieren für + Akk):",
    stimulus: "Er interessiert sich für d____ Politik.",
    answer: "ie",
    feedback: FEEDBACK,
    metadata: {
      cefr: "B1",
      system: "nominal",
      module: "two-way-prepositions",
      tier: 2,
      tags: ["grammar:preposition-case", "cloze"],
    },
  },
];
