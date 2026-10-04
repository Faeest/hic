"use client";

import { useActionState } from "react";
import { signIn, type AuthState } from "@/lib/actions/auth";

export function LoginForm() {
  const [state, action, pending] = useActionState<AuthState, FormData>(
    signIn,
    undefined
  );

  return (
    <form action={action} className="flex w-full flex-col gap-5">
      <div className="flex flex-col gap-2">
        <label htmlFor="email" className="text-sm font-medium text-ink-soft">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          className="rounded-2xl border border-ink/15 bg-white px-4 py-3 text-base text-ink outline-none transition-colors focus:border-ember dark:border-white/15 dark:bg-white/[0.04]"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="password" className="text-sm font-medium text-ink-soft">
          Kata sandi
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className="rounded-2xl border border-ink/15 bg-white px-4 py-3 text-base text-ink outline-none transition-colors focus:border-ember dark:border-white/15 dark:bg-white/[0.04]"
        />
      </div>

      {state?.error && (
        <p
          role="alert"
          className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-600 dark:text-red-400"
        >
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="mt-1 rounded-full bg-ember px-6 py-3.5 text-base font-medium text-white transition-colors hover:bg-flare disabled:opacity-60"
      >
        {pending ? "Memproses…" : "Masuk"}
      </button>
    </form>
  );
}
