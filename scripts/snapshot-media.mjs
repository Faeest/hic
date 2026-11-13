/**
 * Nightly bucket snapshot — the only backup the `media` bucket has.
 *
 * Supabase free tier keeps no versions: an in-place replace or a delete is
 * unrecoverable. This copies every object to disk and keeps the last N days, so
 * "someone deleted the logo" is a restore, not an incident.
 *
 * Runs from `deploy/keepalive.sh` (systemd user timer on the VPS) and skips
 * cleanly when the secret key or Node is unavailable, so it never breaks the
 * keepalive.
 *
 *   HIC_MEDIA_SNAPSHOT_DIR=/home/lerraf/media-snapshots \
 *   HIC_MEDIA_SNAPSHOT_KEEP=7 \
 *   node --env-file=.env.local scripts/snapshot-media.mjs
 *
 * Restore one file:
 *   npx supabase ... (or the dashboard) upload <snapshot>/<date>/<key>
 */
import { mkdir, readdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const secret = process.env.SUPABASE_SECRET_KEY;
const dir =
  process.env.HIC_MEDIA_SNAPSHOT_DIR ||
  path.join(process.cwd(), "media-snapshots");
const keep = Number(process.env.HIC_MEDIA_SNAPSHOT_KEEP || 7);

if (!url || !secret) {
  console.log("snapshot: skipped (NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SECRET_KEY missing)");
  process.exit(0);
}

const supabase = createClient(url, secret, { auth: { persistSession: false } });
const bucket = supabase.storage.from("media");

/** Recursively list every object key in the bucket. */
async function walk(prefix) {
  const { data, error } = await bucket.list(prefix, {
    limit: 1000,
    sortBy: { column: "name", order: "asc" },
  });
  if (error) throw new Error(`${prefix || "/"}: ${error.message}`);

  const keys = [];
  for (const entry of data ?? []) {
    const key = prefix ? `${prefix}/${entry.name}` : entry.name;
    // `id === null` marks a folder.
    if (entry.id === null) keys.push(...(await walk(key)));
    else keys.push(key);
  }
  return keys;
}

let keys;
try {
  keys = await walk("");
} catch (error) {
  console.error(`snapshot: list failed — ${error.message}`);
  process.exit(1);
}

const stamp = new Date().toISOString().slice(0, 10);
const dest = path.join(dir, stamp);

let saved = 0;
let failed = 0;

for (const key of keys) {
  const { data, error } = await bucket.download(key);
  if (error || !data) {
    console.error(`  ${key}: ${error?.message ?? "no data"}`);
    failed++;
    continue;
  }
  const out = path.join(dest, key);
  await mkdir(path.dirname(out), { recursive: true });
  await writeFile(out, Buffer.from(await data.arrayBuffer()));
  saved++;
}

// Keep the newest N dated folders.
try {
  const entries = (await readdir(dir, { withFileTypes: true }))
    .filter((e) => e.isDirectory())
    .map((e) => e.name)
    .sort();
  for (const old of entries.slice(0, Math.max(0, entries.length - keep))) {
    await rm(path.join(dir, old), { recursive: true, force: true });
  }
} catch {
  // No previous snapshots yet.
}

console.log(`snapshot: ${saved} saved, ${failed} failed -> ${dest}`);
process.exit(failed > 0 ? 1 : 0);
