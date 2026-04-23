"use client";

import { createElement, useCallback, useEffect, useLayoutEffect, useMemo, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import type { ExerciseItem } from "@/lib/content/schema";
import { getEngineComponent } from "@/lib/engines/registry";
import { createExerciseSessionStore } from "@/lib/session/exercise-store";
import { FeedbackPanel } from "@/components/session/FeedbackPanel";
import { ProgressBar } from "@/components/session/ProgressBar";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type SessionRunnerProps = {
  items: ExerciseItem[];
  /** Changing this value resets the session store */
  sessionKey: string;
  onResult?: (payload: {
    item: ExerciseItem;
    ok: boolean;
    errorTags: string[];
    isFirstAttempt: boolean;
  }) => Promise<{ xpAwarded?: number } | void> | void;
  exitHref?: string;
};

export function SessionRunner({ items, sessionKey, onResult, exitHref = "/" }: SessionRunnerProps) {
  const store = useMemo(() => {
    void sessionKey;
    return createExerciseSessionStore();
  }, [sessionKey]);

  useLayoutEffect(() => {
    store.getState().init(items);
  }, [items, store]);

  const snapshot = useSyncExternalStore(
    store.subscribe,
    () => store.getState().snapshot,
    () => store.getState().snapshot,
  );

  const [lastXp, setLastXp] = useState<number | undefined>(undefined);

  const submit = useCallback(
    async (attempt: unknown) => {
      const before = store.getState().snapshot;
      const currentItem = before.queue[before.cursor];
      // Determine if this is the first attempt before submitting
      const isFirstAttempt = !before.attemptsByItem[currentItem?.id ?? ""];

      store.getState().submit(attempt);

      const after = store.getState().snapshot;
      if (after.phase === "feedback" && after.lastResult && currentItem) {
        // Only call onResult (and award XP) on the first attempt
        if (isFirstAttempt) {
          const result = await onResult?.({
            item: currentItem,
            ok: after.lastResult.ok,
            errorTags: after.lastResult.errorTags,
            isFirstAttempt: true,
          });
          setLastXp(result && typeof result === "object" ? result.xpAwarded : undefined);
        } else {
          setLastXp(undefined);
        }
      }
    },
    [onResult, store],
  );

  const cont = useCallback(() => {
    setLastXp(undefined);
    store.getState().continue();
  }, [store]);

  const item = snapshot.queue[snapshot.cursor];
  const Engine = item ? getEngineComponent(item) : null;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (snapshot.phase === "feedback" && e.key === "Enter") {
        e.preventDefault();
        cont();
      }
      if (snapshot.phase === "prompt" && item?.engine === "mc") {
        const tag = (e.target as HTMLElement | null)?.tagName;
        if (tag === "INPUT" || tag === "TEXTAREA") return;
        if (e.key >= "1" && e.key <= "9") {
          const idx = parseInt(e.key, 10) - 1;
          if (idx >= 0 && idx < item.options.length) {
            e.preventDefault();
            void submit(idx);
          }
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [cont, item, snapshot.phase, submit]);

  if (snapshot.phase === "loading") {
    return <p className="text-muted-foreground">Loading session…</p>;
  }

  if (snapshot.phase === "prompt" || snapshot.phase === "feedback") {
    if (!item || !Engine) {
      return (
        <div className="rounded-2xl border border-border bg-card p-6 text-muted-foreground shadow-card">
          No exercises in this session.
          <div className="mt-4">
            <Link href={exitHref} className={cn(buttonVariants({ variant: "outline" }))}>
              Back
            </Link>
          </div>
        </div>
      );
    }
  }

  if (snapshot.phase === "done") {
    return (
      <div className="space-y-3 rounded-2xl border border-border bg-card p-8 text-center shadow-card">
        <p className="text-2xl font-bold">Session complete 🎉</p>
        <p className="text-sm text-muted-foreground">Great work — spaced review will surface trouble spots.</p>
        <Link href={exitHref} className={cn(buttonVariants({ variant: "primary", size: "lg" }), "mt-4 inline-flex")}>
          Done
        </Link>
      </div>
    );
  }

  const showEngine = snapshot.phase === "prompt";
  const showFeedback = snapshot.phase === "feedback" && !!snapshot.lastResult;

  return (
    <div className="space-y-5">
      <ProgressBar resolved={snapshot.resolved.length} target={snapshot.targetCount} />
      {/* work card */}
      <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-card">
        {showEngine && item && Engine ? (
          createElement(Engine, { item, disabled: false, onSubmit: (a) => { void submit(a); } })
        ) : null}
      </div>
      {/* spacer for fixed feedback sheet */}
      {showFeedback ? <div className="h-52" aria-hidden /> : null}
      {showFeedback && snapshot.lastResult ? (
        <FeedbackPanel
          result={snapshot.lastResult}
          correctMessage={item?.feedback?.correct}
          correctAnswerText={snapshot.lastCorrectAnswer}
          xpAwarded={lastXp}
          onContinue={cont}
        />
      ) : null}
    </div>
  );
}
