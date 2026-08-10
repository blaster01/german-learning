"use client";

import { useRef, useState } from "react";
import type { ClozeItem } from "@/lib/content/schema";
import type { EngineProps } from "@/lib/engines/types";
import { Button } from "@/components/ui/button";
import { SpeakButton } from "@/components/ui/speak-button";
import { UmlautKeys } from "@/components/ui/umlaut-keys";

export function ClozeFill({
  item,
  disabled,
  onSubmit,
  translationSlot,
}: EngineProps<ClozeItem>) {
  const [value, setValue] = useState("");
  const ref = useRef<HTMLInputElement>(null);

  return (
    <div className="space-y-5">
      <p className="text-xl font-semibold leading-snug">{item.prompt}</p>
      {item.stimulus ? (
        <div className="flex items-start gap-2">
          <p className="text-base text-muted-foreground">{item.stimulus}</p>
          <SpeakButton text={item.stimulus} size="sm" />
        </div>
      ) : null}
      {translationSlot}
      <input
        ref={ref}
        className="w-full rounded-full border border-border bg-card px-5 py-3 text-base shadow-sm outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/30 disabled:opacity-50"
        value={value}
        disabled={disabled}
        placeholder="Type your answer…"
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey && !e.repeat) {
            e.preventDefault();
            if (!disabled) onSubmit(value);
          }
        }}
        aria-label="Your answer"
        autoComplete="off"
        autoFocus
      />
      <UmlautKeys
        targetRef={ref}
        value={value}
        onInsert={setValue}
        disabled={disabled}
      />
      <Button
        type="button"
        size="lg"
        disabled={disabled}
        className="w-full justify-center"
        onClick={() => onSubmit(value)}
      >
        Check
      </Button>
    </div>
  );
}
