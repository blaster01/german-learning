"use client";

import { Volume2 } from "lucide-react";
import { toSpeakableGerman, useSpeech } from "@/lib/hooks/use-speech";
import { cn } from "@/lib/utils";

/**
 * Small icon button that reads German text aloud via the Web Speech API.
 * Renders nothing if speech synthesis isn't supported or there's no text,
 * so it's safe to drop next to any German stimulus/answer unconditionally.
 */
export function SpeakButton({
  text,
  label,
  className,
  size = "md",
}: {
  text: string | undefined;
  label?: string;
  className?: string;
  size?: "sm" | "md";
}) {
  const { speak, speaking, supported } = useSpeech();

  if (!supported || !text?.trim()) return null;

  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        speak(text);
      }}
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full border border-border/60 bg-muted text-muted-foreground transition hover:border-primary/40 hover:bg-primary/10 hover:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring",
        size === "sm" ? "h-7 w-7" : "h-9 w-9",
        speaking && "border-primary/50 bg-primary/10 text-primary",
        className,
      )}
      aria-label={label ?? `Listen: ${toSpeakableGerman(text)}`}
    >
      <Volume2
        className={cn(
          speaking && "animate-pulse",
          size === "sm" ? "h-3.5 w-3.5" : "h-4 w-4",
        )}
      />
    </button>
  );
}
