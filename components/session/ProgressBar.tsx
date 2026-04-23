"use client";

import { cn } from "@/lib/utils";

export function ProgressBar({ current, total, className }: { current: number; total: number; className?: string }) {
  const pct = total <= 0 ? 0 : Math.round(((current + 1) / total) * 100);
  return (
    <div className={cn("w-full", className)}>
      <div className="flex justify-between pb-1.5 text-xs text-muted-foreground">
        <span>Question {Math.min(current + 1, total)} of {total}</span>
        <span className="font-medium text-primary">{pct}%</span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-primary transition-all duration-300 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
