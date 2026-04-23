"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ModuleDueInfo = {
  slug: string;
  title: string;
  dueCount: number;
};

export function ReviewRecommendations() {
  const [modules, setModules] = useState<ModuleDueInfo[]>([]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { getProgressRepo } = await import("@/lib/storage/index");
        const { CONTENT_MODULES } = await import("@/content/registry");

        const repo = await getProgressRepo();
        const seenCards = await repo.getSeenCards();
        const now = Date.now();

        // For each module, count how many seen items are currently due
        const results: ModuleDueInfo[] = [];
        for (const mod of CONTENT_MODULES) {
          const allIds = new Set([
            ...mod.tiers[1].map((i) => i.id),
            ...mod.tiers[2].map((i) => i.id),
            ...mod.tiers[3].map((i) => i.id),
          ]);
          const dueCount = seenCards.filter(
            (c) => allIds.has(c.itemId) && c.due.getTime() <= now
          ).length;
          if (dueCount > 0) {
            results.push({ slug: mod.slug, title: mod.title, dueCount });
          }
        }

        // Sort by most due first, show top 3
        results.sort((a, b) => b.dueCount - a.dueCount);

        if (!cancelled) setModules(results.slice(0, 3));
      } catch {
        // ignore
      }
    })();
    return () => { cancelled = true; };
  }, []);

  if (modules.length === 0) return null;

  return (
    <Card className="p-5">
      <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-muted-foreground">
        Due for review
      </h3>
      <div className="space-y-2">
        {modules.map((m) => (
          <div key={m.slug} className="flex items-center justify-between gap-2">
            <span className="truncate text-sm font-medium">{m.title}</span>
            <Link
              href={`/session/${m.slug}/review`}
              className={cn(buttonVariants({ variant: "outline", size: "sm" }), "shrink-0 text-xs")}
            >
              {m.dueCount} due
            </Link>
          </div>
        ))}
      </div>
    </Card>
  );
}
