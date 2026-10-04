import { requireAdmin } from "@/lib/auth/dal";
import { AdminShell } from "@/components/admin/AdminShell";

/**
 * Protected admin layout.
 *
 * `(protected)` is a route group — it does not appear in the URL. This layout
 * covers every admin page except `/admin/login`, which sits outside the group.
 *
 * Note: a layout check is not a security boundary on its own (see Next.js auth
 * docs); each page and Server Action also calls requireAdmin/assertAdmin.
 *
 * `instant = false` opts these routes out of Cache Components' instant-navigation
 * validation: admin pages read session cookies and unpublished data, so they
 * are inherently dynamic. The public site keeps full PPR.
 */
export const instant = false;

export default async function AdminProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireAdmin();
  const email =
    typeof session.email === "string" ? session.email : null;

  return <AdminShell email={email}>{children}</AdminShell>;
}
