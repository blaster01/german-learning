"use client";

import type { ButtonHTMLAttributes, HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

/** Passive chip — metadata pill (tier, tag, etc.) */
export function Chip({ className, ...props }: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border border-border/60 bg-muted px-3 py-1 text-xs font-medium text-foreground",
        className,
      )}
      {...props}
    />
  );
}

/** Interactive token chip for sentence-builder word banks */
export function TokenChip({
  selected,
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { selected?: boolean }) {
  return (
    <button
      type="button"
      className={cn(
        "inline-flex cursor-pointer select-none items-center rounded-full border px-3 py-1.5 text-sm font-medium transition-all",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring",
        "disabled:pointer-events-none disabled:opacity-50",
        selected
          ? "border-primary bg-primary/10 text-primary"
          : "border-border bg-card text-foreground hover:border-primary/60 hover:bg-primary/5 active:scale-95",
        className,
      )}
      {...props}
    />
  );
}
