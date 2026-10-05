/**
 * Skeleton shown while an admin page streams in.
 *
 * Placed at the `(protected)` group root, so it wraps every admin route below
 * it (dashboard, lists, forms, and the nested `[id]` pages) in a Suspense
 * boundary.
 *
 * Why this matters for navigation: the group layout awaits `cookies()` via
 * `requireAdmin()`, so these routes are dynamic. Without a `loading.tsx`,
 * a client-side click cannot commit the new route until its data is ready —
 * `usePathname()` (and therefore the sidebar's active highlight) only updates
 * once the whole page has loaded, which reads as "the click did nothing".
 * With this boundary the route commits immediately, the sidebar updates right
 * away, and the content area streams in behind this skeleton.
 */
export default function AdminLoading() {
  return (
    <div className="flex flex-col gap-6" aria-busy="true" aria-live="polite">
      <span className="sr-only">Memuat…</span>

      {/* Page heading */}
      <div className="flex flex-col gap-3">
        <div className="h-9 w-56 animate-pulse rounded-2xl bg-ink/10 dark:bg-white/10" />
        <div className="h-4 w-80 max-w-full animate-pulse rounded-full bg-ink/5 dark:bg-white/5" />
      </div>

      {/* List rows — matches the shape of most admin screens (lists/tables) */}
      <div className="flex flex-col gap-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="glass-panel flex items-center gap-4 rounded-3xl px-5 py-4"
          >
            <div className="h-10 w-10 shrink-0 animate-pulse rounded-2xl bg-ink/10 dark:bg-white/10" />
            <div className="flex min-w-0 flex-1 flex-col gap-2">
              <div className="h-4 w-2/5 animate-pulse rounded-full bg-ink/10 dark:bg-white/10" />
              <div className="h-3 w-3/5 animate-pulse rounded-full bg-ink/5 dark:bg-white/5" />
            </div>
            <div className="h-8 w-20 shrink-0 animate-pulse rounded-full bg-ink/5 dark:bg-white/5" />
          </div>
        ))}
      </div>
    </div>
  );
}
