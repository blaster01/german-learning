import type { ExerciseItem } from "@/lib/content/schema";

export const errorClinicTier1: ExerciseItem[] = [
  {
    id: "perf-ec-t1-01",
    engine: "fixit",
    prompt: "Fix the false friend / preposition.",
    stimulus: "Ich werde das später realisieren.",
    answer: "Ich werde das später umsetzen.",
    acceptableAnswers: ["ich werde das später umsetzen.", "Ich werde das später machen."],
    metadata: {
      cefr: "B1",
      system: "performance",
      module: "error-clinic",
      tier: 1,
      tags: ["vocab:false-friends", "interference:en-realize"],
    },
  },
  {
    id: "perf-ec-t1-02",
    engine: "mc",
    prompt: "Better German for „I am becoming 30“:",
    options: ["Ich werde 30.", "Ich bekomme 30.", "Ich werde 30 Jahre alt."],
    answer: 2,
    metadata: {
      cefr: "B1",
      system: "performance",
      module: "error-clinic",
      tier: 1,
      tags: ["interference:en-become"],
    },
  },
];
