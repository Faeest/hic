/**
 * One-off migration: move content images that live in the repo's `public/`
 * folder into the `media` bucket, and repoint the database rows at the
 * domain-branded `/media/...` URL.
 *
 * Why: two peer sources (repo + bucket) produced two live URLs for one image and
 * a stale copy whenever one side was replaced. After this, the bucket is the
 * single source for content; `public/` keeps only build-owned brand assets
 * (logo variants, favicon).
 *
 * Idempotent: rows already pointing at `/media/...` are skipped, and an object
 * that already exists in the bucket is not re-uploaded.
 *
 *   node --env-file=.env.local scripts/migrate-public-media.mjs --dry
 *   node --env-file=.env.local scripts/migrate-public-media.mjs --apply
 */
import { readFile } from "node:fs/promises";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";

const APPLY = process.argv.includes("--apply");
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const secret = process.env.SUPABASE_SECRET_KEY;

if (!url || !secret) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SECRET_KEY.");
  process.exit(1);
}

const supabase = createClient(url, secret, { auth: { persistSession: false } });
const bucket = supabase.storage.from("media");

const MIME = {
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".avif": "image/avif",
};

/** Tables/columns that hold a content image path. */
const TARGETS = [
  { table: "galeri", column: "image_url" },
  { table: "pengurus", column: "foto" },
  { table: "posts", column: "cover_url" },
];

const log = (...a) => console.log(APPLY ? "" : "[dry] ", ...a);

let uploaded = 0;
let updated = 0;
let skipped = 0;

for (const { table, column } of TARGETS) {
  const { data: rows, error } = await supabase
    .from(table)
    .select(`id, ${column}`)
    .not(column, "is", null);
  if (error) {
    console.error(`${table}: ${error.message}`);
    process.exitCode = 1;
    continue;
  }

  for (const row of rows ?? []) {
    const value = row[column];
    if (typeof value !== "string" || !value) continue;
    // Only repo-relative paths; external URLs and bucket paths are left alone.
    if (!value.startsWith("/") || value.startsWith("/media/")) {
      skipped++;
      continue;
    }

    const abs = path.join(process.cwd(), "public", value);
    const ext = path.extname(abs).toLowerCase();
    const type = MIME[ext];
    if (!type) {
      log(`skip ${table}.${column} ${value} (unsupported type)`);
      skipped++;
      continue;
    }

    let bytes;
    try {
      bytes = await readFile(abs);
    } catch {
      log(`skip ${table}.${column} ${value} (file missing)`);
      skipped++;
      continue;
    }

    const key = `site/${path.basename(abs)}`;
    const next = `/media/${key}`;

    log(`${table}.${column}: ${value} -> ${next} (${bytes.byteLength} B)`);

    if (!APPLY) continue;

    const { error: upErr } = await bucket.upload(key, bytes, {
      contentType: type,
      upsert: false,
    });
    // "already exists" is fine — the object is already in place.
    if (upErr && !/already exists|duplicate/i.test(upErr.message)) {
      console.error(`  upload failed: ${upErr.message}`);
      process.exitCode = 1;
      continue;
    }
    if (!upErr) uploaded++;

    const { error: dbErr } = await supabase
      .from(table)
      .update({ [column]: next })
      .eq("id", row.id);
    if (dbErr) {
      console.error(`  update failed: ${dbErr.message}`);
      process.exitCode = 1;
      continue;
    }
    updated++;
  }
}

log(`done: ${uploaded} uploaded, ${updated} rows updated, ${skipped} skipped`);
if (!APPLY) log("re-run with --apply to write changes");
