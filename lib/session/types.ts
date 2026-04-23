import type { ExerciseItem } from "@/lib/content/schema";

export type SessionPhase = "loading" | "prompt" | "feedback" | "done";

export type LastResult = {
  ok: boolean;
  errorTags: string[];
  hint?: string;
};

export type SessionSnapshot = {
  phase: SessionPhase;
  items: ExerciseItem[];
  index: number;
  lastResult?: LastResult;
};
