import BankIDSimulator from '@/components/BankIDSimulator';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getTranslation } from '@/lib/i18n';
import Link from 'next/link';

export default async function RegisterPage() {
  const cookieStore = await cookies();
  const lang = cookieStore.get('lang')?.value || 'sv';
  const t = getTranslation(lang);

  async function simulateEmailRegister() {
    'use server';
    const cookiesList = await cookies();
    cookiesList.set('session', 'client', { path: '/' });
    redirect('/profile');
  }

  return (
    <main className="flex-grow bg-slate-50 min-h-screen">
      <div className="container mx-auto px-4 py-12 lg:py-24 max-w-6xl">
        <div className="text-center mb-12 lg:mb-16">
          <h1 className="text-4xl lg:text-5xl font-bold text-morkbla-900 mb-4 tracking-tight">
            {lang === 'en' ? 'Create an account' : lang === 'da' ? 'Opret en konto' : 'Skapa ett konto'}
          </h1>
          <p className="text-slate-500 text-lg">
            {lang === 'en' ? 'Get started to book venues in Landskrona' : lang === 'da' ? 'Kom i gang med at booke lokaler i Landskrona' : 'Kom igång för att boka lokaler i Landskrona'}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-start">
          
          {/* Left Column: BankID (Fast Path) */}
          <div className="flex flex-col items-center">
            <div className="w-full max-w-md">
              <div className="mb-6 text-center lg:text-left">
                <span className="inline-block bg-ljusturkos-100 text-morkbla text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-3">
                  {lang === 'en' ? 'Fastest' : lang === 'da' ? 'Hurtigst' : 'Snabbast'}
                </span>
                <h2 className="text-2xl font-bold text-slate-800">
                  {lang === 'en' ? 'Register with BankID' : lang === 'da' ? 'Registrer med BankID' : 'Skapa konto med BankID'}
                </h2>
                <p className="text-slate-500 mt-2 text-sm">
                  {lang === 'en' ? 'No forms needed. We automatically fetch your verified details securely.' : lang === 'da' ? 'Ingen formular nødvendig. Vi henter automatisk dine verificerede oplysninger.' : 'Inga formulär behövs. Vi hämtar dina verifierade uppgifter automatiskt.'}
                </p>
              </div>
              <BankIDSimulator lang={lang} />
            </div>
          </div>

          {/* Vertical Divider for Desktop */}
          <div className="hidden lg:block absolute left-1/2 top-1/4 bottom-1/4 w-px bg-slate-200 -translate-x-1/2"></div>
          
          {/* Horizontal Divider for Mobile */}
          <div className="lg:hidden w-full h-px bg-slate-200 my-4 flex items-center justify-center">
            <span className="bg-slate-50 px-4 text-slate-400 font-bold text-sm uppercase tracking-widest">
              {lang === 'en' ? 'OR' : lang === 'da' ? 'ELLER' : 'ELLER'}
            </span>
          </div>

          {/* Right Column: Email/Password (Alternative Path) */}
          <div className="flex flex-col items-center lg:items-start w-full">
            <div className="w-full max-w-md lg:ml-auto">
              <div className="mb-8 text-center lg:text-left">
                <h2 className="text-2xl font-bold text-slate-800">
                  {lang === 'en' ? 'Register with Email' : lang === 'da' ? 'Opret med E-mail' : 'Skapa med E-post'}
                </h2>
                <p className="text-slate-500 mt-2 text-sm">
                  {lang === 'en' ? 'Standard account creation for users without BankID.' : lang === 'da' ? 'Standard kontooprettelse for brugere uden BankID.' : 'Klassisk kontoskapande för dig utan svenskt BankID.'}
                </p>
              </div>
              
              <div className="bg-white border border-slate-200 rounded-3xl shadow-lg p-8 md:p-10 w-full">
                <form className="space-y-5" action={simulateEmailRegister}>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1.5">
                        {lang === 'en' ? 'First name' : lang === 'da' ? 'Fornavn' : 'Förnamn'}
                      </label>
                      <input 
                        type="text" 
                        placeholder="Anna" 
                        required
                        className="w-full px-4 py-3.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-morkbla focus:border-morkbla outline-none transition-all text-slate-800"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1.5">
                        {lang === 'en' ? 'Last name' : lang === 'da' ? 'Efternavn' : 'Efternamn'}
                      </label>
                      <input 
                        type="text" 
                        placeholder="Andersson" 
                        required
                        className="w-full px-4 py-3.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-morkbla focus:border-morkbla outline-none transition-all text-slate-800"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1.5">
                      {lang === 'en' ? 'Email address' : lang === 'da' ? 'E-mailadresse' : 'E-postadress'}
                    </label>
                    <input 
                      type="email" 
                      placeholder="namn@exempel.se" 
                      required
                      className="w-full px-4 py-3.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-morkbla focus:border-morkbla outline-none transition-all text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1.5">
                      {lang === 'en' ? 'Password' : lang === 'da' ? 'Adgangskode' : 'Lösenord'}
                    </label>
                    <input 
                      type="password" 
                      placeholder="••••••••" 
                      required
                      className="w-full px-4 py-3.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-morkbla focus:border-morkbla outline-none transition-all text-slate-800"
                    />
                  </div>
                  
                  <div className="pt-4">
                    <button type="submit" className="w-full bg-slate-800 hover:bg-slate-900 text-white font-bold py-4 px-6 rounded-xl transition-all shadow-md">
                      {lang === 'en' ? 'Create Account' : lang === 'da' ? 'Opret Konto' : 'Skapa Konto'}
                    </button>
                  </div>
                </form>
                
                <div className="mt-8 pt-6 border-t border-slate-100 text-center">
                  <p className="text-sm text-slate-500 font-medium">
                    {lang === 'en' ? "Already have an account?" : lang === 'da' ? 'Har du allerede en konto?' : 'Har du redan ett konto?'}
                    <Link href="/login" className="ml-2 font-bold text-morkbla hover:underline">
                      {lang === 'en' ? 'Log in here' : lang === 'da' ? 'Log ind her' : 'Logga in här'}
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </main>
  );
}
