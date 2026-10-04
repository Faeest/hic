import type { Metadata } from "next";
import { adminPengurus } from "@/lib/content/admin";
import { ResourceManager } from "@/components/admin/ResourceManager";
import { pengurusConfig } from "@/lib/admin/configs";

export const metadata: Metadata = {
  title: "Pengurus — Admin HIC",
  robots: { index: false, follow: false },
};

export default async function AdminPengurusPage() {
  const rows = await adminPengurus();
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-3xl font-semibold tracking-tight text-ink">
          Pengurus
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-ink-soft">
          Dosen pembina, BPH, dan penanggung jawab divisi.
        </p>
      </div>
      <ResourceManager config={pengurusConfig} rows={rows} />
    </div>
  );
}
