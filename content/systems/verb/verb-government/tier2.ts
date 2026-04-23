import type { ExerciseItem } from "@/lib/content/schema";

export const verbGovernmentTier2: ExerciseItem[] = [
  {
    id: "vb-gov-t2-01",
    engine: "cloze",
    prompt: "Complete: Wir warten ___ den Bus. (verb + preposition + Akk)",
    answer: "auf",
    metadata: {
      cefr: "B2",
      system: "verb",
      module: "verb-government",
      tier: 2,
      tags: ["grammar:akk", "grammar:preposition"],
    },
  },
];
