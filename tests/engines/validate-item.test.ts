import { describe, expect, it } from "vitest";
import type { ExerciseItem } from "@/lib/content/schema";
import { validateItem } from "@/lib/engines/registry";

const mc: ExerciseItem = {
  id: "t-mc",
  engine: "mc",
  prompt: "q",
  options: ["a", "b"],
  answer: 1,
  metadata: { cefr: "B1", system: "nominal", module: "m", tier: 1, tags: [] },
};

const cloze: ExerciseItem = {
  id: "t-cloze",
  engine: "cloze",
  prompt: "Fill in:",
  answer: "Hund",
  acceptableAnswers: ["Hunde"],
  metadata: { cefr: "B1", system: "nominal", module: "m", tier: 1, tags: [] },
};

const fixit: ExerciseItem = {
  id: "t-fixit",
  engine: "fixit",
  prompt: "Fix it:",
  stimulus: "Ich habe kein Zeit.",
  answer: "Ich habe keine Zeit.",
  metadata: { cefr: "B1", system: "syntax", module: "m", tier: 1, tags: [] },
};

const transform: ExerciseItem = {
  id: "t-transform",
  engine: "transform",
  prompt: "Rewrite as passive:",
  stimulus: "Der Lehrer korrigiert die Prüfung.",
  answer: "Die Prüfung wird von dem Lehrer korrigiert.",
  acceptableAnswers: ["Die Prüfung wird vom Lehrer korrigiert."],
  metadata: { cefr: "B1", system: "verb", module: "m", tier: 1, tags: [] },
};

const timed: ExerciseItem = {
  id: "t-timed",
  engine: "timed",
  prompt: "Quick:",
  answer: "ich hätte",
  acceptableAnswers: ["hätte"],
  metadata: { cefr: "B2", system: "verb", module: "m", tier: 1, tags: [] },
};

const builder: ExerciseItem = {
  id: "t-builder",
  engine: "builder",
  prompt: "Build:",
  tokens: ["Ich", "gehe", "nach", "Hause"],
  solution: ["Ich", "gehe", "nach", "Hause"],
  solutionAlternates: [["Nach", "Hause", "gehe", "ich"]],
  metadata: { cefr: "B1", system: "syntax", module: "m", tier: 1, tags: [] },
};

describe("validateItem", () => {
  it("validates mc — correct index, wrong index, and invalid attempt shapes", () => {
    expect(validateItem(mc, 1).ok).toBe(true);
    expect(validateItem(mc, 0).ok).toBe(false);
    expect(validateItem(mc, "1" as unknown).ok).toBe(false);
    expect(validateItem(mc, 5).ok).toBe(false);
  });

  it("validates cloze — canonical answer, acceptable alternate, and wrong answer", () => {
    expect(validateItem(cloze, "Hund").ok).toBe(true);
    expect(validateItem(cloze, "Hunde").ok).toBe(true);
    expect(validateItem(cloze, "Katze").ok).toBe(false);
    expect(validateItem(cloze, 123 as unknown).ok).toBe(false);
  });

  it("validates fixit — accepts the fix case-insensitively, rejects an unrelated sentence", () => {
    expect(validateItem(fixit, "Ich habe keine Zeit.").ok).toBe(true);
    expect(validateItem(fixit, "ich habe keine zeit.").ok).toBe(true);
    expect(validateItem(fixit, "Das Wetter ist heute schön.").ok).toBe(false);
  });

  it("validates transform — canonical answer and an acceptable alternate", () => {
    expect(
      validateItem(transform, "Die Prüfung wird von dem Lehrer korrigiert.").ok,
    ).toBe(true);
    expect(
      validateItem(transform, "Die Prüfung wird vom Lehrer korrigiert.").ok,
    ).toBe(true);
    expect(
      validateItem(transform, "Der Lehrer korrigiert die Prüfung.").ok,
    ).toBe(false);
  });

  it("validates timed — full answer or the short acceptable form", () => {
    expect(validateItem(timed, "ich hätte").ok).toBe(true);
    expect(validateItem(timed, "hätte").ok).toBe(true);
    expect(validateItem(timed, "ich habe").ok).toBe(false);
  });

  it("validates builder — exact solution order, an alternate order, and a wrong order", () => {
    expect(validateItem(builder, ["Ich", "gehe", "nach", "Hause"]).ok).toBe(
      true,
    );
    expect(validateItem(builder, ["Nach", "Hause", "gehe", "ich"]).ok).toBe(
      true,
    );
    expect(validateItem(builder, ["Hause", "Ich", "gehe", "nach"]).ok).toBe(
      false,
    );
    expect(validateItem(builder, ["Ich", "gehe", "nach"]).ok).toBe(false);
  });
});
