import type { ExerciseItem } from "@/lib/content/schema";
import type { ModuleMeta } from "@/lib/curriculum/modules";
import { casePickerTier1 } from "./systems/nominal/case-picker/tier1";
import { casePickerTier2 } from "./systems/nominal/case-picker/tier2";
import { casePickerTier3 } from "./systems/nominal/case-picker/tier3";
import { genderBundleTier1 } from "./systems/nominal/gender-bundle/tier1";
import { genderBundleTier2 } from "./systems/nominal/gender-bundle/tier2";
import { genderBundleTier3 } from "./systems/nominal/gender-bundle/tier3";
import { connectorsTier1 } from "./systems/flow/connectors/tier1";
import { connectorsTier2 } from "./systems/flow/connectors/tier2";
import { connectorsTier3 } from "./systems/flow/connectors/tier3";
import { errorClinicTier1 } from "./systems/performance/error-clinic/tier1";
import { errorClinicTier2 } from "./systems/performance/error-clinic/tier2";
import { errorClinicTier3 } from "./systems/performance/error-clinic/tier3";
import { v2SlotMachineTier1 } from "./systems/syntax/v2-slot-machine/tier1";
import { v2SlotMachineTier2 } from "./systems/syntax/v2-slot-machine/tier2";
import { v2SlotMachineTier3 } from "./systems/syntax/v2-slot-machine/tier3";
import { verbGovernmentTier1 } from "./systems/verb/verb-government/tier1";
import { verbGovernmentTier2 } from "./systems/verb/verb-government/tier2";
import { verbGovernmentTier3 } from "./systems/verb/verb-government/tier3";

export type TierIndex = 1 | 2 | 3;

export type ContentModule = ModuleMeta & {
  tiers: Record<TierIndex, ExerciseItem[]>;
};

export const CONTENT_MODULES: ContentModule[] = [
  {
    id: "gender-bundle",
    slug: "gender-bundle",
    systemId: "nominal",
    title: "Gender bundle mastery",
    description: "Articles, agreement, and common neuter/masc/fem patterns.",
    tiers: {
      1: genderBundleTier1,
      2: genderBundleTier2,
      3: genderBundleTier3,
    },
  },
  {
    id: "case-picker",
    slug: "case-picker",
    systemId: "nominal",
    title: "Case picker by meaning",
    description: "Dative vs accusative, prepositions, and two-object orders.",
    tiers: {
      1: casePickerTier1,
      2: casePickerTier2,
      3: casePickerTier3,
    },
  },
  {
    id: "verb-government",
    slug: "verb-government",
    systemId: "verb",
    title: "Verb case government",
    description: "Verbs that take Akk, Dat, or prepositional objects.",
    tiers: {
      1: verbGovernmentTier1,
      2: verbGovernmentTier2,
      3: verbGovernmentTier3,
    },
  },
  {
    id: "v2-slot-machine",
    slug: "v2-slot-machine",
    systemId: "syntax",
    title: "V2 Slot Machine",
    description: "Main-clause verb second with topicalization.",
    tiers: {
      1: v2SlotMachineTier1,
      2: v2SlotMachineTier2,
      3: v2SlotMachineTier3,
    },
  },
  {
    id: "connectors",
    slug: "connectors",
    systemId: "flow",
    title: "Connector mastery",
    description: "Cause, result, and concession in cohesive texts.",
    tiers: {
      1: connectorsTier1,
      2: connectorsTier2,
      3: connectorsTier3,
    },
  },
  {
    id: "error-clinic",
    slug: "error-clinic",
    systemId: "performance",
    title: "Error clinic",
    description: "Edit interference and high-error patterns.",
    tiers: {
      1: errorClinicTier1,
      2: errorClinicTier2,
      3: errorClinicTier3,
    },
  },
];

const flatItems: ExerciseItem[] = CONTENT_MODULES.flatMap((m) => [...m.tiers[1], ...m.tiers[2], ...m.tiers[3]]);

export const allExerciseItems: ExerciseItem[] = flatItems;

export const exerciseItemById: Map<string, ExerciseItem> = new Map(allExerciseItems.map((i) => [i.id, i]));

export function getModuleBySlug(slug: string): ContentModule | undefined {
  return CONTENT_MODULES.find((m) => m.slug === slug);
}

export function getModuleById(id: string): ContentModule | undefined {
  return CONTENT_MODULES.find((m) => m.id === id);
}

export function getItemsForModuleTier(slug: string, tier: TierIndex): ExerciseItem[] {
  const m = getModuleBySlug(slug);
  if (!m) return [];
  return m.tiers[tier] ?? [];
}

export function getModulesForSystem(systemId: string): ContentModule[] {
  return CONTENT_MODULES.filter((m) => m.systemId === systemId);
}
