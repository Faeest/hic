import "server-only";

import { revalidatePath } from "next/cache";

/**
 * Revalidate the public pages affected by an admin edit.
 *
 * The public site is statically prerendered for speed (see the `publicDb`
 * cookie-less client in lib/supabase/public.ts). Server Actions must call this
 * after a mutation so visitors see the change without waiting for a rebuild.
 *
 * `revalidatePath` is called with the "page" type so dynamic segments
 * (/divisi/[slug]) are invalidated across all their concrete URLs.
 */
export function revalidatePublic() {
  revalidatePath("/");
  revalidatePath("/divisi/[slug]", "page");
  revalidatePath("/blog");
  revalidatePath("/blog/[slug]", "page");
}
