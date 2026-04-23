import type { ExerciseItem } from "@/lib/content/schema";

export const casePickerTier3: ExerciseItem[] = [
  {
    id: "nom-cp-t3-01",
    engine: "transform",
    prompt: "Rewrite using a dative reflexive: „Ich wasche die Hände.“ → „Ich wasche ___ die Hände.“",
    stimulus: "Ich wasche die Hände.",
    answer: "Ich wasche mir die Hände.",
    acceptableAnswers: ["ich wasche mir die hände."],
    metadata: {
      cefr: "C1",
      system: "nominal",
      module: "case-picker",
      tier: 3,
      tags: ["grammar:dat", "grammar:reflexive"],
    },
  },
];
