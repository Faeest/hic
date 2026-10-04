/**
 * Shared helpers for the content layer.
 *
 * Every reader follows the same contract: try Supabase, and on error or empty
 * result fall back to the seed defaults from `data/*.ts`. This means the public
 * site renders correctly even before the DB is seeded, and during the Phase 3
 * migration.
 */

export type ReadResult<T> = {
  data: T;
  /** true when the value came from the local seed fallback, not the DB. */
  fallback: boolean;
};

/** Log once per key so a missing table doesn't spam the server console. */
const warned = new Set<string>();

export function warnFallback(key: string, error: unknown) {
  if (warned.has(key)) return;
  warned.add(key);
  const message = error instanceof Error ? error.message : String(error);
  console.warn(`[content] "${key}" fell back to seed defaults: ${message}`);
}

/** Sort helper: ascending by `sort`, stable. */
export function bySort<T extends { sort: number }>(rows: T[]): T[] {
  return [...rows].sort((a, b) => a.sort - b.sort);
}
