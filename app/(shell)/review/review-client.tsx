"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { allExerciseItems } from "@/content/registry";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { buildTodaysReview, buildTroublemakers, buildWordOrderRehab } from "@/lib/srs/scheduler";
import { ensureCardsForItems } from "@/lib/storage/local";
import { getProgressRepo } from "@/lib/storage/index";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function ReviewClient() {
  const [dueCount, setDueCount] = useState<number | null>(null);
  const [trouble, setTrouble] = useState<{ tag: string; correct: number; wrong: number }[]>([]);
  const [rehab, setRehab] = useState<{ tag: string; correct: number; wrong: number }[]>([]);
  const [sessionHref, setSessionHref] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setErr(null);
    try {
      const repo = await getProgressRepo();
      await ensureCardsForItems(allExerciseItems.map((i) => i.id));
      const due = await buildTodaysReview(repo, 24);
      setDueCount(due.length);
      const stats = await repo.getTagStats();
      setTrouble(buildTroublemakers(stats, 8));
      setRehab(buildWordOrderRehab(stats));
      setSessionHref(due.length > 0 ? "/review/run" : null);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Failed to load review data.");
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return (
    <div className="mt-6 space-y-5">
      {err ? <p className="text-sm text-red-600 dark:text-red-400">{err}</p> : null}

      {/* today's review */}
      <Card className="p-5">
        <h2 className="text-sm font-bold uppercase tracking-wide text-muted-foreground">Today&apos;s review</h2>
        <p className="mt-2 text-base font-medium">
          {dueCount === null ? "Checking queue…" : dueCount > 0 ? `${dueCount} item${dueCount !== 1 ? "s" : ""} due` : "You&apos;re all caught up!"}
        </p>
        {sessionHref ? (
          <Link href={sessionHref} className={cn(buttonVariants({ variant: "primary", size: "lg" }), "mt-4 w-full justify-center")}>
            Start due items
          </Link>
        ) : dueCount === 0 ? (
          <p className="mt-2 text-sm text-muted-foreground">Practice a module to build your review queue.</p>
        ) : null}
      </Card>

      {/* troublemakers */}
      <Card className="p-5">
        <h2 className="mb-2 text-sm font-bold uppercase tracking-wide text-muted-foreground">Troublemakers</h2>
        <p className="mb-3 text-sm text-muted-foreground">Tags with enough volume and higher error rates.</p>
        {trouble.length === 0 ? (
          <p className="text-sm text-muted-foreground">No trouble data yet — keep practicing!</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {trouble.map((t) => (
              <div key={t.tag} className="flex items-center gap-1">
                <Badge variant="destructive" className="font-mono text-[10px]">{t.tag}</Badge>
                <span className="text-xs text-muted-foreground">{t.wrong}✗ / {t.correct + t.wrong}</span>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* word order rehab */}
      <Card className="p-5">
        <h2 className="mb-2 text-sm font-bold uppercase tracking-wide text-muted-foreground">Word order rehab</h2>
        <p className="mb-3 text-sm text-muted-foreground">Syntax-tagged patterns with repeated misses.</p>
        {rehab.length === 0 ? (
          <p className="text-sm text-muted-foreground">No syntax trouble data yet.</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {rehab.map((t) => (
              <Badge key={t.tag} variant="accent" className="font-mono text-[10px]">{t.tag}</Badge>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
