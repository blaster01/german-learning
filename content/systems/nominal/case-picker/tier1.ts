import type { ExerciseItem } from "@/lib/content/schema";

export const casePickerTier1: ExerciseItem[] = [
  {
    id: "nom-cp-t1-01",
    engine: "mc",
    prompt: "„Ich helfe ___ Freund.“ Which case does „helfen“ take for the person?",
    options: ["Nominative", "Accusative", "Dative"],
    answer: 2,
    metadata: {
      cefr: "B1",
      system: "nominal",
      module: "case-picker",
      tier: 1,
      tags: ["grammar:dat", "grammar:verb-government"],
    },
    feedback: {
      correct: "helfen + Dativ — many person verbs take dative in German.",
    },
  },
  {
    id: "nom-cp-t1-02",
    engine: "cloze",
    prompt: "Complete with the correct definite article (Dative m): ___ Mann gebe ich das Buch.",
    answer: "Dem",
    acceptableAnswers: ["dem"],
    metadata: {
      cefr: "B1",
      system: "nominal",
      module: "case-picker",
      tier: 1,
      tags: ["grammar:dat", "grammar:article"],
    },
  },
  {
    id: "nom-cp-t1-03",
    engine: "builder",
    prompt: "Build: „I give the woman the key.“ (Dat before Akk for pronouns/objects — canonical pattern with two objects)",
    stimulus: "ich · gebe · der Frau · den Schlüssel",
    tokens: ["ich", "gebe", "der", "Frau", "den", "Schlüssel"],
    solution: ["ich", "gebe", "der", "Frau", "den", "Schlüssel"],
    metadata: {
      cefr: "B1",
      system: "nominal",
      module: "case-picker",
      tier: 1,
      tags: ["grammar:dat", "grammar:akk", "syntax:word-order"],
    },
  },
];
