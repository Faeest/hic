/**
 * Seed Supabase from the local `data/*.ts` source of truth.
 *
 * Idempotent: every row gets a deterministic UUIDv5 derived from a stable
 * natural key, so re-running upserts in place instead of duplicating.
 *
 * Usage:
 *   node --env-file=.env.local --import tsx scripts/seed.ts
 * or
 *   npm run seed
 *
 * Requires SUPABASE_SECRET_KEY (bypasses RLS).
 */

import { createHash } from "node:crypto";
import { createClient } from "@supabase/supabase-js";

import { club, sosial } from "../data/club";
import { divisi as divisiSeed } from "../data/divisi";
import {
  koordinatorDivisi,
  pembina,
  pengurusInti,
} from "../data/pengurus";
import { proker as prokerSeed } from "../data/proker";
import { galeri as galeriSeed } from "../data/galeri";
import { faq as faqSeed } from "../data/faq";
import { seedSections, seedSite } from "../lib/content/seed";

/* ------------------------------------------------------------------ */
/* Deterministic UUIDv5 (RFC 4122) — no external dependency            */
/* ------------------------------------------------------------------ */

/** Fixed namespace UUID for this project (generated once, never change). */
const NAMESPACE = "a1b2c3d4-e5f6-4a1b-8c2d-9e0f1a2b3c4d";

function uuidToBytes(uuid: string): Buffer {
  return Buffer.from(uuid.replace(/-/g, ""), "hex");
}

function uuidv5(name: string): string {
  const hash = createHash("sha1")
    .update(uuidToBytes(NAMESPACE))
    .update(name, "utf8")
    .digest();
  const bytes = Buffer.from(hash.subarray(0, 16));
  bytes[6] = (bytes[6] & 0x0f) | 0x50; // version 5
  bytes[8] = (bytes[8] & 0x3f) | 0x80; // variant RFC 4122
  const hex = bytes.toString("hex");
  return [
    hex.slice(0, 8),
    hex.slice(8, 12),
    hex.slice(12, 16),
    hex.slice(16, 20),
    hex.slice(20, 32),
  ].join("-");
}

const id = (key: string) => uuidv5(`hic:${key}`);

/* ------------------------------------------------------------------ */
/* Env                                                                 */
/* ------------------------------------------------------------------ */

// Node 22: load .env.local if present (no dotenv dependency).
try {
  process.loadEnvFile(".env.local");
} catch {
  // .env.local may be absent (e.g. CI) — rely on real env vars.
}

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const secret = process.env.SUPABASE_SECRET_KEY;
if (!url || !secret) {
  console.error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SECRET_KEY. " +
      "Ensure .env.local exists or export the vars."
  );
  process.exit(1);
}

const db = createClient(url, secret, {
  auth: { autoRefreshToken: false, persistSession: false },
});

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

let failures = 0;

async function upsert(
  table: string,
  rows: Record<string, unknown>[],
  onConflict: string
) {
  if (rows.length === 0) return;
  const { error } = await db.from(table).upsert(rows, { onConflict });
  if (error) {
    failures++;
    console.error(`  ✗ ${table}: ${error.message}`);
  } else {
    console.log(`  ✓ ${table}: ${rows.length} row(s)`);
  }
}

