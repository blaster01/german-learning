import type { ComponentType, ReactNode } from "react";
import type { ExerciseItem } from "@/lib/content/schema";
import type { ValidationResult } from "@/lib/validators/types";

export type EngineSubmitPayload = unknown;

export type EngineProps<T extends ExerciseItem> = {
  item: T;
  disabled?: boolean;
  onSubmit: (attempt: EngineSubmitPayload) => void;
  /** Translation reveal control, rendered under the German stimulus. */
  translationSlot?: ReactNode;
};

export type EngineEntry<T extends ExerciseItem = ExerciseItem> = {
  Component: ComponentType<EngineProps<T>>;
  validate: (item: T, attempt: unknown) => ValidationResult;
};
