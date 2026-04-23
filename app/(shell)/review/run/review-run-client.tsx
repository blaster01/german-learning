"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { allExerciseItems } from "@/content/registry";
import type { ExerciseItem } from "@/lib/content/schema";
import { SessionRunner } from "@/components/session/SessionRunner";
import { buildTodaysReview } from "@/lib/srs/scheduler";
import { ensureCardsForItems } from "@/lib/storage/local";
import { getProgressRepo } from "@/lib/storage/index";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function ReviewRunClient() {
  const [items, setItems] = useState<ExerciseItem[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const repo = await getProgressRepo();
        await ensureCardsForItems(allExerciseItems.map((i) => i.id));
        const list = await buildTodaysReview(repo, 24);
        if (!cancelled) setItems(list);
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Error");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (error) {
    return <p className="text-sm text-red-600 dark:text-red-400">{error}</p>;
  }
  if (items === null) {
    return <p className="text-muted-foreground">Loading review queue…</p>;
  }
  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
        <p>No items due right now.</p>
        <Link href="/review" className={cn(buttonVariants({ variant: "outline" }), "mt-4 inline-flex")}>
          Back to review
        </Link>
      </div>
    );
  }

  return (
    <SessionRunner
      sessionKey="review-run"
      items={items}
      exitHref="/review"
      onResult={async ({ item, ok }) => {
        const repo = await getProgressRepo();
        const summary = await repo.recordReview(item, ok);
        return { xpAwarded: summary.xpAwarded };
      }}
    />
  );
}
