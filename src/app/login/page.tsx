import BankIDSimulator from '@/components/BankIDSimulator';
import { cookies } from 'next/headers';

export default async function LoginPage() {
  const cookieStore = await cookies();
  const lang = cookieStore.get('lang')?.value || 'sv';

  return (
    <>
      <main className="flex-grow flex items-center justify-center p-4 py-16">
        <BankIDSimulator lang={lang} />
      </main>
    </>
  );
}
