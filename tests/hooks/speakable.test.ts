import { describe, expect, it } from "vitest";
import { toSpeakableGerman } from "@/lib/hooks/use-speech";

describe("toSpeakableGerman", () => {
  it("replaces a full blank with Lücke", () => {
    expect(toSpeakableGerman("Sie redet die ganze Zeit über ____.")).toBe(
      "Sie redet die ganze Zeit über Lücke.",
    );
  });

  it("replaces a partial word fragment blank with Lücke", () => {
    expect(toSpeakableGerman("Das Buch liegt auf d____ Tisch.")).toBe(
      "Das Buch liegt auf Lücke Tisch.",
    );
  });

  it("replaces multiple blanks in the same sentence", () => {
    expect(
      toSpeakableGerman("____ sagte, dass er sein____ Auto verkauft."),
    ).toBe("Lücke sagte, dass er Lücke Auto verkauft.");
  });

  it("leaves text without blanks unchanged (aside from whitespace collapse)", () => {
    expect(toSpeakableGerman("Ich habe keine Zeit dafür.")).toBe(
      "Ich habe keine Zeit dafür.",
    );
  });

  it("collapses extraneous whitespace and trims", () => {
    expect(toSpeakableGerman("  Ich   habe   Zeit.  ")).toBe("Ich habe Zeit.");
  });

  it("does not touch single or double underscores that aren't blank markers", () => {
    expect(toSpeakableGerman("a_b")).toBe("a_b");
  });
});

describe("toSpeakableGerman with pauseAtBlanks", () => {
  it("wraps a blank in commas so the voice pauses on both sides", () => {
    expect(
      toSpeakableGerman("Sie redet die ganze Zeit über ____.", {
        pauseAtBlanks: true,
      }),
    ).toBe("Sie redet die ganze Zeit über, Lücke.");
  });

  it("pauses around a mid-sentence word-fragment blank", () => {
    expect(
      toSpeakableGerman("Das Buch liegt auf d____ Tisch.", {
        pauseAtBlanks: true,
      }),
    ).toBe("Das Buch liegt auf, Lücke, Tisch.");
  });

  it("pauses around a sentence-initial blank without a stray leading comma", () => {
    expect(
      toSpeakableGerman("____ kommt später.", { pauseAtBlanks: true }),
    ).toBe("Lücke, kommt später.");
  });

  it("collapses a double comma when a blank follows existing punctuation", () => {
    expect(
      toSpeakableGerman("Er sagt, ____ kommt.", { pauseAtBlanks: true }),
    ).toBe("Er sagt, Lücke, kommt.");
  });

  it("handles multiple blanks in the same sentence", () => {
    expect(
      toSpeakableGerman("____ sagte, dass er sein____ Auto verkauft.", {
        pauseAtBlanks: true,
      }),
    ).toBe("Lücke, sagte, dass er, Lücke, Auto verkauft.");
  });

  it("leaves blank-free text untouched", () => {
    expect(
      toSpeakableGerman("Ich habe keine Zeit dafür.", { pauseAtBlanks: true }),
    ).toBe("Ich habe keine Zeit dafür.");
  });
});
