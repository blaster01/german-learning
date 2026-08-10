"use client";

import {
  createElement,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import Link from "next/link";
import type { ExerciseItem } from "@/lib/content/schema";
import { getEngineComponent } from "@/lib/engines/registry";
import { createExerciseSessionStore } from "@/lib/session/exercise-store";
import { FeedbackPanel } from "@/components/session/FeedbackPanel";
import { ProgressBar } from "@/components/session/ProgressBar";
import { Button, buttonVariants } from "@/components/ui/button";
import { Languages } from "lucide-react";
import { cn } from "@/lib/utils";

export type SessionRunnerProps = {
  items: ExerciseItem[];
  /** Changing this value resets the session store */
  sessionKey: string;
  onResult?: (payload: {
    item: ExerciseItem;
    ok: boolean;
    errorTags: string[];
    /** Total attempts made on this item before it was resolved (correct or exhausted). */
    attempts: number;
  }) => Promise<{ xpAwarded?: number } | void> | void;
  /**
   * Called once, right before ending a session early, with every item that
   * has at least one attempt but never resolved (the learner got it wrong
   * and would have retried). Lets the caller record those as lapses instead
   * of silently losing the attempt.
   */
  onFlush?: (
    entries: { item: ExerciseItem; attempts: number }[],
  ) => Promise<void> | void;
  exitHref?: string;
};

export function SessionRunner({
  items,
  sessionKey,
  onResult,
  onFlush,
  exitHref = "/",
}: SessionRunnerProps) {
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
  const [totalXp, setTotalXp] = useState(0);
  const [revealedTranslationFor, setRevealedTranslationFor] = useState<
    string | null
  >(null);
  const [endConfirming, setEndConfirming] = useState(false);
  const [ending, setEnding] = useState(false);

  const submit = useCallback(
    async (attempt: unknown) => {
      const before = store.getState().snapshot;
      const currentItem = before.queue[before.cursor];
      const wasResolvedBefore = currentItem
        ? before.resolved.includes(currentItem.id)
        : false;

      store.getState().submit(attempt);

      const after = store.getState().snapshot;
      if (after.phase === "feedback" && after.lastResult && currentItem) {
        // Grade (and award XP) exactly once per item, when it becomes
        // resolved — either correct now, or exhausted its retry budget.
        // A wrong answer that gets re-queued does not resolve the item yet,
        // so FSRS only ever sees the final outcome, not the first attempt.
        const isResolvedNow =
          after.resolved.includes(currentItem.id) && !wasResolvedBefore;
        if (isResolvedNow) {
          const attempts = after.attemptsByItem[currentItem.id] ?? 1;
          const result = await onResult?.({
            item: currentItem,
            ok: after.lastResult.ok,
            errorTags: after.lastResult.errorTags,
            attempts,
          });
          const xpAwarded =
            result && typeof result === "object" ? result.xpAwarded : undefined;
          setLastXp(xpAwarded);
          if (xpAwarded) setTotalXp((prev) => prev + xpAwarded);
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

  const finishEnding = useCallback(async () => {
    setEnding(true);
    try {
      const snap = store.getState().snapshot;
      const seen = new Set<string>();
      const toFlush: { item: ExerciseItem; attempts: number }[] = [];
      for (const it of snap.queue) {
        if (seen.has(it.id)) continue;
        seen.add(it.id);
        const attempts = snap.attemptsByItem[it.id] ?? 0;
        if (attempts > 0 && !snap.resolved.includes(it.id)) {
          toFlush.push({ item: it, attempts });
        }
      }
      if (toFlush.length > 0 && onFlush) {
        await onFlush(toFlush);
      }
    } finally {
      store.getState().end();
      setEnding(false);
      setEndConfirming(false);
    }
  }, [onFlush, store]);

  const handleEndClick = useCallback(() => {
    if (snapshot.resolved.length === 0) {
      // Nothing completed yet — nothing to confirm or flush.
      void finishEnding();
    } else {
      setEndConfirming(true);
    }
  }, [finishEnding, snapshot.resolved.length]);

  const item = snapshot.queue[snapshot.cursor];
  const Engine = item ? getEngineComponent(item) : null;

  // Reset the on-demand translation reveal whenever the current item changes.
  useEffect(() => {
    setRevealedTranslationFor(null);
  }, [item?.id]);

  const translationAlwaysOn = item?.translationVisibility === "always";
  const translationRevealed =
    translationAlwaysOn || revealedTranslationFor === item?.id;

  // Guards against a held/auto-repeating Enter key double-advancing: once
  // the phase changes (e.g. submit -> feedback, or feedback -> next prompt),
  // a brief window ignores further Enter presses so a key still held down
  // from the previous action can't immediately fire the next one too.
  const phaseChangedAtRef = useRef(Date.now());
  const prevPhaseRef = useRef(snapshot.phase);
  useEffect(() => {
    if (prevPhaseRef.current !== snapshot.phase) {
      prevPhaseRef.current = snapshot.phase;
      phaseChangedAtRef.current = Date.now();
    }
  }, [snapshot.phase]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.key === "Enter") {
        if (e.repeat) return;
        if (Date.now() - phaseChangedAtRef.current < 250) return;
      }
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
            <Link
              href={exitHref}
              className={cn(buttonVariants({ variant: "outline" }))}
            >
              Back
            </Link>
          </div>
        </div>
      );
    }
  }

  if (snapshot.phase === "done") {
    const answered = snapshot.resolved.length;
    return (
      <div className="space-y-4 rounded-2xl border border-border bg-card p-8 text-center shadow-card">
        <p className="text-2xl font-bold">
          {snapshot.endedEarly ? "Session ended" : "Session complete 🎉"}
        </p>
        <p className="text-sm text-muted-foreground">
          {snapshot.endedEarly
            ? "No problem — everything you finished has been saved."
            : "Great work — spaced review will surface trouble spots."}
        </p>
        <div className="mx-auto grid max-w-xs grid-cols-3 gap-3 pt-2">
          <div className="rounded-xl bg-muted/60 px-2 py-3">
            <p className="text-xl font-bold">{answered}</p>
            <p className="text-xs text-muted-foreground">Answered</p>
          </div>
          <div className="rounded-xl bg-muted/60 px-2 py-3">
            <p className="text-xl font-bold">
              {answered > 0
                ? Math.round((snapshot.correctCount / answered) * 100)
                : 0}
              %
            </p>
            <p className="text-xs text-muted-foreground">Correct</p>
          </div>
          <div className="rounded-xl bg-muted/60 px-2 py-3">
            <p className="text-xl font-bold">{totalXp}</p>
            <p className="text-xs text-muted-foreground">XP earned</p>
          </div>
        </div>
        <Link
          href={exitHref}
          className={cn(
            buttonVariants({ variant: "primary", size: "lg" }),
            "mt-4 inline-flex",
          )}
        >
          Done
        </Link>
      </div>
    );
  }

  const showEngine = snapshot.phase === "prompt";
  const showFeedback = snapshot.phase === "feedback" && !!snapshot.lastResult;

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <ProgressBar
          resolved={snapshot.resolved.length}
          target={snapshot.targetCount}
          className="flex-1"
        />
        {!endConfirming ? (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="shrink-0 text-muted-foreground"
            onClick={handleEndClick}
            disabled={ending}
          >
            End session
          </Button>
        ) : null}
      </div>
      {endConfirming ? (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border bg-muted/50 px-3 py-2.5 text-sm">
          <span>
            End session now? Everything you&apos;ve finished is already saved.
          </span>
          <div className="flex shrink-0 gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setEndConfirming(false)}
              disabled={ending}
            >
              Keep going
            </Button>
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={() => void finishEnding()}
              disabled={ending}
            >
              End session
            </Button>
          </div>
        </div>
      ) : null}
      {/* work card */}
      <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-card">
        {showEngine && item && Engine
          ? createElement(Engine, {
              item,
              disabled: false,
              onSubmit: (a) => {
                void submit(a);
              },
              translationSlot: item.translation ? (
                translationRevealed ? (
                  <p className="rounded-lg bg-muted/60 px-3 py-2 text-sm italic text-muted-foreground">
                    {item.translation}
                  </p>
                ) : (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="gap-1.5 px-2 text-muted-foreground"
                    onClick={() => setRevealedTranslationFor(item.id)}
                  >
                    <Languages className="h-3.5 w-3.5" />
                    Show translation
                  </Button>
                )
              ) : undefined,
            })
          : null}
      </div>
      {/* spacer for fixed feedback sheet */}
      {showFeedback ? <div className="h-52" aria-hidden /> : null}
      {showFeedback && snapshot.lastResult ? (
        <FeedbackPanel
          result={snapshot.lastResult}
          correctMessage={item?.feedback?.correct}
          correctAnswerText={snapshot.lastCorrectAnswer}
          translation={item?.translation}
          xpAwarded={lastXp}
          onContinue={cont}
        />
      ) : null}
    </div>
  );
}
