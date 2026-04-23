import type { ExerciseItem } from "@/lib/content/schema";

export const verbGovernmentTier3: ExerciseItem[] = [
  {
    id: "vb-gov-t3-01",
    engine: "fixit",
    prompt: "Fix word order with „geben“ (dative before accusative pronoun).",
    stimulus: "Ich gebe das dir Buch.",
    answer: "Ich gebe dir das Buch.",
    acceptableAnswers: ["ich gebe dir das buch."],
    metadata: {
      cefr: "C1",
      system: "verb",
      module: "verb-government",
      tier: 3,
      tags: ["grammar:dat", "grammar:akk"],
    },
  },
];
