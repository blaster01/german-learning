"use client";

import Link from "next/link";
import { Flame, Star, Target, Zap } from "lucide-react";
import { Card } from "@/components/ui/card";
import { ProgressRing } from "@/components/ui/progress-ring";
import { useProfile } from "@/lib/hooks/use-profile";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function ProfileSummaryCard() {
  const { profile, loading } = useProfile();

  const goalPct = profile.dailyGoal > 0 ? Math.min(100, Math.round((profile.todayXp / profile.dailyGoal) * 100)) : 0;

  return (
    <Card className="p-5">
      <h3 className="mb-4 text-sm font-bold uppercase tracking-wide text-muted-foreground">Your progress</h3>
      <div className="flex items-center gap-4">
        <ProgressRing value={loading ? 0 : goalPct} size={64} strokeWidth={5} />
        <div className="space-y-1 text-sm">
          <p className="font-semibold">
            {profile.todayXp} / {profile.dailyGoal} XP
          </p>
          <p className="text-muted-foreground">Daily goal</p>
        </div>
      </div>
      <div className="mt-4 grid grid-cols-3 divide-x divide-border rounded-xl border border-border/60 bg-muted/40 text-center text-xs">
        <div className="flex flex-col items-center gap-1 px-2 py-3">
          <Flame className="h-4 w-4 text-accent" />
          <span className="font-bold">{profile.streak}</span>
          <span className="text-muted-foreground">Streak</span>
        </div>
        <div className="flex flex-col items-center gap-1 px-2 py-3">
          <Star className="h-4 w-4 text-primary" />
          <span className="font-bold">{profile.xp}</span>
          <span className="text-muted-foreground">Total XP</span>
        </div>
        <div className="flex flex-col items-center gap-1 px-2 py-3">
          <Zap className="h-4 w-4 text-primary" />
          <span className="font-bold">{profile.longestStreak}</span>
          <span className="text-muted-foreground">Best</span>
        </div>
      </div>
      <Link
        href="/review/run"
        className={cn(buttonVariants({ variant: "primary", size: "default" }), "mt-4 w-full justify-center")}
      >
        Continue
      </Link>
    </Card>
  );
}
