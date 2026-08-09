// Hand-authored curriculum content (not generated) — Passiv, tier 1 (B1, Präsens).
import type { ExerciseItem } from "@/lib/content/schema";

const FEEDBACK = {
  correct:
    "Right — the original object becomes the subject, and werden + Partizip II carries the passive meaning.",
  common: {
    "transform:wrong":
      "Passive = [new subject] + a form of werden + Partizip II (+ von + [old subject] in the dative).",
    "mc:wrong":
      "Check the auxiliary (werden, not sein/haben) and that the participle is at the end.",
  },
};

export const passivTier1: ExerciseItem[] = [
  {
    id: "vb-pas-t1-001",
    engine: "transform",
    prompt: "Rewrite in the passive voice (Präsens):",
    stimulus: "Der Lehrer korrigiert die Prüfung.",
    answer: "Die Prüfung wird von dem Lehrer korrigiert.",
    acceptableAnswers: ["Die Prüfung wird vom Lehrer korrigiert."],
    translation: "The teacher corrects the exam.",
    feedback: FEEDBACK,
    metadata: {
      cefr: "B1",
      system: "verb",
      module: "passiv",
      tier: 1,
      tags: ["grammar:passiv", "transform"],
    },
  },
  {
    id: "vb-pas-t1-002",
    engine: "transform",
    prompt: "Rewrite in the passive voice (Präsens):",
    stimulus: "Die Firma stellt viele Mitarbeiter ein.",
    answer: "Viele Mitarbeiter werden von der Firma eingestellt.",
    translation: "The company hires many employees.",
    feedback: FEEDBACK,
    metadata: {
      cefr: "B1",
      system: "verb",
      module: "passiv",
      tier: 1,
      tags: ["grammar:passiv", "transform"],
    },
  },
  {
    id: "vb-pas-t1-003",
    engine: "transform",
    prompt: "Rewrite in the passive voice (Präsens):",
    stimulus: "Der Koch bereitet das Essen zu.",
    answer: "Das Essen wird von dem Koch zubereitet.",
    acceptableAnswers: ["Das Essen wird vom Koch zubereitet."],
    translation: "The cook prepares the food.",
    feedback: FEEDBACK,
    metadata: {
      cefr: "B1",
      system: "verb",
      module: "passiv",
      tier: 1,
      tags: ["grammar:passiv", "transform"],
    },
  },
  {
    id: "vb-pas-t1-004",
    engine: "transform",
    prompt: "Rewrite in the passive voice (Präsens):",
    stimulus: "Die Kinder lesen das Buch.",
    answer: "Das Buch wird von den Kindern gelesen.",
    translation: "The children read the book.",
    feedback: FEEDBACK,
    metadata: {
      cefr: "B1",
      system: "verb",
      module: "passiv",
      tier: 1,
      tags: ["grammar:passiv", "transform"],
    },
  },
  {
    id: "vb-pas-t1-005",
    engine: "transform",
    prompt: "Rewrite in the passive voice (Präsens):",
    stimulus: "Der Mechaniker repariert das Auto.",
    answer: "Das Auto wird von dem Mechaniker repariert.",
    acceptableAnswers: ["Das Auto wird vom Mechaniker repariert."],
    translation: "The mechanic repairs the car.",
    feedback: FEEDBACK,
    metadata: {
      cefr: "B1",
      system: "verb",
      module: "passiv",
      tier: 1,
      tags: ["grammar:passiv", "transform"],
    },
  },
  {
    id: "vb-pas-t1-006",
    engine: "mc",
    prompt: "Choose the correctly formed passive sentence:",
    options: [
      "Die Tür wird geöffnet.",
      "Die Tür ist geöffnet werden.",
      "Die Tür wird öffnen.",
      "Die Tür werden geöffnet.",
    ],
    answer: 0,
    translation: "The door is opened.",
    feedback: FEEDBACK,
    metadata: {
      cefr: "B1",
      system: "verb",
      module: "passiv",
      tier: 1,
      tags: ["grammar:passiv", "mc"],
    },
  },
  {
    id: "vb-pas-t1-007",
    engine: "mc",
    prompt: "Choose the correct passive auxiliary:",
    stimulus: "Der Brief ____ geschrieben.",
    options: ["wird", "werden", "hat", "kann"],
    answer: 0,
    translation: "The letter is being written.",
    feedback: FEEDBACK,
    metadata: {
      cefr: "B1",
      system: "verb",
      module: "passiv",
      tier: 1,
      tags: ["grammar:passiv", "mc"],
    },
  },
];
