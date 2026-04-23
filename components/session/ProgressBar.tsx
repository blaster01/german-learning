"use client";

import { cn } from "@/lib/utils";

export function ProgressBar({
  resolved,
  target,
  className,
}: {
  /** Number of questions fully resolved (correct or exhausted). */
  resolved: number;
  /** Total target questions for this session (denominator). */
  target: number;
  className?: string;
}) {
  const pct = target <= 0 ? 0 : Math.min(100, Math.round((resolved / target) * 100));
  const remaining = Math.max(0, target - resolved);
  return (
    <div className={cn("w-full", className)}>
      <div className="flex justify-between pb-1.5 text-xs text-muted-foreground">
        <span>{resolved} of {target} complete</span>
        {remaining > 0 ? (
          <span className="font-medium text-primary">{remaining} left</span>
        ) : (
          <span className="font-medium text-success">Done!</span>
        )}
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
