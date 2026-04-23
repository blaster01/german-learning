/** Returns "YYYY-MM-DD" for today in local time */
export function todayKey(): string {
  const d = new Date();
  return fmtDate(d);
}

/** Returns "YYYY-MM-DD" for the day before the given key */
export function yesterdayKey(today: string): string {
  const d = new Date(today + "T12:00:00");
  d.setDate(d.getDate() - 1);
  return fmtDate(d);
}

/** Returns number of whole calendar days between two "YYYY-MM-DD" keys (|a - b|) */
export function daysBetween(a: string, b: string): number {
  const da = new Date(a + "T12:00:00");
  const db = new Date(b + "T12:00:00");
  return Math.round(Math.abs(da.getTime() - db.getTime()) / 86_400_000);
}

function fmtDate(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
