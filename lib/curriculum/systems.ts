export type SystemId = "nominal" | "verb" | "syntax" | "flow" | "vocab" | "performance";

export type SkillSystem = {
  id: SystemId;
  title: string;
  description: string;
};

export const SYSTEMS: SkillSystem[] = [
  {
    id: "nominal",
    title: "Nouns, Articles, Cases",
    description: "Gender, plurals, cases, prepositions, pronouns.",
  },
  {
    id: "verb",
    title: "Verbs and Verb Patterns",
    description: "Case government, reflexives, modals, passive, tense choice.",
  },
  {
    id: "syntax",
    title: "Sentence Structure and Word Order",
    description: "V2, subclauses, relative clauses, Mittelfeld, negation.",
  },
  {
    id: "flow",
    title: "Cohesion and Discourse",
    description: "Connectors, temporal structures, argumentation templates.",
  },
  {
    id: "vocab",
    title: "Vocabulary as Chunks",
    description: "Collocations, nominalizations, particles, false friends.",
  },
  {
    id: "performance",
    title: "Comprehension and Output",
    description: "Listening, pronunciation, writing patterns, checkpoints.",
  },
];

export function getSystem(id: string): SkillSystem | undefined {
  return SYSTEMS.find((s) => s.id === id);
}
