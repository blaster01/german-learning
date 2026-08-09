"use client";

import { useState } from "react";
import type { FixitItem } from "@/lib/content/schema";
import type { EngineProps } from "@/lib/engines/types";
import { Button } from "@/components/ui/button";
import { SpeakButton } from "@/components/ui/speak-button";

export function ErrorCorrection({
  item,
  disabled,
  onSubmit,
}: EngineProps<FixitItem>) {
  const [value, setValue] = useState("");

  return (
    <div className="space-y-5">
      <p className="text-xl font-semibold leading-snug">{item.prompt}</p>
      <div className="flex items-start gap-2 rounded-2xl border-2 border-accent/40 bg-accent/10 px-4 py-3 font-medium text-foreground">
        <p className="flex-1">{item.stimulus}</p>
        <SpeakButton text={item.stimulus} size="sm" />
      </div>
      <label
        className="block text-xs font-semibold uppercase tracking-wide text-muted-foreground"
        htmlFor={`fix-${item.id}`}
      >
        Corrected sentence
      </label>
      <textarea
        id={`fix-${item.id}`}
        className="min-h-[88px] w-full rounded-2xl border border-border bg-card px-4 py-3 text-base outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/30 disabled:opacity-50"
        value={value}
        disabled={disabled}
        placeholder="Type the corrected version… (Enter to check)"
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            if (!disabled) onSubmit(value.trim());
          }
        }}
        autoComplete="off"
        autoFocus
      />
      <Button
        type="button"
        size="lg"
        disabled={disabled}
        className="w-full justify-center"
        onClick={() => onSubmit(value.trim())}
      >
        Check
      </Button>
    </div>
  );
}
