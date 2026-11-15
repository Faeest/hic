import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * Two tabs of the pengurus admin. Groups are per-board, so both tabs share the
 * same `?loadout=` param and the same LoadoutSwitcher above them.
 */
export function PengurusTabs({
  active,
  loadout,
}: {
  active: "pengurus" | "kategori";
  loadout?: string | null;
}) {
  const suffix = loadout ? `?loadout=${encodeURIComponent(loadout)}` : "";
  const tabs = [
    { key: "pengurus", href: `/admin/pengurus${suffix}`, label: "Pengurus" },
    {
      key: "kategori",
      href: `/admin/pengurus/kategori${suffix}`,
      label: "Kategori",
    },
  ] as const;

  return (
    <nav className="flex items-center gap-1 border-b border-ink/12 dark:border-white/12">
      {tabs.map((tab) => (
        <Link
          key={tab.key}
          href={tab.href}
          aria-current={active === tab.key ? "page" : undefined}
          className={cn(
            "-mb-px border-b-2 px-4 py-2.5 text-sm transition-colors",
            active === tab.key
              ? "border-ember font-medium text-ember"
              : "border-transparent text-ink-soft hover:text-ink"
          )}
        >
          {tab.label}
        </Link>
      ))}
    </nav>
  );
}
