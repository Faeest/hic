import type { Metadata } from "next";
import { MediaUploader } from "@/components/admin/MediaUploader";

export const metadata: Metadata = {
  title: "Media — Admin HIC",
  robots: { index: false, follow: false },
};

export default function AdminMediaPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-3xl font-semibold tracking-tight text-ink">
          Media
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-ink-soft">
          Unggah gambar lalu salin URL-nya untuk dipakai di kolom gambar mana pun.
        </p>
      </div>
      <MediaUploader />
    </div>
  );
}
