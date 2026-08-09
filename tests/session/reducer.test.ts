import { describe, expect, it } from "vitest";
import type { ExerciseItem } from "@/lib/content/schema";
import { createInitialSession, sessionReducer } from "@/lib/session/reducer";

const mc: ExerciseItem = {
  id: "mc-1",
  engine: "mc",
  prompt: "Choose:",
  options: ["a", "b"],
  answer: 1,
  metadata: {
    cefr: "B1",
    system: "nominal",
    module: "m",
    tier: 1,
    tags: ["grammar:gender"],
  },
  feedback: { correct: "Nice!", common: { "mc:wrong": "Item-specific hint." } },
};

const cloze: ExerciseItem = {
  id: "cloze-1",
  engine: "cloze",
  prompt: "Fill in:",
  stimulus: "Der ____ ist groß.",
  answer: "Hund",
  metadata: { cefr: "B1", system: "nominal", module: "m", tier: 1, tags: [] },
};

const builder: ExerciseItem = {
  id: "builder-1",
  engine: "builder",
  prompt: "Build:",
  tokens: ["Ich", "gehe", "nach", "Hause"],
  solution: ["Ich", "gehe", "nach", "Hause"],
  metadata: { cefr: "B1", system: "syntax", module: "m", tier: 1, tags: [] },
};

describe("sessionReducer INIT", () => {
  it("goes straight to done for an empty item list", () => {
    const state = sessionReducer(createInitialSession(), {
      type: "INIT",
      items: [],
    });
    expect(state.phase).toBe("done");
  });

  it("starts at the prompt phase with the given queue", () => {
    const state = sessionReducer(createInitialSession(), {
      type: "INIT",
      items: [mc, cloze],
    });
    expect(state.phase).toBe("prompt");
    expect(state.queue).toEqual([mc, cloze]);
    expect(state.cursor).toBe(0);
    expect(state.targetCount).toBe(2);
    expect(state.resolved).toEqual([]);
  });
});

describe("sessionReducer SUBMIT — correct answers", () => {
  it("resolves the item and moves to the feedback phase", () => {
    let state = sessionReducer(createInitialSession(), {
      type: "INIT",
      items: [mc],
    });
    state = sessionReducer(state, { type: "SUBMIT", attempt: 1 });
    expect(state.phase).toBe("feedback");
    expect(state.lastResult?.ok).toBe(true);
    expect(state.resolved).toEqual(["mc-1"]);
    expect(state.lastCorrectAnswer).toBeUndefined();
  });
});

describe("sessionReducer SUBMIT — wrong answers", () => {
  it("re-queues a wrong answer instead of resolving it immediately", () => {
    let state = sessionReducer(createInitialSession(), {
      type: "INIT",
      items: [mc],
    });
    state = sessionReducer(state, { type: "SUBMIT", attempt: 0 });
    expect(state.phase).toBe("feedback");
    expect(state.lastResult?.ok).toBe(false);
    expect(state.resolved).toEqual([]);
    // Re-queued as a second copy at the end.
    expect(state.queue).toHaveLength(2);
    expect(state.attemptsByItem["mc-1"]).toBe(1);
  });

  it("resolves as failed once attempts are exhausted (3 tries)", () => {
    let state = sessionReducer(createInitialSession(), {
      type: "INIT",
      items: [mc],
    });
    // Attempt 1: wrong -> requeued
    state = sessionReducer(state, { type: "SUBMIT", attempt: 0 });
    state = sessionReducer(state, { type: "CONTINUE" });
    // Attempt 2: wrong -> requeued
    state = sessionReducer(state, { type: "SUBMIT", attempt: 0 });
    state = sessionReducer(state, { type: "CONTINUE" });
    // Attempt 3: wrong -> exhausted, resolved as failed
    state = sessionReducer(state, { type: "SUBMIT", attempt: 0 });
    expect(state.attemptsByItem["mc-1"]).toBe(3);
    expect(state.resolved).toEqual(["mc-1"]);
    expect(state.lastResult?.ok).toBe(false);
  });

  it("surfaces the correct answer text for mc/cloze/builder engines", () => {
    let state = sessionReducer(createInitialSession(), {
      type: "INIT",
      items: [mc],
    });
    state = sessionReducer(state, { type: "SUBMIT", attempt: 0 });
    expect(state.lastCorrectAnswer).toBe("b");

    state = sessionReducer(createInitialSession(), {
      type: "INIT",
      items: [cloze],
    });
    state = sessionReducer(state, { type: "SUBMIT", attempt: "wrong" });
    expect(state.lastCorrectAnswer).toBe("Hund");

    state = sessionReducer(createInitialSession(), {
      type: "INIT",
      items: [builder],
    });
    state = sessionReducer(state, {
      type: "SUBMIT",
      attempt: ["wrong", "order"],
    });
    expect(state.lastCorrectAnswer).toBe("Ich gehe nach Hause");
  });

  it("prefers an item-authored hint over the global hint map", () => {
    let state = sessionReducer(createInitialSession(), {
      type: "INIT",
      items: [mc],
    });
    state = sessionReducer(state, { type: "SUBMIT", attempt: 0 });
    expect(state.lastResult?.hint).toBe("Item-specific hint.");
  });

  it("falls back to the global hint map when the item has no matching feedback", () => {
    let state = sessionReducer(createInitialSession(), {
      type: "INIT",
      items: [cloze],
    });
    state = sessionReducer(state, { type: "SUBMIT", attempt: "wrong" });
    // cloze validation failure tags -> global hint map should supply something.
    expect(state.lastResult?.hint).toBeTruthy();
  });
});

describe("sessionReducer CONTINUE", () => {
  it("advances the cursor back to prompt phase", () => {
    let state = sessionReducer(createInitialSession(), {
      type: "INIT",
      items: [mc, cloze],
    });
    state = sessionReducer(state, { type: "SUBMIT", attempt: 1 });
    state = sessionReducer(state, { type: "CONTINUE" });
    expect(state.phase).toBe("prompt");
    expect(state.cursor).toBe(1);
    expect(state.lastResult).toBeUndefined();
  });

  it("moves to done after the last item is resolved", () => {
    let state = sessionReducer(createInitialSession(), {
      type: "INIT",
      items: [mc],
    });
    state = sessionReducer(state, { type: "SUBMIT", attempt: 1 });
    state = sessionReducer(state, { type: "CONTINUE" });
    expect(state.phase).toBe("done");
  });

  it("is a no-op outside the feedback phase", () => {
    const initial = sessionReducer(createInitialSession(), {
      type: "INIT",
      items: [mc],
    });
    const after = sessionReducer(initial, { type: "CONTINUE" });
    expect(after).toBe(initial);
  });
});
