/**
 * Fallback for the `(protected)` group itself. Child segments have their own
 * boundaries — see `components/admin/Skeleton.tsx` for why.
 */
import { AdminListSkeleton } from "@/components/admin/Skeleton";

export default function AdminLoading() {
  return <AdminListSkeleton />;
}
