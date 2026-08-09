/**
 * Shared storage constants with no Dexie/browser dependency, so they can be
 * statically imported from server components / server actions / client
 * components without pulling IndexedDB code into the SSR bundle.
 */

/** Daily cap on brand-new (never-before-seen) items introduced across all "new" sessions. */
export const DAILY_NEW_CARD_LIMIT = 40;
