import type { ExerciseItem } from "@/lib/content/schema";

export const genderBundleTier1: ExerciseItem[] = [
  {
    id: "nom-gb-t1-01",
    engine: "mc",
    prompt: "What is the gender of „Buch“?",
    options: ["der", "die", "das"],
    answer: 2,
    metadata: {
      cefr: "B1",
      system: "nominal",
      module: "gender-bundle",
      tier: 1,
      tags: ["grammar:gender", "interference:en-book"],
    },
    feedback: {
      correct: "Neuter nouns often end in -chen/-lein or are abstract like das Buch.",
      common: { "mc:wrong": "English “book” has no gender — German assigns neuter here." },
    },
  },
  {
    id: "nom-gb-t1-02",
    engine: "cloze",
    prompt: "Complete: ___ Lampe ist kaputt.",
    answer: "Die",
    acceptableAnswers: ["die"],
    metadata: {
      cefr: "B1",
      system: "nominal",
      module: "gender-bundle",
      tier: 1,
      tags: ["grammar:gender", "grammar:article"],
    },
  },
  {
    id: "nom-gb-t1-03",
    engine: "builder",
    prompt: "Build: „The sun is shining.“",
    stimulus: "Use: Die · Sonne · scheint",
    tokens: ["Die", "Sonne", "scheint"],
    solution: ["Die", "Sonne", "scheint"],
    metadata: {
      cefr: "B1",
      system: "nominal",
      module: "gender-bundle",
      tier: 1,
      tags: ["syntax:v2", "grammar:gender"],
    },
  },
  {
    id: "nom-gb-t1-04",
    engine: "fixit",
    prompt: "Fix the article/gender agreement.",
    stimulus: "Die Auto ist neu.",
    answer: "Das Auto ist neu.",
    acceptableAnswers: ["das Auto ist neu."],
    metadata: {
      cefr: "B1",
      system: "nominal",
      module: "gender-bundle",
      tier: 1,
      tags: ["grammar:gender", "interference:en-car"],
    },
  },
];
