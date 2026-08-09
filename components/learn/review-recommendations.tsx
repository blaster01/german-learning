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
        // Metadata-only import — never pulls the ~29MB item registry into
        // the client bundle just to count due items per module.
        const { CONTENT_MODULE_META, moduleSlugAndTierForItemId } =
          await import("@/lib/content/manifest");

        const repo = await getProgressRepo();
        const seenCards = await repo.getSeenCards();
        const now = Date.now();

        const dueBySlug = new Map<string, number>();
        for (const c of seenCards) {
          if (c.due.getTime() > now) continue;
          const parsed = moduleSlugAndTierForItemId(c.itemId);
          if (!parsed) continue;
          dueBySlug.set(parsed.slug, (dueBySlug.get(parsed.slug) ?? 0) + 1);
        }

        const results: ModuleDueInfo[] = CONTENT_MODULE_META.filter((m) =>
          dueBySlug.has(m.slug),
        )
          .map((m) => ({
            slug: m.slug,
            title: m.title,
            dueCount: dueBySlug.get(m.slug)!,
          }))
          .sort((a, b) => b.dueCount - a.dueCount)
          .slice(0, 3);

        if (!cancelled) setModules(results);
      } catch {
        // ignore
      }
    })();
    return () => {
      cancelled = true;
    };
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
              className={cn(
                buttonVariants({ variant: "outline", size: "sm" }),
                "shrink-0 text-xs",
              )}
            >
              {m.dueCount} due
            </Link>
          </div>
        ))}
      </div>
    </Card>
  );
}
