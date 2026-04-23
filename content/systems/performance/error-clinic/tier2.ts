import type { ExerciseItem } from "@/lib/content/schema";

export const errorClinicTier2: ExerciseItem[] = [
  {
    id: "perf-ec-t2-01",
    engine: "cloze",
    prompt: "Choose a natural collocation: eine Entscheidung ___",
    answer: "treffen",
    acceptableAnswers: ["fällen"],
    metadata: {
      cefr: "B2",
      system: "performance",
      module: "error-clinic",
      tier: 2,
      tags: ["vocab:collocation"],
    },
  },
];
