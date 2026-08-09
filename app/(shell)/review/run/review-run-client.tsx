"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * The "Continue" CTA on the home/profile cards routes here. It has no
 * content of its own — it picks the most useful next session (most items
 * due for review, falling back to "New" in the first module with unseen
 * items, respecting the daily new-card budget) and redirects there.
 */
export function ReviewRunClient() {
  const router = useRouter();
  const [status, setStatus] = useState<"loading" | "none">("loading");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { getProgressRepo } = await import("@/lib/storage/index");
        const { CONTENT_MODULE_META, moduleSlugAndTierForItemId } =
          await import("@/lib/content/manifest");
        const { DAILY_NEW_CARD_LIMIT } =
          await import("@/lib/storage/constants");

        const repo = await getProgressRepo();
        const [seenCards, newCardsToday] = await Promise.all([
          repo.getSeenCards(),
          repo.getNewCardsToday(),
        ]);
        const now = Date.now();

        const dueBySlug = new Map<string, number>();
        const seenBySlug = new Map<string, number>();
        for (const c of seenCards) {
          const parsed = moduleSlugAndTierForItemId(c.itemId);
          if (!parsed) continue;
          seenBySlug.set(parsed.slug, (seenBySlug.get(parsed.slug) ?? 0) + 1);
          if (c.due.getTime() <= now) {
            dueBySlug.set(parsed.slug, (dueBySlug.get(parsed.slug) ?? 0) + 1);
          }
        }

        // 1. Prefer whichever module has the most items due right now.
        let best: { slug: string; count: number } | null = null;
        for (const [slug, count] of dueBySlug) {
          if (!best || count > best.count) best = { slug, count };
        }
        if (best) {
          if (!cancelled) router.replace(`/session/${best.slug}/review`);
          return;
        }

        // 2. Nothing due — continue learning new material, if today's cap allows.
        if (newCardsToday < DAILY_NEW_CARD_LIMIT) {
          const next = CONTENT_MODULE_META.find(
            (m) => (seenBySlug.get(m.slug) ?? 0) < m.totalCount,
          );
          if (next) {
            if (!cancelled) router.replace(`/session/${next.slug}/new`);
            return;
          }
        }

        if (!cancelled) setStatus("none");
      } catch {
        if (!cancelled) setStatus("none");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [router]);

  if (status === "loading") {
    return (
      <p className="text-center text-muted-foreground">
        Finding your next session…
      </p>
    );
  }

  return (
    <Card className="p-6 text-center">
      <p className="font-semibold">You&apos;re all caught up!</p>
      <p className="mt-1 text-sm text-muted-foreground">
        Nothing is due for review right now, and you&apos;ve reached
        today&apos;s new-item goal.
      </p>
      <Link
        href="/"
        className={cn(
          buttonVariants({ variant: "outline" }),
          "mt-4 inline-flex",
        )}
      >
        Back to Learn
      </Link>
    </Card>
  );
}
