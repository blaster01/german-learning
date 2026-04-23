"use client";

import { useCallback, useMemo } from "react";
import Link from "next/link";
import type { ExerciseItem } from "@/lib/content/schema";
import { SessionRunner } from "@/components/session/SessionRunner";
import { getProgressRepo } from "@/lib/storage/index";
import type { TierIndex } from "@/lib/content/loader";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function SessionPageClient({
  slug,
  tier,
  items,
  systemId,
  moduleTitle,
}: {
  slug: string;
  tier: TierIndex;
  items: ExerciseItem[];
  systemId: string;
  moduleTitle: string;
}) {
  const sessionKey = `${slug}-${tier}`;
  const backHref = `/systems/${systemId}/${slug}`;

  const onResult = useCallback(async (payload: { item: ExerciseItem; ok: boolean; errorTags: string[] }) => {
    try {
      const repo = await getProgressRepo();
      const summary = await repo.recordReview(payload.item, payload.ok, payload.errorTags);
      return { xpAwarded: summary.xpAwarded };
    } catch (e) {
      console.error(e);
      return undefined;
    }
  }, []);

  const sortedItems = useMemo(() => [...items], [items]);

  if (sortedItems.length === 0) {
    return (
      <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
        <p>No items for this tier yet.</p>
        <Link href={backHref} className={cn(buttonVariants({ variant: "outline" }), "mt-4 inline-flex")}>
          Back to module
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-muted-foreground">
          <Link href={backHref} className="hover:underline">
            {moduleTitle}
          </Link>
          <span className="mx-2">/</span>
          <span>Tier {tier}</span>
        </p>
        <h1 className="mt-2 text-2xl font-bold tracking-tight">Practice</h1>
      </div>
      <SessionRunner sessionKey={sessionKey} items={sortedItems} onResult={onResult} exitHref={backHref} />
    </div>
  );
}
