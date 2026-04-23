import { validateItem } from "@/lib/engines/registry";
import { hintForTags } from "@/lib/validators/feedback";
import type { ExerciseItem } from "@/lib/content/schema";
import type { LastResult, SessionSnapshot } from "./types";

export type SessionAction =
  | { type: "INIT"; items: ExerciseItem[] }
  | { type: "SUBMIT"; attempt: unknown }
  | { type: "CONTINUE" };

const loading: SessionSnapshot = {
  phase: "loading",
  items: [],
  index: 0,
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

export function sessionReducer(state: SessionSnapshot, action: SessionAction): SessionSnapshot {
  switch (action.type) {
    case "INIT": {
      if (action.items.length === 0) {
        return { phase: "done", items: [], index: 0 };
      }
      return { phase: "prompt", items: action.items, index: 0, lastResult: undefined };
    }
    case "SUBMIT": {
      if (state.phase !== "prompt") return state;
      const item = state.items[state.index];
      if (!item) return state;
      const raw = validateItem(item, action.attempt);
      const lastResult: LastResult = raw.ok
        ? { ok: true, errorTags: [] }
        : mergeHint(item, {
            ok: false,
            errorTags: raw.errorTags,
            hint: raw.hint,
          });
      return { ...state, phase: "feedback", lastResult };
    }
    case "CONTINUE": {
      if (state.phase !== "feedback") return state;
      const next = state.index + 1;
      if (next >= state.items.length) {
        return { ...state, phase: "done", lastResult: undefined };
      }
      return { ...state, phase: "prompt", index: next, lastResult: undefined };
    }
    default:
      return state;
  }
}

export function createInitialSession(): SessionSnapshot {
  return loading;
}
