"use client";

import { useCallback, type RefObject } from "react";
import { cn } from "@/lib/utils";

const KEYS = ["ä", "ö", "ü", "ß", "Ä", "Ö", "Ü"] as const;

/**
 * A row of ä/ö/ü/ß buttons that insert the character at the current caret
 * position of a text input/textarea and restore focus + caret afterward.
 * Many keyboards (US layouts, some mobile layouts) make umlauts hard to
 * type, so this gives typed-answer exercises a tap-friendly alternative —
 * on top of the base-letter tolerance in the fuzzy matcher.
 */
export function UmlautKeys({
  targetRef,
  value,
  onInsert,
  disabled,
  className,
}: {
  targetRef: RefObject<HTMLInputElement | HTMLTextAreaElement | null>;
  value: string;
  onInsert: (next: string) => void;
  disabled?: boolean;
  className?: string;
}) {
  const insert = useCallback(
    (char: string) => {
      const el = targetRef.current;
      if (!el) {
        onInsert(value + char);
        return;
      }
      const start = el.selectionStart ?? value.length;
      const end = el.selectionEnd ?? value.length;
      const next = value.slice(0, start) + char + value.slice(end);
      onInsert(next);
      const caret = start + char.length;
      // Restore focus + caret after React commits the new controlled value.
      requestAnimationFrame(() => {
        el.focus();
        el.setSelectionRange(caret, caret);
      });
    },
    [onInsert, targetRef, value],
  );

  return (
    <div
      className={cn("flex flex-wrap gap-1.5", className)}
      role="group"
      aria-label="Insert umlaut character"
    >
      {KEYS.map((key) => (
        <button
          key={key}
          type="button"
          disabled={disabled}
          tabIndex={-1}
          // Keep focus/selection on the input so `selectionStart` stays
          // accurate at click time instead of being lost to the button.
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => insert(key)}
          className="min-w-[2.25rem] rounded-lg border border-border bg-muted/50 px-2.5 py-1.5 text-sm font-semibold text-foreground transition hover:bg-muted disabled:pointer-events-none disabled:opacity-50"
        >
          {key}
        </button>
      ))}
    </div>
  );
}
