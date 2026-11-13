import { NextResponse } from "next/server";
import { publicDb } from "@/lib/supabase/public";

/**
 * Supabase pauses free projects after ~7 days without activity. A daily hit on
 * this route runs one trivial query, which counts as activity.
 *
 * Point a cron at it (see `deploy/keepalive.sh`). If `KEEPALIVE_TOKEN` is set in
 * the environment, the request must carry `?token=<value>`.
 */
export async function GET(request: Request) {
  const expected = process.env.KEEPALIVE_TOKEN;
  if (expected) {
    const token = new URL(request.url).searchParams.get("token");
    if (token !== expected) {
      return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
    }
  }

  const started = Date.now();
  const { error } = await publicDb
    .from("site_settings")
    .select("id")
    .eq("id", 1)
    .maybeSingle();

  if (error) {
    return NextResponse.json(
      { ok: false, error: error.message },
      { status: 503 }
    );
  }

  return NextResponse.json({
    ok: true,
    ms: Date.now() - started,
    at: new Date().toISOString(),
  });
}
