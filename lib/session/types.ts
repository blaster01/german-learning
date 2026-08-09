import type { ExerciseItem } from "@/lib/content/schema";

export type SessionPhase = "loading" | "prompt" | "feedback" | "done";

export type LastResult = {
  ok: boolean;
  errorTags: string[];
  hint?: string;
  /** Extra note shown alongside the result, e.g. flagging an umlaut-folded match. */
  note?: string;
};

export type SessionSnapshot = {
  phase: SessionPhase;
  /** Working queue — starts as the initial 15 items, grows when wrongs are re-queued. */
  queue: ExerciseItem[];
  /** Current position in the queue. */
  cursor: number;
  /** Number of attempts submitted for each itemId (first attempt = 0 before submit). */
  attemptsByItem: Record<string, number>;
  /** Set of itemIds that are fully resolved (correct OR exhausted 3 attempts). */
  resolved: string[];
  /** Denominator for progress bar (original session length, usually 15). */
  targetCount: number;
  /** Count of items resolved as correct (subset of `resolved`). */
  correctCount: number;
  lastResult?: LastResult;
  /** Correct answer text to show in FeedbackPanel on a wrong response. */
  lastCorrectAnswer?: string;
  /** True when the "done" phase was reached via an explicit early exit, not natural completion. */
  endedEarly?: boolean;
};
