/**
 * Shown while an admin page's server component is loading during navigation.
 *
 * Admin routes are dynamic (`instant = false`) and read cookies + unpublished
 * data, so a click can take a moment before the new page commits. Without this
 * boundary Next.js keeps the previous page on screen with no indication that
 * anything is happening — which reads as "the click didn't register". The
 * sidebar also shows per-link spinners (see AdminShell); this covers the
 * content area.
 */
export default function AdminLoading() {
  return (
    <div className="flex flex-col gap-6" aria-busy="true" aria-live="polite">
      <span className="sr-only">Memuat…</span>
      <div className="flex flex-col gap-2">
        <div className="h-9 w-48 animate-pulse rounded-2xl bg-ink/10 dark:bg-white/10" />
        <div className="h-4 w-80 max-w-full animate-pulse rounded-full bg-ink/5 dark:bg-white/5" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="glass-panel h-28 animate-pulse rounded-3xl bg-ink/5 dark:bg-white/5"
          />
        ))}
      </div>
    </div>
  );
}
