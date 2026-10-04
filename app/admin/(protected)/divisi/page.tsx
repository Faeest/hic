import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { adminDivisi } from "@/lib/content/admin";
import { ResourceManager } from "@/components/admin/ResourceManager";
import { divisiConfig } from "@/lib/admin/configs";
import type { DivisiRow } from "@/lib/types";

export const metadata: Metadata = {
  title: "Divisi — Admin HIC",
  robots: { index: false, follow: false },
};

/** Flatten the `warna` jsonb into form fields for editing. */
function flatten(row: DivisiRow) {
  const w = row.warna ?? {};
  return {
    ...row,
    warna_utama: w.utama ?? "",
    warna_terang: w.terang ?? "",
    warna_latar: w.latar ?? "",
    warna_latarDark: w.latarDark ?? "",
    warna_border: w.border ?? "",
    warna_borderDark: w.borderDark ?? "",
  };
}

export default async function AdminDivisiPage() {
  const rows = (await adminDivisi()).map(flatten);
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-3xl font-semibold tracking-tight text-ink">
          Divisi
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-ink-soft">
          Kelola divisi, kurikulum, dan mentor tiap jalur.
        </p>
      </div>

      <div className="flex flex-col gap-3">
        {rows.map((d) => (
          <Link
            key={d.id}
            href={`/admin/divisi/${d.id}`}
            className="glass-panel flex items-center justify-between gap-4 rounded-3xl p-5 transition-transform duration-300 hover:-translate-y-0.5"
          >
            <div>
              <p className="font-display text-lg font-semibold text-ink">
                {d.nama}
              </p>
              <p className="text-sm text-ink-soft">{d.nama_panjang}</p>
            </div>
            <span className="inline-flex items-center gap-2 text-sm font-medium text-ember">
              Kurikulum & mentor
              <ArrowUpRight size={16} weight="bold" />
            </span>
          </Link>
        ))}
      </div>

      <ResourceManager config={divisiConfig} rows={rows} />
    </div>
  );
}
