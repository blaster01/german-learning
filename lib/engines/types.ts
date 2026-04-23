import type { ComponentType } from "react";
import type { ExerciseItem } from "@/lib/content/schema";
import type { ValidationResult } from "@/lib/validators/types";

export type EngineSubmitPayload = unknown;

export type EngineProps<T extends ExerciseItem> = {
  item: T;
  disabled?: boolean;
  onSubmit: (attempt: EngineSubmitPayload) => void;
};

export type EngineEntry<T extends ExerciseItem = ExerciseItem> = {
  Component: ComponentType<EngineProps<T>>;
  validate: (item: T, attempt: unknown) => ValidationResult;
};
