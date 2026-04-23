import type { ExerciseItem } from "@/lib/content/schema";

export const v2SlotMachineTier3: ExerciseItem[] = [
  {
    id: "syn-v2-t3-01",
    engine: "timed",
    prompt: "Type a correct V2 sentence starting with „Manchmal“: include „ich“, „lese“, „Zeitung“.",
    answer: "Manchmal lese ich Zeitung.",
    acceptableAnswers: ["manchmal lese ich zeitung.", "Manchmal lese ich eine Zeitung."],
    timeLimitSec: 35,
    metadata: {
      cefr: "C1",
      system: "syntax",
      module: "v2-slot-machine",
      tier: 3,
      tags: ["syntax:v2", "performance:timed"],
    },
  },
];
