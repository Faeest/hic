import type { Metadata } from "next";
import { adminSections } from "@/lib/content/admin";
import { ResourceManager } from "@/components/admin/ResourceManager";
import { sectionsConfig } from "@/lib/admin/configs";

export const metadata: Metadata = {
  title: "Seksi — Admin HIC",
  robots: { index: false, follow: false },
};

export default async function AdminSectionsPage() {
  const rows = await adminSections();
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-3xl font-semibold tracking-tight text-ink">
          Seksi
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-ink-soft">
          Judul, label, dan visibilitas tiap bagian di beranda.
        </p>
      </div>
      <ResourceManager config={sectionsConfig} rows={rows} />
    </div>
  );
}
