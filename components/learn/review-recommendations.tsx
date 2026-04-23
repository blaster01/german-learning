"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { TagMastery } from "@/lib/storage/repo";
import { buildTroublemakers } from "@/lib/srs/scheduler";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export function ReviewRecommendations() {
  const [trouble, setTrouble] = useState<TagMastery[]>([]);
  const [dueCount, setDueCount] = useState(0);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { getProgressRepo } = await import("@/lib/storage/index");
        const repo = await getProgressRepo();
        const stats = await repo.getTagStats();
        const due = await repo.getDueItems(50);
        if (!cancelled) {
          setTrouble(buildTroublemakers(stats, 5));
          setDueCount(due.length);
        }
      } catch {
        // ignore
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <Card className="p-5">
      <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-muted-foreground">Review</h3>
      {dueCount > 0 ? (
        <Link
          href="/review/run"
          className={cn(buttonVariants({ variant: "primary", size: "sm" }), "mb-3 w-full justify-center")}
        >
          {dueCount} due item{dueCount !== 1 ? "s" : ""}
        </Link>
      ) : (
        <p className="mb-3 text-sm text-muted-foreground">No reviews due right now.</p>
      )}
      {trouble.length > 0 ? (
        <div>
          <p className="mb-2 text-xs font-semibold text-muted-foreground">Troublemakers</p>
          <div className="flex flex-wrap gap-1.5">
            {trouble.map((t) => (
              <Badge key={t.tag} variant="destructive" className="font-mono text-[10px]">
                {t.tag}
              </Badge>
            ))}
          </div>
        </div>
      ) : null}
    </Card>
  );
}
