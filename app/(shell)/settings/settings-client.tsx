"use client";

import { useEffect, useRef, useState } from "react";
import { Download, Upload, Moon, Sun, Monitor } from "lucide-react";
import { useTheme } from "next-themes";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DEFAULT_PROFILE, type Profile } from "@/lib/storage/repo";
import { getProgressRepo } from "@/lib/storage/index";
import { cn } from "@/lib/utils";

const GOAL_PRESETS = [20, 50, 100, 150];

export function SettingsClient() {
  const [profile, setProfile] = useState<Profile>(DEFAULT_PROFILE);
  const [loading, setLoading] = useState(true);
  const [customGoal, setCustomGoal] = useState("");
  const [message, setMessage] = useState<{
    kind: "success" | "error";
    text: string;
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const repo = await getProgressRepo();
        const p = await repo.getProfile();
        if (!cancelled) setProfile(p);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  async function setGoal(xp: number) {
    if (!Number.isFinite(xp) || xp <= 0) return;
    const repo = await getProgressRepo();
    await repo.setDailyGoal(xp);
    setProfile((p) => ({ ...p, dailyGoal: xp }));
    setMessage({ kind: "success", text: `Daily goal set to ${xp} XP.` });
    if (typeof window !== "undefined")
      window.dispatchEvent(new CustomEvent("profile-updated"));
  }

  async function handleExport() {
    try {
      const repo = await getProgressRepo();
      const data = await repo.exportData();
      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      const stamp = new Date().toISOString().slice(0, 10);
      a.href = url;
      a.download = `german-learning-backup-${stamp}.json`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      setMessage({ kind: "success", text: "Backup downloaded." });
    } catch {
      setMessage({ kind: "error", text: "Could not export your data." });
    }
  }

  async function handleImportFile(file: File) {
    try {
      const text = await file.text();
      const data = JSON.parse(text);
      const repo = await getProgressRepo();
      await repo.importData(data);
      const p = await repo.getProfile();
      setProfile(p);
      setMessage({
        kind: "success",
        text: "Backup restored. Your progress has been replaced.",
      });
      if (typeof window !== "undefined")
        window.dispatchEvent(new CustomEvent("profile-updated"));
    } catch {
      setMessage({
        kind: "error",
        text: "That file doesn't look like a valid backup.",
      });
    }
  }

  return (
    <div className="space-y-6">
      {message ? (
        <div
          role="status"
          className={cn(
            "rounded-xl border px-4 py-3 text-sm",
            message.kind === "success"
              ? "border-success/40 bg-success/10 text-success"
              : "border-destructive/40 bg-destructive/10 text-destructive",
          )}
        >
          {message.text}
        </div>
      ) : null}

      <Card className="p-5">
        <h2 className="mb-1 text-sm font-bold uppercase tracking-wide text-muted-foreground">
          Daily goal
        </h2>
        <p className="mb-4 text-sm text-muted-foreground">
          Current goal:{" "}
          <span className="font-semibold text-foreground">
            {loading ? "…" : `${profile.dailyGoal} XP`}
          </span>{" "}
          per day.
        </p>
        <div className="flex flex-wrap gap-2">
          {GOAL_PRESETS.map((g) => (
            <Button
              key={g}
              type="button"
              variant={profile.dailyGoal === g ? "primary" : "outline"}
              size="sm"
              onClick={() => void setGoal(g)}
            >
              {g} XP
            </Button>
          ))}
        </div>
        <div className="mt-3 flex items-center gap-2">
          <input
            type="number"
            min={10}
            step={10}
            inputMode="numeric"
            aria-label="Custom daily goal (XP)"
            placeholder="Custom"
            value={customGoal}
            onChange={(e) => setCustomGoal(e.target.value)}
            className="h-9 w-28 rounded-lg border border-border bg-background px-3 text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring"
          />
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => void setGoal(parseInt(customGoal, 10))}
          >
            Set
          </Button>
        </div>
      </Card>

      <Card className="p-5">
        <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-muted-foreground">
          Appearance
        </h2>
        <div className="flex flex-wrap gap-2">
          {(
            [
              { value: "light", label: "Light", icon: Sun },
              { value: "dark", label: "Dark", icon: Moon },
              { value: "system", label: "System", icon: Monitor },
            ] as const
          ).map(({ value, label, icon: Icon }) => (
            <Button
              key={value}
              type="button"
              variant={mounted && theme === value ? "primary" : "outline"}
              size="sm"
              onClick={() => setTheme(value)}
            >
              <Icon className="mr-1.5 h-3.5 w-3.5" />
              {label}
            </Button>
          ))}
        </div>
      </Card>

      <Card className="p-5">
        <h2 className="mb-1 text-sm font-bold uppercase tracking-wide text-muted-foreground">
          Your data
        </h2>
        <p className="mb-4 text-sm text-muted-foreground">
          All progress (XP, streaks, spaced-repetition schedule, review history)
          is stored only in this browser. Export a backup before clearing site
          data or switching browsers/devices.
        </p>
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => void handleExport()}
          >
            <Download className="mr-1.5 h-4 w-4" />
            Export backup
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="mr-1.5 h-4 w-4" />
            Import backup
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept="application/json"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) void handleImportFile(file);
              e.target.value = "";
            }}
          />
        </div>
      </Card>
    </div>
  );
}
