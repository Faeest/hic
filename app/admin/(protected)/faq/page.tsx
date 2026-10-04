import type { Metadata } from "next";
import { adminFaq } from "@/lib/content/admin";
import { ResourceManager } from "@/components/admin/ResourceManager";
import { faqConfig } from "@/lib/admin/configs";

export const metadata: Metadata = {
  title: "FAQ — Admin HIC",
  robots: { index: false, follow: false },
};

export default async function AdminFaqPage() {
  const rows = await adminFaq();
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-3xl font-semibold tracking-tight text-ink">
          FAQ
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-ink-soft">
          Pertanyaan yang sering diajukan.
        </p>
      </div>
      <ResourceManager config={faqConfig} rows={rows} />
    </div>
  );
}
