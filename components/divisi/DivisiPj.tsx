import Image from "next/image";
import { divisiVars } from "@/lib/utils";
import type { Divisi, Pengurus } from "@/lib/types";

/**
 * The division's coordinator. They are appointed by the division itself and sit
 * outside the BPH, which is why this lives on the division page rather than in
 * the board grid on the homepage.
 */
export function DivisiPj({ d, pj }: { d: Divisi; pj?: Pengurus }) {
  if (!pj) return null;

  return (
    <section className="bg-paper pb-10 sm:pb-12" style={divisiVars(d)}>
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-4 border-t border-ink/12 pt-6">
          <div className="relative h-14 w-14 shrink-0 overflow-hidden border border-ink/10 bg-cream dark:bg-white/[0.03]">
            {pj.foto ? (
              <Image
                src={pj.foto}
                alt={pj.nama}
                fill
                sizes="56px"
                className="object-cover"
              />
            ) : (
              <span className="absolute inset-0 grid place-items-center font-display text-xl font-semibold text-[var(--div-main)]">
                {pj.inisial}
              </span>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-xs text-ink-faint">Penanggung jawab divisi</p>
            <p className="mt-0.5 font-display text-lg font-semibold leading-tight text-ink">
              {pj.nama}
            </p>
            <p className="text-sm text-ink-soft">{pj.jabatan}</p>
          </div>

          <p className="max-w-xs text-sm leading-snug text-ink-faint">
            Diangkat oleh divisi ini, bukan bagian dari BPH.
          </p>
        </div>
      </div>
    </section>
  );
}
