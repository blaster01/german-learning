import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function PageShell({
  children,
  rightRail,
  stickyCta,
  className,
}: {
  children: ReactNode;
  rightRail?: ReactNode;
  stickyCta?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("relative mx-auto max-w-6xl px-4 py-8", className)}>
      <div
        className={cn(
          "gap-8",
          rightRail ? "grid lg:grid-cols-[1fr_320px]" : "block",
        )}
      >
        <main id="main-content" className="min-w-0">
          {children}
        </main>
        {rightRail ? (
          <aside className="mt-8 shrink-0 space-y-4 lg:mt-0">{rightRail}</aside>
        ) : null}
      </div>
      {stickyCta ? (
        <div className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-card/90 px-4 pb-safe-bottom pt-3 backdrop-blur lg:hidden">
          {stickyCta}
        </div>
      ) : null}
    </div>
  );
}
