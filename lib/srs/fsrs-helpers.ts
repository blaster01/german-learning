import { createEmptyCard, fsrs, Rating, type Card, type Grade } from "ts-fsrs";

const f = fsrs();

export function newCard(now = new Date()): Card {
  return createEmptyCard(now);
}

/**
 * Outcome of a fully-resolved item within a session (after retries, if any):
 *  - "good"  — correct on the first attempt
 *  - "hard"  — correct, but only after one or more wrong attempts
 *  - "again" — never answered correctly within the attempt limit
 */
export type ReviewOutcome = "again" | "hard" | "good";

/** Derive the FSRS outcome from the final result and how many attempts it took. */
export function outcomeForAttempt(
  ok: boolean,
  attempts: number,
): ReviewOutcome {
  if (!ok) return "again";
  return attempts > 1 ? "hard" : "good";
}

const RATING_FOR_OUTCOME: Record<ReviewOutcome, Grade> = {
  again: Rating.Again,
  hard: Rating.Hard,
  good: Rating.Good,
};

/**
 * Grade a card using the final in-session outcome (not just the first
 * attempt), so a miss-then-recover is scheduled as "Hard" rather than
 * permanently as "Again".
 */
export function gradeCard(card: Card, now: Date, outcome: ReviewOutcome): Card {
  const grade = RATING_FOR_OUTCOME[outcome];
  const out = f.next(card, now, grade);
  return out.card;
}

export { Rating, type Card };
