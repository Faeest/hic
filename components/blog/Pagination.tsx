import Link from "next/link";
import { CaretLeft, CaretRight } from "@phosphor-icons/react/dist/ssr";
import { pageWindow } from "@/lib/pagination";
import { cn } from "@/lib/utils";

/**
 * Page links for the blog index.
 *
 * Server component on purpose: the pages are prerendered and the only thing a
 * pager needs is hrefs, so this ships no JavaScript. Page 1 links to the bare
 * path, which keeps `/blog` the canonical URL.
 */
export function Pagination({
  page,
  pages,
  basePath = "/blog",
  className,
}: {
  page: number;
  pages: number;
  /** Route the links point at. */
  basePath?: string;
  className?: string;
}) {
  if (pages <= 1) return null;

  const href = (n: number) => (n === 1 ? basePath : `${basePath}?page=${n}`);
  const slots = pageWindow(page, pages);

  const item =
    "grid h-9 min-w-9 place-items-center rounded-sm border px-3 text-sm transition-colors";
  const link = cn(
    item,
    "border-ink/15 text-ink-soft hover:border-ember/40 hover:text-ember dark:border-white/15"
  );
  const disabled = cn(
    item,
    "border-ink/10 text-ink-faint/60 dark:border-white/10"
  );

  return (
    <nav aria-label="Navigasi halaman" className={cn("flex flex-wrap items-center gap-2", className)}>
      {page > 1 ? (
        <Link href={href(page - 1)} rel="prev" aria-label="Halaman sebelumnya" className={link}>
          <CaretLeft size={16} weight="bold" />
        </Link>
      ) : (
        <span aria-hidden className={disabled}>
          <CaretLeft size={16} weight="bold" />
        </span>
      )}

      {slots.map((slot, i) =>
        slot === "gap" ? (
          <span key={`gap-${i}`} aria-hidden className="px-1 text-sm text-ink-faint">
            …
          </span>
        ) : slot === page ? (
          <span key={slot} aria-current="page" className={cn(item, "border-ember bg-ember text-white")}>
            {slot}
          </span>
        ) : (
          <Link key={slot} href={href(slot)} className={link} aria-label={`Halaman ${slot}`}>
            {slot}
          </Link>
        )
      )}

      {page < pages ? (
        <Link href={href(page + 1)} rel="next" aria-label="Halaman berikutnya" className={link}>
          <CaretRight size={16} weight="bold" />
        </Link>
      ) : (
        <span aria-hidden className={disabled}>
          <CaretRight size={16} weight="bold" />
        </span>
      )}
    </nav>
  );
}
