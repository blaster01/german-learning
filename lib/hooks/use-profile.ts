"use client";

import { useEffect, useState } from "react";
import { DEFAULT_PROFILE, type Profile } from "@/lib/storage/repo";

const DEFAULT: Profile = DEFAULT_PROFILE;

export function useProfile(): {
  profile: Profile;
  loading: boolean;
  refetch: () => void;
} {
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

  // Re-fetch whenever a session dispatches "profile-updated"
  useEffect(() => {
    const handler = () => setTick((t) => t + 1);
    window.addEventListener("profile-updated", handler);
    return () => window.removeEventListener("profile-updated", handler);
  }, []);

  return {
    profile,
    loading,
    refetch: () => setTick((t) => t + 1),
  };
}
