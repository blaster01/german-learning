"use client";

import type { McItem } from "@/lib/content/schema";
import type { EngineProps } from "@/lib/engines/types";
import { SpeakButton } from "@/components/ui/speak-button";
import { cn } from "@/lib/utils";

export function MultipleChoice({
  item,
  disabled,
  onSubmit,
  translationSlot,
}: EngineProps<McItem>) {
  return (
    <div className="space-y-4">
      <p className="text-xl font-semibold leading-snug">{item.prompt}</p>
      {item.stimulus ? (
        <div className="flex items-start gap-2">
          <p className="text-base text-muted-foreground">{item.stimulus}</p>
          <SpeakButton text={item.stimulus} size="sm" />
        </div>
      ) : null}
      {translationSlot}
      <div className="grid gap-3 sm:grid-cols-2">
        {item.options.map((opt, i) => (
          <button
            key={`${item.id}-${i}`}
            type="button"
            className={cn(
              "group relative flex min-h-14 cursor-pointer items-center gap-3 rounded-2xl border border-border/80 bg-card px-4 py-3 text-left text-sm font-medium shadow-card transition-all",
              "hover:border-primary/50 hover:shadow-card-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring",
              "disabled:pointer-events-none disabled:opacity-50",
            )}
            disabled={disabled}
            onClick={() => onSubmit(i)}
            aria-label={`Option ${i + 1}: ${opt}`}
          >
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-border/60 bg-muted font-mono text-xs text-muted-foreground transition group-hover:border-primary/40 group-hover:bg-primary/10 group-hover:text-primary">
              {i + 1}
            </span>
            <span>{opt}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
