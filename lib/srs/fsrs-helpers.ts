import { createEmptyCard, fsrs, Rating, type Card } from "ts-fsrs";

const f = fsrs();

export function newCard(now = new Date()): Card {
  return createEmptyCard(now);
}

export function gradeCard(card: Card, now: Date, correct: boolean): Card {
  const grade = correct ? Rating.Good : Rating.Again;
  const out = f.next(card, now, grade);
  return out.card;
}

export { Rating, type Card };
