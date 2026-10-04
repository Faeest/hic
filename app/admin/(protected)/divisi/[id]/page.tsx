import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "@phosphor-icons/react/dist/ssr";
import { adminDivisi, adminKurikulum, adminMentor } from "@/lib/content/admin";
import { ResourceManager } from "@/components/admin/ResourceManager";
import { divisiConfig, kurikulumConfig, mentorConfig } from "@/lib/admin/configs";
import type { DivisiRow } from "@/lib/types";

export const metadata: Metadata = {
  title: "Detail Divisi — Admin HIC",
  robots: { index: false, follow: false },
};

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

export default async function AdminDivisiDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [divisi, kurikulum, mentor] = await Promise.all([
    adminDivisi(),
    adminKurikulum(),
    adminMentor(),
  ]);

  const current = divisi.find((d) => d.id === id);
  if (!current) notFound();

  const flat = flatten(current);
  const myKurikulum = kurikulum.filter((k) => k.divisi_id === id);
  const myMentor = mentor.filter((m) => m.divisi_id === id);

  return (
    <div className="flex flex-col gap-8">
      <div>
        <Link
          href="/admin/divisi"
          className="inline-flex items-center gap-2 text-sm font-medium text-ink-soft transition-colors hover:text-ember"
        >
          <ArrowLeft size={16} weight="bold" />
          Semua divisi
        </Link>
        <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight text-ink">
          {current.nama}
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-ink-soft">
          {current.nama_panjang}
        </p>
      </div>

      <section className="flex flex-col gap-5">
        <h2 className="font-display text-xl font-semibold tracking-tight text-ink">
          Detail divisi
        </h2>
        <ResourceManager config={divisiConfig} rows={[flat]} />
      </section>

      <section className="flex flex-col gap-5">
        <h2 className="font-display text-xl font-semibold tracking-tight text-ink">
          Kurikulum
        </h2>
        <ResourceManager
          config={kurikulumConfig}
          rows={myKurikulum}
          fixedValues={{ divisi_id: id }}
        />
      </section>

      <section className="flex flex-col gap-5">
        <h2 className="font-display text-xl font-semibold tracking-tight text-ink">
          Mentor
        </h2>
        <ResourceManager
          config={mentorConfig}
          rows={myMentor}
          fixedValues={{ divisi_id: id }}
        />
      </section>
    </div>
  );
}
