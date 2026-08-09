// Hand-authored curriculum content (not generated) — n-Deklination, tier 3 (B2/C1, irregular 'Name'-type + transform).
import type { ExerciseItem } from "@/lib/content/schema";

const FEEDBACK = {
  correct:
    "Right — a handful of n-Deklination nouns (Name, Gedanke, Glaube, Wille, Herz) add -ns in the genitive, not just -n.",
  common: {
    "mc:wrong":
      "Name-type nouns (Name, Gedanke, Glaube, Wille) are 'gemischte Deklination': -n in acc./dat., but -ns in the genitive.",
    "transform:wrong":
      "Remember the noun's role changes its ending: subject stays bare, every other role adds -n/-en (or -ns for Name-type genitives).",
  },
};

export const nDeklinationTier3: ExerciseItem[] = [
  {
    id: "nm-nde-t3-001",
    engine: "mc",
    prompt: "Choose the correct genitive form:",
    stimulus: "Die Bedeutung des ____ war allen klar.",
    options: ["Namens", "Name", "Namen", "Names"],
    answer: 0,
    feedback: FEEDBACK,
    metadata: {
      cefr: "C1",
      system: "nominal",
      module: "n-deklination",
      tier: 3,
      tags: ["grammar:gender", "mc"],
    },
  },
  {
    id: "nm-nde-t3-002",
    engine: "mc",
    prompt: "Choose the correct accusative form:",
    stimulus: "Ich kenne seinen ____ nicht.",
    options: ["Namen", "Name", "Namens", "Nam"],
    answer: 0,
    feedback: FEEDBACK,
    metadata: {
      cefr: "C1",
      system: "nominal",
      module: "n-deklination",
      tier: 3,
      tags: ["grammar:gender", "mc"],
    },
  },
  {
    id: "nm-nde-t3-003",
    engine: "mc",
    prompt: "Choose the correct dative form:",
    stimulus: "Er folgt seinem eigenen ____.",
    options: ["Willen", "Wille", "Willens", "Will"],
    answer: 0,
    feedback: FEEDBACK,
    metadata: {
      cefr: "C1",
      system: "nominal",
      module: "n-deklination",
      tier: 3,
      tags: ["grammar:gender", "mc"],
    },
  },
  {
    id: "nm-nde-t3-004",
    engine: "fixit",
    prompt: "Find and fix the genitive ending error:",
    stimulus: "Sie war wegen dieses Gedanken beunruhigt.",
    answer: "Sie war wegen dieses Gedankens beunruhigt.",
    feedback: FEEDBACK,
    metadata: {
      cefr: "C1",
      system: "nominal",
      module: "n-deklination",
      tier: 3,
      tags: ["grammar:gender", "transform"],
    },
  },
  {
    id: "nm-nde-t3-005",
    engine: "cloze",
    prompt: "Fill in the correct genitive ending (Name-type noun):",
    stimulus: "Trotz seines guten Glaub____ zweifelte er manchmal.",
    answer: "ens",
    feedback: FEEDBACK,
    metadata: {
      cefr: "C1",
      system: "nominal",
      module: "n-deklination",
      tier: 3,
      tags: ["grammar:gender", "cloze"],
    },
  },
  {
    id: "nm-nde-t3-006",
    engine: "cloze",
    prompt: "Fill in the correct accusative ending:",
    stimulus: "Sie nannte ihren vollen Nam____.",
    answer: "en",
    feedback: FEEDBACK,
    metadata: {
      cefr: "C1",
      system: "nominal",
      module: "n-deklination",
      tier: 3,
      tags: ["grammar:gender", "cloze"],
    },
  },
];
