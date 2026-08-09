// Hand-authored curriculum content (not generated) — Konjunktiv II, tier 1 (B1).
import type { ExerciseItem } from "@/lib/content/schema";

const FEEDBACK = {
  correct:
    "Right Konjunktiv II form — that's how German expresses hypotheticals, wishes, and polite requests.",
  common: {
    "mc:wrong":
      "Konjunktiv II uses its own stem forms (wäre, hätte, würde, könnte, solltest...), not the regular present tense.",
    "match:any":
      "Remember: sein → wäre, haben → hätte; most other verbs use würde + infinitive, or an irregular stem like könnte/müsste/wüsste.",
  },
};

export const konjunktivIiTier1: ExerciseItem[] = [
  {
    id: "vb-kii-t1-001",
    engine: "mc",
    prompt: "Choose the correct Konjunktiv II form:",
    stimulus: "Wenn ich Zeit ____, würde ich dich besuchen.",
    options: ["hätte", "habe", "hatte", "haben"],
    answer: 0,
    feedback: FEEDBACK,
    metadata: {
      cefr: "B1",
      system: "verb",
      module: "konjunktiv-ii",
      tier: 1,
      tags: ["grammar:konjunktiv2", "mc"],
      groupId: "kii:haben-wenn",
    },
  },
  {
    id: "vb-kii-t1-002",
    engine: "mc",
    prompt: "Choose the correct Konjunktiv II form:",
    stimulus: "An deiner Stelle ____ ich das nicht tun.",
    options: ["würde", "werde", "wurde", "werden"],
    answer: 0,
    feedback: FEEDBACK,
    metadata: {
      cefr: "B1",
      system: "verb",
      module: "konjunktiv-ii",
      tier: 1,
      tags: ["grammar:konjunktiv2", "mc"],
    },
  },
  {
    id: "vb-kii-t1-003",
    engine: "mc",
    prompt: "Choose the correct Konjunktiv II form:",
    stimulus: "Wenn er reich ____, würde er ein Haus kaufen.",
    options: ["wäre", "ist", "war", "sei"],
    answer: 0,
    feedback: FEEDBACK,
    metadata: {
      cefr: "B1",
      system: "verb",
      module: "konjunktiv-ii",
      tier: 1,
      tags: ["grammar:konjunktiv2", "mc"],
    },
  },
  {
    id: "vb-kii-t1-004",
    engine: "mc",
    prompt: "Choose the correct polite request form:",
    stimulus: "____ du mir bitte helfen?",
    options: ["Könntest", "Kannst", "Konntest", "Könnest"],
    answer: 0,
    feedback: FEEDBACK,
    metadata: {
      cefr: "B1",
      system: "verb",
      module: "konjunktiv-ii",
      tier: 1,
      tags: ["grammar:konjunktiv2", "mc"],
    },
  },
  {
    id: "vb-kii-t1-005",
    engine: "mc",
    prompt: "Choose the correct polite phrase for 'I would like':",
    stimulus: "Ich ____ gern einen Kaffee.",
    options: ["hätte", "habe", "hatte", "würde"],
    answer: 0,
    feedback: FEEDBACK,
    metadata: {
      cefr: "B1",
      system: "verb",
      module: "konjunktiv-ii",
      tier: 1,
      tags: ["grammar:konjunktiv2", "mc"],
    },
  },
  {
    id: "vb-kii-t1-006",
    engine: "mc",
    prompt: "Choose the correct Konjunktiv II form (soft advice):",
    stimulus: "Du ____ wirklich mehr Sport machen.",
    options: ["solltest", "sollst", "solltet", "sollest"],
    answer: 0,
    feedback: FEEDBACK,
    metadata: {
      cefr: "B1",
      system: "verb",
      module: "konjunktiv-ii",
      tier: 1,
      tags: ["grammar:konjunktiv2", "mc"],
    },
  },
  {
    id: "vb-kii-t1-007",
    engine: "cloze",
    prompt: "Fill in the Konjunktiv II form of 'sein':",
    stimulus: "Wenn das Wetter besser ____, würden wir spazieren gehen.",
    answer: "wäre",
    feedback: FEEDBACK,
    metadata: {
      cefr: "B1",
      system: "verb",
      module: "konjunktiv-ii",
      tier: 1,
      tags: ["grammar:konjunktiv2", "cloze"],
    },
  },
  {
    id: "vb-kii-t1-008",
    engine: "cloze",
    prompt: "Fill in the Konjunktiv II form of 'haben':",
    stimulus: "Wenn ich mehr Geduld ____, wäre das einfacher.",
    answer: "hätte",
    feedback: FEEDBACK,
    metadata: {
      cefr: "B1",
      system: "verb",
      module: "konjunktiv-ii",
      tier: 1,
      tags: ["grammar:konjunktiv2", "cloze"],
    },
  },
];
