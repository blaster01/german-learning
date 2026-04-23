"use client";

import { useState } from "react";
import type { TransformItem } from "@/lib/content/schema";
import type { EngineProps } from "@/lib/engines/types";
import { Button } from "@/components/ui/button";

export function Transformation({ item, disabled, onSubmit }: EngineProps<TransformItem>) {
  const [value, setValue] = useState("");

  return (
    <div className="space-y-5">
      <p className="text-xl font-semibold leading-snug">{item.prompt}</p>
      {item.stimulus ? (
        <div className="rounded-2xl border border-border/60 bg-muted/30 px-4 py-3 text-base text-foreground">
          {item.stimulus}
        </div>
      ) : null}
      <textarea
        className="min-h-[88px] w-full rounded-2xl border border-border bg-card px-4 py-3 text-base outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/30 disabled:opacity-50"
        value={value}
        disabled={disabled}
        placeholder="Type your rewrite…"
        onChange={(e) => setValue(e.target.value)}
        autoComplete="off"
        aria-label="Your rewrite"
      />
      <Button type="button" size="lg" disabled={disabled} className="w-full justify-center" onClick={() => onSubmit(value.trim())}>
        Check
      </Button>
    </div>
  );
}
