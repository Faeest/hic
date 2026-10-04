import type { Metadata } from "next";
import { adminProker } from "@/lib/content/admin";
import { ResourceManager } from "@/components/admin/ResourceManager";
import { prokerConfig } from "@/lib/admin/configs";

export const metadata: Metadata = {
  title: "Program Kerja — Admin HIC",
  robots: { index: false, follow: false },
};

export default async function AdminProkerPage() {
  const rows = await adminProker();
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-3xl font-semibold tracking-tight text-ink">
          Program Kerja
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-ink-soft">
          Agenda dan program kerja HIC.
        </p>
      </div>
      <ResourceManager config={prokerConfig} rows={rows} />
    </div>
  );
}
