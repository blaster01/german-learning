import type { ExerciseItem } from "@/lib/content/schema";

export const connectorsTier1: ExerciseItem[] = [
  {
    id: "flow-con-t1-01",
    engine: "mc",
    prompt: "Which connector expresses a contrast?",
    options: ["weil", "obwohl", "damit"],
    answer: 1,
    metadata: {
      cefr: "B1",
      system: "flow",
      module: "connectors",
      tier: 1,
      tags: ["discourse:concession"],
    },
  },
  {
    id: "flow-con-t1-02",
    engine: "cloze",
    prompt: "Complete: Ich bleibe zu Hause, ___ es regnet.",
    answer: "weil",
    acceptableAnswers: ["denn"],
    metadata: {
      cefr: "B1",
      system: "flow",
      module: "connectors",
      tier: 1,
      tags: ["discourse:cause"],
    },
  },
];
