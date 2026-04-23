import { validateItem } from "@/lib/engines/registry";
import { hintForTags } from "@/lib/validators/feedback";
import type { ExerciseItem } from "@/lib/content/schema";
import type { LastResult, SessionSnapshot } from "./types";

export type SessionAction =
  | { type: "INIT"; items: ExerciseItem[] }
  | { type: "SUBMIT"; attempt: unknown }
  | { type: "CONTINUE" };

const MAX_ATTEMPTS = 3;

const loading: SessionSnapshot = {
  phase: "loading",
  queue: [],
  cursor: 0,
  attemptsByItem: {},
  resolved: [],
  targetCount: 0,
};

function mergeHint(item: ExerciseItem, r: LastResult): LastResult {
  if (r.ok) return r;
  const tags = r.errorTags;
  for (const tag of tags) {
    const fromItem = item.feedback?.common?.[tag];
    if (fromItem) return { ...r, hint: fromItem };
  }
  if (r.hint) return r;
  const globalHint = hintForTags(tags);
  return globalHint ? { ...r, hint: globalHint } : r;
}

/** Derive the human-readable correct answer string from an item. */
function correctAnswerText(item: ExerciseItem): string {
  switch (item.engine) {
    case "mc":
      return item.options[item.answer] ?? "";
    case "builder":
      return item.solution.join(" ");
    case "cloze":
    case "fixit":
    case "transform":
    case "timed":
      return item.answer;
    default: {
      const _exhaustive: never = item;
      return "";
    }
  }
}

export function sessionReducer(state: SessionSnapshot, action: SessionAction): SessionSnapshot {
  switch (action.type) {
    case "INIT": {
      if (action.items.length === 0) {
        return { ...loading, phase: "done" };
      }
      return {
        phase: "prompt",
        queue: [...action.items],
        cursor: 0,
        attemptsByItem: {},
        resolved: [],
        targetCount: action.items.length,
        lastResult: undefined,
        lastCorrectAnswer: undefined,
      };
    }

    case "SUBMIT": {
      if (state.phase !== "prompt") return state;
      const item = state.queue[state.cursor];
      if (!item) return state;

      const raw = validateItem(item, action.attempt);
      const lastResult: LastResult = raw.ok
        ? { ok: true, errorTags: [] }
        : mergeHint(item, { ok: false, errorTags: raw.errorTags, hint: raw.hint });

      const prevAttempts = state.attemptsByItem[item.id] ?? 0;
      const newAttempts = prevAttempts + 1;

      let newQueue = state.queue;
      let newResolved = state.resolved;

      if (lastResult.ok) {
        // Correct — resolve immediately
        if (!newResolved.includes(item.id)) {
          newResolved = [...newResolved, item.id];
        }
      } else {
        // Wrong — re-queue if attempts < MAX_ATTEMPTS, else resolve as failed
        if (newAttempts < MAX_ATTEMPTS) {
          // Append a copy to the end so they'll see it again
          newQueue = [...state.queue, item];
        } else {
          // Exhausted — resolve (failed)
          if (!newResolved.includes(item.id)) {
            newResolved = [...newResolved, item.id];
          }
        }
      }

      return {
        ...state,
        phase: "feedback",
        queue: newQueue,
        attemptsByItem: { ...state.attemptsByItem, [item.id]: newAttempts },
        resolved: newResolved,
        lastResult,
        lastCorrectAnswer: lastResult.ok ? undefined : correctAnswerText(item),
      };
    }

    case "CONTINUE": {
      if (state.phase !== "feedback") return state;
      const next = state.cursor + 1;
      if (next >= state.queue.length) {
        return { ...state, phase: "done", lastResult: undefined, lastCorrectAnswer: undefined };
      }
      return {
        ...state,
        phase: "prompt",
        cursor: next,
        lastResult: undefined,
        lastCorrectAnswer: undefined,
      };
    }

    default:
      return state;
  }
}

export function createInitialSession(): SessionSnapshot {
  return loading;
}
