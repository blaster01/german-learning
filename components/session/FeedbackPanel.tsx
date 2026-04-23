"use client";

import { CheckCircle2, XCircle } from "lucide-react";
import type { LastResult } from "@/lib/session/types";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function FeedbackPanel({
  result,
  correctMessage,
  xpAwarded,
  onContinue,
}: {
  result: LastResult;
  correctMessage?: string;
  xpAwarded?: number;
  onContinue: () => void;
}) {
  const isOk = result.ok;

  return (
    <div
      className={cn(
        "animate-slide-up fixed inset-x-0 bottom-0 z-20 rounded-t-2xl border-t-2 px-4 pb-safe-bottom pt-5 shadow-card-lg",
        isOk
          ? "border-success/50 bg-success/10 dark:bg-success/[0.07]"
          : "border-destructive/40 bg-destructive/10 dark:bg-destructive/[0.07]",
      )}
      role="status"
    >
      <div className="mx-auto max-w-2xl">
        <div className="flex items-start gap-3">
          {isOk ? (
            <CheckCircle2 className="mt-0.5 h-6 w-6 shrink-0 text-success" />
          ) : (
            <XCircle className="mt-0.5 h-6 w-6 shrink-0 text-destructive" />
          )}
          <div className="flex-1 space-y-1">
            <p className={cn("font-bold text-lg leading-tight", isOk ? "text-success" : "text-destructive")}>
              {isOk ? "Nice!" : "Almost —"}
            </p>
            {isOk ? (
              <>
                {correctMessage ? (
                  <p className="text-sm text-foreground/80">{correctMessage}</p>
                ) : (
                  <p className="text-sm text-foreground/80">Keep it up!</p>
                )}
                {xpAwarded ? (
                  <span className="inline-flex animate-fade-up items-center gap-1 rounded-full bg-success/20 px-2.5 py-0.5 text-xs font-bold text-success">
                    +{xpAwarded} XP
                  </span>
                ) : null}
              </>
            ) : (
              <div className="space-y-1 text-sm text-foreground/80">
                {result.hint ? <p>{result.hint}</p> : null}
                {result.errorTags.length > 0 ? (
                  <p className="font-mono text-xs text-muted-foreground">{result.errorTags.join(" · ")}</p>
                ) : null}
              </div>
            )}
          </div>
        </div>
        <Button
          type="button"
          variant={isOk ? "primary" : "outline"}
          size="lg"
          className="mt-4 w-full justify-center"
          onClick={onContinue}
        >
          Continue
          <span className="ml-2 text-xs opacity-60">(Enter)</span>
        </Button>
      </div>
    </div>
  );
}
