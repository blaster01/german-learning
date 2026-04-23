import type { ExerciseItem } from "@/lib/content/schema";

export const connectorsTier2: ExerciseItem[] = [
  {
    id: "flow-con-t2-01",
    engine: "transform",
    prompt: "Join with „deshalb“ (result): „Es regnet. Ich bleibe zu Hause.“ → one sentence.",
    stimulus: "Es regnet. Ich bleibe zu Hause.",
    answer: "Es regnet, deshalb bleibe ich zu Hause.",
    acceptableAnswers: ["es regnet, deshalb bleibe ich zu hause."],
    metadata: {
      cefr: "B2",
      system: "flow",
      module: "connectors",
      tier: 2,
      tags: ["discourse:result", "syntax:v2"],
    },
  },
];
