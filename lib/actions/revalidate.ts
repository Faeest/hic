import "server-only";

import { revalidatePath, updateTag } from "next/cache";
import { ALL_CONTENT_TAGS } from "@/lib/cache/tags";

/**
 * Revalidate the public pages affected by an admin edit.
 *
 * Two mechanisms, both safe under Cache Components:
 *  - `updateTag` immediately expires every `use cache` scope tagged with a
 *    content tag — read-your-own-writes so the admin sees their edit at once.
 *    (Server Actions only, which is the only place this is called.)
 *  - `revalidatePath` invalidates the prerendered static shells by route.
 */
export function revalidatePublic() {
  for (const tag of ALL_CONTENT_TAGS) updateTag(tag);
  revalidatePath("/");
  revalidatePath("/divisi/[slug]", "page");
  revalidatePath("/blog");
  revalidatePath("/blog/[slug]", "page");
}
