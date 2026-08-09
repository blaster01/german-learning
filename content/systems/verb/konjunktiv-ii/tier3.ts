// Hand-authored curriculum content (not generated) — Konjunktiv II, tier 3 (B2).
import type { ExerciseItem } from "@/lib/content/schema";

const FEEDBACK = {
  correct:
    "Right — past Konjunktiv II always uses hätte/wäre + Partizip II, never würde.",
  common: {
    "mc:wrong":
      "Past hypotheticals use hätte/wäre + Partizip II (not würde + Partizip II).",
    "match:any":
      "Past Konjunktiv II = hätte or wäre + past participle. Use wäre for verbs that take 'sein' in the Perfekt.",
    "timed:wrong":
      "Quick recall: sein→wäre, haben→hätte, wissen→wüsste — memorize these irregular stems.",
  },
};

export const konjunktivIiTier3: ExerciseItem[] = [
  {
    id: "vb-kii-t3-001",
    engine: "mc",
    prompt: "Choose the correct past-hypothetical form:",
    stimulus: "Hätte ich das gewusst, ____ ich anders gehandelt.",
    options: ["hätte", "habe", "werde", "würde"],
    answer: 0,
    feedback: FEEDBACK,
    metadata: {
      cefr: "B2",
      system: "verb",
      module: "konjunktiv-ii",
      tier: 3,
      tags: ["grammar:konjunktiv2", "mc"],
    },
  },
  {
    id: "vb-kii-t3-002",
    engine: "mc",
    prompt: "Choose the correct past-hypothetical form:",
    stimulus: "Wenn sie früher gegangen wäre, ____ sie den Bus nicht verpasst.",
    options: ["hätte", "habe", "würde", "ist"],
    answer: 0,
    feedback: FEEDBACK,
    metadata: {
      cefr: "B2",
      system: "verb",
      module: "konjunktiv-ii",
      tier: 3,
      tags: ["grammar:konjunktiv2", "mc"],
    },
  },
  {
    id: "vb-kii-t3-003",
    engine: "cloze",
    prompt: "Fill in the past Konjunktiv II auxiliary for 'sein':",
    stimulus: "Wenn ich das gewusst hätte, ____ ich nicht gekommen.",
    answer: "wäre",
    feedback: FEEDBACK,
    metadata: {
      cefr: "B2",
      system: "verb",
      module: "konjunktiv-ii",
      tier: 3,
      tags: ["grammar:konjunktiv2", "cloze"],
    },
  },
  {
    id: "vb-kii-t3-004",
    engine: "cloze",
    prompt: "Fill in the missing word (past hypothetical):",
    stimulus: "An seiner Stelle ____ ich das Angebot sofort angenommen.",
    answer: "hätte",
    feedback: FEEDBACK,
    metadata: {
      cefr: "B2",
      system: "verb",
      module: "konjunktiv-ii",
      tier: 3,
      tags: ["grammar:konjunktiv2", "cloze"],
    },
  },
  {
    id: "vb-kii-t3-005",
    engine: "mc",
    prompt: "Choose the correct form (comparison clause, 'as if'):",
    stimulus: "Es sieht so aus, als ____ es gleich regnen.",
    options: ["würde", "wird", "werde", "wurde"],
    answer: 0,
    feedback: FEEDBACK,
    metadata: {
      cefr: "B2",
      system: "verb",
      module: "konjunktiv-ii",
      tier: 3,
      tags: ["grammar:konjunktiv2", "mc"],
    },
  },
  {
    id: "vb-kii-t3-006",
    engine: "cloze",
    prompt: "Fill in the Konjunktiv II form of 'wissen':",
    stimulus: "Wenn ich die Antwort ____, würde ich es dir sagen.",
    answer: "wüsste",
    feedback: FEEDBACK,
    metadata: {
      cefr: "B2",
      system: "verb",
      module: "konjunktiv-ii",
      tier: 3,
      tags: ["grammar:konjunktiv2", "cloze"],
    },
  },
  {
    id: "vb-kii-t3-007",
    engine: "timed",
    prompt: "Quick: what's the Konjunktiv II form of 'ich habe'?",
    answer: "ich hätte",
    acceptableAnswers: ["hätte"],
    timeLimitSec: 20,
    feedback: FEEDBACK,
    metadata: {
      cefr: "B2",
      system: "verb",
      module: "konjunktiv-ii",
      tier: 3,
      tags: ["grammar:konjunktiv2", "timed"],
    },
  },
  {
    id: "vb-kii-t3-008",
    engine: "timed",
    prompt: "Quick: what's the Konjunktiv II form of 'es ist'?",
    answer: "es wäre",
    acceptableAnswers: ["wäre"],
    timeLimitSec: 20,
    feedback: FEEDBACK,
    metadata: {
      cefr: "B2",
      system: "verb",
      module: "konjunktiv-ii",
      tier: 3,
      tags: ["grammar:konjunktiv2", "timed"],
    },
  },
];
