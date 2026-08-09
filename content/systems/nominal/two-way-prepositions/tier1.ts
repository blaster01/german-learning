// Hand-authored curriculum content (not generated) — Two-Way Prepositions, tier 1 (B1, accusative vs. dative).
import type { ExerciseItem } from "@/lib/content/schema";

const FEEDBACK = {
  correct:
    "Right — motion/direction (wohin?) takes accusative, location (wo?) takes dative.",
  common: {
    "mc:wrong":
      "Ask wohin? (motion into/onto somewhere) → accusative. Ask wo? (already there) → dative.",
    "cloze:in-context":
      "Wechselpräpositionen (an, auf, in, hinter, neben, über, unter, vor, zwischen) take accusative for motion and dative for location.",
  },
};

export const twoWayPrepositionsTier1: ExerciseItem[] = [
  {
    id: "nm-2wp-t1-001",
    engine: "mc",
    prompt: "Choose the correct article (location — 'wo?'):",
    stimulus: "Das Buch liegt auf d____ Tisch.",
    options: ["em", "en", "er", "es"],
    answer: 0,
    feedback: FEEDBACK,
    metadata: {
      cefr: "B1",
      system: "nominal",
      module: "two-way-prepositions",
      tier: 1,
      tags: ["grammar:preposition-case", "mc"],
    },
  },
  {
    id: "nm-2wp-t1-002",
    engine: "mc",
    prompt: "Choose the correct article (motion — 'wohin?'):",
    stimulus: "Ich lege das Buch auf d____ Tisch.",
    options: ["en", "em", "er", "es"],
    answer: 0,
    feedback: FEEDBACK,
    metadata: {
      cefr: "B1",
      system: "nominal",
      module: "two-way-prepositions",
      tier: 1,
      tags: ["grammar:preposition-case", "mc"],
    },
  },
  {
    id: "nm-2wp-t1-003",
    engine: "mc",
    prompt: "Choose the correct article (location):",
    stimulus: "Die Kinder spielen in d____ Garten.",
    options: ["em", "en", "er", "es"],
    answer: 0,
    feedback: FEEDBACK,
    metadata: {
      cefr: "B1",
      system: "nominal",
      module: "two-way-prepositions",
      tier: 1,
      tags: ["grammar:preposition-case", "mc"],
    },
  },
  {
    id: "nm-2wp-t1-004",
    engine: "mc",
    prompt: "Choose the correct article (motion):",
    stimulus: "Die Kinder laufen in d____ Garten.",
    options: ["en", "em", "er", "es"],
    answer: 0,
    feedback: FEEDBACK,
    metadata: {
      cefr: "B1",
      system: "nominal",
      module: "two-way-prepositions",
      tier: 1,
      tags: ["grammar:preposition-case", "mc"],
    },
  },
  {
    id: "nm-2wp-t1-005",
    engine: "mc",
    prompt: "Choose the correct article (location):",
    stimulus: "Das Bild hängt an d____ Wand.",
    options: ["er", "em", "en", "es"],
    answer: 0,
    feedback: FEEDBACK,
    metadata: {
      cefr: "B1",
      system: "nominal",
      module: "two-way-prepositions",
      tier: 1,
      tags: ["grammar:preposition-case", "mc"],
    },
  },
  {
    id: "nm-2wp-t1-006",
    engine: "mc",
    prompt: "Choose the correct article (motion):",
    stimulus: "Ich hänge das Bild an d____ Wand.",
    options: ["ie", "er", "em", "es"],
    answer: 0,
    feedback: FEEDBACK,
    metadata: {
      cefr: "B1",
      system: "nominal",
      module: "two-way-prepositions",
      tier: 1,
      tags: ["grammar:preposition-case", "mc"],
    },
  },
  {
    id: "nm-2wp-t1-007",
    engine: "cloze",
    prompt: "Fill in the correct article ending (location, 'unter'):",
    stimulus: "Die Katze schläft unter d____ Bett.",
    answer: "em",
    feedback: FEEDBACK,
    metadata: {
      cefr: "B1",
      system: "nominal",
      module: "two-way-prepositions",
      tier: 1,
      tags: ["grammar:preposition-case", "cloze"],
    },
  },
  {
    id: "nm-2wp-t1-008",
    engine: "cloze",
    prompt: "Fill in the correct article ending (motion, 'unter'):",
    stimulus: "Die Katze läuft unter d____ Bett.",
    answer: "as",
    feedback: FEEDBACK,
    metadata: {
      cefr: "B1",
      system: "nominal",
      module: "two-way-prepositions",
      tier: 1,
      tags: ["grammar:preposition-case", "cloze"],
    },
  },
];
