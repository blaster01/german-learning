import type { ExerciseItem } from "@/lib/content/schema";

export const v2SlotMachineTier2: ExerciseItem[] = [
  {
    id: "syn-v2-t2-01",
    engine: "fixit",
    prompt: "Fix word order for a main clause (V2).",
    stimulus: "Ich heute gehe ins Kino.",
    answer: "Heute gehe ich ins Kino.",
    acceptableAnswers: ["heute gehe ich ins kino."],
    metadata: {
      cefr: "B2",
      system: "syntax",
      module: "v2-slot-machine",
      tier: 2,
      tags: ["syntax:v2", "syntax:word-order"],
    },
  },
  {
    id: "syn-v2-t2-02",
    engine: "mc",
    prompt: "„In der Schule lernt sie Deutsch.“ The finite verb is in position:",
    options: ["1", "2", "Final"],
    answer: 1,
    metadata: {
      cefr: "B2",
      system: "syntax",
      module: "v2-slot-machine",
      tier: 2,
      tags: ["syntax:v2"],
    },
  },
];
