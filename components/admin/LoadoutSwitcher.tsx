import Link from "next/link";
import { cn } from "@/lib/utils";
import type { KepengurusanRow } from "@/lib/types";

/**
 * Board picker for /admin/pengurus. Plain links — the page is dynamic, so a
 * navigation is enough and no client state is needed.
 */
export function LoadoutSwitcher({
  boards,
  selectedId,
}: {
  boards: KepengurusanRow[];
  selectedId?: string;
}) {
  if (boards.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      {boards.map((board) => {
        const selected = board.id === selectedId;
        return (
          <Link
            key={board.id}
            href={`/admin/pengurus?loadout=${board.id}`}
            aria-current={selected ? "page" : undefined}
            className={cn(
              "inline-flex items-center gap-2 rounded-sm border px-3 py-2 text-sm transition-colors",
              selected
                ? "border-ember bg-ember text-white"
                : "border-ink/15 text-ink-soft hover:border-ember/40 hover:text-ember dark:border-white/15"
            )}
          >
            <span className="font-medium">{board.periode}</span>
            {board.aktif && (
              <span
                className={cn(
                  "rounded-sm px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
                  selected ? "bg-white/20 text-white" : "bg-ember/10 text-ember"
                )}
              >
                Aktif
              </span>
            )}
          </Link>
        );
      })}
    </div>
  );
}
