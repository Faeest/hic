"use client";

import { useEffect, useState } from "react";
import { useActionState } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { updatePassword, type AuthState } from "@/lib/actions/auth";

type Phase = "checking" | "ready" | "invalid";

/**
 * Recovery landing. Supabase redirects here with either `?code=` (PKCE) or a
 * `#access_token=` fragment (implicit). Both are exchanged client-side so the
 * session cookies are written before the Server Action runs.
 */
export function ResetPasswordForm() {
  const [phase, setPhase] = useState<Phase>("checking");
  const [state, action, pending] = useActionState<AuthState, FormData>(
    updatePassword,
    undefined
  );

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
      );

      const url = new URL(window.location.href);
      const code = url.searchParams.get("code");
      const hash = new URLSearchParams(url.hash.replace(/^#/, ""));
      const accessToken = hash.get("access_token");
      const refreshToken = hash.get("refresh_token");

      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (!cancelled) setPhase(error ? "invalid" : "ready");
        return;
      }

      if (accessToken && refreshToken) {
        const { error } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });
        if (!cancelled) setPhase(error ? "invalid" : "ready");
        return;
      }

      const { data } = await supabase.auth.getSession();
      if (!cancelled) setPhase(data.session ? "ready" : "invalid");
    };

    run();
    return () => {
      cancelled = true;
    };
  }, []);

  if (phase === "checking") {
    return <p className="text-sm text-ink-faint">Memeriksa tautan…</p>;
  }

  if (phase === "invalid") {
    return (
      <div className="flex flex-col gap-4">
        <p className="rounded-sm border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-600 dark:text-red-400">
          Tautan atur ulang tidak valid atau sudah kedaluwarsa.
        </p>
        <a
          href="/admin/forgot"
          className="text-sm text-ember underline underline-offset-4"
        >
          Minta tautan baru
        </a>
      </div>
    );
  }

  return (
    <form action={action} className="flex w-full flex-col gap-5">
      <div className="flex flex-col gap-2">
        <label htmlFor="password" className="text-sm font-medium text-ink-soft">
          Kata sandi baru
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          minLength={8}
          required
          className="rounded-sm border border-ink/15 bg-white px-4 py-3 text-base text-ink outline-none transition-colors focus:border-ember dark:border-white/15 dark:bg-white/[0.04]"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="confirm" className="text-sm font-medium text-ink-soft">
          Ulangi kata sandi
        </label>
        <input
          id="confirm"
          name="confirm"
          type="password"
          autoComplete="new-password"
          minLength={8}
          required
          className="rounded-sm border border-ink/15 bg-white px-4 py-3 text-base text-ink outline-none transition-colors focus:border-ember dark:border-white/15 dark:bg-white/[0.04]"
        />
      </div>

      {state?.error && (
        <p
          role="alert"
          className="rounded-sm border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-600 dark:text-red-400"
        >
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="mt-1 rounded-sm bg-ember px-6 py-3.5 text-base font-medium text-white transition-colors hover:bg-flare disabled:opacity-60"
      >
        {pending ? "Menyimpan…" : "Simpan kata sandi"}
      </button>
    </form>
  );
}
