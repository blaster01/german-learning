// Hand-authored curriculum content (not generated) — Passiv, tier 2 (B1/B2, Präteritum + modal passive).
import type { ExerciseItem } from "@/lib/content/schema";

const FEEDBACK = {
  correct:
    "Right — the modal stays finite and 'werden' moves to the end as an infinitive with the participle.",
  common: {
    "transform:wrong":
      "Modal passive: [subject] + modal (muss/kann/soll...) + ... + Partizip II + werden.",
    "mc:wrong":
      "Check the auxiliary (werden, not sein/haben) and that the participle is at the end.",
  },
};

export const passivTier2: ExerciseItem[] = [
  {
    id: "vb-pas-t2-001",
    engine: "transform",
    prompt: "Rewrite in the passive voice (modal passive):",
    stimulus: "Man muss die Regeln beachten.",
    answer: "Die Regeln müssen beachtet werden.",
    translation: "One must follow the rules.",
    feedback: FEEDBACK,
    metadata: {
      cefr: "B1",
      system: "verb",
      module: "passiv",
      tier: 2,
      tags: ["grammar:passiv", "transform"],
    },
  },
  {
    id: "vb-pas-t2-002",
    engine: "transform",
    prompt: "Rewrite in the passive voice (Präteritum):",
    stimulus: "Der Sturm zerstörte das Dach.",
    answer: "Das Dach wurde von dem Sturm zerstört.",
    acceptableAnswers: ["Das Dach wurde vom Sturm zerstört."],
    translation: "The storm destroyed the roof.",
    feedback: FEEDBACK,
    metadata: {
      cefr: "B1",
      system: "verb",
      module: "passiv",
      tier: 2,
      tags: ["grammar:passiv", "transform"],
    },
  },
  {
    id: "vb-pas-t2-003",
    engine: "transform",
    prompt: "Rewrite in the passive voice (Präteritum):",
    stimulus: "Die Regierung erhöhte die Steuern.",
    answer: "Die Steuern wurden von der Regierung erhöht.",
    translation: "The government raised taxes.",
    feedback: FEEDBACK,
    metadata: {
      cefr: "B1",
      system: "verb",
      module: "passiv",
      tier: 2,
      tags: ["grammar:passiv", "transform"],
    },
  },
  {
    id: "vb-pas-t2-004",
    engine: "transform",
    prompt: "Rewrite in the passive voice (modal passive):",
    stimulus: "Man kann dieses Problem leicht lösen.",
    answer: "Dieses Problem kann leicht gelöst werden.",
    translation: "One can easily solve this problem.",
    feedback: FEEDBACK,
    metadata: {
      cefr: "B1",
      system: "verb",
      module: "passiv",
      tier: 2,
      tags: ["grammar:passiv", "transform"],
    },
  },
  {
    id: "vb-pas-t2-005",
    engine: "transform",
    prompt: "Rewrite in the passive voice (modal passive):",
    stimulus: "Die Studenten müssen die Aufgabe abgeben.",
    answer: "Die Aufgabe muss von den Studenten abgegeben werden.",
    translation: "The students have to hand in the assignment.",
    feedback: FEEDBACK,
    metadata: {
      cefr: "B1",
      system: "verb",
      module: "passiv",
      tier: 2,
      tags: ["grammar:passiv", "transform"],
    },
  },
  {
    id: "vb-pas-t2-006",
    engine: "mc",
    prompt: "Choose the correct modal passive:",
    stimulus: "Die Aufgabe ____ noch gemacht werden.",
    options: ["muss", "hat", "ist", "wird"],
    answer: 0,
    translation: "The task still needs to be done.",
    feedback: FEEDBACK,
    metadata: {
      cefr: "B1",
      system: "verb",
      module: "passiv",
      tier: 2,
      tags: ["grammar:passiv", "mc"],
    },
  },
  {
    id: "vb-pas-t2-007",
    engine: "mc",
    prompt: "Choose the correctly formed past passive (Präteritum):",
    options: [
      "Das Haus wurde gebaut.",
      "Das Haus wird gebaut.",
      "Das Haus baute werden.",
      "Das Haus ist gebaut werden.",
    ],
    answer: 0,
    translation: "The house was built.",
    feedback: FEEDBACK,
    metadata: {
      cefr: "B1",
      system: "verb",
      module: "passiv",
      tier: 2,
      tags: ["grammar:passiv", "mc"],
    },
  },
];
