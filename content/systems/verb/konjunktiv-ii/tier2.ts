// Hand-authored curriculum content (not generated) — Konjunktiv II, tier 2 (B1).
import type { ExerciseItem } from "@/lib/content/schema";

const FEEDBACK = {
  correct:
    "Right Konjunktiv II form — that's how German expresses hypotheticals, wishes, and polite requests.",
  common: {
    "mc:wrong":
      "Konjunktiv II uses its own stem forms (wäre, hätte, würde, könnte, müsstest...), not the regular present tense.",
    "match:any":
      "Remember: sein → wäre, haben → hätte; most other verbs use würde + infinitive, or an irregular stem like könntest/müsstest/möchte.",
  },
};

export const konjunktivIiTier2: ExerciseItem[] = [
  {
    id: "vb-kii-t2-001",
    engine: "mc",
    prompt: "Choose the correct Konjunktiv II form:",
    stimulus: "Wenn ich an deiner Stelle ____, würde ich mich entschuldigen.",
    options: ["wäre", "bin", "war", "sei"],
    answer: 0,
    feedback: FEEDBACK,
    metadata: {
      cefr: "B1",
      system: "verb",
      module: "konjunktiv-ii",
      tier: 2,
      tags: ["grammar:konjunktiv2", "mc"],
    },
  },
  {
    id: "vb-kii-t2-002",
    engine: "mc",
    prompt: "Choose the correct formal, polite form:",
    stimulus: "____ Sie so freundlich und würden das Fenster schließen?",
    options: ["Wären", "Sind", "Waren", "Werden"],
    answer: 0,
    feedback: FEEDBACK,
    metadata: {
      cefr: "B1",
      system: "verb",
      module: "konjunktiv-ii",
      tier: 2,
      tags: ["grammar:konjunktiv2", "mc"],
    },
  },
  {
    id: "vb-kii-t2-003",
    engine: "mc",
    prompt: "Choose the correct Konjunktiv II form:",
    stimulus: "Wenn wir mehr Geld ____, würden wir eine Reise machen.",
    options: ["hätten", "haben", "hatten", "würden"],
    answer: 0,
    feedback: FEEDBACK,
    metadata: {
      cefr: "B1",
      system: "verb",
      module: "konjunktiv-ii",
      tier: 2,
      tags: ["grammar:konjunktiv2", "mc"],
    },
  },
  {
    id: "vb-kii-t2-004",
    engine: "mc",
    prompt: "Choose the correct Konjunktiv II form (irrealis comparison):",
    stimulus: "Er tut so, als ob er krank ____.",
    options: ["wäre", "ist", "war", "sei"],
    answer: 0,
    feedback: FEEDBACK,
    metadata: {
      cefr: "B1",
      system: "verb",
      module: "konjunktiv-ii",
      tier: 2,
      tags: ["grammar:konjunktiv2", "mc"],
    },
  },
  {
    id: "vb-kii-t2-005",
    engine: "mc",
    prompt: "Choose the correct Konjunktiv II form:",
    stimulus: "Ich ____ das nicht sagen, wenn ich an deiner Stelle wäre.",
    options: ["würde", "werde", "wurde", "würdet"],
    answer: 0,
    feedback: FEEDBACK,
    metadata: {
      cefr: "B1",
      system: "verb",
      module: "konjunktiv-ii",
      tier: 2,
      tags: ["grammar:konjunktiv2", "mc"],
    },
  },
  {
    id: "vb-kii-t2-006",
    engine: "cloze",
    prompt: "Fill in the Konjunktiv II form of 'können':",
    stimulus: "____ du mir bitte das Salz geben?",
    answer: "Könntest",
    feedback: FEEDBACK,
    metadata: {
      cefr: "B1",
      system: "verb",
      module: "konjunktiv-ii",
      tier: 2,
      tags: ["grammar:konjunktiv2", "cloze"],
    },
  },
  {
    id: "vb-kii-t2-007",
    engine: "cloze",
    prompt: "Fill in the Konjunktiv II form of 'müssen':",
    stimulus: "Du ____ eigentlich früher aufstehen.",
    answer: "müsstest",
    feedback: FEEDBACK,
    metadata: {
      cefr: "B1",
      system: "verb",
      module: "konjunktiv-ii",
      tier: 2,
      tags: ["grammar:konjunktiv2", "cloze"],
    },
  },
  {
    id: "vb-kii-t2-008",
    engine: "cloze",
    prompt: "Fill in the Konjunktiv II form of 'mögen' (polite 'would like'):",
    stimulus: "Ich ____ gern etwas fragen.",
    answer: "möchte",
    feedback: FEEDBACK,
    metadata: {
      cefr: "B1",
      system: "verb",
      module: "konjunktiv-ii",
      tier: 2,
      tags: ["grammar:konjunktiv2", "cloze"],
    },
  },
];
