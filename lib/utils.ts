export const cn = (...classes: (string | false | null | undefined)[]) =>
  classes.filter(Boolean).join(" ");

export function formatAngka(n: number): string {
  return n.toLocaleString("id-ID");
}

import type { Divisi } from "@/data/divisi";
import type { CSSProperties } from "react";

export function divisiVars(d: Divisi): CSSProperties {
  return {
    "--div-main": d.warna.utama,
    "--div-bright": d.warna.terang,
    "--div-bg": d.warna.latar,
    "--div-bg-dark": d.warna.latarDark,
    "--div-border": d.warna.border,
    "--div-border-dark": d.warna.borderDark,
  } as CSSProperties;
}