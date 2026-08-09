"use client";

import { useRef, useState } from "react";
import type { TransformItem } from "@/lib/content/schema";
import type { EngineProps } from "@/lib/engines/types";
import { Button } from "@/components/ui/button";
import { SpeakButton } from "@/components/ui/speak-button";
import { UmlautKeys } from "@/components/ui/umlaut-keys";

export function Transformation({
  item,
  disabled,
  onSubmit,
}: EngineProps<TransformItem>) {
  const [value, setValue] = useState("");
  const ref = useRef<HTMLTextAreaElement>(null);

  return (
    <div className="space-y-5">
      <p className="text-xl font-semibold leading-snug">{item.prompt}</p>
      {item.stimulus ? (
        <div className="flex items-start gap-2 rounded-2xl border border-border/60 bg-muted/30 px-4 py-3 text-base text-foreground">
          <p className="flex-1">{item.stimulus}</p>
          <SpeakButton text={item.stimulus} size="sm" />
        </div>
      ) : null}
      <textarea
        ref={ref}
        className="min-h-[88px] w-full rounded-2xl border border-border bg-card px-4 py-3 text-base outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/30 disabled:opacity-50"
        value={value}
        disabled={disabled}
        placeholder="Type your rewrite… (Enter to check)"
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey && !e.repeat) {
            e.preventDefault();
            if (!disabled) onSubmit(value.trim());
          }
        }}
        autoComplete="off"
        aria-label="Your rewrite"
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
        onClick={() => onSubmit(value.trim())}
      >
        Check
      </Button>
    </div>
  );
}
