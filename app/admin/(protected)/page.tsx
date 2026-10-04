import type { Metadata } from "next";
import { publicDb } from "@/lib/supabase/public";
import { DashboardGrid } from "@/components/admin/DashboardGrid";

export const metadata: Metadata = {
  title: "Ringkasan — Admin HIC",
  robots: { index: false, follow: false },
};

const TABLES = ["divisi", "pengurus", "proker", "galeri", "faq", "posts"] as const;

async function count(table: (typeof TABLES)[number]) {
  const { count, error } = await publicDb
    .from(table)
    .select("*", { count: "exact", head: true });
  if (error) return null;
  return count ?? 0;
}

export default async function AdminDashboard() {
  const values = await Promise.all(TABLES.map((t) => count(t)));
  const counts: Record<string, number | null> = {};
  TABLES.forEach((t, i) => {
    counts[t] = values[i];
  });

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-display text-3xl font-semibold tracking-tight text-ink">
          Ringkasan
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-ink-soft">
          Kelola seluruh konten situs HIC dari sini. Perubahan langsung tampil di
          situs publik.
        </p>
      </div>

      <DashboardGrid counts={counts} />
    </div>
  );
}
