/**
 * Shared pagination helpers.
 *
 * The public blog pages on the server through `?page=`, the admin media picker
 * windows a loaded list on the client. Both need to read a page number out of
 * the same junk (absent, `?page=0`, `?page=abc`, `?page=999`) and both need the
 * same condensed page list, so the rules live here once.
 */

/** A page number, or `"gap"` marking an omitted run (1 … 4 5 6 … 20). */
export type PageSlot = number | "gap";

/**
 * Read a `page` search param. Anything unusable — missing, empty, NaN, zero,
 * negative, a repeated param — resolves to page 1 rather than throwing, so a
 * hand-edited URL always renders something.
 */
export function parsePageParam(value: string | string[] | undefined): number {
  const raw = Array.isArray(value) ? value[0] : value;
  if (!raw) return 1;
  const n = Number.parseInt(raw, 10);
  if (!Number.isFinite(n) || n < 1) return 1;
  return Math.floor(n);
}

/** Clamp a (possibly out-of-range) page to a real one. */
export function clampPage(page: number, pages: number): number {
  if (!Number.isFinite(page) || page < 1) return 1;
  const last = Math.max(1, pages);
  return Math.min(Math.floor(page), last);
}

/** Offsets for Supabase `range(from, to)` of one page. */
export function pageRange(page: number, pageSize: number): [number, number] {
  const from = (page - 1) * pageSize;
  return [from, from + pageSize - 1];
}

/** Total pages for a row count; always at least 1 so "empty" is still page 1. */
export function pageCount(total: number, pageSize: number): number {
  if (pageSize <= 0) return 1;
  return Math.max(1, Math.ceil(total / pageSize));
}

/**
 * The page numbers to show: always the first and last, plus the current page and
 * its neighbours, with `"gap"` where numbers were skipped. Short lists (7 or
 * fewer) are returned whole.
 */
export function pageWindow(page: number, pages: number): PageSlot[] {
  const last = Math.max(1, Math.floor(pages));
  if (last <= 7) {
    return Array.from({ length: last }, (_, i) => i + 1);
  }

  const current = clampPage(page, last);
  const keep = new Set<number>([1, last, current]);
  if (current - 1 > 1) keep.add(current - 1);
  if (current + 1 < last) keep.add(current + 1);

  const sorted = [...keep].sort((a, b) => a - b);
  const slots: PageSlot[] = [];
  sorted.forEach((n, i) => {
    const previous = sorted[i - 1];
    if (i > 0 && n - previous > 1) slots.push("gap");
    slots.push(n);
  });
  return slots;
}
