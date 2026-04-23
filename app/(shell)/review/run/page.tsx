import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { ReviewRunClient } from "./review-run-client";

export default function ReviewRunPage() {
  return (
    <main>
      <p className="mb-2 flex items-center gap-1 text-sm text-muted-foreground">
        <Link href="/review" className="hover:underline">Review</Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span>Run</span>
      </p>
      <h1 className="mb-6 text-2xl font-bold tracking-tight">Due items</h1>
      <ReviewRunClient />
    </main>
  );
}
