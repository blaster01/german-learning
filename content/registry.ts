import type { ExerciseItem } from "@/lib/content/schema";
import type { ModuleMeta } from "@/lib/curriculum/modules";

// nominal/gender-bundle
import { genderBundleTier1 } from "./systems/nominal/gender-bundle/tier1";
import { genderBundleTier2 } from "./systems/nominal/gender-bundle/tier2";
import { genderBundleTier3 } from "./systems/nominal/gender-bundle/tier3";

// nominal/pronouns
import { pronounsTier1 } from "./systems/nominal/pronouns/tier1";
import { pronounsTier2 } from "./systems/nominal/pronouns/tier2";
import { pronounsTier3 } from "./systems/nominal/pronouns/tier3";

// verb/reflexives
import { reflexivesTier1 } from "./systems/verb/reflexives/tier1";
import { reflexivesTier2 } from "./systems/verb/reflexives/tier2";
import { reflexivesTier3 } from "./systems/verb/reflexives/tier3";

// verb/konjunktiv-ii
import { konjunktivIiTier1 } from "./systems/verb/konjunktiv-ii/tier1";
import { konjunktivIiTier2 } from "./systems/verb/konjunktiv-ii/tier2";
import { konjunktivIiTier3 } from "./systems/verb/konjunktiv-ii/tier3";

// verb/passiv
import { passivTier1 } from "./systems/verb/passiv/tier1";
import { passivTier2 } from "./systems/verb/passiv/tier2";
import { passivTier3 } from "./systems/verb/passiv/tier3";

// verb/valency
import { valencyTier1 } from "./systems/verb/valency/tier1";
import { valencyTier2 } from "./systems/verb/valency/tier2";
import { valencyTier3 } from "./systems/verb/valency/tier3";

// nominal/adjective-endings
import { adjectiveEndingsTier1 } from "./systems/nominal/adjective-endings/tier1";
import { adjectiveEndingsTier2 } from "./systems/nominal/adjective-endings/tier2";
import { adjectiveEndingsTier3 } from "./systems/nominal/adjective-endings/tier3";

// nominal/two-way-prepositions
import { twoWayPrepositionsTier1 } from "./systems/nominal/two-way-prepositions/tier1";
import { twoWayPrepositionsTier2 } from "./systems/nominal/two-way-prepositions/tier2";
import { twoWayPrepositionsTier3 } from "./systems/nominal/two-way-prepositions/tier3";

// nominal/n-deklination
import { nDeklinationTier1 } from "./systems/nominal/n-deklination/tier1";
import { nDeklinationTier2 } from "./systems/nominal/n-deklination/tier2";
import { nDeklinationTier3 } from "./systems/nominal/n-deklination/tier3";

// syntax/relative-clauses
import { relativeClausesTier1 } from "./systems/syntax/relative-clauses/tier1";
import { relativeClausesTier2 } from "./systems/syntax/relative-clauses/tier2";
import { relativeClausesTier3 } from "./systems/syntax/relative-clauses/tier3";

// syntax/sentence-builder
import { sentenceBuilderTier1 } from "./systems/syntax/sentence-builder/tier1";
import { sentenceBuilderTier2 } from "./systems/syntax/sentence-builder/tier2";
import { sentenceBuilderTier3 } from "./systems/syntax/sentence-builder/tier3";

// syntax/negation-lab
import { negationLabTier1 } from "./systems/syntax/negation-lab/tier1";
import { negationLabTier2 } from "./systems/syntax/negation-lab/tier2";
import { negationLabTier3 } from "./systems/syntax/negation-lab/tier3";

// flow/connectors
import { connectorsTier1 } from "./systems/flow/connectors/tier1";
import { connectorsTier2 } from "./systems/flow/connectors/tier2";
import { connectorsTier3 } from "./systems/flow/connectors/tier3";

// vocab/core-vocab
import { coreVocabTier1 } from "./systems/vocab/core-vocab/tier1";
import { coreVocabTier2 } from "./systems/vocab/core-vocab/tier2";
import { coreVocabTier3 } from "./systems/vocab/core-vocab/tier3";

// vocab/sentence-cloze
import { sentenceClozeTier1 } from "./systems/vocab/sentence-cloze/tier1";
import { sentenceClozeTier2 } from "./systems/vocab/sentence-cloze/tier2";
import { sentenceClozeTier3 } from "./systems/vocab/sentence-cloze/tier3";

// performance/error-clinic
import { errorClinicTier1 } from "./systems/performance/error-clinic/tier1";
import { errorClinicTier2 } from "./systems/performance/error-clinic/tier2";
import { errorClinicTier3 } from "./systems/performance/error-clinic/tier3";

export type TierIndex = 1 | 2 | 3;

export type ContentModule = ModuleMeta & {
  tiers: Record<TierIndex, ExerciseItem[]>;
};

