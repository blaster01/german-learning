import { createStore } from "zustand/vanilla";
import type { ExerciseItem } from "@/lib/content/schema";
import { createInitialSession, sessionReducer } from "./reducer";
import type { SessionSnapshot } from "./types";

export type ExerciseSessionStore = {
  snapshot: SessionSnapshot;
  init: (items: ExerciseItem[]) => void;
  submit: (attempt: unknown) => void;
  continue: () => void;
};

export function createExerciseSessionStore() {
  return createStore<ExerciseSessionStore>((set, get) => ({
    snapshot: createInitialSession(),
    init(items) {
      set({
        snapshot: sessionReducer(createInitialSession(), {
          type: "INIT",
          items,
        }),
      });
    },
    submit(attempt) {
      set({
        snapshot: sessionReducer(get().snapshot, { type: "SUBMIT", attempt }),
      });
    },
    continue() {
      set({ snapshot: sessionReducer(get().snapshot, { type: "CONTINUE" }) });
    },
  }));
}
