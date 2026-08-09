"use client";

import { useEffect, useRef } from "react";
import { CheckCircle2, XCircle } from "lucide-react";
import type { LastResult } from "@/lib/session/types";
import { Button } from "@/components/ui/button";
import { SpeakButton } from "@/components/ui/speak-button";
import { cn } from "@/lib/utils";

export function FeedbackPanel({
  result,
  correctMessage,
  correctAnswerText,
  translation,
  xpAwarded,
  onContinue,
}: {
  result: LastResult;
  correctMessage?: string;
  /** Shown when the answer was wrong — the text of the correct answer. */
  correctAnswerText?: string;
  /** English translation, always shown after submitting regardless of outcome. */
  translation?: string;
  xpAwarded?: number;
  onContinue: () => void;
}) {
  const isOk = result.ok;
  const headingRef = useRef<HTMLParagraphElement>(null);

  // Move focus onto the feedback panel whenever a new result comes in, so
  // screen-reader users get the correctness announcement and land somewhere
  // keyboard-operable instead of on an orphaned, now-disabled engine control.
  useEffect(() => {
    headingRef.current?.focus();
  }, [result]);

  return (
    <div
      className={cn(
        "fixed inset-x-0 bottom-0 z-20 animate-slide-up rounded-t-2xl border-t-2 px-4 pb-safe-bottom pt-5 shadow-card-lg motion-reduce:animate-none",
        isOk
          ? "border-success/50 bg-success/10 dark:bg-success/[0.07]"
          : "border-destructive/40 bg-destructive/10 dark:bg-destructive/[0.07]",
      )}
      role="status"
      aria-live="assertive"
      aria-atomic="true"
    >
      <div className="mx-auto max-w-2xl">
        <div className="flex items-start gap-3">
          {isOk ? (
            <CheckCircle2 className="mt-0.5 h-6 w-6 shrink-0 text-success" />
          ) : (
            <XCircle className="mt-0.5 h-6 w-6 shrink-0 text-destructive" />
          )}
          <div className="flex-1 space-y-1">
            <p
              ref={headingRef}
              tabIndex={-1}
              className={cn(
                "text-lg font-bold leading-tight outline-none",
                isOk ? "text-success" : "text-destructive",
              )}
            >
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
              <div className="space-y-2 text-sm text-foreground/80">
                {result.hint ? <p>{result.hint}</p> : null}
                {correctAnswerText ? (
                  <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2">
                    <span className="text-xs font-semibold uppercase tracking-wide text-destructive/70">
                      Correct answer
                    </span>
                    <div className="mt-0.5 flex items-start gap-2">
                      <p className="flex-1 font-medium text-foreground">
                        {correctAnswerText}
                      </p>
                      <SpeakButton text={correctAnswerText} size="sm" />
                    </div>
                  </div>
                ) : null}
              </div>
            )}
            {result.note ? (
              <p className="text-xs italic text-muted-foreground">
                {result.note}
              </p>
            ) : null}
            {translation ? (
              <p className="text-sm italic text-muted-foreground">
                {translation}
              </p>
            ) : null}
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
