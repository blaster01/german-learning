import { ReviewClient } from "./review-client";

export default function ReviewPage() {
  return (
    <main>
      <h1 className="text-2xl font-bold tracking-tight">Review</h1>
      <p className="mt-1 text-muted-foreground">FSRS-driven queue from your past sessions (local only).</p>
      <ReviewClient />
    </main>
  );
}
