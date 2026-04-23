import type { ExerciseItem } from "@/lib/content/schema";

export const verbGovernmentTier1: ExerciseItem[] = [
  {
    id: "vb-gov-t1-01",
    engine: "mc",
    prompt: "„Ich sehe ___ Hund.“ (direct object)",
    options: ["den", "dem", "der"],
    answer: 0,
    metadata: {
      cefr: "B1",
      system: "verb",
      module: "verb-government",
      tier: 1,
      tags: ["grammar:akk", "grammar:verb-government"],
    },
  },
  {
    id: "vb-gov-t1-02",
    engine: "builder",
    prompt: "Build: „I help my friend.“ (helfen + Dativ)",
    tokens: ["Ich", "helfe", "meinem", "Freund"],
    solution: ["Ich", "helfe", "meinem", "Freund"],
    metadata: {
      cefr: "B1",
      system: "verb",
      module: "verb-government",
      tier: 1,
      tags: ["grammar:dat", "grammar:verb-government"],
    },
  },
];
