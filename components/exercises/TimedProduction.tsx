"use client";

import { useEffect, useRef, useState } from "react";
import type { TimedItem } from "@/lib/content/schema";
import type { EngineProps } from "@/lib/engines/types";
import { Button } from "@/components/ui/button";
import { SpeakButton } from "@/components/ui/speak-button";
import { UmlautKeys } from "@/components/ui/umlaut-keys";
import { cn } from "@/lib/utils";

export function TimedProduction({
  item,
  disabled,
  onSubmit,
  translationSlot,
}: EngineProps<TimedItem>) {
  const [value, setValue] = useState("");
  const limit = item.timeLimitSec ?? 45;
  const [left, setLeft] = useState(limit);
  const fired = useRef(false);
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fired.current = false;
    setLeft(limit);
    setValue("");
  }, [item.id, limit]);

  useEffect(() => {
    if (disabled) return;
    const t = setInterval(() => setLeft((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, [disabled, item.id, limit]);

  useEffect(() => {
    if (disabled || left > 0 || fired.current) return;
    fired.current = true;
    onSubmit(value.trim());
  }, [disabled, left, onSubmit, value]);

  const timedOut = left === 0 && !disabled;
  const urgency = left <= 10;

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between gap-3">
        <p className="text-xl font-semibold leading-snug">{item.prompt}</p>
        <span
          className={cn(
            "shrink-0 rounded-full border px-3 py-1 font-mono text-sm font-bold",
            urgency
              ? "animate-pulse border-destructive/40 bg-destructive/10 text-destructive"
              : "border-border bg-muted text-foreground",
          )}
          aria-live="polite"
          aria-atomic
        >
          {left}s
        </span>
      </div>
      {item.stimulus ? (
        <div className="flex items-start gap-2">
          <p className="text-base text-muted-foreground">{item.stimulus}</p>
          <SpeakButton text={item.stimulus} size="sm" />
        </div>
      ) : null}
      {translationSlot}
      <input
        ref={ref}
        className="w-full rounded-full border border-border bg-card px-5 py-3 text-base outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/30 disabled:opacity-50"
        value={value}
        disabled={disabled || timedOut}
        placeholder="Type your answer…"
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey && !e.repeat) {
            e.preventDefault();
            if (!disabled && !timedOut) onSubmit(value.trim());
          }
        }}
        autoComplete="off"
        aria-label="Your answer"
        autoFocus
      />
      <UmlautKeys
        targetRef={ref}
        value={value}
        onInsert={setValue}
        disabled={disabled || timedOut}
      />
      <Button
        type="button"
        size="lg"
        disabled={disabled || timedOut}
        className="w-full justify-center"
        onClick={() => onSubmit(value.trim())}
      >
        Check
      </Button>
    </div>
  );
}
