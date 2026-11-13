/**
 * Shared admin skeletons.
 *
 * Every route segment needs its own `loading.tsx`: a parent fallback only shows
 * while that parent segment resolves, so navigating sibling → child
 * (`/admin/divisi` → `/admin/divisi/[id]`) would otherwise sit blank until the
 * data arrives.
 */

function Bar({ className }: { className?: string }) {
  return <div className={`animate-pulse rounded-xs bg-ink/10 dark:bg-white/10 ${className ?? ""}`} />;
}

function Heading() {
  return (
    <div className="flex flex-col gap-3">
      <Bar className="h-9 w-56" />
      <Bar className="h-4 w-80 max-w-full opacity-60" />
    </div>
  );
}

/** Lists and index screens (divisi, posts, proker, galeri, …). */
export function AdminListSkeleton() {
  return (
    <div className="flex flex-col gap-6" aria-busy="true" aria-live="polite">
      <span className="sr-only">Memuat…</span>
      <Heading />
      <div className="flex items-center justify-between gap-4">
        <Bar className="h-4 w-20 opacity-60" />
        <Bar className="h-10 w-32" />
      </div>
      <div className="flex flex-col gap-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="surface flex items-center gap-4 bg-paper px-5 py-4">
            <Bar className="h-10 w-10 shrink-0" />
            <div className="flex min-w-0 flex-1 flex-col gap-2">
              <Bar className="h-4 w-2/5" />
              <Bar className="h-3 w-3/5 opacity-60" />
            </div>
            <Bar className="h-8 w-20 shrink-0" />
          </div>
        ))}
      </div>
    </div>
  );
}

/** Detail and form screens (divisi/[id], posts/[id], posts/new). */
export function AdminFormSkeleton() {
  return (
    <div className="flex flex-col gap-6" aria-busy="true" aria-live="polite">
      <span className="sr-only">Memuat…</span>
      <Heading />
      <div className="surface flex flex-col gap-6 bg-paper p-6 sm:p-8">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex flex-col gap-2">
            <Bar className="h-3 w-24 opacity-60" />
            <Bar className="h-11 w-full" />
          </div>
        ))}
        <Bar className="h-11 w-32" />
      </div>
    </div>
  );
}
