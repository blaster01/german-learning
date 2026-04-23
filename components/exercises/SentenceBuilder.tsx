"use client";

import { useCallback, useMemo, useState } from "react";
import type { BuilderItem } from "@/lib/content/schema";
import type { EngineProps } from "@/lib/engines/types";
import { Button } from "@/components/ui/button";
import { TokenChip } from "@/components/ui/chip";
import { cn } from "@/lib/utils";

type Tok = { uid: string; text: string };

function shuffleToks(toks: Tok[], seed: string): Tok[] {
  const a = [...toks];
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  for (let i = a.length - 1; i > 0; i--) {
    h = (h * 1664525 + 1013904223) >>> 0;
    const j = h % (i + 1);
    [a[i], a[j]] = [a[j]!, a[i]!];
  }
  return a;
}

export function SentenceBuilder({ item, disabled, onSubmit }: EngineProps<BuilderItem>) {
  const initialPool = useMemo<Tok[]>(
    () => shuffleToks(item.tokens.map((text, i) => ({ uid: `${item.id}-t${i}`, text })), item.id),
    [item.id, item.tokens],
  );

  const [poolLeft, setPoolLeft] = useState<Tok[]>(() => initialPool);
  const [built, setBuilt] = useState<Tok[]>([]);

  const reset = useCallback(() => {
    setBuilt([]);
    setPoolLeft(shuffleToks(item.tokens.map((text, i) => ({ uid: `${item.id}-t${i}`, text })), `${item.id}-r`));
  }, [item.id, item.tokens]);

  const addToken = (tok: Tok) => {
    if (disabled) return;
    setBuilt((b) => [...b, tok]);
    setPoolLeft((p) => p.filter((t) => t.uid !== tok.uid));
  };

  const removeLast = () => {
    if (disabled) return;
    setBuilt((b) => {
      if (b.length === 0) return b;
      const last = b[b.length - 1]!;
      const nb = b.slice(0, -1);
      setPoolLeft((p) => [...p, last]);
      return nb;
    });
  };

  const builtStrings = built.map((t) => t.text);

  return (
    <div className="space-y-5">
      <p className="text-xl font-semibold leading-snug">{item.prompt}</p>
      {item.stimulus ? <p className="text-sm text-muted-foreground">{item.stimulus}</p> : null}

      {/* built sentence area */}
      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Your sentence</p>
        <div
          className={cn(
            "min-h-14 rounded-2xl border-2 border-dashed bg-muted/30 px-4 py-3 transition",
            built.length === 0 ? "border-border/60" : "border-primary/30",
          )}
        >
          {built.length === 0 ? (
            <span className="text-sm text-muted-foreground">Tap tokens below to build…</span>
          ) : (
            <div className="flex flex-wrap gap-2">
              {built.map((tok) => (
                <TokenChip key={tok.uid} selected disabled={disabled} onClick={() => {}} aria-label={tok.text}>
                  {tok.text}
                </TokenChip>
              ))}
            </div>
          )}
        </div>
        <div className="mt-2 flex gap-2">
          <Button type="button" variant="ghost" size="sm" disabled={disabled || built.length === 0} onClick={removeLast}>
            Undo last
          </Button>
          <Button type="button" variant="ghost" size="sm" disabled={disabled} onClick={reset}>
            Reset
          </Button>
        </div>
      </div>

      {/* token pool */}
      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Tokens</p>
        <div className="flex flex-wrap gap-2">
          {poolLeft.map((tok) => (
            <TokenChip key={tok.uid} disabled={disabled} onClick={() => addToken(tok)}>
              {tok.text}
            </TokenChip>
          ))}
        </div>
      </div>

      <Button type="button" size="lg" disabled={disabled} className="w-full justify-center" onClick={() => onSubmit(builtStrings)}>
        Check
      </Button>
    </div>
  );
}
