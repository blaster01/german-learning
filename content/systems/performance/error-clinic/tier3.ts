import type { ExerciseItem } from "@/lib/content/schema";

export const errorClinicTier3: ExerciseItem[] = [
  {
    id: "perf-ec-t3-01",
    engine: "transform",
    prompt: "Make it more formal nominal style: „Sie haben das Projekt abgeschlossen.“",
    stimulus: "Sie haben das Projekt abgeschlossen.",
    answer: "Sie haben den Abschluss des Projekts vollzogen.",
    acceptableAnswers: ["sie haben den abschluss des projekts vollzogen."],
    metadata: {
      cefr: "C1",
      system: "performance",
      module: "error-clinic",
      tier: 3,
      tags: ["vocab:nominalization"],
    },
  },
];
