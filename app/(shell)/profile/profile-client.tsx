"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Flame, Star, Zap } from "lucide-react";
import { CONTENT_MODULES, type ContentModule } from "@/content/registry";
import { getProgressRepo } from "@/lib/storage/index";
import type { Profile, TagMastery } from "@/lib/storage/repo";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ProgressRing } from "@/components/ui/progress-ring";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const defaultProfile: Profile = {
  xp: 0,
  streak: 0,
  longestStreak: 0,
  lastReviewDate: null,
  todayDate: null,
  todayXp: 0,
  dailyGoal: 50,
};

export function ProfileClient() {
  const [stats, setStats] = useState<TagMastery[] | null>(null);
  const [profile, setProfile] = useState<Profile>(defaultProfile);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const repo = await getProgressRepo();
        const [s, p] = await Promise.all([repo.getTagStats(), repo.getProfile()]);
        if (!cancelled) {
          setStats(s);
          setProfile(p);
        }
      } catch {
        if (!cancelled) setStats([]);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const goalPct = profile.dailyGoal > 0 ? Math.min(100, Math.round((profile.todayXp / profile.dailyGoal) * 100)) : 0;

  const bySystem = CONTENT_MODULES.reduce<Record<string, ContentModule[]>>((acc, m) => {
    acc[m.systemId] = acc[m.systemId] ?? [];
    acc[m.systemId]!.push(m);
    return acc;
  }, {});

  return (
    <div className="mt-6 space-y-6">
      {/* hero stats card */}
      <Card className="p-6">
        <div className="flex items-center gap-5">
          <ProgressRing value={goalPct} size={72} strokeWidth={6} />
          <div className="space-y-1">
            <p className="text-2xl font-bold">{profile.xp.toLocaleString()} XP</p>
            <p className="text-sm text-muted-foreground">Total earned</p>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-3 divide-x divide-border rounded-xl border border-border/60 bg-muted/40 text-center text-sm">
          <div className="flex flex-col items-center gap-1 px-3 py-3">
            <Flame className="h-5 w-5 text-accent" />
            <span className="text-xl font-bold">{profile.streak}</span>
            <span className="text-xs text-muted-foreground">Streak</span>
          </div>
          <div className="flex flex-col items-center gap-1 px-3 py-3">
            <Star className="h-5 w-5 text-primary" />
            <span className="text-xl font-bold">{profile.todayXp}</span>
            <span className="text-xs text-muted-foreground">Today</span>
          </div>
          <div className="flex flex-col items-center gap-1 px-3 py-3">
            <Zap className="h-5 w-5 text-primary" />
            <span className="text-xl font-bold">{profile.longestStreak}</span>
            <span className="text-xs text-muted-foreground">Best streak</span>
          </div>
        </div>
        <Link href="/review/run" className={cn(buttonVariants({ variant: "primary", size: "lg" }), "mt-5 w-full justify-center")}>
          Continue practice
        </Link>
      </Card>

      {/* modules by system */}
      {Object.entries(bySystem).map(([systemId, mods]) => (
        <Card key={systemId} className="p-5">
          <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-muted-foreground capitalize">{systemId}</h2>
          <ul className="space-y-2">
            {mods.map((m) => {
              const total = m.tiers[1].length + m.tiers[2].length + m.tiers[3].length;
              return (
                <li key={m.id} className="flex items-center justify-between gap-2 text-sm">
                  <Link href={`/systems/${m.systemId}/${m.slug}`} className="font-medium hover:underline">
                    {m.title}
                  </Link>
                  <span className="text-muted-foreground">{total} items</span>
                </li>
              );
            })}
          </ul>
        </Card>
      ))}

      {/* tag performance */}
      <Card className="p-5">
        <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-muted-foreground">Tag performance</h2>
        {stats === null ? (
          <p className="text-sm text-muted-foreground">Loading…</p>
        ) : stats.length === 0 ? (
          <p className="text-sm text-muted-foreground">Complete sessions to populate error-tag stats.</p>
        ) : (
          <ul className="max-h-80 space-y-2 overflow-auto">
            {stats
              .slice()
              .sort((a, b) => b.wrong + b.correct - (a.wrong + a.correct))
              .map((s) => {
                const acc = s.correct + s.wrong > 0 ? Math.round((s.correct / (s.correct + s.wrong)) * 100) : 0;
                return (
                  <li key={s.tag} className="flex items-center justify-between gap-2 text-sm">
                    <code className="font-mono text-xs">{s.tag}</code>
                    <div className="flex items-center gap-2">
                      <Badge variant={acc >= 70 ? "success" : acc >= 40 ? "accent" : "destructive"}>
                        {acc}%
                      </Badge>
                      <span className="text-xs text-muted-foreground">{s.correct}✓ {s.wrong}✗</span>
                    </div>
                  </li>
                );
              })}
          </ul>
        )}
      </Card>
    </div>
  );
}