export const CONTENT_MODULES: ContentModule[] = [
  {
    id: "gender-bundle",
    slug: "gender-bundle",
    systemId: "nominal",
    title: "Gender Gym",
    description:
      "Master der/die/das with articles, noun-in-context cloze, and recognition drills.",
    tiers: {
      1: genderBundleTier1,
      2: genderBundleTier2,
      3: genderBundleTier3,
    },
  },
  {
    id: "pronouns",
    slug: "pronouns",
    systemId: "nominal",
    title: "Pronouns by Case",
    description:
      "Fill in the correct pronoun (ich/mich/mir, du/dich/dir, er/ihn/ihm…) in real sentences.",
    tiers: {
      1: pronounsTier1,
      2: pronounsTier2,
      3: pronounsTier3,
    },
  },
  {
    id: "reflexives",
    slug: "reflexives",
    systemId: "verb",
    title: "Reflexive Verbs",
    description:
      "Choose the correct reflexive pronoun (mich/dich/sich/uns/euch) in context.",
    tiers: {
      1: reflexivesTier1,
      2: reflexivesTier2,
      3: reflexivesTier3,
    },
  },
  {
    id: "konjunktiv-ii",
    slug: "konjunktiv-ii",
    systemId: "verb",
    title: "Konjunktiv II",
    description:
      "Form hypotheticals, wishes, and polite requests with wäre, hätte, würde, and modal stems.",
    tiers: {
      1: konjunktivIiTier1,
      2: konjunktivIiTier2,
      3: konjunktivIiTier3,
    },
  },
  {
    id: "passiv",
    slug: "passiv",
    systemId: "verb",
    title: "Passiv",
    description:
      "Build passive-voice sentences with werden + Partizip II across Präsens, Präteritum, and Perfekt.",
    tiers: {
      1: passivTier1,
      2: passivTier2,
      3: passivTier3,
    },
  },
  {
    id: "valency",
    slug: "valency",
    systemId: "verb",
    title: "Verb Valency",
    description:
      "Learn which case each verb governs — fixed-dative verbs, two-object verbs, and fixed prepositions.",
    tiers: {
      1: valencyTier1,
      2: valencyTier2,
      3: valencyTier3,
    },
  },
  {
    id: "adjective-endings",
    slug: "adjective-endings",
    systemId: "nominal",
    title: "Adjective Endings",
    description:
      "Choose the right adjective ending after der-words, ein-words, and no article at all.",
    tiers: {
      1: adjectiveEndingsTier1,
      2: adjectiveEndingsTier2,
      3: adjectiveEndingsTier3,
    },
  },
  {
    id: "two-way-prepositions",
    slug: "two-way-prepositions",
    systemId: "nominal",
    title: "Two-Way Prepositions",
    description:
      "Accusative for motion, dative for location — plus fixed-case idioms and contractions.",
    tiers: {
      1: twoWayPrepositionsTier1,
      2: twoWayPrepositionsTier2,
      3: twoWayPrepositionsTier3,
    },
  },
  {
    id: "n-deklination",
    slug: "n-deklination",
    systemId: "nominal",
    title: "n-Deklination",
    description:
      "Weak masculine nouns (Junge, Kollege, Student, Name…) that add -n/-en outside the nominative.",
    tiers: {
      1: nDeklinationTier1,
      2: nDeklinationTier2,
      3: nDeklinationTier3,
    },
  },
  {
    id: "relative-clauses",
    slug: "relative-clauses",
    systemId: "syntax",
    title: "Relative Clauses",
    description:
      "Pick the relative pronoun whose gender matches its noun and whose case matches its role.",
    tiers: {
      1: relativeClausesTier1,
      2: relativeClausesTier2,
      3: relativeClausesTier3,
    },
  },
  {
    id: "sentence-builder",
    slug: "sentence-builder",
    systemId: "syntax",
    title: "Sentence Builder",
    description:
      "Reconstruct German sentences by putting shuffled words in the correct order.",
    tiers: {
      1: sentenceBuilderTier1,
      2: sentenceBuilderTier2,
      3: sentenceBuilderTier3,
    },
  },
  {
    id: "negation-lab",
    slug: "negation-lab",
    systemId: "syntax",
    title: "Negation Lab",
    description:
      "Fill in nicht/kein and fix common negation errors in real sentences.",
    tiers: {
      1: negationLabTier1,
      2: negationLabTier2,
      3: negationLabTier3,
    },
  },
  {
    id: "connectors",
    slug: "connectors",
    systemId: "flow",
    title: "Connector Mastery",
    description:
      "Fill in subordinating and coordinating connectors (weil, obwohl, deshalb…) in context.",
    tiers: {
      1: connectorsTier1,
      2: connectorsTier2,
      3: connectorsTier3,
    },
  },
  {
    id: "core-vocab",
    slug: "core-vocab",
    systemId: "vocab",
    title: "Core Vocabulary",
    description:
      "Two-direction meaning drills (DE→EN and EN→DE) for high-frequency German words.",
    tiers: {
      1: coreVocabTier1,
      2: coreVocabTier2,
      3: coreVocabTier3,
    },
  },
  {
    id: "sentence-cloze",
    slug: "sentence-cloze",
    systemId: "vocab",
    title: "Sentence Cloze",
    description:
      "Recall vocabulary in context: fill in the missing word in authentic sentences.",
    tiers: {
      1: sentenceClozeTier1,
      2: sentenceClozeTier2,
      3: sentenceClozeTier3,
    },
  },
  {
    id: "error-clinic",
    slug: "error-clinic",
    systemId: "performance",
    title: "Error Clinic",
    description:
      "Spot and fix pronoun-case, word-order, connector, and negation errors.",
    tiers: {
      1: errorClinicTier1,
      2: errorClinicTier2,
      3: errorClinicTier3,
    },
  },
];

const flatItems: ExerciseItem[] = CONTENT_MODULES.flatMap((m) => [
  ...m.tiers[1],
  ...m.tiers[2],
  ...m.tiers[3],
]);

export const allExerciseItems: ExerciseItem[] = flatItems;

export const exerciseItemById: Map<string, ExerciseItem> = new Map(
  allExerciseItems.map((i) => [i.id, i]),
);

export function getModuleBySlug(slug: string): ContentModule | undefined {
  return CONTENT_MODULES.find((m) => m.slug === slug);
}

export function getModuleById(id: string): ContentModule | undefined {
  return CONTENT_MODULES.find((m) => m.id === id);
}

export function getModulesForSystem(systemId: string): ContentModule[] {
  return CONTENT_MODULES.filter((m) => m.systemId === systemId);
}
