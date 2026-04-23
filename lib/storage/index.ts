import type { ProgressRepo } from "./repo";

/**
 * Local-first persistence. Swap implementation here when adding sync (e.g. Supabase).
 */
export async function getProgressRepo(): Promise<ProgressRepo> {
  if (typeof window === "undefined") {
    throw new Error("getProgressRepo is client-only");
  }
  const { LocalProgressRepo } = await import("./local");
  return new LocalProgressRepo();
}
