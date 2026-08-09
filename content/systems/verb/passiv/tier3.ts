// Hand-authored curriculum content (not generated) — Passiv, tier 3 (B2, Perfekt + impersonal passive).
import type { ExerciseItem } from "@/lib/content/schema";

const FEEDBACK = {
  correct:
    "Right — Perfekt passive uses 'worden', not 'geworden', and an impersonal passive doesn't need a real subject.",
  common: {
    "transform:wrong":
      "Perfekt passive: [subject] + ist/sind/ist ... + Partizip II + worden (not geworden).",
    "mc:wrong":
      "In the Perfekt passive, 'worden' replaces 'geworden' as the participle of werden.",
  },
};

export const passivTier3: ExerciseItem[] = [
  {
    id: "vb-pas-t3-001",
    engine: "transform",
    prompt: "Rewrite in the passive voice (Perfekt):",
    stimulus: "Man hat das Problem schnell gelöst.",
    answer: "Das Problem ist schnell gelöst worden.",
    translation: "They solved the problem quickly.",
    feedback: FEEDBACK,
    metadata: {
      cefr: "B2",
      system: "verb",
      module: "passiv",
      tier: 3,
      tags: ["grammar:passiv", "transform"],
    },
  },
  {
    id: "vb-pas-t3-002",
    engine: "transform",
    prompt: "Rewrite in the passive voice (Perfekt):",
    stimulus: "Die Arbeiter haben die Brücke repariert.",
    answer: "Die Brücke ist von den Arbeitern repariert worden.",
    translation: "The workers repaired the bridge.",
    feedback: FEEDBACK,
    metadata: {
      cefr: "B2",
      system: "verb",
      module: "passiv",
      tier: 3,
      tags: ["grammar:passiv", "transform"],
    },
  },
  {
    id: "vb-pas-t3-003",
    engine: "transform",
    prompt: "Rewrite in the impersonal passive voice:",
    stimulus: "Man sollte hier nicht rauchen.",
    answer: "Hier sollte nicht geraucht werden.",
    translation: "One shouldn't smoke here.",
    feedback: FEEDBACK,
    metadata: {
      cefr: "B2",
      system: "verb",
      module: "passiv",
      tier: 3,
      tags: ["grammar:passiv", "transform"],
    },
  },
  {
    id: "vb-pas-t3-004",
    engine: "transform",
    prompt: "Rewrite in the impersonal passive voice:",
    stimulus: "Man tanzte die ganze Nacht.",
    answer: "Es wurde die ganze Nacht getanzt.",
    acceptableAnswers: ["Die ganze Nacht wurde getanzt."],
    translation: "They danced all night.",
    feedback: FEEDBACK,
    metadata: {
      cefr: "B2",
      system: "verb",
      module: "passiv",
      tier: 3,
      tags: ["grammar:passiv", "transform"],
    },
  },
  {
    id: "vb-pas-t3-005",
    engine: "mc",
    prompt: "Choose the correctly formed Perfekt passive:",
    options: [
      "Der Brief ist geschrieben worden.",
      "Der Brief ist geschrieben geworden.",
      "Der Brief hat geschrieben worden.",
      "Der Brief wird geschrieben worden.",
    ],
    answer: 0,
    translation: "The letter has been written.",
    feedback: FEEDBACK,
    metadata: {
      cefr: "B2",
      system: "verb",
      module: "passiv",
      tier: 3,
      tags: ["grammar:passiv", "mc"],
    },
  },
  {
    id: "vb-pas-t3-006",
    engine: "mc",
    prompt: "Choose the correct impersonal passive:",
    options: [
      "Hier wird viel gelacht.",
      "Hier ist viel gelacht.",
      "Hier wird viel lachen.",
      "Hier hat viel gelacht.",
    ],
    answer: 0,
    translation: "There's a lot of laughing here.",
    feedback: FEEDBACK,
    metadata: {
      cefr: "B2",
      system: "verb",
      module: "passiv",
      tier: 3,
      tags: ["grammar:passiv", "mc"],
    },
  },
];