async function main() {
  console.log(`Seeding ${url}\n`);

  /* ---- site_settings (singleton) ---- */
  console.log("site_settings");
  await upsert(
    "site_settings",
    [
      {
        id: 1,
        nama: seedSite.nama,
        nama_panjang: seedSite.namaPanjang,
        nama_lengkap: seedSite.namaLengkap,
        tagline: seedSite.tagline,
        visi: seedSite.visi,
        pilar_misi: seedSite.pilarMisi,
        statistik: seedSite.statistik,
        sosial: seedSite.sosial,
        kontak_email: seedSite.kontak.email,
        kontak_instagram: seedSite.kontak.instagram,
        kontak_lokasi: seedSite.kontak.lokasi,
        hero_headline: seedSite.heroHeadline,
        hero_subcopy: seedSite.heroSubcopy,
        tentang_intro: seedSite.tentangIntro,
        tentang_tags: seedSite.tentangTags,
        logo_light_url: seedSite.logoLightUrl,
        logo_dark_url: seedSite.logoDarkUrl,
        testimoni_nama: seedSite.testimoni.nama,
        testimoni_teks: seedSite.testimoni.teks,
        testimoni_peran: seedSite.testimoni.peran,
        marquee_items: seedSite.marqueeItems,
      },
    ],
    "id"
  );

  /* ---- sections ---- */
  console.log("sections");
  await upsert(
    "sections",
    seedSections.map((s, i) => ({
      id: id(`section:${s.key}`),
      key: s.key,
      kicker: s.index,
      label: s.label,
      title: s.title,
      accent: s.accent,
      sort: i,
      visible: s.visible,
    })),
    "key"
  );

  /* ---- divisi + kurikulum + mentor ---- */
  console.log("divisi");
  await upsert(
    "divisi",
    divisiSeed.map((d, i) => ({
      id: id(`divisi:${d.slug}`),
      slug: d.slug,
      nama: d.nama,
      nama_panjang: d.namaPanjang,
      angka: d.angka,
      tagline: d.tagline,
      deskripsi: d.deskripsi,
      akronim: d.akronim,
      warna: d.warna,
      sort: i,
      published: true,
    })),
    "slug"
  );

  console.log("kurikulum");
  await upsert(
    "kurikulum",
    divisiSeed.flatMap((d) =>
      d.kurikulum.map((k, i) => ({
        id: id(`kurikulum:${d.slug}:${k.nomor}`),
        divisi_id: id(`divisi:${d.slug}`),
        nomor: k.nomor,
        judul: k.judul,
        durasi: k.durasi,
        deskripsi: k.deskripsi,
        sort: i,
      }))
    ),
    "id"
  );

  console.log("mentor");
  await upsert(
    "mentor",
    divisiSeed.flatMap((d) =>
      d.mentor.map((m, i) => ({
        id: id(`mentor:${d.slug}:${m.nama}`),
        divisi_id: id(`divisi:${d.slug}`),
        nama: m.nama,
        fokus: m.fokus,
        sort: i,
      }))
    ),
    "id"
  );

  /* ---- pengurus ---- */
  console.log("pengurus");
  const pengurusRows = [
    { ...pembina, kategori: "pembina" as const, key: "pembina" },
    ...pengurusInti.map((p) => ({ ...p, kategori: "inti" as const, key: p.jabatan })),
    ...koordinatorDivisi.map((p) => ({
      ...p,
      kategori: "koordinator" as const,
      key: p.jabatan,
    })),
  ].map((p, i) => ({
    id: id(`pengurus:${p.kategori}:${p.key}`),
    nama: p.nama,
    jabatan: p.jabatan,
    deskripsi: p.deskripsi,
    inisial: p.inisial,
    gradien: p.gradien,
    kategori: p.kategori,
    sort: i,
    published: true,
  }));
  await upsert("pengurus", pengurusRows, "id");

  /* ---- proker ---- */
  console.log("proker");
  await upsert(
    "proker",
    prokerSeed.map((p, i) => ({
      id: id(`proker:${p.judul}`),
      judul: p.judul,
      kategori: p.kategori,
      divisi_slug: p.divisiSlug,
      tahun: p.tahun,
      deskripsi: p.deskripsi,
      dana: p.dana,
      warna: p.warna,
      sort: i,
      published: true,
    })),
    "id"
  );

  /* ---- galeri ---- */
  console.log("galeri");
  await upsert(
    "galeri",
    galeriSeed.map((f, i) => ({
      id: id(`galeri:${f.src}`),
      image_url: f.src,
      judul: f.judul,
      keterangan: f.keterangan,
      span: f.span ?? null,
      sort: i,
      published: true,
    })),
    "id"
  );

  /* ---- faq ---- */
  console.log("faq");
  await upsert(
    "faq",
    faqSeed.map((f, i) => ({
      id: id(`faq:${f.pertanyaan}`),
      pertanyaan: f.pertanyaan,
      jawaban: f.jawaban,
      sort: i,
      published: true,
    })),
    "id"
  );

  /* ---- summary ---- */
  console.log(
    `\nSeed complete. club="${club.nama}", sosial=${sosial.length} link(s).`
  );
  if (failures > 0) {
    console.error(`\n${failures} table(s) failed. See errors above.`);
    process.exit(1);
  }
}

main().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
