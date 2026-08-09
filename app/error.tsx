"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function GlobalError({
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
    <html lang="en">
      <body className="flex min-h-screen flex-col items-center justify-center gap-3 bg-background px-4 text-center text-foreground">
        <p className="text-5xl">😕</p>
        <h1 className="text-xl font-bold">Something went wrong</h1>
        <p className="max-w-sm text-muted-foreground">
          An unexpected error occurred. Your local progress is safe — try again
          or head back home.
        </p>
        <div className="mt-2 flex gap-2">
          <Button onClick={() => reset()}>Try again</Button>
          <Link href="/" className={cn(buttonVariants({ variant: "outline" }))}>
            Back to Learn
          </Link>
        </div>
      </body>
    </html>
  );
}
