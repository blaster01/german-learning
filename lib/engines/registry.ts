import type { ComponentType } from "react";
import type { ExerciseItem } from "@/lib/content/schema";
import { ClozeFill } from "@/components/exercises/ClozeFill";
import { ErrorCorrection } from "@/components/exercises/ErrorCorrection";
import { MultipleChoice } from "@/components/exercises/MultipleChoice";
import { SentenceBuilder } from "@/components/exercises/SentenceBuilder";
import { TimedProduction } from "@/components/exercises/TimedProduction";
import { Transformation } from "@/components/exercises/Transformation";
import { validateExerciseItem } from "@/lib/engines/engine-validate";
import type { EngineEntry, EngineProps } from "@/lib/engines/types";

export const engines: {
  mc: EngineEntry<Extract<ExerciseItem, { engine: "mc" }>>;
  cloze: EngineEntry<Extract<ExerciseItem, { engine: "cloze" }>>;
  builder: EngineEntry<Extract<ExerciseItem, { engine: "builder" }>>;
  fixit: EngineEntry<Extract<ExerciseItem, { engine: "fixit" }>>;
  transform: EngineEntry<Extract<ExerciseItem, { engine: "transform" }>>;
  timed: EngineEntry<Extract<ExerciseItem, { engine: "timed" }>>;
} = {
  mc: { Component: MultipleChoice, validate: validateExerciseItem },
  cloze: { Component: ClozeFill, validate: validateExerciseItem },
  builder: { Component: SentenceBuilder, validate: validateExerciseItem },
  fixit: { Component: ErrorCorrection, validate: validateExerciseItem },
  transform: { Component: Transformation, validate: validateExerciseItem },
  timed: { Component: TimedProduction, validate: validateExerciseItem },
};

export function getEngineComponent(item: ExerciseItem): ComponentType<EngineProps<ExerciseItem>> {
  return engines[item.engine].Component as ComponentType<EngineProps<ExerciseItem>>;
}

export function validateItem(item: ExerciseItem, attempt: unknown) {
  return validateExerciseItem(item, attempt);
}
