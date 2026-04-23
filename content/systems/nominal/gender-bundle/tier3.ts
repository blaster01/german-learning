import type { ExerciseItem } from "@/lib/content/schema";

export const genderBundleTier3: ExerciseItem[] = [
  {
    id: "nom-gb-t3-01",
    engine: "timed",
    prompt: "Type the correct article + noun: „___ Tisch ist aus Holz.“ (masculine)",
    answer: "Der Tisch ist aus Holz.",
    acceptableAnswers: ["der Tisch ist aus Holz."],
    timeLimitSec: 30,
    metadata: {
      cefr: "C1",
      system: "nominal",
      module: "gender-bundle",
      tier: 3,
      tags: ["grammar:gender", "performance:timed"],
    },
  },
];
