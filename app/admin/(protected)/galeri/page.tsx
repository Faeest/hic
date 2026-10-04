import type { Metadata } from "next";
import { adminGaleri } from "@/lib/content/admin";
import { ResourceManager } from "@/components/admin/ResourceManager";
import { galeriConfig } from "@/lib/admin/configs";

export const metadata: Metadata = {
  title: "Galeri — Admin HIC",
  robots: { index: false, follow: false },
};

export default async function AdminGaleriPage() {
  const rows = await adminGaleri();
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-3xl font-semibold tracking-tight text-ink">
          Galeri
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-ink-soft">
          Foto kegiatan. Unggah gambar atau tempel URL.
        </p>
      </div>
      <ResourceManager config={galeriConfig} rows={rows} />
    </div>
  );
}
