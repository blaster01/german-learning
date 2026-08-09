import { z } from "zod";

export const cefrSchema = z.enum(["B1", "B2", "C1"]);
export const systemSchema = z.enum([
  "nominal",
  "verb",
  "syntax",
  "flow",
  "vocab",
  "performance",
]);

export const metadataSchema = z.object({
  cefr: cefrSchema,
  system: systemSchema,
  module: z.string(),
  tier: z.number().int().min(1).max(3),
  tags: z.array(z.string()).default([]),
  groupId: z.string().optional(),
});

const feedbackSchema = z
  .object({
    correct: z.string().optional(),
    common: z.record(z.string()).optional(),
  })
  .optional();

const baseItem = z.object({
  id: z.string(),
  prompt: z.string(),
  stimulus: z.string().optional(),
  feedback: feedbackSchema,
  metadata: metadataSchema,
  /** English translation of the stimulus/prompt content, for learner support. */
  translation: z.string().optional(),
  /**
   * "always" — the German alone is ambiguous (e.g. a pronoun-case cloze with
   * more than one grammatical answer), so the translation is shown with the
   * prompt to disambiguate. "onDemand" (default when a translation exists) —
   * shown behind a "Show translation" toggle so it doesn't give away answers
   * that are otherwise gettable from German alone.
   */
  translationVisibility: z.enum(["always", "onDemand"]).optional(),
});

export const mcItemSchema = baseItem.extend({
  engine: z.literal("mc"),
  options: z.array(z.string()).min(2),
  answer: z.number().int().min(0),
});

export const clozeItemSchema = baseItem.extend({
  engine: z.literal("cloze"),
  answer: z.string(),
  acceptableAnswers: z.array(z.string()).optional(),
});

export const builderItemSchema = baseItem.extend({
  engine: z.literal("builder"),
  tokens: z.array(z.string()).min(2),
  solution: z.array(z.string()).min(1),
  /**
   * Alternate token orderings that are also grammatically correct (e.g. a
   * different but valid Vorfeld topicalization). Optional — most items have
   * a single accepted order.
   */
  solutionAlternates: z.array(z.array(z.string())).optional(),
});

export const fixitItemSchema = baseItem.extend({
  engine: z.literal("fixit"),
  stimulus: z.string(),
  answer: z.string(),
  acceptableAnswers: z.array(z.string()).optional(),
});

export const transformItemSchema = baseItem.extend({
  engine: z.literal("transform"),
  answer: z.string(),
  acceptableAnswers: z.array(z.string()).optional(),
});

export const timedItemSchema = baseItem.extend({
  engine: z.literal("timed"),
  answer: z.string(),
  acceptableAnswers: z.array(z.string()).optional(),
  timeLimitSec: z.number().int().positive().optional(),
});

export const exerciseItemSchema = z.discriminatedUnion("engine", [
  mcItemSchema,
  clozeItemSchema,
  builderItemSchema,
  fixitItemSchema,
  transformItemSchema,
  timedItemSchema,
]);

export type ExerciseItem = z.infer<typeof exerciseItemSchema>;
export type McItem = z.infer<typeof mcItemSchema>;
export type ClozeItem = z.infer<typeof clozeItemSchema>;
export type BuilderItem = z.infer<typeof builderItemSchema>;
export type FixitItem = z.infer<typeof fixitItemSchema>;
export type TransformItem = z.infer<typeof transformItemSchema>;
export type TimedItem = z.infer<typeof timedItemSchema>;

export const engineIds = [
  "mc",
  "cloze",
  "builder",
  "fixit",
  "transform",
  "timed",
] as const;
export type EngineId = (typeof engineIds)[number];
