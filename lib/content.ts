// Single source of truth for site content.
// Content lives in content/*.json and is edited through the CMS at /admin.
// JSON is imported statically so every value is inlined at build time (Vercel-safe,
// no filesystem reads at request time). Types are asserted here so the rest of the
// app keeps strong typing while the CMS stays schema-light.

import siteJson from "@/content/site.json";
import homeJson from "@/content/pages/home.json";
import divisiJson from "@/content/divisi.json";
import pengurusJson from "@/content/pengurus.json";
import prokerJson from "@/content/proker.json";
import galeriJson from "@/content/galeri.json";
import faqJson from "@/content/faq.json";

import type {
  Site,
  HomeContent,
  Divisi,
  PengurusContent,
  Proker,
  Foto,
  FaqItem,
} from "./types";

// Files edited as a top-level list in the CMS are wrapped as { list: [...] }.
type Wrapped<T> = { list: T[] };

export const site = siteJson as Site;

export const home = homeJson as HomeContent;

export const divisi = (divisiJson as Wrapped<Divisi>).list;

export const pengurus = pengurusJson as PengurusContent;

export const proker = (prokerJson as Wrapped<Proker>).list;

export const galeri = (galeriJson as Wrapped<Foto>).list;

export const faq = (faqJson as Wrapped<FaqItem>).list;

export function getSite(): Site {
  return site;
}

export function getHome(): HomeContent {
  return home;
}

export function getDivisiList(): Divisi[] {
  return divisi;
}

export function getDivisi(slug: string): Divisi | undefined {
  return divisi.find((d) => d.slug === slug);
}

export function getProker(divisiSlug: string): Proker[] {
  return proker.filter((p) => p.divisiSlug === divisiSlug);
}

export function getPengurus(): PengurusContent {
  return pengurus;
}

export function getGaleri(): Foto[] {
  return galeri;
}

export function getFaq(): FaqItem[] {
  return faq;
}
