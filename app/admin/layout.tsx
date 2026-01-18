import { requireAuth } from '@/lib/auth/helpers';
import { AdminLayout } from '@/components/admin/AdminLayout';

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAuth();

  return <AdminLayout>{children}</AdminLayout>;
}
