"use client";

import { useEffect, useState } from "react";
import type { Profile } from "@/lib/storage/repo";

const DEFAULT: Profile = {
  xp: 0,
  streak: 0,
  longestStreak: 0,
  lastReviewDate: null,
  todayDate: null,
  todayXp: 0,
  dailyGoal: 50,
};

export function useProfile(): { profile: Profile; loading: boolean; refetch: () => void } {
  const [profile, setProfile] = useState<Profile>(DEFAULT);
  const [loading, setLoading] = useState(true);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { getProgressRepo } = await import("@/lib/storage/index");
        const repo = await getProgressRepo();
        const p = await repo.getProfile();
        if (!cancelled) setProfile(p);
      } catch {
        // silently fallback to defaults
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [tick]);

  return {
    profile,
    loading,
    refetch: () => setTick((t) => t + 1),
  };
}
