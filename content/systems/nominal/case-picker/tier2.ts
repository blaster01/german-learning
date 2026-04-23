import type { ExerciseItem } from "@/lib/content/schema";

export const casePickerTier2: ExerciseItem[] = [
  {
    id: "nom-cp-t2-01",
    engine: "mc",
    prompt: "„Wegen ___ Wetters“ — which case follows „wegen“ in formal German?",
    options: ["Dative only", "Genitive (formal)", "Accusative"],
    answer: 1,
    metadata: {
      cefr: "B2",
      system: "nominal",
      module: "case-picker",
      tier: 2,
      tags: ["grammar:gen", "grammar:preposition"],
    },
  },
  {
    id: "nom-cp-t2-02",
    engine: "fixit",
    prompt: "Fix the article/case after „mit“ (neuter noun).",
    stimulus: "Ich fahre mit der Bus.",
    answer: "Ich fahre mit dem Bus.",
    acceptableAnswers: ["ich fahre mit dem bus."],
    metadata: {
      cefr: "B2",
      system: "nominal",
      module: "case-picker",
      tier: 2,
      tags: ["grammar:dat"],
    },
  },
];
