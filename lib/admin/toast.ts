"use client";

import { toast } from "sonner";

type ActionResult = { ok: boolean; error?: string };

/**
 * Run a Server Action and report it as a single toast that starts as a spinner
 * and resolves to success or error. Returns the action result unchanged so the
 * caller can still branch on it.
 */
export async function withToast<T extends ActionResult>(
  promise: Promise<T>,
  messages: { loading: string; success: string }
): Promise<T> {
  const id = toast.loading(messages.loading);
  try {
    const result = await promise;
    if (result.ok) {
      toast.success(messages.success, { id });
    } else {
      toast.error(result.error ?? "Gagal menyimpan.", { id });
    }
    return result;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Gagal menyimpan.";
    toast.error(message, { id });
    return { ok: false, error: message } as T;
  }
}

/** Fire-and-forget error toast for flows that do not return `{ ok }`. */
export function toastError(message: string) {
  toast.error(message);
}
