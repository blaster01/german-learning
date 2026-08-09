import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function ShellNotFound() {
  return (
    <div className="flex flex-col items-center gap-3 py-20 text-center">
      <p className="text-5xl font-bold tracking-tight text-primary">404</p>
      <h1 className="text-xl font-bold">We couldn&apos;t find that</h1>
      <p className="text-muted-foreground">
        This module, session, or page doesn&apos;t exist (or the content behind
        it changed).
      </p>
      <Link
        href="/"
        className={cn(buttonVariants({ variant: "primary" }), "mt-2")}
      >
        Back to Learn
      </Link>
    </div>
  );
}
