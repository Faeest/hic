import { Suspense } from "react";
import type { Site } from "@/lib/types";

/**
 * Copyright year, read at request time so the prerendered static shell doesn't
 * embed a stale `new Date()` value. Wrapped in <Suspense> per Cache Components
 * guidance for "current time" reads.
 */
async function Year() {
  return <>{new Date().getFullYear()}</>;
}

export function Copyright({ site }: { site: Site }) {
  return (
    <p className="text-sm text-ink-faint">
      © <Suspense fallback="2026"><Year /></Suspense> {site.namaPanjang}.
    </p>
  );
}
