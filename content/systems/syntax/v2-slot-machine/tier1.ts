import type { ExerciseItem } from "@/lib/content/schema";

export const v2SlotMachineTier1: ExerciseItem[] = [
  {
    id: "syn-v2-t1-01",
    engine: "mc",
    prompt: "In a main clause, finite verb position is typically:",
    options: ["First", "Second (V2)", "Last"],
    answer: 1,
    metadata: {
      cefr: "B1",
      system: "syntax",
      module: "v2-slot-machine",
      tier: 1,
      tags: ["syntax:v2"],
    },
    feedback: {
      correct: "Verb-second (V2) is the default in declarative main clauses.",
    },
  },
  {
    id: "syn-v2-t1-02",
    engine: "builder",
    prompt: "Build a correct V2 main clause: „Today I read a book.“",
    stimulus: "Heute · lese · ich · ein Buch",
    tokens: ["Heute", "lese", "ich", "ein", "Buch"],
    solution: ["Heute", "lese", "ich", "ein", "Buch"],
    metadata: {
      cefr: "B1",
      system: "syntax",
      module: "v2-slot-machine",
      tier: 1,
      tags: ["syntax:v2", "interference:en-svo"],
    },
  },
  {
    id: "syn-v2-t1-03",
    engine: "cloze",
    prompt: "Fill the verb: Morgen ___ ich nach Berlin.",
    answer: "fahre",
    acceptableAnswers: ["reise", "fliege"],
    metadata: {
      cefr: "B1",
      system: "syntax",
      module: "v2-slot-machine",
      tier: 1,
      tags: ["syntax:v2"],
    },
  },
];
