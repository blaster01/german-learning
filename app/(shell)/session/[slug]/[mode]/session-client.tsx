"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import type { ExerciseItem } from "@/lib/content/schema";
import type { SessionMode } from "@/lib/session/module-playlist";
import { buildPlaylistAction } from "./playlist-action";
import { SessionRunner } from "@/components/session/SessionRunner";
import { getProgressRepo } from "@/lib/storage/index";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function SessionModeClient({
  slug,
  mode,
  moduleTitle,
}: {
  slug: string;
  mode: SessionMode;
  moduleTitle: string;
}) {
  const [items, setItems] = useState<ExerciseItem[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        // 1. Read IndexedDB for seen cards (client-only, tiny payload)
        const repo = await getProgressRepo();
        const seenCards = await repo.getSeenCards();
        const seenEntries = seenCards.map((c) => ({
          itemId: c.itemId,
          due: c.due instanceof Date ? c.due.getTime() : Number(c.due),
          lastReview:
            c.lastReview instanceof Date
              ? c.lastReview.getTime()
              : c.lastReview != null
                ? Number(c.lastReview)
                : null,
        }));

        // 2. Call server action — registry stays on the server
        const playlist = await buildPlaylistAction({
          slug,
          mode,
          seenEntries,
        });
        if (!cancelled) {
          setItems(playlist);
        }
      } catch (e) {
        if (!cancelled)
          setError(e instanceof Error ? e.message : "Failed to build session.");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [slug, mode]);

  const sessionKey = useMemo(
    () => `${slug}-${mode}-${Date.now()}`,
    [slug, mode],
  );

  const onResult = useCallback(
    async (payload: {
      item: ExerciseItem;
      ok: boolean;
      errorTags: string[];
      attempts: number;
    }) => {
      try {
        const repo = await getProgressRepo();
        const summary = await repo.recordReview(
          payload.item,
          payload.ok,
          payload.attempts,
          payload.errorTags,
        );
        // Notify header hook to refresh XP + streak
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("profile-updated"));
        }
        return { xpAwarded: summary.xpAwarded };
      } catch (e) {
        console.error(e);
        return undefined;
      }
    },
    [],
  );

  const onFlush = useCallback(
    async (entries: { item: ExerciseItem; attempts: number }[]) => {
      try {
        const repo = await getProgressRepo();
        await Promise.all(
          entries.map(({ item, attempts }) =>
            repo.recordReview(item, false, attempts, ["session:abandoned"]),
          ),
        );
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("profile-updated"));
        }
      } catch (e) {
        console.error(e);
      }
    },
    [],
  );

  const modeLabel =
    mode === "new" ? "New" : mode === "mixed" ? "Mixed" : "Review";

  if (error) {
    return (
      <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
        <p className="text-sm text-destructive">{error}</p>
        <Link
          href="/"
          className={cn(
            buttonVariants({ variant: "outline" }),
            "mt-4 inline-flex",
          )}
        >
          Back
        </Link>
      </div>
    );
  }

  if (items === null) {
    return (
      <div className="space-y-6">
        <p className="text-muted-foreground">Preparing session…</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
        <p className="font-medium">
          {mode === "review"
            ? "Nothing is due for review in this module right now. Check back later, or try New."
            : mode === "mixed"
              ? "Not enough items available for a mixed session."
              : "All items in this module have been seen."}
        </p>
        <Link
          href="/"
          className={cn(
            buttonVariants({ variant: "outline" }),
            "mt-4 inline-flex",
          )}
        >
          Back
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-muted-foreground">
          <Link href="/" className="hover:underline">
            Learn
          </Link>
          <span className="mx-2">/</span>
          <span>{moduleTitle}</span>
          <span className="mx-2">/</span>
          <span>{modeLabel}</span>
        </p>
        <h1 className="mt-2 text-2xl font-bold tracking-tight">{modeLabel}</h1>
      </div>
      <SessionRunner
        sessionKey={sessionKey}
        items={items}
        onResult={onResult}
        onFlush={onFlush}
        exitHref="/"
      />
    </div>
  );
}
