"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function ShellError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center gap-3 py-20 text-center">
      <p className="text-5xl">😕</p>
      <h1 className="text-xl font-bold">Something went wrong</h1>
      <p className="max-w-sm text-muted-foreground">
        This page hit an unexpected error. Your local progress is safe.
      </p>
      <div className="mt-2 flex gap-2">
        <Button onClick={() => reset()}>Try again</Button>
        <Link href="/" className={cn(buttonVariants({ variant: "outline" }))}>
          Back to Learn
        </Link>
      </div>
    </div>
  );
}
