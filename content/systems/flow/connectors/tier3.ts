import type { ExerciseItem } from "@/lib/content/schema";

export const connectorsTier3: ExerciseItem[] = [
  {
    id: "flow-con-t3-01",
    engine: "timed",
    prompt: "One sentence with „obwohl“: cold / I go out. (use: obwohl · kalt · gehe · ich · trotzdem · raus)",
    answer: "Obwohl es kalt ist, gehe ich trotzdem raus.",
    acceptableAnswers: ["obwohl es kalt ist, gehe ich raus."],
    timeLimitSec: 40,
    metadata: {
      cefr: "C1",
      system: "flow",
      module: "connectors",
      tier: 3,
      tags: ["discourse:concession", "syntax:verb-final"],
    },
  },
];
