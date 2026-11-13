import type { Metadata } from "next";
import { MediaLibrary } from "@/components/admin/MediaLibrary";
import { listMedia } from "@/lib/admin/media";

export const metadata: Metadata = {
  title: "Media — Admin HIC",
  robots: { index: false, follow: false },
};

export default async function AdminMediaPage() {
  const items = await listMedia();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-3xl font-semibold tracking-tight text-ink">
          Media
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-ink-soft">
          Semua berkas di bucket <span className="font-mono text-xs">media</span>. Unggah,
          salin URL, atau hapus yang sudah tidak dipakai.
        </p>
      </div>
      <MediaLibrary items={items} />
    </div>
  );
}
