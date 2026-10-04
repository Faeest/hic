import type { Metadata } from "next";
import { getSite } from "@/lib/content/site";
import { SiteForm } from "@/components/admin/SiteForm";

export const metadata: Metadata = {
  title: "Pengaturan Situs — Admin HIC",
  robots: { index: false, follow: false },
};

export default async function AdminSitePage() {
  const site = await getSite();
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-display text-3xl font-semibold tracking-tight text-ink">
          Pengaturan Situs
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-ink-soft">
          Identitas, hero, tentang, statistik, kontak, dan tautan sosial.
        </p>
      </div>
      <SiteForm site={site} />
    </div>
  );
}
