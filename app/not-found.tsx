import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-3 px-4 py-24 text-center">
      <p className="text-5xl font-bold tracking-tight text-primary">404</p>
      <h1 className="text-xl font-bold">Page not found</h1>
      <p className="text-muted-foreground">
        That page doesn&apos;t exist, or it might have moved.
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
