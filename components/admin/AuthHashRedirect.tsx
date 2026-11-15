"use client";

import { useEffect } from "react";

/**
 * Supabase e-mail links can land on the Site URL root with the session in the
 * URL fragment (`#access_token=…&type=invite`). The fragment never reaches the
 * server, so route it to the reset page client-side.
 */
export function AuthHashRedirect() {
  useEffect(() => {
    const hash = window.location.hash;
    if (!hash.includes("access_token=")) return;

    const params = new URLSearchParams(hash.replace(/^#/, ""));
    const type = params.get("type");
    if (type !== "invite" && type !== "recovery" && type !== "signup") return;
    if (window.location.pathname === "/admin/reset") return;

    window.location.replace(`/admin/reset${hash}`);
  }, []);

  return null;
}
