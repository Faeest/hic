import { cacheLife } from "next/cache";
import type { Site } from "@/lib/types";

/** Year is cached like other content so it never trips the prerender guard. */
async function Year() {
  "use cache";
  cacheLife("max");
  return <>{new Date().getFullYear()}</>;
}

export function Copyright({ site }: { site: Site }) {
  return (
    <p className="text-sm text-ink-faint">
      © <Year /> {site.namaPanjang}.
    </p>
  );
}
