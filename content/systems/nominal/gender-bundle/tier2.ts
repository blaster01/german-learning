import type { ExerciseItem } from "@/lib/content/schema";

export const genderBundleTier2: ExerciseItem[] = [
  {
    id: "nom-gb-t2-01",
    engine: "mc",
    prompt: "Which fits: „Ich sehe ___ Kind.“ (neuter, direct object)",
    options: ["der", "die", "das"],
    answer: 2,
    metadata: {
      cefr: "B2",
      system: "nominal",
      module: "gender-bundle",
      tier: 2,
      tags: ["grammar:akk", "grammar:gender"],
    },
  },
  {
    id: "nom-gb-t2-02",
    engine: "transform",
    prompt: "Rewrite using the neuter article: „Ein Auto steht da.“ → start with „Das Auto …“",
    stimulus: "Ein Auto steht da.",
    answer: "Das Auto steht da.",
    acceptableAnswers: ["das Auto steht da."],
    metadata: {
      cefr: "B2",
      system: "nominal",
      module: "gender-bundle",
      tier: 2,
      tags: ["grammar:article"],
    },
  },
];
