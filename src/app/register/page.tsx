import BankIDSimulator from '@/components/BankIDSimulator';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getTranslation } from '@/lib/i18n';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export default async function RegisterPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const resolvedSearchParams = await searchParams;
  const cookieStore = await cookies();
  const lang = cookieStore.get('lang')?.value || 'sv';
  const t = getTranslation(lang);

  async function handleRegister(formData: FormData) {
    'use server';
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const firstName = formData.get('first_name') as string;
    const lastName = formData.get('last_name') as string;
    
    // Check if exists
    const { data: existing } = await supabase.from('demo_users').select('*').eq('email', email).single();
    
    if (existing) {
      redirect('/register?error=exists');
    }

    const { error } = await supabase.from('demo_users').insert({
      email,
      password,
      first_name: firstName,
      last_name: lastName
    });

    if (error) {
      redirect('/register?error=failed');
    }

    const cookiesList = await cookies();
    cookiesList.set('session', 'client', { path: '/' });
    cookiesList.set('user_email', email, { path: '/' });
    cookiesList.set('user_name', firstName + ' ' + lastName, { path: '/' });
    redirect('/profile');
  }

  return (
    <div className="flex-grow relative flex flex-col bg-beige">
      <div className="absolute top-0 left-0 right-0 h-80 bg-morkbla-900 z-0 overflow-hidden">
        <img src="https://cms.landskrona.se/wp-content/uploads/2023/02/landskrona-stadsbibliotek-1536x1018-1.jpeg" alt="" className="w-full h-full object-cover opacity-10" />
        <div className="absolute inset-0 bg-gradient-to-b from-morkbla-900/50 to-beige"></div>
      </div>

      <main className="relative z-10 container mx-auto px-4 py-12 lg:py-16 max-w-5xl flex-grow flex flex-col justify-center">
        
        <div className="text-center mb-12">
          <span className="bg-white/10 border border-white/20 text-white text-xs font-bold px-4 py-1.5 rounded-full mb-6 inline-block backdrop-blur-md uppercase tracking-widest shadow-sm">
            {lang === 'en' ? 'Get Started' : lang === 'da' ? 'Kom I Gang' : 'Börja Här'}
          </span>
          <h1 className="text-4xl lg:text-5xl font-bold text-morkbla-900 drop-shadow-sm mb-4 tracking-tight">
            {lang === 'en' ? 'Create an account' : lang === 'da' ? 'Opret en konto' : 'Skapa ett konto'}
          </h1>
          <p className="text-slate-600/90 text-lg font-medium max-w-xl mx-auto">
            {lang === 'en' ? 'Get started to book venues in Landskrona' : lang === 'da' ? 'Kom i gang med at booke lokaler i Landskrona' : 'Kom igång för att boka lokaler i Landskrona'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-10 items-stretch relative">
          
          <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white border-2 border-beige-200 rounded-full items-center justify-center z-20 shadow-sm">
            <span className="text-xs font-bold text-slate-400">
              {lang === 'en' ? 'OR' : lang === 'da' ? 'EL' : 'ELLER'}
            </span>
          </div>

          <div className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-beige-200 overflow-hidden flex flex-col relative group">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-ljusturkos group-hover:bg-morkbla transition-colors"></div>
            <div className="p-8 md:p-10 flex-grow flex flex-col items-center">
              <div className="mb-6 text-center">
                <span className="inline-block bg-ljusturkos-50 text-morkbla-900 border border-ljusturkos-200 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-3">
                  {lang === 'en' ? 'Fastest' : lang === 'da' ? 'Hurtigst' : 'Snabbast'}
                </span>
                <h2 className="text-2xl font-bold text-slate-800">
                  {lang === 'en' ? 'Register with BankID' : lang === 'da' ? 'Registrer med BankID' : 'Skapa konto med BankID'}
                </h2>
                <p className="text-slate-500 mt-2 text-sm leading-relaxed">
                  {lang === 'en' ? 'No forms needed. We automatically fetch your verified details securely.' : lang === 'da' ? 'Ingen formular nødvendig. Vi henter automatisk dine verificerede oplysninger.' : 'Inga formulär behövs. Vi hämtar dina verifierade uppgifter automatiskt.'}
                </p>
              </div>
              <div className="w-full flex-grow flex flex-col justify-center">
                <BankIDSimulator lang={lang} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-beige-200 overflow-hidden flex flex-col relative group">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-slate-300 group-hover:bg-slate-400 transition-colors"></div>
            <div className="p-8 md:p-10 flex-grow flex flex-col">
              <div className="mb-8 text-center">
                <div className="inline-block h-6 mb-3"></div>
                <h2 className="text-2xl font-bold text-slate-800">
                  {lang === 'en' ? 'Register with Email' : lang === 'da' ? 'Opret med E-mail' : 'Skapa med E-post'}
                </h2>
                <p className="text-slate-500 mt-2 text-sm leading-relaxed">
                  {lang === 'en' ? 'Standard account creation for users without BankID.' : lang === 'da' ? 'Standard kontooprettelse for brugere uden BankID.' : 'Klassisk kontoskapande för dig utan svenskt BankID.'}
                </p>
              </div>
              
              <div className="w-full flex-grow flex flex-col justify-center">
                {resolvedSearchParams?.error === 'exists' && (
                  <div className="mb-4 p-3 bg-red-50 text-red-700 border border-red-200 rounded-lg text-sm font-bold text-center">
                    {lang === 'en' ? 'Account already exists.' : 'Ett konto med den e-postadressen finns redan.'}
                  </div>
                )}
                <form className="space-y-4" action={handleRegister}>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1.5">
                        {lang === 'en' ? 'First name' : lang === 'da' ? 'Fornavn' : 'Förnamn'}
                      </label>
                      <input type="text" name="first_name" placeholder="Anna" required className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-morkbla focus:border-morkbla outline-none transition-all text-slate-800 font-medium" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1.5">
                        {lang === 'en' ? 'Last name' : lang === 'da' ? 'Efternavn' : 'Efternamn'}
                      </label>
                      <input type="text" name="last_name" placeholder="Andersson" required className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-morkbla focus:border-morkbla outline-none transition-all text-slate-800 font-medium" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1.5">
                      {lang === 'en' ? 'Email address' : lang === 'da' ? 'E-mailadresse' : 'E-postadress'}
                    </label>
                    <input type="email" name="email" placeholder="namn@exempel.se" required className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-morkbla focus:border-morkbla outline-none transition-all text-slate-800 font-medium" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1.5">
                      {lang === 'en' ? 'Password' : lang === 'da' ? 'Adgangskode' : 'Lösenord'}
                    </label>
                    <input type="password" name="password" placeholder="••••••••" required className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-morkbla focus:border-morkbla outline-none transition-all text-slate-800 font-medium" />
                  </div>
                  
                  <div className="pt-5">
                    <button type="submit" className="w-full bg-slate-800 hover:bg-slate-900 text-white font-bold py-4 px-6 rounded-xl transition-all shadow-md active:scale-[0.98]">
                      {lang === 'en' ? 'Create Account' : lang === 'da' ? 'Opret Konto' : 'Skapa Konto'}
                    </button>
                  </div>
                </form>
                
                <div className="mt-8 pt-5 border-t border-slate-100 text-center">
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
      </main>
    </div>
  );
}
