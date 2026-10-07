import BankIDSimulator from '@/components/BankIDSimulator';
import { cookies } from 'next/headers';
import { getTranslation } from '@/lib/i18n';
import Link from 'next/link';

export default async function LoginPage() {
  const cookieStore = await cookies();
  const lang = cookieStore.get('lang')?.value || 'sv';
  const t = getTranslation(lang);

  return (
    <main className="flex-grow bg-slate-50 min-h-screen">
      <div className="container mx-auto px-4 py-12 lg:py-24 max-w-6xl">
        <div className="text-center mb-12 lg:mb-16">
          <h1 className="text-4xl lg:text-5xl font-bold text-morkbla-900 mb-4 tracking-tight">
            {lang === 'en' ? 'Welcome back' : lang === 'da' ? 'Velkommen tilbage' : 'Välkommen tillbaka'}
          </h1>
          <p className="text-slate-500 text-lg">
            {lang === 'en' ? 'Choose how you want to log in to Landskrona Venues' : lang === 'da' ? 'Vælg hvordan du vil logge ind på Landskrona Lokaler' : 'Välj hur du vill logga in på Landskrona Lokaler'}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-start">
          
          {/* Left Column: BankID (Fast Path) */}
          <div className="flex flex-col items-center">
            <div className="w-full max-w-md">
              <div className="mb-6 text-center lg:text-left">
                <span className="inline-block bg-ljusturkos-100 text-morkbla text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-3">
                  {lang === 'en' ? 'Recommended' : lang === 'da' ? 'Anbefalet' : 'Rekommenderas'}
                </span>
                <h2 className="text-2xl font-bold text-slate-800">
                  {lang === 'en' ? 'Log in with BankID' : lang === 'da' ? 'Log ind med BankID' : 'Logga in med BankID'}
                </h2>
                <p className="text-slate-500 mt-2 text-sm">
                  {lang === 'en' ? 'Fast and secure for Swedish citizens and corporate signatories.' : lang === 'da' ? 'Hurtigt og sikkert for svenske borgere og tegningsberettigede.' : 'Snabbt och säkert för privatpersoner och firmatecknare.'}
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
                  {lang === 'en' ? 'Log in with Email' : lang === 'da' ? 'Log ind med E-mail' : 'Logga in med E-post'}
                </h2>
                <p className="text-slate-500 mt-2 text-sm">
                  {lang === 'en' ? 'For international users, guest speakers, or those without BankID.' : lang === 'da' ? 'For internationale brugere eller dem uden BankID.' : 'För internationella användare eller för dig som saknar BankID.'}
                </p>
              </div>
              
              <div className="bg-white border border-slate-200 rounded-3xl shadow-lg p-8 md:p-10 w-full">
                <form className="space-y-5" action={() => {}}>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1.5">
                      {lang === 'en' ? 'Email address' : lang === 'da' ? 'E-mailadresse' : 'E-postadress'}
                    </label>
                    <input 
                      type="email" 
                      placeholder="namn@exempel.se" 
                      className="w-full px-4 py-3.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-morkbla focus:border-morkbla outline-none transition-all text-slate-800"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-1.5">
                      <label className="block text-sm font-bold text-slate-700">
                        {lang === 'en' ? 'Password' : lang === 'da' ? 'Adgangskode' : 'Lösenord'}
                      </label>
                      <a href="#" className="text-xs font-bold text-morkbla hover:underline">
                        {lang === 'en' ? 'Forgot password?' : lang === 'da' ? 'Glemt adgangskode?' : 'Glömt lösenordet?'}
                      </a>
                    </div>
                    <input 
                      type="password" 
                      placeholder="••••••••" 
                      className="w-full px-4 py-3.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-morkbla focus:border-morkbla outline-none transition-all text-slate-800"
                    />
                  </div>
                  
                  <div className="pt-4">
                    <button type="button" className="w-full bg-slate-800 hover:bg-slate-900 text-white font-bold py-4 px-6 rounded-xl transition-all shadow-md">
                      {lang === 'en' ? 'Log In' : lang === 'da' ? 'Log ind' : 'Logga in'}
                    </button>
                  </div>
                </form>
                
                <div className="mt-8 pt-6 border-t border-slate-100 text-center">
                  <p className="text-sm text-slate-500 font-medium">
                    {lang === 'en' ? "Don't have an account?" : lang === 'da' ? 'Har du ikke en konto?' : 'Saknar du konto?'}
                    <Link href="/register" className="ml-2 font-bold text-morkbla hover:underline">
                      {lang === 'en' ? 'Create one here' : lang === 'da' ? 'Opret en her' : 'Skapa ett här'}
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
