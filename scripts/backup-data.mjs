/**
 * Off-site backup: every content table as JSON + the whole `media` bucket.
 *
 * Runs from .github/workflows/backup.yml (GitHub Actions artifact, 90 days) so
 * it does not depend on the VPS or on Vercel. Schema lives in
 * supabase/migrations; this captures the data and the uploaded files.
 *
 *   NEXT_PUBLIC_SUPABASE_URL=... SUPABASE_SECRET_KEY=... \
 *   node scripts/backup-data.mjs [outDir]
 *
 * Restore:
 *   1. create a fresh Supabase project, run supabase/migrations in order
 *   2. upload media/<key> back into the `media` bucket
 *   3. insert the JSON rows (service role) table by table
 */
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const secret = process.env.SUPABASE_SECRET_KEY;

if (!url || !secret) {
  console.error("backup: NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SECRET_KEY missing");
  process.exit(1);
}

const stamp = new Date().toISOString().slice(0, 10);
const outDir = process.argv[2] || path.join("backups", stamp);

const supabase = createClient(url, secret, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const TABLES = [
  "site_settings",
  "sections",
  "divisi",
  "kurikulum",
  "mentor",
  "kepengurusan",
  "pengurus_grup",
  "pengurus",
  "proker",
  "galeri",
  "faq",
  "posts",
  "admin_users",
];

async function backupTables() {
  await mkdir(path.join(outDir, "tables"), { recursive: true });
  const manifest = { createdAt: new Date().toISOString(), tables: {} };

  for (const table of TABLES) {
    const { data, error } = await supabase.from(table).select("*");
    if (error) throw new Error(`${table}: ${error.message}`);
    await writeFile(
      path.join(outDir, "tables", `${table}.json`),
      JSON.stringify(data ?? [], null, 2)
    );
    manifest.tables[table] = data?.length ?? 0;
    console.log(`${table}: ${data?.length ?? 0} rows`);
  }

  return manifest;
}

async function listAll(prefix) {
  const { data, error } = await supabase.storage
    .from("media")
    .list(prefix, { limit: 1000 });
  if (error) throw new Error(`media list ${prefix}: ${error.message}`);

  const files = [];
  for (const entry of data ?? []) {
    const key = prefix ? `${prefix}/${entry.name}` : entry.name;
    // Folders come back with a null id.
    if (entry.id === null) files.push(...(await listAll(key)));
    else files.push(key);
  }
  return files;
}

async function backupMedia() {
  const keys = await listAll("");
  await mkdir(path.join(outDir, "media"), { recursive: true });

  for (const key of keys) {
    const { data, error } = await supabase.storage.from("media").download(key);
    if (error) throw new Error(`media download ${key}: ${error.message}`);
    const target = path.join(outDir, "media", key);
    await mkdir(path.dirname(target), { recursive: true });
    await writeFile(target, Buffer.from(await data.arrayBuffer()));
  }

  console.log(`media: ${keys.length} objects`);
  return keys.length;
}

const manifest = await backupTables();
manifest.mediaObjects = await backupMedia();
await writeFile(
  path.join(outDir, "manifest.json"),
  JSON.stringify(manifest, null, 2)
);
console.log(`backup written to ${outDir}`);
