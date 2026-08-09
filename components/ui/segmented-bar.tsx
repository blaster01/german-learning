import { cn } from "@/lib/utils";

export function SegmentedBar({
  segments,
  className,
}: {
  segments: { label: string; value: number; max: number }[];
  className?: string;
}) {
  return (
    <div
      className={cn("flex items-center gap-0.5", className)}
      role="img"
      aria-label="tier progress"
    >
      {segments.map((s, i) => {
        const pct =
          s.max === 0 ? 0 : Math.min(100, Math.round((s.value / s.max) * 100));
        return (
          <div
            key={i}
            className="relative h-2 flex-1 overflow-hidden rounded-full bg-muted"
          >
            <div
              className="absolute inset-y-0 left-0 bg-primary transition-all duration-300"
              style={{ width: `${pct}%` }}
              aria-label={`${s.label}: ${pct}%`}
            />
          </div>
        );
      })}
    </div>
  );
}
