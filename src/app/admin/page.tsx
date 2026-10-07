import AdminDashboard from '@/components/AdminDashboard';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const cookieStore = await cookies();
  const lang = cookieStore.get('lang')?.value || 'sv';

  return (
    <>
      <AdminDashboard lang={lang} />
    </>
  );
}
